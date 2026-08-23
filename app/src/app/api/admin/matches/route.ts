import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, profiles, introductions, lifeAnswers, lifeSignals, rankedQualities, rankedValues, lifeBasics } from '@/lib/db/schema';
import { getSessionUserId } from '@/lib/auth/session';
import { eq, desc, asc } from 'drizzle-orm';

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const [user] = await db.select({ isAdmin: users.isAdmin }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  // Get recent introductions with full profile data
  const intros = await db.select().from(introductions).orderBy(desc(introductions.createdAt)).limit(50);

  const matches = await Promise.all(intros.map(async (intro) => {
    const profileA = await getFullProfile(intro.userAId);
    const profileB = await getFullProfile(intro.userBId);

    return {
      id: intro.id,
      score: intro.score,
      explanation: intro.explanation,
      status: intro.status,
      source: intro.source,
      createdAt: intro.createdAt,
      userA: profileA,
      userB: profileB,
    };
  }));

  return NextResponse.json({ matches });
}

async function getFullProfile(userId: string) {
  const [u] = await db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  if (!profile) return { userId, email: u?.email, name: 'Unknown', profile: null };

  const answers = await db.select().from(lifeAnswers).where(eq(lifeAnswers.profileId, profile.id)).orderBy(asc(lifeAnswers.displayOrder));
  const photos = await db.select().from(lifeSignals).where(eq(lifeSignals.profileId, profile.id));
  const qualities = await db.select().from(rankedQualities).where(eq(rankedQualities.profileId, profile.id)).orderBy(asc(rankedQualities.rank));
  const values = await db.select().from(rankedValues).where(eq(rankedValues.profileId, profile.id)).orderBy(asc(rankedValues.rank));
  const basics = await db.select().from(lifeBasics).where(eq(lifeBasics.profileId, profile.id));

  return {
    userId,
    email: u?.email,
    name: profile.displayName,
    age: profile.age,
    gender: profile.gender,
    location: profile.locationName,
    photo: photos.find(p => p.type === 'just me')?.photoUrl || photos[0]?.photoUrl || null,
    bio: answers.find(a => a.prompt === 'about me')?.answer || null,
    lifeAnswers: answers.filter(a => a.prompt !== 'about me').map(a => ({ prompt: a.prompt, answer: a.answer })),
    qualities: {
      iAm: qualities.filter(q => q.quality.startsWith('self:')).map(q => q.quality.replace('self:', '')),
      iWant: qualities.filter(q => q.quality.startsWith('want:')).map(q => q.quality.replace('want:', '')),
    },
    values: values.map(v => v.value),
    dealbreakers: basics.filter(b => b.isDealbreaker).map(b => ({ question: b.question, answer: b.answer })),
    allAnswers: basics.map(b => ({ question: b.question, answer: b.answer, isDealbreaker: b.isDealbreaker })),
  };
}
