// @controller/get-private-services.ts
import { PrivatePrisma } from '@model';
import { whoAmI, canI } from '@controller';

const PAGE_SIZE = 100;

const getPrivateServices = async ({ id, user, target, page = 0, offset = 0, limit = PAGE_SIZE, filters = [] }: any) => {
  const loggedUser = user || (await whoAmI({}));

  const adaptQuery: any = {
    where: {
      id,
      slug: target,
    },
    skip: page * (limit + offset),
    take: limit,
    cacheStrategy: { ttl: 90, swr: 60 * 60 * 24 * 1 },
  };

  if (await canI({ type: 'R', action: 'view-listings', target, user: loggedUser })) {
    if (filters?.length) {
      // to-do: add common services filter queries later, e.g. ACTIVE services, Updatable Services, etc.
      try {
        const supportedQueries: Record<string, any> = {
          user: {
            query: {
              OR: [{ id: { in: loggedUser?.servicesIds } }, { slug: name }, { userOwner: loggedUser?.id }],
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

    const response = await PrivatePrisma.services.findMany(adaptQuery);
    return response;
  } else {
    throw new Error(`403: Not authorized.`);
  }
};

export default getPrivateServices;
