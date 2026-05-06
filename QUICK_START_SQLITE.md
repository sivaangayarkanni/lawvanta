# ⚡ Lawvanta - Ultra Quick Start (SQLite Version)

## 🎯 What You Need

1. **Node.js 18+** (check: `node --version`)
2. **OpenAI API Key** (get from: https://platform.openai.com/api-keys)
3. **5 minutes**

## 🚀 Setup Commands

```bash
# 1. Install everything
npm install && cd frontend && npm install && cd ../backend && npm install && cd ../shared && npm install && npm run build && cd ..

# 2. Configure backend
cd backend
cp .env.example .env
# Edit .env: Add OPENAI_API_KEY and JWT_SECRET

# 3. Add demo data (optional)
node src/scripts/seed.js

# 4. Start backend (keep this running)
npm run dev
```

Open new terminal:

```bash
# 5. Start frontend
cd frontend
npm run dev
```

## ✅ Done!

- Open: http://localhost:3000
- Login: `judge.sharma@court.gov.in` / `Demo@123`

## 🔑 Credentials Needed

### backend/.env

```env
# REQUIRED
OPENAI_API_KEY=sk-your-key-from-openai
JWT_SECRET=any-random-32-char-string

# OPTIONAL (defaults work fine)
PORT=5000
NODE_ENV=development
DATABASE_PATH=./data/lawvanta.db
CORS_ORIGIN=http://localhost:3000
```

## 🎭 Demo Accounts

All passwords: `Demo@123`

- Judge: `judge.sharma@court.gov.in`
- Lawyer: `adv.mehta@lawfirm.com`
- Clerk: `clerk.kumar@court.gov.in`
- Prosecutor: `pp.singh@gov.in`

## 🆘 Problems?

**"Cannot find module"**
```bash
cd backend && npm install
```

**"Invalid API key"**
- Get new key from https://platform.openai.com/api-keys
- Make sure it starts with `sk-`
- No spaces in .env file

**"Port in use"**
```bash
# Change PORT in backend/.env to 5001
# Update frontend/.env.local to match
```

**"Database error"**
```bash
rm backend/data/lawvanta.db
# Restart backend
```

## 📚 More Help

- [START_HERE.md](START_HERE.md) - Detailed start guide
- [CREDENTIALS_GUIDE.md](CREDENTIALS_GUIDE.md) - How to get API keys
- [SIMPLIFIED_SETUP.md](SIMPLIFIED_SETUP.md) - Full setup guide

## 💰 Cost

- **OpenAI:** $5 free credit, then ~$0.01 per chat
- **Everything else:** FREE

## ✨ What You Get

- ✅ 5 AI agents (Judge, Lawyer, Clerk, Prosecutor, Litigant)
- ✅ Real-time AI chat
- ✅ Document analysis
- ✅ Case management
- ✅ Beautiful UI with dark mode
- ✅ No Docker needed!

---

**Ready in 5 minutes! 🚀**
