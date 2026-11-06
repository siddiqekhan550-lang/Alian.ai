import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthenticatedUserId } from './auth.js';
import { generateOpenAIImage } from '../providers/openai.js';
import { createRunwayVideoTask, getRunwayTaskStatus } from '../providers/runway.js';
import { generateGeminiImage, generateGeminiVideo } from '../providers/gemini.js';

export const generationsRouter = Router();

// GET /api/generations - list generations for the authenticated user
generationsRouter.get('/', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { type, status, search } = req.query;
  const list = db.getUserGenerations(userId, {
    type: type as string,
    status: status as string,
    search: search as string,
  });

  return res.json({ generations: list });
});

// GET /api/generations/:id - single generation status
generationsRouter.get('/:id', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const gen = db.getGeneration(req.params.id);
  if (!gen || (gen.user_id !== userId && gen.user_id !== 'system' && userId !== 'admin-user-01')) {
    return res.status(404).json({ error: 'Generation record not found or inaccessible.' });
  }

  return res.json({ generation: gen });
});

// POST /api/generations/image - Generate AI Image (OpenAI / Gemini)
generationsRouter.post('/image', async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
  }

  const { prompt, aspect_ratio = '1:1', reference_image_url } = req.body;
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Please enter a descriptive prompt.' });
  }

  const settings = db.getSettings();
  const cost = settings.image_credit_cost || 5;

  // 1. Check & Reserve Credits atomically
  const reservation = db.reserveCredits(
    userId,
    cost,
    `AI Image Generation: "${prompt.slice(0, 30)}..."`,
  );

  if (!reservation.success) {
    return res.status(402).json({
      error: `Insufficient credits. This generation requires ${cost} credits, but your balance is ${reservation.balanceAfter}.`,
      requiredCredits: cost,
      currentBalance: reservation.balanceAfter,
    });
  }

  // 2. Create pending generation record
  const generation = db.createGeneration({
    user_id: userId,
    type: 'image',
    prompt: prompt.trim(),
    aspect_ratio,
    status: 'processing',
    provider: (settings.openai_api_key || process.env.OPENAI_API_KEY) ? 'openai' : 'gemini',
    credits_charged: cost,
    reference_image_url,
  });

  // 3. Perform generation
  try {
    let resultUrl: string;

    if (settings.openai_api_key || process.env.OPENAI_API_KEY) {
      const openAiRes = await generateOpenAIImage({
        prompt: prompt.trim(),
        aspect_ratio,
        apiKey: settings.openai_api_key,
      });
      resultUrl = openAiRes.url;
    } else {
      // High quality Gemini image generation
      const geminiRes = await generateGeminiImage({
        prompt: prompt.trim(),
        aspect_ratio,
      });
      resultUrl = geminiRes.url;
    }

    // Update generation to completed
    const updated = db.updateGeneration(generation.id, {
      status: 'completed',
      progress: 100,
      output_url: resultUrl,
      thumbnail_url: resultUrl,
    });

    return res.status(201).json({
      success: true,
      generation: updated,
      newBalance: db.getBalance(userId),
    });
  } catch (err: any) {
    console.error('Image generation error:', err);

    // If failed, mark failed and refund credits atomically
    db.updateGeneration(generation.id, {
      status: 'failed',
      progress: 0,
      error_message: err.message || 'Generation error',
    });

    const refundedBalance = db.refundCredits(
      userId,
      cost,
      `Failed image generation "${prompt.slice(0, 30)}..."`,
      generation.id,
    );

    return res.status(500).json({
      error: `Generation failed: ${err.message || 'Unknown error'}. Your ${cost} credits were refunded.`,
      refunded: true,
      newBalance: refundedBalance,
    });
  }
});

// POST /api/generations/video - Generate AI Video (Runway / Gemini)
generationsRouter.post('/video', async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
  }

  const { prompt, duration = 4, aspect_ratio = '16:9', reference_image_url } = req.body;
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Please enter a video prompt description.' });
  }

  const validDurations: Record<number, number> = {
    4: 5,
    5: 8,
    8: 10,
    10: 15,
  };

  const parsedDuration = Number(duration);
  if (![4, 5, 8, 10].includes(parsedDuration)) {
    return res.status(400).json({
      error: 'Invalid video duration. Only 4, 5, 8, or 10 seconds are supported.',
    });
  }

  const settings = db.getSettings();
  const cost = settings.video_credit_costs[parsedDuration as 4 | 5 | 8 | 10] || validDurations[parsedDuration];

  // 1. Check & Reserve Credits atomically
  const reservation = db.reserveCredits(
    userId,
    cost,
    `AI Video Generation (${parsedDuration}s): "${prompt.slice(0, 30)}..."`,
  );

  if (!reservation.success) {
    return res.status(402).json({
      error: `Insufficient credits. A ${parsedDuration}-second video requires ${cost} credits, but your balance is ${reservation.balanceAfter}.`,
      requiredCredits: cost,
      currentBalance: reservation.balanceAfter,
    });
  }

  // 2. Create pending generation record
  const generation = db.createGeneration({
    user_id: userId,
    type: 'video',
    prompt: prompt.trim(),
    duration: parsedDuration,
    aspect_ratio,
    status: 'processing',
    provider: (settings.runway_api_key || process.env.RUNWAY_API_KEY) ? 'runway' : 'gemini',
    credits_charged: cost,
    reference_image_url,
  });

  try {
    if (settings.runway_api_key || process.env.RUNWAY_API_KEY) {
      // Dispatch real Runway task
      const runwayTask = await createRunwayVideoTask({
        prompt: prompt.trim(),
        duration: parsedDuration as 4 | 5 | 8 | 10,
        aspect_ratio,
        referenceImageUrl: reference_image_url,
        apiKey: settings.runway_api_key,
      });

      const updated = db.updateGeneration(generation.id, {
        provider_task_id: runwayTask.taskId,
        progress: 15,
      });

      return res.status(202).json({
        success: true,
        generation: updated,
        newBalance: db.getBalance(userId),
        message: 'Runway video generation task initiated successfully.',
      });
    } else {
      // Real Gemini/multimodal AI video generation fallback
      const videoResult = await generateGeminiVideo({
        prompt: prompt.trim(),
        duration: parsedDuration as 4 | 5 | 8 | 10,
        aspect_ratio,
        referenceImageUrl: reference_image_url,
      });

      const updated = db.updateGeneration(generation.id, {
        status: 'completed',
        progress: 100,
        output_url: videoResult.videoUrl,
        thumbnail_url: videoResult.thumbnailUrl,
      });

      return res.status(201).json({
        success: true,
        generation: updated,
        newBalance: db.getBalance(userId),
      });
    }
  } catch (err: any) {
    console.error('Video generation error:', err);

    db.updateGeneration(generation.id, {
      status: 'failed',
      progress: 0,
      error_message: err.message || 'Generation error',
    });

    const refundedBalance = db.refundCredits(
      userId,
      cost,
      `Failed video generation "${prompt.slice(0, 30)}..."`,
      generation.id,
    );

    return res.status(500).json({
      error: `Video generation failed: ${err.message || 'Unknown error'}. Your ${cost} credits were refunded.`,
      refunded: true,
      newBalance: refundedBalance,
    });
  }
});

// POST /api/generations/:id/poll - Poll video task status
generationsRouter.post('/:id/poll', async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const gen = db.getGeneration(req.params.id);
  if (!gen || (gen.user_id !== userId && userId !== 'admin-user-01')) {
    return res.status(404).json({ error: 'Generation not found.' });
  }

  if (gen.status === 'completed' || gen.status === 'failed') {
    return res.json({ generation: gen });
  }

  // If using Runway task
  if (gen.provider === 'runway' && gen.provider_task_id) {
    try {
      const statusRes = await getRunwayTaskStatus(gen.provider_task_id);
      if (statusRes.status === 'SUCCEEDED' && statusRes.outputUrl) {
        db.updateGeneration(gen.id, {
          status: 'completed',
          progress: 100,
          output_url: statusRes.outputUrl,
          thumbnail_url: gen.reference_image_url || statusRes.outputUrl,
        });
      } else if (statusRes.status === 'FAILED' || statusRes.status === 'CANCELLED') {
        db.updateGeneration(gen.id, {
          status: 'failed',
          progress: 0,
          error_message: statusRes.error || 'Runway task failed',
        });
        db.refundCredits(gen.user_id, gen.credits_charged, 'Runway video task failed', gen.id);
      } else {
        db.updateGeneration(gen.id, {
          progress: Math.min(95, (gen.progress || 15) + 15),
        });
      }
    } catch (err: any) {
      console.warn('Runway poll error:', err.message);
    }
  } else {
    // Increment progress for responsive UX
    const nextProgress = Math.min(100, (gen.progress || 10) + 25);
    if (nextProgress >= 100) {
      const videoResult = await generateGeminiVideo({
        prompt: gen.prompt,
        duration: (gen.duration || 4) as 4 | 5 | 8 | 10,
        aspect_ratio: gen.aspect_ratio,
        referenceImageUrl: gen.reference_image_url,
      });

      db.updateGeneration(gen.id, {
        status: 'completed',
        progress: 100,
        output_url: videoResult.videoUrl,
        thumbnail_url: videoResult.thumbnailUrl,
      });
    } else {
      db.updateGeneration(gen.id, { progress: nextProgress });
    }
  }

  const refreshed = db.getGeneration(gen.id);
  return res.json({ generation: refreshed });
});

// DELETE /api/generations/:id - delete generation from user library
generationsRouter.delete('/:id', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const success = db.deleteGeneration(req.params.id, userId);
  if (!success) {
    return res.status(404).json({ error: 'Item not found or cannot be deleted.' });
  }

  return res.json({ success: true, message: 'Item deleted from history.' });
});
