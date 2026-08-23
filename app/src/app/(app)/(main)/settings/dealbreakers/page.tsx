import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';
import { db } from '@/lib/db';
import { profiles, lifeBasics } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import DealbreakersEditor from './dealbreakers-editor';

const DEALBREAKER_QUESTIONS = ['marriage', 'monogamy', 'kids_have', 'kids_want', 'religion', 'politics', 'drinking', 'smoking', 'drugs', 'lifestyle', 'sexuality'];
const PHYSICAL_QUESTIONS = ['height', 'body_type', 'hair_color', 'ethnicity', 'fitness'];
const PREFERENCE_QUESTIONS = ['height_preference', 'body_type_preference', 'hair_color_preference', 'ethnicity_preference', 'fitness_preference'];

export default async function DealbreakersSettingsPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const [profile] = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, user.id)).limit(1);

  if (!profile) {
    return (
      <div className="screen">
        <StatusBar />
        <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-system)', fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)' }}>MY PREFERENCES</span>
          <BackButton href="/settings" />
        </div>
        <div style={{ padding: '40px 24px' }}>
          <p style={{ fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--gray-quiet)' }}>Complete onboarding first.</p>
        </div>
      </div>
    );
  }

  const allBasics = await db.select().from(lifeBasics).where(eq(lifeBasics.profileId, profile.id));

  const dealbreakers = allBasics.filter(b => DEALBREAKER_QUESTIONS.includes(b.question));
  const physical = allBasics.filter(b => PHYSICAL_QUESTIONS.includes(b.question));
  const preferences = allBasics.filter(b => PREFERENCE_QUESTIONS.includes(b.question));

  return (
    <div className="screen" style={{ padding: '0 0 60px 0' }}>
      <StatusBar />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 14px', borderBottom: '1px solid var(--rule)' }}>
        <span style={{ fontFamily: 'var(--font-system)', fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)' }}>
          MY PREFERENCES
        </span>
        <BackButton href="/settings" />
      </div>

      <div style={{ padding: '0 24px 40px' }}>
        <DealbreakersEditor
          dealbreakers={dealbreakers}
          physical={physical}
          preferences={preferences}
        />
      </div>
    </div>
  );
}
