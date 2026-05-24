-- =============================================================
-- Nestoria — Greenfield Schema
-- Postgres 14+. Run order: 001_schema → 002_triggers → 004_seed.
-- =============================================================

-- Wipe any prior install (idempotent).
DROP TABLE IF EXISTS room_reviews, hotel_reviews, bookings,
    room_images, hotel_images, room_amenities, hotel_amenities,
    amenities, rooms, hotels, hosts, customers CASCADE;
DROP TYPE IF EXISTS booking_status, payment_status, room_status CASCADE;

-- -------------------------------------------------------------
-- Enums
-- -------------------------------------------------------------
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded');
CREATE TYPE room_status   AS ENUM ('available', 'unavailable', 'maintenance');

-- -------------------------------------------------------------
-- updated_at helper
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- Users (kept as two tables per design decision)
-- =============================================================
CREATE TABLE customers (
    id                 SERIAL PRIMARY KEY,
    email              TEXT NOT NULL UNIQUE,
    password_hash      TEXT,                       -- nullable for Google-only sign-in
    google_sub         TEXT UNIQUE,                -- Google's stable user id
    full_name          TEXT NOT NULL,
    phone              TEXT UNIQUE,
    dob                DATE,
    gender             TEXT,
    profile_image_url  TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_customers_touch BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TABLE hosts (
    id                 SERIAL PRIMARY KEY,
    email              TEXT NOT NULL UNIQUE,
    password_hash      TEXT,
    google_sub         TEXT UNIQUE,
    full_name          TEXT NOT NULL,
    phone              TEXT UNIQUE,
    business_name      TEXT,
    gst_number         TEXT,
    kyc_verified       BOOLEAN NOT NULL DEFAULT FALSE,
    superhost          BOOLEAN NOT NULL DEFAULT FALSE,
    payout_account     TEXT,
    profile_image_url  TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_hosts_touch BEFORE UPDATE ON hosts
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- =============================================================
-- Hotels & rooms
-- =============================================================
CREATE TABLE hotels (
    id              SERIAL PRIMARY KEY,
    host_id         INTEGER NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
    slug            TEXT NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    region          TEXT,                  -- e.g. "Rajasthan"
    city            TEXT,                  -- e.g. "Udaipur"
    address         TEXT,
    description     TEXT,
    checkin_time    TIME DEFAULT '15:00',
    checkout_time   TIME DEFAULT '11:00',
    phone           TEXT,
    hero_image_url  TEXT,
    hue             TEXT DEFAULT 'sand',   -- design placeholder palette
    badge           TEXT,                  -- "Editor's pick" / "New" / NULL
    price_from      INTEGER,               -- denormalised min(room.price_per_night) — UI sorts on it
    rating_avg      NUMERIC(2,1) NOT NULL DEFAULT 0,
    rating_count    INTEGER NOT NULL DEFAULT 0,
    score           INTEGER NOT NULL DEFAULT 0,   -- 0-100 Bayesian composite
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_hotels_touch BEFORE UPDATE ON hotels
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE INDEX idx_hotels_host       ON hotels(host_id);
CREATE INDEX idx_hotels_region     ON hotels(region);
CREATE INDEX idx_hotels_city       ON hotels(city);
CREATE INDEX idx_hotels_price_from ON hotels(price_from);
CREATE INDEX idx_hotels_score      ON hotels(score DESC);

CREATE TABLE rooms (
    id               SERIAL PRIMARY KEY,
    hotel_id         INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    type             TEXT NOT NULL,                -- "Heritage Suite"
    view             TEXT,                         -- "Lake view"
    beds             TEXT,                         -- "King bed"
    size_sqm         INTEGER,
    price_per_night  INTEGER NOT NULL,
    image_url        TEXT,
    hue              TEXT DEFAULT 'sand',
    status           room_status NOT NULL DEFAULT 'available',
    rating_avg       NUMERIC(2,1) NOT NULL DEFAULT 0,
    rating_count     INTEGER NOT NULL DEFAULT 0,
    score            INTEGER NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_rooms_touch BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE INDEX idx_rooms_hotel ON rooms(hotel_id);
CREATE INDEX idx_rooms_price ON rooms(price_per_night);

-- =============================================================
-- Amenities
-- =============================================================
CREATE TABLE amenities (
    id     SERIAL PRIMARY KEY,
    key    TEXT NOT NULL UNIQUE,             -- "wifi", "pool", matches design icons
    label  TEXT NOT NULL,
    icon   TEXT NOT NULL
);

CREATE TABLE hotel_amenities (
    hotel_id    INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    amenity_id  INTEGER NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (hotel_id, amenity_id)
);
CREATE INDEX idx_hotel_amenities_amenity ON hotel_amenities(amenity_id);

CREATE TABLE room_amenities (
    room_id     INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    amenity_id  INTEGER NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (room_id, amenity_id)
);
CREATE INDEX idx_room_amenities_amenity ON room_amenities(amenity_id);

-- =============================================================
-- Image galleries (separate from hero image)
-- =============================================================
CREATE TABLE hotel_images (
    id        SERIAL PRIMARY KEY,
    hotel_id  INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    url       TEXT NOT NULL,
    position  INTEGER NOT NULL DEFAULT 0,
    caption   TEXT
);
CREATE INDEX idx_hotel_images_hotel ON hotel_images(hotel_id, position);

CREATE TABLE room_images (
    id        SERIAL PRIMARY KEY,
    room_id   INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    url       TEXT NOT NULL,
    position  INTEGER NOT NULL DEFAULT 0,
    caption   TEXT
);
CREATE INDEX idx_room_images_room ON room_images(room_id, position);

-- =============================================================
-- Bookings
-- =============================================================
CREATE TABLE bookings (
    id              SERIAL PRIMARY KEY,
    customer_id     INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    room_id         INTEGER NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    hotel_id        INTEGER NOT NULL REFERENCES hotels(id) ON DELETE RESTRICT,  -- denorm for host queries
    checkin_date    DATE NOT NULL,
    checkout_date   DATE NOT NULL,
    guests          INTEGER NOT NULL DEFAULT 1,
    base_amount     NUMERIC(10,2) NOT NULL,
    tax_amount      NUMERIC(10,2) NOT NULL,
    total_amount    NUMERIC(10,2) NOT NULL,
    status          booking_status NOT NULL DEFAULT 'pending',
    payment_status  payment_status NOT NULL DEFAULT 'unpaid',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (checkout_date > checkin_date)
);
CREATE TRIGGER trg_bookings_touch BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE INDEX idx_bookings_customer ON bookings(customer_id, created_at DESC);
CREATE INDEX idx_bookings_room     ON bookings(room_id, checkin_date, checkout_date);
CREATE INDEX idx_bookings_hotel    ON bookings(hotel_id, created_at DESC);
CREATE INDEX idx_bookings_status   ON bookings(status);

-- =============================================================
-- Reviews — one per booking (UNIQUE), hotel + room separately
-- =============================================================
CREATE TABLE hotel_reviews (
    id              SERIAL PRIMARY KEY,
    customer_id     INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    hotel_id        INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    booking_id      INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    rating          NUMERIC(2,1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    sentiment_score INTEGER CHECK (sentiment_score BETWEEN 0 AND 100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (customer_id, booking_id)
);
CREATE INDEX idx_hotel_reviews_hotel ON hotel_reviews(hotel_id, created_at DESC);

CREATE TABLE room_reviews (
    id              SERIAL PRIMARY KEY,
    customer_id     INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    room_id         INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    booking_id      INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    rating          NUMERIC(2,1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    sentiment_score INTEGER CHECK (sentiment_score BETWEEN 0 AND 100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (customer_id, booking_id)
);
CREATE INDEX idx_room_reviews_room ON room_reviews(room_id, created_at DESC);
