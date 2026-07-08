// Prisma client stub — connect to real Supabase once DATABASE_URL is set in .env.local
// For now this is a type-safe stub that works without a real DB connection

let prisma: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = globalThis as unknown as { prisma: any };
  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
} catch {
  // Prisma not yet generated — run: npx prisma generate
  prisma = null;
}

export { prisma };
export default prisma;
