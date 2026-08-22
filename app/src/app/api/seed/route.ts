import { NextResponse } from 'next/server';
import { ensureSeedProfile } from '@/lib/seed-profiles';
import { db } from '@/lib/db';
import { introductions, users, profiles } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetEmail = body.email;

    const seedUserId = await ensureSeedProfile();

    if (targetEmail) {
      const [targetUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, targetEmail))
        .limit(1);

      if (targetUser) {
        const existing = await db
          .select({ id: introductions.id })
          .from(introductions)
          .where(
            or(
              and(eq(introductions.userAId, targetUser.id), eq(introductions.userBId, seedUserId)),
              and(eq(introductions.userAId, seedUserId), eq(introductions.userBId, targetUser.id))
            )
          )
          .limit(1);

        if (existing.length === 0) {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 5);

          await db.insert(introductions).values({
            userAId: targetUser.id,
            userBId: seedUserId,
            score: '0.81',
            floorA: '0.74',
            floorB: '0.74',
            explanation: 'You both ranked warmth and humor highest. Neither of you flagged a dealbreaker the other holds. Her answer about what a good day looks like and yours both describe small, quiet moments over grand gestures.',
            source: 'engine',
            status: 'pending',
            expiresAt,
          });
        }
      }
    }

    return NextResponse.json({ ok: true, seedUserId });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
