'use server';

import { db } from '@/lib/db';
import { profiles, lifeAnswers, lifeSignals } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateDisplayName(name: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  await db.update(profiles).set({ displayName: name, updatedAt: new Date() }).where(eq(profiles.userId, user.id));
  revalidatePath('/settings/profile');
}

export async function updateBio(bio: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  const [profile] = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (!profile) throw new Error('No profile');

  const allAnswers = await db.select().from(lifeAnswers).where(eq(lifeAnswers.profileId, profile.id));
  const existingBio = allAnswers.find(a => a.prompt === 'about me');

  if (existingBio) {
    await db.update(lifeAnswers).set({ answer: bio }).where(eq(lifeAnswers.id, existingBio.id));
  } else {
    await db.insert(lifeAnswers).values({ profileId: profile.id, prompt: 'about me', answer: bio, displayOrder: 0 });
  }
  revalidatePath('/settings/profile');
}

export async function updateLifeAnswer(answerId: string, newAnswer: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  await db.update(lifeAnswers).set({ answer: newAnswer }).where(eq(lifeAnswers.id, answerId));
  revalidatePath('/settings/profile');
}

export async function deleteLifeAnswer(answerId: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  await db.delete(lifeAnswers).where(eq(lifeAnswers.id, answerId));
  revalidatePath('/settings/profile');
}

export async function deletePhoto(photoId: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  await db.delete(lifeSignals).where(eq(lifeSignals.id, photoId));
  revalidatePath('/settings/profile');
}

export async function updateRadius(radiusMiles: number) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  await db.update(profiles).set({ radiusMiles, updatedAt: new Date() }).where(eq(profiles.userId, user.id));
  revalidatePath('/settings/radius');
}
