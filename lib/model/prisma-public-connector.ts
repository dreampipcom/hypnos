import type { PrismaClient as PublicPrismaType } from '@dreampipcom/db-public/prisma-client';
// import { PrismaClient as PublicPrisma } from '@dreampipcom/db-public/prisma-client/edge';
import { PrismaClient as PublicPrismaStandalone } from '@dreampipcom/db-public/prisma-client';
// import { withAccelerate } from '@prisma/extension-accelerate';

// const prismaClientSingleton = () => {
//   return new PublicPrisma().$extends(withAccelerate());
// };

const prismaClientSingletonStandalone = () => {
  return new PublicPrismaStandalone();
};

declare const globalThis: {
  // prismaPublicGlobal: PublicPrismaType;
  prismaPublicGlobalStandalone: PublicPrismaType;
} & typeof global;

const publicPrisma =
  process.env.NEXUS_STANDALONE === 'true'
    ? globalThis.prismaPublicGlobalStandalone ?? (prismaClientSingletonStandalone() as unknown as PublicPrismaType)
    : globalThis.prismaPublicGlobalStandalone ?? (prismaClientSingletonStandalone() as unknown as PublicPrismaType);
// : globalThis.prismaPublicGlobal ?? (prismaClientSingleton() as unknown as PublicPrismaType);

export default publicPrisma;

if (process.env.NODE_ENV !== 'production') {
  if (process.env.NEXUS_STANDALONE === 'true') {
    globalThis.prismaPublicGlobalStandalone = publicPrisma;
  } else {
    globalThis.prismaPublicGlobalStandalone = publicPrisma;
    // globalThis.prismaPublicGlobal = publicPrisma;
  }
}
