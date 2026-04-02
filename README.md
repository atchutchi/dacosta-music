# Da Costa Music

![Da Costa Music](public/images/logo-branco-dacosta.webp)

A modern, high-performance website for **Da Costa Music** — a creative agency and talent management company representing the next generation of African electronic music worldwide.

**Live:** [dacosta-music.com](https://www.dacosta-music.com)

---

## Table of Contents

- [Overview](#overview)
- [Artist Roster](#artist-roster)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Security](#security)
- [Deployment](#deployment)
- [License](#license)

## Overview

Da Costa Music is a creative agency and talent management company representing a new era of African electronic music. The website serves as the digital platform for the agency — showcasing artists, music, events and services. Built with a modern stack, it features a fully responsive design, integrated e-commerce, blog, event management, and a secure admin dashboard.

## Artist Roster

The agency currently represents **5 artists**:

| Artist | Genres | Highlights |
|--------|--------|------------|
| **Caiiro** | Afro House, Deep Tech, Afro Tech | 90M+ streams, performed in 30+ countries |
| **Da Capo** | Afro House, Deep House, Electronic | 85M+ streams, platinum-certified singles |
| **Enoo Napa** | Afro Tech, Tribal House, Progressive | Featured at Hï Ibiza, Circoloco, Scorpios Mykonos |
| **DJEFF** | Afro House, Electronic, House | Founder of Kazukuta Records, performed at Tomorrowland & Hï Ibiza |
| **BREYTH** | Afro House, Electronic, Deep House | 27M+ streams, creator of the 'Atmosphere' concept |

## Features

### Public Pages

- **Home** — Hero video, about section, artist roster grid (5 columns on desktop), music player, contact form
- **Artists** — Listing page with responsive grid + individual profile pages with full bio, gallery, stats, social links and live sets
- **B3B Concept** — Dedicated page for the Back-to-Back-to-Back performance format
- **Blog** — Full blog system with categories and rich formatting
- **Events** — Interactive calendar, show listings, ticket links
- **Services** — Turnkey Service, Worldwide Booking, Travel & Logistics, Artist Management, Branding, Finance & Admin
- **Shop** — Full e-commerce with Stripe/PayPal integration, cart, guest checkout, inventory management, admin panel
- **Legal** — Privacy Policy, Terms of Service

### Technical Capabilities

- **Authentication** — Supabase Auth with protected admin area
- **Admin Dashboard** — Event management, media uploads, shop/order management, site settings
- **Media Storage** — Supabase Storage with organised buckets (images, artists, events, videos)
- **Contact Form** — EmailJS integration with artist booking checkboxes, subject selection, validation
- **Security** — CSRF double-submit tokens, CSP nonce headers, rate limiting, Zod API validation, RLS policies, SVG sanitisation
- **SEO & Performance** — Dynamic sitemap, optimised meta tags, WebP/SVG images, lazy loading, PWA manifest
- **Responsive Design** — Mobile-first with Framer Motion animations and shadcn/ui components

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, TypeScript 5, Tailwind CSS 3, shadcn/ui, Framer Motion 12 |
| **Backend** | Next.js API Routes, Server Components, Server Actions |
| **Database** | Supabase (PostgreSQL), Supabase Auth, Supabase Storage |
| **Payments** | Stripe, PayPal |
| **Email** | EmailJS (contact form) |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

## Project Structure

```
dacosta-music/
├── app/                    # Next.js App Router
│   ├── actions/            # Server actions
│   ├── admin/              # Admin dashboard (protected)
│   ├── api/                # API routes (artists, checkout, orders, webhooks, etc.)
│   ├── artists/            # Artist listing + [slug] profile pages
│   ├── b3b/                # B3B concept page
│   ├── blog/               # Blog listing + [slug] post pages
│   ├── events/             # Events listing + [id] detail pages
│   ├── shop/               # E-commerce (products, cart, checkout, orders)
│   ├── login/              # Authentication
│   ├── register/           # User registration
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives
│   ├── calendar/           # Calendar components
│   ├── roster-section.tsx  # Artist roster grid (home page)
│   ├── contact-section.tsx # Contact form with artist booking
│   ├── footer.tsx          # Site footer with artist links
│   └── ...                 # Feature-specific components
├── lib/                    # Utilities and configuration
│   ├── supabase/           # Supabase client setup
│   ├── database.types.ts   # Generated Supabase types
│   ├── logger.ts           # Logging utility
│   └── utils.ts            # Helper functions
├── public/
│   ├── images/             # Static images (artist photos, logos, SVGs)
│   └── videos/             # Video assets
├── scripts/                # Database migration scripts
├── middleware.ts            # Edge middleware (proxy)
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json
```

## Database Schema

The application uses Supabase (PostgreSQL) with Row Level Security enabled on all tables.

### Core Tables

```sql
-- Artists
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  photo_url TEXT,
  logo_url TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  social_website TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  image_url TEXT,
  ticket_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event ↔ Artist (junction)
CREATE TABLE event_artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  UNIQUE(event_id, artist_id)
);

-- Albums
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  release_date DATE NOT NULL,
  cover_url TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracks
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL,
  audio_url TEXT,
  track_number INTEGER,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live Sets
CREATE TABLE live_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL,
  audio_url TEXT,
  cover_url TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase project

### Installation

```bash
git clone https://github.com/atchutchi/dacosta-music.git
cd dacosta-music
npm install
```

### Configuration

1. Copy `.env.local.example` to `.env.local` and fill in the values (see [Environment Variables](#environment-variables))
2. Set up the Supabase database using the scripts in `/scripts`
3. Configure Row Level Security policies

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=

# CSRF Protection
CSRF_SECRET=                          # Random string, min 32 chars

# EmailJS (contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

# Stripe (payments)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# PayPal (payments)
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=

# Admin
ADMIN_EMAIL=
EMAIL_FROM=
CONTACT_EMAIL=
```

> **Security:** Never commit `.env.local` or files containing credentials. Ensure all env files are in `.gitignore`.

## Security

The application implements multiple layers of security:

- **CSRF Protection** — Double-submit cookie pattern on all form submissions
- **Content Security Policy** — Nonce-based CSP headers via middleware
- **Rate Limiting** — Applied to API routes and email endpoints
- **Input Validation** — Zod schemas on all API routes; client-side validation on forms
- **Authentication** — Supabase Auth with protected admin routes
- **Database Security** — Row Level Security (RLS) enabled on all 21 public tables
- **SVG Sanitisation** — Guard against malicious SVG uploads
- **Webhook Verification** — Stripe and PayPal webhook signature validation

## Deployment

The project is optimised for **Vercel**:

1. Connect the GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy — Vercel automatically detects Next.js and applies optimal settings

## License

This project is proprietary and confidential. All rights reserved.

© 2023–2025 Da Costa Music | Developed by [ABIPTOM](https://www.abiptom.gw)
