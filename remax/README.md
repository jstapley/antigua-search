# RE/MAX 365 Antigua — Next.js Website

A full-stack real estate website built with Next.js 14, Supabase, and Tailwind CSS.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your values:
```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (for admin writes)
- `ADMIN_PASSWORD` — Password for the admin dashboard

### 3. Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the contents of `supabase-schema.sql`
3. This creates the `properties`, `reviews`, and `faqs` tables with seed data

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── properties/
│   │   ├── page.tsx                # All properties listing
│   │   └── [slug]/page.tsx         # Individual property
│   ├── faq/page.tsx                # FAQ page
│   ├── contact/
│   │   ├── page.tsx                # Contact form
│   │   └── schedule/page.tsx       # Google Calendar booking
│   ├── admin/
│   │   ├── login/page.tsx          # Admin login
│   │   ├── page.tsx                # Admin dashboard
│   │   └── properties/
│   │       ├── page.tsx            # Properties list
│   │       ├── new/page.tsx        # Add property
│   │       └── [id]/page.tsx       # Edit property
│   └── api/
│       ├── contact/route.ts        # Contact form API
│       ├── schedule/route.ts       # Google Calendar API
│       └── admin/
│           ├── auth/route.ts       # Admin login/logout
│           └── properties/
│               ├── route.ts        # GET all, POST new
│               └── [id]/route.ts   # PUT update, DELETE
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── WhyInvestSection.tsx
│   │   ├── FeaturedPropertiesSection.tsx
│   │   ├── ReviewsSection.tsx
│   │   ├── FAQSection.tsx
│   │   └── CTASection.tsx
│   └── ui/
│       ├── PropertyCard.tsx
│       ├── FAQList.tsx
│       └── PropertyForm.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── types/index.ts
└── middleware.ts                   # Admin route protection
```

---

## 🔧 Key Features

### Public Site
- **Homepage** — Hero, Why Invest, Featured Properties, Reviews, FAQ
- **Properties** — Filterable grid of all listings pulled from Supabase
- **Property Detail** — Full page with image gallery, specs, contact sidebar
- **FAQ** — Accordion-style FAQ pulled from Supabase
- **Contact** — Form + Google Calendar meeting scheduler
- **Scheduling** — Built-in calendar UI that books directly to Google Calendar

### Admin Dashboard (password protected)
- Login at `/admin/login`
- View stats dashboard
- Add / Edit / Delete properties
- Upload images via Supabase Storage URLs

---

## 🗓 Google Calendar Integration

To enable real Google Calendar bookings:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project and enable the **Google Calendar API**
3. Create **OAuth 2.0 credentials** (Web Application type)
4. Use [OAuth Playground](https://developers.google.com/oauthplayground) to get a refresh token:
   - Authorize `https://www.googleapis.com/auth/calendar`
   - Exchange for refresh token
5. Add to `.env.local`:
   ```
   GOOGLE_CALENDAR_CLIENT_ID=...
   GOOGLE_CALENDAR_CLIENT_SECRET=...
   GOOGLE_CALENDAR_REFRESH_TOKEN=...
   GOOGLE_CALENDAR_ID=your@gmail.com
   ```
6. Install googleapis: `npm install googleapis`

---

## 🌐 Google Reviews (Optional Enhancement)

To pull live Google reviews:
1. Get your **Google Place ID** from [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
2. Enable the **Places API** in Google Cloud Console
3. Add `GOOGLE_MAPS_API_KEY` and `GOOGLE_PLACE_ID` to `.env.local`
4. Create an API route that fetches reviews and caches them in Supabase

---

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repository
3. Add all environment variables from `.env.local`
4. Deploy!

The app uses Next.js App Router with server components for optimal performance.

---

## 📧 Email Notifications (Recommended)

Add email notifications for contact form submissions using [Resend](https://resend.com):
```bash
npm install resend
```

Then update `src/app/api/contact/route.ts` with your Resend API key.
