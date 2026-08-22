'use server';

import { db } from '@/lib/db';
import { users, profiles, lifeBasics, rankedQualities, rankedValues, lifeAnswers, lifeSignals } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { and, eq, inArray } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function signPledge() {
  const user = await getUser();
  if (!user) redirect('/login');

  await db.update(users)
    .set({ pledgeSignedAt: new Date(), onboardingStep: 2 })
    .where(eq(users.id, user.id));

  redirect('/onboarding/identity');
}

export async function saveIdentity(formData: FormData) {
  const user = await getUser();
  if (!user) redirect('/login');

  const displayName = formData.get('displayName') as string;
  const age = parseInt(formData.get('age') as string);
  const gender = formData.get('gender') as string;
  const orientation = formData.get('orientation') as string;
  const seeking = formData.getAll('seeking') as string[];
  const locationName = formData.get('locationName') as string;

  // Check if profile exists
  const existing = await db.select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (existing.length > 0) {
    await db.update(profiles)
      .set({ displayName, age, gender, orientation, seeking, locationName, updatedAt: new Date() })
      .where(eq(profiles.userId, user.id));
  } else {
    await db.insert(profiles).values({
      userId: user.id,
      displayName,
      age,
      gender,
      orientation,
      seeking,
      locationName,
    });
  }

  await db.update(users)
    .set({ onboardingStep: 3 })
    .where(eq(users.id, user.id));

  redirect('/onboarding/partnership');
}

export async function saveDealbreaker(formData: FormData) {
  const user = await getUser();
  if (!user) redirect('/login');

  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;
  const isDealbreaker = formData.get('isDealbreaker') === 'true';

  const [profile] = await db.select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (!profile) redirect('/onboarding/identity');

  await db.insert(lifeBasics).values({
    profileId: profile.id,
    question,
    answer,
    isDealbreaker,
  });
}

const PARTNERSHIP_KEYS = ['marriage', 'monogamy', 'kids_have', 'kids_want'];
const BELIEFS_KEYS = ['religion', 'politics'];
const LIFESTYLE_KEYS = ['drinking', 'smoking', 'drugs', 'lifestyle'];

export async function savePartnership(
  data: { question: string; answer: string; isDealbreaker: boolean }[]
) {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db.select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (!profile) redirect('/onboarding/identity');

  await db.delete(lifeBasics).where(
    and(
      eq(lifeBasics.profileId, profile.id),
      inArray(lifeBasics.question, PARTNERSHIP_KEYS)
    )
  );

  if (data.length > 0) {
    await db.insert(lifeBasics).values(
      data.map(d => ({
        profileId: profile.id,
        question: d.question,
        answer: d.answer,
        isDealbreaker: d.isDealbreaker,
      }))
    );
  }

  await db.update(users)
    .set({ onboardingStep: 4 })
    .where(eq(users.id, user.id));

  redirect('/onboarding/beliefs');
}

export async function saveBeliefs(
  data: { question: string; answer: string; isDealbreaker: boolean }[]
) {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db.select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (!profile) redirect('/onboarding/identity');

  await db.delete(lifeBasics).where(
    and(
      eq(lifeBasics.profileId, profile.id),
      inArray(lifeBasics.question, BELIEFS_KEYS)
    )
  );

  if (data.length > 0) {
    await db.insert(lifeBasics).values(
      data.map(d => ({
        profileId: profile.id,
        question: d.question,
        answer: d.answer,
        isDealbreaker: d.isDealbreaker,
      }))
    );
  }

  await db.update(users)
    .set({ onboardingStep: 5 })
    .where(eq(users.id, user.id));

  redirect('/onboarding/lifestyle');
}

export async function saveLifestyle(
  data: { question: string; answer: string; isDealbreaker: boolean }[]
) {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db.select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (!profile) redirect('/onboarding/identity');

  await db.delete(lifeBasics).where(
    and(
      eq(lifeBasics.profileId, profile.id),
      inArray(lifeBasics.question, LIFESTYLE_KEYS)
    )
  );

  if (data.length > 0) {
    await db.insert(lifeBasics).values(
      data.map(d => ({
        profileId: profile.id,
        question: d.question,
        answer: d.answer,
        isDealbreaker: d.isDealbreaker,
      }))
    );
  }

  await db.update(users)
    .set({ onboardingStep: 6 })
    .where(eq(users.id, user.id));

  redirect('/onboarding/qualities');
}

export async function saveQualities(ranked: string[]) {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db.select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (!profile) redirect('/onboarding/identity');

  await db.delete(rankedQualities).where(eq(rankedQualities.profileId, profile.id));

  await db.insert(rankedQualities).values(
    ranked.map((quality, index) => ({
      profileId: profile.id,
      quality,
      rank: index + 1,
    }))
  );

  await db.update(users)
    .set({ onboardingStep: 7 })
    .where(eq(users.id, user.id));

  redirect('/onboarding/values');
}

export async function saveValues(ranked: string[]) {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db.select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (!profile) redirect('/onboarding/identity');

  await db.delete(rankedValues).where(eq(rankedValues.profileId, profile.id));

  await db.insert(rankedValues).values(
    ranked.map((value, index) => ({
      profileId: profile.id,
      value,
      rank: index + 1,
    }))
  );

  await db.update(users)
    .set({ onboardingStep: 8 })
    .where(eq(users.id, user.id));

  redirect('/onboarding/life-answers');
}

export async function saveLifeAnswers(answers: { prompt: string; answer: string; displayOrder: number }[]) {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db.select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (!profile) redirect('/onboarding/identity');

  await db.delete(lifeAnswers).where(eq(lifeAnswers.profileId, profile.id));

  await db.insert(lifeAnswers).values(
    answers.map(a => ({
      profileId: profile.id,
      prompt: a.prompt,
      answer: a.answer,
      displayOrder: a.displayOrder,
    }))
  );

  await db.update(users)
    .set({ onboardingStep: 9 })
    .where(eq(users.id, user.id));

  redirect('/onboarding/photos');
}

export async function completeOnboarding() {
  const user = await getUser();
  if (!user) redirect('/login');

  await db.update(users)
    .set({ onboardingComplete: true, onboardingStep: 10 })
    .where(eq(users.id, user.id));

  redirect('/drought');
}

export async function savePhotos(photos: { theme: string; url: string }[]) {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db.select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (!profile) redirect('/onboarding/identity');

  // Delete existing life_signals photos for this profile
  await db.delete(lifeSignals).where(eq(lifeSignals.profileId, profile.id));

  // Insert new ones
  if (photos.length > 0) {
    await db.insert(lifeSignals).values(
      photos.map(p => ({
        profileId: profile.id,
        type: p.theme,
        photoUrl: p.url,
        caption: p.theme,
      }))
    );
  }

  // Mark onboarding complete
  await db.update(users)
    .set({ onboardingComplete: true, onboardingStep: 10 })
    .where(eq(users.id, user.id));

  redirect('/drought');
}
