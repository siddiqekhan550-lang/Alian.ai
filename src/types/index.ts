export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  role: 'user' | 'admin';
  credits: number;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  generation_id?: string;
  type: 'welcome_bonus' | 'generation_deduction' | 'refund' | 'admin_grant';
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  type: 'image' | 'video';
  prompt: string;
  duration?: number; // 4, 5, 8, 10
  aspect_ratio: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  output_url?: string;
  thumbnail_url?: string;
  provider: 'openai' | 'runway' | 'gemini';
  provider_task_id?: string;
  credits_charged: number;
  error_message?: string;
  reference_image_url?: string;
  created_at: string;
}

export interface UserUpload {
  id: string;
  user_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
  created_at: string;
}

export interface PricingSchedule {
  image: number;
  video: {
    4: number;
    5: number;
    8: number;
    10: number;
  };
}
