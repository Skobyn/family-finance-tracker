/**
 * Rate Limiting Middleware
 *
 * Provides IP-based rate limiting for API routes to prevent abuse and ensure
 * fair resource allocation. Uses an in-memory store for development/testing.
 *
 * For production environments, consider using a distributed cache like Redis
 * to support horizontal scaling across multiple server instances.
 *
 * @module middleware/rate-limit
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Configuration options for rate limiting
 */
export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the time window
   * @default 100
   */
  maxRequests: number;

  /**
   * Time window in milliseconds
   * @default 900000 (15 minutes)
   */
  windowMs: number;

  /**
   * Custom message to return when rate limit is exceeded
   * @default 'Too many requests, please try again later.'
   */
  message?: string;

  /**
   * Status code to return when rate limit is exceeded
   * @default 429
   */
  statusCode?: number;

  /**
   * Whether to skip rate limiting for certain IPs (e.g., localhost)
   * @default true
   */
  skipSuccessfulRequests?: boolean;

  /**
   * Custom key generator function to identify clients
   * @default IP-based identification
   */
  keyGenerator?: (req: NextRequest) => string;
}

/**
 * Represents a single client's request tracking data
 */
interface RequestRecord {
  count: number;
  resetTime: number;
}

/**
 * In-memory store for tracking request counts per client
 * Key: client identifier (IP address by default)
 * Value: request record with count and reset time
 */
const requestStore = new Map<string, RequestRecord>();

/**
 * Default configuration for rate limiting
 */
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests, please try again later.',
  statusCode: 429,
  skipSuccessfulRequests: false,
};

/**
 * Extracts the client's IP address from the request
 * Checks various headers for proxied requests
 *
 * @param req - The incoming request
 * @returns The client's IP address or 'unknown' if unavailable
 */
function getClientIP(req: NextRequest): string {
  // Check for IP in various headers (for proxied requests)
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to connection IP (may not be available in all environments)
  return req.ip || 'unknown';
}

/**
 * Cleans up expired entries from the request store
 * Should be called periodically to prevent memory leaks
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, record] of requestStore.entries()) {
    if (now > record.resetTime) {
      requestStore.delete(key);
    }
  }
}

/**
 * Creates a rate limiting middleware with custom configuration
 *
 * @param config - Configuration options for rate limiting
 * @returns Middleware function for Next.js API routes
 *
 * @example
 * ```typescript
 * // In your API route
 * import { createRateLimiter } from '@/middleware/rate-limit';
 *
 * const limiter = createRateLimiter({
 *   maxRequests: 50,
 *   windowMs: 60 * 1000, // 1 minute
 * });
 *
 * export async function GET(req: NextRequest) {
 *   const rateLimitResult = await limiter(req);
 *   if (rateLimitResult) {
 *     return rateLimitResult; // Rate limit exceeded
 *   }
 *
 *   // Continue with normal request handling
 *   return NextResponse.json({ data: 'success' });
 * }
 * ```
 */
export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return async function rateLimitMiddleware(
    req: NextRequest
  ): Promise<NextResponse | null> {
    // Generate unique key for this client
    const clientKey = finalConfig.keyGenerator
      ? finalConfig.keyGenerator(req)
      : getClientIP(req);

    // Skip rate limiting for localhost in development
    if (
      process.env.NODE_ENV === 'development' &&
      (clientKey === '127.0.0.1' || clientKey === '::1' || clientKey === 'unknown')
    ) {
      return null; // Allow request
    }

    const now = Date.now();
    let record = requestStore.get(clientKey);

    // Initialize new record if doesn't exist or has expired
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + finalConfig.windowMs,
      };
      requestStore.set(clientKey, record);
    }

    // Increment request count
    record.count++;

    // Check if limit exceeded
    if (record.count > finalConfig.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);

      return NextResponse.json(
        {
          error: finalConfig.message,
          retryAfter: retryAfter,
        },
        {
          status: finalConfig.statusCode,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': finalConfig.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
          },
        }
      );
    }

    // Cleanup expired entries periodically (every 100 requests)
    if (record.count % 100 === 0) {
      cleanupExpiredEntries();
    }

    // Allow request - return null to continue
    return null;
  };
}

/**
 * Default rate limiter with standard configuration
 * 100 requests per 15 minutes
 *
 * @example
 * ```typescript
 * import { rateLimiter } from '@/middleware/rate-limit';
 *
 * export async function GET(req: NextRequest) {
 *   const rateLimitResult = await rateLimiter(req);
 *   if (rateLimitResult) return rateLimitResult;
 *
 *   // Your API logic here
 * }
 * ```
 */
export const rateLimiter = createRateLimiter();

/**
 * Strict rate limiter for sensitive endpoints (auth, password reset, etc.)
 * 10 requests per 15 minutes
 *
 * @example
 * ```typescript
 * import { strictRateLimiter } from '@/middleware/rate-limit';
 *
 * export async function POST(req: NextRequest) {
 *   const rateLimitResult = await strictRateLimiter(req);
 *   if (rateLimitResult) return rateLimitResult;
 *
 *   // Handle authentication logic
 * }
 * ```
 */
export const strictRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 15 * 60 * 1000,
  message: 'Too many authentication attempts, please try again later.',
});

/**
 * Lenient rate limiter for read-heavy endpoints
 * 200 requests per 15 minutes
 *
 * @example
 * ```typescript
 * import { lenientRateLimiter } from '@/middleware/rate-limit';
 *
 * export async function GET(req: NextRequest) {
 *   const rateLimitResult = await lenientRateLimiter(req);
 *   if (rateLimitResult) return rateLimitResult;
 *
 *   // Fetch and return data
 * }
 * ```
 */
export const lenientRateLimiter = createRateLimiter({
  maxRequests: 200,
  windowMs: 15 * 60 * 1000,
});

/**
 * Manually resets the rate limit for a specific client
 * Useful for testing or administrative purposes
 *
 * @param clientKey - The client identifier to reset
 */
export function resetRateLimit(clientKey: string): void {
  requestStore.delete(clientKey);
}

/**
 * Gets the current rate limit status for a client
 * Useful for monitoring and debugging
 *
 * @param clientKey - The client identifier to check
 * @returns Current request count and reset time, or null if not found
 */
export function getRateLimitStatus(clientKey: string): RequestRecord | null {
  return requestStore.get(clientKey) || null;
}

/**
 * Clears all rate limit data
 * Useful for testing purposes
 */
export function clearAllRateLimits(): void {
  requestStore.clear();
}
