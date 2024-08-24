import { PrismaClient as PrivatePrisma } from '@dreampipcom/db-private/prisma-client/edge';
import { PrismaClient as PrivatePrismaStandalone } from '@dreampipcom/db-private/prisma-client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientSingleton = () => {
  if (process.env.NEXUS_STANDALONE === 'true') {
    return new PrivatePrismaStandalone();
  }
  return new PrivatePrisma().$extends(withAccelerate());
};

declare const globalThis: {
  prismaPrivateGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const privatePrisma = globalThis.prismaPrivateGlobal ?? prismaClientSingleton();

export default privatePrisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaPrivateGlobal = privatePrisma;
