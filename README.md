# Football Academy LMS - Coach Education Platform

A modern, high-performance Learning Management System (LMS) specifically built for football academy coaches and technical management staff. Built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase SSR architecture.

---

## ⚽ Project Overview

**Football Academy LMS** enables academy coaches to:
- Access UEFA-accredited tactical education and sports science modules
- Watch HD tactical video lessons with downloadable session plans and drill templates
- Track personal learning progress across microcycles
- Complete interactive tactical quizzes with instant rationale feedback
- Earn and verify UEFA Academy Completion Certificates
- Provide technical directors with administrative management of users, courses, lessons, and quizzes

---

## 🎨 Visual Identity

Designed with a sleek, professional sports academy theme:
- **Primary Navy:** `#0b1329` (Deep Field Navy)
- **Card Background:** `#111c38` / `#1e293b` (Tactical Slate)
- **Accent Color:** `#10b981` (Pitch Emerald Green)
- Responsive layout optimized for desktop coaching stations, tablets, and mobile devices.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Backend / Auth:** Supabase (`@supabase/ssr` official SSR package)
- **Database:** PostgreSQL (with Row Level Security - RLS)
- **Linting:** ESLint

---

## 📁 Repository Structure

```
football-academy-lms/
├── src/
│   ├── app/
│   │   ├── admin/                # Admin Management Dashboard
│   │   ├── courses/              # Course Catalog Page
│   │   │   ├── [id]/             # Course Curriculum & Details
│   │   │   │   └── lessons/[lessonId]/ # Video Lesson & Quiz Page
│   │   ├── dashboard/            # Coach Dashboard
│   │   ├── login/                # Authentication Portal (Coach/Admin demo)
│   │   ├── profile/              # Coach Profile & Certificates Gallery
│   │   ├── globals.css           # Global Tailwind & Custom Scrollbars
│   │   ├── layout.tsx            # Root Layout
│   │   └── page.tsx              # Entry Redirect -> /dashboard
│   ├── components/
│   │   ├── layout/               # Navbar, Sidebar, BaseLayout
│   │   └── ui/                   # CourseCard, QuizCard, ProgressBar, StatCard, Badge
│   ├── lib/
│   │   ├── mock-data.ts          # Central Mock Data Layer for MVP
│   │   └── supabase/             # Client, Server, and Middleware @supabase/ssr helpers
│   └── types/
│       └── database.ts           # TypeScript interfaces for Database Entities
├── supabase/
│   └── schema.sql                # Complete PostgreSQL Schema & RLS Policies
├── .env.example                  # Environment Variables Template
├── package.json
└── tailwind.config.ts
```

---

## ⚡ Quick Start & Local Execution

### 1. Clone & Install Dependencies
```bash
cd football-academy-lms
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(Optional for MVP preview as rich mock data works out of the box).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Setup

To connect a live Supabase project:

1. Create a project at [Supabase.com](https://supabase.com).
2. Go to the SQL Editor in your Supabase dashboard.
3. Paste and run the complete schema script in [`supabase/schema.sql`](./supabase/schema.sql).
4. Copy your **Supabase Project URL** and **Anon Key** into `.env.local`.

---

## 🚀 Building & Linting

Verify production build and type checking:
```bash
npm run lint
npm run build
```

---

## 🔑 Demo Accounts (Quick Switch on `/login`)

- **Coach Role:** `marcus.vance@footballacademy.com`
- **Admin Role:** `elena.rostova@footballacademy.com`
