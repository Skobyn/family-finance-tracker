import { NextRequest, NextResponse } from 'next/server';

import { rateLimiter } from '@/middleware/rate-limit';

/**
 * This route handles OAuth redirects from Plaid
 * It's used when a user completes the OAuth flow with their bank
 * The URL should match exactly what's configured in your Plaid dashboard
 */
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Firebase auth is client-side, so we can't verify authentication server-side here
    // Instead, we'll redirect to a client route that will handle auth and complete the process

    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const oauth_state_id = searchParams.get('oauth_state_id');

    if (!oauth_state_id) {
      return NextResponse.json({ error: 'Missing oauth_state_id parameter' }, { status: 400 });
    }

    // Redirect to the front-end with the oauth_state_id
    // Your frontend will handle authenticating the user and resuming the Plaid Link flow
    return NextResponse.redirect(
      new URL(`/connect-bank?oauth_state_id=${oauth_state_id}`, request.url)
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process OAuth redirect', details: error.message },
      { status: 500 }
    );
  }
}
