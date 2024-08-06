// @api/v1/user/index.ts
import type { NextApiRequest } from 'next';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { GetSession } from '@auth';
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
    const cookies = request?.headers.get('cookies');
    const session = await GetSession({ cookies: cookies || '' });
    const url = new URL(request.url);
    const query = url.searchParams;
    const type = query.get('type') || 'id';
    const body = await request?.json();
    const listings = body?.listings;

    const user = body?.user || session?.user;

    const data = await UpdatePrivateUserFavoriteListings({
      user,
      listings,
      type,
    });

    console.log({ headers: request.headers });

    return NextResponse.json(
      {
        ok: true,
        status: 200,
        data,
      },
      {
        status: 200,
      },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(generateErrorResponse(e, 403), { status: 403 });
  }
}
