import { createClient } from '@supabase/supabase-js';

// Lazy getter para el cliente de autenticación (evita fallos en build-time si faltan env vars)
let _supabaseAuth: ReturnType<typeof createClient> | null = null;

function getSupabaseAuth() {
  if (!_supabaseAuth) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY deben estar definidas en las variables de entorno');
    }
    _supabaseAuth = createClient(url, key);
  }
  return _supabaseAuth;
}

// Exportamos una función getter en lugar del cliente directo
export default function supabaseAuth() {
  return getSupabaseAuth();
}
