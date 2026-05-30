# Local setup guide

A hand-held walkthrough for getting Nestoria running on a fresh Mac (or Linux / Windows-WSL machine). If you've never set up a Node + Postgres project before, start here.

By the end you'll have:

- Postgres running with the Nestoria schema loaded
- The backend API serving on `http://localhost:5000`
- The Vite dev server serving the frontend on `http://localhost:5173`
- Optionally Supabase wired up for image uploads
- Optionally Google sign-in wired up

Total time: **15–25 minutes** depending on what you already have installed.

---

## Table of contents

- [Prerequisites](#prerequisites)
- [Step 1 — Install Node.js](#step-1--install-nodejs)
- [Step 2 — Install PostgreSQL](#step-2--install-postgresql)
  - [Path A: Postgres.app (easiest)](#path-a-postgresapp-easiest)
  - [Path B: Homebrew](#path-b-homebrew)
  - [Path C: Docker](#path-c-docker)
  - [Path D: Cloud / no local install](#path-d-cloud--no-local-install)
- [Step 3 — Make `psql` available](#step-3--make-psql-available)
- [Step 4 — Clone Nestoria](#step-4--clone-nestoria)
- [Step 5 — Create and seed the database](#step-5--create-and-seed-the-database)
  - [Method 1: Command line (`psql`)](#method-1-command-line-psql)
  - [Method 2: pgAdmin 4 (GUI)](#method-2-pgadmin-4-gui)
  - [Method 3: Docker](#method-3-docker)
- [Step 6 — Configure the backend](#step-6--configure-the-backend)
- [Step 7 — Configure the frontend](#step-7--configure-the-frontend)
- [Step 8 — Start both servers](#step-8--start-both-servers)
- [Step 9 — Sign in](#step-9--sign-in)
- [Optional: Supabase Storage for image uploads](#optional-supabase-storage-for-image-uploads)
- [Optional: Google sign-in](#optional-google-sign-in)
- [Resetting the database](#resetting-the-database)
- [Common errors and fixes](#common-errors-and-fixes)

---

## Prerequisites

Check what you already have. Open a fresh Terminal and run each:

```sh
node --version       # need v20 or newer
npm  --version       # ships with Node
psql --version       # any v14+; if 'not found', see Step 2 / Step 3
git  --version       # any recent version
```

Anything that fails is something you need to install below.

> **macOS users:** if you've never used a developer tool on this Mac, run `xcode-select --install` first to get the Apple Command Line Tools (gives you `git`, `make`, and a working C compiler that some npm packages need).

---

## Step 1 — Install Node.js

If `node --version` already prints **v20** or higher, skip this.

### macOS

```sh
brew install node
```

If you don't have Homebrew yet:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Windows / Linux

Download the **LTS** installer from [nodejs.org](https://nodejs.org). On Windows, the installer adds `node` and `npm` to PATH automatically.

Verify:

```sh
node --version  # → v20.x or higher
npm  --version
```

---

## Step 2 — Install PostgreSQL

**Important:** pgAdmin is a *client* — a GUI to manage databases. It does **not** include a database server. If `which psql` finds nothing and you don't see a Postgres process running, you don't have a server, only the GUI.

Pick one of the four paths below.

### Path A: Postgres.app (easiest)

The smoothest path on macOS — a self-contained Postgres server with a menu-bar icon and a one-click "Start" button.

1. Go to [postgresapp.com](https://postgresapp.com).
2. Download the latest **Postgres.app with all versions**.
3. Drag it to `/Applications`.
4. Open it. Click **Initialize** to create a default cluster on port `5432`.

That's it — there's now a Postgres server running, plus `psql` is bundled at `/Applications/Postgres.app/Contents/Versions/latest/bin/psql`.

Default credentials:
- host: `localhost`
- port: `5432`
- user: your macOS username (e.g. `avaneesh`)
- password: **empty** (no password)
- a database matching your username already exists

To add `psql` to your `PATH` so you can type just `psql`, see [Step 3](#step-3--make-psql-available).

### Path B: Homebrew

```sh
brew install postgresql@16
brew services start postgresql@16
```

`brew services start` keeps it running across reboots. `brew services stop postgresql@16` shuts it down. The server runs on port `5432` with your macOS username as the default user, no password.

Verify it's up:

```sh
brew services list           # should show 'postgresql@16   started'
psql -c "SELECT version();"  # should print a PostgreSQL version string
```

If `psql` isn't on PATH, see [Step 3](#step-3--make-psql-available).

### Path C: Docker

If you already use Docker and don't want any native install:

```sh
docker run -d \
  --name nestoria-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nestoria_db \
  -p 5432:5432 \
  -v nestoria-pgdata:/var/lib/postgresql/data \
  postgres:16-alpine
```

That starts Postgres 16 listening on `localhost:5432`. Credentials:
- user: `postgres`
- password: `postgres`
- database: `nestoria_db`

Stop it later with `docker stop nestoria-postgres`, restart with `docker start nestoria-postgres`. Data persists in the `nestoria-pgdata` volume across restarts.

> Tip: With Docker you can skip [Step 5: Method 3](#method-3-docker) — it mounts the SQL files automatically.

### Path D: Cloud / no local install

If you don't want anything installed on your machine, create a free Postgres database on:

- [Supabase](https://supabase.com) (500 MB free, easiest if you also plan to use Supabase Storage)
- [Neon](https://neon.tech) (3 GB free, instant cold starts)
- [Render](https://render.com) (free, in Oregon)

Each provides a connection string like:

```
postgres://USER:PASS@HOST:5432/DBNAME?sslmode=require
```

Parse out the parts into your `backend/.env` (you'll need `DB_SSL=true`).

---

## Step 3 — Make `psql` available

If `which psql` already returns a path, skip this.

Postgres.app and Homebrew install `psql` somewhere your shell doesn't search by default. You need to add the right directory to your `PATH`.

### Find where psql lives on your system

```sh
# Postgres.app
ls /Applications/Postgres.app/Contents/Versions/latest/bin/psql 2>/dev/null

# Homebrew (Apple Silicon)
ls /opt/homebrew/opt/postgresql@16/bin/psql 2>/dev/null

# Homebrew (Intel)
ls /usr/local/opt/postgresql@16/bin/psql 2>/dev/null

# pgAdmin bundled
ls "/Applications/pgAdmin 4.app/Contents/SharedSupport/psql" 2>/dev/null
```

Whichever one exists, copy the directory containing it (everything up to but not including `/psql`).

### Add it to your shell

Find which shell you're using:

```sh
echo $SHELL    # /bin/zsh on modern macOS, /bin/bash on older / on Linux
```

For **zsh** (default on macOS Catalina+):

```sh
echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Adjust the path on the first line to match what you found above. For pgAdmin's bundled psql you'd use:

```sh
echo 'export PATH="/Applications/pgAdmin 4.app/Contents/SharedSupport:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

For **bash**:

```sh
echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Verify:

```sh
which psql       # should print the path you just added
psql --version   # should print 'psql (PostgreSQL) 16.x' or similar
```

If `psql` still isn't found, **open a new Terminal window** — `PATH` changes don't apply to already-open shells.

---

## Step 4 — Clone Nestoria

```sh
cd ~/Documents          # or wherever you keep code
git clone https://github.com/Avaneesh40585/Nestoria.git
cd Nestoria
```

You should see `backend/`, `frontend/`, `database/`, `docs/`, and `render.yaml`.

---

## Step 5 — Create and seed the database

> **On Render**, the backend auto-loads everything below on first boot via [`backend/init-db.js`](../backend/init-db.js) — you can skip this step entirely. The manual flow here is for local development and self-hosting.

You need to run these SQL files in order (`003_storage.sql` lives inside Supabase, not Postgres — see Step 8 below):

1. `database/001_schema.sql` — creates tables and indexes
2. `database/002_triggers.sql` — adds the rating recompute logic
3. `database/004_seed.sql` — sample data (8 hotels, 50 customers, ~100 bookings). Loaded by default; clear it later with `scripts/wipe-seed.js` ([DEPLOYMENT.md → 5a](DEPLOYMENT.md#5a-removing-the-seed))
4. `database/005_seed_images.sql` — swaps the seed placeholders for the real Unsplash photos already uploaded to Supabase (skip if you don't have Supabase configured)
5. `database/006_saved_hotels.sql` — server-side favourites table
6. `database/007_hotel_coords.sql` — `hotels.latitude` / `longitude` columns + coords for the 8 seed properties (powers the Leaflet map)
7. `database/008_room_extras.sql` — `rooms.name` + `rooms.special_amenities`

> Want the auto-init locally too? After creating the database, run `cd backend && npm run init-db` — same idempotent check as on Render, loads the SQL files if `hotels` doesn't exist yet.

Pick one of the three methods below.

### Method 1: Command line (`psql`)

From the repository root:

```sh
# Create an empty database. If your user already has a default database, you can skip this
# and just point the next commands at it.
createdb nestoria_db

# Load the schema
psql nestoria_db -f database/001_schema.sql
psql nestoria_db -f database/002_triggers.sql

# Sample data — recommended for local dev (and the default in deploys).
# 005_seed_images.sql swaps in real Unsplash photos that scripts/upload-images.js uploaded
# to Supabase. Skip line 2 if you didn't configure Supabase; you'll just see placeholder URLs.
psql nestoria_db -f database/004_seed.sql
psql nestoria_db -f database/005_seed_images.sql

# To clear the seed later (DB rows + matching Supabase Storage objects):
#   NODE_PATH=backend/node_modules node scripts/wipe-seed.js --dry-run   # inspect
#   NODE_PATH=backend/node_modules node scripts/wipe-seed.js --yes       # execute
# See docs/DEPLOYMENT.md → 5a Removing the seed.

# Feature migrations (required for favourites + map + room name/amenities)
psql nestoria_db -f database/006_saved_hotels.sql
psql nestoria_db -f database/007_hotel_coords.sql
psql nestoria_db -f database/008_room_extras.sql
```

If `createdb` says "database already exists", you can keep going — `001_schema.sql` drops all Nestoria tables at the top before recreating them, so re-running it is safe.

If `createdb` says **`role "<your-name>" does not exist`** (typical on Linux), prefix with `sudo -u postgres`:

```sh
sudo -u postgres createdb nestoria_db -O $USER
```

### Method 2: pgAdmin 4 (GUI)

You already have pgAdmin — here's how to use it as the database client.

**First, register your server in pgAdmin** (only once):

1. Open pgAdmin 4.
2. Right-click **Servers** in the left tree → **Register → Server…**
3. **General tab** → Name: `Local Postgres`
4. **Connection tab**:
   - Host name/address: `localhost`
   - Port: `5432`
   - Maintenance database: `postgres`
   - Username: your macOS username (Postgres.app/Homebrew) or `postgres` (Docker)
   - Password: blank (Postgres.app/Homebrew) or `postgres` (Docker) — tick **Save password**
5. Click **Save**. The server should appear in the tree and expand to show "Databases".

**Now create the Nestoria database:**

1. Right-click **Databases** under your registered server → **Create → Database…**
2. Name: `nestoria_db` → **Save**

**Load the schema:**

1. Click the new `nestoria_db` database in the tree to select it.
2. Top menu → **Tools → Query Tool** (or the keyboard shortcut shown). A SQL editor opens.
3. **File → Open**, navigate to `<your-clone>/database/001_schema.sql`, click Open.
4. Press **F5** (Execute) or click the ▶ button. You should see "Query returned successfully" in the status bar.
5. Repeat with `002_triggers.sql`, (optionally) `004_seed.sql`, then the feature migrations `006_saved_hotels.sql`, `007_hotel_coords.sql`, and `008_room_extras.sql`.

To verify the tables exist: in the left tree, expand `nestoria_db → Schemas → public → Tables`. You should see `customers`, `hosts`, `hotels`, `rooms`, `bookings`, etc.

### Method 3: Docker

If you used the Docker command in [Path C](#path-c-docker), the database `nestoria_db` already exists. Load the SQL files by piping them into the running container:

```sh
docker exec -i nestoria-postgres psql -U postgres -d nestoria_db < database/001_schema.sql
docker exec -i nestoria-postgres psql -U postgres -d nestoria_db < database/002_triggers.sql
docker exec -i nestoria-postgres psql -U postgres -d nestoria_db < database/004_seed.sql
docker exec -i nestoria-postgres psql -U postgres -d nestoria_db < database/006_saved_hotels.sql
docker exec -i nestoria-postgres psql -U postgres -d nestoria_db < database/007_hotel_coords.sql
docker exec -i nestoria-postgres psql -U postgres -d nestoria_db < database/008_room_extras.sql
```

Or open an interactive psql inside the container:

```sh
docker exec -it nestoria-postgres psql -U postgres -d nestoria_db
nestoria_db=# \i /database/001_schema.sql
```

---

## Step 6 — Configure the backend

```sh
cd backend
cp .env.example .env
```

Open `backend/.env` in your editor. Fill in your database credentials:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nestoria_db
DB_USER=<your-postgres-user>     # macOS username (Postgres.app/Homebrew) or 'postgres' (Docker)
DB_PASSWORD=<your-password>      # blank for Postgres.app/Homebrew default, 'postgres' for Docker
DB_SSL=false

JWT_SECRET=<run: openssl rand -base64 48>
JWT_EXPIRES_IN=7d
```

Generate a JWT secret in one line:

```sh
openssl rand -base64 48
```

Paste the output as `JWT_SECRET=…`.

Leave `SUPABASE_*`, `GOOGLE_CLIENT_ID`, and `UNSPLASH_ACCESS_KEY` blank for now — all three are optional. See the [optional sections](#optional-supabase-storage-for-image-uploads) below if you want them.

> `UNSPLASH_ACCESS_KEY` is only needed if you want to **re-curate** the demo imagery via `scripts/fetch-hotel-photos.js`. The running app does not call Unsplash — it serves the photos from Supabase. Sign up free at <https://unsplash.com/developers> (no card, ~2 min).

Install dependencies:

```sh
npm install
```

(This pulls Express, pg, jsonwebtoken, bcryptjs, google-auth-library, @supabase/supabase-js, etc.)

---

## Step 7 — Configure the frontend

In a new terminal tab:

```sh
cd frontend
cp .env.example .env
```

The default values in `.env.example` are already correct for local dev:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=
```

Leave `VITE_GOOGLE_CLIENT_ID` blank unless you're setting up Google sign-in.

Install dependencies:

```sh
npm install
```

(Pulls React, Vite, react-router, TanStack Query, react-hook-form, Zod, axios, @react-oauth/google.)

---

## Step 8 — Start both servers

You need **two terminals running at the same time** — one for the backend, one for the frontend.

**Terminal 1 — backend:**

```sh
cd backend
npm run dev
```

Wait for the line `Nestoria API listening on :5000`. If you see a stack trace mentioning `ECONNREFUSED` or `database "nestoria_db" does not exist`, jump down to [Common errors](#common-errors-and-fixes).

Test it from a third terminal (or curl from Terminal 1's neighbour):

```sh
curl http://localhost:5000/api/health
# → {"ok":true,"ts":"..."}
```

**Terminal 2 — frontend:**

```sh
cd frontend
npm run dev
```

Wait for the line `Local: http://localhost:5173/`. Open that URL in your browser — you should land on the editorial home page with the destinations grid and a list of featured stays.

---

## Step 9 — Sign in

If you loaded the seed data (`004_seed.sql`), every seeded account uses the password `password123`.

**Customer accounts:**
- `customer1@nestoria.dev` through `customer50@nestoria.dev`

**Host accounts:**
- `vikram@marigold.in` (Superhost, owns 3 properties incl. The Marigold House)
- `priya@casapamparo.in` (owns Casa Pamparo + The Salt House)
- `arjun@cardamom.in` (owns House of Cardamom + others)

Click **Sign in** in the header → enter an email + `password123` → make sure the right "I'm travelling" / "I'm hosting" toggle is selected (the role determines which table is queried).

> ⚠️ **"Invalid credentials" on a known-good email?** Nine times out of ten this is the role toggle. Customer emails (`customer1…@nestoria.dev`) require "I'm travelling"; host emails (`vikram@…`, `priya@…`, `arjun@…`) require "I'm hosting". The login form now appends a reminder when the generic 401 comes back.
>
> If you signed up via Google with a particular email, that account has no password set — email/password login will return *"This account uses Google sign-in"* and you have to use the **Continue with Google** button.

Verify all seeded password hashes load cleanly any time with:

```sh
NODE_PATH=backend/node_modules node scripts/check-seed-passwords.js
# expect:  53 pass · 0 fail · N skipped (Google-only)
```

If you skipped the seed data, click **Create account** instead and register a fresh one.

To preview the host workspace, sign in as Vikram and visit `/host/dashboard`.

---

## Optional: Supabase Storage for image uploads

Without this section, the host's "Upload" hero-image button returns `503 Image upload is not configured`. Everything else works.

1. Sign up at [supabase.com](https://supabase.com) (free, no card required).
2. Create a project. Wait ~2 minutes for it to provision.
3. In the left sidebar → **Storage** → **New bucket**:
   - Name: `hotel-images`
   - **Tick "Public bucket"**
   - **Create bucket**.
4. **SQL Editor** (left sidebar) → **New query** → paste the entire contents of `database/003_storage.sql` from this repo → **Run**. This adds three RLS policies.
5. **Project Settings → API**:
   - **Project URL** (in Project Overview) → copy → paste into `backend/.env` as `SUPABASE_URL=`
   - **`service_role` secret** (NOT `anon`!) → copy → paste into `backend/.env` as `SUPABASE_SERVICE_ROLE_KEY=`
6. Restart the backend (`Ctrl+C` then `npm run dev`).

The "Upload" button on the AddRooms wizard now works.

---

## Optional: Google sign-in

1. Open [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. If you don't have a project yet, create one (any name; defaults are fine).
3. Click **Create credentials → OAuth client ID**. If it asks you to configure the OAuth consent screen first, do that (External, fill in app name + your email, **add yourself as a test user**).
4. Application type: **Web application**.
5. **Authorized JavaScript origins** → **+ Add URI** → `http://localhost:5173`.
6. **Authorized redirect URIs** → leave empty.
7. **Create**. Copy the **Client ID** (looks like `123456-abc.apps.googleusercontent.com`).
8. Paste into **both**:
   - `backend/.env` → `GOOGLE_CLIENT_ID=...`
   - `frontend/.env` → `VITE_GOOGLE_CLIENT_ID=...`
9. Restart **both** servers.

The login page now shows a working "Sign in with Google" button.

> If Google says "App isn't verified" on first sign-in, click **Advanced → Continue** — that warning is normal for personal dev projects with no published OAuth consent screen.

---

## Resetting the database

Want to start over? Re-run `001_schema.sql` — it begins with `DROP TABLE … CASCADE`, so all Nestoria data is wiped before tables are recreated.

```sh
psql nestoria_db -f database/001_schema.sql
psql nestoria_db -f database/002_triggers.sql
psql nestoria_db -f database/004_seed.sql           # optional
psql nestoria_db -f database/006_saved_hotels.sql   # favourites
psql nestoria_db -f database/007_hotel_coords.sql   # map coords
psql nestoria_db -f database/008_room_extras.sql    # room name + special amenities
```

Or, to nuke the whole database including any custom changes:

```sh
dropdb nestoria_db
createdb nestoria_db
# then load the SQL files again
```

In Docker: `docker exec nestoria-postgres dropdb -U postgres nestoria_db && docker exec nestoria-postgres createdb -U postgres nestoria_db`.

---

## Common errors and fixes

### `psql: command not found`
Your `PATH` doesn't include the directory where `psql` lives. See [Step 3](#step-3--make-psql-available). Remember to open a **new** Terminal window after editing `~/.zshrc`.

### `connection to server on socket ... failed: No such file or directory`
The Postgres server isn't running.
- Postgres.app: open the app, click **Start**.
- Homebrew: `brew services start postgresql@16`.
- Docker: `docker start nestoria-postgres`.

### `FATAL: role "<user>" does not exist`
You don't have a Postgres user matching your shell username. Either:

```sh
# Create one with your macOS username
sudo -u postgres createuser --superuser $USER

# …or override DB_USER in backend/.env to use 'postgres'
```

### `FATAL: database "nestoria_db" does not exist`
Skipped the `createdb` step. Run:

```sh
createdb nestoria_db
psql nestoria_db -f database/001_schema.sql
psql nestoria_db -f database/002_triggers.sql
```

### `Error: connect ECONNREFUSED 127.0.0.1:5432` (when starting backend)
Same as above — Postgres isn't running, or it's listening on a different port. Verify:

```sh
psql -h localhost -p 5432 -U $USER -c "SELECT 1"
```

If that works, the credentials in `backend/.env` don't match what Postgres expects.

### `password authentication failed for user "..."`
The password in `backend/.env` is wrong, or your local Postgres has `trust` auth (no password). For Postgres.app and a default Homebrew install the password is **empty** — leave `DB_PASSWORD=` blank. For Docker following [Path C](#path-c-docker) the password is `postgres`.

### `relation "hotels" does not exist` (in the backend log)
You created the database but didn't load `001_schema.sql`. Go back to [Step 5](#step-5--create-and-seed-the-database).

### Backend says it's listening but the frontend shows `Network Error` everywhere
- Open browser DevTools → Network tab → reload. Are requests going to `http://localhost:5000/api/...`? If not, check `VITE_API_URL` in `frontend/.env`.
- Check the backend terminal for log output when you click around — if you see nothing, the frontend never reaches the backend (typo, wrong port).

### Browser shows `CORS error: blocked by Access-Control-Allow-Origin`
`CORS_ORIGIN` in `backend/.env` doesn't match the frontend URL exactly. For local dev it should be `http://localhost:5173` (no trailing slash, no `/api`). Restart the backend after editing.

### `Module not found` errors in either terminal
You skipped `npm install` in that directory, or it failed. Re-run it:

```sh
cd backend && npm install
cd ../frontend && npm install
```

### Vite says `EADDRINUSE: address already in use 5173`
Something else is on port 5173 (probably a previous run that didn't exit cleanly):

```sh
lsof -ti :5173 | xargs kill -9
```

Same trick for port 5000 (backend).

### "Sign in with Google" button is greyed out
You set `VITE_GOOGLE_CLIENT_ID` empty. Either set it (see [Optional: Google sign-in](#optional-google-sign-in)) or just use email + password.

### Google sign-in popup closes immediately
The Google OAuth Client ID doesn't have your frontend URL in **Authorized JavaScript origins**. Add `http://localhost:5173` exactly (no trailing slash) and wait ~30 seconds for the change to propagate.

### Everything works but the home page has empty placeholders instead of hotel cards
You didn't load `004_seed.sql`. Either load it now, or register a host account through the UI and create some hotels via the AddRooms wizard.

---

## Next steps

- See [the API reference](API.md) for every endpoint
- See [the architecture doc](ARCHITECTURE.md) for how the pieces fit together
- See [the deployment guide](DEPLOYMENT.md) for putting this on the public internet
- See [the database doc](DATABASE.md) for the schema and triggers

If you hit something not covered here, please [open an issue](https://github.com/Avaneesh40585/Nestoria/issues) — I'd rather expand this guide than have anyone get stuck.
