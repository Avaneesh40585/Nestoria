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

**On the `nestoria-frontend` service → Environment**

| key | value |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | same Google Client ID as the backend |

If you didn't follow step 2 or 3, leave the corresponding variables blank — the app degrades gracefully.

---

## 5. Initialise the database

1. In the Render dashboard, open **`nestoria-db` → Connect → External Connection** and copy the `psql` command (it includes credentials).
2. Run it from your local terminal:

   ```sh
   psql <copied-command>
   ```

3. From the prompt, load the schema:

   ```sql
   \i database/001_schema.sql
   \i database/002_triggers.sql
   ```

4. **Skip** `004_seed.sql` in production unless you specifically want the sample dataset (50 dummy customers, 8 hotels, etc. — and remember the seed password is the public `password123`).

> Alternatively: paste the file contents directly into Render's **Database → Query** web UI if you don't have `psql` installed locally.

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
| Backend deploy fails: `relation "hotels" does not exist` | You skipped step 5. Connect via `psql` and load the schema files. |
| `CORS error: blocked by Origin policy` | The backend's `CORS_ORIGIN` doesn't match your frontend URL exactly. Trailing slashes count. |
| `/api/upload/...` returns 503 | `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing. |
| Google sign-in popup closes immediately | The Google OAuth Client ID is missing from `Authorized JavaScript origins` for your domain. |
| `ECONNREFUSED` on backend boot | Render Postgres needs `DB_SSL=true`. It's set in `render.yaml`; if you copied the env block elsewhere, add it manually. |
| Frontend deploy succeeds but only shows a white page | Open DevTools console — usually an env var (`VITE_API_URL`) is missing and the API client throws on boot. |
