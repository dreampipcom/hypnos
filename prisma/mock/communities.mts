// communities.ts
import { faker } from '@faker-js/faker';
import { createMockUser } from './user.mts';
import { createMockListing } from './listings.mts';
import { createMockMessage } from './messages.mts';
import { createMockTerm } from './taxonomies.mts';
import { createMockRole } from './roles.mts';
import { HOMock } from './helpers.mts';

export const createMockCommunity = ({ name, description, urls, image, user, refUsers }): any => {
  const id = faker.database.mongodbObjectId();

  const data = {
    id,
    name: name || 'My Community 1',
    description: description || 'My community 1 description',
    urls: urls || ['https://mycommunity.com'],
    image: image || faker.image.avatar(),
    users: {
      create: !refUsers ? [createMockUser({}), createMockUser({})] : undefined,
      connect: refUsers ? refUsers : undefined,
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
  };

  return HOMock(data, { user });
};

export const mockCommunity = createMockCommunity({});
export const mockCommunity2 = createMockCommunity({});
export const mockCommunity3 = createMockCommunity({});
