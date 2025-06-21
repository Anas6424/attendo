// Supabase client initialized with environment variables

import { createClient } from '@supabase/supabase-js'

// Load credentials from .env file (not committed)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default supabase