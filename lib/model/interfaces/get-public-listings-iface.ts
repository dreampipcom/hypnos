// @controller/get-public-listings-iface.ts
import { PublicPrisma } from '@model';

const PAGE_SIZE = 100;

const getPublicListings = async ({ page = 0, offset = 0, limit = PAGE_SIZE, filters = [] }: any) => {
  const adaptQuery: any = {
    where: {
      OR: [
        {
          status: 'ACTIVE',
        },
      ],
    },
    skip: page * (limit + offset),
    take: limit,
    cacheStrategy: process.env.NEXUS_STANDALONE !== 'true' ? { ttl: 90, swr: 60 * 60 * 24 * 7 } : undefined,
  };

  if (filters?.length) {
    try {
      const supportedTaxonomies: Record<string, any> = {
        modalidade1: {
          name: {
            es: 'modalidade1',
          },
          nature: 'modalidades',
          query: {
            OR: [
              { taxonomies: { some: { name: { is: { es: 'Modalidad 1' } } } } },
              { listingTaxonomies: { some: { name: { is: { es: 'Modalidad 1' } } } } },
            ],
          },
        },
        especie1: {
          name: {
            es: 'especie1',
          },
          nature: 'especies',
          query: {
            OR: [
              { taxonomies: { some: { name: { is: { es: 'Taxonomy Term 1' } } } } },
              { listingTaxonomies: { some: { name: { is: { es: 'Taxonomy Term 1' } } } } },
            ],
          },
        },
      };

      const query: any = filters?.reduce((acc: any, filter: string) => {
        if (!acc.OR) acc.OR = [];
        acc.OR.push(supportedTaxonomies[filter].query);
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

  const response = await PublicPrisma.publicListings.findMany(adaptQuery);

  return response;
};

export default getPublicListings;
