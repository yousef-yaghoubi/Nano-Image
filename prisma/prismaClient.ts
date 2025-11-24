import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// eslint-disable-next-line no-constant-binary-expression
export const prisma = new PrismaClient() || globalThis.prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
