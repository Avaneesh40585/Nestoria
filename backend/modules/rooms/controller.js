const pool = require('../../config/db');
const { asyncHandler, notFound, forbidden, badRequest } = require('../../lib/http');

// ---------- GET /rooms/:id ----------
const detail = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await pool.query(
    `SELECT r.*, h.slug AS hotel_slug, h.name AS hotel_name
       FROM rooms r JOIN hotels h ON h.id = r.hotel_id
      WHERE r.id = $1`, [id]
  );
  const room = rows[0];
  if (!room) throw notFound('Room not found');
  const [amenitiesRes, imagesRes] = await Promise.all([
    pool.query(`SELECT a.key, a.label, a.icon FROM room_amenities ra
                JOIN amenities a ON a.id = ra.amenity_id WHERE ra.room_id = $1 ORDER BY a.id`, [id]),
    pool.query(`SELECT url, caption, position FROM room_images WHERE room_id = $1 ORDER BY position`, [id]),
  ]);
  room.amenities = amenitiesRes.rows;
  room.gallery   = imagesRes.rows;
  res.json({ room });
});

// ---------- GET /rooms/:id/availability?checkin=&checkout= ----------
const availability = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { checkin, checkout } = req.query;
  if (!checkin || !checkout) throw badRequest('checkin and checkout are required');

  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS conflicts
       FROM bookings
      WHERE room_id = $1
        AND status NOT IN ('cancelled')
        AND NOT (checkout_date <= $2 OR checkin_date >= $3)`,
    [id, checkin, checkout]
  );
  res.json({ available: rows[0].conflicts === 0 });
});

async function assertRoomOwner(roomId, hostId) {
  const { rows } = await pool.query(
    `SELECT h.host_id FROM rooms r JOIN hotels h ON h.id = r.hotel_id WHERE r.id = $1`, [roomId]
  );
  if (!rows[0]) throw notFound('Room not found');
  if (rows[0].host_id !== hostId) throw forbidden('You do not own this room');
}

async function assertHotelOwner(hotelId, hostId) {
  const { rows } = await pool.query('SELECT host_id FROM hotels WHERE id = $1', [hotelId]);
  if (!rows[0]) throw notFound('Hotel not found');
  if (rows[0].host_id !== hostId) throw forbidden('You do not own this hotel');
}

// ---------- POST /rooms ----------
const create = asyncHandler(async (req, res) => {
  const { hotel_id, type, view, beds, size_sqm, price_per_night, image_url, hue, amenities } = req.body;
  if (!hotel_id || !type || !price_per_night) throw badRequest('hotel_id, type, price_per_night required');
  await assertHotelOwner(Number(hotel_id), req.user.id);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO rooms (hotel_id, type, view, beds, size_sqm, price_per_night, image_url, hue)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [hotel_id, type, view, beds, size_sqm, price_per_night, image_url, hue || 'sand']
    );
    const room = rows[0];
    if (Array.isArray(amenities) && amenities.length) {
      await client.query(
        `INSERT INTO room_amenities (room_id, amenity_id)
           SELECT $1, a.id FROM amenities a WHERE a.key = ANY($2::text[])`,
        [room.id, amenities]
      );
    }
    await client.query('COMMIT');
    res.status(201).json({ room });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

// ---------- PUT /rooms/:id ----------
const update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await assertRoomOwner(id, req.user.id);
  const allowed = ['type', 'view', 'beds', 'size_sqm', 'price_per_night', 'image_url', 'hue', 'status'];
  const fields = allowed.filter((f) => req.body[f] !== undefined);
  if (!fields.length) return res.json({ updated: false });
  const set = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  const vals = fields.map((f) => req.body[f]);
  vals.push(id);
  const { rows } = await pool.query(`UPDATE rooms SET ${set} WHERE id = $${vals.length} RETURNING *`, vals);
  res.json({ room: rows[0] });
});

// ---------- DELETE /rooms/:id ----------
const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await assertRoomOwner(id, req.user.id);
  await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
  res.status(204).end();
});

module.exports = { detail, availability, create, update, remove };
