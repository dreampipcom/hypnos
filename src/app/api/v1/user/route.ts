// @api/v1/user/index.ts
import type { NextApiRequest } from 'next';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { GetSession } from '@auth';
import {
  GetPrivateAbilities,
  GetPrivateServices,
  UpdatePrivateUserFavoriteListings,
  GetPrivateCommonAbilities,
} from '@controller';
type CombineRequest = NextRequest & NextApiRequest;

const generateErrorResponse = (e: any, status: number) => {
  return {
    ok: false,
    status: status || 500,
    message: `${e?.message}`,
  };
};

// export const dynamic = 'force-static';

export async function POST(request: CombineRequest) {
  let error;
  try {
    const healthSecret =
      request?.headers?.get('x-dp-keepalive') ||
      request?.cookies?.toString()?.split('dp-health-check=')[1]?.split(';')[0] ||
      request?.headers?.get('cookies')?.toString()?.split('dp-health-check=')[1]?.split(';')[0] ||
      '';
    const isHealthCheck = healthSecret === process.env.NEXUS_KEEPALIVE;

    if (isHealthCheck) {
      await GetPrivateCommonAbilities({});
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
  } catch (e) {
    error = generateErrorResponse(e, 403);
  }

  try {
    const cookies = request?.cookies?.toString() || request?.headers?.get('cookies');
    const session = await GetSession({ cookies: cookies || '' });
    const user = session?.user;

    const body = await request?.json();
    const action = body?.action;

    if (!!user && !!action) {
      const payload = { data: {} };
      if (action === 'get-own-abilities') {
        payload.data = await GetPrivateAbilities({ filters: ['user'], user });
      } else if (action === 'get-own-services') {
        payload.data = await GetPrivateServices({ filters: ['user'], user });
      } else {
        throw new Error('Code 000/1: No specified action');
      }
      return NextResponse.json(
        {
          ok: true,
          status: 200,
          data: payload.data,
        },
        {
          status: 200,
        },
      );
    }

    error = generateErrorResponse({ message: 'Code 000: Malformed request' }, 400);
  } catch (e) {
    error = generateErrorResponse(e, 500);
  }

  return NextResponse.json(error, error.status);
}

export async function PATCH(request: CombineRequest) {
  try {
    const cookies = request?.cookies?.toString() || request?.headers?.get('cookies');
    const session = await GetSession({ cookies: cookies || '' });
    const url = new URL(request.url);
    const query = url.searchParams;
    const type = query.get('type') || 'id';
    const body = await request?.json();
    const listings = body?.listings;

    const user = session?.user;

    const data = await UpdatePrivateUserFavoriteListings({
      user,
      listings,
      type,
    });

    // [DPCP-116]: https://www.notion.so/angeloreale/Hypnos-Add-transactional-websockets-de3667b32a4c4cd4ade76080203e68fd?pvs=4
    // might have idempotency issues.
    // need optimistic ui to signal request was sent + received,
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
