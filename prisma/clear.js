const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function clearDatabase() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('No DIRECT_URL or DATABASE_URL environment variable found.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Clearing all sample and seed records from database...');

  try {
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({});
      await tx.returnRequest.deleteMany({});
      await tx.invoice.deleteMany({});
      await tx.order.deleteMany({});
      await tx.wishlistItem.deleteMany({});
      await tx.cartItem.deleteMany({});
      await tx.productImage.deleteMany({});
      await tx.productVariant.deleteMany({});
      await tx.collectionProduct.deleteMany({});
      await tx.review.deleteMany({});
      await tx.product.deleteMany({});
      await tx.category.deleteMany({});
      await tx.collection.deleteMany({});
      await tx.offer.deleteMany({});
      await tx.coupon.deleteMany({});
    });

    console.log('All sample/seed data successfully cleared from database!');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

clearDatabase();
