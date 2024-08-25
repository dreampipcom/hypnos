// @controller/get-private-services.ts
import { PrivatePrisma } from '@model';
import { whoAmI, canI } from '@controller';

const PAGE_SIZE = 100;

const getPrivateServices = async ({
  id,
  user,
  locale = 'en',
  target,
  page = 0,
  offset = 0,
  limit = PAGE_SIZE,
  filters = [],
}: any) => {
  const loggedUser = user || (await whoAmI({}));

  const adaptQuery: any = {
    where: {
      OR: [
        {
          id,
        },
        {
          slug: target,
        },
      ],
    },
    skip: page * (limit + offset),
    take: limit,
    cacheStrategy: process.env.NEXUS_STANDALONE !== 'true' ? { ttl: 90, swr: 60 * 60 * 24 * 1 } : undefined,
  };

  if (filters?.length) {
    try {
      const supportedQueries: Record<string, any> = {
        user: {
          query: {
            OR: [{ id: { in: loggedUser?.servicesIds }, name: { [locale]: name } }, { userOwner: loggedUser?.id }],
          },
        },
        // group: {
        //   query: {
        //     OR: [
        //       { id, name, groupOwner: session?.user?.id },
        //     ],
        //   },
        // },
      };

      const query: any = filters?.reduce((acc: any, filter: string) => {
        if (!acc.OR) acc.OR = [];
        acc.OR.push(supportedQueries[filter].query);
        return acc;
      }, {});

      adaptQuery.where.OR = query?.OR;

      const response = await PrivatePrisma.services.findMany(adaptQuery);
      return response;
    } catch (e) {
      throw new Error('Code 000/2: Wrong filter');
    }
  }

  if (!(adaptQuery?.where?.OR?.length > 0)) {
    throw new Error('Code 000/1: Malformed request');
  }

  if (await canI({ type: 'R', action: 'view-listings', target, user: loggedUser })) {
    const response = await PrivatePrisma.services.findMany(adaptQuery);
    return response;
  } else {
    throw new Error(`Code 001/0: Not authorized.`);
  }
};

export default getPrivateServices;
