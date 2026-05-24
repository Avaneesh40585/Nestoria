# Database

PostgreSQL 14+. The schema lives in four versioned SQL files under [`database/`](../database) and is intended to be applied in order from a freshly created database.

```sh
createdb nestoria_db
psql nestoria_db -f database/001_schema.sql
psql nestoria_db -f database/002_triggers.sql
psql nestoria_db -f database/004_seed.sql      # optional sample data

# 003_storage.sql runs in the Supabase SQL editor, NOT against Postgres
```

`001_schema.sql` includes `DROP TABLE … CASCADE` at the top, so re-running it cleanly resets the database.

---

## Conventions

- `snake_case` everywhere — tables, columns, enums.
- Integer surrogate keys (`SERIAL PRIMARY KEY`). No string IDs.
- `created_at TIMESTAMPTZ DEFAULT now()` + `updated_at TIMESTAMPTZ DEFAULT now()` on every table that can be edited. `updated_at` is maintained by a generic `touch_updated_at` trigger.
- Foreign keys are explicit; `ON DELETE` is `CASCADE` for owned data (hotels → rooms → bookings) and `RESTRICT` when deleting would lose money (customers/rooms referenced by bookings).
- All amounts are `NUMERIC(10,2)` in INR. Dates are `DATE`. Timestamps are `TIMESTAMPTZ`.

---

## Enums

```sql
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded');
CREATE TYPE room_status   AS ENUM ('available', 'unavailable', 'maintenance');
```

---

## Tables

### `customers`

| column | type | notes |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` |  |
| `email` | `TEXT NOT NULL UNIQUE` |  |
| `password_hash` | `TEXT` | nullable for Google-only accounts |
| `google_sub` | `TEXT UNIQUE` | Google's stable user id |
| `full_name` | `TEXT NOT NULL` |  |
| `phone` | `TEXT UNIQUE` |  |
| `dob` | `DATE` |  |
| `gender` | `TEXT` |  |
| `profile_image_url` | `TEXT` |  |
| `created_at`, `updated_at` | `TIMESTAMPTZ NOT NULL DEFAULT now()` |  |

### `hosts`

Same shape as `customers` plus host-specific fields:

| column | type | notes |
|---|---|---|
| `business_name` | `TEXT` |  |
| `gst_number` | `TEXT` |  |
| `kyc_verified` | `BOOLEAN NOT NULL DEFAULT FALSE` |  |
| `superhost` | `BOOLEAN NOT NULL DEFAULT FALSE` |  |
| `payout_account` | `TEXT` | bank / UPI string |

### `hotels`

| column | type | notes |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` |  |
| `host_id` | `INTEGER NOT NULL REFERENCES hosts(id) ON DELETE CASCADE` |  |
| `slug` | `TEXT NOT NULL UNIQUE` | URL component, lowercase + dashes |
| `name`, `region`, `city`, `address` | `TEXT` |  |
| `description` | `TEXT` |  |
| `checkin_time`, `checkout_time` | `TIME` | default `15:00` / `11:00` |
| `phone` | `TEXT` |  |
| `hero_image_url` | `TEXT` | hero photo URL (Supabase) |
| `hue` | `TEXT` | placeholder palette key for the design (`sand`, `ocean`, `forest`, `dusk`, `warm`, `cool`) |
| `badge` | `TEXT` | e.g. "Editor's pick" |
| `price_from` | `INTEGER` | denormalised `MIN(rooms.price_per_night)` — maintained by trigger |
| `rating_avg` | `NUMERIC(2,1)` | maintained by trigger, default 0 |
| `rating_count` | `INTEGER NOT NULL DEFAULT 0` | maintained by trigger |
| `score` | `INTEGER NOT NULL DEFAULT 0` | 0–100 Bayesian composite |

Indexes: `(host_id)`, `(region)`, `(city)`, `(price_from)`, `(score DESC)`.

### `rooms`

| column | type | notes |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` |  |
| `hotel_id` | `INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE` |  |
| `type` | `TEXT NOT NULL` | "Heritage Suite", "Garden Room", … |
| `view`, `beds` | `TEXT` |  |
| `size_sqm` | `INTEGER` |  |
| `price_per_night` | `INTEGER NOT NULL` | INR |
| `image_url` | `TEXT` |  |
| `hue` | `TEXT` |  |
| `status` | `room_status NOT NULL DEFAULT 'available'` |  |
| `rating_avg`, `rating_count`, `score` | maintained by trigger |  |

### `amenities`

```sql
CREATE TABLE amenities (
  id     SERIAL PRIMARY KEY,
  key    TEXT NOT NULL UNIQUE,  -- 'wifi', 'pool', 'spa', …
  label  TEXT NOT NULL,         -- 'Fibre Wi-Fi'
  icon   TEXT NOT NULL          -- matches the frontend Icon component name
);
```

Seeded once with the ten amenities the UI knows how to render.

### `hotel_amenities` & `room_amenities`

Junction tables with composite PKs and reverse-lookup indexes.

```sql
CREATE TABLE hotel_amenities (
  hotel_id    INTEGER NOT NULL REFERENCES hotels(id)    ON DELETE CASCADE,
  amenity_id  INTEGER NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (hotel_id, amenity_id)
);
```

### `hotel_images` & `room_images`

Optional galleries (separate from the hero image on `hotels.hero_image_url`).

| column | type | notes |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` |  |
| `hotel_id` / `room_id` | FK | parent |
| `url` | `TEXT NOT NULL` |  |
| `position` | `INTEGER NOT NULL DEFAULT 0` | display order |
| `caption` | `TEXT` |  |

### `bookings`

| column | type | notes |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` |  |
| `customer_id` | `INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT` |  |
| `room_id` | `INTEGER NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT` |  |
| `hotel_id` | `INTEGER NOT NULL REFERENCES hotels(id) ON DELETE RESTRICT` | denormalised for the host dashboard |
| `checkin_date`, `checkout_date` | `DATE NOT NULL` | `CHECK (checkout_date > checkin_date)` |
| `guests` | `INTEGER NOT NULL DEFAULT 1` |  |
| `base_amount`, `tax_amount`, `total_amount` | `NUMERIC(10,2)` | INR |
| `status` | `booking_status NOT NULL DEFAULT 'pending'` |  |
| `payment_status` | `payment_status NOT NULL DEFAULT 'unpaid'` |  |

Indexes: `(customer_id, created_at DESC)`, `(room_id, checkin_date, checkout_date)`, `(hotel_id, created_at DESC)`, `(status)`.

### `hotel_reviews` & `room_reviews`

| column | type | notes |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` |  |
| `customer_id` | FK |  |
| `hotel_id` / `room_id` | FK |  |
| `booking_id` | FK | enforces "must have stayed" |
| `rating` | `NUMERIC(2,1) NOT NULL CHECK (rating BETWEEN 1 AND 5)` |  |
| `comment` | `TEXT` |  |
| `sentiment_score` | `INTEGER CHECK (sentiment_score BETWEEN 0 AND 100)` | computed in the application |
| `created_at` | `TIMESTAMPTZ NOT NULL DEFAULT now()` |  |
| | `UNIQUE (customer_id, booking_id)` | one review per booking per customer |

---

## Triggers

### `recompute_hotel_rating(p_hotel_id)`

Called from an `AFTER INSERT OR UPDATE OR DELETE` trigger on `hotel_reviews`. Computes:

- `rating_count = COUNT(*)`
- `rating_avg   = AVG(rating)` rounded to one decimal
- `score`:
  - Bayesian smoothing toward the global mean (3.8), confidence weight 50
  - Recent sentiment = average of the latest 100 reviews' `sentiment_score / 100`
  - `score = ROUND( ((0.7 × normalised_bayes) + (0.3 × sentiment)) × 100 )`

The result lands back on the parent `hotels` row in one `UPDATE`.

### `recompute_room_rating(p_room_id)`

Same shape with a tighter confidence (30) and a 50-review sentiment window.

### `recompute_hotel_price_from(p_hotel_id)`

Fires on `AFTER INSERT/UPDATE OF price_per_night/DELETE` on `rooms`. Keeps `hotels.price_from = MIN(rooms.price_per_night)` so the search/list page can sort and filter on a single denormalised column.

### `touch_updated_at`

A generic `BEFORE UPDATE` trigger attached to `customers`, `hosts`, `hotels`, `rooms`, and `bookings`. Sets `NEW.updated_at = now()`.

---

## Seed data (`004_seed.sql`)

If you load the seed file you get a believable dev dataset:

- **10 amenities** matching the UI icon set
- **3 hosts** (one Superhost)
- **8 hotels** mirroring the design's editorial copy — The Marigold House, Aravali Retreat, Casa Pamparo, Postcard from Munnar, The Salt House, Silk Route Inn, House of Cardamom, Indigo Lodge
- **18 rooms** with realistic INR pricing
- Hotel ↔ amenity links per the design
- Room amenities (every room gets wifi + ac; suites add tv)
- **50 customers** (`customer1@nestoria.dev` … `customer50@nestoria.dev`)
- **100 bookings** spread across the past few months with a mix of statuses, plus ~20 future-dated `confirmed` bookings so the host dashboard's "upcoming arrivals" view has data
- **~220 reviews** seeded on completed bookings, which causes the rating triggers to populate `rating_avg`/`rating_count`/`score` on every hotel and room

All seeded accounts share the password `password123` (bcrypt cost 10). **Never deploy the seed file to production.**

---

## Supabase Storage (`003_storage.sql`)

This script runs in the Supabase SQL editor against the project that holds your `hotel-images` bucket. It sets three RLS policies on `storage.objects`:

| policy | role | action | scope |
|---|---|---|---|
| public read on hotel-images | anyone | `SELECT` | `bucket_id = 'hotel-images'` |
| service-role insert on hotel-images | service role | `INSERT` | same |
| service-role delete on hotel-images | service role | `DELETE` | same |

Reads are open so the frontend can render images via the public CDN URL Supabase generates. Writes and deletes are gated on the service-role key the backend holds — browsers never call Storage directly.
