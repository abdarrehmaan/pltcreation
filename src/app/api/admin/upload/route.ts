import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = file.name.split('.').pop() || 'jpg';
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const localFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const localFilePath = path.join(uploadsDir, localFileName);

    await fs.writeFile(localFilePath, buffer);
    const imageUrl = `/uploads/${localFileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName: file.name,
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
