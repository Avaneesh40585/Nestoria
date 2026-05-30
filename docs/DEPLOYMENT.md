# Deployment guide

This guide walks through deploying Nestoria end-to-end on free infrastructure: **Render** (backend + frontend + Postgres) and **Supabase** (object storage). Estimated time: **20–30 minutes**.

You'll need accounts (all free, no card required) at:

- [Render](https://render.com)
- [Supabase](https://supabase.com)
- [Google Cloud Console](https://console.cloud.google.com) — only if you want Google sign-in

---

## 1. Fork and prepare the repository

```sh
git clone https://github.com/<your-username>/Nestoria.git
cd Nestoria
```

Make sure `render.yaml` is committed. Render reads it on the next step.

---

## 2. Create the Supabase storage bucket

> Skip this section if you don't need image uploads. The rest of the app works without Supabase.

1. Log into Supabase and create a new project.
2. In **Storage**, create a bucket named **`hotel-images`** and mark it **public**.
3. Open the **SQL editor**, paste the contents of [`database/003_storage.sql`](../database/003_storage.sql) and run it. This adds the three RLS policies the backend needs (public read, service-role write/delete).
4. In **Project Settings → API**, copy:
   - **Project URL** → you'll set this as `SUPABASE_URL`
   - **`service_role` secret** (NOT `anon`) → you'll set this as `SUPABASE_SERVICE_ROLE_KEY`

Keep both values handy.

---

## 3. Create the Google OAuth Client ID (optional)

> Skip if you only need email + password auth.

1. Open [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. Click **Create credentials → OAuth client ID**.
3. Application type: **Web application**.
4. **Authorized JavaScript origins**: add both the local dev URL and the eventual production frontend URL.

   ```
   http://localhost:5173
   https://nestoria-frontend.onrender.com
   ```

5. **Authorized redirect URIs**: leave empty — Nestoria uses Google Identity Services in popup mode, not OAuth redirects.
6. Copy the **Client ID** that's generated. You'll use it both server-side (`GOOGLE_CLIENT_ID`) and client-side (`VITE_GOOGLE_CLIENT_ID`). They must match — the backend verifies the audience against the same client id.

---

## 4. Provision Render services

1. Go to your Render dashboard → **New → Blueprint**.
2. Connect your GitHub account and pick the Nestoria repository.
3. Render reads `render.yaml` and proposes three resources:
   - **`nestoria-backend`** — Node web service
   - **`nestoria-frontend`** — Static site (Vite)
   - **`nestoria-db`** — PostgreSQL 16, free plan, Oregon region
4. Click **Apply**. Render starts provisioning. The database comes up first (~1 min). The backend will fail its first build because the database is still empty — that's expected. We'll fix it next.

While Render works, set the manual env vars (the ones marked `sync: false` in `render.yaml`):

**On the `nestoria-backend` service → Environment**

| key | value |
|---|---|
| `SUPABASE_URL` | from Supabase step 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase step 2 |
| `GOOGLE_CLIENT_ID` | from Google Cloud step 3 |
| `UNSPLASH_ACCESS_KEY` | *not required in production* — only needed if you re-run `scripts/fetch-hotel-photos.js` from your local checkout to refresh the demo imagery. The running backend does not call Unsplash. |

**On the `nestoria-frontend` service → Environment**

| key | value |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | same Google Client ID as the backend |

If you didn't follow step 2 or 3, leave the corresponding variables blank — the app degrades gracefully.

---

## 5. Initialise the database (automatic on first boot)

You don't need to do anything here — the backend self-initialises.

When `nestoria-backend` boots, its `npm start` script runs [`backend/init-db.js`](../backend/init-db.js) before the Express server starts:

- If the `hotels` table already exists → the script logs `init-db: schema present, nothing to do.` and exits, then `node server.js` takes over. This is the normal case on every redeploy after the first.
- If the database is empty → the script runs the SQL files in dependency order: `001_schema → 002_triggers → 006_saved_hotels → 007_hotel_coords → 008_room_extras → 004_seed → 005_seed_images`. About 10 seconds on Render's free Postgres. The first request after the deploy goes green sees a populated app (8 curated hotels with real Unsplash photos, the `vikram@marigold.in` host login, 50 demo customers).

**Why load the seed by default?** A freshly deployed Nestoria with no rows shows an empty home grid, an empty destinations strip, and an empty journal — visitors can't tell whether the app is broken or just unfilled. Auto-seeding solves that. **Before you take real bookings**, wipe the demo data so the public `password123` accounts and demo hotels aren't reachable — see [Step 5a — Removing the seed](#5a-removing-the-seed) below.

What you'll see in the backend logs on first boot:

```text
==> Starting service with 'npm start'
init-db: nestoria@dpg-xxxxx-a.oregon-postgres.render.com
init-db: empty database — loading schema + seed…
  ✓ 001_schema.sql
  ✓ 002_triggers.sql
  ✓ 006_saved_hotels.sql
  ✓ 007_hotel_coords.sql
  ✓ 008_room_extras.sql
  ✓ 004_seed.sql
  ✓ 005_seed_images.sql
init-db: done.
Nestoria API listening on :5000
```

### Manual fallback

If auto-init failed (`init-db FAILED: …` in the deploy logs) or you want to reset the database from scratch, drop into the Render PSQL shell:

1. **`nestoria-db` → Connect → External Connection** → copy the `psql` command (includes credentials).
2. Run it locally, then load the files in the same order:

   ```sql
   \i database/001_schema.sql
   \i database/002_triggers.sql
   \i database/006_saved_hotels.sql
   \i database/007_hotel_coords.sql
   \i database/008_room_extras.sql
   \i database/004_seed.sql        -- 8 demo hotels, 3 hosts, 50 customers, 80 bookings
   \i database/005_seed_images.sql -- swaps in real Unsplash photos + fixes the dummy bcrypt hash
   ```

   `006`/`007`/`008` are required for favourites, hotel map, and per-room name/special-amenity features. `003_storage.sql` runs **inside Supabase**, not Postgres — see Step 2 above.

> Or paste the file contents into Render's **Database → Query** web UI if you don't have `psql` installed locally.

---

## 5a. Removing the seed

The seed is great for first impressions and useless (worse — unsafe) once you start accepting real signups. This step wipes the demo rows from Postgres and the matching photos from Supabase Storage, while leaving alone anything you've created through the running app.

The teardown ships as a single Node script that talks to both Postgres and Supabase. It reads the same `backend/.env` that the app uses, so make sure those values point at the **deployment's** database + bucket before you run it (the simplest path: copy them out of Render and Supabase into a local `backend/.env`, run the script, then revert).

1. **Dry run first** — read-only, prints exactly what would be touched:

   ```sh
   NODE_PATH=backend/node_modules node scripts/wipe-seed.js --dry-run
   ```

   Expected output (counts will match what was seeded):

   ```text
   Will remove:
     bookings:  80
     hotels:    8 (of 8 known seed slugs)
     customers: 50
     hosts:     3
     storage:   58 object(s) under 16 prefixes
   ```

2. **Execute** — same script, swap the flag:

   ```sh
   NODE_PATH=backend/node_modules node scripts/wipe-seed.js --yes
   ```

What this does:

- Deletes the 80 seeded bookings first (must go before their parents — `bookings.customer_id` and `bookings.hotel_id` are `ON DELETE RESTRICT`).
- Deletes the 8 seed hotels by slug. Their `rooms`, `hotel_images`, `hotel_amenities`, `reviews`, and `saved_hotels` rows go with them via `ON DELETE CASCADE`.
- Deletes the 50 demo customers (`customer1@nestoria.dev` … `customer50@nestoria.dev`) and the 3 demo hosts (`vikram@marigold.in`, `priya@casapamparo.in`, `arjun@cardamom.in`).
- Deletes the matching Supabase Storage objects under `hotels/<slug>/` and `rooms/<slug>/` for each of the 8 seed slugs.

What it does **not** touch:

- The `amenities` table — it's a generic catalog that user-created hotels reference too.
- Any hotel/customer/host you (or your real users) created through the app — they have different slugs and email patterns.
- Any Supabase Storage files outside the 8 seed prefixes — user-uploaded hotel images live under different paths and are left alone.

If `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing or the bucket is unreachable, the script still wipes the database rows and prints a warning for each storage prefix it couldn't list — orphan files are harmless and can be removed by hand from the Supabase dashboard later.

> The script is idempotent — re-running it after a wipe is a no-op (all counts come back as 0).

---

## 6. Redeploy the backend

Back on the **`nestoria-backend`** service:

1. Click **Manual Deploy → Deploy latest commit**.
2. Watch the logs. You should see `Nestoria API listening on :5000` once it's ready.
3. Visit `https://nestoria-backend.onrender.com/api/health` — expect `{ "ok": true, … }`.

---

## 7. Verify the frontend

The static site builds automatically on every push. After it's green:

1. Visit `https://nestoria-frontend.onrender.com`.
2. Open browser DevTools → Network. You should see successful calls to `/api/hotels/destinations` and `/api/hotels`.
3. If they fail with CORS errors, double-check `CORS_ORIGIN` on the backend matches your frontend URL exactly (no trailing slash).

---

## 8. Smoke test

```sh
# Health
curl https://nestoria-backend.onrender.com/api/health

# Search (public)
curl "https://nestoria-backend.onrender.com/api/hotels?location=Goa"

# Register a real account
curl -X POST https://nestoria-backend.onrender.com/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"role":"customer","email":"you@example.com","password":"supersecret","full_name":"You"}'

# Confirm in the browser
open https://nestoria-frontend.onrender.com/login
```

---

## Custom domains

Render supports custom domains on the free tier:

1. **`nestoria-frontend`** → Settings → Custom Domains → add `nestoria.example.com`.
2. Update DNS at your registrar with the CNAME Render shows you.
3. Update **two** environment variables once the new domain resolves:
   - On the backend: `CORS_ORIGIN=https://nestoria.example.com`
   - On the frontend: `VITE_API_URL=https://api.nestoria.example.com/api` (if you also moved the backend)
4. **Update the Google OAuth Client ID** Authorized JavaScript origins to include the new domain. Without this, Google sign-in pops up and immediately fails with "origin not allowed".

---

## Updating the app

```sh
git push origin main
```

Render auto-deploys both services. If you change `render.yaml` it requires a manual **Apply** in the dashboard.

For schema changes, write a numbered migration file (`database/005_<name>.sql`) and apply it via `psql` against the Render database. Don't edit `001_schema.sql` in-place once the database has live data — that file is destructive (it drops all tables at the top).

---

## Self-hosting alternatives

### Docker Compose (rough sketch)

A minimal `docker-compose.yml` would have three services:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: nestoria_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: change-me
    volumes:
      - ./database:/docker-entrypoint-initdb.d:ro
    ports: ['5432:5432']

  backend:
    build: ./backend
    env_file: ./backend/.env
    depends_on: [postgres]
    ports: ['5000:5000']

  frontend:
    build: ./frontend
    env_file: ./frontend/.env
    ports: ['5173:80']
```

Postgres' init script directory runs every `*.sql` in alphabetical order — exactly what `001_schema.sql`, `002_triggers.sql`, `004_seed.sql` is named for.

Backend `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["npm", "start"]
```

Frontend `Dockerfile` (multi-stage build → nginx):

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

With an `nginx.conf` that rewrites all routes to `index.html` for the SPA:

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  location / { try_files $uri $uri/ /index.html; }
}
```

### Other PaaS

Both pieces are vanilla Node + static site, so this also works on **Railway**, **Fly.io**, **Vercel** (frontend) + **Heroku/Cloud Run** (backend), and any VPS running `pm2`.

---

## Troubleshooting

See the [Troubleshooting](../README.md#troubleshooting) section in the main README. The most common deployment-specific issues:

| Symptom | Fix |
|---|---|
| Deploy log shows `init-db FAILED: …` and the service won't start | Auto-init couldn't reach the database (most often: `DB_SSL` not set, or Render Postgres still provisioning). Wait for the DB to finish, redeploy. If it keeps failing, fall back to the manual `psql` flow in Step 5. |
| Backend deploy fails: `relation "hotels" does not exist` | `init-db.js` didn't run (custom `startCommand`?) and you also skipped the manual fallback. Either restore `npm start` as the start command, or load the SQL files via `psql` per Step 5's fallback. |
| `CORS error: blocked by Origin policy` | The backend's `CORS_ORIGIN` doesn't match your frontend URL exactly. Trailing slashes count. |
| `/api/upload/...` returns 503 | `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing. |
| Google sign-in popup closes immediately | The Google OAuth Client ID is missing from `Authorized JavaScript origins` for your domain. |
| `ECONNREFUSED` on backend boot | Render Postgres needs `DB_SSL=true`. It's set in `render.yaml`; if you copied the env block elsewhere, add it manually. |
| Frontend deploy succeeds but only shows a white page | Open DevTools console — usually an env var (`VITE_API_URL`) is missing and the API client throws on boot. |
| `wipe-seed.js` exits with `relation "hotels" does not exist` | The script is pointed at a database where the schema hasn't been loaded yet. Run Step 5 first. |
| `wipe-seed.js` warns `could not list hotels/<slug>` | `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing/wrong. DB wipe still ran — clean up the orphan storage files from the Supabase dashboard. |
