import { PrismaClient as PublicPrisma } from '@dreampipcom/db-public/prisma-client/edge';
import { PrismaClient as PublicPrismaStandalone } from '@dreampipcom/db-public/prisma-client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientSingleton = () => {
  if (process.env.NEXUS_STANDALONE === 'true') {
    return new PublicPrismaStandalone();
  }
  return new PublicPrisma().$extends(withAccelerate());
};

declare const globalThis: {
  prismaPublicGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const publicPrisma = globalThis.prismaPublicGlobal ?? prismaClientSingleton();

export default publicPrisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaPublicGlobal = publicPrisma;
