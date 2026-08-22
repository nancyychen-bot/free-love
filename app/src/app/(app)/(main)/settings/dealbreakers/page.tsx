import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';
import { db } from '@/lib/db';
import { profiles, lifeBasics } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function DealbreakersPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  let basics: { id: string; question: string; answer: string; isDealbreaker: boolean }[] = [];

  if (profile) {
    basics = await db
      .select({
        id: lifeBasics.id,
        question: lifeBasics.question,
        answer: lifeBasics.answer,
        isDealbreaker: lifeBasics.isDealbreaker,
      })
      .from(lifeBasics)
      .where(eq(lifeBasics.profileId, profile.id));
  }

  return (
    <div className="screen" style={{ padding: '0 0 60px 0' }}>
      <StatusBar />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px 14px',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-true)',
          }}
        >
          DEALBREAKERS
        </span>
        <BackButton href="/settings" />
      </div>

      <div style={{ padding: '28px 24px 0' }}>
        {basics.length > 0 ? (
          basics.map((b) => (
            <div
              key={b.id}
              style={{
                paddingBottom: 20,
                marginBottom: 20,
                borderBottom: '1px solid var(--rule)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--gray-quiet)',
                }}
              >
                {b.question}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 13,
                  color: 'var(--ink-true)',
                  marginTop: 8,
                  lineHeight: 1.5,
                }}
              >
                {b.answer}
              </p>
              {b.isDealbreaker && (
                <span
                  style={{
                    fontFamily: 'var(--font-system)',
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--gray-quiet)',
                    marginTop: 6,
                    display: 'inline-block',
                  }}
                >
                  dealbreaker
                </span>
              )}
            </div>
          ))
        ) : (
          <p
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 13,
              color: 'var(--gray-quiet)',
              lineHeight: 1.6,
            }}
          >
            No dealbreaker answers yet.
          </p>
        )}

        {/* Editing note */}
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11,
            color: 'var(--gray-quiet)',
            marginTop: 12,
            lineHeight: 1.6,
          }}
        >
          editing coming soon
        </p>
      </div>
    </div>
  );
}
