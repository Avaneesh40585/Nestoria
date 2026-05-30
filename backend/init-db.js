// Auto-init the Postgres database on backend boot.
//
// Idempotent: if the `hotels` table already exists we exit immediately, so this
// is safe to run on every deploy. Only the very first boot against a fresh
// Render database (or any empty Postgres) loads the schema + seed.
//
// Wired into `npm start` so Render's startCommand picks it up with no extra
// config. Locally you can either run it manually (`node init-db.js`) or keep
// using the `psql -f database/*.sql` flow documented in docs/SETUP.md.

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');

const SQL_ORDER = [
  '001_schema.sql',
  '002_triggers.sql',
  '006_saved_hotels.sql',
  '007_hotel_coords.sql',
  '008_room_extras.sql',
  '004_seed.sql',        // 8 demo hotels, 3 hosts, 50 customers, 80 bookings
  '005_seed_images.sql', // swaps in the real Unsplash photos in Supabase
];

const DATABASE_DIR = path.join(__dirname, '..', 'database');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function tableExists(name) {
  const { rows } = await pool.query(
    `SELECT 1 FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = $1`,
    [name],
  );
  return rows.length > 0;
}

async function runSqlFile(filename) {
  const full = path.join(DATABASE_DIR, filename);
  if (!fs.existsSync(full)) {
    console.log(`  skip ${filename} (file missing)`);
    return;
  }
  const sql = fs.readFileSync(full, 'utf8');
  await pool.query(sql);
  console.log(`  ✓ ${filename}`);
}

(async () => {
  if (!process.env.DB_HOST) {
    console.log('init-db: DB_HOST unset — skipping (set DB env vars to enable).');
    await pool.end();
    return;
  }
  console.log(`init-db: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
  if (await tableExists('hotels')) {
    console.log('init-db: schema present, nothing to do.');
    await pool.end();
    return;
  }
  console.log('init-db: empty database — loading schema + seed…');
  for (const file of SQL_ORDER) {
    await runSqlFile(file);
  }
  console.log('init-db: done.');
  await pool.end();
})().catch(async (err) => {
  console.error('init-db FAILED:', err.message || err);
  try { await pool.end(); } catch (_) {}
  process.exit(1);
});
