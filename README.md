# SkillBridge

A full-stack tutoring and freelance marketplace where students find expert tutors, hire skilled freelancers, and let AI match them to the right person in seconds.

**Live site:** https://fe-gamma-seven.vercel.app

---

## Features

| Feature | Description |
|---------|-------------|
| Browse Tutors | Search and filter by subject, level, format, and hourly rate |
| Browse Services | Hire freelancers for design, development, writing, video, and more |
| AI Match | Answer 6 questions — Groq Llama 3.3 recommends real tutors or services from the database |
| Book & Review | Request sessions or orders, leave star ratings that update the average in real time |
| Save Tutors | Bookmark favourites, persisted to your profile |
| Blog | Study tips, career advice, and skill-building articles |
| User Accounts | Sign up as student, tutor, freelancer, or all three |
| Admin Dashboard | Manage users, listings, and blog posts |
| Dark Mode | Toggle with sun/moon button — persists across sessions, respects system preference |

---

## Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Frontend | Next.js 13 (Pages Router) + TypeScript | Full-stack framework |
| Styling | Tailwind CSS + Framer Motion | UI and animations |
| Auth + DB | Supabase | Authentication, PostgreSQL database, Row Level Security |
| AI | Groq SDK — Llama 3.3 70B | AI Match feature |
| Deployment | Vercel | Frontend + serverless API routes |

---

## Architecture

```
Browser
  │
  ▼
Next.js (Vercel)
  ├── /pages          → React pages (SSR via getServerSideProps)
  ├── /pages/api      → Serverless API routes (run on Vercel Edge)
  │     ├── tutors/   → CRUD for tutor listings
  │     ├── services/ → CRUD for service listings
  │     ├── blogs/    → Blog posts
  │     ├── bookings/ → Session/order requests
  │     ├── reviews/  → Star reviews
  │     ├── match.ts  → Groq AI recommendation endpoint
  │     └── ...
  └── /lib/supabase
        ├── client.ts → Browser Supabase client (anon key)
        └── server.ts → Server Supabase client (service role key, bypasses RLS)

Supabase (PostgreSQL)
  ├── auth.users      → Managed by Supabase Auth
  ├── profiles        → Extended user data (auto-created on signup via trigger)
  ├── tutors          → Tutor listings
  ├── services        → Service listings
  ├── bookings        → Session/order requests
  ├── reviews         → Star ratings
  ├── saved           → Bookmarked tutors
  ├── blogs           → Blog posts
  ├── categories      → Tutor subjects + freelance skills
  └── blog_categories → Blog post categories
```

### Data flow (example: browse tutors page)

1. User visits `/tutors`
2. Client fetches `/api/tutors?level=beginner&maxRate=50`
3. API route queries Supabase with the server client (service role, bypasses RLS)
4. Results are transformed (`snake_case → camelCase`) and returned as JSON
5. React renders `TutorCard` components with Framer Motion animations

### Auth flow

1. User signs up via Supabase Auth (`supabase.auth.signUp`)
2. Database trigger `handle_new_user` auto-creates a `profiles` row
3. Session is stored client-side by Supabase; `AuthContext` exposes `user` to all components
4. Protected API routes verify the Bearer token via `getUserFromToken()`

---

## Project Structure

```
skillbridge/
├── supabase/
│   └── schema.sql            # Full DB schema — run once in Supabase SQL Editor
│
├── seed.mjs                  # Demo data seeder (Node.js — run locally)
│
├── .claude/
│   └── commands/
│       ├── skill-advisor.md      # /skill-advisor — domain expert skill
│       └── generate-profiles.md  # /generate-profiles — Ralph Wiggum loop
│
└── fe/                       # Next.js app (deployed to Vercel)
    ├── src/
    │   ├── pages/
    │   │   ├── index.tsx         # Homepage — SSR with live stats + featured listings
    │   │   ├── tutors/
    │   │   │   ├── index.tsx     # Tutor listing with filters
    │   │   │   └── [id].tsx      # Tutor detail — book session + reviews
    │   │   ├── services/
    │   │   │   ├── index.tsx     # Service listing with filters
    │   │   │   └── [id].tsx      # Service detail — place order + reviews
    │   │   ├── blog/
    │   │   │   ├── index.tsx     # Blog listing
    │   │   │   └── [id].tsx      # Blog post detail
    │   │   ├── match.tsx         # AI Match wizard
    │   │   ├── profile.tsx       # User profile — edit, post listings, bookings
    │   │   ├── admin/index.tsx   # Admin dashboard
    │   │   ├── auth/
    │   │   │   ├── login.tsx
    │   │   │   └── signup.tsx
    │   │   └── api/              # Serverless API routes
    │   │       ├── tutors/
    │   │       ├── services/
    │   │       ├── blogs/
    │   │       ├── bookings/
    │   │       ├── reviews/
    │   │       ├── categories/
    │   │       ├── match.ts      # Groq AI endpoint
    │   │       └── user/
    │   ├── components/
    │   │   ├── Layout.tsx
    │   │   ├── Navbar.tsx        # Dark mode toggle
    │   │   ├── Footer.tsx
    │   │   ├── TutorCard.tsx
    │   │   ├── ServiceCard.tsx
    │   │   ├── BlogCard.tsx
    │   │   └── StarRating.tsx
    │   ├── context/
    │   │   ├── AuthContext.tsx   # Supabase session + user profile
    │   │   ├── ThemeContext.tsx  # Dark/light mode
    │   │   └── SavedContext.tsx  # Saved tutors
    │   ├── lib/
    │   │   └── supabase/
    │   │       ├── client.ts
    │   │       └── server.ts
    │   └── utils/
    │       ├── types.ts          # TypeScript interfaces
    │       ├── transform.ts      # Supabase row → typed object
    │       └── api.ts            # Axios instance
    └── .env.local.example
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier is fine)
- A [Groq](https://console.groq.com) API key (free)

### 1. Clone and install

```bash
git clone <repo-url>
cd skillbridge/fe
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New Query**, paste the contents of `supabase/schema.sql`, and run it
3. Go to **Authentication → Providers → Email** and **disable "Confirm email"** (for development)

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `fe/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
```

Find the Supabase keys at **Project Settings → API**.

### 4. Run the dev server

```bash
cd fe
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Seed demo data (optional)

```bash
# From the skillbridge/ root
node seed.mjs
```

Seeds 9 profiles, 8 tutors, 7 services, and 8 blog posts.

---

## API Reference

All endpoints are Next.js serverless API routes at `/api/...`.

### Tutors

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tutors` | — | List active tutors. Query params: `search`, `level`, `format`, `category`, `maxRate` |
| GET | `/api/tutors/[id]` | — | Get tutor by ID (includes profile + category) |
| POST | `/api/tutors` | Bearer | Create tutor listing |
| PUT | `/api/tutors/[id]` | Bearer | Update listing |
| DELETE | `/api/tutors/[id]` | Bearer | Delete listing |

### Services

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/services` | — | List active services. Query params: `search`, `category`, `maxPrice` |
| GET | `/api/services/[id]` | — | Get service by ID |
| POST | `/api/services` | Bearer | Create service listing |
| PUT | `/api/services/[id]` | Bearer | Update listing |
| DELETE | `/api/services/[id]` | Bearer | Delete listing |

### Blogs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blogs` | — | List all posts (newest first) |
| GET | `/api/blogs/[id]` | — | Get post by ID |
| POST | `/api/blogs` | Bearer | Create blog post |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/bookings` | Bearer | Get current user's bookings |
| POST | `/api/bookings` | Bearer | Create booking `{ listingId, listingType, message }` |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reviews/[listingId]?type=tutor\|service` | — | Get reviews for a listing |
| POST | `/api/reviews` | Bearer | Submit review `{ listingId, listingType, rating, comment }` |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories?type=subject\|skill` | List categories |
| GET | `/api/blogCategories` | List blog categories |

### AI Match

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/match` | Send `{ need, goal, level, budget, format, urgency }` → returns `{ recommendation, bestType, traits, matchedListings }` |

---

## Claude Code Features

### 1. `/skill-advisor` — Domain Expert Skill

A custom project skill in `.claude/commands/skill-advisor.md`. Invoke with `/skill-advisor` inside Claude Code to get an expert that understands the SkillBridge domain — tutoring, freelancing, subject areas — and can help generate listings, blog content, and seed data.

### 2. `/generate-profiles` — Ralph Wiggum Autonomous Loop

An autonomous loop skill in `.claude/commands/generate-profiles.md`. Run with `/loop generate-profiles` to have Claude autonomously generate realistic tutor and service profiles and POST them directly to the API. Demonstrates the Ralph Wiggum technique from the course rubric.

### 3. AI Match Feature (Groq + Llama 3.3 70B)

The `/match` page is the primary AI feature. Users answer 6 questions about what they need, their goal, level, budget, format preference, and urgency. The `/api/match` route sends these to Groq's Llama 3.3 70B model which returns a personalized recommendation, 4 traits to look for, and keyword extraction. The API then queries the database for real matching tutors or services and returns them alongside the recommendation.

---

## Deployment

The frontend + API are deployed as a single unit on Vercel.

### Deploy to Vercel

```bash
npm install -g vercel
cd fe
vercel --prod
```

Set these environment variables in the Vercel dashboard or via CLI:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GROQ_API_KEY
```

### Supabase (backend)

No separate backend deployment needed — Supabase is fully managed. The database, auth, and Row Level Security policies are defined in `supabase/schema.sql`.

---

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | Extended user data — name, role, bio, avatar. Auto-created on signup via trigger. |
| `tutors` | Tutor listings — subjects, level, rate, format, availability |
| `services` | Freelance service listings — title, price, delivery time, tags |
| `bookings` | Session/order requests between clients and listing owners |
| `reviews` | Star ratings (1–5) with comment, linked to tutor or service |
| `saved` | Many-to-many join of users and saved tutors |
| `blogs` | Blog posts with author and category |
| `categories` | Subjects (for tutors) and skills (for services) |
| `blog_categories` | Blog post categories |

Row Level Security is enabled on all tables. Users can only modify their own data. The service role key (used in API routes) bypasses RLS for admin operations.

---

## Environment Variables Reference

| Variable | Where | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `fe/.env.local` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `fe/.env.local` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | `fe/.env.local` | Supabase service role key (server-side only) |
| `GROQ_API_KEY` | `fe/.env.local` | Groq API key for AI Match |
