import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simple in‑memory rate limiter (fixed window).
 * Allows `MAX_REQUESTS` per `WINDOW_MS` per IP address.
 * For production, replace with a Redis‑backed limiter.
 */
const MAX_REQUESTS = 100; // per window
const WINDOW_MS = 60 * 1000; // 1 minute

type RecordMap = Record<string, { count: number; start: number }>;
const ipRecords: RecordMap = {};

export function rateLimit(req: NextRequest) {
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const record = ipRecords[ip] ?? { count: 0, start: now };

  if (now - record.start > WINDOW_MS) {
    // Reset window
    record.count = 1;
    record.start = now;
  } else {
    record.count++;
  }

  ipRecords[ip] = record;

  if (record.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Too many requests – rate limit exceeded' },
      { status: 429 }
    );
  }

  // Continue processing – return null to indicate no early response.
  return null;
}
