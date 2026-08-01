import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { PaymentStatus, OrderStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'plt_webhook_secret_2026';

    if (!webhookSecret) {
      console.error('[Razorpay Webhook Error]: RAZORPAY_WEBHOOK_SECRET is missing in environment variables');
      return NextResponse.json(
        { error: 'RAZORPAY_WEBHOOK_SECRET environment variable is not configured' },
        { status: 500 }
      );
    }

    // 1. Extract raw body text and signature header for HMAC verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('[Razorpay Webhook Error]: Missing x-razorpay-signature header');
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
    }

    // 2. Validate HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('[Razorpay Webhook Error]: Invalid signature mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 3. Parse JSON payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`[Razorpay Webhook Event Received]: ${event}`);

    // Handle payment.captured or order.paid events
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;

      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        // Find existing order in DB by razorpayOrderId
        const existingOrder = await prisma.order.findFirst({
          where: { razorpayOrderId },
        });

        if (existingOrder) {
          await prisma.order.update({
            where: { id: existingOrder.id },
            data: {
              paymentStatus: PaymentStatus.PAID,
              razorpayPaymentId: razorpayPaymentId || existingOrder.razorpayPaymentId,
              status: existingOrder.status === OrderStatus.PENDING ? OrderStatus.CONFIRMED : existingOrder.status,
            },
          });
          console.log(`[Razorpay Webhook Success]: Order ${existingOrder.orderNumber} updated to PAID.`);
        } else {
          console.warn(`[Razorpay Webhook Warning]: Order with Razorpay Order ID ${razorpayOrderId} not found in database.`);
        }
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error: any) {
    console.error('[Razorpay Webhook Exception]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
