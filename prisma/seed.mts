// seed.ts
// @ts-nocheck
import fs from 'node:fs';
import execSync from 'node:child_process';
import { faker } from '@faker-js/faker';
import { PrismaClient as PrivatePrisma } from '@huntydev/db-private/prisma-client';
import { PrismaClient as PublicPrisma } from '@huntydev/db-public/prisma-client';

import { mockUser, mockUser2, mockUser3 } from './mock/user.mts';
import { mockCommunity, mockCommunity2, mockCommunity3 } from './mock/communities.mts';
import { createMockListing } from './mock/listings.mts';
import { createMockAudience } from './mock/audiences.mts';
import { createMockTerm } from './mock/taxonomies.mts';
import { createMockMessage } from './mock/messages.mts';
import { createMockRole } from './mock/roles.mts';
import { createMockPubListing } from './mock/public.mts';

export const cleanupDatabase = () => {
  const propertyNames = Object.getOwnPropertyNames(pvtPrisma);
  const modelNames = propertyNames.filter((propertyName) => !propertyName.startsWith('_'));

  return Promise.all(modelNames.map((model) => pvtPrisma[model].deleteMany()));
};

const seedType = process.argv[2];

if (seedType === 'private') {
  console.log('~ SEEDING PRIVATE DB ~');

  const pvtPrisma = new PrivatePrisma({
    datasourceUrl: process.env.MONGODB_PRIVATE_URI,
  });

  const main = async () => {
    try {
      // await pvtPrisma.products.deleteMany();

      // // cleanup the existing database
      const allProperties = Reflect.ownKeys(Object.getPrototypeOf(pvtPrisma));
      const modelNames = allProperties.filter(
        (x) => x != 'constructor' && x != 'on' && x != 'connect' && x != 'runDisconnect' && x != 'disconnect',
      );

      // if (modelNames.length > 0) {
      //   console.log("WARNING! ERASING DB.")
      //   cleanupDatabase()
      //   console.log("~ ERASED ~")
      // }

      /*
        ~~~~ PRIVATE ~~~~
    */

      const user1 = await pvtPrisma.users.create({ data: mockUser });
      const user2 = await pvtPrisma.users.create({ data: mockUser2 });
      const user3 = await pvtPrisma.users.create({ data: mockUser3 });

      // communities
      const community1 = await pvtPrisma.communities.create({ data: mockCommunity });
      const community2 = await pvtPrisma.communities.create({ data: mockCommunity2 });
      const community3 = await pvtPrisma.communities.create({ data: mockCommunity3 });

      // // roles
      const role1 = await pvtPrisma.roles.create({
        data: createMockRole({
          user: user1.id,
          community: community1.id,
          refUsers: [{ id: user1.id }],
          refCommunities: [{ id: community1.id }],
        }),
      });
      const role2 = await pvtPrisma.roles.create({
        data: createMockRole({
          user: user1.id,
          community: community1.id,
          refUsers: [{ id: user2.id }, { id: user3.id }],
          refCommunities: [{ id: community2.id }, { id: community3.id }],
        }),
      });

      // // listings
      const listing1 = await pvtPrisma.listings.create({
        data: createMockListing({
          favorited: [{ id: user2.id }, { id: user3.id }],
          user: user1.id,
          community: community1.id,
          communityFavorited: [{ id: community2.id }, { id: community3.id }],
          model: model1.id,
        }),
      });
      const listing2 = await pvtPrisma.listings.create({
        data: createMockListing({
          favorited: [{ id: user2.id }, { id: user3.id }],
          user: user1.id,
          community: community1.id,
          communityFavorited: [{ id: community2.id }, { id: community3.id }],
        }),
      });

      // // taxonomies
      const term1 = await pvtPrisma.taxonomies.create({
        data: createMockTerm({
          community: community3.id,
          user: user2.id,
          listings: [{ id: listing1.id }],
          targetCommunities: [{ id: community2.id }],
          targetUsers: [{ id: user2.id }],
        }),
      });
      const term2 = await pvtPrisma.taxonomies.create({
        data: createMockTerm({
          community: community3.id,
          user: user2.id,
          listings: [{ id: listing2.id }],
          targetCommunities: [{ id: community3.id }],
          targetUsers: [{ id: user3.id }],
        }),
      });

      // messages
      const message1 = await pvtPrisma.messages.create({
        data: createMockMessage({
          community: community3.id,
          user: user2.id,
          fromUser: { id: user3.id },
          toUsers: [{ id: user1.id }, { id: user2.id }],
          toCommunities: [],
          toListings: [],
        }),
      });
      const message2 = await pvtPrisma.messages.create({
        data: createMockMessage({
          community: community3.id,
          user: user2.id,
          fromUser: { id: user2.id },
          toUsers: [],
          toCommunities: [{ id: community2.id }, { id: community3.id }],
          toListings: [{ id: listing1.id }, { id: listing2.id }],
        }),
      });
      const message3 = await pvtPrisma.messages.create({
        data: createMockMessage({
          community: community3.id,
          user: user2.id,
          fromCommunity: { id: community3.id },
          toUsers: [],
          toCommunities: [],
          toListings: [],
        }),
      });

      console.log(`Private Database has been seeded. 🌱`);
    } catch (error) {
      throw error;
    }
  };
} else {
  console.log('~ SEEDING PUBLIC DB ~');

  const pvtPrisma = new PrivatePrisma({
    datasourceUrl: process.env.MONGODB_PRIVATE_URI,
  });

  const pubPrisma = new PublicPrisma({
    datasourceUrl: process.env.MONGODB_PUBLIC_URI,
  });

  const main = async () => {
    try {
      // await pvtPrisma.products.deleteMany();

      // // cleanup the existing database
      const allProperties = Reflect.ownKeys(Object.getPrototypeOf(pubPrisma));
      const modelNames = allProperties.filter(
        (x) => x != 'constructor' && x != 'on' && x != 'connect' && x != 'runDisconnect' && x != 'disconnect',
      );

      // if (modelNames.length > 0) {
      //   console.log("WARNING! ERASING DB.")
      //   cleanupDatabase()
      //   console.log("~ ERASED ~")
      // }

      /*
          ~~~~ PUBLIC ~~~~
      */

      const facadeEntry = (fields: string[], facades: Record<string, any>) => (entry: any) => {
        const facader = fields.reduce((fac, field, index) => {
          let content = entry[field];
          if (facades && facades[field]) {
            content = facades[field](content);
          }
          fac[field] = content;
          return fac;
        }, {});

        return facader;
      };

      const facadeOffer = facadeEntry([
        'id',
        'name',
        'description',
        'cost',
        'currency',
        'subcharges',
        'discounts',
        'status',
        'launch',
      ]);

      const facadeAudience = facadeEntry(['id', 'name', 'description', 'status']);

      const facadeModel = facadeEntry(['id', 'name', 'description', 'status', 'type', 'taxonomies', 'remarks']);

      const facadeTaxonomy = facadeEntry(['id', 'name', 'description', 'status', 'type', 'nature', 'audiencesIds']);

      const facadeAd = facadeEntry(['id', 'name', 'description', 'status']);

      // const decorateAd = facadeEntry([
      //   'userFits',
      //   'communityFits',
      // ]);

      const facadeMessage = facadeEntry([
        'id',
        'name',
        'description',
        'status',
        'type',
        'nature',
        'title',
        'body',
        'queuedOn',
        'scheduledOn',
        'sentOn',
      ]);

      const facadeReview = facadeEntry(['id', 'name', 'message', 'rating', 'impression', 'user', 'community', 'listing']);

      const facadeUser = facadeEntry(['id', 'image', 'firstName']);

      const facadeCommunity = facadeEntry(['id', 'image', 'name', 'urls', 'status']);

      const getSeedData = () => {
        try {
          const data = JSON.parse(fs.readFileSync('stub.json'));
          return data;
        } catch (e) {
          execSync('npm run schema:seed:getseeds');
          return { retry: true };
        }
      };

      let data = getSeedData();

      if (data?.retry) {
        data = getSeedData();
      }

      const { community, user, offer, audience, model, term, ad, listingTerm, review } = data;

      const pubListing1 = await pubPrisma.publicListings.create({
        data: createMockPubListing({
          community: facadeCommunity(community),
          user: facadeUser(user),
          offers: [facadeOffer(offer)],
          audiences: [facadeAudience(audience)],
          model: facadeModel(model),
          taxonomies: [facadeTaxonomy(term)],
          ads: [facadeAd(ad)],
          listingTaxonomies: [facadeTaxonomy(listingTerm)],
          reviews: [facadeReview(review)],
        }),
      });

      const pubListing2 = await pubPrisma.publicListings.create({
        data: createMockPubListing({
          community: facadeCommunity(community),
          user: facadeUser(user),
          offers: [facadeOffer(offer)],
          audiences: [facadeAudience(audience)],
          model: facadeModel(model),
          taxonomies: [facadeTaxonomy(term)],
          ads: [facadeAd(ad)],
          listingTaxonomies: [facadeTaxonomy(listingTerm)],
          reviews: [facadeReview(review)],
        }),
      });

      const pubListing3 = await pubPrisma.publicListings.create({
        data: createMockPubListing({
          community: facadeCommunity(community),
          user: facadeUser(user),
          offers: [facadeOffer(offer)],
          audiences: [facadeAudience(audience)],
          model: facadeModel(model),
          taxonomies: [facadeTaxonomy(term)],
          ads: [facadeAd(ad)],
          listingTaxonomies: [facadeTaxonomy(listingTerm)],
          reviews: [facadeReview(review)],
        }),
      });

      console.log(`Public Database has been seeded. 🌱`);
    } catch (error) {
      throw error;
    }
  };
}

main().catch((err) => {
  console.warn('Error While generating Seed: \n', err);
});
