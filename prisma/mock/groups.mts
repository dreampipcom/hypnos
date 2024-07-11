// communities.ts
import { faker } from '@faker-js/faker';
import { createMockUser } from './user.mts';
import { createMockAudience } from './audiences.mts';
import { createMockListing } from './listings.mts';
import { createMockMessage } from './messages.mts';
import { createMockOrder } from './orders.mts';
import { createMockOffer } from './offers.mts';
import { createMockTerm } from './taxonomies.mts';
import { createMockCatalogueItem } from './catalogue.mts';
import { createMockReview } from './reviews.mts';
import { createMockCampaign } from './campaigns.mts';
import { createMockRole } from './roles.mts';

export const createMockCommunity = (): any => {
  const id = faker.database.mongodbObjectId();

  return {
    id,
    name: 'My Community 1',
    description: 'My community 1 description',
    urls: ['https://mycommunity.com'],
    image: faker.image.avatar(),
    users: {
      create: [createMockUser(), createMockUser()],
    },
    status: 'ACTIVE',
    favorites: {
      create: [],
    },
    preferences: {
      create: [],
    },
    ownedListings: {
      create: [],
    },
    createdListings: {
      create: [],
    },
    ownedTaxonomies: {
      create: [],
    },
    createdTaxonomies: {
      create: [],
    },
    ownedMessages: {
      create: [],
    },
    createdMessages: {
      create: [],
    },
    roles: {
      create: [],
    },
    messagesSent: {
      create: [],
    },
    messagesReceived: {
      create: [],
    },
    userOwner: {
      create: createMockUser(),
    },
    userCreator: {
      create: createMockUser(),
    },
  };
};

export const mockCommunity = createMockCommunity();
export const mockCommunity2 = createMockCommunity();
export const mockCommunity3 = createMockCommunity();
