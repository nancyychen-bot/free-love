import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';
import { db } from '@/lib/db';
import { profiles, lifeAnswers, lifeSignals, rankedQualities, rankedValues } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq, asc } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (!profile) {
    return (
      <div className="screen">
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
            MY PROFILE
          </span>
          <BackButton href="/settings" />
        </div>
        <div style={{ padding: '40px 24px' }}>
          <p
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 13,
              color: 'var(--gray-quiet)',
              lineHeight: 1.6,
            }}
          >
            No profile found. Complete onboarding first.
          </p>
        </div>
      </div>
    );
  }

  const answers = await db
    .select()
    .from(lifeAnswers)
    .where(eq(lifeAnswers.profileId, profile.id))
    .orderBy(asc(lifeAnswers.displayOrder));

  const photos = await db
    .select()
    .from(lifeSignals)
    .where(eq(lifeSignals.profileId, profile.id));

  const qualities = await db
    .select()
    .from(rankedQualities)
    .where(eq(rankedQualities.profileId, profile.id))
    .orderBy(asc(rankedQualities.rank));

  const values = await db
    .select()
    .from(rankedValues)
    .where(eq(rankedValues.profileId, profile.id))
    .orderBy(asc(rankedValues.rank));

  const firstPhoto = photos.find((p) => p.photoUrl)?.photoUrl ?? null;
  const bio = answers.find((a) => a.prompt === 'about me');
  const otherAnswers = answers.filter((a) => a.prompt !== 'about me');

  return (
    <div className="screen" style={{ padding: '0 0 60px 0' }}>
      <StatusBar />

      {/* Header */}
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
          MY PROFILE
        </span>
        <BackButton href="/settings" />
      </div>

      <div style={{ padding: '28px 24px 0' }}>
        {/* Profile photo */}
        <div style={{ marginBottom: 20 }}>
          {firstPhoto ? (
            <div
              className="avatar-circle"
              style={{
                width: 80,
                height: 80,
                overflow: 'hidden',
              }}
            >
              <img
                src={firstPhoto}
                alt={profile.displayName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '9999px',
                }}
              />
            </div>
          ) : (
            <div
              className="avatar-circle"
              style={{
                width: 80,
                height: 80,
                border: '1px dashed var(--gray-quiet)',
              }}
            />
          )}
        </div>

        {/* Name + Age */}
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink-true)',
          }}
        >
          {profile.displayName} &middot; {profile.age}
        </p>

        {/* Location */}
        {profile.locationName && (
          <p
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 11,
              color: 'var(--gray-quiet)',
              marginTop: 4,
            }}
          >
            {profile.locationName}
          </p>
        )}

        {/* Bio */}
        {bio && (
          <div style={{ marginTop: 24 }}>
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
              ABOUT ME
            </span>
            <p
              style={{
                fontFamily: 'var(--font-human)',
                fontSize: 17,
                lineHeight: 1.55,
                color: 'var(--ink-human)',
                marginTop: 8,
              }}
            >
              {bio.answer}
            </p>
          </div>
        )}

        {/* Other life answers */}
        {otherAnswers.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--rule)' }} />
            {otherAnswers.map((a) => (
              <div key={a.id} style={{ marginTop: 20 }}>
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
                  {a.prompt}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-human)',
                    fontSize: 17,
                    lineHeight: 1.55,
                    color: 'var(--ink-human)',
                    marginTop: 8,
                  }}
                >
                  {a.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Photos */}
        {photos.filter((p) => p.photoUrl).length > 0 && (
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
              PHOTOS
            </span>
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {photos
                .filter((p) => p.photoUrl)
                .map((p) => (
                  <div key={p.id} style={{ aspectRatio: '1', overflow: 'hidden' }}>
                    <img
                      src={p.photoUrl!}
                      alt={p.caption || ''}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {p.caption && (
                      <p
                        style={{
                          fontFamily: 'var(--font-system)',
                          fontSize: 10,
                          color: 'var(--gray-quiet)',
                          marginTop: 4,
                        }}
                      >
                        {p.caption}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Qualities */}
        {qualities.length > 0 && (
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
              QUALITIES
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
              VALUES
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
      </div>
    </div>
  );
}
