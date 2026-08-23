import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, messages, userState, users } from '@/lib/db/schema';
import { eq, desc, or, isNull, lt } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';

export async function GET() {
  // Get all active conversations
  const activeConvos = await db.select().from(conversations).where(eq(conversations.status, 'active'));

  let nudged = 0, closed = 0;

  for (const convo of activeConvos) {
    // Find last message
    const [lastMsg] = await db.select({ createdAt: messages.createdAt, senderId: messages.senderId })
      .from(messages).where(eq(messages.conversationId, convo.id))
      .orderBy(desc(messages.createdAt)).limit(1);

    const lastActivity = lastMsg?.createdAt || convo.createdAt;
    const daysSince = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince >= 5) {
      // Auto-close
      await db.update(conversations).set({
        status: 'closed_auto', closedAt: new Date(), closureReason: 'Auto-closed after 5 days without a message.',
      }).where(eq(conversations.id, convo.id));
      closed++;
    } else if (daysSince >= 3) {
      nudged++;

      // Email the person who needs to respond
      const lastSenderId = lastMsg?.senderId;
      const nudgeUserId = lastSenderId
        ? (lastSenderId === convo.userAId ? convo.userBId : convo.userAId)
        : convo.userAId;

      const [nudgeUser] = await db.select({ email: users.email })
        .from(users).where(eq(users.id, nudgeUserId)).limit(1);

      if (nudgeUser) {
        await sendEmail(
          nudgeUser.email,
          'Someone is waiting for your reply on Free Love',
          'Someone is waiting for your reply on Free Love. Open the app to continue the conversation.'
        );
      }
    }
  }

  // Auto-pause: check all active users for 30-day inactivity
  let autoPaused = 0;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const activeUsers = await db.select()
    .from(userState)
    .where(eq(userState.status, 'active'));

  for (const state of activeUsers) {
    if (!state.lastActiveAt || state.lastActiveAt < thirtyDaysAgo) {
      await db.update(userState)
        .set({ status: 'paused_inactive', pausedAt: new Date() })
        .where(eq(userState.userId, state.userId));
      autoPaused++;
    }
  }

  return NextResponse.json({ ok: true, nudged, closed, autoPaused });
}
