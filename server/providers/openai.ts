export interface OpenAIImageParams {
  prompt: string;
  aspect_ratio?: string;
  apiKey?: string;
  model?: string;
}

export async function generateOpenAIImage(params: OpenAIImageParams): Promise<{ url: string; revisedPrompt?: string }> {
  const apiKey = params.apiKey || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured in backend environment or settings.');
  }

  // Map aspect ratio to standard OpenAI DALL-E 3 dimensions
  let size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024';
  if (params.aspect_ratio === '16:9' || params.aspect_ratio === '4:3') {
    size = '1792x1024';
  } else if (params.aspect_ratio === '9:16' || params.aspect_ratio === '3:4') {
    size = '1024x1792';
  }

  const model = params.model || process.env.OPENAI_IMAGE_MODEL || 'dall-e-3';

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      prompt: params.prompt,
      n: 1,
      size,
      quality: 'standard',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = (errorData as any)?.error?.message || `OpenAI API returned status ${response.status}`;
    throw new Error(`OpenAI Image Generation Error: ${message}`);
  }

  const data = await response.json() as any;
  const imageItem = data.data?.[0];

  if (!imageItem?.url) {
    throw new Error('No image URL returned from OpenAI Images API.');
  }

  return {
    url: imageItem.url,
    revisedPrompt: imageItem.revised_prompt,
  };
}
