import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { createCompleteZip } from '../../scripts/package-project.js';

export const downloadRouter = Router();

// GET /api/download/alien-ai-complete-website.zip
downloadRouter.get('/alien-ai-complete-website.zip', async (_req: Request, res: Response) => {
  try {
    const publicZip = path.join(process.cwd(), 'public', 'Alien.ai-Complete-Website.zip');

    if (!fs.existsSync(publicZip)) {
      await createCompleteZip();
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="Alien.ai-Complete-Website.zip"');
    const stream = fs.createReadStream(publicZip);
    stream.pipe(res);
  } catch (err: any) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Failed to generate download archive: ' + err.message });
  }
});
