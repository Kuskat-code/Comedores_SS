import supabaseAuth from './supabase-auth';
import type { User } from '@supabase/supabase-js';

/**
 * Checks the Authorization header for a Bearer token and validates it with Supabase.
 * Returns the user ID if valid, otherwise throws an error that the caller should handle.
 */
export async function requireAuth(request: Request): Promise<string> {
  const authHeader = request.headers.get('authorization') || '';
  const tokenMatch = authHeader.match(/^Bearer\s+(.*)$/i);
  if (!tokenMatch) {
    throw new Error('Missing or malformed Authorization header');
  }
  const token = tokenMatch[1];

  const { data, error } = await supabaseAuth.auth.getUser(token);
  if (error || !data?.user) {
    throw new Error('Invalid or expired token');
  }
  return data.user.id;
}
