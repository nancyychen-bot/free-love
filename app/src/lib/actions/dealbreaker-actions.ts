'use server';

import { db } from '@/lib/db';
import { lifeBasics } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateDealbreaker(id: string, answer: string, isDealbreaker: boolean) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  await db.update(lifeBasics).set({ answer, isDealbreaker }).where(eq(lifeBasics.id, id));
  revalidatePath('/settings/dealbreakers');
}

export async function toggleDealbreaker(id: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  const [row] = await db.select().from(lifeBasics).where(eq(lifeBasics.id, id)).limit(1);
  if (!row) throw new Error('Not found');
  await db.update(lifeBasics).set({ isDealbreaker: !row.isDealbreaker }).where(eq(lifeBasics.id, id));
  revalidatePath('/settings/dealbreakers');
}
