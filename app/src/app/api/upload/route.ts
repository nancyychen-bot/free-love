import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth/session';

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const theme = formData.get('theme') as string;

  if (!file || !theme) {
    return NextResponse.json({ error: 'File and theme required' }, { status: 400 });
  }

  // Upload to Vercel Blob
  const blob = await put(`photos/${userId}/${theme}-${Date.now()}`, file, {
    access: 'public',
  });

  return NextResponse.json({ url: blob.url });
}
