import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { getDatabase } from '../config/database';
import { UserRole } from '@lawvanta/shared';
import { v4 as uuidv4 } from 'uuid';

export async function register(req: AuthRequest, res: Response) {
  const { email, password, name, role, phone, barCouncilId, courtId } = req.body;

  // Validate input
  if (!email || !password || !name || !role) {
    throw new AppError('Missing required fields', 400);
  }

  const db = getDatabase();

  // Check if user exists
  const existingUser = db.exec('SELECT id FROM users WHERE email = ?', [email]);

  if (existingUser[0]?.values.length > 0) {
    throw new AppError('User already exists', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const userId = uuidv4();
  const preferences = JSON.stringify({
    language: 'en',
    theme: 'light',
    agentTone: 'conversational',
    notificationsEnabled: true,
    voiceInputEnabled: false
  });

  db.run(
    `INSERT INTO users (id, email, password, name, role, phone, bar_council_id, court_id, preferences)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, email, hashedPassword, name, role, phone || null, barCouncilId || null, courtId || null, preferences]
  );

  const userResult = db.exec('SELECT id, email, name, role, phone, bar_council_id, court_id, preferences, created_at FROM users WHERE id = ?', [userId]);
  const user = userResult[0]?.values[0];

  // Generate token
  const token = jwt.sign(
    { id: user[0], email: user[1], role: user[3] },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user[0],
        email: user[1],
        name: user[2],
        role: user[3],
        phone: user[4],
        barCouncilId: user[5],
        courtId: user[6],
        preferences: JSON.parse(user[7] as string),
        createdAt: user[8]
      },
      token
    }
  });
}

export async function login(req: AuthRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const db = getDatabase();

  // Find user
  const result = db.exec('SELECT * FROM users WHERE email = ?', [email]);

  if (!result[0]?.values.length) {
    throw new AppError('Invalid credentials', 401);
  }

  const user = result[0].values[0];

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user[2] as string);

  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate token
  const token = jwt.sign(
    { id: user[0], email: user[1], role: user[4] },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    data: {
      user: {
        id: user[0],
        email: user[1],
        name: user[3],
        role: user[4],
        phone: user[5],
        barCouncilId: user[6],
        courtId: user[7],
        preferences: JSON.parse(user[8] as string),
        createdAt: user[9]
      },
      token
    }
  });
}

export async function logout(req: AuthRequest, res: Response) {
  // In a production app, you might want to blacklist the token
  res.json({
    success: true,
    data: { message: 'Logged out successfully' }
  });
}

export async function refreshToken(req: AuthRequest, res: Response) {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Token is required', 400);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: { token: newToken }
    });
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
}

export async function getCurrentUser(req: AuthRequest, res: Response) {
  const db = getDatabase();

  const result = db.exec(
    'SELECT id, email, name, role, phone, bar_council_id, court_id, preferences, created_at FROM users WHERE id = ?',
    [req.user!.id]
  );

  if (!result[0]?.values.length) {
    throw new AppError('User not found', 404);
  }

  const user = result[0].values[0];

  res.json({
    success: true,
    data: {
      id: user[0],
      email: user[1],
      name: user[2],
      role: user[3],
      phone: user[4],
      barCouncilId: user[5],
      courtId: user[6],
      preferences: JSON.parse(user[7] as string),
      createdAt: user[8]
    }
  });
}
