// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me'
  },
  CASES: {
    LIST: '/cases',
    GET: '/cases/:id',
    CREATE: '/cases',
    UPDATE: '/cases/:id',
    DELETE: '/cases/:id',
    TIMELINE: '/cases/:id/timeline',
    DOCUMENTS: '/cases/:id/documents'
  },
  DOCUMENTS: {
    UPLOAD: '/documents/upload',
    ANALYZE: '/documents/:id/analyze',
    DOWNLOAD: '/documents/:id/download'
  },
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: '/chat/conversations/:id/messages',
    SEND: '/chat/conversations/:id/send'
  },
  ORDERS: {
    TEMPLATES: '/orders/templates',
    GENERATE: '/orders/generate'
  },
  ANALYTICS: '/analytics',
  NOTIFICATIONS: '/notifications'
};

// Legal Acts and Sections (Sample - expand as needed)
export const INDIAN_LEGAL_ACTS = {
  IPC: 'Indian Penal Code, 1860',
  CRPC: 'Code of Criminal Procedure, 1973',
  CPC: 'Code of Civil Procedure, 1908',
  EVIDENCE_ACT: 'Indian Evidence Act, 1872',
  CONSTITUTION: 'Constitution of India',
  NEGOTIABLE_INSTRUMENTS: 'Negotiable Instruments Act, 1881',
  COMPANIES_ACT: 'Companies Act, 2013',
  ARBITRATION: 'Arbitration and Conciliation Act, 1996'
};

// Common IPC Sections
export const COMMON_IPC_SECTIONS = [
  { section: '302', description: 'Punishment for murder' },
  { section: '304', description: 'Culpable homicide not amounting to murder' },
  { section: '307', description: 'Attempt to murder' },
  { section: '376', description: 'Punishment for rape' },
  { section: '420', description: 'Cheating and dishonestly inducing delivery of property' },
  { section: '498A', description: 'Cruelty by husband or relatives' },
  { section: '506', description: 'Criminal intimidation' }
];

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
];

// Court Hierarchy
export const COURT_TYPES = [
  'Supreme Court of India',
  'High Court',
  'District Court',
  'Sessions Court',
  'Magistrate Court',
  'Family Court',
  'Consumer Court',
  'Tribunal'
];

// Default Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File Upload Limits
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
];

// AI Configuration
export const AI_CONFIG = {
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.7,
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.3,
  PRESENCE_PENALTY: 0.3
};

// Agent Tone Descriptions
export const AGENT_TONES = {
  formal: 'Professional and strictly formal legal language',
  conversational: 'Friendly yet professional, easy to understand',
  concise: 'Brief and to-the-point responses'
};
