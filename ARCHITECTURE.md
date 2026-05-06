# Lawvanta System Architecture

## Overview

Lawvanta is a modern, AI-powered court operating system built with a microservices-inspired architecture, designed for scalability, security, and maintainability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js 14 Frontend (React 18 + TypeScript)             │  │
│  │  - Server-Side Rendering (SSR)                           │  │
│  │  - Role-based Dashboards                                 │  │
│  │  - Real-time Chat Interface                              │  │
│  │  - Document Upload & Management                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/WSS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express.js API Server                                   │  │
│  │  - JWT Authentication                                    │  │
│  │  - Rate Limiting                                         │  │
│  │  - Request Validation                                    │  │
│  │  - CORS & Security Headers                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  Business Logic  │ │  AI Agent    │ │  WebSocket       │
│  Services        │ │  Layer       │ │  Service         │
│                  │ │              │ │                  │
│  - User Service  │ │  - LangChain │ │  - Real-time     │
│  - Case Service  │ │  - OpenAI    │ │    Chat          │
│  - Doc Service   │ │  - RAG       │ │  - Notifications │
│  - Auth Service  │ │  - Prompts   │ │  - Typing        │
└──────────────────┘ └──────────────┘ └──────────────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  PostgreSQL 15+  │ │  Redis 7+    │ │  Vector Store    │
│                  │ │              │ │                  │
│  - User Data     │ │  - Cache     │ │  - Pinecone/     │
│  - Cases         │ │  - Sessions  │ │    Qdrant        │
│  - Documents     │ │  - Queue     │ │  - Legal Corpus  │
│  - Chat History  │ │  - Pub/Sub   │ │  - Embeddings    │
│  - pgvector      │ │              │ │                  │
└──────────────────┘ └──────────────┘ └──────────────────┘
         │
         ▼
┌──────────────────┐
│  File Storage    │
│                  │
│  - AWS S3 /      │
│    MinIO         │
│  - Documents     │
│  - Evidence      │
└──────────────────┘
```

## Component Details

### 1. Frontend Layer (Next.js 14)

**Technology Stack:**
- Next.js 14 with App Router
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (State Management)
- React Query (Server State)
- Socket.io Client (WebSocket)

**Key Features:**
- Server-Side Rendering for SEO and performance
- Role-based routing and dashboards
- Real-time AI chat interface
- Document upload with drag-and-drop
- Responsive design (mobile-first)
- Dark mode support
- Multi-language support

**Pages:**
- `/` - Landing page
- `/login` - Authentication
- `/register` - User registration
- `/dashboard` - Role-specific dashboard
- `/dashboard/chat` - AI chat interface
- `/dashboard/cases` - Case management
- `/dashboard/documents` - Document management
- `/dashboard/analytics` - Analytics dashboard

### 2. Backend Layer (Express.js)

**Technology Stack:**
- Node.js 18+ with TypeScript
- Express.js (REST API)
- Socket.io (WebSocket)
- Passport.js (Authentication)
- Bull (Job Queue)
- Winston (Logging)

**API Structure:**
```
/api
├── /auth
│   ├── POST /login
│   ├── POST /register
│   ├── POST /logout
│   ├── POST /refresh
│   └── GET /me
├── /cases
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   └── DELETE /:id
├── /documents
│   ├── POST /upload
│   ├── POST /:id/analyze
│   └── GET /:id/download
├── /chat
│   ├── GET /conversations
│   ├── POST /conversations
│   ├── GET /conversations/:id
│   └── POST /conversations/:id/messages
├── /orders
│   ├── GET /templates
│   └── POST /generate
└── /analytics
    └── GET /
```

### 3. AI Agent Layer

**Components:**
- **LangChain**: Agent orchestration and workflow
- **OpenAI GPT-4**: Primary LLM for generation
- **RAG System**: Retrieval-Augmented Generation
- **Vector Store**: Pinecone/Qdrant for embeddings
- **Prompt Engineering**: Role-specific system prompts

**Agent Types:**
1. **JusticeAI** (Judges)
   - Case summarization
   - Precedent analysis
   - Order drafting
   - Bias detection

2. **AdvocateAI** (Lawyers)
   - Pleading drafting
   - Evidence analysis
   - Strategy simulation
   - Legal research

3. **ClerkAI** (Court Clerks)
   - Filing validation
   - Cause list generation
   - Notice automation
   - Record management

4. **ProsecutorAI** (Prosecutors)
   - Charge sheet drafting
   - Witness preparation
   - Case tracking

5. **CitizenAI** (Litigants)
   - Case status explanation
   - Document help
   - Procedure guidance

**RAG Pipeline:**
```
User Query
    ↓
Query Embedding (OpenAI)
    ↓
Vector Search (Pinecone)
    ↓
Retrieve Relevant Context
    ↓
Construct Prompt with Context
    ↓
LLM Generation (GPT-4)
    ↓
Response with Citations
```

### 4. Database Layer

**PostgreSQL Schema:**
- `users` - User accounts and preferences
- `cases` - Case information
- `case_parties` - Parties involved in cases
- `case_events` - Case timeline
- `documents` - Document metadata
- `conversations` - Chat conversations
- `chat_messages` - Chat message history
- `order_templates` - Order templates
- `notifications` - User notifications
- `audit_logs` - Audit trail
- `agent_memory` - AI personalization data
- `legal_corpus` - Legal knowledge base with embeddings

**Redis Usage:**
- Session storage
- API rate limiting
- Job queue (Bull)
- Real-time pub/sub
- Cache layer

### 5. Security Architecture

**Authentication & Authorization:**
- JWT-based authentication
- Role-based access control (RBAC)
- Refresh token rotation
- Password hashing (bcrypt)

**Data Security:**
- End-to-end encryption for documents
- TLS/SSL for all communications
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF tokens
- Rate limiting
- Input validation (Zod)

**Audit & Compliance:**
- Full audit logs for all actions
- User activity tracking
- Data retention policies
- GDPR/DPDP Act compliance-ready
- Data residency controls

### 6. Deployment Architecture

**Development:**
```
Docker Compose
├── PostgreSQL container
├── Redis container
├── Backend container
└── Frontend container
```

**Production (Kubernetes):**
```
Kubernetes Cluster
├── Ingress (NGINX)
├── Frontend Pods (3 replicas)
├── Backend Pods (5 replicas)
├── PostgreSQL (StatefulSet)
├── Redis (StatefulSet)
└── Worker Pods (Bull queue)
```

**Cloud Infrastructure:**
- **Compute**: AWS ECS / Azure AKS / GCP GKE
- **Database**: AWS RDS PostgreSQL / Azure Database
- **Cache**: AWS ElastiCache Redis
- **Storage**: AWS S3 / Azure Blob Storage
- **CDN**: CloudFront / Azure CDN
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## Data Flow Examples

### 1. User Login Flow
```
User → Frontend → POST /api/auth/login
                    ↓
                Backend validates credentials
                    ↓
                Generate JWT token
                    ↓
                Return token + user data
                    ↓
                Frontend stores in localStorage
                    ↓
                Redirect to dashboard
```

### 2. AI Chat Flow
```
User types message → Frontend
                        ↓
                    POST /api/chat/conversations/:id/messages
                        ↓
                    Backend receives message
                        ↓
                    Fetch conversation history
                        ↓
                    Query vector store (RAG)
                        ↓
                    Construct prompt with context
                        ↓
                    Call OpenAI API
                        ↓
                    Save response to database
                        ↓
                    Return to frontend
                        ↓
                    Display in chat UI
```

### 3. Document Analysis Flow
```
User uploads PDF → Frontend
                      ↓
                  POST /api/documents/upload
                      ↓
                  Backend receives file
                      ↓
                  Upload to S3
                      ↓
                  Extract text (pdf-parse)
                      ↓
                  Queue analysis job (Bull)
                      ↓
                  Worker processes job
                      ↓
                  Call AI analysis service
                      ↓
                  Save analysis to database
                      ↓
                  Notify user via WebSocket
```

## Scalability Considerations

1. **Horizontal Scaling**: Stateless backend allows easy horizontal scaling
2. **Caching**: Redis caching reduces database load
3. **CDN**: Static assets served via CDN
4. **Database Optimization**: Indexes, connection pooling, read replicas
5. **Queue System**: Async processing for heavy tasks
6. **Load Balancing**: NGINX/ALB for traffic distribution

## Performance Targets

- **API Response Time**: < 200ms (p95)
- **Page Load Time**: < 2s (First Contentful Paint)
- **AI Response Time**: < 5s for chat responses
- **Document Analysis**: < 30s for 50-page PDF
- **Concurrent Users**: 10,000+ simultaneous users
- **Database Queries**: < 50ms (p95)

## Monitoring & Observability

- **Metrics**: Prometheus + Grafana
- **Logging**: Winston + ELK Stack
- **Tracing**: OpenTelemetry
- **Alerts**: PagerDuty integration
- **Uptime**: 99.9% SLA target

## Future Enhancements

1. **Microservices**: Split into dedicated services (Auth, Cases, Documents, AI)
2. **Event Sourcing**: CQRS pattern for audit trail
3. **GraphQL**: Alternative to REST API
4. **Mobile Apps**: React Native iOS/Android apps
5. **Voice Interface**: Speech-to-text for courtroom dictation
6. **Blockchain**: Immutable audit trail for critical actions
7. **ML Models**: Custom fine-tuned models for Indian legal corpus
