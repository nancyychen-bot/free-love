import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { introductions, introductionActions, conversations, users } from '@/lib/db/schema';
import { getSessionUserId } from '@/lib/auth/session';
import { eq, and, or } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { action } = body;

  if (!['open', 'pass', 'save'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  await db.insert(introductionActions).values({ introductionId: id, userId, action });

  if (action === 'pass') {
    await db.update(introductions).set({ status: 'passed' }).where(eq(introductions.id, id));
  } else if (action === 'save') {
    await db.update(introductions).set({ status: 'saved' }).where(eq(introductions.id, id));
  } else if (action === 'open') {
    const [intro] = await db.select().from(introductions).where(eq(introductions.id, id)).limit(1);
    if (!intro) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const otherUserId = intro.userAId === userId ? intro.userBId : intro.userAId;
    const otherOpened = await db.select().from(introductionActions)
      .where(and(eq(introductionActions.introductionId, id), eq(introductionActions.userId, otherUserId), eq(introductionActions.action, 'open')))
      .limit(1);

    if (otherOpened.length > 0) {
      // Both opened — check conversation caps before creating
      const userActiveConvos = await db.select({ id: conversations.id }).from(conversations)
        .where(and(
          or(eq(conversations.userAId, userId), eq(conversations.userBId, userId)),
          eq(conversations.status, 'active')
        ));
      if (userActiveConvos.length >= 3) {
        return NextResponse.json({
          ok: true, capped: true,
          message: 'You have 3 active conversations. Close one to open a new one.',
        });
      }

      const otherActiveConvos = await db.select({ id: conversations.id }).from(conversations)
        .where(and(
          or(eq(conversations.userAId, otherUserId), eq(conversations.userBId, otherUserId)),
          eq(conversations.status, 'active')
        ));
      if (otherActiveConvos.length >= 3) {
        return NextResponse.json({
          ok: true, capped: true,
          message: 'The other person has 3 active conversations right now. Try again later.',
        });
      }

      // Create conversation
      const existingConvo = await db.select({ id: conversations.id }).from(conversations)
        .where(eq(conversations.introductionId, id)).limit(1);

      if (existingConvo.length === 0) {
        await db.update(introductions).set({ status: 'opened' }).where(eq(introductions.id, id));
        await db.insert(conversations).values({
          introductionId: id,
          userAId: intro.userAId,
          userBId: intro.userBId,
          status: 'active',
        });

        // Email both users about the new conversation
        const [userA] = await db.select({ email: users.email }).from(users).where(eq(users.id, intro.userAId)).limit(1);
        const [userB] = await db.select({ email: users.email }).from(users).where(eq(users.id, intro.userBId)).limit(1);
        const subject = 'You have a new conversation on Free Love';
        const text = 'You have a new conversation on Free Love. Open the app to start talking.';
        if (userA) await sendEmail(userA.email, subject, text);
        if (userB) await sendEmail(userB.email, subject, text);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
