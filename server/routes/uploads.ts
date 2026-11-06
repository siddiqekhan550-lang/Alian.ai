import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthenticatedUserId } from './auth.js';

export const uploadsRouter = Router();

// POST /api/uploads - upload reference media
uploadsRouter.post('/', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
  }

  const { file_data, file_name = 'upload.png', file_type = 'image/png' } = req.body;

  if (!file_data) {
    return res.status(400).json({ error: 'Missing file data.' });
  }

  // Basic MIME validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
  if (!allowedTypes.some((t) => file_type.startsWith(t.split('/')[0]) || file_type === t)) {
    return res.status(400).json({ error: 'Unsupported file type. Please upload JPG, PNG, WEBP, or MP4.' });
  }

  // Save reference
  const upload = db.addUpload(userId, file_data, file_type, file_name);

  return res.status(201).json({
    success: true,
    upload: {
      id: upload.id,
      file_url: upload.file_url,
      file_name: upload.file_name,
      file_type: upload.file_type,
      created_at: upload.created_at,
    },
  });
});

// GET /api/uploads - list user's uploaded assets
uploadsRouter.get('/', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const uploads = db.getUserUploads(userId);
  return res.json({ uploads });
});
