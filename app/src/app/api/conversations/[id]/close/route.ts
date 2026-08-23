import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, users } from '@/lib/db/schema';
import { getSessionUserId } from '@/lib/auth/session';
import { eq, and, or } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';

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

  // Email the other person about the closure
  const otherUserId = convo.userAId === userId ? convo.userBId : convo.userAId;
  const [otherUser] = await db.select({ email: users.email })
    .from(users).where(eq(users.id, otherUserId)).limit(1);
  if (otherUser) {
    await sendEmail(
      otherUser.email,
      'A conversation has been closed on Free Love',
      'A conversation has been closed on Free Love. Open the app to see your goodbye note.'
    );
  }

  return NextResponse.json({ ok: true });
}
