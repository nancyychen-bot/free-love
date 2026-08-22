import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';
import { db } from '@/lib/db';
import { profiles, lifeAnswers, lifeSignals, rankedQualities, rankedValues } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq, asc } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const user = await getUser();
  if (!user) redirect('/login');

  const { userId } = await params;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!profile) notFound();

  const answers = await db.select().from(lifeAnswers).where(eq(lifeAnswers.profileId, profile.id)).orderBy(asc(lifeAnswers.displayOrder));
  const photos = await db.select().from(lifeSignals).where(eq(lifeSignals.profileId, profile.id));
  const qualities = await db.select().from(rankedQualities).where(eq(rankedQualities.profileId, profile.id)).orderBy(asc(rankedQualities.rank));
  const values = await db.select().from(rankedValues).where(eq(rankedValues.profileId, profile.id)).orderBy(asc(rankedValues.rank));

  const profilePhoto = photos.find(p => p.type === 'just me')?.photoUrl ?? photos.find(p => p.photoUrl)?.photoUrl ?? null;
  const otherPhotos = photos.filter(p => p.photoUrl && p.type !== 'just me');
  const bio = answers.find(a => a.prompt === 'about me');
  const otherAnswers = answers.filter(a => a.prompt !== 'about me');

  // Interleave: photo, answer, photo, answer... (one-to-one alternating)
  const interleaved: { type: 'photo' | 'answer'; data: unknown }[] = [];
  let photoIdx = 0;
  let answerIdx = 0;

  while (photoIdx < otherPhotos.length || answerIdx < otherAnswers.length) {
    if (photoIdx < otherPhotos.length) {
      interleaved.push({ type: 'photo', data: otherPhotos[photoIdx] });
      photoIdx++;
    }
    if (answerIdx < otherAnswers.length) {
      interleaved.push({ type: 'answer', data: otherAnswers[answerIdx] });
      answerIdx++;
    }
  }

  return (
    <div className="screen" style={{ padding: '0 0 60px 0' }}>
      <StatusBar />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 14px', borderBottom: '1px solid var(--rule)' }}>
        <span style={{ fontFamily: 'var(--font-system)', fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)' }}>PROFILE</span>
        <BackButton />
      </div>

      <div style={{ padding: '24px 24px 0' }}>
        {/* Profile header -- photo + name/age/location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {profilePhoto ? (
            <div className="avatar-circle" style={{ width: 72, height: 72, minWidth: 72, overflow: 'hidden' }}>
              <img src={profilePhoto} alt={profile.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }} />
            </div>
          ) : (
            <div className="avatar-circle" style={{ width: 72, height: 72, minWidth: 72, border: '1px dashed var(--gray-quiet)' }} />
          )}
          <div>
            <p style={{ fontFamily: 'var(--font-system)', fontSize: 14, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-true)' }}>
              {profile.displayName}, {profile.age}
            </p>
            {profile.locationName && (
              <p style={{ fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--gray-quiet)', marginTop: 4 }}>
                {profile.locationName}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <div style={{ marginTop: 24 }}>
            <p style={{ fontFamily: 'var(--font-human)', fontSize: 17, lineHeight: 1.55, color: 'var(--ink-human)' }}>
              {bio.answer}
            </p>
          </div>
        )}

        {/* Interleaved photos and answers */}
        <div style={{ marginTop: 24 }}>
          {interleaved.map((item, i) => {
            if (item.type === 'photo') {
              const photo = item.data as { photoUrl: string | null; type: string | null; caption: string | null };
              return (
                <div key={`photo-${i}`} style={{ marginTop: i === 0 ? 0 : 20 }}>
                  {photo.type && (
                    <p style={{ fontFamily: 'var(--font-system)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)', marginBottom: 6 }}>
                      {photo.type}
                    </p>
                  )}
                  <img src={photo.photoUrl!} alt={photo.caption || ''} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              );
            }
            if (item.type === 'answer') {
              const answer = item.data as { prompt: string; answer: string };
              return (
                <div key={`answer-${i}`} style={{ marginTop: 24 }}>
                  <p style={{ fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)' }}>
                    {answer.prompt}
                  </p>
                  <p style={{ fontFamily: 'var(--font-human)', fontSize: 17, lineHeight: 1.55, color: 'var(--ink-human)', marginTop: 8 }}>
                    {answer.answer}
                  </p>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Qualities + Values as chips */}
        {(qualities.length > 0 || values.length > 0) && (
          <div style={{ marginTop: 28 }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--rule)' }} />

            {qualities.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)', marginBottom: 10 }}>
                  QUALITIES I VALUE
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {qualities.map(q => (
                    <span key={q.quality} style={{
                      fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--ink-true)',
                      border: '1px solid var(--rule)', padding: '8px 12px', lineHeight: 1,
                    }}>
                      {q.quality}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {values.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)', marginBottom: 10 }}>
                  WHAT MATTERS TO ME
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {values.map(v => (
                    <span key={v.value} style={{
                      fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--ink-true)',
                      border: '1px solid var(--rule)', padding: '8px 12px', lineHeight: 1,
                    }}>
                      {v.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
