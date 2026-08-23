import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages, conversations, users } from '@/lib/db/schema';
import { getSessionUserId } from '@/lib/auth/session';
import { eq, or, and } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { text } = body;

  if (!text?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 });

  // Verify user is part of this conversation
  const [convo] = await db.select().from(conversations)
    .where(and(
      eq(conversations.id, id),
      or(eq(conversations.userAId, userId), eq(conversations.userBId, userId))
    )).limit(1);

  if (!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [msg] = await db.insert(messages).values({
    conversationId: id,
    senderId: userId,
    body: text.trim(),
  }).returning();

  // Email the other person about the new message
  const otherUserId = convo.userAId === userId ? convo.userBId : convo.userAId;
  const [otherUser] = await db.select({ email: users.email })
    .from(users).where(eq(users.id, otherUserId)).limit(1);
  if (otherUser) {
    await sendEmail(
      otherUser.email,
      'You have a new message on Free Love',
      'You have a new message on Free Love. Open the app to read it.'
    );
  }

  return NextResponse.json({ ok: true, message: msg });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Verify user is part of this conversation
  const [convo] = await db.select().from(conversations)
    .where(and(
      eq(conversations.id, id),
      or(eq(conversations.userAId, userId), eq(conversations.userBId, userId))
    )).limit(1);

  if (!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const msgs = await db.select().from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);

  return NextResponse.json({ messages: msgs });
}
