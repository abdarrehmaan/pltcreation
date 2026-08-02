import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, phone: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ addresses: [] });
    }

    // 1. Fetch current addresses saved in Address table
    let addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // 2. Query past orders by userId or matching phone number
    const orderConditions: any[] = [{ userId: user.id }];
    if (user.phone && user.phone.trim().length > 0) {
      orderConditions.push({ shippingPhone: user.phone.trim() });
    }

    try {
      const pastOrders = await prisma.order.findMany({
        where: {
          OR: orderConditions,
          shippingLine1: { not: null },
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          shippingName: true,
          shippingPhone: true,
          shippingLine1: true,
          shippingLine2: true,
          shippingCity: true,
          shippingState: true,
          shippingPincode: true,
        },
      });

      // 3. Import any past order shipping address not yet in Address table
      for (const order of pastOrders) {
        if (!order.shippingLine1 || !order.shippingCity || !order.shippingPincode) continue;

        const line1Clean = order.shippingLine1.trim();
        const pincodeClean = order.shippingPincode.trim();

        const exists = addresses.some(
          (a) => a.line1.toLowerCase().trim() === line1Clean.toLowerCase() && a.pincode.trim() === pincodeClean
        );

        if (!exists) {
          const newAddr = await prisma.address.create({
            data: {
              userId: user.id,
              fullName: order.shippingName?.trim() || user.name || 'Valued Customer',
              phone: order.shippingPhone?.trim() || user.phone || '',
              line1: line1Clean,
              line2: order.shippingLine2?.trim() || null,
              city: order.shippingCity.trim(),
              state: order.shippingState?.trim() || 'Uttar Pradesh',
              pincode: pincodeClean,
              isDefault: addresses.length === 0,
            },
          });
          addresses.push(newAddr);
        }
      }
    } catch (syncErr) {
      console.error('Failed to sync past order addresses:', syncErr);
    }

    return NextResponse.json({ addresses });
  } catch (error: any) {
    console.error('Fetch addresses error:', error);
    return NextResponse.json({ addresses: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, fullName, phone, line1, line2, city, state, pincode, isDefault } = body;

    if (!userId || !fullName || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'userId, fullName, phone, line1, city, state, and pincode are required' },
        { status: 400 }
      );
    }

    // If setting as default, unmark other default addresses for this user
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    // Check if user has any existing addresses; if none, make this default
    const count = await prisma.address.count({ where: { userId } });
    const shouldBeDefault = isDefault || count === 0;

    const address = await prisma.address.create({
      data: {
        userId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        line1: line1.trim(),
        line2: line2?.trim() || null,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        isDefault: shouldBeDefault,
      },
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error: any) {
    console.error('Create address error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create address' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, userId, fullName, phone, line1, line2, city, state, pincode, isDefault } = body;

    if (!id || !userId) {
      return NextResponse.json({ error: 'Address ID and User ID are required' }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        fullName: fullName?.trim(),
        phone: phone?.trim(),
        line1: line1?.trim(),
        line2: line2?.trim() || null,
        city: city?.trim(),
        state: state?.trim(),
        pincode: pincode?.trim(),
        isDefault: isDefault ?? undefined,
      },
    });

    return NextResponse.json({ address });
  } catch (error: any) {
    console.error('Update address error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete address error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete address' }, { status: 500 });
  }
}
