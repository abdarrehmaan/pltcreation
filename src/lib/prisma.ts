import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getPrismaInstance(): PrismaClient {
  const connectionString =
    process.env.DIRECT_URL ||
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/postgres';

  const isSupabase = connectionString.includes('supabase.com');

  const pool = new Pool({
    connectionString,
    ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
    max: isSupabase ? 5 : 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? getPrismaInstance();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
