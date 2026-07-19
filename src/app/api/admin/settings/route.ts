import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          prepaidDiscountPercent: 5.00,
          codAdvancePercent: 0.00,
          freeShippingThreshold: 999.00,
          standardShippingCharge: 99.00,
          taxPercent: 0.00,
        },
      });
    }

    const formattedSettings = {
      id: settings.id,
      prepaidDiscountPercent: Number(settings.prepaidDiscountPercent),
      codAdvancePercent: Number(settings.codAdvancePercent),
      freeShippingThreshold: Number(settings.freeShippingThreshold),
      standardShippingCharge: Number(settings.standardShippingCharge),
      taxPercent: Number(settings.taxPercent),
    };

    return NextResponse.json({ settings: formattedSettings });
  } catch (error: any) {
    console.error('Failed to get settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { prepaidDiscountPercent, codAdvancePercent, freeShippingThreshold, standardShippingCharge, taxPercent } = body;

    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          prepaidDiscountPercent: prepaidDiscountPercent ?? 5.00,
          codAdvancePercent: codAdvancePercent ?? 0.00,
          freeShippingThreshold: freeShippingThreshold ?? 999.00,
          standardShippingCharge: standardShippingCharge ?? 99.00,
          taxPercent: taxPercent ?? 0.00,
        },
      });
    } else {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          prepaidDiscountPercent: prepaidDiscountPercent !== undefined ? prepaidDiscountPercent : settings.prepaidDiscountPercent,
          codAdvancePercent: codAdvancePercent !== undefined ? codAdvancePercent : settings.codAdvancePercent,
          freeShippingThreshold: freeShippingThreshold !== undefined ? freeShippingThreshold : settings.freeShippingThreshold,
          standardShippingCharge: standardShippingCharge !== undefined ? standardShippingCharge : settings.standardShippingCharge,
          taxPercent: taxPercent !== undefined ? taxPercent : settings.taxPercent,
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
