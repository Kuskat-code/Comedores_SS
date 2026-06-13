import { createClient } from '@supabase/supabase-js';

// Public anon client for verifying JWTs on the server side.
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default supabaseAuth;
