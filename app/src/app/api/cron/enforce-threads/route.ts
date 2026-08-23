import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, messages } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  // Get all active conversations
  const activeConvos = await db.select().from(conversations).where(eq(conversations.status, 'active'));

  let nudged = 0, closed = 0;

  for (const convo of activeConvos) {
    // Find last message
    const [lastMsg] = await db.select({ createdAt: messages.createdAt })
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
      // For MVP, just count. Email nudge will be added in Task 17.
    }
  }

  return NextResponse.json({ ok: true, nudged, closed });
}
