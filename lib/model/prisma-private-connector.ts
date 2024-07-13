import { PrismaClient as PrivatePrisma } from '@dreampipcom/db-private/prisma-client';

const prismaClientSingleton = () => {
  return new PrivatePrisma();
};

declare const globalThis: {
  prismaPrivateGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const privatePrisma = globalThis.prismaPrivateGlobal ?? prismaClientSingleton();

export default privatePrisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaPrivateGlobal = privatePrisma;
