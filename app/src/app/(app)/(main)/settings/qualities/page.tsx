import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';
import { db } from '@/lib/db';
import { profiles, rankedQualities, rankedValues } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq, asc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import QualitiesEditor from './qualities-editor';

export default async function QualitiesPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (!profile) redirect('/settings');

  const qualities = await db
    .select({ quality: rankedQualities.quality, rank: rankedQualities.rank })
    .from(rankedQualities)
    .where(eq(rankedQualities.profileId, profile.id))
    .orderBy(asc(rankedQualities.rank));

  const values = await db
    .select({ value: rankedValues.value, rank: rankedValues.rank })
    .from(rankedValues)
    .where(eq(rankedValues.profileId, profile.id))
    .orderBy(asc(rankedValues.rank));

  // Parse self: and want: prefixed qualities into separate arrays
  const iAm = qualities
    .filter(q => q.quality.startsWith('self:'))
    .map(q => q.quality.replace('self:', ''));

  const iWant = qualities
    .filter(q => q.quality.startsWith('want:'))
    .map(q => q.quality.replace('want:', ''));

  const rankedValuesList = values.map(v => v.value);

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

      <div style={{ padding: '0 24px 40px' }}>
        <QualitiesEditor
          initialIAm={iAm}
          initialIWant={iWant}
          initialValues={rankedValuesList}
        />
      </div>
    </div>
  );
}
