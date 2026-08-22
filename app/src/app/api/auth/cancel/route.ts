import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, profiles, lifeBasics, rankedQualities, rankedValues, lifeAnswers, lifeSignals, introductions, introductionActions, conversations, messages, goodbyeNotes, userState, exits, blockedPairs } from '@/lib/db/schema';
import { getSessionUserId } from '@/lib/auth/session';
import { destroySession } from '@/lib/auth/session';
import { eq, or } from 'drizzle-orm';

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get profile ID
  const [profile] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (profile) {
    await db.delete(lifeSignals).where(eq(lifeSignals.profileId, profile.id));
    await db.delete(lifeAnswers).where(eq(lifeAnswers.profileId, profile.id));
    await db.delete(rankedQualities).where(eq(rankedQualities.profileId, profile.id));
    await db.delete(rankedValues).where(eq(rankedValues.profileId, profile.id));
    await db.delete(lifeBasics).where(eq(lifeBasics.profileId, profile.id));
    await db.delete(profiles).where(eq(profiles.id, profile.id));
  }

  // Delete conversation data
  const userConvos = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(or(eq(conversations.userAId, userId), eq(conversations.userBId, userId)));

  for (const convo of userConvos) {
    await db.delete(goodbyeNotes).where(eq(goodbyeNotes.conversationId, convo.id));
    await db.delete(messages).where(eq(messages.conversationId, convo.id));
  }
  await db.delete(conversations).where(or(eq(conversations.userAId, userId), eq(conversations.userBId, userId)));

  // Delete introduction data
  const userIntros = await db
    .select({ id: introductions.id })
    .from(introductions)
    .where(or(eq(introductions.userAId, userId), eq(introductions.userBId, userId)));

  for (const intro of userIntros) {
    await db.delete(introductionActions).where(eq(introductionActions.introductionId, intro.id));
  }
  await db.delete(introductions).where(or(eq(introductions.userAId, userId), eq(introductions.userBId, userId)));

  // Delete user state and account
  await db.delete(exits).where(eq(exits.userId, userId));
  await db.delete(blockedPairs).where(or(eq(blockedPairs.blockerId, userId), eq(blockedPairs.blockedId, userId)));
  await db.delete(userState).where(eq(userState.userId, userId));
  await db.delete(users).where(eq(users.id, userId));

  await destroySession();

  return NextResponse.json({ ok: true });
}
