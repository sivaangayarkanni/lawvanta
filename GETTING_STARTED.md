# Getting Started with Lawvanta

Welcome to Lawvanta! This guide will help you get up and running quickly.

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- Docker Desktop installed
- 8GB RAM minimum
- 10GB free disk space

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lawvanta.git
   cd lawvanta
   ```

2. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

3. **Wait for services** (about 30 seconds)
   ```bash
   docker-compose ps
   ```

4. **Open your browser**
   - Go to http://localhost:3000
   - Login with demo account:
     - Email: `judge.sharma@court.gov.in`
     - Password: `Judge@123`

5. **Start chatting with AI!**

That's it! You're ready to explore Lawvanta.

## 📚 What to Try First

### 1. Explore the Dashboard

After logging in, you'll see your role-specific dashboard with:
- Quick action cards
- Recent activity
- Quick stats
- AI chat preview

### 2. Chat with Your AI Agent

Click "Chat with AI" and try these prompts:

**For Judges (JusticeAI):**
- "Summarize my pending cases"
- "Draft a bail order for Case CR/2024/045"
- "Find precedents on IPC Section 302"
- "What are the key issues in Case CS/2024/001?"

**For Lawyers (AdvocateAI):**
- "Draft a petition for anticipatory bail"
- "Analyze the evidence in my case"
- "Suggest arguments for Section 420 IPC"
- "Prepare cross-examination questions"

**For Clerks (ClerkAI):**
- "Generate today's cause list"
- "Create a notice for Case CS/2024/001"
- "Check filing requirements for a civil suit"
- "Schedule hearings for next week"

### 3. Upload a Document

1. Go to Documents section
2. Upload a PDF or DOCX file
3. Watch AI analyze it automatically
4. Get summary, key points, and citations

### 4. Explore Cases

1. Go to Cases section
2. View case details
3. See timeline and documents
4. Track hearing dates

### 5. Check Analytics

1. Go to Analytics section
2. View your productivity metrics
3. See case distribution
4. Track performance trends

## 🎯 Understanding Roles

### Judge (JusticeAI)

**What you can do:**
- Get case summaries
- Find relevant precedents
- Draft orders and judgments
- Prepare for hearings
- Analyze legal arguments
- Flag potential biases

**Best for:**
- Case preparation
- Legal research
- Order drafting
- Workload management

### Lawyer (AdvocateAI)

**What you can do:**
- Draft pleadings and petitions
- Organize evidence
- Develop case strategy
- Research case laws
- Prepare arguments
- Generate client updates

**Best for:**
- Legal drafting
- Case preparation
- Strategy planning
- Client communication

### Court Clerk (ClerkAI)

**What you can do:**
- Validate filings
- Generate cause lists
- Create notices and summons
- Manage records
- Schedule hearings
- Track case status

**Best for:**
- Administrative tasks
- Document management
- Scheduling
- Record keeping

### Public Prosecutor (ProsecutorAI)

**What you can do:**
- Draft charge sheets
- Prepare witnesses
- Analyze evidence
- Research criminal law
- Track cases
- Prepare arguments

**Best for:**
- Criminal prosecution
- Evidence analysis
- Witness preparation
- Case tracking

### Litigant (CitizenAI)

**What you can do:**
- Check case status
- Get document help
- Understand procedures
- Track hearing dates
- Get next-step guidance
- Access legal information

**Best for:**
- Case tracking
- Understanding procedures
- Document preparation
- Legal information

## 💡 Tips & Tricks

### Getting Better AI Responses

1. **Be specific**: Instead of "Tell me about my case", try "Summarize the key issues in Case CS/2024/001"

2. **Provide context**: "I'm preparing for a bail hearing tomorrow. What precedents support bail in Section 420 cases?"

3. **Ask follow-ups**: The AI remembers your conversation, so you can ask follow-up questions

4. **Request formats**: "Draft a bail order in proper legal format" or "Give me a bullet-point summary"

### Keyboard Shortcuts

- `Enter`: Send message
- `Shift + Enter`: New line in message
- `Ctrl/Cmd + K`: Focus search
- `Ctrl/Cmd + /`: Show shortcuts

### Customizing Your Experience

1. Click your profile icon
2. Go to Settings
3. Customize:
   - Language preference
   - Theme (light/dark)
   - AI tone (formal/conversational/concise)
   - Notifications
   - Voice input

## 🔧 Troubleshooting

### Can't login?

- Check you're using the correct demo credentials
- Clear browser cache and cookies
- Try a different browser
- Check if backend is running: http://localhost:5000/health

### AI not responding?

- Check your OpenAI API key in backend/.env
- Verify internet connection
- Check backend logs: `docker-compose logs backend`

### Page not loading?

- Check if all services are running: `docker-compose ps`
- Restart services: `docker-compose restart`
- Check browser console for errors

### Database errors?

- Reset database:
  ```bash
  docker-compose down -v
  docker-compose up -d
  ```

## 📖 Learning Resources

### Documentation

- [README.md](README.md) - Project overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [SETUP.md](SETUP.md) - Detailed setup guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment

### Video Tutorials (Coming Soon)

- Getting Started with Lawvanta
- AI Chat Best Practices
- Document Analysis Tutorial
- Case Management Walkthrough
- Advanced Features

### Community

- 💬 Discord: https://discord.gg/lawvanta
- 📧 Email: support@lawvanta.com
- 🐛 Issues: https://github.com/yourusername/lawvanta/issues

## 🎓 Advanced Usage

### Custom Order Templates

1. Go to Orders section
2. Click "Create Template"
3. Add variables with [VARIABLE_NAME]
4. Save and use in order generation

### Bulk Operations

- Upload multiple documents at once
- Generate multiple notices
- Schedule multiple hearings

### Integration with e-Courts

(Coming soon)
- Import cases from e-Courts
- Sync hearing dates
- Export orders

### Voice Input

1. Enable in Settings
2. Click microphone icon in chat
3. Speak your query
4. AI transcribes and responds

### Multi-Language

1. Go to Settings
2. Select language (Hindi, Tamil, etc.)
3. Interface and AI responses adapt

## 🚀 Next Steps

### For Developers

1. Read [ARCHITECTURE.md](ARCHITECTURE.md)
2. Explore the codebase
3. Check [CONTRIBUTING.md](CONTRIBUTING.md)
4. Join our Discord

### For Users

1. Complete the tutorial
2. Try different AI prompts
3. Upload sample documents
4. Explore all features
5. Provide feedback

### For Administrators

1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Set up production environment
3. Configure monitoring
4. Set up backups

## 📞 Need Help?

### Support Channels

- 📧 Email: support@lawvanta.com
- 💬 Discord: https://discord.gg/lawvanta
- 📞 Phone: +91-XXXX-XXXXXX (Business hours)
- 🌐 Website: https://lawvanta.com

### Response Times

- Critical issues: < 1 hour
- High priority: < 4 hours
- Normal: < 24 hours
- Feature requests: < 1 week

## 🎉 Welcome to Lawvanta!

We're excited to have you here. Lawvanta is designed to make your legal work easier, faster, and more accurate. If you have any questions or feedback, please don't hesitate to reach out.

**Happy exploring!** ⚖️

---

Made with ⚖️ in India
