import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { AgentType, ChatMessage, MessageRole } from '@lawvanta/shared';
import { getAgentPrompt } from '../agents/prompts';
import { logger } from '../utils/logger';

// ── Lazy clients ──────────────────────────────────────────────────────────────
let _groq: Groq | null = null;
let _openai: OpenAI | null = null;

function getGroq(): Groq {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

// ── Groq models in priority order (all free, ultra-fast) ─────────────────────
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',   // Best quality
  'llama-3.1-70b-versatile',   // Fallback
  'llama3-70b-8192',           // Older but reliable
  'mixtral-8x7b-32768',        // Good for long context
  'llama3-8b-8192',            // Fastest, smallest
];

export interface ChatCompletionOptions {
  agentType: AgentType;
  userTone?: 'formal' | 'conversational' | 'concise';
  conversationHistory?: ChatMessage[];
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

// ── Main chat completion ──────────────────────────────────────────────────────
export async function generateChatCompletion(
  userMessage: string,
  options: ChatCompletionOptions
): Promise<{ content: string; metadata: any }> {
  const {
    agentType,
    userTone = 'conversational',
    conversationHistory = [],
    context,
    maxTokens = 2048,
    temperature = 0.7
  } = options;

  const systemPrompt = getAgentPrompt(agentType, userTone, context);

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt }
  ];

  // Last 10 messages for context
  for (const msg of conversationHistory.slice(-10)) {
    messages.push({
      role: msg.role === MessageRole.USER ? 'user' : 'assistant',
      content: msg.content
    });
  }
  messages.push({ role: 'user', content: userMessage });

  // ── Try Groq first (primary) ──────────────────────────────────────────────
  if (process.env.GROQ_API_KEY) {
    const groqModel = process.env.GROQ_MODEL || GROQ_MODELS[0];
    const modelsToTry = [groqModel, ...GROQ_MODELS.filter(m => m !== groqModel)];

    for (const model of modelsToTry) {
      try {
        logger.info(`[Groq] Trying model: ${model}`);
        const completion = await getGroq().chat.completions.create({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          top_p: 0.9,
          stream: false
        });

        const content = completion.choices[0].message.content || '';
        logger.info(`[Groq] ✅ Response with ${model} (${completion.usage?.total_tokens} tokens)`);

        return {
          content,
          metadata: {
            provider: 'groq',
            model,
            usage: completion.usage,
            finishReason: completion.choices[0].finish_reason
          }
        };
      } catch (err: any) {
        logger.warn(`[Groq] Model ${model} failed: ${err.message}`);
        // Model not found → try next
        if (err.message?.includes('does not exist') || err.message?.includes('model_not_found') || err.status === 404) {
          continue;
        }
        // Rate limit → try next model
        if (err.status === 429) {
          continue;
        }
        // Auth error → stop trying Groq
        if (err.status === 401) {
          logger.error('[Groq] Invalid API key');
          break;
        }
        // Other errors → try next
        continue;
      }
    }
  }

  // ── Try OpenAI as fallback ────────────────────────────────────────────────
  if (process.env.OPENAI_API_KEY) {
    const openaiModels = [
      process.env.OPENAI_MODEL || 'gpt-4o-mini',
      'gpt-4o-mini',
      'gpt-3.5-turbo'
    ].filter((m, i, a) => a.indexOf(m) === i);

    for (const model of openaiModels) {
      try {
        logger.info(`[OpenAI] Trying model: ${model}`);
        const completion = await getOpenAI().chat.completions.create({
          model,
          messages,
          max_tokens: maxTokens,
          temperature
        });

        const content = completion.choices[0].message.content || '';
        logger.info(`[OpenAI] ✅ Response with ${model}`);

        return {
          content,
          metadata: {
            provider: 'openai',
            model,
            usage: completion.usage,
            finishReason: completion.choices[0].finish_reason
          }
        };
      } catch (err: any) {
        logger.warn(`[OpenAI] Model ${model} failed: ${err.message}`);
        if (err.status === 429 || err.message?.includes('quota')) continue;
        if (err.message?.includes('does not exist')) continue;
        break;
      }
    }
  }

  // ── Knowledge-base fallback (always works) ────────────────────────────────
  logger.warn('All AI providers failed — using knowledge-base fallback');
  return buildFallbackResponse(userMessage, agentType);
}

// ── Document analysis ─────────────────────────────────────────────────────────
export async function analyzeDocument(
  documentText: string,
  documentType: string,
  fileName: string
): Promise<any> {
  const prompt = `You are an expert Indian legal document analyst. Analyze this ${documentType} and return ONLY valid JSON with these exact keys:
{
  "summary": "2-3 sentence summary",
  "keyPoints": ["point1","point2","point3","point4","point5"],
  "suggestedCitations": ["IPC Section X — description"],
  "extractedEntities": {"persons":[],"dates":[],"locations":[],"laws":[]},
  "documentType": "${documentType}",
  "legalIssues": ["issue1","issue2"],
  "recommendations": ["rec1","rec2"]
}

Document (${fileName}):
${documentText.substring(0, 6000)}`;

  // Try Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const completion = await getGroq().chat.completions.create({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an expert Indian legal document analyst. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      });
      const parsed = JSON.parse(completion.choices[0].message.content || '{}');
      return { ...parsed, confidence: 0.93, analyzedBy: 'groq-llama-3.3-70b' };
    } catch (err: any) {
      logger.warn('[Groq] Document analysis failed:', err.message);
    }
  }

  // Try OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const completion = await getOpenAI().chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 1500
      });
      const parsed = JSON.parse(completion.choices[0].message.content || '{}');
      return { ...parsed, confidence: 0.91, analyzedBy: 'openai-gpt-4o-mini' };
    } catch (err: any) {
      logger.warn('[OpenAI] Document analysis failed:', err.message);
    }
  }

  // Local fallback
  return localDocumentAnalysis(documentText, documentType, fileName);
}

// ── Order draft ───────────────────────────────────────────────────────────────
export async function generateOrderDraft(orderType: string, caseDetails: any): Promise<string> {
  const prompt = `Draft a formal Indian court ${orderType} for Case ${caseDetails.caseNumber || 'N/A'} (${caseDetails.caseType || 'Civil'}). Use proper Indian legal format with correct citations and judicial language.`;

  if (process.env.GROQ_API_KEY) {
    try {
      const completion = await getGroq().chat.completions.create({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an expert Indian court order drafter. Use proper legal format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 1500
      });
      return completion.choices[0].message.content || '';
    } catch { }
  }

  return `IN THE COURT OF [COURT NAME]\n\nCase No: ${caseDetails.caseNumber || 'N/A'}\n\nORDER\n\nHaving heard the parties and perused the record:\n\n[Order content]\n\nDated: ${new Date().toLocaleDateString('en-IN')}\n\n[Judge's Signature]`;
}

// ── Intelligent fallback responses ────────────────────────────────────────────
function buildFallbackResponse(userMessage: string, agentType: AgentType): { content: string; metadata: any } {
  const msg = userMessage.toLowerCase();
  let content = '';

  if (msg.includes('bail') || msg.includes('437') || msg.includes('438') || msg.includes('439')) {
    content = `## Bail under Indian Law

**Regular Bail — Section 437 CrPC / Section 480 BNSS**

Key grounds courts consider:
1. **Nature & gravity of accusation** — Bailable vs non-bailable offences
2. **Antecedents of the accused** — Prior criminal record
3. **Possibility of fleeing justice** — Community roots, family ties
4. **Likelihood of repeating the offence**
5. **Safety of the community**

**Key Supreme Court Precedents:**

1. **Sanjay Chandra v. CBI** (2012) 1 SCC 40
   - *"Bail is the rule, jail is the exception"*
   - Personal liberty under Article 21 must be respected

2. **Arnesh Kumar v. State of Bihar** (2014) 8 SCC 273
   - Magistrates must apply mind before authorising detention
   - Checklist for arrest in Section 498A cases

3. **Satender Kumar Antil v. CBI** (2022) 10 SCC 51
   - Comprehensive guidelines on bail
   - Courts must not mechanically refuse bail

**Anticipatory Bail — Section 438 CrPC / Section 482 BNSS**
- *Gurbaksh Singh Sibbia v. State of Punjab* AIR 1980 SC 1632
- *Siddharam Satlingappa Mhetre v. State of Maharashtra* (2011) 1 SCC 694

> ⚠️ *AI providers temporarily unavailable. Showing knowledge-base response.*`;
  } else if (msg.includes('draft') || msg.includes('petition') || msg.includes('plaint') || msg.includes('notice') || msg.includes('application')) {
    content = `## Legal Drafting — Bail Application Template

\`\`\`
IN THE COURT OF [COURT NAME], [CITY]

Criminal Misc. Application No. ___/2026

IN THE MATTER OF:
[Applicant Name]                    ...Applicant/Accused
        vs.
State of [State]                    ...Respondent

APPLICATION FOR BAIL UNDER SECTION 437/439 CrPC

MOST RESPECTFULLY SHOWETH:

1. That the applicant has been arrested on [date] in FIR No. [___]
   at Police Station [___] under Sections [___] IPC.

2. That the applicant is innocent and has been falsely implicated.

3. That the applicant has deep roots in the community and is not
   a flight risk.

4. That the applicant undertakes to abide by all conditions
   imposed by this Hon'ble Court.

PRAYER:
It is, therefore, most respectfully prayed that this Hon'ble Court
may be pleased to release the applicant on bail on such terms and
conditions as this Court deems fit and proper.

Place: [City]          [Advocate Name]
Date: [Date]           Advocate for Applicant
                       Bar Council No.: [___]
\`\`\`

> ⚠️ *AI providers temporarily unavailable. Showing template.*`;
  } else if (msg.includes('ipc') || msg.includes('bns') || msg.includes('section') || msg.includes('offence')) {
    content = `## IPC / BNS Quick Reference

| IPC | BNS | Offence | Punishment |
|-----|-----|---------|------------|
| 302 | 103 | Murder | Death / Life |
| 304 | 105 | Culpable homicide | Up to 10 yrs |
| 307 | 109 | Attempt to murder | Up to 10 yrs |
| 376 | 64  | Rape | 10 yrs to Life |
| 420 | 318 | Cheating | Up to 7 yrs |
| 498A| 85  | Cruelty by husband | Up to 3 yrs |
| 406 | 316 | Criminal breach of trust | Up to 3 yrs |
| 120B| 61  | Criminal conspiracy | Varies |

**Key Principles:**
- *Mens rea* + *Actus reus* = Criminal liability
- Burden of proof: Beyond reasonable doubt (prosecution)
- Reverse burden: NDPS, PMLA, POCSO

> ⚠️ *AI providers temporarily unavailable. Showing knowledge-base.*`;
  } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('help') || msg.length < 15) {
    const names: Record<string, string> = {
      JUSTICE_AI: 'JusticeAI', ADVOCATE_AI: 'AdvocateAI',
      CLERK_AI: 'ClerkAI', PROSECUTOR_AI: 'ProsecutorAI', CITIZEN_AI: 'CitizenAI'
    };
    content = `## Hello! I'm ${names[agentType] || 'Lawvanta AI'} 👋

I'm your AI legal assistant for Indian courts. I can help with:

**⚖️ Legal Research** — Case laws, SC precedents, statutory provisions
**📝 Legal Drafting** — Bail applications, plaints, petitions, notices
**🔍 Case Analysis** — Strengths, weaknesses, applicable sections
**📋 Procedure** — Filing requirements, limitation periods, appeals

**Try asking:**
- *"What are the grounds for bail under Section 437 CrPC?"*
- *"Draft a legal notice for cheque bounce under Section 138 NI Act"*
- *"Explain Article 21 of the Constitution"*
- *"What documents are needed to file a civil suit?"*

> ⚠️ *Note: AI providers temporarily unavailable. Showing knowledge-base responses. The Groq API key is being verified.*`;
  } else {
    content = `## Response to your query

I understand you're asking about: **"${userMessage.substring(0, 80)}${userMessage.length > 80 ? '...' : ''}"**

**Relevant Indian Legal Framework:**

Based on your query, here are the key legal considerations:

1. **Applicable Statutes** — Identify the relevant Act (IPC/BNS for criminal, CPC for civil, Constitution for fundamental rights)
2. **Jurisdiction** — Territorial, pecuniary, and subject-matter jurisdiction must be established
3. **Limitation** — Check applicable limitation period under the Limitation Act 1963
4. **Evidence** — Gather documentary and oral evidence as per Indian Evidence Act / BSA 2023
5. **Procedure** — Follow court-specific rules (High Court Rules, CPC, CrPC as applicable)

**For specific advice, try asking:**
- "Draft a [specific document] for [specific situation]"
- "What section of IPC applies to [specific act]?"
- "What are the grounds for [specific legal remedy]?"

*For free legal aid: Call NALSA helpline **15100***

> ⚠️ *AI providers temporarily unavailable. Showing knowledge-base response.*`;
  }

  return {
    content,
    metadata: { provider: 'knowledge-base', model: 'fallback', usage: null, finishReason: 'fallback' }
  };
}

// ── Local document analysis (no API) ─────────────────────────────────────────
function localDocumentAnalysis(text: string, docType: string, fileName: string): any {
  const lower = text.toLowerCase();

  const personMatches = text.match(/(?:Mr\.|Mrs\.|Ms\.|Dr\.|Adv\.|Justice|Judge|Shri|Smt\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
  const persons = [...new Set(personMatches.map(p => p.trim()))].slice(0, 8);

  const dateMatches = text.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/gi) || [];
  const dates = [...new Set(dateMatches)].slice(0, 6);

  const lawMatches = text.match(/(?:Section|Sec\.|S\.)\s*\d+[A-Z]?(?:\([a-z0-9]+\))?(?:\s+of\s+(?:the\s+)?[A-Z][A-Za-z\s,]+(?:Act|Code|Rules)\s*\d{0,4})?/gi) || [];
  const laws = [...new Set(lawMatches.map(l => l.trim()))].slice(0, 8);

  const locationMatches = text.match(/(?:District|Court of|High Court of|Sessions Court|Magistrate)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
  const locations = [...new Set(locationMatches.map(l => l.trim()))].slice(0, 4);

  const detectedType = detectDocType(lower, docType);
  const summary = generateLocalSummary(lower, detectedType, fileName);
  const keyPoints = generateKeyPoints(lower, detectedType, laws);
  const suggestedCitations = generateCitations(lower, detectedType);
  const legalIssues = detectLegalIssues(lower);
  const recommendations = generateRecommendations(lower, detectedType);

  return {
    summary, keyPoints, suggestedCitations,
    extractedEntities: { persons, dates, locations, laws },
    documentType: detectedType, legalIssues, recommendations,
    confidence: 0.72, analyzedBy: 'local-analysis',
    wordCount: text.split(/\s+/).length,
    pageEstimate: Math.ceil(text.length / 2500)
  };
}

function detectDocType(lower: string, provided: string): string {
  if (lower.includes('fir') || lower.includes('first information report')) return 'FIR';
  if (lower.includes('charge sheet') || lower.includes('chargesheet')) return 'Charge Sheet';
  if (lower.includes('bail application') || lower.includes('application for bail')) return 'Bail Application';
  if (lower.includes('writ petition') || lower.includes('article 226') || lower.includes('article 32')) return 'Writ Petition';
  if (lower.includes('plaint') && lower.includes('defendant')) return 'Civil Plaint';
  if (lower.includes('written statement')) return 'Written Statement';
  if (lower.includes('affidavit') || lower.includes('solemnly affirm')) return 'Affidavit';
  if (lower.includes('judgment') || lower.includes('hereby ordered')) return 'Judgment/Order';
  if (lower.includes('legal notice') || lower.includes('take notice')) return 'Legal Notice';
  return provided || 'Legal Document';
}

function generateLocalSummary(lower: string, docType: string, fileName: string): string {
  const map: Record<string, string> = {
    'FIR': 'This First Information Report documents a criminal complaint with details of the alleged offence, complainant information, and initial police action.',
    'Charge Sheet': 'This charge sheet presents the prosecution case against the accused, containing charges, evidence collected, and witness list.',
    'Bail Application': 'This bail application seeks release of the accused from custody, presenting grounds including personal liberty and community ties.',
    'Writ Petition': 'This writ petition invokes constitutional jurisdiction seeking enforcement of fundamental rights or challenging an administrative action.',
    'Civil Plaint': 'This civil plaint initiates a suit setting out the cause of action, parties involved, and relief sought.',
    'Affidavit': 'This affidavit is a sworn statement of facts made before a competent authority under oath.',
    'Judgment/Order': 'This judicial order contains findings of fact, applicable law, and the final decision of the court.',
    'Legal Notice': 'This legal notice formally communicates a legal demand, serving as a precursor to legal proceedings.',
  };
  return map[docType] || `This ${docType} (${fileName}) is a legal document containing approximately ${lower.split(/\s+/).length} words relating to legal proceedings.`;
}

function generateKeyPoints(lower: string, docType: string, laws: string[]): string[] {
  const points: string[] = [];
  if (laws.length > 0) points.push(`References: ${laws.slice(0, 3).join(', ')}`);
  if (lower.includes('accused') || lower.includes('defendant')) points.push('Involves accused/defendant party');
  if (lower.includes('complainant') || lower.includes('petitioner')) points.push('Filed by complainant/petitioner');
  if (lower.includes('bail')) points.push('Bail-related proceedings');
  if (lower.includes('evidence') || lower.includes('witness')) points.push('Contains evidence/witness references');
  if (lower.includes('compensation') || lower.includes('damages')) points.push('Seeks compensation or damages');
  if (lower.includes('injunction') || lower.includes('stay')) points.push('Seeks injunctive/stay relief');
  if (lower.includes('constitution') || lower.includes('fundamental right')) points.push('Constitutional rights involved');
  while (points.length < 4) {
    const extras = ['Document requires careful legal review', 'Verify all cited sections', 'Ensure proper court fees are paid', 'Check limitation period compliance'];
    points.push(extras[points.length] || 'Consult with advocate before proceeding');
  }
  return points.slice(0, 6);
}

function generateCitations(lower: string, docType: string): string[] {
  const c: string[] = [];
  if (lower.includes('bail') || lower.includes('arrest')) {
    c.push('Section 437 CrPC — Bail in non-bailable offences');
    c.push('Section 438 CrPC — Anticipatory bail');
    c.push('Article 21 Constitution — Right to personal liberty');
  }
  if (lower.includes('murder') || lower.includes('302')) {
    c.push('Section 302 IPC / Section 103 BNS — Murder');
  }
  if (lower.includes('cheating') || lower.includes('420')) {
    c.push('Section 420 IPC / Section 318 BNS — Cheating');
  }
  if (lower.includes('writ') || lower.includes('article 226')) {
    c.push('Article 226 Constitution — High Court writ jurisdiction');
    c.push('Article 32 Constitution — Supreme Court writ jurisdiction');
  }
  if (lower.includes('civil') || lower.includes('plaint')) {
    c.push('Order VII Rule 1 CPC — Contents of plaint');
    c.push('Section 9 CPC — Courts to try all civil suits');
  }
  if (c.length === 0) {
    c.push('Indian Evidence Act 1872 — Admissibility of documents');
    c.push('Limitation Act 1963 — Applicable limitation period');
  }
  return c.slice(0, 5);
}

function detectLegalIssues(lower: string): string[] {
  const issues: string[] = [];
  if (lower.includes('bail')) issues.push('Bail/custody determination');
  if (lower.includes('jurisdiction')) issues.push('Jurisdictional question');
  if (lower.includes('limitation')) issues.push('Limitation period compliance');
  if (lower.includes('evidence') || lower.includes('admissib')) issues.push('Admissibility of evidence');
  if (lower.includes('fundamental right') || lower.includes('article 21')) issues.push('Fundamental rights violation');
  if (lower.includes('compensation') || lower.includes('damages')) issues.push('Quantum of compensation');
  if (issues.length === 0) issues.push('Legal rights and obligations of parties', 'Applicable statutory provisions');
  return issues.slice(0, 4);
}

function generateRecommendations(lower: string, docType: string): string[] {
  const recs = [
    'Verify all cited section numbers (IPC sections may have changed to BNS)',
    'Ensure document is properly stamped and notarized if required',
    'Check limitation period compliance before filing',
    'Confirm jurisdiction of the court where filing'
  ];
  if (lower.includes('bail')) recs.unshift('Prepare surety documents and personal bond');
  if (lower.includes('appeal')) recs.unshift('Verify appeal limitation period (30/60/90 days)');
  return recs.slice(0, 4);
}
