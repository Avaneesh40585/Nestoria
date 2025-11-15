const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

// Only initialize Supabase if valid credentials are provided
if (supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'your_supabase_url_here' && 
    supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error.message);
  }
} else {
  console.warn('⚠️  Supabase credentials not configured. Image upload features will not work.');
  console.warn('   Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
}

module.exports = supabase;
