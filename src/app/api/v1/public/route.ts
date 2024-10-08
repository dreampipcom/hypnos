// @api/v1/public/index.ts
import type { NextApiRequest } from 'next';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { GetPublicListings } from '@controller';
type CombineRequest = NextRequest & NextApiRequest;

const generateErrorResponse = (e: any, status: number) => {
  return {
    ok: false,
    status,
    message: `${e?.message}`,
  };
};

// export const dynamic = 'force-static';

export async function GET(request: CombineRequest) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams;

    const page = query.get('page');
    const limit = query.get('limit');
    const offset = query.get('offset');
    const filters = query.get('filters');

    const filterArray = filters ? (Array.isArray(filters) ? filters : [filters]) : [];

    const coercedPage = Number(page ? (Array.isArray(page) ? page[0] : page) : 0);
    const coercedLimit = Number(limit ? (Array.isArray(limit) ? limit[0] : limit) : 100);
    const coercedOffset = Number(offset ? (Array.isArray(offset) ? offset[0] : offset) : 0);

    const data = await GetPublicListings({
      page: coercedPage,
      limit: coercedLimit,
      offset: coercedOffset,
      filters: filterArray,
    });

    const headers = {
      'content-type': 'application/json',
      'Cache-Control': 'maxage=0, s-maxage=60, stale-while-revalidate=86400',
    };

    return NextResponse.json(
      {
        ok: true,
        status: 200,
        data,
      },
      {
        status: 200,
        headers,
      },
    );
  } catch (e) {
    return NextResponse.json(generateErrorResponse(e, 403), { status: 403 });
  }
}
