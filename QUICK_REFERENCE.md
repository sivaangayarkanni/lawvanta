# Lawvanta Quick Reference Card

## 🚀 Quick Start

```bash
# Start with Docker
docker-compose up -d

# Access
http://localhost:3000

# Login
judge.sharma@court.gov.in / Judge@123
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `GETTING_STARTED.md` | Quick start guide |
| `SETUP.md` | Installation guide |
| `ARCHITECTURE.md` | System architecture |
| `API_DOCUMENTATION.md` | API reference |
| `DEPLOYMENT.md` | Production deployment |

## 🎯 AI Agents

| Role | Agent | Capabilities |
|------|-------|--------------|
| Judge | JusticeAI | Case summaries, orders, precedents |
| Lawyer | AdvocateAI | Pleadings, strategy, research |
| Clerk | ClerkAI | Filing, notices, scheduling |
| Prosecutor | ProsecutorAI | Charge sheets, witnesses |
| Litigant | CitizenAI | Case status, guidance |

## 🔑 Demo Accounts

```
Judge:     judge.sharma@court.gov.in / Judge@123
Lawyer:    adv.mehta@lawfirm.com / Lawyer@123
Clerk:     clerk.kumar@court.gov.in / Clerk@123
Prosecutor: pp.singh@gov.in / Prosecutor@123
```

## 🛠️ Common Commands

```bash
# Start all services
npm run dev

# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm run dev

# Build for production
npm run build

# Run tests
npm test

# Database setup
psql -U postgres -d lawvanta -f backend/scripts/schema.sql
psql -U postgres -d lawvanta -f backend/scripts/seed.sql

# Docker commands
docker-compose up -d        # Start
docker-compose down         # Stop
docker-compose logs -f      # View logs
docker-compose restart      # Restart
docker-compose ps           # Status
```

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/health |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## 📡 API Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

GET    /api/cases
POST   /api/cases
GET    /api/cases/:id

POST   /api/documents/upload
POST   /api/documents/:id/analyze

GET    /api/chat/conversations
POST   /api/chat/conversations
POST   /api/chat/conversations/:id/messages

GET    /api/orders/templates
POST   /api/orders/generate

GET    /api/analytics
```

## 🔐 Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
OPENAI_API_KEY=...
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Check backend is running at :5000 |
| AI not responding | Add OPENAI_API_KEY to backend/.env |
| Database error | Run schema.sql and seed.sql |
| Port in use | Change PORT in .env files |
| Docker issues | `docker-compose down -v && docker-compose up -d` |

## 📊 Project Structure

```
lawvanta/
├── frontend/          # Next.js app
│   └── app/          # Pages
├── backend/          # Express API
│   ├── src/          # Source code
│   └── scripts/      # DB scripts
├── shared/           # Shared types
└── docs/             # Documentation
```

## 🎨 Tech Stack

**Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS  
**Backend:** Express.js, TypeScript, Node.js 18+  
**Database:** PostgreSQL 15+, Redis 7+  
**AI:** OpenAI GPT-4, LangChain  
**DevOps:** Docker, Docker Compose

## 📞 Support

- 📧 support@lawvanta.com
- 💬 Discord: discord.gg/lawvanta
- 🐛 GitHub Issues
- 📚 docs.lawvanta.com

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Ctrl/Cmd + K` | Focus search |
| `Ctrl/Cmd + /` | Show shortcuts |

## 🎯 Sample AI Prompts

**For Judges:**
- "Summarize pending cases"
- "Draft bail order for Case CR/2024/045"
- "Find precedents on IPC Section 302"

**For Lawyers:**
- "Draft anticipatory bail petition"
- "Analyze evidence in my case"
- "Suggest arguments for Section 420"

**For Clerks:**
- "Generate today's cause list"
- "Create notice for Case CS/2024/001"
- "Check filing requirements"

## 📈 Performance Targets

- API Response: < 200ms
- Page Load: < 2s
- AI Response: < 5s
- Document Analysis: < 30s

## 🔒 Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure firewall
- [ ] Set up backups
- [ ] Enable audit logging
- [ ] Update dependencies

## 📦 Dependencies

**Frontend:**
- next, react, react-dom
- tailwindcss, lucide-react
- axios, socket.io-client
- zustand, @tanstack/react-query

**Backend:**
- express, socket.io
- pg, redis, ioredis
- jsonwebtoken, bcryptjs
- openai, langchain
- winston, dotenv

## 🚀 Deployment

**Docker:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Kubernetes:**
```bash
kubectl apply -f k8s/
```

**Cloud:**
- AWS: ECS/EKS + RDS + ElastiCache
- Azure: AKS + Azure Database + Azure Cache
- GCP: GKE + Cloud SQL + Memorystore

## 📝 Quick Tips

1. **Better AI responses:** Be specific and provide context
2. **Faster development:** Use hot reload (npm run dev)
3. **Debug issues:** Check logs (docker-compose logs -f)
4. **Test changes:** Use demo accounts
5. **Learn more:** Read ARCHITECTURE.md

---

**Version:** 1.0.0  
**Last Updated:** May 4, 2026

Made with ⚖️ in India
