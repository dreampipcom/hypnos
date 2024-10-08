// @controller/get-private-common-services.ts
import { PrivatePrisma } from '@model';

const PAGE_SIZE = 100;

const getPrivateCommonAbilities = async ({ page = 0, offset = 0, limit = PAGE_SIZE, filters = [] }: any) => {
  // to-do: move, this will be a middleware
  const adaptQuery: any = {
    where: {
      OR: [
        {
          nature: 'COMMON',
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
        // user: {
        //   query: {
        //     OR: [{ id: { in: loggedUser?.servicesIds }, name: { [locale]: name } }, { userOwner: loggedUser?.id }],
        //   },
        // },
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
    } catch (e) {
      throw new Error('Code 000/2: Wrong filter');
    }
  }

  if (!(adaptQuery?.where?.OR?.length > 0)) {
    throw new Error('Code 000/1: Malformed request');
  }

  const response = await PrivatePrisma.abilities.findMany(adaptQuery);

  return response;
};

export default getPrivateCommonAbilities;
