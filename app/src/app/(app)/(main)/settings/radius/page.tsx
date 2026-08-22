import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function RadiusPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db
    .select({
      radiusMiles: profiles.radiusMiles,
      locationName: profiles.locationName,
    })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

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
          RADIUS
        </span>
        <BackButton href="/settings" />
      </div>

      <div style={{ padding: '28px 24px 0' }}>
        {profile ? (
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
              CURRENT RADIUS
            </span>
            <p
              style={{
                fontFamily: 'var(--font-system)',
                fontSize: 22,
                fontWeight: 500,
                color: 'var(--ink-true)',
                marginTop: 12,
              }}
            >
              {profile.radiusMiles} miles
            </p>
            {profile.locationName && (
              <p
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 12,
                  color: 'var(--gray-quiet)',
                  marginTop: 6,
                  lineHeight: 1.5,
                }}
              >
                from {profile.locationName}
              </p>
            )}
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
            No location set yet.
          </p>
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
