const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_BUCKET_NAME || 'hotel-images';

if (!url || !serviceKey) {
  console.warn('Supabase storage disabled — SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.');
}

const supabase = url && serviceKey
  ? createClient(url, serviceKey, { auth: { persistSession: false } })
  : null;

module.exports = { supabase, bucket };
