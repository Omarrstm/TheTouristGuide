# TheTouristGuide

A travel review site: browse touristic places by country, rate and review them, and discover (or suggest) hidden gems that only locals know about — for when you don't know where to go on your next trip.

## Features

- **Browse by country** — every country has a page split into Popular Attractions and Hidden Gems.
- **Reviews** — 1–5 star ratings with an optional comment and photo; one review per person per place, editable/deletable by its author.
- **Suggest a place** — logged-in users can add a new attraction or hidden gem, with up to 5 photos, in any seeded country, and optionally pin its exact location via Google address autocomplete.
- **Tourist guides** — locals can register as a guide for a city/country; travelers can find them in a directory or on the country page and message them directly to plan a trip.
- **Auth** — email/password signup and login with session cookies.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Prisma 7](https://www.prisma.io) with the Postgres driver adapter (`@prisma/adapter-pg`)
- Tailwind CSS 4
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for photo uploads
- Google Maps Places API (New) for address autocomplete, Maps Embed API for the location shown on a place's page
- `jose` for session JWTs, `bcryptjs` for password hashing

## Getting started

### Prerequisites

- Node.js
- A PostgreSQL database (e.g. via `npx create-db` for a free hosted Prisma Postgres instance)
- A Vercel Blob store (only needed for photo uploads — everything else works without it)
- A Google Cloud API key with "Places API (New)" and "Maps Embed API" enabled, restricted to your domain(s) (only needed for the location-picker on place submission — everything else works without it)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with:

   ```bash
   DATABASE_URL=postgresql://...
   SESSION_SECRET=some-long-random-string
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...        # only needed for photo uploads
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...             # only needed for the location picker
   ```

3. Apply the database schema and seed the country list:

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Build for production     |
| `npm run start` | Run the production build |
| `npm run lint`  | Lint the codebase        |

## Data model

Defined in [`prisma/schema.prisma`](prisma/schema.prisma): `User`, `Session`, `Country`, `Place`, `PlacePhoto`, `Review`, `GuideProfile`, `Conversation`, `Message`. Countries are pre-seeded (see `prisma/seed.ts`) rather than created ad hoc, to keep the country picker clean.
