# Alien.ai — Complete Production Platform

Alien.ai is a next-generation AI Image & Video Creation platform inspired by Google Flow's creative workspace. It provides unified text-to-image and text-to-video generation, media uploads, multi-aspect ratio rendering, duration-based pricing, persistent user libraries, and transparent credit accounting.

---

## 🚀 Key Highlights & Architecture

- **Visual Brand & Theme**: Dark base (`#07060D` / `#100D1C`), card panel (`#14111F`), neon purple (`#7C5CFF`), violet glow (`#B05CFF`), and mint green highlights (`#22E6A8`).
- **50 Welcome Credits**: Every new verified signup automatically receives 50 free credits once with celebratory welcome modal and ledger record.
- **Duration-Based Video Rates**:
  - `4 Seconds`: 5 Credits
  - `5 Seconds`: 8 Credits
  - `8 Seconds`: 10 Credits
  - `10 Seconds`: 15 Credits
- **Image Generation**: 5 Credits per creation.
- **Provider Adapters**:
  - **OpenAI DALL-E 3**: High resolution image generation.
  - **Runway Gen-3 Alpha**: Real text-to-video and image-to-video asynchronous tasks.
  - **Gemini Multimodal Studio**: Server-side engine using `@google/genai` with `GEMINI_API_KEY`.
- **Atomic Credit Reservation**: Credits are checked and reserved on the backend before generation. If generation fails or is cancelled, reserved credits are immediately refunded with an audit log.
- **User Isolation**: Strictly scoped history; User A cannot inspect or access User B's creations or media uploads.
- **Google Flow-Inspired Workspace**: Large creative canvas, bottom-docked prompt composer, multi-asset history library, media attachments, and featured video player.

---

## 🛠️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your provider keys (OPENAI_API_KEY, RUNWAY_API_KEY, etc.)

# 3. Start development server
npm run dev

# 4. Package complete standalone ZIP
npm run package:zip
```

---

## 📦 Directory Structure

```
Alien.ai-Complete-Website/
├── frontend/             # React 19 UI, Tailwind v4, Lucide icons, Motion
│   ├── src/              # App.tsx, main.tsx, navigation, modals
│   └── components/       # Google Flow Dashboard, History, Composer, Auth
├── backend/              # Node.js + Express 5 + TypeScript
│   ├── server.ts         # Server entry point with Vite middleware
│   ├── db.ts             # Database layer & credit transaction engine
│   ├── routes/           # Auth, Credits, Generations, Uploads, Admin
│   └── providers/        # OpenAI, Runway, and Gemini adapters
├── supabase/             # PostgreSQL database schemas & RLS policies
│   ├── migrations/       # Initial schema & welcome credits trigger
│   └── policies/         # Row-Level Security rules
├── public/               # Static assets & alien logo SVG
└── tests/                # Automated verification suites
```
