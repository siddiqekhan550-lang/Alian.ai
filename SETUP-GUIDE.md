# Alien.ai — Complete Setup & Configuration Guide

This guide walks you through setting up OpenAI, Runway, and Supabase credentials for Alien.ai.

---

## 1. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Supported Environment Variables:
- `OPENAI_API_KEY`: Obtain from [platform.openai.com](https://platform.openai.com/api-keys)
- `OPENAI_IMAGE_MODEL`: `dall-e-3` (default)
- `RUNWAY_API_KEY`: Obtain from [runwayml.com](https://runwayml.com) developer dashboard
- `RUNWAY_VIDEO_MODEL`: `gen3a_turbo` (default)
- `GEMINI_API_KEY`: Automatically provided in AI Studio, or create at [aistudio.google.com](https://aistudio.google.com)
- `PORT`: 3000 (default)

---

## 2. Supabase Integration (Optional for Remote DB)

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in the Supabase dashboard.
3. Run the script found in `supabase/migrations/01_initial_schema.sql`.
4. Run the script found in `supabase/policies/rls_policies.sql`.
5. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`.

---

## 3. Credit Schedules (Enforced Server-Side)

| Action | Duration / Mode | Credit Cost |
|---|---|---|
| **New Account** | First-time Signup | **+50 Free Credits** |
| **Image Generation** | DALL-E 3 / Imagen | **5 Credits** |
| **Video Generation** | 4 Seconds | **5 Credits** |
| **Video Generation** | 5 Seconds | **8 Credits** |
| **Video Generation** | 8 Seconds | **10 Credits** |
| **Video Generation** | 10 Seconds | **15 Credits** |

---

## 4. Admin Access

Log in with:
- **Email:** `admin@alien.ai`
- **Password:** `AlienAdmin2026!`

The admin panel allows you to:
- Monitor live user balances and credit transactions
- Inspect all generations with provider task IDs
- Adjust duration pricing and welcome credit grants
- Configure API keys directly through the UI
