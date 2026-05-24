-- =============================================================
-- Nestoria — Seed data
-- Aligned with the editorial Claude Design: Indian boutique stays.
-- Passwords: all dev accounts have password "password123"
-- bcrypt hash ($2b$10, 10 rounds): produced once and reused.
-- =============================================================

-- A single bcrypt hash of "password123" (cost 10) reused across seed accounts.
-- Generated with: bcrypt.hashSync('password123', 10)
-- $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- -------------------------------------------------------------
-- Amenities (matches design AMENITY_META)
-- -------------------------------------------------------------
INSERT INTO amenities (key, label, icon) VALUES
    ('wifi',      'Fibre Wi-Fi',         'wifi'),
    ('pool',      'Salt-water pool',     'pool'),
    ('spa',       'Spa & wellness',      'spa'),
    ('utensils',  'Restaurant & bar',    'utensils'),
    ('ac',        'Air conditioning',    'ac'),
    ('car',       'Airport transfer',    'car'),
    ('concierge', '24/7 concierge',      'concierge'),
    ('coffee',    'All-day coffee',      'coffee'),
    ('tv',        'Smart TV',            'tv'),
    ('gym',       'Gym',                 'dumbbell');

-- -------------------------------------------------------------
-- Hosts (3 hosts owning the 8 hotels)
-- -------------------------------------------------------------
INSERT INTO hosts (email, password_hash, full_name, phone, business_name, kyc_verified, superhost, profile_image_url) VALUES
    ('vikram@marigold.in',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Vikram Singh',   '+919812345001', 'Marigold Hospitality',   TRUE, TRUE,  NULL),
    ('priya@casapamparo.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Priya Fernandes','+919812345002', 'Pamparo Collective',     TRUE, FALSE, NULL),
    ('arjun@cardamom.in',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Arjun Bopanna', '+919812345003', 'Western Ghats Hospitality',TRUE,TRUE, NULL);

-- -------------------------------------------------------------
-- Hotels — mirror design's HOTELS array
-- -------------------------------------------------------------
INSERT INTO hotels (host_id, slug, name, region, city, address, description, checkin_time, checkout_time, phone, hue, badge) VALUES
    (1, 'marigold-house',      'The Marigold House',     'Rajasthan', 'Udaipur',     '12 Lake Palace Road, Udaipur 313001',
        'A restored 18th-century haveli overlooking Lake Pichola. Eight suites, an open-air courtyard restaurant, and a rooftop pool framed by hand-carved jharokhas.',
        '15:00', '11:00', '+91 294 555 0142', 'sand', 'Editor''s pick'),
    (1, 'aravali-retreat',     'Aravali Retreat',        'Rajasthan', 'Kumbhalgarh', 'Aravali Ridge, Kumbhalgarh 313325',
        'A low-slung modernist retreat set into a pine ridge, three hours from Udaipur. Salt-water pool, observatory deck, plant-forward menu.',
        '14:00', '11:00', '+91 294 555 0188', 'forest', 'New'),
    (2, 'casa-pamparo',        'Casa Pamparo',           'Goa',       'Assagao',     'House 412, Badem, Assagao 403507',
        'Six-room Indo-Portuguese villa with a courtyard pool, secret garden bar, and a chef who runs the kitchen like a tasting menu.',
        '15:00', '11:00', '+91 832 555 0212', 'ocean', NULL),
    (3, 'postcard-munnar',     'Postcard from Munnar',   'Kerala',    'Munnar',      'Pothamedu Estate, Munnar 685612',
        'Twelve cabins perched above a working tea estate. Wake to mist on the slopes; sleep to crickets.',
        '14:00', '10:30', '+91 4865 555 0301', 'forest', NULL),
    (2, 'the-salt-house',      'The Salt House',         'Goa',       'Mandrem',     'Junas Waddo, Mandrem 403527',
        'A whitewashed beach house with five suites, an outdoor shower garden, and a saltwater plunge pool ten steps from the Arabian Sea.',
        '15:00', '11:00', '+91 832 555 0274', 'ocean', 'Editor''s pick'),
    (1, 'silk-route-inn',      'Silk Route Inn',         'Rajasthan', 'Jaisalmer',   'Inside Jaisalmer Fort, Jaisalmer 345001',
        'Inside the living fort, a six-room guesthouse run by a third-generation family. Sandstone walls, brass details, a rooftop reading nook.',
        '13:00', '11:00', '+91 2992 555 0411', 'sand', NULL),
    (3, 'house-of-cardamom',   'House of Cardamom',      'Karnataka', 'Madikeri',    'Cardamom Estate, Madikeri 571201',
        'A plantation bungalow set among coffee, pepper, and cardamom. Hand-carved Wallace beds, fireplaces in every room, dusk birdwatching.',
        '14:00', '11:00', '+91 8272 555 0502', 'forest', NULL),
    (3, 'indigo-lodge',        'Indigo Lodge',           'Tamil Nadu','Auroville',   'Bharat Nivas Road, Auroville 605101',
        'Earth-bag architecture, a meditation pavilion, and an open kitchen that draws from the surrounding biodynamic farm.',
        '15:00', '11:00', '+91 413 555 0588', 'dusk', NULL);

-- -------------------------------------------------------------
-- Rooms
-- -------------------------------------------------------------
INSERT INTO rooms (hotel_id, type, view, beds, size_sqm, price_per_night, hue) VALUES
    -- Marigold (3 rooms)
    (1, 'Heritage Suite',  'Lake view',              'King bed',          42, 14800, 'sand'),
    (1, 'Garden Room',     'Courtyard view',         'Queen bed',         32,  9800, 'forest'),
    (1, 'Maharaja Suite',  'Lake & city panorama',   'King bed + lounge', 68, 24500, 'dusk'),
    -- Aravali (2)
    (2, 'Pine Cabin',      'Hillside view',          'Queen bed',         28, 11200, 'forest'),
    (2, 'Stargazer Suite', 'Observatory deck',       'King bed',          48, 18900, 'dusk'),
    -- Casa Pamparo (2)
    (3, 'Pool Suite',      'Courtyard pool',         'Queen bed',         36,  9600, 'ocean'),
    (3, 'Garden Room',     'Secret garden',          'Queen bed',         30,  7800, 'forest'),
    -- Postcard Munnar (2)
    (4, 'Tea Cabin',       'Plantation slopes',      'Queen bed',         26,  8400, 'forest'),
    (4, 'Cloud Suite',     'Misty ridge',            'King bed',          40, 12800, 'forest'),
    -- Salt House (2)
    (5, 'Sea Suite',       'Arabian Sea',            'King bed',          44, 16200, 'ocean'),
    (5, 'Plunge Room',     'Garden plunge pool',     'Queen bed',         34, 12400, 'ocean'),
    -- Silk Route Inn (2)
    (6, 'Fort Room',       'Sandstone courtyard',    'Queen bed',         24,  7600, 'sand'),
    (6, 'Rooftop Suite',   'Thar desert horizon',    'King bed',          38, 11200, 'sand'),
    -- House of Cardamom (3)
    (7, 'Wallace Room',    'Coffee estate',          'Queen bed',         30, 12400, 'forest'),
    (7, 'Pepper Suite',    'Cardamom canopy',        'King bed',          42, 16800, 'forest'),
    (7, 'Estate Bungalow', 'Private bungalow',       'King bed + lounge', 72, 28500, 'forest'),
    -- Indigo Lodge (2)
    (8, 'Earth Cabin',     'Meditation garden',      'Queen bed',         28,  8900, 'dusk'),
    (8, 'Indigo Suite',    'Farm view',              'King bed',          40, 13400, 'dusk');

-- -------------------------------------------------------------
-- Hotel ↔ Amenity junctions
-- -------------------------------------------------------------
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT h.id, a.id
FROM hotels h
JOIN amenities a ON a.key = ANY(ARRAY['wifi','pool','spa','utensils','ac','car','concierge','coffee'])
WHERE h.slug = 'marigold-house';

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT h.id, a.id FROM hotels h JOIN amenities a ON a.key = ANY(ARRAY['wifi','pool','spa','utensils','ac','car'])
WHERE h.slug = 'aravali-retreat';

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT h.id, a.id FROM hotels h JOIN amenities a ON a.key = ANY(ARRAY['wifi','pool','utensils','ac','coffee','spa'])
WHERE h.slug = 'casa-pamparo';

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT h.id, a.id FROM hotels h JOIN amenities a ON a.key = ANY(ARRAY['wifi','utensils','spa','car','coffee'])
WHERE h.slug = 'postcard-munnar';

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT h.id, a.id FROM hotels h JOIN amenities a ON a.key = ANY(ARRAY['wifi','pool','utensils','ac','spa','concierge'])
WHERE h.slug = 'the-salt-house';

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT h.id, a.id FROM hotels h JOIN amenities a ON a.key = ANY(ARRAY['wifi','utensils','ac','concierge'])
WHERE h.slug = 'silk-route-inn';

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT h.id, a.id FROM hotels h JOIN amenities a ON a.key = ANY(ARRAY['wifi','utensils','spa','car','coffee','concierge'])
WHERE h.slug = 'house-of-cardamom';

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT h.id, a.id FROM hotels h JOIN amenities a ON a.key = ANY(ARRAY['wifi','pool','utensils','spa','coffee'])
WHERE h.slug = 'indigo-lodge';

-- Room amenities: every room gets wifi + ac, suites also get tv
INSERT INTO room_amenities (room_id, amenity_id)
SELECT r.id, a.id
FROM rooms r CROSS JOIN amenities a
WHERE a.key IN ('wifi','ac');

INSERT INTO room_amenities (room_id, amenity_id)
SELECT r.id, a.id
FROM rooms r JOIN amenities a ON a.key = 'tv'
WHERE r.type ILIKE '%suite%';

-- -------------------------------------------------------------
-- Customers — 50 mock accounts
-- -------------------------------------------------------------
INSERT INTO customers (email, password_hash, full_name, phone)
SELECT
    'customer' || i || '@nestoria.dev',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    (ARRAY['Anaya Mehra','James Whitford','Riya Bhandari','Marcus Lee','Priya Iyer',
           'Ravi Krishnan','Kavita Sharma','David Choi','Aisha Khan','Rohan Kapoor',
           'Maya Subramanian','Liam O''Connor','Sneha Reddy','Adrian Costa','Tara Joshi',
           'Felix Sundar','Nadia Patel','Theo Lawrence','Isha Rao','Lucas Bernard',
           'Aryan Verma','Sophia Reyes','Devika Nair','Ethan Park','Vanya Saxena',
           'Owen Hayward','Mira Pillai','Daniel Adler','Anika Bose','Jonas Müller',
           'Reema Talwar','Henry Wallace','Lila Dhar','Marco Bianchi','Tanvi Iyer',
           'Oscar Lindgren','Saira Ahmed','Caleb Hughes','Diya Bansal','Mateo Silva',
           'Naina Gupta','Hugo Pereira','Aanya Mehta','Sam Reilly','Ila Kapoor',
           'Wren Holloway','Pooja Rao','Beck Allen','Esha Modi','Riley Stone'])[i],
    '+91981234' || lpad((1000 + i)::text, 4, '0')
FROM generate_series(1, 50) i;

-- -------------------------------------------------------------
-- Bookings — 80 mixed bookings
-- -------------------------------------------------------------
INSERT INTO bookings (customer_id, room_id, hotel_id, checkin_date, checkout_date, guests, base_amount, tax_amount, total_amount, status, payment_status)
SELECT
    1 + (i % 50)::int                                            AS customer_id,
    1 + (i % 18)::int                                            AS room_id,
    (SELECT hotel_id FROM rooms WHERE id = 1 + (i % 18)::int)    AS hotel_id,
    (CURRENT_DATE - ((i * 3) || ' days')::interval)::date        AS checkin_date,
    (CURRENT_DATE - ((i * 3 - 3 - (i % 4)) || ' days')::interval)::date AS checkout_date,
    1 + (i % 4),
    base.amt,
    ROUND(base.amt * 0.18, 2),
    ROUND(base.amt * 1.18, 2),
    (ARRAY['completed','completed','completed','confirmed','pending','cancelled']::booking_status[])[1 + (i % 6)],
    'paid'::payment_status
FROM generate_series(1, 80) i
CROSS JOIN LATERAL (
    SELECT (price_per_night * (3 + (i % 4)))::numeric AS amt
    FROM rooms WHERE id = 1 + (i % 18)::int
) base;

-- A few future-dated bookings so the host dashboard "upcoming" view has data
INSERT INTO bookings (customer_id, room_id, hotel_id, checkin_date, checkout_date, guests, base_amount, tax_amount, total_amount, status, payment_status)
SELECT
    1 + (i % 50)::int,
    1 + (i % 18)::int,
    (SELECT hotel_id FROM rooms WHERE id = 1 + (i % 18)::int),
    (CURRENT_DATE + ((i * 2) || ' days')::interval)::date,
    (CURRENT_DATE + ((i * 2 + 3) || ' days')::interval)::date,
    2,
    base.amt,
    ROUND(base.amt * 0.18, 2),
    ROUND(base.amt * 1.18, 2),
    'confirmed'::booking_status,
    'paid'::payment_status
FROM generate_series(1, 20) i
CROSS JOIN LATERAL (
    SELECT (price_per_night * 3)::numeric AS amt
    FROM rooms WHERE id = 1 + (i % 18)::int
) base;

-- -------------------------------------------------------------
-- Reviews — 120 hotel + 100 room reviews on completed bookings
-- -------------------------------------------------------------
INSERT INTO hotel_reviews (customer_id, hotel_id, booking_id, rating, comment, sentiment_score)
SELECT
    b.customer_id,
    b.hotel_id,
    b.id,
    (3.5 + (random() * 1.5))::numeric(2,1),
    (ARRAY[
        'Felt restored after every evening on the veranda.',
        'The staff remembered our names from the welcome and the rooftop dinner was unforgettable.',
        'A place where the architecture does half the storytelling. The other half is the warmth of the family running it.',
        'Quiet, intentional, and beautifully composed.',
        'Wished we''d booked a week instead of three nights.',
        'The light at sunrise is something I''ll think about for a while.',
        'Tiny details — the linen, the morning coffee, the music — all perfectly considered.',
        'The bar pours small, the kitchen pours generous. We were happy.'
    ])[1 + (b.id % 8)],
    65 + (random() * 30)::int
FROM bookings b
WHERE b.status = 'completed'
LIMIT 120;

INSERT INTO room_reviews (customer_id, room_id, booking_id, rating, comment, sentiment_score)
SELECT
    b.customer_id,
    b.room_id,
    b.id,
    (3.8 + (random() * 1.2))::numeric(2,1),
    (ARRAY[
        'Bed worth flying for.',
        'View did all the work.',
        'Compact but considered — nothing wasted.',
        'The bathtub alone justified the upgrade.',
        'Quiet, dark, exactly what we needed.'
    ])[1 + (b.id % 5)],
    70 + (random() * 25)::int
FROM bookings b
WHERE b.status = 'completed'
LIMIT 100;
