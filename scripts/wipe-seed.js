#!/usr/bin/env node
// Remove the demo seed (hotels, hosts, customers, bookings) plus the matching
// Supabase Storage objects. Leaves the `amenities` catalog and anything you
// created through the running app untouched.
//
// Usage:
//   node scripts/wipe-seed.js --dry-run     # show what would be removed, change nothing
//   node scripts/wipe-seed.js --yes         # actually remove
//
// Reads DB_* and SUPABASE_* from backend/.env. Point those at production env
// before running against a deployed database.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const SEED_HOTEL_SLUGS = [
  'marigold-house',
  'aravali-retreat',
  'casa-pamparo',
  'postcard-munnar',
  'the-salt-house',
  'silk-route-inn',
  'house-of-cardamom',
  'indigo-lodge',
];

const SEED_HOST_EMAILS = [
  'vikram@marigold.in',
  'priya@casapamparo.in',
  'arjun@cardamom.in',
];

const SEED_CUSTOMER_EMAIL_PATTERN = 'customer%@nestoria.dev';

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const CONFIRMED = args.has('--yes');

if (!DRY_RUN && !CONFIRMED) {
  console.error('Refusing to run without --dry-run or --yes.');
  console.error('  node scripts/wipe-seed.js --dry-run');
  console.error('  node scripts/wipe-seed.js --yes');
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET_NAME || 'hotel-images';
const supabase = SUPABASE_URL && SERVICE_KEY
  ? createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })
  : null;

async function countSeedRows() {
  const [bookings, hotels, customers, hosts] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int AS n FROM bookings
         WHERE customer_id IN (SELECT id FROM customers WHERE email LIKE $1)
            OR hotel_id IN (SELECT id FROM hotels WHERE slug = ANY($2))`,
      [SEED_CUSTOMER_EMAIL_PATTERN, SEED_HOTEL_SLUGS],
    ),
    pool.query(`SELECT COUNT(*)::int AS n FROM hotels WHERE slug = ANY($1)`, [SEED_HOTEL_SLUGS]),
    pool.query(`SELECT COUNT(*)::int AS n FROM customers WHERE email LIKE $1`, [SEED_CUSTOMER_EMAIL_PATTERN]),
    pool.query(`SELECT COUNT(*)::int AS n FROM hosts WHERE email = ANY($1)`, [SEED_HOST_EMAILS]),
  ]);
  return {
    bookings: bookings.rows[0].n,
    hotels: hotels.rows[0].n,
    customers: customers.rows[0].n,
    hosts: hosts.rows[0].n,
  };
}

async function listStorageObjects() {
  if (!supabase) return [];
  const paths = [];
  for (const slug of SEED_HOTEL_SLUGS) {
    for (const prefix of [`hotels/${slug}`, `rooms/${slug}`]) {
      const { data, error } = await supabase.storage.from(BUCKET).list(prefix);
      if (error) {
        console.warn(`  warn: could not list ${prefix}: ${error.message}`);
        continue;
      }
      for (const obj of data || []) paths.push(`${prefix}/${obj.name}`);
    }
  }
  return paths;
}

async function wipeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const bookings = await client.query(
      `DELETE FROM bookings
         WHERE customer_id IN (SELECT id FROM customers WHERE email LIKE $1)
            OR hotel_id IN (SELECT id FROM hotels WHERE slug = ANY($2))`,
      [SEED_CUSTOMER_EMAIL_PATTERN, SEED_HOTEL_SLUGS],
    );
    const hotels = await client.query(
      `DELETE FROM hotels WHERE slug = ANY($1)`,
      [SEED_HOTEL_SLUGS],
    );
    const customers = await client.query(
      `DELETE FROM customers WHERE email LIKE $1`,
      [SEED_CUSTOMER_EMAIL_PATTERN],
    );
    const hosts = await client.query(
      `DELETE FROM hosts WHERE email = ANY($1)`,
      [SEED_HOST_EMAILS],
    );
    await client.query('COMMIT');
    return {
      bookings: bookings.rowCount,
      hotels: hotels.rowCount,
      customers: customers.rowCount,
      hosts: hosts.rowCount,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function wipeStorage(paths) {
  if (!supabase || paths.length === 0) return 0;
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) throw error;
  return paths.length;
}

(async () => {
  console.log(`Target database: ${process.env.DB_NAME || '(unset)'} @ ${process.env.DB_HOST || '(unset)'}`);
  console.log(`Target Supabase: ${SUPABASE_URL || '(not configured — storage step will be skipped)'}`);
  console.log('');

  const counts = await countSeedRows();
  const storagePaths = await listStorageObjects();

  console.log('Will remove:');
  console.log(`  bookings:  ${counts.bookings}`);
  console.log(`  hotels:    ${counts.hotels} (of ${SEED_HOTEL_SLUGS.length} known seed slugs)`);
  console.log(`  customers: ${counts.customers}`);
  console.log(`  hosts:     ${counts.hosts}`);
  console.log(`  storage:   ${storagePaths.length} object(s) under ${SEED_HOTEL_SLUGS.length * 2} prefixes`);
  console.log('');

  if (DRY_RUN) {
    console.log('Dry run — no changes made.');
    await pool.end();
    return;
  }

  console.log('Executing…');
  const removed = await wipeDatabase();
  const storageRemoved = await wipeStorage(storagePaths);

  console.log('');
  console.log(`Removed ${removed.bookings} bookings, ${removed.hotels} hotels, ${removed.customers} customers, ${removed.hosts} hosts, ${storageRemoved} storage objects.`);
  await pool.end();
})().catch(async (err) => {
  console.error('\nFAILED:', err.message || err);
  try { await pool.end(); } catch (_) {}
  process.exit(1);
});
