import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { introductions, introductionActions } from '@/lib/db/schema';
import { getSessionUserId } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { action } = body;

  if (!['open', 'pass', 'save'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  await db.insert(introductionActions).values({
    introductionId: id,
    userId,
    action,
  });

  if (action === 'pass') {
    await db.update(introductions)
      .set({ status: 'passed' })
      .where(eq(introductions.id, id));
  } else if (action === 'save') {
    await db.update(introductions)
      .set({ status: 'saved' })
      .where(eq(introductions.id, id));
  }

  return NextResponse.json({ ok: true });
}
