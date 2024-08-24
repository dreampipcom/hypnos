import type { PrismaClient as PrivatePrismaType } from '@dreampipcom/db-private/prisma-client';
import { PrismaClient as PrivatePrisma } from '@dreampipcom/db-private/prisma-client/edge';
import { PrismaClient as PrivatePrismaStandalone } from '@dreampipcom/db-private/prisma-client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientSingleton = () => {
  return new PrivatePrisma().$extends(withAccelerate());
};

const prismaClientSingletonStandalone = () => {
  return new PrivatePrismaStandalone();
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
