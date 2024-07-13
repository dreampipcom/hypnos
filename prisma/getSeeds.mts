// getSeeds.ts
import { PrismaClient as PrivatePrisma } from '@dreampipcom/db-private/prisma-client';

import fs from 'node:fs';

const main = async () => {
  try {
    console.log('~ GETTING STUB PRIVATE SEEDED METADATA ~');

    const pvtPrisma = new PrivatePrisma({
      datasourceUrl: process.env.MONGODB_PRIVATE_URI,
    });

    const user = await pvtPrisma.users.findFirst({});
    const community = await pvtPrisma.communities.findFirst({});
    const model = await pvtPrisma.catalogue.findFirst({});
    const term = await pvtPrisma.taxonomies.findFirst({});
    const ad = await pvtPrisma.campaigns.findFirst({});
    const listingTerm = await pvtPrisma.taxonomies.findFirst({});
    const review = await pvtPrisma.reviews.findFirst({});

    const stubData = {
      user,
      community,
      offer,
      audience,
      model,
      term,
      ad,
      listingTerm,
      review,
    };

    fs.writeFileSync('stub.json', JSON.stringify(stubData));

    console.log(`Seeded data has been stored locally. 🌱`);
  } catch (error) {
    throw error;
  }
};

main().catch((err) => {
  console.warn('Error While generating Seed: \n', err);
});
