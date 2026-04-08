# Clinic Web App

A full-stack clinic website built with **Next.js 16**, **Supabase**, and **Tailwind CSS v4**. It provides a patient-facing website with online appointment booking, doctor/service listings, a blog, and an admin panel for managing appointments and doctor availability.

---

## Tech Stack

| Layer           | Technology                  |
| --------------- | --------------------------- |
| Framework       | Next.js 16 (App Router)     |
| Language        | TypeScript 5                |
| Styling         | Tailwind CSS v4             |
| Database & Auth | Supabase (PostgreSQL + RLS) |
| Forms           | React Hook Form + Zod       |
| Animations      | Framer Motion               |
| 3D Hero         | React Three Fiber + Drei    |
| Icons           | Lucide React                |
| UI Primitives   | Radix UI                    |
| Analytics       | Vercel Analytics            |
| Formatting      | Prettier                    |
| Linting         | ESLint (Next.js config)     |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone <repo-url>
cd clinic-webapp
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

> The `SUPABASE_SERVICE_ROLE_KEY` is only used server-side for admin operations and is never exposed to the browser.

### 3. Set up the database

Run the SQL schema in your Supabase project's SQL editor:

```bash
# Copy the contents of supabase/schema.sql and run it in the Supabase SQL editor
```

This creates all tables, indexes, RLS policies, and the overlap-prevention constraint. See [Database Schema](#database-schema) for details.

### 4. Seed mock data (optional)

```bash
npx ts-node scripts/seed.ts
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start the development server   |
| `npm run build`  | Build for production           |
| `npm run start`  | Start the production server    |
| `npm run lint`   | Run ESLint                     |
| `npm run format` | Format all files with Prettier |

---

## Project Structure

```
clinic-webapp/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Homepage
│   ├── layout.tsx              # Root layout (Header, Footer)
│   ├── about/                  # About page
│   ├── appointments/           # Patient booking page
│   ├── blog/                   # Blog listing + [slug] detail
│   ├── careers/                # Job listings
│   ├── contact/                # Contact form
│   ├── departments/            # Departments listing
│   ├── doctors/                # Doctor listing + [id] profile
│   ├── faq/                    # FAQ page
│   ├── pricing/                # Pricing table
│   ├── services/               # Service listing + [slug] detail
│   ├── testimonials/           # Patient testimonials
│   ├── admin/                  # Admin panel (protected)
│   │   ├── login/              # Admin login
│   │   ├── appointments/       # View & manage appointments
│   │   └── availability/       # Manage doctor schedules
│   ├── api/                    # API route handlers
│   │   ├── appointments/       # GET/POST appointments, PATCH [id]
│   │   ├── doctors/            # GET doctors, GET [id]
│   │   ├── services/           # GET services
│   │   └── admin/availability/ # Admin availability endpoints
│   ├── robots.ts               # Robots.txt generation
│   ├── sitemap.ts              # Sitemap generation
│   ├── error.tsx               # Global error boundary
│   ├── loading.tsx             # Global loading UI
│   └── not-found.tsx           # 404 page
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Responsive sticky header with scroll-aware styling
│   │   ├── Footer.tsx          # Site footer
│   │   └── PageTransition.tsx  # Framer Motion page transitions
│   ├── home/
│   │   ├── HeroSection.tsx     # Homepage hero with 3D canvas
│   │   ├── HeroCanvas.tsx      # Three.js 3D background
│   │   └── ScrollReveal.tsx    # Scroll-triggered reveal animations
│   ├── booking/
│   │   └── BookingWizard.tsx   # Multi-step appointment booking form
│   └── ui/
│       └── index.tsx           # Shared UI primitives (Button, Input, etc.)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server-side Supabase client (SSR)
│   ├── availability.ts         # Time slot generation logic
│   ├── mockContent.ts          # Helpers to read from mock.json
│   ├── schemas.ts              # Zod validation schemas
│   └── utils.ts                # Utility functions (cn, etc.)
│
├── data/
│   └── mock.json               # Static CMS content (doctors, services, blog, etc.)
│
├── types/
│   └── index.ts                # All TypeScript interfaces and types
│
├── supabase/
│   └── schema.sql              # Full PostgreSQL schema with RLS
│
├── scripts/
│   └── seed.ts                 # Database seeding script
│
├── public/                     # Static assets
├── .env.local                  # Environment variables (not committed)
├── next.config.ts              # Next.js configuration
├── tailwind.config             # Tailwind CSS v4 (via PostCSS)
└── tsconfig.json               # TypeScript configuration
```

---

## Database Schema

The Supabase PostgreSQL schema (`supabase/schema.sql`) includes the following tables:

### Tables

| Table                 | Description                                |
| --------------------- | ------------------------------------------ |
| `doctors`             | Doctor profiles with specialties           |
| `services`            | Medical services with pricing and duration |
| `departments`         | Clinic departments                         |
| `doctor_services`     | Many-to-many: doctors ↔ services           |
| `doctor_availability` | Weekly recurring schedule per doctor       |
| `doctor_time_off`     | PTO / exceptions to the weekly schedule    |
| `appointments`        | Patient bookings with status tracking      |

### Appointment Status Flow

```
booked → confirmed → completed
                  ↘ no_show
       → cancelled
```

### Overlap Prevention

The schema uses a PostgreSQL `EXCLUDE USING gist` constraint on the `appointments` table. It generates a `tstzrange` column (`timeslot`) from `start_ts` and `end_ts`, then prevents any two active (`booked` or `confirmed`) appointments for the same doctor from overlapping at the database level. The API catches error code `23P01` and returns HTTP `409` with `{ "error": "SLOT_TAKEN" }`.

### Row Level Security (RLS)

- **Public (anon):** Can read doctors, services, departments, availability, and time-off. Can insert new appointments with `status = 'booked'`.
- **Authenticated patients:** Can read their own appointments matched by email.
- **Admin:** Uses the `SUPABASE_SERVICE_ROLE_KEY` server-side to bypass RLS for full management access.

---

## Key Features

### Patient-Facing

- **Homepage** — 3D animated hero, service highlights, doctor showcase, testimonials
- **Services** — Full listing with category filters and individual detail pages
- **Doctors** — Profiles with specialties, education, languages, and ratings
- **Departments** — Clinic department overview
- **Appointment Booking** — Multi-step wizard: select service → select doctor → pick date/time → enter patient details
- **Blog** — Articles with slug-based routing
- **FAQ** — Categorized frequently asked questions
- **Pricing** — Self-pay and insurance estimate table
- **Testimonials** — Patient reviews
- **Careers** — Open job listings
- **Contact** — Contact form with clinic info

### Admin Panel (`/admin`)

- Protected login page
- View and manage all appointments (confirm, cancel)
- Manage doctor weekly availability schedules
- Manage doctor time-off / PTO

### SEO

- Auto-generated `sitemap.xml` via `app/sitemap.ts`
- Auto-generated `robots.txt` via `app/robots.ts`

---

## Header Behavior

The header is transparent with white text on the **homepage** only (where a dark 3D hero sits behind it). On all other pages it renders with a solid white background and dark text immediately. On the homepage, it transitions to a solid white background once the user scrolls past 20px.

---

## Environment Variables Reference

| Variable                        | Required | Description                                  |
| ------------------------------- | -------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Your Supabase project URL                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Supabase anon/public key (safe for browser)  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Yes      | Supabase service role key (server-side only) |

---

## Deployment

The easiest way to deploy is with [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repo in Vercel
3. Add the three environment variables in the Vercel project settings
4. Deploy

Make sure your Supabase project's RLS policies and schema are applied before going live.

For other platforms, run:

```bash
npm run build
npm run start
```
