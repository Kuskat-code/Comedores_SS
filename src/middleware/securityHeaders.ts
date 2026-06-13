import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware that adds common security‑related HTTP headers to every response.
 * Includes CSP, X‑Content‑Type‑Options, Referrer‑Policy, and others.
 * Adjust the header values as needed for your deployment.
 */
export function securityHeaders(req: NextRequest) {
  const res = NextResponse.next();

  // Content Security Policy – only allow resources from self and trusted CDNs.
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "img-src 'self' data: https://*.cloudflare.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');

  return res;
}
