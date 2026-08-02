import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

function getPrismaInstance(): PrismaClient {
  let connectionString =
    process.env.DATABASE_URL ||
    process.env.DIRECT_URL ||
    'postgresql://postgres:postgres@localhost:5432/postgres';

  const isSupabase = connectionString.includes('supabase') || connectionString.includes('pooler.supabase.com');

  // Enforce single connection per worker process for Supabase pooler mode
  if (isSupabase && !connectionString.includes('connection_limit=')) {
    const separator = connectionString.includes('?') ? '&' : '?';
    connectionString += `${separator}connection_limit=1&pool_timeout=10`;
  }

  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString,
      ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
      max: isSupabase ? 1 : 5, // Strict 1 connection per worker process to prevent EMAXCONNSESSION
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 1000, // Close idle connections after 1s
      allowExitOnIdle: true,
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? getPrismaInstance();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
