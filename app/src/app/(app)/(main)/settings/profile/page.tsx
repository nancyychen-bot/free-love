import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';
import { db } from '@/lib/db';
import { profiles, lifeAnswers, lifeSignals, rankedQualities, rankedValues } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq, asc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import ProfileEditor from './profile-editor';

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
  const qualitiesRows = await db.select().from(rankedQualities).where(eq(rankedQualities.profileId, profile.id)).orderBy(asc(rankedQualities.rank));
  const valuesRows = await db.select().from(rankedValues).where(eq(rankedValues.profileId, profile.id)).orderBy(asc(rankedValues.rank));

  const profilePhoto = photos.find(p => p.type === 'just me')?.photoUrl ?? photos.find(p => p.photoUrl)?.photoUrl ?? null;
  const otherPhotos = photos.filter(p => p.photoUrl && p.type !== 'just me');
  const bio = answers.find(a => a.prompt === 'about me');
  const otherAnswers = answers.filter(a => a.prompt !== 'about me');

  // Interleave: photo, answer, photo, answer... (one-to-one alternating)
  const interleaved: { type: 'photo' | 'answer'; id: string; theme?: string; url?: string; prompt?: string; answer?: string }[] = [];
  let photoIdx = 0;
  let answerIdx = 0;

  while (photoIdx < otherPhotos.length || answerIdx < otherAnswers.length) {
    if (photoIdx < otherPhotos.length) {
      const p = otherPhotos[photoIdx];
      interleaved.push({
        type: 'photo',
        id: p.id,
        theme: p.type ?? undefined,
        url: p.photoUrl ?? undefined,
      });
      photoIdx++;
    }
    if (answerIdx < otherAnswers.length) {
      const a = otherAnswers[answerIdx];
      interleaved.push({
        type: 'answer',
        id: a.id,
        prompt: a.prompt,
        answer: a.answer,
      });
      answerIdx++;
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

      <ProfileEditor
        displayName={profile.displayName}
        age={profile.age}
        locationName={profile.locationName}
        profilePhoto={profilePhoto}
        bio={bio?.answer ?? null}
        bioId={bio?.id ?? null}
        interleaved={interleaved}
        qualities={qualitiesRows.map(q => ({ quality: q.quality, rank: q.rank }))}
        values={valuesRows.map(v => ({ value: v.value, rank: v.rank }))}
      />
    </div>
  );
}
