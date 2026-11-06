import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const authRouter = Router();

// Middleware to extract user from Authorization header
export function getAuthenticatedUserId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  // We use token format: "alien_token_<userId>"
  if (token.startsWith('alien_token_')) {
    const userId = token.replace('alien_token_', '');
    const user = db.findUserById(userId);
    return user ? user.id : null;
  }
  return null;
}

// Register endpoint
authRouter.post('/register', (req: Request, res: Response) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const { user, isFirstSignup, creditsAwarded } = db.createUser({
      username: username || email.split('@')[0],
      email,
      password,
    });

    const token = `alien_token_${user.id}`;

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        credits: creditsAwarded,
      },
      token,
      isFirstSignup,
      creditsAwarded,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

// Login endpoint
authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user || !db.verifyPassword(user, password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = `alien_token_${user.id}`;
    const balance = db.getBalance(user.id);

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        credits: balance,
      },
      token,
      isFirstSignup: false,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

// Me endpoint
authRouter.get('/me', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
  }

  const user = db.findUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const balance = db.getBalance(user.id);

  return res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar_url: user.avatar_url,
      role: user.role,
      credits: balance,
    },
  });
});

// Update profile
authRouter.put('/profile', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    const { username, avatar_url } = req.body;
    const updated = db.updateProfile(userId, { username, avatar_url });
    return res.json({
      success: true,
      user: {
        id: updated.id,
        username: updated.username,
        email: updated.email,
        avatar_url: updated.avatar_url,
        role: updated.role,
        credits: db.getBalance(updated.id),
      },
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to update profile.' });
  }
});

// Logout endpoint
authRouter.post('/logout', (_req: Request, res: Response) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});
