'use server';

import { db } from '@/lib/db';
import { userState } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function pauseAccount() {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  await db.update(userState).set({ status: 'paused_user', pausedAt: new Date() }).where(eq(userState.userId, user.id));
  revalidatePath('/settings');
  revalidatePath('/home');
}

export async function resumeAccount() {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  await db.update(userState).set({ status: 'active', pausedAt: null, lastActiveAt: new Date() }).where(eq(userState.userId, user.id));
  revalidatePath('/settings');
  revalidatePath('/home');
}
