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
  const isHealthCheck = request?.headers?.get('x-dp-keepalive') === process.env.NEXUS_KEEPALIVE;
  if (isHealthCheck) {
    return NextResponse.json(
      {
        ok: true,
        status: 200,
      },
      {
        status: 200,
      },
    );
  }
}

export async function PATCH(request: CombineRequest) {
  try {
    const cookies = request?.headers.get('cookies');
    const session = await GetSession({ cookies: cookies || '' });
    const url = new URL(request.url);
    const query = url.searchParams;
    const type = query.get('type') || 'id';
    const body = await request?.json();
    const listings = body?.listings;

    const user = session?.user;
    console.log({ session, body, cookies });

    const data = await UpdatePrivateUserFavoriteListings({
      user,
      listings,
      type,
    });

    console.log({ headers: request.headers });

    // [DPCP-116]: https://www.notion.so/angeloreale/Hypnos-Add-transactional-websockets-de3667b32a4c4cd4ade76080203e68fd?pvs=4
    // might have idempotency issues.
    // need ui to signal request was received,
    // but subsequent webhook to confirm it was processed correctly
    // const headers = {
    //   'content-type': 'application/json',
    //   'Cache-Control': 'maxage=0, s-maxage=60, stale-while-revalidate=86400'
    // }

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
