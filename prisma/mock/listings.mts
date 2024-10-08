// listings.ts
import type { ITenant } from './types';
import { faker } from '@faker-js/faker';
import { createMockUser } from './user.mts';
import { createMockMessage, mockMessage } from './messages.mts';
import { createMockCommunity, mockCommunity } from './communities.mts';
import { createMockTerm, mockTerm } from './taxonomies.mts';

import { HOMock } from './helpers.mts';

const mockLocation = () => ({
  name: faker.company.name(),
  geo: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
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
});

export const createMockListing = ({ community, user, communityFavorited, favorited, audiences, model }: any) => {
  const data = {
    title: {
      es: 'INTERNAL aud',
    },
    images: [
      faker.image.urlLoremFlickr({ category: 'crypto' }),
      faker.image.urlLoremFlickr({ category: 'crypto' }),
      faker.image.urlLoremFlickr({ category: 'crypto' }),
    ],
    description: {
      es: 'Lorem ipsum dolor sit amet consectetur',
    },
    status: 'ACTIVE',
    location: mockLocation(),
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
