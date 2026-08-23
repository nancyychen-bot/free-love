import { NextResponse } from 'next/server';
import { runMatchingPipeline } from '@/lib/matching/pipeline';
import { getSessionUserId } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const [user] = await db.select({ isAdmin: users.isAdmin }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  const matchCount = await runMatchingPipeline();
  return NextResponse.json({ ok: true, matchCount });
}

export async function GET() {
  const matchCount = await runMatchingPipeline();
  return NextResponse.json({ ok: true, matchCount });
}
