# ✝ 恩约 GraceCovenant

> 🌏 Building Christ-Centred Families for Chinese Communities Worldwide

Adapted from [SilverConnect-Global](https://github.com/lesliezhili/silverconnect-global) — 100% free stack, same architecture.

## 100% Free Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Framework | Next.js 15 (MIT) | Free |
| Language | TypeScript | Free |
| Styling | TailwindCSS + shadcn/ui | Free |
| Database | PostgreSQL via [Neon](https://neon.tech) (0.5GB free) | Free |
| ORM | Drizzle ORM (MIT) | Free |
| Auth | iron-session + bcryptjs | Free |
| AI/LLM | [HuggingFace](https://huggingface.co) Qwen3 (Chinese) | Free tier |
| Email | [Resend](https://resend.com) (100/day free) | Free |
| i18n | next-intl (ZH + EN) | Free |
| Hosting | [Vercel](https://vercel.com) Hobby | Free |
| CI/CD | GitHub Actions | Free |

**Total monthly cost: $0** (until scale)

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Frontend (Next.js 15 App Router)                   │
│  • Bilingual ZH/EN (next-intl)                      │
│  • Pages: Home • Matches • Prayer • Testimony • Courses │
│  • Auth: Login • Register • Profile                 │
├─────────────────────────────────────────────────────┤
│  API Routes (Next.js Route Handlers)                 │
│  • Auth (iron-session)  • Matches • Prayers          │
│  • AI Chat (HuggingFace Qwen3)                       │
│  • Church Verification  • Testimonies                │
├─────────────────────────────────────────────────────┤
│  Database (PostgreSQL / Neon free tier)               │
│  • users • spiritual_profiles • relationship_profiles │
│  • prayers • testimonies • matches • verifications    │
└─────────────────────────────────────────────────────┘
```

## Quick Start (Local)

```bash
# 1. Clone
git clone https://github.com/lesliezhili/gracecovenant-global.git
cd gracecovenant-global

# 2. Install
npm install

# 3. Environment
cp .env.example .env.local
# Edit .env.local: add DATABASE_URL from Neon, SESSION_SECRET

# 4. DB setup (Neon free tier)
npx drizzle-kit push

# 5. Run
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel (Free)

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variables (from `.env.example`)
4. Deploy — Vercel auto-detects Next.js

## CI/CD Pipeline

GitHub Actions (`.github/workflows/ci.yml`):
```
Push to main → Lint → Type Check → Build → Deploy Vercel → DB Migration
```

Required GitHub secrets:
- `DATABASE_URL`
- `SESSION_SECRET`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Core Features

| Feature | Status |
|---------|--------|
| Bilingual ZH/EN (next-intl) | ✅ Complete |
| Auth (iron-session + bcrypt) | ✅ Complete |
| Home + Hero + Stats | ✅ Complete |
| AI Matches (UI) | ✅ Complete |
| Prayer Wall + Amen | ✅ Complete |
| Testimonies | ✅ Complete |
| Pre-Marriage Courses | ✅ Complete |
| Spiritual + Relationship Profile | ✅ Complete |
| Church Verification (upload) | ✅ Complete |
| Drizzle ORM + Neon DB | ✅ Complete |
| CI/CD (GitHub Actions + Vercel) | ✅ Complete |
| AI Matching (HuggingFace Qwen3) | 🚧 Next phase |
| Push notifications (ntfy.sh) | 🚧 Next phase |

## Vision

> **Every Christian deserves a Christ-centred family.**
> 每一个基督徒都值得拥有以基督为中心的家庭。

Mission: Helping Chinese Christians build covenant marriages, families and discipleship lives.

---
*Inspired by [SilverConnect-Global](https://github.com/lesliezhili/silverconnect-global) — non-profit elder care platform*
