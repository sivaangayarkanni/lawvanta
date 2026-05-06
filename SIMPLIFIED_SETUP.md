# Lawvanta - Simplified Setup (No Docker Required!)

This guide will help you set up Lawvanta without Docker, using SQLite instead of PostgreSQL.

## 📋 Prerequisites

- **Node.js 18+** and npm
- **OpenAI API Key** (required for AI features)

That's it! No Docker, PostgreSQL, or Redis needed.

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Dependencies

```bash
# Install all dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ../shared && npm install && npm run build
cd ..
```

### Step 2: Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your credentials:

```env
# REQUIRED: OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# REQUIRED: JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Optional: Change if needed
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Configure Frontend

```bash
cd ../frontend
cp .env.local.example .env.local
```

The default values should work:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

### Step 4: Initialize Database

```bash
cd ../backend

# The database will be created automatically when you start the server
# To add demo data, run:
node src/scripts/seed.js
```

### Step 5: Start the Application

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## ✅ Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

## 🎭 Demo Accounts

All demo accounts use the password: **Demo@123**

```
Judge:
Email: judge.sharma@court.gov.in
Password: Demo@123

Lawyer:
Email: adv.mehta@lawfirm.com
Password: Demo@123

Clerk:
Email: clerk.kumar@court.gov.in
Password: Demo@123

Prosecutor:
Email: pp.singh@gov.in
Password: Demo@123
```

## 🔑 Required Credentials

### 1. OpenAI API Key (REQUIRED)

**What it's for:** Powers the AI agents (JusticeAI, AdvocateAI, etc.)

**How to get it:**

1. Go to https://platform.openai.com/signup
2. Create an account (or login)
3. Go to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Add to `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

**Cost:** Pay-as-you-go pricing
- GPT-4 Turbo: ~$0.01 per 1K tokens (very affordable for testing)
- You get $5 free credit for new accounts
- Set usage limits in your OpenAI dashboard

**Alternative:** You can use GPT-3.5-turbo (cheaper) by changing in `backend/.env`:
```env
OPENAI_MODEL=gpt-3.5-turbo
```

### 2. JWT Secret (REQUIRED)

**What it's for:** Secures user authentication tokens

**How to generate:**

Option 1 - Random string:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Option 2 - Use any random 32+ character string:
```
my-super-secret-jwt-key-12345678901234567890
```

Add to `backend/.env`:
```env
JWT_SECRET=your-generated-secret-here
```

## 📁 Project Structure

```
lawvanta/
├── backend/
│   ├── data/
│   │   └── lawvanta.db          # SQLite database (auto-created)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts      # SQLite configuration
│   │   └── scripts/
│   │       └── seed.js          # Demo data
│   └── .env                     # Your credentials
├── frontend/
│   └── .env.local               # Frontend config
└── shared/
```

## 🔧 Troubleshooting

### "Cannot find module 'better-sqlite3'"

```bash
cd backend
npm install better-sqlite3
```

### "OPENAI_API_KEY is not set"

1. Make sure you created `backend/.env`
2. Add your OpenAI API key
3. Restart the backend server

### "Port 3000 already in use"

Change the port in `frontend/.env.local`:
```env
PORT=3001
```

### "Port 5000 already in use"

Change the port in `backend/.env`:
```env
PORT=5001
```

And update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_WS_URL=ws://localhost:5001
```

### Database errors

Delete and recreate:
```bash
rm backend/data/lawvanta.db
# Restart backend - database will be recreated
# Run seed script again
node backend/src/scripts/seed.js
```

## 💡 What's Different from Docker Version?

| Feature | Docker Version | Simplified Version |
|---------|---------------|-------------------|
| Database | PostgreSQL | SQLite |
| Cache | Redis | In-memory |
| Setup | `docker-compose up` | `npm run dev` |
| Dependencies | Docker only | Node.js only |
| Data persistence | Docker volumes | Local files |
| Production ready | ✅ Yes | ⚠️ Development only |

## 🎯 Next Steps

1. **Login** at http://localhost:3000
2. **Try the AI chat** - Ask questions to your AI agent
3. **Upload a document** - Test document analysis
4. **Explore features** - Check out cases, analytics, etc.

## 📚 Additional Resources

- [GETTING_STARTED.md](GETTING_STARTED.md) - User guide
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture

## 🆘 Need Help?

- Check [GETTING_STARTED.md](GETTING_STARTED.md) troubleshooting section
- Open an issue on GitHub
- Email: support@lawvanta.com

## ⚠️ Important Notes

1. **SQLite is for development only** - For production, use PostgreSQL (Docker version)
2. **OpenAI API costs money** - Monitor your usage at https://platform.openai.com/usage
3. **Keep your .env files private** - Never commit them to Git
4. **Change JWT_SECRET in production** - Use a strong, unique secret

## 🎉 You're Ready!

Your Lawvanta instance is now running with:
- ✅ SQLite database (no Docker needed)
- ✅ AI-powered chat
- ✅ Document analysis
- ✅ Case management
- ✅ All core features

**Happy coding! ⚖️**
