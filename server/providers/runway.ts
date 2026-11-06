export interface RunwayVideoParams {
  prompt: string;
  duration: 4 | 5 | 8 | 10;
  aspect_ratio?: string;
  referenceImageUrl?: string;
  apiKey?: string;
  model?: string;
}

export interface RunwayTaskResponse {
  taskId: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  progress?: number;
  outputUrl?: string;
  error?: string;
}

export async function createRunwayVideoTask(params: RunwayVideoParams): Promise<RunwayTaskResponse> {
  const apiKey = params.apiKey || process.env.RUNWAY_API_KEY;

  if (!apiKey) {
    throw new Error('RUNWAY_API_KEY is not configured in backend environment or settings.');
  }

  const model = params.model || process.env.RUNWAY_VIDEO_MODEL || 'gen3a_turbo';
  let ratio = '16:9';
  if (params.aspect_ratio === '9:16') ratio = '9:16';
  else if (params.aspect_ratio === '1:1') ratio = '1:1';

  // Runway Gen-3 endpoint
  const endpoint = params.referenceImageUrl
    ? 'https://api.dev.runwayml.com/v1/image_to_video'
    : 'https://api.dev.runwayml.com/v1/tasks';

  const payload: any = {
    model,
    promptText: params.prompt,
    duration: params.duration,
    ratio,
  };

  if (params.referenceImageUrl) {
    payload.promptImage = params.referenceImageUrl;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
      'X-Runway-Version': '2024-11-06',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = (errorData as any)?.error || (errorData as any)?.message || `Runway API error ${response.status}`;
    throw new Error(`Runway Video Error: ${message}`);
  }

  const data = await response.json() as any;
  const taskId = data.id || data.taskId || data.task_id;

  if (!taskId) {
    throw new Error('Failed to retrieve task ID from Runway API.');
  }

  return {
    taskId,
    status: 'PENDING',
    progress: 10,
  };
}

export async function getRunwayTaskStatus(taskId: string, apiKey?: string): Promise<RunwayTaskResponse> {
  const key = apiKey || process.env.RUNWAY_API_KEY;
  if (!key) {
    throw new Error('RUNWAY_API_KEY is not configured');
  }

  const response = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${key.trim()}`,
      'X-Runway-Version': '2024-11-06',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error((errorData as any)?.message || `Failed to check Runway task status: ${response.status}`);
  }

  const data = await response.json() as any;
  const status = data.status || 'PENDING';
  const outputUrl = data.output?.[0] || data.outputUrl || data.url;

  return {
    taskId,
    status,
    progress: data.progress ? Math.round(data.progress * 100) : (status === 'SUCCEEDED' ? 100 : 50),
    outputUrl,
    error: data.failure || data.error,
  };
}
