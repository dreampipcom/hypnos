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
    // console.log({ request, body: request.body, json: await request.json() })
    const body = await request?.json();
    console.log({ body, headers: request.headers });
    const listings = body?.listings;

    const session = await getSession();
    const user = body?.user || (await getSession())?.user;

    console.log({ session, user });

    const data = await UpdatePrivateUserFavoriteListings({
      user,
      listings,
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
