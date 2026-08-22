import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';
import { db } from '@/lib/db';
import { profiles, rankedQualities, rankedValues } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq, asc } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function QualitiesPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  let qualities: { quality: string; rank: number }[] = [];
  let values: { value: string; rank: number }[] = [];

  if (profile) {
    qualities = await db
      .select({ quality: rankedQualities.quality, rank: rankedQualities.rank })
      .from(rankedQualities)
      .where(eq(rankedQualities.profileId, profile.id))
      .orderBy(asc(rankedQualities.rank));

    values = await db
      .select({ value: rankedValues.value, rank: rankedValues.rank })
      .from(rankedValues)
      .where(eq(rankedValues.profileId, profile.id))
      .orderBy(asc(rankedValues.rank));
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
          QUALITIES AND VALUES
        </span>
        <BackButton href="/settings" />
      </div>

      <div style={{ padding: '28px 24px 0' }}>
        {/* Qualities */}
        {qualities.length > 0 ? (
          <div>
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
              QUALITIES I VALUE IN A PARTNER
            </span>
            <div style={{ marginTop: 12 }}>
              {qualities.map((q) => (
                <div
                  key={q.quality}
                  style={{
                    fontFamily: 'var(--font-system)',
                    fontSize: 13,
                    color: 'var(--ink-true)',
                    padding: '6px 0',
                    lineHeight: 1.5,
                  }}
                >
                  {q.rank}. {q.quality}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 13,
              color: 'var(--gray-quiet)',
              lineHeight: 1.6,
            }}
          >
            No qualities ranked yet.
          </p>
        )}

        {/* Values */}
        {values.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', marginBottom: 16 }} />
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
              MY VALUES
            </span>
            <div style={{ marginTop: 12 }}>
              {values.map((v) => (
                <div
                  key={v.value}
                  style={{
                    fontFamily: 'var(--font-system)',
                    fontSize: 13,
                    color: 'var(--ink-true)',
                    padding: '6px 0',
                    lineHeight: 1.5,
                  }}
                >
                  {v.rank}. {v.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editing note */}
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11,
            color: 'var(--gray-quiet)',
            marginTop: 32,
            lineHeight: 1.6,
          }}
        >
          editing coming soon
        </p>
      </div>
    </div>
  );
}
