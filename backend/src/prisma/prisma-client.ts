import { PrismaClient } from '@prisma/client';

// Default envs:
// - Ensure JWT secret exists
// - DATABASE_URL must be provided for postgres; tests should set one (e.g., local postgres or test container)
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'changeme';

declare global {
  namespace NodeJS {
    interface Global {}
  }
}

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
