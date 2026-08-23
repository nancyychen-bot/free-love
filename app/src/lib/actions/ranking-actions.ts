'use server';

import { db } from '@/lib/db';
import { profiles, rankedQualities, rankedValues } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateQualities(iAm: string[], iWant: string[]) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  const [profile] = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (!profile) throw new Error('No profile');

  await db.delete(rankedQualities).where(eq(rankedQualities.profileId, profile.id));
  const rows = [
    ...iAm.map((q, i) => ({ profileId: profile.id, quality: `self:${q}`, rank: i + 1 })),
    ...iWant.map((q, i) => ({ profileId: profile.id, quality: `want:${q}`, rank: i + 1 })),
  ];
  if (rows.length > 0) await db.insert(rankedQualities).values(rows);
  revalidatePath('/settings/qualities');
}

export async function updateValues(ranked: string[]) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  const [profile] = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (!profile) throw new Error('No profile');

  await db.delete(rankedValues).where(eq(rankedValues.profileId, profile.id));
  if (ranked.length > 0) {
    await db.insert(rankedValues).values(ranked.map((v, i) => ({ profileId: profile.id, value: v, rank: i + 1 })));
  }
  revalidatePath('/settings/qualities');
}
