import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, goodbyeNotes } from '@/lib/db/schema';
import { getSessionUserId } from '@/lib/auth/session';
import { eq, and, or } from 'drizzle-orm';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { body } = await request.json();
  if (!body?.trim()) return NextResponse.json({ error: 'Note required' }, { status: 400 });

  // Verify this is a closed conversation and the user is the one who was closed ON (not the closer)
  const [convo] = await db.select().from(conversations)
    .where(and(eq(conversations.id, id), or(eq(conversations.userAId, userId), eq(conversations.userBId, userId))))
    .limit(1);
  if (!convo || convo.status !== 'closed_by_user') return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (convo.closedBy === userId) return NextResponse.json({ error: 'You closed this conversation' }, { status: 400 });

  await db.insert(goodbyeNotes).values({ conversationId: id, senderId: userId, body: body.trim() });
  return NextResponse.json({ ok: true });
}
