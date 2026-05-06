import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { getDatabase } from '../config/database';
import { generateChatCompletion } from '../services/ai.service';
import { AgentType, MessageRole, UserRole } from '@lawvanta/shared';

// Map user roles to agent types
function getUserAgentType(role: UserRole): AgentType {
  const mapping: Record<string, AgentType> = {
    JUDGE:      AgentType.JUSTICE_AI,
    LAWYER:     AgentType.ADVOCATE_AI,
    CLERK:      AgentType.CLERK_AI,
    PROSECUTOR: AgentType.PROSECUTOR_AI,
    LITIGANT:   AgentType.CITIZEN_AI,
    ADMIN:      AgentType.JUSTICE_AI
  };
  return mapping[role] || AgentType.ADVOCATE_AI;
}

// Helper: run a SELECT and return rows as objects
function queryRows(sql: string, params: any[] = []): Record<string, any>[] {
  const db = getDatabase();
  const result = db.exec(sql, params);
  if (!result[0]) return [];
  const { columns, values } = result[0];
  return values.map(row =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

export async function getConversations(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const rows = queryRows(
    `SELECT c.id, c.title, c.agent_type, c.created_at, c.updated_at,
            COUNT(m.id) as message_count
     FROM conversations c
     LEFT JOIN chat_messages m ON m.conversation_id = c.id
     WHERE c.user_id = ?
     GROUP BY c.id
     ORDER BY c.updated_at DESC
     LIMIT 50`,
    [userId]
  );

  res.json({
    success: true,
    data: rows.map(r => ({
      id: r.id,
      title: r.title,
      agentType: r.agent_type,
      messageCount: Number(r.message_count),
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }))
  });
}

export async function getConversation(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user!.id;

  const convRows = queryRows(
    'SELECT * FROM conversations WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  if (!convRows.length) throw new AppError('Conversation not found', 404);

  const msgRows = queryRows(
    'SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC',
    [id]
  );

  const conv = convRows[0];
  res.json({
    success: true,
    data: {
      id: conv.id,
      title: conv.title,
      agentType: conv.agent_type,
      messages: msgRows.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        metadata: m.metadata ? JSON.parse(m.metadata as string) : {},
        createdAt: m.created_at
      })),
      createdAt: conv.created_at,
      updatedAt: conv.updated_at
    }
  });
}

export async function createConversation(req: AuthRequest, res: Response) {
  const db = getDatabase();
  const userId = req.user!.id;
  const { title } = req.body;
  const agentType = getUserAgentType(req.user!.role);
  const conversationId = uuidv4();

  db.run(
    `INSERT INTO conversations (id, user_id, agent_type, title, created_at, updated_at)
     VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [conversationId, userId, agentType, title || 'New Conversation']
  );

  res.status(201).json({
    success: true,
    data: { id: conversationId, title: title || 'New Conversation', agentType, messages: [] }
  });
}

export async function sendMessage(req: AuthRequest, res: Response) {
  const db = getDatabase();
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user!.id;

  if (!content?.trim()) throw new AppError('Message content is required', 400);

  // Verify conversation ownership
  const convRows = queryRows(
    'SELECT * FROM conversations WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  if (!convRows.length) throw new AppError('Conversation not found', 404);
  const conversation = convRows[0];

  // Get user preferences
  const userRows = queryRows('SELECT preferences FROM users WHERE id = ?', [userId]);
  const preferences = userRows[0]?.preferences
    ? JSON.parse(userRows[0].preferences as string)
    : { agentTone: 'conversational' };

  // Get conversation history (last 10 messages)
  const historyRows = queryRows(
    'SELECT id, role, content FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC',
    [id]
  );
  const conversationHistory = historyRows.map(r => ({
    id: r.id as string,
    conversationId: id,
    role: r.role as MessageRole,
    content: r.content as string,
    createdAt: new Date()
  }));

  // Save user message
  const userMessageId = uuidv4();
  db.run(
    `INSERT INTO chat_messages (id, conversation_id, role, content, metadata, created_at)
     VALUES (?, ?, ?, ?, '{}', datetime('now'))`,
    [userMessageId, id, MessageRole.USER, content]
  );

  // Generate AI response
  const { content: aiResponse, metadata } = await generateChatCompletion(content, {
    agentType: conversation.agent_type as AgentType,
    userTone: preferences.agentTone || 'conversational',
    conversationHistory
  });

  // Save AI message
  const aiMessageId = uuidv4();
  db.run(
    `INSERT INTO chat_messages (id, conversation_id, role, content, metadata, created_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [aiMessageId, id, MessageRole.ASSISTANT, aiResponse, JSON.stringify(metadata)]
  );

  // Update conversation timestamp
  db.run(`UPDATE conversations SET updated_at = datetime('now') WHERE id = ?`, [id]);

  res.json({
    success: true,
    data: {
      userMessage: {
        id: userMessageId,
        role: MessageRole.USER,
        content,
        createdAt: new Date()
      },
      aiMessage: {
        id: aiMessageId,
        role: MessageRole.ASSISTANT,
        content: aiResponse,
        metadata,
        createdAt: new Date()
      }
    }
  });
}

export async function deleteConversation(req: AuthRequest, res: Response) {
  const db = getDatabase();
  const { id } = req.params;
  const userId = req.user!.id;

  const rows = queryRows('SELECT id FROM conversations WHERE id = ? AND user_id = ?', [id, userId]);
  if (!rows.length) throw new AppError('Conversation not found', 404);

  db.run('DELETE FROM chat_messages WHERE conversation_id = ?', [id]);
  db.run('DELETE FROM conversations WHERE id = ?', [id]);

  res.json({ success: true, data: { message: 'Conversation deleted' } });
}
