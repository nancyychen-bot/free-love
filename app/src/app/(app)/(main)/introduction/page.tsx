import { db } from '@/lib/db';
import { profiles, introductions, lifeAnswers, lifeSignals } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq, or, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import IntroductionClient from './introduction-client';

export default async function IntroductionPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  // Get the first pending introduction
  const [intro] = await db
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
    .limit(1);

  if (!intro) redirect('/home');

  const otherUserId = intro.userAId === user.id ? intro.userBId : intro.userAId;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, otherUserId))
    .limit(1);

  if (!profile) redirect('/home');

  const answers = await db
    .select()
    .from(lifeAnswers)
    .where(eq(lifeAnswers.profileId, profile.id));

  const photos = await db
    .select()
    .from(lifeSignals)
    .where(eq(lifeSignals.profileId, profile.id));

  const daysLeft = Math.max(0, Math.ceil((intro.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const introData = {
    introId: intro.id,
    score: intro.score,
    floor: intro.userAId === user.id ? intro.floorA : intro.floorB,
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

  return <IntroductionClient data={introData} />;
}
