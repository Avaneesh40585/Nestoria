const pool = require('../../config/db');
const { asyncHandler, badRequest, notFound, forbidden, conflict } = require('../../lib/http');

const TAX_RATE = 0.18;

function nightsBetween(checkin, checkout) {
  const a = new Date(checkin), b = new Date(checkout);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

// ---------- POST /bookings ----------
const create = asyncHandler(async (req, res) => {
  const { room_id, checkin_date, checkout_date, guests } = req.body;
  if (!room_id || !checkin_date || !checkout_date) {
    throw badRequest('room_id, checkin_date, checkout_date required');
  }
  const nights = nightsBetween(checkin_date, checkout_date);
  if (nights <= 0) throw badRequest('checkout must be after checkin');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock the room row so two concurrent bookings can't race.
    const { rows: roomRows } = await client.query(
      'SELECT id, hotel_id, price_per_night, status FROM rooms WHERE id = $1 FOR UPDATE', [room_id]
    );
    const room = roomRows[0];
    if (!room) throw notFound('Room not found');
    if (room.status !== 'available') throw conflict('Room is not available');

    const { rows: clash } = await client.query(
      `SELECT 1 FROM bookings
         WHERE room_id = $1
           AND status NOT IN ('cancelled')
           AND NOT (checkout_date <= $2 OR checkin_date >= $3)
         LIMIT 1`,
      [room_id, checkin_date, checkout_date]
    );
    if (clash.length) throw conflict('Room is already booked for those dates');

    const base  = Number(room.price_per_night) * nights;
    const tax   = +(base * TAX_RATE).toFixed(2);
    const total = +(base + tax).toFixed(2);

    const { rows } = await client.query(
      `INSERT INTO bookings (customer_id, room_id, hotel_id, checkin_date, checkout_date,
                             guests, base_amount, tax_amount, total_amount, status, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'confirmed','paid')
       RETURNING *`,
      [req.user.id, room_id, room.hotel_id, checkin_date, checkout_date, guests || 1, base, tax, total]
    );
    await client.query('COMMIT');
    res.status(201).json({ booking: rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

// ---------- GET /bookings/my ----------
const myBookings = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT b.id, b.checkin_date, b.checkout_date, b.guests,
            b.base_amount, b.tax_amount, b.total_amount, b.status, b.payment_status, b.created_at,
            r.id AS room_id, r.type AS room_type, r.view AS room_view, r.image_url AS room_image,
            h.id AS hotel_id, h.name AS hotel_name, h.slug AS hotel_slug,
            h.city AS hotel_city, h.region AS hotel_region, h.hue AS hotel_hue,
            EXISTS (SELECT 1 FROM hotel_reviews hr WHERE hr.booking_id = b.id) AS has_review
       FROM bookings b
       JOIN rooms  r ON r.id = b.room_id
       JOIN hotels h ON h.id = b.hotel_id
      WHERE b.customer_id = $1
      ORDER BY b.created_at DESC`,
    [req.user.id]
  );
  res.json({ bookings: rows });
});

// ---------- GET /bookings/:id ----------
const detail = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await pool.query(
    `SELECT b.*, r.type AS room_type, r.view AS room_view, h.name AS hotel_name, h.slug AS hotel_slug
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       JOIN hotels h ON h.id = b.hotel_id
      WHERE b.id = $1`, [id]
  );
  const booking = rows[0];
  if (!booking) throw notFound('Booking not found');

  const owns = (req.user.role === 'customer' && booking.customer_id === req.user.id);
  if (!owns && req.user.role === 'host') {
    const { rows: ownerRows } = await pool.query('SELECT host_id FROM hotels WHERE id = $1', [booking.hotel_id]);
    if (ownerRows[0]?.host_id !== req.user.id) throw forbidden();
  } else if (!owns && req.user.role !== 'host') {
    throw forbidden();
  }
  res.json({ booking });
});

// ---------- PUT /bookings/:id/cancel ----------
const cancel = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await pool.query(
    `UPDATE bookings SET status = 'cancelled'
      WHERE id = $1 AND customer_id = $2 AND status IN ('pending', 'confirmed')
      RETURNING *`,
    [id, req.user.id]
  );
  if (!rows[0]) throw notFound('Booking not found or not cancellable');
  res.json({ booking: rows[0] });
});

module.exports = { create, myBookings, detail, cancel };
