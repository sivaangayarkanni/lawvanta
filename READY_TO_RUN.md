# ✅ Lawvanta - Ready to Run!

Your credentials are configured and you're ready to start!

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
setup.bat
```

This will:
- Install all dependencies
- Build shared package
- Create database
- Add demo data

### Option 2: Manual Setup

**Step 1: Install Dependencies**
```bash
# Root
npm install

# Shared
cd shared && npm install && npm run build && cd ..

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

**Step 2: Seed Database**
```bash
cd backend
node src/scripts/seed.js
cd ..
```

## ▶️ Start the Application

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

## 🌐 Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

## 🎭 Login

**Demo Accounts (all use password: Demo@123)**

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

## ✨ What to Try

1. **AI Chat** - Click "Chat with AI" and ask:
   - "Summarize my pending cases"
   - "Draft a bail order"
   - "Find precedents on IPC Section 302"

2. **Upload Document** - Go to Documents and upload a PDF

3. **View Cases** - Check the case management section

4. **Explore Dashboard** - See your role-specific interface

## 📊 Your Configuration

✅ **OpenAI API Key:** Configured  
✅ **JWT Secret:** Configured  
✅ **Database:** SQLite (auto-created)  
✅ **Cache:** In-memory  
✅ **Port:** 5000 (backend), 3000 (frontend)

## 🔧 Troubleshooting

**"Cannot find module"**
```bash
cd backend && npm install
cd ../frontend && npm install
```

**"Port already in use"**
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change port in backend/.env
PORT=5001
```

**"Database error"**
```bash
rm backend/data/lawvanta.db
cd backend
node src/scripts/seed.js
```

**Backend won't start**
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

## 💡 Tips

1. **Keep both terminals running** - Backend and frontend need to run simultaneously

2. **Check backend logs** - If AI isn't responding, check Terminal 1 for errors

3. **Refresh browser** - If UI looks broken, hard refresh (Ctrl+Shift+R)

4. **Monitor OpenAI usage** - Check https://platform.openai.com/usage

## 📚 Documentation

- [GETTING_STARTED.md](GETTING_STARTED.md) - User guide
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [SIMPLIFIED_SETUP.md](SIMPLIFIED_SETUP.md) - Detailed setup
- [CREDENTIALS_GUIDE.md](CREDENTIALS_GUIDE.md) - Credential management

## 🎉 You're All Set!

Everything is configured and ready to go. Just run the setup script or follow the manual steps above.

**Enjoy building with Lawvanta! ⚖️**

---

**Need help?** Check the troubleshooting section above or open an issue.
