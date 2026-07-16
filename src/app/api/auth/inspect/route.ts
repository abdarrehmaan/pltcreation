import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const schemas = await prisma.$queryRaw`
      SELECT schema_name FROM information_schema.schemata;
    `;

    const tables = await prisma.$queryRaw`
      SELECT table_schema, table_name FROM information_schema.tables;
    `;

    return NextResponse.json({ schemas, tables });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
