<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)"  srcset="docs/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="docs/logo-light.png">
    <img alt="Nestoria" src="docs/logo-light.png" width="320">
  </picture>
</h1>

<p align="center">
  <strong>Stays for the quietly curious.</strong><br/>
  A boutique-hotel booking platform for India — search, book, host, review.<br/>
  Editorial design system. Light + dark mode. Open source.
</p>

<p align="center">
  <a href="docs/SETUP.md">Setup</a> ·
  <a href="#features-in-depth">Features</a> ·
  <a href="docs/API.md">API</a> ·
  <a href="docs/ARCHITECTURE.md">Architecture</a> ·
  <a href="docs/DEPLOYMENT.md">Deploy</a>
</p>

---

## Table of contents

- [Why Nestoria](#why-nestoria)
- [What it does at a glance](#what-it-does-at-a-glance)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Install](#install)
  - [Option 1 — Local development](#option-1--local-development) (full hand-holding in [docs/SETUP.md](docs/SETUP.md))
  - [Option 2 — Deploy to Render](#option-2--deploy-to-render) (full walkthrough in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md))
- [Configuration](#configuration)
- [Features in depth](#features-in-depth)
- [Project layout](#project-layout)
- [Storage & settings](#storage--settings)
- [Privacy & data](#privacy--data)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

---

## Why Nestoria

Most hotel booking apps look — and feel — like booking apps. Loud price banners, "8 people are looking at this hotel right now", tabs full of upsells. They're optimised for transactional volume, not for the slow, considered way people actually plan trips.

Nestoria is the opposite. It's a small, opinionated platform for **independent Indian stays** — restored havelis, beach houses, plantation bungalows, desert guesthouses — presented like a travel journal rather than a marketplace.

Built around three principles:

- **Editorial first** — every screen feels like a magazine spread. Long line lengths, serif display type (Instrument Serif), monospace for data (JetBrains Mono), generous white space, and a warm cream/ink palette that works in both light and dark mode.
- **Open and self-hostable** — every line of code is here. The full stack runs on a free tier (Render + Supabase). You can fork it and run your own collection.
- **Honest data model** — Hosts own properties; properties have rooms; customers book rooms; reviews update ratings via Bayesian-smoothed triggers. No marketplace fees, no surge pricing, no fake urgency.

---

## What it does at a glance

- **Browse** 8+ curated stays across India — Udaipur, Goa, Coorg, Munnar, Jaisalmer, Auroville
- **Search and filter** by location, price stepper, rating, region, or amenity — with a type-to-suggest Where popover and a real date-range calendar
- **Read** rich hotel detail pages with 5 tabs: Overview, Amenities, Rooms, Reviews, Location (live Leaflet map at the real lat/lng)
- **Save** hotels to a server-side favourites list that survives device switches and works for customers and hosts
- **Book** in a 3-step wizard with a simulated payment terminal (card / UPI / pay-at-hotel) and a per-reservation detail page at `/reservations/:id`
- **Review** completed stays — separate ratings for the hotel and the room, with auto-recomputed averages
- **Sign in** with email + password (bcrypt) or Google (Google Identity Services)
- **Host workspace** — 5-tab dashboard (Overview, Properties, Bookings, Earnings, Profile) with KPI cards, revenue chart, and a filterable bookings table; onboarding banner gates listing until the host's business profile is complete
- **List a property** via a 3-step wizard — basics, address + amenities + **interactive Leaflet map pinpoint**, rooms (with name, type, special amenities, and image upload to Supabase Storage); publish disabled until at least one room exists
- **Switch themes** — light / dark with FOUC-free initial render, plus 5 swappable accent palettes (Terracotta, Forest, Ink, Saffron, Plum)

---

## Tech stack

| Layer | Technology | Why |
|---|---|---|
| Database | PostgreSQL 14+ | Robust, free, supports the rating triggers cleanly |
| Backend | Node 18+ · Express 4 | Tiny, predictable, no magic |
| Auth | `bcryptjs` + `jsonwebtoken` + `google-auth-library` | Email/password + Google ID token verification, no third-party SDKs |
| Object storage | Supabase Storage | Free tier, S3-compatible, RLS-friendly |
| Frontend | React 18 + Vite 5 | Sub-second HMR, zero server runtime |
| Routing | `react-router-dom` v6 | Industry standard |
| Data layer | `@tanstack/react-query` | Caching, dedup, optimistic updates |
| Forms | `react-hook-form` + `zod` | Type-safe forms, zero re-render cost |
| Maps | `leaflet` + OpenStreetMap tiles | No API key, vector-quality, ~40 KB gzipped |
| Styling | Hand-rolled CSS with OKLCH variables | Editorial design needs hand-tuned colour, not utility classes |
| Hosting | Render (web + static + Postgres) | Free tier, blueprint-driven |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the longer "why" behind each choice.

---

## Requirements

| | what | how to check |
|---|---|---|
| **Node.js 20+** | runtime for backend + Vite | `node --version` |
| **npm** | comes with Node | `npm --version` |
| **PostgreSQL 14+** | the database | `psql --version` |
| **Git** | to clone the repo | `git --version` |
| **A modern browser** | Chrome 110+, Safari 16+, Firefox 110+ — the design uses `oklch()` and `color-mix()` | — |

Anything that prints "command not found" is something you need to install. **The hand-held walkthrough is in [docs/SETUP.md](docs/SETUP.md)** and covers every prerequisite from scratch, including the Postgres install paths discussed below.

> ⚠️ **`pgAdmin` alone is not a Postgres server** — it's only a GUI client. You still need an actual Postgres server. See the [Postgres install paths](#postgres-install-paths) below.

Optional but recommended:

- **Supabase project** with a public `hotel-images` bucket — required only for image uploads
- **Google OAuth Client ID** — required only for Google sign-in

---

## Install

### Option 1 — Local development

For hacking on the code with hot reload on the frontend and `nodemon` on the backend. The full walkthrough — including how to install every prerequisite from a blank Mac — is in [**docs/SETUP.md**](docs/SETUP.md). The TL;DR:

#### Postgres install paths

Pick one. Detailed instructions for each are in [docs/SETUP.md → Step 2](docs/SETUP.md#step-2--install-postgresql).

| Path | Best for | Install |
|---|---|---|
| **[Postgres.app](https://postgresapp.com)** ⭐ | Mac users who want a GUI menu-bar app | Drag to `/Applications`, click **Initialize** |
| **Homebrew** | Mac users who already use Homebrew | `brew install postgresql@16 && brew services start postgresql@16` |
| **Docker** | Anyone who already uses Docker | `docker run -d --name nestoria-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nestoria_db -p 5432:5432 postgres:16-alpine` |
| **Cloud (Supabase / Neon / Render)** | No local install at all | Sign up, copy the connection string into `backend/.env`, set `DB_SSL=true` |

Already have **pgAdmin** but no server? pgAdmin is just the GUI client — you still need one of the four paths above. The good news: pgAdmin ships a bundled `psql` at `/Applications/pgAdmin 4.app/Contents/SharedSupport/psql` you can add to PATH if you don't want a second one, **and** you can use pgAdmin's GUI Query Tool to load the schema files. Step-by-step pgAdmin instructions are in [docs/SETUP.md → Method 2](docs/SETUP.md#method-2-pgadmin-4-gui).

#### Once Postgres is up

```sh
# 1. Clone
git clone https://github.com/Avaneesh40585/Nestoria.git
cd Nestoria

# 2. Create + seed the database
createdb nestoria_db
psql nestoria_db -f database/001_schema.sql
psql nestoria_db -f database/002_triggers.sql
psql nestoria_db -f database/004_seed.sql      # optional sample data

# 3. Backend
cd backend
cp .env.example .env
# Edit .env: DB_USER + DB_PASSWORD to match your Postgres, JWT_SECRET=$(openssl rand -base64 48)
npm install
npm run dev
# → http://localhost:5000/api/health

# 4. Frontend (in a new terminal)
cd ../frontend
cp .env.example .env
npm install
npm run dev
# → http://localhost:5173
```

### Sample credentials

Every account loaded by `004_seed.sql` uses the password **`password123`** (bcrypt cost 10). Toggle **"I'm travelling"** on the sign-in screen for customer accounts and **"I'm hosting"** for host accounts — the role determines which table is queried, so the wrong toggle returns "Invalid credentials" even with the right email.

| Role | Email | Password |
|---|---|---|
| Host | `vikram@marigold.in` | `password123` |
| Host | `priya@casapamparo.in` | `password123` |
| Host | `arjun@cardamom.in` | `password123` |
| Customer | `customer1@nestoria.dev` … `customer50@nestoria.dev` | `password123` |

Verify the hashes load cleanly any time with:

```sh
NODE_PATH=backend/node_modules node scripts/check-seed-passwords.js
# expect:  53 pass · 0 fail · 0 skipped (Google-only)
```

> 💡 **Don't want sample data?** Skip step `004_seed.sql`. You can register fresh accounts through the UI.
>
> 💡 **`psql: command not found`?** Postgres.app and Homebrew put `psql` somewhere your shell doesn't search. Add it to `PATH` — see [docs/SETUP.md → Step 3](docs/SETUP.md#step-3--make-psql-available).
>
> 💡 **Hate the CLI?** [docs/SETUP.md → Method 2](docs/SETUP.md#method-2-pgadmin-4-gui) shows how to load the schema entirely through pgAdmin's GUI Query Tool.

### Option 2 — Deploy to Render

Render's free tier hosts the backend, frontend, and Postgres in one click via `render.yaml`.

```sh
git clone https://github.com/Avaneesh40585/Nestoria.git
cd Nestoria
# Push to your own GitHub repo
```

Then follow the detailed walkthrough in [**docs/DEPLOYMENT.md**](docs/DEPLOYMENT.md). The short version:

1. Create accounts at Render and Supabase (free, no card)
2. New Render Blueprint from your fork → Render reads `render.yaml`
3. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `GOOGLE_CLIENT_ID` in the Render dashboard
4. Visit `https://nestoria-frontend.onrender.com`

The backend self-initialises on first boot — `npm start` runs [`backend/init-db.js`](backend/init-db.js), which notices the empty Postgres and loads the schema + seed (8 hotels, 50 customers, real Unsplash photos). Subsequent deploys see the populated database and skip. When you're ready to take real bookings, wipe the demo data with `scripts/wipe-seed.js --yes` — see [docs/DEPLOYMENT.md → 5a](docs/DEPLOYMENT.md#5a-removing-the-seed).

Total time: ~10 minutes.

---

## Configuration

Both `backend/.env.example` and `frontend/.env.example` are committed. Copy each to `.env` and fill in real values.

### Backend (`backend/.env`)

| key | required | default | notes |
|---|---|---|---|
| `PORT` | yes | `5000` |  |
| `CORS_ORIGIN` | yes | `http://localhost:5173` | comma-separated for multiple origins |
| `DB_HOST` · `DB_PORT` · `DB_NAME` · `DB_USER` · `DB_PASSWORD` | yes | — | PostgreSQL connection |
| `DB_SSL` | no | `false` | set `true` on Render or any managed Postgres requiring TLS |
| `JWT_SECRET` | yes | — | use `openssl rand -base64 48` to generate |
| `JWT_EXPIRES_IN` | no | `7d` | any value `jsonwebtoken` accepts |
| `SUPABASE_URL` | optional | — | needed only for image uploads |
| `SUPABASE_SERVICE_ROLE_KEY` | optional | — | service role, NOT anon |
| `SUPABASE_BUCKET_NAME` | optional | `hotel-images` |  |
| `GOOGLE_CLIENT_ID` | optional | — | needed only for Google sign-in |
| `UNSPLASH_ACCESS_KEY` | optional | — | needed only to **re-curate** the demo imagery via `scripts/fetch-hotel-photos.js`; the running app does not call Unsplash |

### Frontend (`frontend/.env`)

| key | required | default | notes |
|---|---|---|---|
| `VITE_API_URL` | yes | `http://localhost:5000/api` | include the `/api` suffix |
| `VITE_GOOGLE_CLIENT_ID` | optional | — | must match the backend's `GOOGLE_CLIENT_ID` |

---

## Features in depth

### Editorial design system

The visual language is built around three typefaces and one strong accent colour:

- **Instrument Serif** for display headings — italicised pulls in the hero ("quietly curious")
- **Geist** for body text and UI chrome
- **JetBrains Mono** for data — prices, dates, reservation IDs, eyebrows

The palette is defined in `OKLCH` for perceptual uniformity and `color-mix()` for tinting:

- Light mode: warm cream `oklch(0.985 0.006 80)` background, dark ink `oklch(0.18 0.012 60)` text
- Dark mode: deep ink `oklch(0.14 0.008 60)` background, warm cream text
- Five accent presets (Terracotta default, Forest, Ink, Saffron, Plum) each with separate light/dark values

Mode is toggled via a sliding pill in the header. Accent is picked from a floating Tweaks panel (bottom-right). Both persist to `localStorage` and apply with no flash of unstyled content thanks to an inline script in `index.html`.

### Search and filters

The home-page SearchBar is a self-contained pill with three editorial popovers (all portal-rendered above the page so they never get clipped):

- **Where** — text input with a type-only suggestion list pulled from `/api/hotels/destinations`. Empty submit is blocked with an inline `var(--danger)` hint.
- **Dates** — custom two-month range calendar (built on `date-fns`), past days greyed out, range fill + endpoint pills in the accent colour.
- **Guests** — popover wrapping the shared `Stepper` component.

The `/hotels` page combines server-side and client-side filtering:

- Server filters: `location`, `min_price`, `max_price`, `min_rating`, `sort`
- Client filters: region multi-select, amenity multi-select
- Sort options: Featured (Bayesian score), Rating, Price ↑, Price ↓ — synced both ways with the `?sort=` URL param, so footer "Top rated" / "Featured stays" links land on the right pill
- Price range uses a min/max `Stepper` pair (±₹500), no more chip presets

The home page also surfaces five popular city chips (Udaipur, Goa, Coorg, Munnar, Auroville) that pre-fill the search bar.

### Hotel detail with 5 tabs

Each hotel has its own `/hotel/:slug` route with a tabbed body and a sticky booking sidebar:

1. **Overview** — long-form description plus a four-up Quick Facts row (check-in/out times, rooms, host)
2. **Amenities** — grid of every amenity with the matching icon
3. **Rooms** — every room listed with type, view, beds, size, price, and a **Reserve** button that deep-links into the booking wizard
4. **Reviews** — the latest 20 reviews with avatar initials and dates; aggregate rating up top
5. **Location** — Leaflet map with an OSM tile layer, centred on the property's real `latitude` / `longitude` (seeded in `database/007_hotel_coords.sql`); "Open in OpenStreetMap" link for full-page view

The sidebar mirrors the design's `book-card`: live nights × rooms calculation, 18% GST line, and total. Picking a room scrolls the sidebar's reserve action to that room's price. The Save heart and Reserve button route anonymous users to `/login?next=<current-path>` and bounce them back after sign-in; host-role users get a friendly "Hosts can't book on Nestoria" message instead of a silent failure.

### 3-step booking wizard

1. **Guest details** — name, email, phone, arrival time, special notes (pre-filled from the logged-in user)
2. **Payment** — Card / UPI / Pay-at-hotel chips. Card + expiry + CVV inputs are masked and digit-formatted. Confirming Card or UPI opens a portal-mounted **payment terminal overlay** that walks through `Authorising → Contacting bank → Approved` (UPI variant: `Generating collect request → Awaiting approval → Confirmed`) before triggering the actual booking mutation. Pay-at-hotel skips the terminal. Integrating a real PSP is still on the [roadmap](#roadmap) — the simulation gives the editorial feel without one.
3. **Confirmation** — checkmark, reservation reference (`NSTRA-000123`), one-click "View reservation" → `/reservations/:id` or back to home

The booking POSTs to `/api/bookings`, which locks the room row, checks for date overlap, and inserts atomically. Concurrent attempts to book the same room for overlapping dates return `409 Conflict`.

### Reservation detail screen

Each booking has its own `/reservations/:id` page — status pill, ref code, hotel hero + room summary, dates + guests grid, property phone, and a receipt sidebar with subtotal / taxes / total / payment status. Cancel from here uses the same `PUT /api/bookings/:id/cancel` endpoint as the profile list. Profile's per-row View button and the booking confirmation's "View reservation" CTA both land here.

### Server-side favourites (Save heart)

Saved hotels persist per `(user_id, role)` in the `saved_hotels` table — the heart works for both customer and host accounts, and the list survives device switches. The `useSavedHotels` hook drives every heart on the site through TanStack Query with optimistic updates. Anonymous clicks bounce to login with a `next` param so the user lands back on the page they were saving from.

### Reviews with Bayesian rating

Reviews are tied to completed bookings — you can't review a hotel you didn't stay at, and you can only review each booking once. Each insert/update/delete fires a Postgres trigger that recomputes:

- `rating_avg` — straight `AVG(rating)`
- `rating_count` — `COUNT(*)`
- `score` — Bayesian-smoothed average toward the global mean (3.8), weighted with recent sentiment for a 0–100 "editorial score" used for the default sort

See [docs/DATABASE.md](docs/DATABASE.md#triggers) for the full formula. The point is that one-off 5-star reviews don't catapult a brand-new hotel above an established 4.7-with-200-reviews property.

### Auth: email + Google

Two-track sign-in:

- **Email + password** — bcrypt hashes at cost 10, JWT tokens valid for 7 days (configurable), `Authorization: Bearer` header from an axios interceptor
- **Google Identity Services** — frontend uses `@react-oauth/google`'s `GoogleLogin` component; the resulting ID token is verified server-side by `google-auth-library` against Google's JWKS

For Google sign-in, the backend either:
- finds an existing user by `google_sub`, or
- finds an existing email match and **links** Google to that account, or
- provisions a brand-new account

So a user who originally registered with email and later clicks "Sign in with Google" on the same email transparently links the two — no orphan accounts.

### Smart user model

Customer and Host are separate Postgres tables (different columns, different lifecycles) but the backend talks to both via a generic `userRepo` factory in `lib/userRepo.js`. The result: ~80% less duplication than typical role-split backends, and the routes for `/api/profile` work for either role with zero special-casing.

### Host workspace

`/host/dashboard` has its own 5-tab layout aimed at property owners:

- **Overview** — Revenue chart (per-month bars, animated), occupancy progress bars per property, upcoming arrivals table
- **Properties** — every hotel the host owns, with per-property occupancy, MTD revenue, and rating; one-click into the AddRooms wizard or the public detail page
- **Bookings** — full bookings table across all properties, with status pills and reservation IDs
- **Earnings** — YTD total, next payout estimate, last 30 transactions
- **Profile** — business name, GST number, payout account, Superhost badge

KPIs (revenue, bookings, occupancy, rating) are all computed server-side in one CTE per endpoint, so the dashboard never sends N+1 queries.

### AddRooms 3-step wizard

`/host/add-rooms` walks hosts through listing a property:

1. **Basics** — name, URL slug, region, city, description, mood/colour (now a working swatch picker)
2. **Address & amenities** — full address, reception phone, check-in/out times, multi-select amenities, **interactive Leaflet map** for the host to click-drop and drag a pin (writes the property's `latitude` / `longitude`)
3. **Rooms** — inline add/edit/delete with **name** + type + view + beds + size + price + mood + **special amenities** (comma-separated chips); hero image upload to Supabase Storage. Publish button is disabled until at least one room exists.

Each form is validated by a Zod schema (`lib/schemas.js`) and submitted with react-hook-form. Failed validations show inline errors on every field, including region/city. The wizard refuses to render at all until the host has filled `business_name` + `phone` on their profile (both UI and backend enforce this).

### Cancellable bookings

Customers can cancel any `pending` or `confirmed` booking from either the profile list or the `/reservations/:id` screen. Cancellations are soft — the row stays for audit history, just with `status = 'cancelled'`, and shows up under a dedicated **Cancelled** tab in the profile. The cancelled rows are excluded from the room availability check, so the dates free up immediately.

---

## Project layout

```
Nestoria/
├── README.md
├── render.yaml                  Render Blueprint (web + static + Postgres)
├── docs/
│   ├── ARCHITECTURE.md          How the pieces fit together
│   ├── API.md                   Endpoint reference
│   ├── DATABASE.md              Schema, triggers, seed data, migrations catalogue
│   ├── DEPLOYMENT.md            End-to-end Render walkthrough
│   ├── SETUP.md                 Hand-held local install (every prerequisite)
│   ├── logo-light.png           Wordmark for GitHub light mode
│   └── logo-dark.png            Wordmark for GitHub dark mode
│
├── database/
│   ├── 001_schema.sql           Tables, indexes, updated_at trigger
│   ├── 002_triggers.sql         Bayesian rating recompute
│   ├── 003_storage.sql          Supabase Storage RLS (run on Supabase, not Postgres)
│   ├── 004_seed.sql             8 hotels, 18 rooms, 50 customers, ~100 bookings, ~220 reviews
│   ├── 005_seed_images.sql      Auto-generated by scripts/upload-images.js (hero, gallery, room images)
│   ├── 006_saved_hotels.sql     `saved_hotels` table for server-side favourites
│   ├── 007_hotel_coords.sql     `hotels.latitude` / `longitude` + seed coords
│   └── 008_room_extras.sql      `rooms.name` + `rooms.special_amenities`
│
├── scripts/
│   ├── image-manifest.js        Auto-generated photo manifest (8 hotels × 5 + 18 rooms)
│   ├── fetch-hotel-photos.js    Queries Unsplash Search API → writes image-manifest.js
│   ├── upload-images.js         Downloads from Unsplash → uploads to Supabase → writes 005_seed_images.sql
│   ├── print-manifest-urls.js   Read-only spot-check helper
│   ├── check-seed-passwords.js  bcrypt-verifies every seeded password loads as "password123"
│   └── wipe-seed.js             Removes the 8 demo hotels + 50 customers + 3 hosts + matching Supabase files
│
├── backend/
│   ├── server.js                Thin wiring layer (~30 LOC)
│   ├── init-db.js               Idempotent first-boot schema + seed loader (called by `npm start`)
│   ├── config/                  db.js · supabase.js · google.js
│   ├── lib/                     http · jwt · userRepo
│   ├── middleware/              auth · error
│   └── modules/                 auth/ · hotels/ · rooms/ · bookings/ · reviews/ · profile/ · host/ · upload/
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx             QueryClient + GoogleOAuth + AuthProvider mount
        ├── App.jsx              Router + Header + Footer + TweaksPanel
        ├── styles/index.css     Editorial design system (~1 kLOC, CSS variables)
        ├── components/          Header · Footer · SearchBar · HotelCard · Icon · Photo · Stepper · TweaksPanel · ThemeToggle · ProtectedRoute · Popover · HotelMap
        ├── screens/             Home · Hotels · Detail · Booking · Reservation · Login · Profile · Host · AddRooms · About · Journal · JournalPost · Help · Contact · Legal · BecomeHost · NotFound
        ├── hooks/               useTheme · useTweaks · useSavedHotels
        ├── lib/                 api · queryClient · schemas · content (static editorial copy)
        └── context/             AuthContext
```

For a longer narrative tour with data flows, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Storage & settings

### Server-side

| Location | Size | Notes |
|---|---|---|
| PostgreSQL database | ~5 MB seeded | Schema in `database/*.sql` |
| Supabase Storage bucket | up to 1 GB on free tier | One public bucket: `hotel-images` |

### Browser-side

The frontend stores three keys in `localStorage`:

| key | purpose |
|---|---|
| `nestoria-token` | JWT issued by `/api/auth/*` endpoints |
| `nestoria-user`  | Cached user object (id, email, full_name, role, `onboarded`, …) |
| `nestoria-theme` | `light` or `dark` |
| `nestoria-tweaks`| `{ "accent": "terracotta" \| "forest" \| "ink" \| "saffron" \| "plum" }` |

Favourites used to live in localStorage too — they're now server-side, persisted to the `saved_hotels` table per `(user_id, role)`. No cookies. No third-party scripts. No localStorage on first visit until you sign in or change a setting.

---

## Privacy & data

Nestoria has **zero analytics, zero tracking pixels, zero crash-reporting SDKs**. Every outbound request the app can make is listed here:

| When | Where | Why | Optional? |
|---|---|---|---|
| Any page load | Your Nestoria backend | API calls (search, detail, etc.) | Required |
| Sign in / sign up | Your Nestoria backend | `/api/auth/*` | Required |
| Google sign-in | `accounts.google.com` | Google Identity Services popup | Only if you click the Google button |
| Image upload | Your Supabase project | Storage write via service-role | Only if a host uploads an image |
| Image display | `<project>.supabase.co` | CDN reads | Yes; falls back to abstract striped placeholders |
| Theme assets | `fonts.googleapis.com` + `fonts.gstatic.com` | Instrument Serif, Geist, JetBrains Mono | Yes; can be self-hosted by replacing the `<link>` in `index.html` |

The backend itself only talks to your Postgres, your Supabase project (if configured), and Google's JWKS endpoint (only when verifying an ID token).

If you self-host with no Supabase + no Google sign-in, the only network calls leaving the user's browser are to your own backend.

---

## Scripts

### Backend (`cd backend`)

| script | what |
|---|---|
| `npm start` | production: `node server.js` |
| `npm run dev` | development: `nodemon server.js` |

### Frontend (`cd frontend`)

| script | what |
|---|---|
| `npm run dev` | Vite dev server with HMR at `http://localhost:5173` |
| `npm run build` | Production build to `./build` |
| `npm run preview` | Preview the production build locally |

### One-shot scripts (`scripts/`)

Run from the repo root with `NODE_PATH=backend/node_modules` so they can resolve `dotenv`, `pg`, `@supabase/supabase-js`, etc. from the backend's modules.

| script | what |
|---|---|
| `node scripts/fetch-hotel-photos.js` | Hits the Unsplash Search API (needs `UNSPLASH_ACCESS_KEY` in `backend/.env`), filters results by hotel/room/interior keywords, rewrites `scripts/image-manifest.js` with the alt description + photographer annotated in every entry |
| `node scripts/upload-images.js` | Downloads each URL in the manifest, uploads to the Supabase `hotel-images` bucket (`upsert: true`), writes `database/005_seed_images.sql` |
| `node scripts/print-manifest-urls.js` | Prints every URL in the manifest so you can spot-check in a browser. Read-only. |
| `node scripts/check-seed-passwords.js` | Runs `bcrypt.compareSync('password123', hash)` against every seeded host + customer and prints PASS / FAIL / SKIP (Google-only). Exits non-zero on any failure. |
| `node scripts/wipe-seed.js --dry-run` / `--yes` | Removes the 8 seed hotels, 50 demo customers, 3 demo hosts, their 80 bookings, and the matching Supabase Storage objects (`hotels/<slug>/`, `rooms/<slug>/`). Run before going live to clear the public `password123` accounts. See [docs/DEPLOYMENT.md → 5a](docs/DEPLOYMENT.md#5a-removing-the-seed). |

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| **`psql: command not found`** | Postgres.app and Homebrew install `psql` outside the default `PATH`. Add the right directory to your shell — see [docs/SETUP.md → Step 3](docs/SETUP.md#step-3--make-psql-available). On macOS with pgAdmin only: `export PATH="/Applications/pgAdmin 4.app/Contents/SharedSupport:$PATH"` in `~/.zshrc`. |
| **I have pgAdmin but no Postgres server** | pgAdmin is a client only. Install an actual server via Postgres.app, Homebrew, Docker, or use a cloud DB — see [docs/SETUP.md → Step 2](docs/SETUP.md#step-2--install-postgresql). |
| **Backend boots but every API call returns 500** | Database not initialised. Run `psql -f database/001_schema.sql` and `002_triggers.sql`, or load them through pgAdmin's Query Tool. |
| **`ECONNREFUSED` on backend boot** | Postgres isn't running, or `DB_HOST`/`DB_PORT` are wrong. For Render, ensure `DB_SSL=true`. |
| **`CORS error: blocked by Access-Control-Allow-Origin`** | `CORS_ORIGIN` on the backend doesn't match the frontend URL exactly. Trailing slashes matter. |
| **`POST /api/auth/login` returns 401 "Invalid credentials"** | The most common cause is the **role toggle** on the sign-in screen — customer emails need "I'm travelling", host emails need "I'm hosting". The login form now appends a hint reminding you. Run `node scripts/check-seed-passwords.js` to confirm the hashes themselves are good. |
| **`POST /api/auth/login` returns "This account uses Google sign-in"** | The account was created via Google, so it has no password set. Use the **Continue with Google** button. |
| **Host signed in but the "Add property" page just shows "Finish your host profile"** | The host must fill `business_name` + `phone` on `/host/profile` before listing. Both the wizard and the backend `POST /api/hotels` enforce this. |
| **Google sign-in popup closes immediately with "origin not allowed"** | Add your frontend URL to the OAuth Client's **Authorized JavaScript origins** in Google Cloud Console. |
| **`/api/upload/*` returns 503 "Image upload is not configured"** | Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_BUCKET_NAME` in `backend/.env`. |
| **Booking POST returns 409 "Room is already booked for those dates"** | Another booking overlaps. Pick different dates, or cancel the conflicting one as that customer. |
| **Reviews POST returns 400 "allowed on completed stays only"** | The booking's `status` isn't `completed`. The seed file pre-marks some bookings as completed so reviews can land on them; for new bookings you'd need to update the status manually (a job/scheduler is on the roadmap). |
| **Frontend page is blank** | Open DevTools console. Usually a missing env var (`VITE_API_URL`). |
| **`vite: command not found`** | Run `npm install` inside `frontend/` — the Vite binary is a dev dependency. |
| **Theme flashes light → dark on load** | The anti-FOUC script in `index.html` was edited. The block at lines 17–24 must run before the React mount. |
| **OKLCH colours look wrong in Firefox** | You're on Firefox <113. Update — `color-mix()` and `oklch()` need a recent build. |

---

## Roadmap

Things that aren't built but would be welcome contributions:

- **Real payments** — Razorpay or Stripe in place of the simulated payment terminal in the booking wizard
- **Email notifications** — booking confirmations, host new-booking alerts (Resend or SES)
- **Host inbox** — message threads between guests and hosts
- **Calendar view** for the host's bookings tab
- **Internationalisation** — currently INR-only and English-only
- **Booking lifecycle scheduler** — auto-transition `confirmed` → `completed` once the checkout date passes
- **Mobile app** — the current responsive web UI works on phones, but a wrapped PWA or native app would be nicer

---

## Contributing

Pull requests welcome. The repo follows a few conventions:

- **Backend**: feature folders under `backend/modules/`. New endpoints live in their own module rather than in a giant controller.
- **Frontend**: one file per screen, shared widgets in `components/`. No CSS-in-JS — everything goes in `src/styles/index.css` using existing utility classes (`.btn`, `.card-flat`, `.hcard`, …) and CSS variables (`var(--ink)`, `var(--accent)`).
- **Validation**: every form-derived API call should have a matching Zod schema in `frontend/src/lib/schemas.js`.
- **Database**: never edit `001_schema.sql` in-place once data is live. Add a new numbered file (`005_<name>.sql`) instead.

Run both packages locally before opening a PR:

```sh
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

There's no test suite yet (it's on the roadmap). For now, manually verify the golden path: register → search → detail → book → review.

---

## Credits

- Built on top of **[React](https://react.dev)**, **[Vite](https://vitejs.dev)**, **[Express](https://expressjs.com)**, and **[PostgreSQL](https://www.postgresql.org)** — the open-source giants that make small full-stack projects possible.
- Typefaces by **[Instrument](https://www.instrument.com)** (Instrument Serif), **[Vercel](https://vercel.com/font)** (Geist), and **[JetBrains](https://www.jetbrains.com/lp/mono/)** (JetBrains Mono).
- Hosting on **[Render](https://render.com)** and **[Supabase](https://supabase.com)** — both have generous free tiers that make self-hosted SaaS realistic.
- Hotel names and editorial descriptions in the seed file are fictional; any resemblance to real properties is a coincidence.

---

Created and maintained by **[Avaneesh](https://github.com/Avaneesh40585)**.

## License

MIT — see [LICENSE.txt](./LICENSE.txt).
