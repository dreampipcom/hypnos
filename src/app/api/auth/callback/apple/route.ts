// app/api/auth/callback/apple/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { GET as NextAuthGET } from '../../[...nextauth]/route';

export { NextAuthGET as GET };

export async function POST(req: NextRequest) {
  const response = NextResponse.redirect();
  const pkce = req.cookies.get('next-auth.pkce.code_verifier');

  if (pkce?.value) {
    response.cookies.set('next-auth.pkce.code_verifier', pkce.value, {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      secure: true,
    });
    console.log({ pkce, response, to: req.nextUrl.pathname });
  }

  response.status = 302;

  const data = await req.formData();
  const queryParams: { [key: string]: string } = {};
  data.forEach((value, key) => {
    queryParams[key] = value.toString();
  });

  const searchParams = new URLSearchParams(queryParams);
  // const cookies = req.headers.get('Cookie') || req.cookies.toString() || '';

  // console.log({ cookies, data, queryParams, dest: req.headers.get('host') });

  return NextResponse.redirect(
    `https://${req.headers.get('host')}/api/auth/callback/apple?${searchParams.toString()}`,
    response,
  );
}
