// [...nextauth].ts// auth.ts TS-Doc?
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { finalAuth } from '@auth/adapter';

type CombineRequest = NextRequest & NextApiRequest;
type CombineResponse = NextResponse & NextApiResponse;

export const runtime = 'edge';

const auth = async (req: CombineRequest, ctx: CombineResponse) => {
  req.headers.set('x-forwarded-host', process.env.NEXTAUTH_URL || '');
  return await NextAuth(req, ctx, finalAuth);
};

export { auth as GET, auth as POST };
