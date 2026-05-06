// User Roles
export enum UserRole {
  JUDGE = 'JUDGE',
  LAWYER = 'LAWYER',
  CLERK = 'CLERK',
  PROSECUTOR = 'PROSECUTOR',
  LITIGANT = 'LITIGANT',
  ADMIN = 'ADMIN'
}

// Case Status
export enum CaseStatus {
  FILED = 'FILED',
  PENDING = 'PENDING',
  HEARING = 'HEARING',
  JUDGMENT_RESERVED = 'JUDGMENT_RESERVED',
  DISPOSED = 'DISPOSED',
  CLOSED = 'CLOSED'
}

// Case Types
export enum CaseType {
  CIVIL = 'CIVIL',
  CRIMINAL = 'CRIMINAL',
  FAMILY = 'FAMILY',
  COMMERCIAL = 'COMMERCIAL',
  CONSTITUTIONAL = 'CONSTITUTIONAL',
  WRIT = 'WRIT',
  APPEAL = 'APPEAL',
  REVISION = 'REVISION'
}

// Document Types
export enum DocumentType {
  PLAINT = 'PLAINT',
  WRITTEN_STATEMENT = 'WRITTEN_STATEMENT',
  AFFIDAVIT = 'AFFIDAVIT',
  PETITION = 'PETITION',
  ORDER = 'ORDER',
  JUDGMENT = 'JUDGMENT',
  EVIDENCE = 'EVIDENCE',
  NOTICE = 'NOTICE',
  SUMMONS = 'SUMMONS',
  VAKALATNAMA = 'VAKALATNAMA',
  OTHER = 'OTHER'
}

// AI Agent Types
export enum AgentType {
  JUSTICE_AI = 'JUSTICE_AI',
  ADVOCATE_AI = 'ADVOCATE_AI',
  CLERK_AI = 'CLERK_AI',
  PROSECUTOR_AI = 'PROSECUTOR_AI',
  CITIZEN_AI = 'CITIZEN_AI'
}

// Message Role
export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM'
}

// User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  barCouncilId?: string; // For lawyers
  courtId?: string; // For judges and clerks
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  agentTone: 'formal' | 'conversational' | 'concise';
  notificationsEnabled: boolean;
  voiceInputEnabled: boolean;
}

// Case Interface
export interface Case {
  id: string;
  caseNumber: string;
  caseType: CaseType;
  status: CaseStatus;
  title: string;
  description: string;
  filingDate: Date;
  nextHearingDate?: Date;
  judgeId: string;
  courtId: string;
  parties: CaseParty[];
  documents: Document[];
  timeline: CaseEvent[];
  metadata: CaseMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseParty {
  id: string;
  name: string;
  type: 'PETITIONER' | 'RESPONDENT' | 'ACCUSED' | 'COMPLAINANT';
  lawyerId?: string;
  contactInfo?: string;
}

export interface CaseEvent {
  id: string;
  caseId: string;
  eventType: string;
  description: string;
  date: Date;
  createdBy: string;
  metadata?: Record<string, any>;
}

export interface CaseMetadata {
  acts: string[]; // e.g., ["IPC Section 302", "CrPC Section 313"]
  keywords: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedDuration?: number; // in minutes
  complexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
}

// Document Interface
export interface Document {
  id: string;
  caseId: string;
  title: string;
  type: DocumentType;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  analysis?: DocumentAnalysis;
  metadata?: Record<string, any>;
}

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  suggestedCitations: string[];
  extractedEntities: {
    persons: string[];
    dates: string[];
    locations: string[];
    laws: string[];
  };
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  confidence: number;
}

// AI Chat Interface
export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: {
    sources?: string[];
    confidence?: number;
    suggestedActions?: string[];
  };
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  agentType: AgentType;
  title: string;
  messages: ChatMessage[];
  context?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// AI Agent Memory
export interface AgentMemory {
  userId: string;
  agentType: AgentType;
  shortTermMemory: Record<string, any>; // Current session context
  longTermMemory: {
    preferences: Record<string, any>;
    frequentQueries: string[];
    learnings: string[];
  };
  lastUpdated: Date;
}

// Order Template
export interface OrderTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  variables: string[];
  applicableFor: CaseType[];
  createdBy: string;
  isPublic: boolean;
}

// Analytics
export interface UserAnalytics {
  userId: string;
  period: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  metrics: {
    casesHandled: number;
    ordersGenerated: number;
    documentsProcessed: number;
    aiInteractions: number;
    averageResponseTime: number; // in minutes
    disposalRate?: number; // for judges
  };
  trends: {
    caseTypes: Record<CaseType, number>;
    busyHours: number[];
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: Date;
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}
