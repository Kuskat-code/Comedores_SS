import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityHeaders } from './src/middleware/securityHeaders';
import { rateLimit } from './src/middleware/rateLimit';

/**
 * Global Edge Middleware applied to all API routes.
 * Executes rate limiting first, then security headers.
 */
export async function middleware(request: NextRequest) {
  // Rate limiting – returns a Response on limit breach
  const rateResult = rateLimit(request);
  if (rateResult) return rateResult;

  // Security headers – always added to the response
  const response = NextResponse.next();
  const secured = securityHeaders(request);
  // Merge headers from securityHeaders response into the main response
  secured.headers.forEach((value, key) => response.headers.set(key, value));
  return response;
}

export const config = {
  matcher: '/api/:path*', // apply only to API routes
};
