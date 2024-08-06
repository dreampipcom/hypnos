/* eslint @typescript-eslint/no-unused-vars:0 */
// middleware.ts
import type { NextRequest } from 'next/server';
import { next } from '@vercel/edge';
import { ipAddress } from '@vercel/functions';
// import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
// import { Ratelimit } from '@upstash/ratelimit';

// const ratelimit = new Ratelimit({
//   redis: kv,
//   limiter: Ratelimit.slidingWindow(10, '3 s'),
// });

export const config = {
  matcher: ['/api/:path*'],
};

const headers: Record<string, any> = {
  // 'Access-Control-Allow-Origin': process.env.MAIN_URL || 'https://alpha.dreampip.com',
  'Cache-Control': 'maxage=0, s-maxage=300, stale-while-revalidate=300',
  // DEV-DEBUG:
  // 'content-type': 'application/json',
  'Access-Control-Allow-Origin': 'http://localhost:2999',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': '*',
};

export default async function middleware(request: NextRequest) {
  // You could alternatively limit based on user ID or similar
  const response = next();
  const ip = ipAddress(request) || '127.0.0.1';

  // const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);

  Object.keys(headers).forEach((key: string) => {
    response.headers.set(key, headers[key]);
  });

  // return success ? response : NextResponse.redirect(new URL('https://www.dreampip.com/404', request.url));
  return response ? response : NextResponse.redirect(new URL('https://www.dreampip.com/404', request.url));
}
