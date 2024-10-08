import type { PrismaClient as PublicPrismaType } from '@dreampipcom/db-public/prisma-client';
import { PrismaClient as PublicPrisma } from '@dreampipcom/db-public/prisma-client/edge';
import { PrismaClient as PublicPrismaStandalone } from '@dreampipcom/db-public/prisma-client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientSingleton = () => {
  if (process.env.NEXUS_STANDALONE_PRISMA_ONLY === 'true') {
    console.log('--- USING EDGE, BUT NOT USING PRISMA ACCELERATE');
    return new PublicPrisma();
  } else {
    console.log('--- USING EDGE AND USING PRISMA ACCELERATE');
    return new PublicPrisma().$extends(withAccelerate());
  }
};
const prismaClientSingletonStandalone = () => {
  if (process.env.NEXUS_STANDALONE === 'true') {
    console.log('--- NOT USING EDGE AND NOT USING PRISMA ACCELERATE');
    return new PublicPrismaStandalone();
  }
  return;
};

declare const globalThis: {
  prismaPublicGlobal: PublicPrismaType;
  prismaPublicGlobalStandalone: PublicPrismaType;
} & typeof global;

const publicPrisma =
  process.env.NEXUS_STANDALONE === 'true'
    ? globalThis.prismaPublicGlobalStandalone ?? (prismaClientSingletonStandalone() as unknown as PublicPrismaType)
    : globalThis.prismaPublicGlobal ?? (prismaClientSingleton() as unknown as PublicPrismaType);

export default publicPrisma;

if (process.env.NODE_ENV !== 'production') {
  if (process.env.NEXUS_STANDALONE === 'true') {
    globalThis.prismaPublicGlobalStandalone = publicPrisma;
  } else {
    globalThis.prismaPublicGlobal = publicPrisma;
  }
}
