import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { sanitizeImageUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const formattedOrders = orders.map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.shippingName || o.user?.name || 'Guest',
      phone: o.shippingPhone || '',
      itemsCount: o.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      itemsList: o.items.map((item: any) => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        imageUrl: sanitizeImageUrl(item.imageUrl || item.product?.images?.[0]?.url || item.product?.image),
      })),
      amount: Number(o.total),
      payment: o.paymentMethod,
      codAdvanceAmount: Number(o.codAdvanceAmount || 0),
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error: any) {
    console.error('Failed to fetch admin orders:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Map status string to OrderStatus enum
    let nextStatus: OrderStatus;
    const cleanStatus = status.toUpperCase();

    if (cleanStatus === 'CONFIRM') {
      nextStatus = OrderStatus.CONFIRMED;
    } else if (cleanStatus === 'SHIP') {
      nextStatus = OrderStatus.SHIPPED;
    } else if (cleanStatus === 'DELIVER') {
      nextStatus = OrderStatus.DELIVERED;
    } else if (cleanStatus === 'CANCEL') {
      nextStatus = OrderStatus.CANCELLED;
    } else {
      nextStatus = cleanStatus as OrderStatus;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: nextStatus,
        paymentStatus: nextStatus === OrderStatus.DELIVERED ? PaymentStatus.PAID : undefined,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Failed to update order status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingLine1,
      shippingCity,
      shippingState,
      shippingPincode,
      totalAmount,
      paymentMethod = 'UPI',
      razorpayOrderId,
      razorpayPaymentId,
      codAdvanceAmount,
      productName = 'Women Apparel',
      quantity = 1,
    } = body;

    if (!customerName || !customerPhone || !totalAmount) {
      return NextResponse.json(
        { error: 'Customer Name, Phone, and Total Amount are required.' },
        { status: 400 }
      );
    }

    const email = customerEmail || `customer_${customerPhone.replace(/\D/g, '')}@pltcreation.com`;
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone: customerPhone }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: customerName,
          email,
          phone: customerPhone,
          role: 'CUSTOMER',
        },
      });
    }

    const defaultProduct = await prisma.product.findFirst();
    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const total = Number(totalAmount);
    const taxAmount = Math.round(((total - 0) * 0.05 / 1.05) * 100) / 100;

    let mappedPaymentMethod: PaymentMethod = PaymentMethod.UPI;
    if (paymentMethod === 'COD' || paymentMethod === 'cod') mappedPaymentMethod = PaymentMethod.COD;
    else if (paymentMethod === 'CREDIT_CARD' || paymentMethod === 'card') mappedPaymentMethod = PaymentMethod.CREDIT_CARD;
    else if (paymentMethod === 'NET_BANKING' || paymentMethod === 'netbanking') mappedPaymentMethod = PaymentMethod.NET_BANKING;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        paymentMethod: mappedPaymentMethod,
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.CONFIRMED,
        razorpayOrderId: razorpayOrderId || null,
        razorpayPaymentId: razorpayPaymentId || null,
        codAdvanceAmount: codAdvanceAmount ? Number(codAdvanceAmount) : null,
        subtotal: total,
        shippingCharge: 0,
        discount: 0,
        tax: taxAmount,
        total: total,
        shippingName: customerName,
        shippingPhone: customerPhone,
        shippingLine1: shippingLine1 || 'Main Street',
        shippingCity: shippingCity || 'Prayagraj',
        shippingState: shippingState || 'Uttar Pradesh',
        shippingPincode: shippingPincode || '211001',
        items: {
          create: [
            {
              productId: defaultProduct?.id || '',
              productName: productName,
              productSku: defaultProduct?.sku || 'SKU-MANUAL',
              quantity: Number(quantity),
              unitPrice: total / Number(quantity),
              totalPrice: total,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create manual order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
