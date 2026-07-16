import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentMethod } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const {
      userId,
      fullName,
      phone,
      email,
      line1,
      line2,
      city,
      state,
      pincode,
      paymentMethod,
      items,
      subtotal,
      shippingCharge,
      discount,
      total,
      couponCode,
      couponDiscount,
      prepaidDiscount,
    } = await request.json();

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'User ID and items are required' },
        { status: 400 }
      );
    }

    // Map frontend payment method string to Prisma enum PaymentMethod
    let mappedPaymentMethod: PaymentMethod = PaymentMethod.COD;
    if (paymentMethod === 'upi') mappedPaymentMethod = PaymentMethod.UPI;
    else if (paymentMethod === 'card') mappedPaymentMethod = PaymentMethod.CREDIT_CARD;
    else if (paymentMethod === 'netbanking') mappedPaymentMethod = PaymentMethod.NET_BANKING;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create the order using a transaction
    const order = await prisma.$transaction(async (tx: any) => {
      // 1. Create the main Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          paymentMethod: mappedPaymentMethod,
          subtotal,
          shippingCharge,
          discount,
          total,
          couponCode,
          couponDiscount,
          prepaidDiscount,
          shippingName: fullName,
          shippingPhone: phone,
          shippingLine1: line1,
          shippingLine2: line2 || '',
          shippingCity: city,
          shippingState: state,
          shippingPincode: pincode,
        },
      });

      // 2. Create the itemized OrderItems
      for (const item of items) {
        // Find product to get correct sku
        const product = await tx.product.findUnique({
          where: { id: item.product.id },
        });

        if (!product) {
          throw new Error(`Product ${item.product.name} not found`);
        }

        // Deduct variant stock if variant exists
        let variantId = null;
        if (item.variant) {
          variantId = item.variant.id;
          const dbVariant = await tx.productVariant.findUnique({
            where: { id: item.variant.id },
          });

          if (dbVariant) {
            // Only update stock if enough is available
            const newStock = Math.max(0, dbVariant.stock - item.quantity);
            await tx.productVariant.update({
              where: { id: item.variant.id },
              data: { stock: newStock },
            });
          }
        }

        // Create OrderItem record
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.product.id,
            variantId: variantId,
            productName: item.product.name,
            productSku: product.sku,
            size: item.variant?.size || null,
            color: item.variant?.color || null,
            imageUrl: item.product.image || null,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: item.product.price * item.quantity,
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while creating order' },
      { status: 500 }
    );
  }
}
