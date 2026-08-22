import { db } from '@/lib/db';
import { users, profiles, introductions, conversations, messages, lifeAnswers, lifeSignals } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq, or, and, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import StatusBar from '@/app/components/StatusBar';
import Link from 'next/link';
import HomeClient from './home-client';

export default async function HomePage() {
  const user = await getUser();
  if (!user) redirect('/login');

  // Get pending introductions for this user
  const intros = await db
    .select()
    .from(introductions)
    .where(
      and(
        or(
          eq(introductions.userAId, user.id),
          eq(introductions.userBId, user.id)
        ),
        eq(introductions.status, 'pending')
      )
    )
    .limit(3);

  // For each intro, get the other person's profile + photos + life answers
  const introData = await Promise.all(
    intros.map(async (intro) => {
      const otherUserId = intro.userAId === user.id ? intro.userBId : intro.userAId;

      const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, otherUserId))
        .limit(1);

      if (!profile) return null;

      const answers = await db
        .select()
        .from(lifeAnswers)
        .where(eq(lifeAnswers.profileId, profile.id));

      const photos = await db
        .select()
        .from(lifeSignals)
        .where(eq(lifeSignals.profileId, profile.id));

      const daysLeft = Math.max(0, Math.ceil((intro.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

      return {
        introId: intro.id,
        score: intro.score,
        floorA: intro.floorA,
        explanation: intro.explanation,
        expiresIn: `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
        profile: {
          displayName: profile.displayName,
          age: profile.age,
          locationName: profile.locationName,
        },
        lifeAnswers: answers.map(a => ({ prompt: a.prompt, answer: a.answer })),
        photos: photos.map(p => ({ theme: p.type || '', url: p.photoUrl || '' })),
      };
    })
  );

  const validIntros = introData.filter(Boolean);

  // Get active conversations
  const convos = await db
    .select()
    .from(conversations)
    .where(
      and(
        or(
          eq(conversations.userAId, user.id),
          eq(conversations.userBId, user.id)
        ),
        eq(conversations.status, 'active')
      )
    );

  const convoData = await Promise.all(
    convos.map(async (convo) => {
      const otherUserId = convo.userAId === user.id ? convo.userBId : convo.userAId;

      const [profile] = await db
        .select({ displayName: profiles.displayName })
        .from(profiles)
        .where(eq(profiles.userId, otherUserId))
        .limit(1);

      const [lastMsg] = await db
        .select({ body: messages.body, createdAt: messages.createdAt })
        .from(messages)
        .where(eq(messages.conversationId, convo.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      return {
        id: convo.id,
        name: profile?.displayName || 'Someone',
        lastMessage: lastMsg?.body || 'No messages yet',
        createdAt: convo.createdAt,
      };
    })
  );

  return (
    <div className="screen" style={{ padding: '0 0 40px 0' }}>
      <StatusBar />

      <HomeClient
        introductions={validIntros}
        conversations={convoData}
        openConvoCount={convos.length}
      />

      {/* Footer navigation */}
      <div style={{ padding: '40px 24px 0', borderTop: '1px solid var(--rule)' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <Link href="/conversations" style={{
            fontFamily: 'var(--font-system)', fontSize: 12.5, color: 'var(--ink-true)',
          }}>
            conversations{convoData.length > 0 ? ` (${convoData.length})` : ''}
          </Link>
          <Link href="/how-this-works" style={{
            fontFamily: 'var(--font-system)', fontSize: 12.5, color: 'var(--gray-quiet)',
          }}>
            how this works
          </Link>
          <Link href="/manifesto" style={{
            fontFamily: 'var(--font-system)', fontSize: 12.5, color: 'var(--gray-quiet)',
          }}>
            the manifesto
          </Link>
        </div>
      </div>
    </div>
  );
}
