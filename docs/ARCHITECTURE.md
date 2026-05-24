# Architecture

A tour of how Nestoria is laid out, why the pieces are split the way they are, and what flows through them at runtime.

---

## High-level topology

```
┌───────────────────────────────────────────────────────────────┐
│  Browser (Vite + React 18 SPA)                                │
│  • TanStack Query cache (in-memory)                           │
│  • AuthContext (token + user in localStorage)                 │
│  • react-router routes                                         │
│  • react-hook-form + Zod validation on every form             │
└───────────┬───────────────────────────────────┬───────────────┘
            │ HTTPS / JSON                       │ multipart/form-data
            │ (Bearer JWT)                       │ (image uploads)
            ▼                                    ▼
┌───────────────────────────────────────────────────────────────┐
│  Express API  (Node 18+,  127.0.0.1:5000)                     │
│  • Feature modules: auth/hotels/rooms/bookings/reviews/…      │
│  • lib/userRepo — generic Customer/Host data access            │
│  • middleware/auth — JWT verify + role guards                 │
│  • middleware/error — central HttpError handler               │
└───────────┬─────────────────────────────────┬─────────────────┘
            │ SQL                              │ Object storage
            ▼                                  ▼
┌──────────────────────────────┐  ┌─────────────────────────────┐
│  PostgreSQL 14+              │  │  Supabase Storage           │
│  • snake_case schema         │  │  • Single bucket            │
│  • Bayesian rating triggers  │  │  • Service-role uploads     │
│  • Junction tables           │  │  • Public reads             │
└──────────────────────────────┘  └─────────────────────────────┘
                                              ▲
                                              │ Google ID token
                                              │ (server verifies)
                                  ┌───────────┴──────────────┐
                                  │  Google Identity Services │
                                  │  (token issuer only)      │
                                  └──────────────────────────┘
```

The frontend never touches the database or storage directly. The backend never serves HTML — it is a pure JSON API.

---

## Backend module layout

```
backend/
├── server.js                 thin wiring layer (~30 LOC)
├── config/
│   ├── db.js                 single pg.Pool instance, exported as module default
│   ├── supabase.js           lazy-initialized service-role client + bucket name
│   └── google.js             OAuth2Client + verifyGoogleIdToken()
├── lib/
│   ├── http.js               asyncHandler + HttpError + helpers (badRequest, notFound, …)
│   ├── jwt.js                signToken / verifyToken
│   └── userRepo.js           generic Customer/Host repository
├── middleware/
│   ├── auth.js               authenticate · requireRole · requireHost · requireCustomer
│   └── error.js              notFoundHandler + central errorHandler
└── modules/
    ├── auth/{route,controller}.js
    ├── hotels/{route,controller}.js
    ├── rooms/{route,controller}.js
    ├── bookings/{route,controller}.js
    ├── reviews/{route,controller}.js
    ├── profile/{route,controller}.js
    ├── host/{route,controller}.js
    └── upload/{route,controller}.js
```

### Why feature folders?

The previous codebase had one fat controller per entity in `controllers/` and a sibling route file in `routes/`, plus duplicated logic across Customer and Host. Splitting into feature folders means:

- A new contributor opens one folder to see everything about, say, bookings.
- Each module's route file owns its own middleware stack (`router.use(authenticate, requireHost)`), so the global wiring stays trivial.
- Cross-cutting helpers live in `lib/` and `middleware/` — never inside a module.

### The generic `userRepo`

The product keeps Customer and Host as separate SQL tables (different columns, different ratings semantics) but the **behaviour** is almost identical: lookup by id, lookup by email, lookup by `google_sub`, create, update, set password, link Google account.

`lib/userRepo.js` exposes a single factory:

```js
const customers = userRepo('customer');
const hosts     = userRepo('host');

await customers.getByEmail('anaya@example.com');
await hosts.create({ email, password_hash, full_name, business_name });
```

It internally holds an allow-list of writable columns per role to prevent drive-by updates from a request body. The 80% of duplicated controller code from the previous version collapses into ~80 LOC of repo + 3 short functions per controller.

### Error flow

Every controller is wrapped in `asyncHandler` (see `lib/http.js`). Anything thrown — domain errors via `badRequest('…')`, `notFound('…')`, etc., or runtime errors — bubbles up to `middleware/error.js`, which sends a JSON envelope:

```json
{ "error": "Hotel not found", "code": "notFound" }
```

No controller writes `try/catch` boilerplate.

---

## Frontend layout

```
frontend/
├── index.html               anti-FOUC theme bootstrap + font preconnects
├── vite.config.js           plugin-react, build → ./build
└── src/
    ├── main.jsx             React + QueryClientProvider + GoogleOAuthProvider + AuthProvider
    ├── App.jsx              BrowserRouter + Header + Footer + TweaksPanel + routes
    ├── styles/index.css     editorial design system (902 LOC, CSS variables)
    ├── components/          Header · Footer · SearchBar · HotelCard · Icon · Photo · Stepper · ThemeToggle · TweaksPanel · ProtectedRoute
    ├── screens/             one file per route (Home, Hotels, Detail, Booking, Login, Profile, Host, AddRooms, NotFound)
    ├── hooks/               useTheme · useTweaks (accent palette)
    ├── lib/
    │   ├── api.js           axios instance + namespaced endpoints (authAPI, hotelsAPI, …)
    │   ├── queryClient.js   TanStack QueryClient with sensible defaults
    │   └── schemas.js       Zod schemas: loginSchema, signupSchema, bookingSchema, …
    └── context/
        └── AuthContext.jsx  user + token, persisted to localStorage
```

### Data fetching pattern

Every screen pulls server data through TanStack Query, never via `useEffect + fetch`:

```jsx
const { data, isLoading } = useQuery({
  queryKey: ['hotel', slug],
  queryFn: () => hotelsAPI.detail(slug).then((d) => d.hotel),
});
```

Mutations (create booking, cancel booking, save profile) go through `useMutation` with `onSuccess` invalidating the relevant query keys.

Benefits over the previous `useState + useEffect` style:
- Automatic request deduplication.
- Cache survives navigation — clicking back to a detail screen renders instantly while a background refetch runs.
- Built-in `isLoading` / `isError` / `isFetching` states.

### Forms

Every multi-field form (login, signup, profile, booking guest details, AddRooms wizard) uses `react-hook-form` with a Zod resolver. Schemas live in `lib/schemas.js` so the validation rules are shared between forms and the request payload shape.

### Theming

Two layers:

1. **Light / dark mode** — toggled via the `data-theme` attribute on `<html>`. CSS custom properties (`--bg`, `--ink`, `--accent`, …) re-resolve automatically. Initial value is set by an inline script in `index.html` so there's no flash of unstyled content.

2. **Accent palette** — five named presets (Terracotta / Forest / Ink / Saffron / Plum), each with separate values for light and dark modes. Picked via the floating Tweaks panel; `useTweaks(theme)` writes `--accent`, `--accent-soft`, and `--accent-ink` to the document root.

Both choices persist in `localStorage` (`nestoria-theme` and `nestoria-tweaks`).

### Auth flow

```
1.  User submits LoginScreen form
2.  authAPI.login({ role, email, password }) → POST /api/auth/login
3.  Backend returns { token, user }
4.  AuthContext.login(token, user) stores both in localStorage
5.  axios interceptor reads `nestoria-token` and adds Authorization header on every subsequent request
6.  ProtectedRoute checks AuthContext.user before rendering customer/host pages
7.  401 response → interceptor clears localStorage so the next render redirects to /login
```

Google sign-in skips steps 1–3 in favour of:

```
1.  GoogleLogin button (from @react-oauth/google) opens Google popup
2.  On success it returns a credential (Google ID token)
3.  authAPI.google({ role, credential }) → POST /api/auth/google
4.  Backend verifies the ID token against Google's JWKS via google-auth-library
5.  Backend either finds the user by google_sub, links Google to an existing email match, or creates a new account — then returns { token, user }
```

---

## Data flows

### Booking creation

```
1.  Customer clicks Reserve on DetailScreen
    → Navigate to /booking?room=…&hotel=…&checkin=…&checkout=…&guests=…
2.  BookingScreen step 0 collects guest details (react-hook-form)
3.  Step 1 collects payment details (currently mock)
4.  On Confirm → useMutation calls POST /api/bookings
5.  Backend opens a pg.connect() transaction:
       a. SELECT … FOR UPDATE on the row in `rooms` (prevents concurrent booking of the same room)
       b. EXISTS check for date overlap against `bookings` (excluding cancelled)
       c. INSERT into `bookings` with computed base/tax/total
       d. COMMIT
6.  Response → BookingScreen advances to step 2 (confirmation)
7.  TanStack Query invalidates `['bookings/my']` so ProfileScreen reflects the new row on next visit
```

### Review with rating recompute

```
1.  Customer posts a review (POST /api/reviews) for a completed booking
2.  Backend inserts into hotel_reviews and/or room_reviews
3.  AFTER INSERT trigger fires (002_triggers.sql):
       a. Compute COUNT + AVG(rating) over all reviews for that hotel/room
       b. Average sentiment from the most recent 100 (hotel) or 50 (room) reviews
       c. Bayesian smoothing toward global mean (3.8) with confidence weight 50/30
       d. Score = round((0.7 · normalised_rating + 0.3 · sentiment) · 100)
       e. UPDATE the parent row's rating_avg, rating_count, score
4.  Next time DetailScreen loads that hotel, the new numbers are returned in the join
```

### Web image upload

```
1.  Host on AddRoomsScreen clicks "Upload" hero image
2.  File is read into a FormData and POSTed to /api/upload/hotel-image
3.  multer fileFilter rejects anything that isn't JPEG/PNG/WebP
4.  Backend authenticates with the service-role key against Supabase Storage
5.  Object is written to `hotel-images/hotels/<timestamp>-<random>.<ext>`
6.  Backend returns the public URL
7.  Frontend immediately PUTs /api/hotels/:id with hero_image_url, so the hotel row records it
```

---

## Why these choices

| Decision | Reason |
|---|---|
| Vite over Next.js | The app is SPA-first; SSR/SEO aren't requirements yet. Vite gives sub-second HMR, no server runtime, and trivial static hosting. |
| Plain CSS over Tailwind | The editorial aesthetic is heavy on type and white space, with a hand-tuned colour system in OKLCH. Tailwind utility classes would obscure that. CSS variables make light/dark and accent palettes trivial. |
| TanStack Query | Replaces hundreds of lines of `useEffect`/loading-state boilerplate from the previous codebase, and adds caching for free. |
| react-hook-form + Zod | One schema describes both the form validation and (effectively) the API contract. Zero-cost form re-renders. |
| google-auth-library over Firebase Admin | The previous backend pulled in the entire Firebase SDK just to verify Google ID tokens. `google-auth-library` does exactly that and nothing else. |
| Separate Customer / Host tables | Different columns (Hosts have GST, payout details, KYC, Superhost tier), different lifecycles. A unified Users table would require either many nullable columns or a JSON blob — both worse than two clean tables behind a generic repository. |
| Bayesian rating triggers in SQL | Rating computation is data-shape logic, not business logic. Keeping it in triggers means the application code (and any future analytics jobs) can trust `hotels.rating_avg` directly with no cache-coherence concerns. |
| Single Supabase bucket | All hotel and room images share `hotel-images` with public-read RLS. Easier than per-tenant buckets and the URLs aren't sensitive. |
