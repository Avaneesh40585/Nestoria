const pool = require('../../config/db');
const { asyncHandler, badRequest, notFound, forbidden } = require('../../lib/http');

// Helper: amenity rows for any hotel id list — single round trip.
async function loadAmenities(hotelIds) {
  if (hotelIds.length === 0) return new Map();
  const { rows } = await pool.query(
    `SELECT ha.hotel_id, a.key, a.label, a.icon
       FROM hotel_amenities ha JOIN amenities a ON a.id = ha.amenity_id
      WHERE ha.hotel_id = ANY($1::int[])
      ORDER BY a.id`,
    [hotelIds]
  );
  const map = new Map(hotelIds.map((id) => [id, []]));
  rows.forEach((r) => map.get(r.hotel_id).push({ key: r.key, label: r.label, icon: r.icon }));
  return map;
}

// ---------- GET /hotels  (search / list) ----------
const search = asyncHandler(async (req, res) => {
  const { location, min_price, max_price, min_rating, region, sort = 'score' } = req.query;
  const params = [];
  const where = [];

  if (location) {
    params.push(`%${location}%`);
    where.push(`(h.city ILIKE $${params.length} OR h.region ILIKE $${params.length} OR h.name ILIKE $${params.length})`);
  }
  if (region) { params.push(region); where.push(`h.region = $${params.length}`); }
  if (min_price) { params.push(Number(min_price)); where.push(`h.price_from >= $${params.length}`); }
  if (max_price) { params.push(Number(max_price)); where.push(`h.price_from <= $${params.length}`); }
  if (min_rating) { params.push(Number(min_rating)); where.push(`h.rating_avg >= $${params.length}`); }

  const ORDER = {
    score:      'h.score DESC, h.rating_avg DESC',
    rating:     'h.rating_avg DESC, h.score DESC',
    price_asc:  'h.price_from ASC NULLS LAST',
    price_desc: 'h.price_from DESC NULLS LAST',
    newest:     'h.created_at DESC',
  }[sort] || 'h.score DESC';

  const { rows: hotels } = await pool.query(
    `SELECT h.id, h.slug, h.name, h.region, h.city, h.address, h.description,
            h.hero_image_url, h.hue, h.badge, h.price_from,
            h.rating_avg, h.rating_count, h.score,
            h.checkin_time, h.checkout_time
       FROM hotels h
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY ${ORDER}
      LIMIT 100`,
    params
  );

  const amenities = await loadAmenities(hotels.map((h) => h.id));
  hotels.forEach((h) => { h.amenities = amenities.get(h.id) || []; });
  res.json({ hotels });
});

// ---------- GET /hotels/destinations  (home page list) ----------
const destinations = asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT city AS name, region, COUNT(*) AS stays,
           (ARRAY_AGG(hue))[1] AS hue
      FROM hotels
     WHERE city IS NOT NULL
     GROUP BY city, region
     ORDER BY stays DESC, city
  `);
  res.json({ destinations: rows.map((r) => ({ ...r, stays: Number(r.stays) })) });
});

// ---------- GET /hotels/:slug  (full detail) ----------
const detail = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { rows } = await pool.query(
    `SELECT h.*, host.full_name AS host_name, host.business_name AS host_business,
            host.superhost AS host_superhost
       FROM hotels h JOIN hosts host ON host.id = h.host_id
      WHERE h.slug = $1`,
    [slug]
  );
  const hotel = rows[0];
  if (!hotel) throw notFound('Hotel not found');

  const [amenitiesRes, roomsRes, reviewsRes, imagesRes] = await Promise.all([
    pool.query(`SELECT a.key, a.label, a.icon FROM hotel_amenities ha
                JOIN amenities a ON a.id = ha.amenity_id WHERE ha.hotel_id = $1 ORDER BY a.id`, [hotel.id]),
    pool.query(`SELECT r.id, r.type, r.view, r.beds, r.size_sqm, r.price_per_night,
                       r.image_url, r.hue, r.status, r.rating_avg, r.rating_count, r.score
                  FROM rooms r WHERE r.hotel_id = $1 ORDER BY r.price_per_night`, [hotel.id]),
    pool.query(`SELECT hr.id, hr.rating, hr.comment, hr.created_at,
                       c.full_name AS customer_name
                  FROM hotel_reviews hr JOIN customers c ON c.id = hr.customer_id
                 WHERE hr.hotel_id = $1
                 ORDER BY hr.created_at DESC LIMIT 20`, [hotel.id]),
    pool.query(`SELECT url, caption, position FROM hotel_images
                 WHERE hotel_id = $1 ORDER BY position`, [hotel.id]),
  ]);

  hotel.amenities = amenitiesRes.rows;
  hotel.rooms     = roomsRes.rows;
  hotel.reviews   = reviewsRes.rows;
  hotel.gallery   = imagesRes.rows;
  res.json({ hotel });
});

// ---------- POST /hotels  (host creates) ----------
const create = asyncHandler(async (req, res) => {
  const { name, slug, region, city, address, description, checkin_time, checkout_time, phone, hero_image_url, hue, badge, amenities } = req.body;
  if (!name || !slug) throw badRequest('name and slug are required');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO hotels (host_id, name, slug, region, city, address, description,
                           checkin_time, checkout_time, phone, hero_image_url, hue, badge)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [req.user.id, name, slug, region, city, address, description, checkin_time, checkout_time, phone, hero_image_url, hue || 'sand', badge]
    );
    const hotel = rows[0];
    if (Array.isArray(amenities) && amenities.length) {
      await client.query(
        `INSERT INTO hotel_amenities (hotel_id, amenity_id)
           SELECT $1, a.id FROM amenities a WHERE a.key = ANY($2::text[])`,
        [hotel.id, amenities]
      );
    }
    await client.query('COMMIT');
    res.status(201).json({ hotel });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') throw badRequest('A hotel with that slug already exists');
    throw err;
  } finally {
    client.release();
  }
});

async function assertOwner(hotelId, hostId) {
  const { rows } = await pool.query('SELECT host_id FROM hotels WHERE id = $1', [hotelId]);
  if (!rows[0]) throw notFound('Hotel not found');
  if (rows[0].host_id !== hostId) throw forbidden('You do not own this hotel');
}

// ---------- PUT /hotels/:id ----------
const update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await assertOwner(id, req.user.id);
  const allowed = ['name', 'region', 'city', 'address', 'description', 'checkin_time', 'checkout_time', 'phone', 'hero_image_url', 'hue', 'badge'];
  const fields = allowed.filter((f) => req.body[f] !== undefined);
  if (!fields.length) return res.json({ updated: false });
  const set = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  const vals = fields.map((f) => req.body[f]);
  vals.push(id);
  const { rows } = await pool.query(`UPDATE hotels SET ${set} WHERE id = $${vals.length} RETURNING *`, vals);
  res.json({ hotel: rows[0] });
});

// ---------- DELETE /hotels/:id ----------
const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await assertOwner(id, req.user.id);
  await pool.query('DELETE FROM hotels WHERE id = $1', [id]);
  res.status(204).end();
});

module.exports = { search, destinations, detail, create, update, remove };
