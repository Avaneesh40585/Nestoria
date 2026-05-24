const pool = require('../../config/db');
const { asyncHandler } = require('../../lib/http');

// ---------- GET /host/properties ----------
const properties = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`
    SELECT h.*,
           (SELECT COUNT(*) FROM rooms r WHERE r.hotel_id = h.id) AS rooms_count,
           (SELECT COALESCE(SUM(total_amount), 0) FROM bookings b
              WHERE b.hotel_id = h.id AND b.status IN ('confirmed','completed')
                AND b.created_at >= date_trunc('month', now())) AS revenue_mtd,
           (SELECT COUNT(*) FROM bookings b
              WHERE b.hotel_id = h.id AND b.status IN ('confirmed','completed')
                AND b.checkin_date <= CURRENT_DATE AND b.checkout_date >= CURRENT_DATE
           ) * 100.0 /
           NULLIF((SELECT COUNT(*) FROM rooms r WHERE r.hotel_id = h.id), 0) AS occupancy
      FROM hotels h
     WHERE h.host_id = $1
     ORDER BY h.created_at DESC`, [req.user.id]);
  res.json({ properties: rows.map((r) => ({ ...r, rooms_count: Number(r.rooms_count), occupancy: Math.round(Number(r.occupancy || 0)) })) });
});

// ---------- GET /host/stats ----------
const stats = asyncHandler(async (req, res) => {
  const hostId = req.user.id;
  const { rows } = await pool.query(`
    WITH this_month AS (
      SELECT COALESCE(SUM(b.total_amount), 0) AS revenue,
             COUNT(*) AS bookings,
             COALESCE(AVG(hr.rating), 0) AS rating
        FROM bookings b
        JOIN hotels h ON h.id = b.hotel_id
        LEFT JOIN hotel_reviews hr ON hr.booking_id = b.id
       WHERE h.host_id = $1
         AND b.status IN ('confirmed','completed')
         AND b.created_at >= date_trunc('month', now())
    ),
    last_month AS (
      SELECT COALESCE(SUM(b.total_amount), 0) AS revenue,
             COUNT(*) AS bookings,
             COALESCE(AVG(hr.rating), 0) AS rating
        FROM bookings b
        JOIN hotels h ON h.id = b.hotel_id
        LEFT JOIN hotel_reviews hr ON hr.booking_id = b.id
       WHERE h.host_id = $1
         AND b.status IN ('confirmed','completed')
         AND b.created_at >= date_trunc('month', now()) - interval '1 month'
         AND b.created_at <  date_trunc('month', now())
    ),
    occupancy AS (
      SELECT
        (SELECT COUNT(*) FROM bookings b JOIN hotels h ON h.id = b.hotel_id
          WHERE h.host_id = $1 AND b.status IN ('confirmed','completed')
            AND b.checkin_date <= CURRENT_DATE AND b.checkout_date >= CURRENT_DATE) AS occupied,
        (SELECT COUNT(*) FROM rooms r JOIN hotels h ON h.id = r.hotel_id WHERE h.host_id = $1) AS total
    )
    SELECT
      tm.revenue        AS revenue,
      tm.bookings       AS bookings,
      tm.rating         AS rating,
      lm.revenue        AS revenue_last,
      lm.bookings       AS bookings_last,
      lm.rating         AS rating_last,
      o.occupied, o.total
      FROM this_month tm, last_month lm, occupancy o
  `, [hostId]);
  const r = rows[0];
  const pct = (curr, prev) => (prev > 0 ? +(((curr - prev) / prev) * 100).toFixed(1) : 0);
  const occupancy = r.total > 0 ? Math.round((r.occupied / r.total) * 100) : 0;
  res.json({
    revenue:   Number(r.revenue),
    revenue_delta: pct(Number(r.revenue), Number(r.revenue_last)),
    bookings:  Number(r.bookings),
    bookings_delta: pct(Number(r.bookings), Number(r.bookings_last)),
    rating:    +Number(r.rating).toFixed(2),
    rating_delta: +(Number(r.rating) - Number(r.rating_last)).toFixed(2),
    occupancy,
    occupancy_delta: 0, // baseline; needs historical snapshot to compute properly
  });
});

// ---------- GET /host/bookings?status=&from=&to= ----------
const bookings = asyncHandler(async (req, res) => {
  const params = [req.user.id];
  const where = ['h.host_id = $1'];
  if (req.query.status) { params.push(req.query.status); where.push(`b.status = $${params.length}`); }
  if (req.query.from)   { params.push(req.query.from);   where.push(`b.checkin_date >= $${params.length}`); }
  if (req.query.to)     { params.push(req.query.to);     where.push(`b.checkout_date <= $${params.length}`); }
  const { rows } = await pool.query(`
    SELECT b.id, b.checkin_date, b.checkout_date, b.guests, b.total_amount, b.status, b.created_at,
           c.full_name AS guest_name, c.email AS guest_email,
           r.type AS room_type, h.name AS hotel_name, h.slug AS hotel_slug
      FROM bookings b
      JOIN hotels h    ON h.id = b.hotel_id
      JOIN rooms r     ON r.id = b.room_id
      JOIN customers c ON c.id = b.customer_id
     WHERE ${where.join(' AND ')}
     ORDER BY b.checkin_date DESC
     LIMIT 200
  `, params);
  res.json({ bookings: rows });
});

// ---------- GET /host/earnings ----------
const earnings = asyncHandler(async (req, res) => {
  const { rows: months } = await pool.query(`
    SELECT to_char(date_trunc('month', b.created_at), 'YYYY-MM') AS month,
           SUM(b.total_amount)::numeric AS revenue
      FROM bookings b JOIN hotels h ON h.id = b.hotel_id
     WHERE h.host_id = $1 AND b.status IN ('confirmed','completed')
       AND b.created_at >= date_trunc('year', now())
     GROUP BY 1 ORDER BY 1
  `, [req.user.id]);

  const { rows: transactions } = await pool.query(`
    SELECT b.id, b.created_at, b.total_amount, b.status,
           c.full_name AS guest_name, h.name AS hotel_name
      FROM bookings b
      JOIN hotels h    ON h.id = b.hotel_id
      JOIN customers c ON c.id = b.customer_id
     WHERE h.host_id = $1 AND b.status IN ('confirmed','completed')
     ORDER BY b.created_at DESC LIMIT 30
  `, [req.user.id]);

  res.json({
    monthly: months.map((m) => ({ ...m, revenue: Number(m.revenue) })),
    transactions: transactions.map((t) => ({ ...t, total_amount: Number(t.total_amount) })),
  });
});

module.exports = { properties, stats, bookings, earnings };
