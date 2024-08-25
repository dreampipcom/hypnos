import type { PrismaClient as PrivatePrismaType } from '@dreampipcom/db-private/prisma-client';
import { PrismaClient as PrivatePrisma } from '@dreampipcom/db-private/prisma-client/edge';
import { PrismaClient as PrivatePrismaStandalone } from '@dreampipcom/db-private/prisma-client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientSingleton = () => {
  if (process.env.NEXUS_STANDALONE_PRISMA_ONLY === 'true') {
    console.log('--- USING EDGE, BUT NOT USING PRISMA ACCELERATE');
    return new PrivatePrisma();
  } else {
    console.log('--- USING EDGE AND USING PRISMA ACCELERATE');
    return new PrivatePrisma().$extends(withAccelerate());
  }
};

const prismaClientSingletonStandalone = () => {
  if (process.env.NEXUS_STANDALONE === 'true') {
    console.log('--- NOT USING EDGE AND NOT USING PRISMA ACCELERATE');
    return new PrivatePrismaStandalone();
  }
  return;
};

declare const globalThis: {
  prismaPrivateGlobal: PrivatePrismaType;
  prismaPrivateGlobalStandalone: PrivatePrismaType;
} & typeof global;

const privatePrisma =
  process.env.NEXUS_STANDALONE === 'true'
    ? globalThis.prismaPrivateGlobalStandalone ?? (prismaClientSingletonStandalone() as unknown as PrivatePrismaType)
    : globalThis.prismaPrivateGlobal ?? (prismaClientSingleton() as unknown as PrivatePrismaType);

export default privatePrisma;

if (process.env.NODE_ENV !== 'production') {
  if (process.env.NEXUS_STANDALONE === 'true') {
    globalThis.prismaPrivateGlobalStandalone = privatePrisma;
  } else {
    globalThis.prismaPrivateGlobal = privatePrisma;
  }
}
