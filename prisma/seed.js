import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Upserting seed database records safely (preserving orders)...');

  try {
    // 1. Seed Categories
    const categoriesData = [
      { name: 'Chikankari', slug: 'chikankari', description: 'Handcrafted Chikankari work on premium fabrics', image: '/banner-chikankari.jpg' },
      { name: 'Co-ord Sets', slug: 'coord-sets', description: 'Elegant matching top and bottom sets', image: '/banner-coord.png' },
      { name: 'Dresses', slug: 'dresses', description: 'Elegant ethnic and fusion dresses designed for modern sophistication', image: '/banner-dresses.jpg' },
      { name: 'Kurtis', slug: 'kurtis', description: 'Casual and festive ethnic kurtis', image: '/banner-kurti.jpg' },
      { name: 'Stitched Suits', slug: 'stitched-suits', description: 'Fully stitched premium salwar suit sets', image: '/banner-stitched.jpg' },
      { name: 'Unstitched Suits', slug: 'unstitched-suits', description: 'Unstitched suit materials for custom fitting', image: '/banner-unstitched.jpg' },
    ];

    const categories = {};
    for (const cat of categoriesData) {
      const created = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      });
      categories[created.name] = created.id;
    }
    console.log('Upserted categories.');

    // 2. Seed Collections
    const collectionsData = [
      { name: 'Eid Festive Edit', slug: 'eid-festive', description: 'Celebrate the most beautiful festival with our handpicked Eid collection', bannerImage: '/banner1.jpg' },
      { name: 'Monsoon Freshness', slug: 'monsoon', description: 'Light, breathable fabrics perfect for the rainy season', bannerImage: '/banner2.png' },
      { name: 'Wedding Season', slug: 'wedding', description: 'Be the most elegant guest at every wedding this season', bannerImage: '/banner3.png' },
      { name: 'Designer Dresses', slug: 'dresses-collection', description: 'Stunning designer dresses and ethnic fusion silhouettes', bannerImage: '/banner-dresses.jpg' },
    ];

    for (const col of collectionsData) {
      await prisma.collection.upsert({
        where: { slug: col.slug },
        update: col,
        create: col,
      });
    }
    console.log('Upserted collections.');

    // 3. Seed Products
    const mockProducts = [
      {
        id: 'p1',
        name: 'Ivory Chikankari Kurta with Palazzo',
        slug: 'ivory-chikankari-kurta-palazzo',
        sku: 'HFZ-CHK-001',
        price: 2499,
        comparePrice: 3999,
        totalStock: 12,
        isNewArrival: true,
        isBestSeller: false,
        isFeatured: true,
        isTrending: true,
        categoryName: 'Chikankari',
        images: [
          { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80', alt: 'Ivory Chikankari Kurta' },
          { url: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=600&auto=format&fit=crop&q=80', alt: 'Ivory Chikankari Kurta Back' },
        ],
        variants: [
          { size: 'XS', color: 'Ivory', colorHex: '#F5F0E8', stock: 2 },
          { size: 'S', color: 'Ivory', colorHex: '#F5F0E8', stock: 4 },
          { size: 'M', color: 'Ivory', colorHex: '#F5F0E8', stock: 3 },
          { size: 'L', color: 'Ivory', colorHex: '#F5F0E8', stock: 2 },
          { size: 'XL', color: 'Ivory', colorHex: '#F5F0E8', stock: 1 },
        ],
      },
      {
        id: 'p2',
        name: 'Rose Gold Co-ord Set with Dupatta',
        slug: 'rose-gold-coord-set-dupatta',
        sku: 'HFZ-CRD-001',
        price: 3299,
        comparePrice: 5499,
        totalStock: 8,
        isNewArrival: true,
        isBestSeller: true,
        isFeatured: true,
        isTrending: true,
        categoryName: 'Co-ord Sets',
        images: [
          { url: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop&q=80', alt: 'Rose Gold Co-ord Set' },
        ],
        variants: [
          { size: 'S', color: 'Rose Gold', colorHex: '#C4748A', stock: 2 },
          { size: 'M', color: 'Rose Gold', colorHex: '#C4748A', stock: 3 },
          { size: 'L', color: 'Rose Gold', colorHex: '#C4748A', stock: 3 },
        ],
      },
      {
        id: 'p3',
        name: 'Floral Printed Cotton Kurti',
        slug: 'floral-printed-cotton-kurti',
        sku: 'HFZ-KRT-001',
        price: 899,
        comparePrice: 1499,
        totalStock: 45,
        isNewArrival: false,
        isBestSeller: true,
        isFeatured: false,
        isTrending: true,
        categoryName: 'Kurtis',
        images: [
          { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80', alt: 'Floral Kurti' },
        ],
        variants: [
          { size: 'XS', color: 'Peach', colorHex: '#FFCBA4', stock: 8 },
          { size: 'S', color: 'Peach', colorHex: '#FFCBA4', stock: 12 },
          { size: 'M', color: 'Peach', colorHex: '#FFCBA4', stock: 10 },
          { size: 'L', color: 'Peach', colorHex: '#FFCBA4', stock: 8 },
          { size: 'XL', color: 'Peach', colorHex: '#FFCBA4', stock: 5 },
          { size: 'XXL', color: 'Peach', colorHex: '#FFCBA4', stock: 2 },
        ],
      },
      {
        id: 'p4',
        name: 'Designer Anarkali Stitched Suit',
        slug: 'designer-anarkali-stitched-suit',
        sku: 'HFZ-STT-001',
        price: 4999,
        comparePrice: 7999,
        totalStock: 5,
        isNewArrival: true,
        isBestSeller: false,
        isFeatured: true,
        isTrending: false,
        categoryName: 'Stitched Suits',
        images: [
          { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80', alt: 'Anarkali Suit' },
        ],
        variants: [
          { size: 'S', color: 'Burgundy', colorHex: '#800020', stock: 1 },
          { size: 'M', color: 'Burgundy', colorHex: '#800020', stock: 2 },
          { size: 'L', color: 'Burgundy', colorHex: '#800020', stock: 2 },
        ],
      },
      {
        id: 'p5',
        name: 'Pure Georgette Unstitched Suit Material',
        slug: 'pure-georgette-unstitched-suit',
        sku: 'HFZ-UNS-001',
        price: 1799,
        comparePrice: 2999,
        totalStock: 30,
        isNewArrival: false,
        isBestSeller: true,
        isFeatured: false,
        isTrending: true,
        categoryName: 'Unstitched Suits',
        images: [
          { url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&auto=format&fit=crop&q=80', alt: 'Georgette Suit' },
        ],
        variants: [
          { size: 'Free Size', color: 'Teal', colorHex: '#008080', stock: 10 },
          { size: 'Free Size', color: 'Mint', colorHex: '#98FF98', stock: 10 },
          { size: 'Free Size', color: 'Navy', colorHex: '#003153', stock: 10 },
        ],
      },
      {
        id: 'p6',
        name: 'Embroidered Silk Chikankari Suit',
        slug: 'embroidered-silk-chikankari-suit',
        sku: 'HFZ-CHK-002',
        price: 5999,
        comparePrice: 9999,
        totalStock: 3,
        isNewArrival: true,
        isBestSeller: false,
        isFeatured: true,
        isTrending: false,
        categoryName: 'Chikankari',
        images: [
          { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80', alt: 'Silk Chikankari' },
        ],
        variants: [
          { size: 'S', color: 'Pastel Pink', colorHex: '#FFB7C5', stock: 1 },
          { size: 'M', color: 'Pastel Pink', colorHex: '#FFB7C5', stock: 1 },
          { size: 'L', color: 'Pastel Pink', colorHex: '#FFB7C5', stock: 1 },
        ],
      },
      {
        id: 'p7',
        name: 'Festive Palazzo Kurti Set',
        slug: 'festive-palazzo-kurti-set',
        sku: 'HFZ-KRT-002',
        price: 1599,
        comparePrice: 2499,
        totalStock: 20,
        isNewArrival: false,
        isBestSeller: true,
        isFeatured: false,
        isTrending: true,
        categoryName: 'Kurtis',
        images: [
          { url: 'https://images.unsplash.com/photo-1611601679655-7c8bc197f0c6?w=600&auto=format&fit=crop&q=80', alt: 'Palazzo Kurti' },
        ],
        variants: [
          { size: 'S', color: 'Yellow', colorHex: '#FFD700', stock: 5 },
          { size: 'M', color: 'Yellow', colorHex: '#FFD700', stock: 8 },
          { size: 'L', color: 'Yellow', colorHex: '#FFD700', stock: 5 },
          { size: 'XL', color: 'Yellow', colorHex: '#FFD700', stock: 2 },
        ],
      },
      {
        id: 'p8',
        name: 'Royal Blue Sharara Co-ord Set',
        slug: 'royal-blue-sharara-coord-set',
        sku: 'HFZ-CRD-002',
        price: 3799,
        comparePrice: 5999,
        totalStock: 7,
        isNewArrival: true,
        isBestSeller: false,
        isFeatured: true,
        isTrending: true,
        categoryName: 'Co-ord Sets',
        images: [
          { url: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?w=600&auto=format&fit=crop&q=80', alt: 'Blue Sharara' },
        ],
        variants: [
          { size: 'XS', color: 'Royal Blue', colorHex: '#4169E1', stock: 1 },
          { size: 'S', color: 'Royal Blue', colorHex: '#4169E1', stock: 2 },
          { size: 'M', color: 'Royal Blue', colorHex: '#4169E1', stock: 3 },
          { size: 'L', color: 'Royal Blue', colorHex: '#4169E1', stock: 1 },
        ],
      },
    ];

    for (const prod of mockProducts) {
      const categoryId = categories[prod.categoryName];
      if (!categoryId) {
        throw new Error(`Category ${prod.categoryName} not found`);
      }

      // Find existing product by SKU if any to clean up images/variants
      const existingProduct = await prisma.product.findUnique({ where: { sku: prod.sku } });
      if (existingProduct) {
        await prisma.productImage.deleteMany({ where: { productId: existingProduct.id } });
        await prisma.productVariant.deleteMany({ where: { productId: existingProduct.id } });
      }

      await prisma.product.upsert({
        where: { sku: prod.sku },
        update: {
          name: prod.name,
          slug: prod.slug,
          price: prod.price,
          comparePrice: prod.comparePrice,
          totalStock: prod.totalStock,
          isNewArrival: prod.isNewArrival,
          isBestSeller: prod.isBestSeller,
          isFeatured: prod.isFeatured,
          isTrending: prod.isTrending,
          categoryId: categoryId,
          images: {
            create: prod.images,
          },
          variants: {
            create: prod.variants,
          },
        },
        create: {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          sku: prod.sku,
          price: prod.price,
          comparePrice: prod.comparePrice,
          totalStock: prod.totalStock,
          isNewArrival: prod.isNewArrival,
          isBestSeller: prod.isBestSeller,
          isFeatured: prod.isFeatured,
          isTrending: prod.isTrending,
          categoryId: categoryId,
          images: {
            create: prod.images,
          },
          variants: {
            create: prod.variants,
          },
        },
      });
    }

    console.log('Upserted products, images and variants.');

    // 4. Connect Products to Collections safely
    const dbCollections = await prisma.collection.findMany();
    const dbProducts = await prisma.product.findMany();
    
    const getProdId = (sku) => dbProducts.find(p => p.sku === sku)?.id;

    const eidCollection = dbCollections.find(c => c.slug === 'eid-festive');
    const monsoonCollection = dbCollections.find(c => c.slug === 'monsoon');
    const weddingCollection = dbCollections.find(c => c.slug === 'wedding');
    const dressesCollection = dbCollections.find(c => c.slug === 'dresses-collection');

    const rawConnections = [];

    if (eidCollection) {
      rawConnections.push(
        { colId: eidCollection.id, sku: 'HFZ-CHK-001', sortOrder: 0 },
        { colId: eidCollection.id, sku: 'HFZ-CRD-001', sortOrder: 1 },
        { colId: eidCollection.id, sku: 'HFZ-STT-001', sortOrder: 2 },
        { colId: eidCollection.id, sku: 'HFZ-CRD-002', sortOrder: 3 }
      );
    }

    if (monsoonCollection) {
      rawConnections.push(
        { colId: monsoonCollection.id, sku: 'HFZ-KRT-001', sortOrder: 0 },
        { colId: monsoonCollection.id, sku: 'HFZ-UNS-001', sortOrder: 1 },
        { colId: monsoonCollection.id, sku: 'HFZ-KRT-002', sortOrder: 2 }
      );
    }

    if (weddingCollection) {
      rawConnections.push(
        { colId: weddingCollection.id, sku: 'HFZ-CRD-001', sortOrder: 0 },
        { colId: weddingCollection.id, sku: 'HFZ-STT-001', sortOrder: 1 },
        { colId: weddingCollection.id, sku: 'HFZ-CHK-002', sortOrder: 2 },
        { colId: weddingCollection.id, sku: 'HFZ-CRD-002', sortOrder: 3 }
      );
    }

    if (dressesCollection) {
      rawConnections.push(
        { colId: dressesCollection.id, sku: 'HFZ-CHK-001', sortOrder: 0 },
        { colId: dressesCollection.id, sku: 'HFZ-CRD-001', sortOrder: 1 },
        { colId: dressesCollection.id, sku: 'HFZ-STT-001', sortOrder: 2 }
      );
    }

    for (const conn of rawConnections) {
      const productId = getProdId(conn.sku);
      if (productId) {
        await prisma.collectionProduct.upsert({
          where: {
            collectionId_productId: {
              collectionId: conn.colId,
              productId: productId,
            }
          },
          update: { sortOrder: conn.sortOrder },
          create: {
            collectionId: conn.colId,
            productId: productId,
            sortOrder: conn.sortOrder,
          },
        });
      }
    }
    console.log('Upserted product connections to collections.');

    console.log('Database seeding/updating completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
