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
export async function POST(request: CombineRequest) {
  try {
    const cookies = request?.headers.get('cookies');
    const session = await GetSession({ cookies });
    const body = await request?.json();
    const listings = body?.listings;

    const user = body?.user || session?.user;

    const data = await UpdatePrivateUserFavoriteListings({
      user,
      listings,
    });

    return NextResponse.json({
      ok: true,
      status: 200,
      data,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(generateErrorResponse(e, 403), { status: 403 });
  }
}
