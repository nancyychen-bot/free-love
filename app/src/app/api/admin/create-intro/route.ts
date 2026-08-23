import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { introductions, users } from '@/lib/db/schema';
import { getSessionUserId } from '@/lib/auth/session';
import { eq, or, and } from 'drizzle-orm';

export async function POST(request: Request) {
  const adminId = await getSessionUserId();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const [admin] = await db.select({ isAdmin: users.isAdmin }).from(users).where(eq(users.id, adminId)).limit(1);
  if (!admin?.isAdmin) return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const { userAId, userBId } = await request.json();
  if (!userAId || !userBId || userAId === userBId) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  // Check no existing intro
  const existing = await db.select({ id: introductions.id }).from(introductions)
    .where(or(
      and(eq(introductions.userAId, userAId), eq(introductions.userBId, userBId)),
      and(eq(introductions.userAId, userBId), eq(introductions.userBId, userAId))
    )).limit(1);
  if (existing.length > 0) return NextResponse.json({ error: 'Already introduced' }, { status: 409 });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 5);
  await db.insert(introductions).values({
    userAId, userBId, score: '0.00', floorA: '0.00', floorB: '0.00',
    explanation: 'Manually introduced by admin.', source: 'admin', status: 'pending', expiresAt,
  });

  return NextResponse.json({ ok: true });
}
