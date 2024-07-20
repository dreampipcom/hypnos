// @api/v1/user/index.ts
import type { NextApiRequest } from 'next';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSession } from '@auth';
import { UpdatePrivateUserFavoriteListings } from '@controller';
type CombineRequest = NextRequest & NextApiRequest;

const generateErrorResponse = (e: any, status: number) => {
  return {
    ok: false,
    status,
    message: e.message,
  };
};

// export const dynamic = 'force-static';
export async function PATCH(request: CombineRequest) {
  try {
    const body = await request?.json();
    console.log({ body });
    const listing = body?.listing;

    const user = (await getSession())?.user;

    console.log({ user });

    const data = await UpdatePrivateUserFavoriteListings({
      user,
      listings: [listing],
    });

    console.log({ data });

    return NextResponse.json({
      ok: true,
      status: 200,
      data,
    });
  } catch (e) {
    return NextResponse.json(generateErrorResponse(e, 403), { status: 403 });
  }
}
