import { db } from '@/lib/db';
import { profiles, introductions, conversations, messages, lifeAnswers, lifeSignals } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq, or, and, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import HomeClient from './home-client';

export default async function HomePage() {
  const user = await getUser();
  if (!user) redirect('/login');

  // Get the user's profile
  const [myProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  // Get pending introductions
  const intros = await db
    .select()
    .from(introductions)
    .where(
      and(
        or(
          eq(introductions.userAId, user.id),
          eq(introductions.userBId, user.id)
        ),
        eq(introductions.status, 'pending')
      )
    )
    .limit(3);

  // Get each intro's profile data
  const introData = await Promise.all(
    intros.map(async (intro) => {
      const otherUserId = intro.userAId === user.id ? intro.userBId : intro.userAId;

      const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, otherUserId))
        .limit(1);

      if (!profile) return null;

      const answers = await db
        .select()
        .from(lifeAnswers)
        .where(eq(lifeAnswers.profileId, profile.id));

      const photos = await db
        .select()
        .from(lifeSignals)
        .where(eq(lifeSignals.profileId, profile.id));

      const daysLeft = Math.max(0, Math.ceil((intro.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

      return {
        introId: intro.id,
        score: intro.score,
        floorA: intro.userAId === user.id ? intro.floorA : intro.floorB,
        explanation: intro.explanation,
        expiresIn: `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
        profile: {
          displayName: profile.displayName,
          age: profile.age,
          locationName: profile.locationName,
        },
        lifeAnswers: answers.map(a => ({ prompt: a.prompt, answer: a.answer })),
        photos: photos.map(p => ({ theme: p.type || '', url: p.photoUrl || '' })),
      };
    })
  );

  // Get active conversations
  const convos = await db
    .select()
    .from(conversations)
    .where(
      and(
        or(eq(conversations.userAId, user.id), eq(conversations.userBId, user.id)),
        eq(conversations.status, 'active')
      )
    );

  const convoData = await Promise.all(
    convos.map(async (convo) => {
      const otherUserId = convo.userAId === user.id ? convo.userBId : convo.userAId;
      const [profile] = await db
        .select({ displayName: profiles.displayName })
        .from(profiles)
        .where(eq(profiles.userId, otherUserId))
        .limit(1);

      const [lastMsg] = await db
        .select({ body: messages.body })
        .from(messages)
        .where(eq(messages.conversationId, convo.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      return {
        id: convo.id,
        name: profile?.displayName || 'Someone',
        lastMessage: lastMsg?.body || 'Start the conversation...',
      };
    })
  );

  return (
    <HomeClient
      userName={myProfile?.displayName || 'there'}
      introductions={introData.filter(Boolean)}
      conversations={convoData}
    />
  );
}
