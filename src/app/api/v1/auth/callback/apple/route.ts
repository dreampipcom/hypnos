// app/api/auth/callback/apple/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { GET as NextAuthGET } from '../../[...nextauth]/route';

export { NextAuthGET as GET };

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const queryParams: { [key: string]: string } = {};
  data.forEach((value, key) => {
    queryParams[key] = value.toString();
  });

  const searchParams = new URLSearchParams(queryParams);

  const response = NextResponse.redirect(
    `https://${req.headers.get('host')}/api/v1/auth/callback/apple?${searchParams.toString()}`,
    {
      status: 302,
    },
  );
  const pkce = req.cookies.get('next-auth.pkce.code_verifier');

  if (pkce?.value) {
    response.cookies.set('next-auth.pkce.code_verifier', pkce.value, {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      secure: true,
    });
    response.headers.set('Cookie', response.cookies.toString());
  }
  // const cookies = req.headers.get('Cookie') || req.cookies.toString() || '';

  // console.log({ cookies, data, queryParams, dest: req.headers.get('host') });

  return response;
}
