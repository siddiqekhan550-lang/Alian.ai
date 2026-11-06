-- ============================================================================
-- Alien.ai - Supabase PostgreSQL Database Schema & Migrations
-- Matches Product Blueprint 11 & 12
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. User Credits Account Table
CREATE TABLE IF NOT EXISTS public.user_credits (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  balance INTEGER NOT NULL DEFAULT 50 CHECK (balance >= 0),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Credit Transactions Ledger Table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  generation_id UUID,
  type TEXT NOT NULL CHECK (type IN ('welcome_bonus', 'generation_deduction', 'refund', 'admin_grant')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT NOT NULL,
  idempotency_key TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Generations Table (Image & Video History)
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  prompt TEXT NOT NULL,
  duration INTEGER CHECK (duration IN (4, 5, 8, 10)),
  aspect_ratio TEXT DEFAULT '16:9',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0,
  output_url TEXT,
  thumbnail_url TEXT,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'runway', 'gemini')),
  provider_task_id TEXT,
  credits_charged INTEGER NOT NULL,
  error_message TEXT,
  reference_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. User Uploads Table
CREATE TABLE IF NOT EXISTS public.user_uploads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Generation Settings & Rates Table
CREATE TABLE IF NOT EXISTS public.generation_settings (
  id SERIAL PRIMARY KEY,
  image_credit_cost INTEGER DEFAULT 5,
  video_credit_cost_4s INTEGER DEFAULT 5,
  video_credit_cost_5s INTEGER DEFAULT 8,
  video_credit_cost_8s INTEGER DEFAULT 10,
  video_credit_cost_10s INTEGER DEFAULT 15,
  new_user_credits INTEGER DEFAULT 50,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert Default Generation Settings
INSERT INTO public.generation_settings (image_credit_cost, video_credit_cost_4s, video_credit_cost_5s, video_credit_cost_8s, video_credit_cost_10s, new_user_credits)
VALUES (5, 5, 8, 10, 15, 50)
ON CONFLICT DO NOTHING;

-- Trigger: Automatically Create Profile & Award EXACTLY 50 Free Credits on First Signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.profiles
  INSERT INTO public.profiles (id, username, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=' || NEW.id::text),
    'user'
  );

  -- Award exactly 50 welcome credits once
  INSERT INTO public.user_credits (user_id, balance)
  VALUES (NEW.id, 50);

  -- Record in transaction ledger
  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, description)
  VALUES (NEW.id, 'welcome_bonus', 50, 50, 'Welcome Bonus: 50 Free Credits on First Signup');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();
