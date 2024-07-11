// listings.ts
import type { ITenant } from './types';
import { faker } from '@faker-js/faker';
import { createMockUser } from './user.mts';
import { createMockAudience, mockAudience, mockAudience2 } from './audiences.mts';
import { createMockMessage, mockMessage } from './messages.mts';
import { createMockOffer, mockOffer } from './offers.mts';
import { createMockOrder, mockOrder } from './orders.mts';
import { createMockCommunity, mockCommunity } from './communities.mts';
import { createMockTerm, mockTerm } from './taxonomies.mts';
import { createMockReview, mockReview } from './reviews.mts';
import { createMockCatalogueItem } from './catalogue.mts';

import { HOMock } from './helpers.mts';

const mockLocation = {
  name: 'Home',
  geo: {
    lat: 0.75,
    lng: 1.02,
    radius: 0.98,
  },
  address: {
    street: 'Etc',
    additional: 'Et al',
    number: '0',
    city: 'Lorem',
    province: 'Ipsum',
    country: 'Sit',
    zipCode: '000000',
    phone: '01010101010',
  },
};

export const createMockListing = ({ community, user, communityFavorited, favorited, audiences, model }: any) => {
  const data = {
    title: {
      es: 'INTERNAL aud',
    },
    description: {
      es: 'Lorem ipsum dolor sit amet consectetur',
    },
    remarks: {
      es: 'Lorem ipsum',
    },
    status: 'ACTIVE',
    location: mockLocation,
    favorited: {
      connect: favorited,
    },
    communityFavorited: {
      connect: communityFavorited,
    },
  };

  return HOMock(data, { community, user });
};

export const mockListing = createMockListing({});
export const mockListing2 = createMockListing({});
