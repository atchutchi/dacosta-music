# Da Costa Music Website

![Da Costa Music](public/images/logo-branco-dacosta.png)

A modern, responsive website for Da Costa Music, a creative agency and talent management company representing a new era of African electronic music.

🌐 **Live Website**: [https://www.dacosta-music.com](https://www.dacosta-music.com)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Security Considerations](#security-considerations)
- [Proposed Improvements](#proposed-improvements)
- [License](#license)

## Overview

Da Costa Music website serves as a digital platform for the agency to showcase their artists, music, events, and services. The website features a modern, responsive design with a focus on visual appeal and user experience.

## Features

- **Home Page**: Dynamic hero section, artist roster, music player, and contact form
- **Artist Profiles**: Detailed pages for each artist with biography, music, events, and gallery
- **B3B Concept**: Dedicated page for the unique Back-to-Back-to-Back DJ concept
- **Blog**: Articles and news about artists, events, and the electronic music scene
- **Shop**: E-commerce functionality for merchandise and music
- **Events**: Calendar and detailed event pages
- **Contact Form**: With form validation and reCAPTCHA integration
- **Authentication**: User registration and login system for admin access
- **Media Storage**: Supabase Storage integration for images and videos
- **Responsive Design**: Mobile-first approach for all screen sizes

## Technology Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion (animations)
  - Lucide React (icons)
  - shadcn/ui (UI components)

- **Backend**:
  - Next.js API Routes
  - Server Components and Server Actions
  - Supabase (PostgreSQL database)
  - Supabase Auth
  - Supabase Storage (media files)

- **Deployment**:
  - Vercel (recommended)

## Project Structure

\`\`\`
da-costa-music/
├── app/                  # Next.js App Router pages and API routes
│   ├── actions/          # Server actions
│   ├── admin/            # Admin dashboard pages
│   ├── api/              # API routes
│   ├── artists/          # Artist pages
│   ├── b3b/              # B3B concept page
│   ├── blog/             # Blog pages
│   ├── events/           # Events pages
│   ├── login/            # Authentication pages
│   ├── register/         # User registration
│   ├── shop/             # E-commerce pages
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── calendar/         # Calendar components
│   ├── ui/               # UI components (shadcn/ui)
│   └── [feature].tsx     # Feature-specific components
├── lib/                  # Utility functions and configurations
│   ├── database.types.ts # Supabase database types
│   ├── supabase/         # Supabase client configurations
│   └── utils.ts          # Helper functions
├── public/               # Static assets
│   ├── images/           # Image files
│   └── videos/           # Video files
├── scripts/              # Database scripts
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Project dependencies
\`\`\`

## Database Schema

The application uses Supabase (PostgreSQL) with the following schema:

### Artists Table
\`\`\`sql
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  photo_url TEXT,
  logo_url TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  social_website TEXT,
  featured BOOLEAN DEFAULT false
);
\`\`\`

### Events Table
\`\`\`sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  ticket_url TEXT,
  featured BOOLEAN DEFAULT false
);
\`\`\`

### Event Artists (Junction Table)
\`\`\`sql
CREATE TABLE event_artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  UNIQUE(event_id, artist_id)
);
\`\`\`

### Albums Table
\`\`\`sql
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title VARCHAR(255) NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  release_date DATE NOT NULL,
  cover_url TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT false
);
\`\`\`

### Tracks Table
\`\`\`sql
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title VARCHAR(255) NOT NULL,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL, -- Duration in seconds
  audio_url TEXT,
  track_number INTEGER,
  featured BOOLEAN DEFAULT false
);
\`\`\`

### Live Sets Table
\`\`\`sql
CREATE TABLE live_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title VARCHAR(255) NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL, -- Duration in seconds
  audio_url TEXT,
  cover_url TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT false
);
\`\`\`

### User Profiles Table
\`\`\`sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## Setup Instructions

### Prerequisites

- Node.js 18.x or later
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/da-costa-music.git
cd da-costa-music
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the required environment variables (see [Environment Variables](#environment-variables))

4. Set up the database:
   - Create a new Supabase project
   - Run the database setup scripts from the `scripts` directory
   - Configure Row Level Security (RLS) policies

5. Start the development server:
\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

\`\`\`bash
npm run build
# or
pnpm build
\`\`\`

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_public_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# CSRF Protection
CSRF_SECRET=your_csrf_secret_a_random_string_min_32_chars

# EmailJS for contact form
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Admin contact emails
ADMIN_EMAIL=admin@yourdomain.com
EMAIL_FROM=no-reply@yourdomain.com
CONTACT_EMAIL=contact@yourdomain.com
\`\`\`

> **Important Security Note:** Never commit your `.env.local` file or any file containing sensitive credentials to your repository. Make sure `setup-env.js` and all environment files are included in your `.gitignore` file.

## Security Considerations

The current implementation includes several security measures:

1. **Authentication**: Supabase Auth for user authentication
2. **Row Level Security (RLS)**: Database-level security policies
3. **Form Validation**: Client-side and server-side validation
4. **reCAPTCHA**: Protection against bots for the contact form
5. **Environment Variables**: Sensitive information stored in environment variables
6. **CSRF Protection**: Implementation of CSRF tokens for forms

## Proposed Improvements

### Security Improvements

1. **Content Security Policy (CSP)**: Implement a strict CSP to prevent XSS attacks
2. **Rate Limiting**: Add rate limiting to API routes to prevent abuse
3. **Input Sanitization**: Add server-side input sanitization for all user inputs
4. **Two-Factor Authentication (2FA)**: Add 2FA for admin users
5. **Audit Logging**: Implement comprehensive logging for security events
6. **Regular Security Audits**: Schedule regular security audits of the codebase

### Functional Improvements

1. **SEO Optimization**:
   - Add dynamic meta tags for better SEO
   - Implement structured data (JSON-LD)
   - Create a sitemap.xml and robots.txt

2. **Performance Optimization**:
   - Implement image optimization with Next.js Image component
   - Add lazy loading for images and components
   - Implement code splitting and bundle optimization

3. **Enhanced User Experience**:
   - Add dark/light mode toggle
   - Implement skeleton loading states
   - Add more animations and transitions
   - Improve accessibility (ARIA attributes, keyboard navigation)

4. **Content Management**:
   - Develop a full-featured CMS for content editors
   - Add rich text editing for blog posts
   - Implement media library for images and videos

5. **E-commerce Enhancements**:
   - Integrate a payment gateway (Stripe, PayPal)
   - Add order management system
   - Implement inventory management
   - Add product reviews and ratings

6. **Social Features**:
   - Add social sharing buttons
   - Implement comments on blog posts
   - Create user profiles for fans
   - Add event RSVPs and reminders

7. **Analytics and Insights**:
   - Integrate Google Analytics or Plausible
   - Add custom dashboards for artist performance
   - Implement event tracking
   - Create automated reports

8. **Multilingual Support**:
   - Add internationalization (i18n)
   - Implement language switcher
   - Create translated content

9. **Mobile App**:
   - Develop a companion mobile app using React Native
   - Add push notifications for events and releases
   - Implement offline access to purchased music

10. **API Improvements**:
    - Create a comprehensive API documentation
    - Implement API versioning
    - Add GraphQL support for more flexible queries

## License

This project is proprietary and confidential. All rights reserved by Da Costa Music.

© 2023-2024 Da Costa Music

## Storage Structure

The application uses Supabase Storage with the following bucket organization:

- **images**: General purpose images
- **artists**: Artist photos and logos
- **events**: Event images and promotional materials
- **videos**: Video content and media files

Each bucket is configured with appropriate permissions and public access settings through Supabase's Row Level Security (RLS) policies.
