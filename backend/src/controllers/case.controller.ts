import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { getDatabase } from '../config/database';

function queryRows(sql: string, params: any[] = []): Record<string, any>[] {
  const db = getDatabase();
  const result = db.exec(sql, params);
  if (!result[0]) return [];
  const { columns, values } = result[0];
  return values.map(row => Object.fromEntries(columns.map((col, i) => [col, row[i]])));
}

export async function getCases(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const role = req.user!.role;
  const { status, type, search, page = '1', pageSize = '20' } = req.query;

  let sql = `SELECT c.*, u.name as judge_name FROM cases c
             LEFT JOIN users u ON u.id = c.judge_id WHERE 1=1`;
  const params: any[] = [];

  // Role-based filtering
  if (role === 'JUDGE') {
    sql += ' AND c.judge_id = ?'; params.push(userId);
  } else if (role === 'LAWYER') {
    sql += ` AND c.id IN (SELECT case_id FROM case_parties WHERE lawyer_id = ?)`; params.push(userId);
  } else if (role === 'CLERK') {
    // Clerks see all cases in their court
  }

  if (status && status !== 'ALL') { sql += ' AND c.status = ?'; params.push(status); }
  if (type && type !== 'ALL') { sql += ' AND c.case_type = ?'; params.push(type); }
  if (search) {
    sql += ' AND (c.title LIKE ? OR c.case_number LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY c.updated_at DESC';

  const rows = queryRows(sql, params);

  res.json({
    success: true,
    data: rows.map(r => ({
      id: r.id,
      caseNumber: r.case_number,
      caseType: r.case_type,
      status: r.status,
      title: r.title,
      description: r.description,
      filingDate: r.filing_date,
      nextHearingDate: r.next_hearing_date,
      judgeId: r.judge_id,
      judgeName: r.judge_name,
      courtId: r.court_id,
      metadata: r.metadata ? JSON.parse(r.metadata) : {},
      createdAt: r.created_at,
      updatedAt: r.updated_at
    })),
    total: rows.length
  });
}

export async function getCaseById(req: AuthRequest, res: Response) {
  const { id } = req.params;

  const caseRows = queryRows('SELECT * FROM cases WHERE id = ?', [id]);
  if (!caseRows.length) throw new AppError('Case not found', 404);

  const parties = queryRows(
    `SELECT cp.*, u.name as lawyer_name FROM case_parties cp
     LEFT JOIN users u ON u.id = cp.lawyer_id WHERE cp.case_id = ?`, [id]
  );
  const events = queryRows(
    'SELECT * FROM case_events WHERE case_id = ? ORDER BY event_date DESC', [id]
  );
  const documents = queryRows(
    'SELECT id, title, type, file_url, uploaded_at FROM documents WHERE case_id = ?', [id]
  );

  const c = caseRows[0];
  res.json({
    success: true,
    data: {
      id: c.id,
      caseNumber: c.case_number,
      caseType: c.case_type,
      status: c.status,
      title: c.title,
      description: c.description,
      filingDate: c.filing_date,
      nextHearingDate: c.next_hearing_date,
      judgeId: c.judge_id,
      courtId: c.court_id,
      metadata: c.metadata ? JSON.parse(c.metadata) : {},
      parties: parties.map(p => ({
        id: p.id, name: p.name, type: p.type,
        lawyerId: p.lawyer_id, lawyerName: p.lawyer_name
      })),
      timeline: events.map(e => ({
        id: e.id, eventType: e.event_type,
        description: e.description, date: e.event_date
      })),
      documents: documents.map(d => ({
        id: d.id, title: d.title, type: d.type,
        fileUrl: d.file_url, uploadedAt: d.uploaded_at
      })),
      createdAt: c.created_at,
      updatedAt: c.updated_at
    }
  });
}

export async function createCase(req: AuthRequest, res: Response) {
  const db = getDatabase();
  const userId = req.user!.id;
  const {
    caseNumber, caseType, title, description,
    filingDate, nextHearingDate, courtId, parties = [],
    priority = 'MEDIUM', complexity = 'MODERATE', acts = []
  } = req.body;

  if (!caseNumber || !caseType || !title) {
    throw new AppError('caseNumber, caseType, and title are required', 400);
  }

  // Check duplicate case number
  const existing = queryRows('SELECT id FROM cases WHERE case_number = ?', [caseNumber]);
  if (existing.length) throw new AppError('Case number already exists', 409);

  const caseId = uuidv4();
  const metadata = JSON.stringify({ acts, priority, complexity, keywords: [] });

  db.run(
    `INSERT INTO cases (id, case_number, case_type, status, title, description,
      filing_date, next_hearing_date, judge_id, court_id, metadata, created_at, updated_at)
     VALUES (?, ?, ?, 'FILED', ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [
      caseId, caseNumber, caseType, title,
      description || null,
      filingDate || new Date().toISOString().split('T')[0],
      nextHearingDate || null,
      req.user!.role === 'JUDGE' ? userId : null,
      courtId || null,
      metadata
    ]
  );

  // Add parties
  for (const party of parties) {
    if (party.name && party.type) {
      db.run(
        `INSERT INTO case_parties (id, case_id, name, type, lawyer_id, contact_info)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), caseId, party.name, party.type, party.lawyerId || null, party.contactInfo || null]
      );
    }
  }

  // Add filing event
  db.run(
    `INSERT INTO case_events (id, case_id, event_type, description, event_date, created_by)
     VALUES (?, ?, 'FILING', 'Case filed', datetime('now'), ?)`,
    [uuidv4(), caseId, userId]
  );

  res.status(201).json({
    success: true,
    data: { id: caseId, caseNumber, caseType, status: 'FILED', title, message: 'Case created successfully' }
  });
}

export async function updateCase(req: AuthRequest, res: Response) {
  const db = getDatabase();
  const { id } = req.params;
  const { status, nextHearingDate, description } = req.body;

  const rows = queryRows('SELECT id FROM cases WHERE id = ?', [id]);
  if (!rows.length) throw new AppError('Case not found', 404);

  const updates: string[] = [];
  const params: any[] = [];

  if (status) { updates.push('status = ?'); params.push(status); }
  if (nextHearingDate) { updates.push('next_hearing_date = ?'); params.push(nextHearingDate); }
  if (description) { updates.push('description = ?'); params.push(description); }
  updates.push("updated_at = datetime('now')");

  if (updates.length > 1) {
    db.run(`UPDATE cases SET ${updates.join(', ')} WHERE id = ?`, [...params, id]);
  }

  res.json({ success: true, data: { id, message: 'Case updated' } });
}

export async function deleteCase(req: AuthRequest, res: Response) {
  const db = getDatabase();
  const { id } = req.params;

  const rows = queryRows('SELECT id FROM cases WHERE id = ?', [id]);
  if (!rows.length) throw new AppError('Case not found', 404);

  db.run('DELETE FROM case_events WHERE case_id = ?', [id]);
  db.run('DELETE FROM case_parties WHERE case_id = ?', [id]);
  db.run('DELETE FROM documents WHERE case_id = ?', [id]);
  db.run('DELETE FROM cases WHERE id = ?', [id]);

  res.json({ success: true, data: { message: 'Case deleted' } });
}
