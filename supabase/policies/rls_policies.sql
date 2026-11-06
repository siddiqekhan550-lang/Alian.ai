-- ============================================================================
-- Alien.ai - Supabase Row Level Security (RLS) Policies
-- Enforces strict user isolation: User A can NEVER view or modify User B's records
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. User Credits Policies
CREATE POLICY "Users can view their own credit balance"
  ON public.user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Credit Transactions Policies
CREATE POLICY "Users can view their own credit ledger"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Generations Policies (Strict User Isolation)
CREATE POLICY "Users can view their own generations"
  ON public.generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations"
  ON public.generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations"
  ON public.generations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generations"
  ON public.generations FOR DELETE
  USING (auth.uid() = user_id);

-- 5. User Uploads Policies
CREATE POLICY "Users can view their own uploaded media"
  ON public.user_uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploads"
  ON public.user_uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Settings Policies
CREATE POLICY "Anyone can view public generation settings"
  ON public.generation_settings FOR SELECT
  USING (true);
