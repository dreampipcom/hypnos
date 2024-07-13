import { PrismaClient as PublicPrisma } from '@dreampipcom/db-public/prisma-client';

const prismaClientSingleton = () => {
  return new PublicPrisma();
};

declare const globalThis: {
  prismaPublicGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const publicPrisma = globalThis.prismaPublicGlobal ?? prismaClientSingleton();

export default publicPrisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaPublicGlobal = publicPrisma;
