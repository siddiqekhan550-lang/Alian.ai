import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthenticatedUserId } from './auth.js';

export const creditsRouter = Router();

// GET /api/credits - get current user balance and credit schedules
creditsRouter.get('/', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const balance = db.getBalance(userId);
  const settings = db.getSettings();

  return res.json({
    balance,
    pricing: {
      image: settings.image_credit_cost,
      video: settings.video_credit_costs,
    },
    newUserBonus: settings.new_user_credits,
  });
});

// GET /api/credits/transactions - get ledger
creditsRouter.get('/transactions', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const transactions = db.getTransactions(userId);
  return res.json({ transactions });
});
