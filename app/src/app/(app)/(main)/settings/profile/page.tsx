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
        <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-system)', fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)' }}>MY PROFILE</span>
          <BackButton href="/settings" />
        </div>
        <div style={{ padding: '40px 24px' }}>
          <p style={{ fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--gray-quiet)' }}>Complete onboarding first.</p>
        </div>
      </div>
    );
  }

  const answers = await db.select().from(lifeAnswers).where(eq(lifeAnswers.profileId, profile.id)).orderBy(asc(lifeAnswers.displayOrder));
  const photos = await db.select().from(lifeSignals).where(eq(lifeSignals.profileId, profile.id));
  const qualities = await db.select().from(rankedQualities).where(eq(rankedQualities.profileId, profile.id)).orderBy(asc(rankedQualities.rank));
  const values = await db.select().from(rankedValues).where(eq(rankedValues.profileId, profile.id)).orderBy(asc(rankedValues.rank));

  const profilePhoto = photos.find(p => p.type === 'just me')?.photoUrl ?? photos.find(p => p.photoUrl)?.photoUrl ?? null;
  const otherPhotos = photos.filter(p => p.photoUrl && p.type !== 'just me');
  const bio = answers.find(a => a.prompt === 'about me');
  const otherAnswers = answers.filter(a => a.prompt !== 'about me');

  // Interleave: 1 photo, question, 2 photos, question, 2 photos, question...
  const interleaved: { type: 'photo' | 'photo-pair' | 'answer'; data: unknown }[] = [];
  let photoIdx = 0;
  let answerIdx = 0;

  // First photo
  if (otherPhotos[photoIdx]) {
    interleaved.push({ type: 'photo', data: otherPhotos[photoIdx] });
    photoIdx++;
  }

  // Then alternate: answer, 2 photos, answer, 2 photos...
  while (answerIdx < otherAnswers.length || photoIdx < otherPhotos.length) {
    if (answerIdx < otherAnswers.length) {
      interleaved.push({ type: 'answer', data: otherAnswers[answerIdx] });
      answerIdx++;
    }
    const pair = otherPhotos.slice(photoIdx, photoIdx + 2);
    if (pair.length > 0) {
      interleaved.push({ type: 'photo-pair', data: pair });
      photoIdx += pair.length;
    }
  }

  return (
    <div className="screen" style={{ padding: '0 0 60px 0' }}>
      <StatusBar />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 14px', borderBottom: '1px solid var(--rule)' }}>
        <span style={{ fontFamily: 'var(--font-system)', fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)' }}>MY PROFILE</span>
        <BackButton href="/settings" />
      </div>

      <div style={{ padding: '24px 24px 0' }}>
        {/* Profile header — photo + name/age/location */}
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
            if (item.type === 'photo-pair') {
              const pair = item.data as { photoUrl: string | null; type: string | null; caption: string | null }[];
              return (
                <div key={`pair-${i}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 20 }}>
                  {pair.map((photo, j) => (
                    <div key={j}>
                      {photo.type && (
                        <p style={{ fontFamily: 'var(--font-system)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gray-quiet)', marginBottom: 4 }}>
                          {photo.type}
                        </p>
                      )}
                      <img src={photo.photoUrl!} alt={photo.caption || ''} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  ))}
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
