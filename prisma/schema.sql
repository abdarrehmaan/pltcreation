-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET', 'COD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('HOMEPAGE_BANNER', 'CATEGORY_BANNER', 'PRODUCT_BADGE', 'POPUP');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('PERCENTAGE', 'FIXED', 'FREE_SHIPPING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "bannerImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_products" (
    "collectionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "collection_products_pkey" PRIMARY KEY ("collectionId","productId")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "fabricDetails" TEXT,
    "specifications" TEXT,
    "washingInstructions" TEXT,
    "categoryId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "comparePrice" DECIMAL(10,2),
    "costPrice" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isNewArrival" BOOLEAN NOT NULL DEFAULT false,
    "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "totalStock" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "colorHex" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "shippingCharge" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "couponCode" TEXT,
    "couponDiscount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "prepaidDiscount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "codAdvanceAmount" DECIMAL(10,2),
    "notes" TEXT,
    "trackingNumber" TEXT,
    "trackingUrl" TEXT,
    "shippingName" TEXT,
    "shippingPhone" TEXT,
    "shippingLine1" TEXT,
    "shippingLine2" TEXT,
    "shippingCity" TEXT,
    "shippingState" TEXT,
    "shippingPincode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "productName" TEXT NOT NULL,
    "productSku" TEXT NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "imageUrl" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "CouponType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "minOrderValue" DECIMAL(10,2),
    "maxDiscount" DECIMAL(10,2),
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "perUserLimit" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "type" "OfferType" NOT NULL DEFAULT 'HOMEPAGE_BANNER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_requests" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "status" "ReturnStatus" NOT NULL DEFAULT 'REQUESTED',
    "refundAmount" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfUrl" TEXT,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "prepaidDiscountPercent" DECIMAL(5,2) NOT NULL DEFAULT 5,
    "codAdvancePercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "freeShippingThreshold" DECIMAL(10,2) NOT NULL DEFAULT 999,
    "standardShippingCharge" DECIMAL(10,2) NOT NULL DEFAULT 99,
    "taxPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_key" ON "wallets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_key" ON "collections"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_size_color_key" ON "product_variants"("productId", "size", "color");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_userId_productId_variantId_key" ON "cart_items"("userId", "productId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_userId_productId_key" ON "wishlist_items"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_productId_userId_key" ON "reviews"("productId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_orderId_key" ON "invoices"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;



-- ============================================================
-- SAMPLE DATA INSERTS FOR PRODUCTS & CATEGORIES
-- ============================================================

-- Insert Categories
INSERT INTO "categories" ("id", "name", "slug", "description", "image", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES
('cat_1', 'Chikankari', 'chikankari', 'Handcrafted Chikankari work on premium fabrics', '/banner-chikankari.jpg', true, 0, NOW(), NOW()),
('cat_2', 'Co-ord Sets', 'coord-sets', 'Elegant matching top and bottom sets', '/banner-coord.png', true, 1, NOW(), NOW()),
('cat_3', 'Kurtis', 'kurtis', 'Casual and festive ethnic kurtis', '/banner-kurti.jpg', true, 2, NOW(), NOW()),
('cat_4', 'Stitched Suits', 'stitched-suits', 'Fully stitched premium salwar suit sets', '/banner-stitched.jpg', true, 3, NOW(), NOW()),
('cat_5', 'Unstitched Suits', 'unstitched-suits', 'Unstitched suit materials for custom fitting', '/banner-unstitched.jpg', true, 4, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "image" = EXCLUDED."image", "name" = EXCLUDED."name";

-- Insert Products
INSERT INTO "products" ("id", "name", "slug", "sku", "description", "categoryId", "price", "comparePrice", "isActive", "isDeleted", "isFeatured", "isNewArrival", "isBestSeller", "isTrending", "totalStock", "createdAt", "updatedAt") VALUES
('p1', 'Ivory Chikankari Kurta with Palazzo', 'ivory-chikankari-kurta-palazzo', 'HFZ-CHK-001', 'Exquisite handcrafted chikankari kurta with palazzo.', 'cat_1', 2499.00, 3999.00, true, false, true, true, false, true, 12, NOW(), NOW()),
('p2', 'Rose Gold Co-ord Set with Dupatta', 'rose-gold-coord-set-dupatta', 'HFZ-CRD-001', 'Elegant rose gold co-ord set with embroidered dupatta.', 'cat_2', 3299.00, 5499.00, true, false, true, true, true, true, 8, NOW(), NOW()),
('p3', 'Floral Printed Cotton Kurti', 'floral-printed-cotton-kurti', 'HFZ-KRT-001', 'Comfortable floral printed daily wear cotton kurti.', 'cat_3', 899.00, 1499.00, true, false, false, false, true, true, 45, NOW(), NOW()),
('p4', 'Designer Anarkali Stitched Suit', 'designer-anarkali-stitched-suit', 'HFZ-STT-001', 'Heavy designer Anarkali suit set with dupatta.', 'cat_4', 4999.00, 7999.00, true, false, true, true, false, false, 5, NOW(), NOW()),
('p5', 'Pure Georgette Unstitched Suit Material', 'pure-georgette-unstitched-suit', 'HFZ-UNS-001', 'Premium unstitched georgette suit fabric.', 'cat_5', 1799.00, 2999.00, true, false, false, false, true, true, 30, NOW(), NOW()),
('p6', 'Embroidered Silk Chikankari Suit', 'embroidered-silk-chikankari-suit', 'HFZ-CHK-002', 'Silk chikankari suit set for grand occasions.', 'cat_1', 5999.00, 9999.00, true, false, true, true, false, false, 3, NOW(), NOW()),
('p7', 'Festive Palazzo Kurti Set', 'festive-palazzo-kurti-set', 'HFZ-KRT-002', 'Bright festive kurti with palazzo set.', 'cat_3', 1599.00, 2499.00, true, false, false, false, true, true, 20, NOW(), NOW()),
('p8', 'Royal Blue Sharara Co-ord Set', 'royal-blue-sharara-coord-set', 'HFZ-CRD-002', 'Stunning royal blue sharara set with gold embroidery.', 'cat_2', 3799.00, 5999.00, true, false, true, true, false, true, 7, NOW(), NOW())
ON CONFLICT ("sku") DO UPDATE SET "name" = EXCLUDED."name", "price" = EXCLUDED."price", "comparePrice" = EXCLUDED."comparePrice";

-- Insert Product Images
DELETE FROM "product_images";
INSERT INTO "product_images" ("id", "productId", "url", "alt", "sortOrder", "color") VALUES
('img_1_1', 'p1', '/banner-chikankari.jpg', 'Ivory Chikankari Kurta', 0, NULL),
('img_1_2', 'p1', '/banner1.jpg', 'Ivory Chikankari Detail', 1, NULL),
('img_2_1', 'p2', '/banner-coord.png', 'Rose Gold Co-ord Set', 0, NULL),
('img_2_2', 'p2', '/banner2.png', 'Rose Gold Detail', 1, NULL),
('img_3_1', 'p3', '/banner-kurti.jpg', 'Floral Kurti', 0, NULL),
('img_3_2', 'p3', '/banner3.png', 'Floral Kurti Detail', 1, NULL),
('img_4_1', 'p4', '/banner-stitched.jpg', 'Designer Anarkali Suit', 0, NULL),
('img_4_2', 'p4', '/banner4.png', 'Anarkali Detail', 1, NULL),
('img_5_1', 'p5', '/banner-unstitched.jpg', 'Georgette Unstitched Material', 0, NULL),
('img_5_2', 'p5', '/banner-dresses.jpg', 'Georgette Fabric', 1, NULL),
('img_6_1', 'p6', '/banner-chikankari.jpg', 'Silk Chikankari Suit', 0, NULL),
('img_6_2', 'p6', '/banner-dresses.jpg', 'Silk Chikankari Detail', 1, NULL),
('img_7_1', 'p7', '/banner-kurti.jpg', 'Festive Kurti Set Front', 0, NULL),
('img_7_2', 'p7', '/banner-stitched.jpg', 'Festive Kurti Set Detail', 1, NULL),
('img_7_3', 'p7', '/banner1.jpg', 'Festive Kurti Set Style', 2, NULL),
('img_8_1', 'p8', '/banner-coord.png', 'Royal Blue Sharara Set', 0, NULL),
('img_8_2', 'p8', '/banner2.png', 'Sharara Detail', 1, NULL);

-- Insert Product Variants
DELETE FROM "product_variants";
INSERT INTO "product_variants" ("id", "productId", "size", "color", "colorHex", "stock", "sku") VALUES
('var_7_1', 'p7', 'L', 'Default', '#F5F5F5', 3, 'HFZ-KRT-002-L-DEF'),
('var_7_2', 'p7', 'XL', 'Default', '#F5F5F5', 2, 'HFZ-KRT-002-XL-DEF'),
('var_7_3', 'p7', 'S', 'Yellow', '#FFD700', 5, 'HFZ-KRT-002-S-YEL'),
('var_7_4', 'p7', 'M', 'Yellow', '#FFD700', 8, 'HFZ-KRT-002-M-YEL'),
('var_1_1', 'p1', 'M', 'Ivory', '#F5F0E8', 5, 'HFZ-CHK-001-M-IVO'),
('var_2_1', 'p2', 'M', 'Rose Gold', '#C4748A', 4, 'HFZ-CRD-001-M-ROS'),
('var_3_1', 'p3', 'S', 'Peach', '#FFCBA4', 10, 'HFZ-KRT-001-S-PEA');


-- Insert Default Admin & Customer Users
INSERT INTO "users" ("id", "name", "email", "phone", "password", "role", "createdAt", "updatedAt") VALUES
('usr_admin', 'Admin User', 'admin@pltcreation.com', '9876543210', '$2b$10$jzmc0yMN5usv6gcLmJHqjOAbXzOxFyBaY324q7ylLUZpvt2LZwkFq', 'ADMIN', NOW(), NOW()),
('usr_customer', 'Jane Doe', 'customer@pltcreation.com', '9876543211', '$2b$10$mKMJn81t8wh5DI..HG2Lyu8b4xQCHufFxoUZFzOUzttd9Zcig8yUu', 'CUSTOMER', NOW(), NOW())
ON CONFLICT ("email") DO UPDATE SET "password" = EXCLUDED."password", "role" = EXCLUDED."role";
