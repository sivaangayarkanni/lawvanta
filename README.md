# Lawvanta

**Tagline:** *Your Personal AI Co-Pilot for Every Person in the Courtroom*

## Vision

Lawvanta transforms chaotic court processes into a smooth, guided, paper-light experience through highly personalized AI agents for judges, lawyers, court staff, and litigants. Built specifically for Indian courts with deep integration of e-Courts, CPC, CrPC, IPC, Evidence Act, and Supreme Court precedents.

## Core Features

### Personalized AI Agents
- **JusticeAI** (Judges): Case summaries, precedent analysis, order drafting, hearing preparation
- **AdvocateAI** (Lawyers): Pleading drafting, evidence organization, strategy simulation
- **ClerkAI** (Court Clerks): Filing validation, cause list generation, notice automation
- **ProsecutorAI** (Public Prosecutors): Charge sheet drafting, witness preparation
- **CitizenAI** (Litigants): Case status, document help, next-step guidance

### Key Capabilities
- 🤖 Real-time AI chat with persistent memory
- 📄 Document intelligence (auto-summarize, extract issues, suggest citations)
- 🎯 Smart case timeline with AI-suggested next actions
- 🎤 Voice input support
- 🌐 Multi-language support (English, Hindi, Tamil, and more)
- 🔒 End-to-end encryption & audit logs
- 📊 Analytics & productivity dashboards
- ⚡ Offline-first capability

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) with TypeScript
- **UI Library**: React 18 with Tailwind CSS
- **Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Rich Text**: Tiptap editor

### Backend
- **Runtime**: Node.js with Express.js
- **API**: RESTful + WebSocket (Socket.io for real-time)
- **Authentication**: JWT + Passport.js
- **File Processing**: Multer + pdf-parse + mammoth
- **Task Queue**: Bull (Redis-based)

### AI Layer
- **LLM Integration**: OpenAI GPT-4 / Anthropic Claude (configurable)
- **Vector Store**: Pinecone / Qdrant for RAG
- **Embeddings**: OpenAI text-embedding-3-large
- **Speech**: Whisper API (voice input)
- **Framework**: LangChain for agent orchestration

### Database
- **Primary DB**: PostgreSQL 15+ (with pgvector extension)
- **Cache**: Redis 7+
- **File Storage**: AWS S3 / MinIO (self-hosted option)
- **Search**: PostgreSQL Full-Text Search + Typesense

### DevOps & Deployment
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (optional for scale)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston + ELK Stack
- **Hosting**: AWS / Azure / Self-hosted (Indian data residency)

## Project Structure

```
lawvanta/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities & configs
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand stores
│   └── public/              # Static assets
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── agents/          # AI agent prompts & logic
│   │   ├── utils/           # Helper functions
│   │   └── config/          # Configuration
│   └── tests/               # Backend tests
├── shared/                  # Shared types & constants
├── docs/                    # Documentation
├── scripts/                 # Deployment & setup scripts
└── docker/                  # Docker configurations
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 15+
- Redis 7+
- OpenAI API key (or Anthropic Claude API key)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/lawvanta.git
cd lawvanta
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Set up environment variables**

Create `.env` files in both frontend and backend directories:

**Backend `.env`:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/lawvanta
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# AI Configuration
OPENAI_API_KEY=your-openai-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
PINECONE_INDEX=lawvanta-legal-corpus

# File Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET=lawvanta-documents

# Security
ENCRYPTION_KEY=your-32-character-encryption-key
CORS_ORIGIN=http://localhost:3000
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000
NEXT_PUBLIC_APP_NAME=Lawvanta
```

4. **Set up the database**
```bash
cd backend
npm run db:migrate
npm run db:seed  # Optional: seed with sample data
```

5. **Start the development servers**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

### Default Demo Accounts

```
Judge:
Email: judge.sharma@court.gov.in
Password: Judge@123

Lawyer:
Email: adv.mehta@lawfirm.com
Password: Lawyer@123

Clerk:
Email: clerk.kumar@court.gov.in
Password: Clerk@123
```

## Demo Flow

1. **Login** with one of the demo accounts
2. **Explore Dashboard** - See role-specific interface
3. **Chat with AI Agent** - Ask questions like:
   - "Summarize pending cases"
   - "Draft a bail order for Case #123"
   - "Find precedents on Section 302 IPC"
4. **Upload Document** - Upload a case file PDF and watch AI analyze it
5. **Generate Order** - Use one-click order generation
6. **View Analytics** - Check productivity dashboard

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  Next.js App (Role-based Dashboards + AI Chat Interface)   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS/WSS
┌─────────────────────▼───────────────────────────────────────┐
│                      API Gateway Layer                       │
│         Express.js (Auth, Rate Limiting, Routing)           │
└─────────┬───────────────────────────────┬───────────────────┘
          │                               │
┌─────────▼──────────┐         ┌─────────▼──────────┐
│  Business Logic    │         │   AI Agent Layer   │
│  Services          │◄────────┤   (LangChain)      │
│  (Case, User, Doc) │         │   Role-specific    │
└─────────┬──────────┘         │   Prompts + RAG    │
          │                    └─────────┬──────────┘
          │                              │
┌─────────▼──────────┐         ┌─────────▼──────────┐
│   PostgreSQL       │         │  Vector Store      │
│   (Primary Data)   │         │  (Pinecone/Qdrant) │
│   + pgvector       │         │  Legal Corpus      │
└────────────────────┘         └────────────────────┘
          │
┌─────────▼──────────┐
│   Redis Cache      │
│   + Bull Queue     │
└────────────────────┘
```

### Data Flow for AI Chat

1. User sends message → Frontend
2. Frontend → Backend API (authenticated)
3. Backend retrieves user context + conversation history
4. Backend queries vector store for relevant legal knowledge (RAG)
5. Backend constructs role-specific prompt with context
6. Backend calls LLM API (OpenAI/Claude)
7. LLM response → Backend processes & stores in DB
8. Backend → Frontend (real-time via WebSocket)
9. Frontend displays response with sources

## Security & Compliance

- ✅ End-to-end encryption for documents
- ✅ Full audit logs for all actions
- ✅ Role-based access control (RBAC)
- ✅ Data residency in India (configurable)
- ✅ DPDP Act compliance-ready
- ✅ Regular security audits
- ✅ No data sharing with third parties
- ✅ Secure API key management

## Roadmap

### Phase 1: MVP (Current)
- ✅ Core authentication & role management
- ✅ AI chat interface with memory
- ✅ Document upload & basic analysis
- ✅ Role-specific dashboards
- ✅ Basic case management

### Phase 2: Enhanced AI (Q2 2026)
- 🔄 Advanced precedent search with citation network
- 🔄 Multi-document comparison & analysis
- 🔄 Voice-to-text for courtroom dictation
- 🔄 Regional language support (Hindi, Tamil, Telugu, Bengali)
- 🔄 AI-powered cause list optimization

### Phase 3: Workflow Automation (Q3 2026)
- 📋 One-click order generation (50+ templates)
- 📋 Automated notice & summons generation
- 📋 Smart scheduling & conflict detection
- 📋 E-filing integration with e-Courts
- 📋 Digital signature integration

### Phase 4: Advanced Analytics (Q4 2026)
- 📊 Predictive case outcome modeling
- 📊 Workload balancing algorithms
- 📊 Court performance benchmarking
- 📊 Litigant behavior analysis
- 📊 Resource optimization recommendations

### Phase 5: Ecosystem Integration (2027)
- 🔗 Integration with NJDG (National Judicial Data Grid)
- 🔗 Integration with e-Courts Services
- 🔗 Bar Council integration
- 🔗 Law school partnerships
- 🔗 Mobile apps (iOS + Android)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Proprietary - All rights reserved. Contact for licensing inquiries.

## Support

- 📧 Email: support@lawvanta.com
- 📞 Phone: +91-XXXX-XXXXXX
- 🌐 Website: https://lawvanta.com
- 📚 Documentation: https://docs.lawvanta.com

## Acknowledgments

Built with respect for the Indian judicial system and in consultation with legal experts, judges, and court administrators.

---

**Made with ⚖️ in India**
