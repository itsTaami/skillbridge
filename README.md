# SkillBridge

A full-stack tutoring and freelance marketplace where students find tutors, hire freelancers, and let AI match them to the perfect expert.

**Live site:** (deploy URL here)

---

## Features

- **Browse Tutors** — Filter by subject, level, format, and rate
- **Browse Services** — Hire freelancers for design, dev, writing, and more
- **AI Match** — Answer 6 questions, get a personalized recommendation (Groq / Llama 3.3)
- **Book & Review** — Request sessions or orders, leave star ratings
- **Save Tutors** — Bookmark favourites to your profile
- **Blog** — Study tips and career articles
- **User Accounts** — Sign up as student, tutor, freelancer, or all three
- **Admin Dashboard** — Manage users, listings, and blog posts

---

## Tech Stack

### Frontend (`/fe`)
| Tool | Purpose |
|------|---------|
| Next.js 13 (Pages Router) | Frontend framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Axios | API requests |
| Groq SDK | AI match feature |
| React Hot Toast | Notifications |

### Backend (`/be`)
| Tool | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| JWT + bcrypt | Authentication |
| Cloudinary + Multer | Image uploads |

---

## Project Structure

```
skillbridge/
├── .claude/
│   └── commands/
│       ├── skill-advisor.md     # /skill-advisor — domain expert skill
│       └── generate-profiles.md # /generate-profiles — Ralph Wiggum loop
│
├── fe/                          # Next.js frontend
│   ├── src/
│   │   ├── pages/               # Routes
│   │   │   ├── index.tsx        # Landing page
│   │   │   ├── tutors/          # Browse + detail
│   │   │   ├── services/        # Browse + detail
│   │   │   ├── match.tsx        # AI matcher
│   │   │   ├── blog/            # Blog list + detail
│   │   │   ├── profile.tsx      # User profile + post listing
│   │   │   ├── admin/           # Admin dashboard
│   │   │   ├── auth/            # Login + signup
│   │   │   └── api/match.ts     # Groq AI route
│   │   ├── components/          # Reusable UI
│   │   ├── context/             # Auth + Saved contexts
│   │   └── utils/               # api.ts + types.ts
│   └── .env.local               # Frontend env vars
│
└── be/                          # Express backend
    ├── app.ts                   # Entry point
    ├── models/                  # Mongoose schemas
    ├── controller/              # Route handlers
    ├── routes/                  # API routes
    ├── middlewares/             # Auth, logger, upload
    └── config/db.ts             # MongoDB connection
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database (MongoDB Atlas — free)
- Cloudinary account (free)
- Groq API key (free at console.groq.com)

### 1. Backend setup
```bash
cd be
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 2. Frontend setup
```bash
cd fe
npm install
cp .env.local.example .env.local
# Fill in your values in .env.local
npm run dev
```

Open http://localhost:3000

---

## API Documentation

Base URL: `http://localhost:4000`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/signup` | Register — `{ name, email, password, role }` |
| POST | `/user/signin` | Login — `{ email, password }` |

### Tutors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tutor` | List all (supports `?search=`, `?level=`, `?format=`, `?category=`, `?maxRate=`) |
| GET | `/tutor/filter/:categoryId` | Filter by category |
| GET | `/tutor/:id` | Get by ID |
| POST | `/tutor` | Create (auth required) |
| PUT | `/tutor/:id` | Update (auth required) |
| DELETE | `/tutor/:id` | Delete (auth required) |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/service` | List all (supports `?search=`, `?category=`, `?maxPrice=`) |
| GET | `/service/:id` | Get by ID |
| POST | `/service` | Create (auth required) |
| PUT | `/service/:id` | Update (auth required) |
| DELETE | `/service/:id` | Delete (auth required) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/booking` | Create booking (auth required) |
| GET | `/booking/my` | My bookings (auth required) |
| PATCH | `/booking/:id/status` | Update status |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/review` | Post a review (auth required) |
| GET | `/review/:listingId?type=tutor\|service` | Get reviews for a listing |

### Blog, Categories, Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/blog` | List / create posts |
| GET/POST | `/category` | List / create categories (`?type=subject\|skill`) |
| GET/POST | `/blogCategory` | List / create blog categories |
| POST | `/upload` | Upload image — multipart/form-data, field: `file` |

### Frontend API Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/match` | AI match — `{ need, goal, level, budget, format, urgency }` |

---

## Claude Code Features

### 1. Project Skill — `/skill-advisor`
Custom skill in `.claude/commands/skill-advisor.md`. Invoke with `/skill-advisor` to get a domain expert that can generate tutor profiles, service listings, blog posts, and seed data.

### 2. Ralph Wiggum Loop — `/generate-profiles`
Autonomous loop skill in `.claude/commands/generate-profiles.md`. Run with `/loop generate-profiles` to autonomously generate realistic tutor and service listings and POST them to the local API.

### 3. AI Match Feature
The `/match` page uses Groq Llama 3.3 70B to analyze 6 user answers and return a personalized recommendation (tutor vs service, what to look for, why).

---

## Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo at vercel.com → set root to `fe`
3. Add env vars: `NEXT_PUBLIC_API_URL`, `GROQ_API_KEY`
4. Deploy

### Backend → Railway or Vercel
- **Railway:** Set root to `be`, add env vars, deploy
- **Vercel:** `vercel.json` is already configured — add env vars and deploy

---

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | `fe/.env.local` | Backend API URL |
| `GROQ_API_KEY` | `fe/.env.local` | Groq API key for AI match |
| `MONGO_URI` | `be/.env` | MongoDB connection string |
| `JWT_SECRET` | `be/.env` | JWT signing secret |
| `CLOUD_NAME` | `be/.env` | Cloudinary cloud name |
| `API_KEY` | `be/.env` | Cloudinary API key |
| `API_SECRET` | `be/.env` | Cloudinary API secret |
| `PORT` | `be/.env` | Server port (default 4000) |
| `ALLOWED_ORIGINS` | `be/.env` | CORS origins (comma-separated) |
