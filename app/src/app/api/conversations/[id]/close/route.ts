import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations } from '@/lib/db/schema';
import { getSessionUserId } from '@/lib/auth/session';
import { eq, and, or } from 'drizzle-orm';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { reason } = await request.json();

  const [convo] = await db.select().from(conversations)
    .where(and(eq(conversations.id, id), or(eq(conversations.userAId, userId), eq(conversations.userBId, userId))))
    .limit(1);
  if (!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.update(conversations).set({
    status: 'closed_by_user', closedBy: userId, closureReason: reason || null, closedAt: new Date(),
  }).where(eq(conversations.id, id));

  return NextResponse.json({ ok: true });
}
