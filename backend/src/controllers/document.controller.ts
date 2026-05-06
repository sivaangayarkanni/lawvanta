import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { getDatabase } from '../config/database';
import { analyzeDocument } from '../services/ai.service';
import { logger } from '../utils/logger';

function queryRows(sql: string, params: any[] = []): Record<string, any>[] {
  const db = getDatabase();
  const result = db.exec(sql, params);
  if (!result[0]) return [];
  const { columns, values } = result[0];
  return values.map(row => Object.fromEntries(columns.map((col, i) => [col, row[i]])));
}

// Extract text from uploaded file
async function extractText(filePath: string, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      const pdfParse = require('pdf-parse');
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return data.text || '';
    }
    if (mimeType === 'application/msword' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    }
    // Plain text
    if (mimeType.startsWith('text/')) {
      return fs.readFileSync(filePath, 'utf-8');
    }
    return '';
  } catch (err: any) {
    logger.warn('Text extraction failed:', err.message);
    return '';
  }
}

export async function uploadDocument(req: AuthRequest, res: Response) {
  const db = getDatabase();
  const userId = req.user!.id;

  if (!req.file) throw new AppError('No file uploaded', 400);

  const { caseId, title, type } = req.body;
  const docId = uuidv4();
  const fileUrl = `/uploads/${req.file.filename}`;

  // Save document record
  db.run(
    `INSERT INTO documents (id, case_id, title, type, file_url, file_size, mime_type, uploaded_by, uploaded_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [
      docId,
      caseId || null,
      title || req.file.originalname,
      type || 'OTHER',
      fileUrl,
      req.file.size,
      req.file.mimetype,
      userId
    ]
  );

  // Extract text and analyze asynchronously
  const filePath = req.file.path;
  const mimeType = req.file.mimetype;
  const fileName = req.file.originalname;

  // Run analysis in background (don't block response)
  setImmediate(async () => {
    try {
      const text = await extractText(filePath, mimeType);
      const analysis = await analyzeDocument(text || `Document: ${fileName}`, type || 'Legal Document', fileName);

      db.run(
        `UPDATE documents SET analysis = ? WHERE id = ?`,
        [JSON.stringify(analysis), docId]
      );
      logger.info(`Document ${docId} analyzed successfully`);
    } catch (err: any) {
      logger.error('Document analysis failed:', err.message);
    }
  });

  res.status(201).json({
    success: true,
    data: {
      id: docId,
      title: title || fileName,
      type: type || 'OTHER',
      fileUrl,
      fileSize: req.file.size,
      mimeType,
      uploadedAt: new Date(),
      status: 'analyzing'
    }
  });
}

export async function getDocuments(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const { caseId } = req.query;

  let sql = `SELECT d.*, u.name as uploader_name FROM documents d
             LEFT JOIN users u ON u.id = d.uploaded_by
             WHERE d.uploaded_by = ?`;
  const params: any[] = [userId];

  if (caseId) { sql += ' AND d.case_id = ?'; params.push(caseId); }
  sql += ' ORDER BY d.uploaded_at DESC LIMIT 50';

  const rows = queryRows(sql, params);

  res.json({
    success: true,
    data: rows.map(r => ({
      id: r.id,
      title: r.title,
      type: r.type,
      fileUrl: r.file_url,
      fileSize: r.file_size,
      mimeType: r.mime_type,
      caseId: r.case_id,
      uploadedAt: r.uploaded_at,
      uploaderName: r.uploader_name,
      hasAnalysis: !!r.analysis,
      analysis: r.analysis ? JSON.parse(r.analysis) : null
    }))
  });
}

export async function getDocumentAnalysis(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user!.id;

  const rows = queryRows(
    'SELECT * FROM documents WHERE id = ? AND uploaded_by = ?',
    [id, userId]
  );

  if (!rows.length) throw new AppError('Document not found', 404);
  const doc = rows[0];

  if (!doc.analysis) {
    // Try to re-analyze
    const filePath = path.join(process.cwd(), 'uploads', path.basename(doc.file_url as string));
    if (fs.existsSync(filePath)) {
      const text = await extractText(filePath, doc.mime_type as string);
      const analysis = await analyzeDocument(text || `Document: ${doc.title}`, doc.type as string, doc.title as string);
      const db = getDatabase();
      db.run('UPDATE documents SET analysis = ? WHERE id = ?', [JSON.stringify(analysis), id]);
      return res.json({ success: true, data: analysis });
    }
    throw new AppError('Analysis not yet available', 404);
  }

  res.json({ success: true, data: JSON.parse(doc.analysis as string) });
}

export async function reanalyzeDocument(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user!.id;

  const rows = queryRows('SELECT * FROM documents WHERE id = ? AND uploaded_by = ?', [id, userId]);
  if (!rows.length) throw new AppError('Document not found', 404);
  const doc = rows[0];

  const filePath = path.join(process.cwd(), 'uploads', path.basename(doc.file_url as string));
  let text = '';
  if (fs.existsSync(filePath)) {
    text = await extractText(filePath, doc.mime_type as string);
  }

  const analysis = await analyzeDocument(text || `Document: ${doc.title}`, doc.type as string, doc.title as string);
  const db = getDatabase();
  db.run('UPDATE documents SET analysis = ? WHERE id = ?', [JSON.stringify(analysis), id]);

  res.json({ success: true, data: analysis });
}
