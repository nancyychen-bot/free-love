'use server';

import { db } from '@/lib/db';
import { exits } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';

export async function recordExit(foundSomeone: boolean, story?: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  await db.insert(exits).values({
    userId: user.id,
    foundSomeone,
    story: story || null,
  });
}
