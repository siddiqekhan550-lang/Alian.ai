import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthenticatedUserId } from './auth.js';

export const adminRouter = Router();

// Middleware checking for admin privilege
function requireAdmin(req: Request, res: Response, next: () => void) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const user = db.findUserById(userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access forbidden: Admin role required.' });
  }

  next();
}

// GET /api/admin/overview
adminRouter.get('/overview', requireAdmin, (_req: Request, res: Response) => {
  const overview = db.getAdminOverview();
  const settings = db.getSettings();

  return res.json({
    overview,
    settings: {
      image_credit_cost: settings.image_credit_cost,
      video_credit_costs: settings.video_credit_costs,
      new_user_credits: settings.new_user_credits,
      has_openai_key: !!(settings.openai_api_key || process.env.OPENAI_API_KEY),
      has_runway_key: !!(settings.runway_api_key || process.env.RUNWAY_API_KEY),
      has_gemini_key: !!process.env.GEMINI_API_KEY,
    },
  });
});

// POST /api/admin/settings - Update system settings & API keys
adminRouter.post('/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const {
      image_credit_cost,
      video_credit_costs,
      new_user_credits,
      openai_api_key,
      runway_api_key,
    } = req.body;

    const updates: any = {};
    if (typeof image_credit_cost === 'number') updates.image_credit_cost = image_credit_cost;
    if (video_credit_costs && typeof video_credit_costs === 'object') updates.video_credit_costs = video_credit_costs;
    if (typeof new_user_credits === 'number') updates.new_user_credits = new_user_credits;
    if (typeof openai_api_key === 'string') updates.openai_api_key = openai_api_key.trim();
    if (typeof runway_api_key === 'string') updates.runway_api_key = runway_api_key.trim();

    const updated = db.updateSettings(updates);

    return res.json({
      success: true,
      message: 'Admin settings updated successfully.',
      settings: {
        image_credit_cost: updated.image_credit_cost,
        video_credit_costs: updated.video_credit_costs,
        new_user_credits: updated.new_user_credits,
        has_openai_key: !!(updated.openai_api_key || process.env.OPENAI_API_KEY),
        has_runway_key: !!(updated.runway_api_key || process.env.RUNWAY_API_KEY),
      },
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to update settings.' });
  }
});

// POST /api/admin/grant-credits - grant manual credits to any user
adminRouter.post('/grant-credits', requireAdmin, (req: Request, res: Response) => {
  const { user_id, amount, note = 'Admin credit bonus' } = req.body;
  if (!user_id || !amount || typeof amount !== 'number') {
    return res.status(400).json({ error: 'User ID and valid credit amount are required.' });
  }

  const user = db.findUserById(user_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const nextBalance = db.refundCredits(user_id, amount, note);
  return res.json({
    success: true,
    message: `Successfully granted ${amount} credits to ${user.username}.`,
    user_id,
    newBalance: nextBalance,
  });
});
