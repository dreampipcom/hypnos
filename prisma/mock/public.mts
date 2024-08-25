// public.ts
import type { ITenant } from './types';
import { faker } from '@faker-js/faker';

import { HOMock } from './helpers.mts';

const mockLocation = () => ({
  name: faker.company.name(),
  geo: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
    radius: 0.98,
  },
  address: {
    city: 'Lorem',
    province: 'Ipsum',
    country: 'Sit',
    zipCode: '000000',
  },
});

export const createMockPubListing = ({
  user,
  community,
  offers,
  audiences,
  model,
  taxonomies,
  ads,
  listingTaxonomies,
  reviews,
}: any): any => {
  const data = {
    userOwner: user,
    userCreator: user,
    communityCreator: community,
    communityOwner: community,
    images: [
      faker.image.urlLoremFlickr({ category: 'crypto' }),
      faker.image.urlLoremFlickr({ category: 'crypto' }),
      faker.image.urlLoremFlickr({ category: 'crypto' }),
    ],
    title: {
      en: faker.airline.airplane().name,
      it: faker.airline.airplane().name,
      pt: faker.airline.airplane().name,
      es: faker.airline.airplane().name,
      de: faker.airline.airplane().name,
      fr: faker.airline.airplane().name,
      ro: faker.airline.airplane().name,
      cz: faker.airline.airplane().name,
      pl: faker.airline.airplane().name,
      et: faker.airline.airplane().name,
      sv: faker.airline.airplane().name,
      ja: faker.airline.airplane().name,
      ru: faker.airline.airplane().name,
      ar: faker.airline.airplane().name,
      he: faker.airline.airplane().name,
      zh: faker.airline.airplane().name,
      nl: faker.airline.airplane().name,
      da: faker.airline.airplane().name,
      hu: faker.airline.airplane().name,
      ca: faker.airline.airplane().name,
      eu: faker.airline.airplane().name,
      gl: faker.airline.airplane().name,
      sw: faker.airline.airplane().name,
      hi: faker.airline.airplane().name,
      ms: faker.airline.airplane().name,
      bn: faker.airline.airplane().name,
      pa: faker.airline.airplane().name,
      tr: faker.airline.airplane().name,
      fi: faker.airline.airplane().name,
      el: faker.airline.airplane().name,
      uk: faker.airline.airplane().name,
    },
    description: {
      en: faker.finance.transactionDescription(),
      it: faker.finance.transactionDescription(),
      pt: faker.finance.transactionDescription(),
      es: faker.finance.transactionDescription(),
      de: faker.finance.transactionDescription(),
      fr: faker.finance.transactionDescription(),
      ro: faker.finance.transactionDescription(),
      cz: faker.finance.transactionDescription(),
      pl: faker.finance.transactionDescription(),
      et: faker.finance.transactionDescription(),
      sv: faker.finance.transactionDescription(),
      ja: faker.finance.transactionDescription(),
      ru: faker.finance.transactionDescription(),
      ar: faker.finance.transactionDescription(),
      he: faker.finance.transactionDescription(),
      zh: faker.finance.transactionDescription(),
      nl: faker.finance.transactionDescription(),
      da: faker.finance.transactionDescription(),
      hu: faker.finance.transactionDescription(),
      ca: faker.finance.transactionDescription(),
      eu: faker.finance.transactionDescription(),
      gl: faker.finance.transactionDescription(),
      sw: faker.finance.transactionDescription(),
      hi: faker.finance.transactionDescription(),
      ms: faker.finance.transactionDescription(),
      bn: faker.finance.transactionDescription(),
      pa: faker.finance.transactionDescription(),
      tr: faker.finance.transactionDescription(),
      fi: faker.finance.transactionDescription(),
      el: faker.finance.transactionDescription(),
      uk: faker.finance.transactionDescription(),
    },
    scheduledFor: faker.date.future(),
    value: faker.number.float(3500),
    status: 'ACTIVE',
    location: mockLocation(),
    taxonomies,
  };

  return data;
};

export const mockPubListing = createMockPubListing({});
export const mockPubListing2 = createMockPubListing({});
