const pool = require('../config/db');
const { conflict, notFound } = require('./http');

// Allow-listed columns per role. Anything not here is rejected to prevent
// drive-by updates from user-supplied request bodies.
const ROLE_COLUMNS = {
  customer: {
    table: 'customers',
    fields: ['email', 'password_hash', 'google_sub', 'full_name', 'phone', 'dob', 'gender', 'profile_image_url'],
    updatable: ['full_name', 'phone', 'dob', 'gender', 'profile_image_url'],
  },
  host: {
    table: 'hosts',
    fields: ['email', 'password_hash', 'google_sub', 'full_name', 'phone', 'business_name', 'gst_number', 'kyc_verified', 'superhost', 'payout_account', 'profile_image_url'],
    updatable: ['full_name', 'phone', 'business_name', 'gst_number', 'payout_account', 'profile_image_url'],
  },
};

function userRepo(role) {
  const spec = ROLE_COLUMNS[role];
  if (!spec) throw new Error(`Unknown role: ${role}`);
  const { table, fields, updatable } = spec;

  const PUBLIC_COLS = ['id', 'email', 'full_name', 'phone', 'profile_image_url', 'created_at']
    .concat(role === 'host' ? ['business_name', 'gst_number', 'kyc_verified', 'superhost', 'payout_account'] : ['dob', 'gender']);

  async function getById(id) {
    const { rows } = await pool.query(
      `SELECT ${PUBLIC_COLS.join(', ')} FROM ${table} WHERE id = $1`, [id]
    );
    return rows[0] || null;
  }

  async function getByEmail(email) {
    const { rows } = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);
    return rows[0] || null;
  }

  async function getByGoogleSub(sub) {
    const { rows } = await pool.query(`SELECT * FROM ${table} WHERE google_sub = $1`, [sub]);
    return rows[0] || null;
  }

  async function create(data) {
    const cols = fields.filter((f) => data[f] !== undefined);
    const vals = cols.map((f) => data[f]);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
    try {
      const { rows } = await pool.query(
        `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})
         RETURNING ${PUBLIC_COLS.join(', ')}`,
        vals
      );
      return rows[0];
    } catch (err) {
      if (err.code === '23505') throw conflict('An account with that email or phone already exists', 'duplicate');
      throw err;
    }
  }

  async function update(id, data) {
    const cols = updatable.filter((f) => data[f] !== undefined);
    if (cols.length === 0) return getById(id);
    const set = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
    const vals = cols.map((c) => data[c]);
    vals.push(id);
    const { rows } = await pool.query(
      `UPDATE ${table} SET ${set} WHERE id = $${vals.length}
       RETURNING ${PUBLIC_COLS.join(', ')}`,
      vals
    );
    if (!rows[0]) throw notFound(`${role} not found`);
    return rows[0];
  }

  async function setPassword(id, passwordHash) {
    await pool.query(`UPDATE ${table} SET password_hash = $1 WHERE id = $2`, [passwordHash, id]);
  }

  async function linkGoogle(id, googleSub) {
    await pool.query(`UPDATE ${table} SET google_sub = $1 WHERE id = $2`, [googleSub, id]);
  }

  return { table, getById, getByEmail, getByGoogleSub, create, update, setPassword, linkGoogle };
}

module.exports = { userRepo };
