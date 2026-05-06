# Lawvanta Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm 9+
- **PostgreSQL** 15+
- **Redis** 7+
- **Git**
- **Docker & Docker Compose** (optional, for containerized setup)

## Quick Start (Docker - Recommended)

The fastest way to get Lawvanta running is using Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/lawvanta.git
cd lawvanta

# 2. Start all services
docker-compose up -d

# 3. Wait for services to be healthy (about 30 seconds)
docker-compose ps

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# API Health: http://localhost:5000/health
```

That's it! The database will be automatically initialized with the schema and seed data.

### Demo Accounts

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

Prosecutor:
Email: pp.singh@gov.in
Password: Prosecutor@123
```

## Manual Setup (Without Docker)

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### Step 2: Set Up PostgreSQL

```bash
# Create database
createdb lawvanta

# Or using psql
psql -U postgres
CREATE DATABASE lawvanta;
\q

# Run schema
psql -U postgres -d lawvanta -f backend/scripts/schema.sql

# Run seed data (optional)
psql -U postgres -d lawvanta -f backend/scripts/seed.sql
```

### Step 3: Set Up Redis

```bash
# Start Redis (if not running)
redis-server

# Or on macOS with Homebrew
brew services start redis

# Or on Linux
sudo systemctl start redis
```

### Step 4: Configure Environment Variables

**Backend (.env):**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/lawvanta
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# AI Configuration (Required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Optional: Vector Store (for RAG)
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
PINECONE_INDEX=lawvanta-legal-corpus

# Optional: File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=lawvanta-documents

# Security
ENCRYPTION_KEY=your-32-character-encryption-key-here
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local):**

```bash
cd ../frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000
NEXT_PUBLIC_APP_NAME=Lawvanta
```

### Step 5: Build Shared Package

```bash
cd ../shared
npm run build
```

### Step 6: Start Development Servers

**Option A: Start all services together (from root):**

```bash
npm run dev
```

**Option B: Start services separately:**

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

### Step 7: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## Configuration

### AI Provider Setup

Lawvanta requires an AI provider for intelligent features. Currently supported:

#### OpenAI (Recommended)

1. Sign up at https://platform.openai.com
2. Create an API key
3. Add to `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_MODEL=gpt-4-turbo-preview
   ```

#### Anthropic Claude (Alternative)

1. Sign up at https://console.anthropic.com
2. Create an API key
3. Add to `backend/.env`:
   ```env
   ANTHROPIC_API_KEY=your-key-here
   ```
4. Update `backend/src/services/ai.service.ts` to use Claude

### Vector Store Setup (Optional - for RAG)

For advanced legal precedent search:

#### Pinecone

1. Sign up at https://www.pinecone.io
2. Create an index with dimension 1536 (OpenAI embeddings)
3. Add credentials to `backend/.env`

#### Qdrant (Self-hosted alternative)

```bash
docker run -p 6333:6333 qdrant/qdrant
```

### File Storage Setup (Optional)

#### AWS S3

1. Create S3 bucket in AWS Console
2. Create IAM user with S3 access
3. Add credentials to `backend/.env`

#### MinIO (Self-hosted alternative)

```bash
docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"
```

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Check connection
psql -U postgres -d lawvanta -c "SELECT 1"

# Reset database
dropdb lawvanta
createdb lawvanta
psql -U postgres -d lawvanta -f backend/scripts/schema.sql
```

### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env files
```

### Module Not Found Errors

```bash
# Clean install
rm -rf node_modules */node_modules
rm -rf package-lock.json */package-lock.json
npm run install:all
```

### TypeScript Build Errors

```bash
# Rebuild shared package
cd shared
npm run build

# Rebuild backend
cd ../backend
npm run build
```

## Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Database Migrations

```bash
# Create new migration
cd backend
npm run db:migrate

# Rollback migration
npm run db:rollback
```

### Code Formatting

```bash
# Format all code
npm run format

# Lint code
npm run lint
```

### Building for Production

```bash
# Build all packages
npm run build

# Build specific package
cd frontend
npm run build
```

## Production Deployment

### Environment Setup

1. Set `NODE_ENV=production` in backend
2. Use strong JWT secret (min 32 characters)
3. Enable HTTPS/TLS
4. Set up proper CORS origins
5. Configure production database
6. Set up Redis cluster
7. Configure CDN for static assets
8. Set up monitoring and logging

### Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl get services
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Implement data retention policies
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database encryption at rest
- [ ] Set up intrusion detection

## Performance Optimization

### Database

- Create appropriate indexes
- Use connection pooling
- Set up read replicas
- Enable query caching
- Regular VACUUM and ANALYZE

### Redis

- Configure maxmemory policy
- Use Redis Cluster for scale
- Enable persistence (AOF/RDB)

### Frontend

- Enable Next.js image optimization
- Use CDN for static assets
- Implement code splitting
- Enable compression (gzip/brotli)
- Use service workers for offline support

### Backend

- Enable response compression
- Implement caching strategies
- Use Bull for async jobs
- Optimize database queries
- Enable clustering (PM2)

## Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Database health
psql -U postgres -d lawvanta -c "SELECT 1"

# Redis health
redis-cli ping
```

### Logs

```bash
# Backend logs
tail -f backend/logs/combined.log

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Metrics

Access Prometheus metrics at:
- Backend: http://localhost:5000/metrics

## Support

For issues and questions:

- 📧 Email: support@lawvanta.com
- 📚 Documentation: https://docs.lawvanta.com
- 🐛 Bug Reports: https://github.com/yourusername/lawvanta/issues
- 💬 Community: https://discord.gg/lawvanta

## License

Proprietary - All rights reserved.
