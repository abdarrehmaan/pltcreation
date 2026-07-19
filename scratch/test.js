const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const tables = ['user', 'product', 'category', 'collection', 'order', 'orderItem', 'wishlistItem', 'coupon'];
    for (const table of tables) {
      const count = await prisma[table].count();
      console.log(`${table}: ${count} records`);
    }
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
