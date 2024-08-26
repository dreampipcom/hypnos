// services.mts
import type { ITenant } from './types';
import { faker } from '@faker-js/faker';
import { createMockUser, _mockUser, mockUser } from './user.mts';
import { createMockGroup, mockGroup } from './communities.mts';

import { mockListing, mockListing2 } from './listings.mts';
import { mockOrder } from './orders.mts';
import { mockTerm, mockTerm2 } from './taxonomies.mts';

import { HOMock } from './helpers.mts';

export const createMockService = ({ name, slug, community, user, features, refUsers, refCommunities }: any): any => {
  const data = {
    name,
    slug,
    status: 'ACTIVE',
    type: 'CONSUMER',
    nature: 'COMMON',
    features: {
      connect: features,
    },
    users: {
      connect: refUsers,
    },
    communities: {
      connect: refCommunities,
    },
  };
  return data;
};

export const mockService = createMockService({});
export const mockService2 = createMockService({});
