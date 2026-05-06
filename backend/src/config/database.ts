import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

let db: SqlJsDatabase;
let SQL: any;

export async function initializeDatabase(): Promise<SqlJsDatabase> {
  if (db) {
    return db;
  }

  const dbPath = process.env.DATABASE_PATH || './data/lawvanta.db';
  const dbDir = path.dirname(dbPath);

  // Create data directory if it doesn't exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Initialize SQL.js
  SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    logger.info(`SQLite database loaded from ${dbPath}`);
  } else {
    db = new SQL.Database();
    logger.info(`New SQLite database created at ${dbPath}`);
  }

  // Create tables
  createTables();

  // Save database periodically
  setInterval(() => {
    saveDatabase();
  }, 5000); // Save every 5 seconds

  return db;
}

export function getDatabase(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    saveDatabase();
    db.close();
    logger.info('Database connection closed');
  }
}

function saveDatabase() {
  if (!db) return;
  
  const dbPath = process.env.DATABASE_PATH || './data/lawvanta.db';
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function createTables() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('JUDGE', 'LAWYER', 'CLERK', 'PROSECUTOR', 'LITIGANT', 'ADMIN')),
      phone TEXT,
      bar_council_id TEXT,
      court_id TEXT,
      preferences TEXT DEFAULT '{"language": "en", "theme": "light", "agentTone": "conversational", "notificationsEnabled": true, "voiceInputEnabled": false}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Cases table
  db.run(`
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      case_number TEXT UNIQUE NOT NULL,
      case_type TEXT NOT NULL CHECK (case_type IN ('CIVIL', 'CRIMINAL', 'FAMILY', 'COMMERCIAL', 'CONSTITUTIONAL', 'WRIT', 'APPEAL', 'REVISION')),
      status TEXT NOT NULL CHECK (status IN ('FILED', 'PENDING', 'HEARING', 'JUDGMENT_RESERVED', 'DISPOSED', 'CLOSED')),
      title TEXT NOT NULL,
      description TEXT,
      filing_date DATE NOT NULL,
      next_hearing_date DATE,
      judge_id TEXT REFERENCES users(id),
      court_id TEXT,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Case parties table
  db.run(`
    CREATE TABLE IF NOT EXISTS case_parties (
      id TEXT PRIMARY KEY,
      case_id TEXT REFERENCES cases(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('PETITIONER', 'RESPONDENT', 'ACCUSED', 'COMPLAINANT')),
      lawyer_id TEXT REFERENCES users(id),
      contact_info TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Documents table
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      case_id TEXT REFERENCES cases(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('PLAINT', 'WRITTEN_STATEMENT', 'AFFIDAVIT', 'PETITION', 'ORDER', 'JUDGMENT', 'EVIDENCE', 'NOTICE', 'SUMMONS', 'VAKALATNAMA', 'OTHER')),
      file_url TEXT NOT NULL,
      file_size INTEGER,
      mime_type TEXT,
      uploaded_by TEXT REFERENCES users(id),
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      analysis TEXT,
      metadata TEXT DEFAULT '{}'
    )
  `);

  // Case events table
  db.run(`
    CREATE TABLE IF NOT EXISTS case_events (
      id TEXT PRIMARY KEY,
      case_id TEXT REFERENCES cases(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      description TEXT NOT NULL,
      event_date DATETIME NOT NULL,
      created_by TEXT REFERENCES users(id),
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Conversations table
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      agent_type TEXT NOT NULL CHECK (agent_type IN ('JUSTICE_AI', 'ADVOCATE_AI', 'CLERK_AI', 'PROSECUTOR_AI', 'CITIZEN_AI')),
      title TEXT NOT NULL,
      context TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Chat messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('USER', 'ASSISTANT', 'SYSTEM')),
      content TEXT NOT NULL,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Order templates table
  db.run(`
    CREATE TABLE IF NOT EXISTS order_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      template TEXT NOT NULL,
      variables TEXT DEFAULT '[]',
      applicable_for TEXT DEFAULT '[]',
      created_by TEXT REFERENCES users(id),
      is_public INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('INFO', 'WARNING', 'ERROR', 'SUCCESS')),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      action_url TEXT,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Audit logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      resource_id TEXT,
      changes TEXT,
      ip_address TEXT,
      user_agent TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Agent memory table
  db.run(`
    CREATE TABLE IF NOT EXISTS agent_memory (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      agent_type TEXT NOT NULL,
      short_term_memory TEXT DEFAULT '{}',
      long_term_memory TEXT DEFAULT '{}',
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, agent_type)
    )
  `);

  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_cases_case_number ON cases(case_number)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_cases_judge_id ON cases(judge_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)`);

  saveDatabase();
  logger.info('Database tables created successfully');
}
