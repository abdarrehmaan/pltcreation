import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Light query to generate activity on Supabase Postgres database
    const categoryCount = await prisma.category.count();
    
    return NextResponse.json(
      { 
        status: 'ok', 
        message: 'Supabase keepalive ping successful', 
        categoryCount,
        timestamp: new Date().toISOString() 
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
