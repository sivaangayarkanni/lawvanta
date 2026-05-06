# Lawvanta Credentials Guide

## 🔑 Required Credentials

### 1. OpenAI API Key (REQUIRED)

**Purpose:** Powers all AI features (chat, document analysis, order generation)

**How to Get:**

1. **Sign up for OpenAI:**
   - Go to: https://platform.openai.com/signup
   - Create account with email or Google/Microsoft

2. **Verify your account:**
   - Check your email for verification link
   - Complete phone verification

3. **Add payment method:**
   - Go to: https://platform.openai.com/account/billing
   - Add credit card (required even for free tier)
   - Set usage limits to control costs

4. **Create API key:**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Give it a name (e.g., "Lawvanta Development")
   - Copy the key (starts with `sk-`)
   - **Save it immediately** - you can't see it again!

5. **Add to Lawvanta:**
   ```bash
   # Edit backend/.env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

**Cost Information:**
- **Free tier:** $5 credit for new accounts (expires after 3 months)
- **GPT-4 Turbo:** ~$0.01 per 1,000 tokens (~750 words)
- **GPT-3.5 Turbo:** ~$0.002 per 1,000 tokens (5x cheaper)
- **Typical chat:** 100-500 tokens = $0.001-$0.005 per message

**Cost Control:**
- Set monthly budget limit in OpenAI dashboard
- Use GPT-3.5-turbo for development (change `OPENAI_MODEL` in .env)
- Monitor usage: https://platform.openai.com/usage

**Troubleshooting:**
- "Invalid API key" → Check you copied the full key
- "Insufficient quota" → Add payment method or check usage limits
- "Rate limit exceeded" → Wait a minute or upgrade plan

---

### 2. JWT Secret (REQUIRED)

**Purpose:** Secures user authentication tokens

**How to Generate:**

**Option 1 - Command Line (Recommended):**

Linux/Mac:
```bash
openssl rand -base64 32
```

Windows PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Option 2 - Online Generator:**
- Go to: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" (256-bit)

**Option 3 - Manual:**
- Create any random string with 32+ characters
- Mix letters, numbers, and symbols
- Example: `my-super-secret-jwt-key-2024-lawvanta-prod-xyz123`

**Add to Lawvanta:**
```bash
# Edit backend/.env
JWT_SECRET=your-generated-secret-here
```

**Security Tips:**
- Use different secrets for dev/staging/production
- Never commit to Git
- Change if compromised
- Minimum 32 characters

---

## 🔓 Optional Credentials

### 3. AWS S3 (Optional - for file storage)

**Purpose:** Store uploaded documents in cloud (alternative to local storage)

**Default:** Files stored locally in `backend/uploads/`

**How to Get:**

1. **Create AWS account:**
   - Go to: https://aws.amazon.com/
   - Sign up (requires credit card)

2. **Create S3 bucket:**
   - Go to S3 console
   - Click "Create bucket"
   - Name: `lawvanta-documents-yourname`
   - Region: `ap-south-1` (Mumbai)
   - Keep default settings

3. **Create IAM user:**
   - Go to IAM console
   - Create user with S3 access
   - Save Access Key ID and Secret Access Key

4. **Add to Lawvanta:**
   ```bash
   # Edit backend/.env
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET=lawvanta-documents-yourname
   ```

**Cost:** ~$0.023 per GB/month (very cheap)

---

### 4. Pinecone (Optional - for advanced legal search)

**Purpose:** Vector database for semantic search of legal precedents

**Default:** Basic search works without this

**How to Get:**

1. **Sign up:**
   - Go to: https://www.pinecone.io/
   - Create free account

2. **Create index:**
   - Name: `lawvanta-legal-corpus`
   - Dimensions: `1536` (for OpenAI embeddings)
   - Metric: `cosine`

3. **Get API key:**
   - Go to API Keys section
   - Copy your API key

4. **Add to Lawvanta:**
   ```bash
   # Edit backend/.env
   PINECONE_API_KEY=your-pinecone-key
   PINECONE_ENVIRONMENT=your-environment
   PINECONE_INDEX=lawvanta-legal-corpus
   ```

**Cost:** Free tier includes 1M vectors

---

## 📝 Complete .env File Example

```env
# ============================================
# REQUIRED CREDENTIALS
# ============================================

# OpenAI API Key (REQUIRED)
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# JWT Secret (REQUIRED)
# Generate with: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# ============================================
# BASIC CONFIGURATION
# ============================================

NODE_ENV=development
PORT=5000
DATABASE_PATH=./data/lawvanta.db
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info

# ============================================
# OPTIONAL CREDENTIALS
# ============================================

# AWS S3 (Optional - for cloud file storage)
# AWS_ACCESS_KEY_ID=your-aws-access-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret-key
# AWS_REGION=ap-south-1
# AWS_S3_BUCKET=lawvanta-documents

# Pinecone (Optional - for advanced search)
# PINECONE_API_KEY=your-pinecone-key
# PINECONE_ENVIRONMENT=your-environment
# PINECONE_INDEX=lawvanta-legal-corpus
```

---

## ✅ Verification Checklist

After adding credentials, verify they work:

### 1. Check OpenAI API Key

```bash
cd backend
node -e "
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
openai.models.list().then(() => console.log('✅ OpenAI API key works!')).catch(e => console.log('❌ Error:', e.message));
"
```

### 2. Check JWT Secret

```bash
# Should be 32+ characters
echo $JWT_SECRET | wc -c
```

### 3. Test Application

```bash
# Start backend
cd backend
npm run dev

# In another terminal, test health endpoint
curl http://localhost:5000/health
```

---

## 🔒 Security Best Practices

1. **Never commit credentials to Git**
   - `.env` files are in `.gitignore`
   - Double-check before committing

2. **Use different credentials for each environment**
   - Development: `.env`
   - Staging: `.env.staging`
   - Production: `.env.production`

3. **Rotate credentials regularly**
   - Change JWT secret every 6 months
   - Rotate API keys annually

4. **Set usage limits**
   - OpenAI: Set monthly budget
   - AWS: Set billing alerts

5. **Monitor usage**
   - Check OpenAI usage dashboard weekly
   - Review AWS bills monthly

---

## 🆘 Troubleshooting

### "Cannot find OpenAI API key"

1. Check `.env` file exists in `backend/` folder
2. Check key starts with `sk-`
3. No spaces around `=` sign
4. Restart backend server after changing .env

### "Invalid API key"

1. Copy key again from OpenAI dashboard
2. Check for extra spaces or newlines
3. Verify account is active and has payment method

### "Rate limit exceeded"

1. Wait 60 seconds and try again
2. Check usage at https://platform.openai.com/usage
3. Upgrade to paid tier if needed

### "JWT secret too short"

1. Generate new secret with 32+ characters
2. Use command line generator
3. Restart backend server

---

## 💰 Cost Estimation

### Development (Testing)
- **OpenAI:** $1-5/month (with free tier)
- **AWS S3:** $0 (free tier)
- **Pinecone:** $0 (free tier)
- **Total:** ~$1-5/month

### Small Production (100 users)
- **OpenAI:** $20-50/month
- **AWS S3:** $5-10/month
- **Pinecone:** $0-70/month
- **Total:** ~$25-130/month

### Medium Production (1000 users)
- **OpenAI:** $200-500/month
- **AWS S3:** $20-50/month
- **Pinecone:** $70/month
- **Total:** ~$290-620/month

---

## 📞 Support

Need help with credentials?

- 📧 Email: support@lawvanta.com
- 💬 Discord: https://discord.gg/lawvanta
- 📚 Docs: https://docs.lawvanta.com

---

**Last Updated:** May 4, 2026  
**Version:** 1.0.0
