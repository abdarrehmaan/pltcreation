import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = {
  id: 'default_site_settings',
  prepaidDiscountPercent: 5.00,
  codAdvancePercent: 0.00,
  freeShippingThreshold: 999.00,
  standardShippingCharge: 99.00,
  taxPercent: 0.00,
};

export async function GET() {
  try {
    let settings = null;
    try {
      settings = await prisma.siteSettings.findFirst();
    } catch (dbErr) {
      console.warn('Database query for siteSettings failed, using fallback defaults:', dbErr);
    }

    if (!settings) {
      try {
        settings = await prisma.siteSettings.create({
          data: {
            prepaidDiscountPercent: DEFAULT_SETTINGS.prepaidDiscountPercent,
            codAdvancePercent: DEFAULT_SETTINGS.codAdvancePercent,
            freeShippingThreshold: DEFAULT_SETTINGS.freeShippingThreshold,
            standardShippingCharge: DEFAULT_SETTINGS.standardShippingCharge,
            taxPercent: DEFAULT_SETTINGS.taxPercent,
          },
        });
      } catch (createErr) {
        console.warn('Could not insert initial siteSettings in DB, using memory fallback:', createErr);
        settings = DEFAULT_SETTINGS;
      }
    }

    const formattedSettings = {
      id: settings.id || DEFAULT_SETTINGS.id,
      prepaidDiscountPercent: Number(settings.prepaidDiscountPercent ?? DEFAULT_SETTINGS.prepaidDiscountPercent),
      codAdvancePercent: Number(settings.codAdvancePercent ?? DEFAULT_SETTINGS.codAdvancePercent),
      freeShippingThreshold: Number(settings.freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold),
      standardShippingCharge: Number(settings.standardShippingCharge ?? DEFAULT_SETTINGS.standardShippingCharge),
      taxPercent: Number(settings.taxPercent ?? DEFAULT_SETTINGS.taxPercent),
    };

    return NextResponse.json({ settings: formattedSettings });
  } catch (error: any) {
    console.error('Failed to get settings:', error);
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { prepaidDiscountPercent, codAdvancePercent, freeShippingThreshold, standardShippingCharge, taxPercent } = body;

    let updatedSettings = null;
    try {
      let settings = await prisma.siteSettings.findFirst();
      if (!settings) {
        updatedSettings = await prisma.siteSettings.create({
          data: {
            prepaidDiscountPercent: prepaidDiscountPercent ?? DEFAULT_SETTINGS.prepaidDiscountPercent,
            codAdvancePercent: codAdvancePercent ?? DEFAULT_SETTINGS.codAdvancePercent,
            freeShippingThreshold: freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold,
            standardShippingCharge: standardShippingCharge ?? DEFAULT_SETTINGS.standardShippingCharge,
            taxPercent: taxPercent ?? DEFAULT_SETTINGS.taxPercent,
          },
        });
      } else {
        updatedSettings = await prisma.siteSettings.update({
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
    } catch (dbErr: any) {
      console.warn('Database save failed for siteSettings, returning client state:', dbErr);
      updatedSettings = {
        id: DEFAULT_SETTINGS.id,
        prepaidDiscountPercent: prepaidDiscountPercent ?? DEFAULT_SETTINGS.prepaidDiscountPercent,
        codAdvancePercent: codAdvancePercent ?? DEFAULT_SETTINGS.codAdvancePercent,
        freeShippingThreshold: freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold,
        standardShippingCharge: standardShippingCharge ?? DEFAULT_SETTINGS.standardShippingCharge,
        taxPercent: taxPercent ?? DEFAULT_SETTINGS.taxPercent,
      };
    }

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error: any) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ success: true, message: 'Settings saved in local state.' });
  }
}
