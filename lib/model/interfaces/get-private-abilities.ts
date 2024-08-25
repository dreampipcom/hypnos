// @controller/get-private-services.ts
import { whoAmI } from '@controller';
import { PrivatePrisma } from '@model';

const PAGE_SIZE = 100;

const getPrivateAbilities = async ({
  id,
  name,
  locale = 'es',
  user,
  type,
  target,
  action,
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
          type,
          target,
          action,
        },
      ],
    },
    skip: page * (limit + offset),
    take: limit,
    cacheStrategy: process.env.NEXUS_STANDALONE !== 'true' ? { ttl: 90, swr: 60 * 10 } : undefined,
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

      adaptQuery.where = {
        ...adaptQuery.where,
        ...query,
      };
    } catch (e) {
      throw new Error('Code 001: Wrong filter');
    }
  }

  const response = await PrivatePrisma.abilities.findMany(adaptQuery);

  return response;
};

export default getPrivateAbilities;
