const pool = require('../../config/db');
const { asyncHandler, badRequest, notFound, forbidden, conflict } = require('../../lib/http');

// Naive sentiment: word-list scoring → 0-100. Replace with a real model later.
const POSITIVE = ['great','amazing','wonderful','beautiful','perfect','excellent','love','fantastic','quiet','warm','memorable','restored','considered'];
const NEGATIVE = ['bad','terrible','awful','dirty','noisy','rude','poor','disappointing','small','cramped','cold'];
function sentimentScore(text) {
  if (!text) return null;
  const tokens = text.toLowerCase().split(/\W+/);
  let s = 50;
  tokens.forEach((t) => {
    if (POSITIVE.includes(t)) s += 4;
    if (NEGATIVE.includes(t)) s -= 6;
  });
  return Math.max(0, Math.min(100, s));
}

// ---------- POST /reviews ----------
// body: { booking_id, hotel_rating?, hotel_comment?, room_rating?, room_comment? }
const create = asyncHandler(async (req, res) => {
  const { booking_id, hotel_rating, hotel_comment, room_rating, room_comment } = req.body;
  if (!booking_id) throw badRequest('booking_id is required');
  if (!hotel_rating && !room_rating) throw badRequest('at least one of hotel_rating or room_rating is required');

  const { rows: bookingRows } = await pool.query(
    `SELECT id, customer_id, hotel_id, room_id, status FROM bookings WHERE id = $1`, [booking_id]
  );
  const booking = bookingRows[0];
  if (!booking) throw notFound('Booking not found');
  if (booking.customer_id !== req.user.id) throw forbidden();
  if (booking.status !== 'completed') throw badRequest('Reviews are allowed on completed stays only');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = {};
    if (hotel_rating) {
      const { rows } = await client.query(
        `INSERT INTO hotel_reviews (customer_id, hotel_id, booking_id, rating, comment, sentiment_score)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [req.user.id, booking.hotel_id, booking.id, hotel_rating, hotel_comment || null, sentimentScore(hotel_comment)]
      );
      result.hotel_review = rows[0];
    }
    if (room_rating) {
      const { rows } = await client.query(
        `INSERT INTO room_reviews (customer_id, room_id, booking_id, rating, comment, sentiment_score)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [req.user.id, booking.room_id, booking.id, room_rating, room_comment || null, sentimentScore(room_comment)]
      );
      result.room_review = rows[0];
    }
    await client.query('COMMIT');
    res.status(201).json(result);
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') throw conflict('You already reviewed this booking');
    throw err;
  } finally {
    client.release();
  }
});

// ---------- GET /reviews/booking/:id ----------
const byBooking = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const [h, r] = await Promise.all([
    pool.query('SELECT * FROM hotel_reviews WHERE booking_id = $1', [id]),
    pool.query('SELECT * FROM room_reviews  WHERE booking_id = $1', [id]),
  ]);
  res.json({ hotel_review: h.rows[0] || null, room_review: r.rows[0] || null });
});

module.exports = { create, byBooking };
