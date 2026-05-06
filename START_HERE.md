# 🚀 START HERE - Lawvanta Quick Setup

## ⚡ Super Quick Start (3 Steps)

### 1. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up / Login
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### 2. Setup & Configure

```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ../shared && npm install && npm run build
cd ..

# Configure backend
cd backend
cp .env.example .env
```

Edit `backend/.env` and add:
```env
OPENAI_API_KEY=sk-your-key-here
JWT_SECRET=any-random-32-character-string-here
```

### 3. Start Application

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## ✅ Access & Login

- Open: http://localhost:3000
- Login: `judge.sharma@court.gov.in` / `Demo@123`

## 📚 Need More Help?

- **Detailed Setup:** [SIMPLIFIED_SETUP.md](SIMPLIFIED_SETUP.md)
- **Credentials Guide:** [CREDENTIALS_GUIDE.md](CREDENTIALS_GUIDE.md)
- **User Guide:** [GETTING_STARTED.md](GETTING_STARTED.md)
- **Full Docs:** [README.md](README.md)

## 🔑 What Credentials Do You Need?

### Required (2 items):

1. **OpenAI API Key** - Powers AI features
   - Get from: https://platform.openai.com/api-keys
   - Cost: $5 free credit, then ~$0.01 per chat
   - See: [CREDENTIALS_GUIDE.md](CREDENTIALS_GUIDE.md)

2. **JWT Secret** - Secures authentication
   - Generate: `openssl rand -base64 32`
   - Or use any 32+ character random string

### Optional (not needed to start):

- AWS S3 - Cloud file storage (default: local storage)
- Pinecone - Advanced search (default: basic search)

## 🎯 What You Get

- ✅ AI chat for 5 different roles
- ✅ Document analysis
- ✅ Case management
- ✅ Order generation
- ✅ Beautiful UI
- ✅ No Docker needed!

## 🆘 Troubleshooting

**"Cannot find module"**
```bash
cd backend && npm install
cd ../frontend && npm install
```

**"Invalid API key"**
- Check you copied the full OpenAI key
- Make sure it starts with `sk-`

**"Port already in use"**
- Change PORT in backend/.env
- Change PORT in frontend/.env.local

## 📞 Support

- 📧 support@lawvanta.com
- 💬 Discord: discord.gg/lawvanta
- 🐛 GitHub Issues

---

**Ready in 5 minutes! 🚀**
