const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

// Only initialize Supabase if valid credentials are provided
// Using service role key for backend operations to bypass RLS policies
if (supabaseUrl && supabaseServiceKey && 
    supabaseUrl !== 'your_supabase_url_here' && 
    supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase client initialized successfully with service role');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error.message);
  }
} else {
  console.warn('⚠️  Supabase credentials not configured. Image upload features will not work.');
  console.warn('   Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
}

module.exports = supabase;
