const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

async function seed() {
  console.log('🌱 Seeding database...');

  const SQL = await initSqlJs();
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/lawvanta.db');
  const dbDir = path.dirname(dbPath);

  // Create data directory
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Load or create database
  let db;
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables first
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
    name TEXT NOT NULL, role TEXT NOT NULL, phone TEXT, bar_council_id TEXT,
    court_id TEXT, preferences TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY, case_number TEXT UNIQUE NOT NULL, case_type TEXT NOT NULL,
    status TEXT NOT NULL, title TEXT NOT NULL, description TEXT,
    filing_date DATE NOT NULL, next_hearing_date DATE, judge_id TEXT, court_id TEXT,
    metadata TEXT DEFAULT '{}', created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Hash password for demo accounts
  const hashedPassword = await bcrypt.hash('Demo@123', 12);

  // Demo users
  const users = [
    {
      id: uuidv4(),
      email: 'judge.sharma@court.gov.in',
      password: hashedPassword,
      name: 'Justice Rajesh Sharma',
      role: 'JUDGE',
      phone: '+91-9876543210',
      court_id: 'DLH-HC-001',
      preferences: JSON.stringify({
        language: 'en',
        theme: 'light',
        agentTone: 'formal',
        notificationsEnabled: true,
        voiceInputEnabled: true
      })
    },
    {
      id: uuidv4(),
      email: 'adv.mehta@lawfirm.com',
      password: hashedPassword,
      name: 'Adv. Priya Mehta',
      role: 'LAWYER',
      phone: '+91-9876543211',
      bar_council_id: 'BAR/DLH/2015/12345',
      preferences: JSON.stringify({
        language: 'en',
        theme: 'dark',
        agentTone: 'conversational',
        notificationsEnabled: true,
        voiceInputEnabled: false
      })
    },
    {
      id: uuidv4(),
      email: 'clerk.kumar@court.gov.in',
      password: hashedPassword,
      name: 'Ramesh Kumar',
      role: 'CLERK',
      phone: '+91-9876543212',
      court_id: 'DLH-DC-001',
      preferences: JSON.stringify({
        language: 'hi',
        theme: 'light',
        agentTone: 'concise',
        notificationsEnabled: true,
        voiceInputEnabled: false
      })
    },
    {
      id: uuidv4(),
      email: 'pp.singh@gov.in',
      password: hashedPassword,
      name: 'PP Vikram Singh',
      role: 'PROSECUTOR',
      phone: '+91-9876543213',
      court_id: 'DLH-SC-001',
      preferences: JSON.stringify({
        language: 'en',
        theme: 'light',
        agentTone: 'formal',
        notificationsEnabled: true,
        voiceInputEnabled: false
      })
    }
  ];

  users.forEach(user => {
    db.run(
      `INSERT INTO users (id, email, password, name, role, phone, bar_council_id, court_id, preferences)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.email, user.password, user.name, user.role, user.phone || null, user.bar_council_id || null, user.court_id || null, user.preferences]
    );
  });

  console.log(`✓ Created ${users.length} demo users`);

  // Demo cases
  const cases = [
    {
      id: uuidv4(),
      case_number: 'CS/2024/001',
      case_type: 'CIVIL',
      status: 'PENDING',
      title: 'Ram Kumar vs. State Bank of India',
      description: 'Civil suit for recovery of money and damages',
      filing_date: '2024-01-15',
      next_hearing_date: '2024-06-15',
      judge_id: users[0].id,
      court_id: 'DLH-DC-001',
      metadata: JSON.stringify({
        acts: ['CPC Section 9', 'Contract Act Section 73'],
        keywords: ['contract breach', 'damages', 'banking'],
        priority: 'MEDIUM',
        complexity: 'MODERATE'
      })
    },
    {
      id: uuidv4(),
      case_number: 'CR/2024/045',
      case_type: 'CRIMINAL',
      status: 'HEARING',
      title: 'State vs. Ajay Verma',
      description: 'Criminal case under IPC Section 420 (Cheating)',
      filing_date: '2024-02-20',
      next_hearing_date: '2024-05-20',
      judge_id: users[0].id,
      court_id: 'DLH-SC-001',
      metadata: JSON.stringify({
        acts: ['IPC Section 420', 'CrPC Section 313'],
        keywords: ['cheating', 'fraud', 'financial'],
        priority: 'HIGH',
        complexity: 'COMPLEX'
      })
    },
    {
      id: uuidv4(),
      case_number: 'WP/2024/123',
      case_type: 'WRIT',
      status: 'FILED',
      title: 'Sunita Devi vs. Municipal Corporation',
      description: 'Writ petition for enforcement of fundamental rights',
      filing_date: '2024-04-01',
      next_hearing_date: '2024-05-30',
      judge_id: users[0].id,
      court_id: 'DLH-HC-001',
      metadata: JSON.stringify({
        acts: ['Constitution Article 21', 'Constitution Article 226'],
        keywords: ['fundamental rights', 'public interest', 'municipal'],
        priority: 'URGENT',
        complexity: 'COMPLEX'
      })
    }
  ];

  cases.forEach(c => {
    db.run(
      `INSERT INTO cases (id, case_number, case_type, status, title, description, filing_date, next_hearing_date, judge_id, court_id, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.case_number, c.case_type, c.status, c.title, c.description, c.filing_date, c.next_hearing_date, c.judge_id, c.court_id, c.metadata]
    );
  });

  console.log(`✓ Created ${cases.length} demo cases`);

  // Save database
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);

  console.log('\n✅ Database seeded successfully!');
  console.log('\nDemo Accounts (all passwords: Demo@123):');
  console.log('- Judge: judge.sharma@court.gov.in');
  console.log('- Lawyer: adv.mehta@lawfirm.com');
  console.log('- Clerk: clerk.kumar@court.gov.in');
  console.log('- Prosecutor: pp.singh@gov.in');

  db.close();
}

seed().catch(console.error);
