import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';
import Link from 'next/link';
import { db } from '@/lib/db';
import { profiles, lifeBasics } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

const DEALBREAKER_QUESTIONS = ['marriage', 'monogamy', 'kids_have', 'kids_want', 'religion', 'politics', 'drinking', 'smoking', 'drugs', 'lifestyle', 'sexuality'];
const PHYSICAL_QUESTIONS = ['height', 'body_type', 'hair_color', 'ethnicity', 'fitness'];
const PREFERENCE_QUESTIONS = ['height_preference', 'body_type_preference', 'hair_color_preference', 'ethnicity_preference', 'fitness_preference'];

function formatLabel(q: string): string {
  return q
    .replace(/_preference$/, ' preference')
    .replace(/_/g, ' ')
    .replace('kids have', 'do you have kids')
    .replace('kids want', 'do you want kids');
}

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

      <div style={{ padding: '0 24px' }}>
        {/* Dealbreakers */}
        {dealbreakers.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <p style={{ fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)', marginBottom: 8 }}>
              DEALBREAKERS
            </p>
            {dealbreakers.map(d => (
              <div key={d.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--rule)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-system)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-quiet)' }}>
                    {formatLabel(d.question)}
                  </span>
                  {d.isDealbreaker && (
                    <span style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: '#8B0000' }}>dealbreaker</span>
                  )}
                </div>
                <p style={{ fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--ink-true)', marginTop: 4 }}>
                  {d.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Physical — about you */}
        {physical.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <p style={{ fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)', marginBottom: 8 }}>
              ABOUT YOU
            </p>
            {physical.map(d => (
              <div key={d.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--rule)' }}>
                <span style={{ fontFamily: 'var(--font-system)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-quiet)' }}>
                  {formatLabel(d.question)}
                </span>
                <p style={{ fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--ink-true)', marginTop: 4 }}>
                  {d.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Physical preferences */}
        {preferences.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <p style={{ fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)', marginBottom: 8 }}>
              YOUR PREFERENCES
            </p>
            {preferences.map(d => (
              <div key={d.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--rule)' }}>
                <span style={{ fontFamily: 'var(--font-system)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-quiet)' }}>
                  {formatLabel(d.question)}
                </span>
                <p style={{ fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--ink-true)', marginTop: 4 }}>
                  {d.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Redo buttons */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontFamily: 'var(--font-system)', fontSize: 12, lineHeight: 1.7, color: 'var(--gray-quiet)', marginBottom: 16 }}>
            Want to change something? Redo the relevant step.
          </p>
          <Link href="/onboarding/partnership" style={{
            display: 'block', width: '100%', padding: 13, textAlign: 'center',
            border: '1px solid var(--ink-true)', background: 'transparent',
            fontFamily: 'var(--font-system)', fontSize: 13.5, color: 'var(--ink-true)',
            textDecoration: 'none', marginBottom: 8,
          }}>
            redo partnership
          </Link>
          <Link href="/onboarding/beliefs" style={{
            display: 'block', width: '100%', padding: 13, textAlign: 'center',
            border: '1px solid var(--ink-true)', background: 'transparent',
            fontFamily: 'var(--font-system)', fontSize: 13.5, color: 'var(--ink-true)',
            textDecoration: 'none', marginBottom: 8,
          }}>
            redo beliefs
          </Link>
          <Link href="/onboarding/lifestyle" style={{
            display: 'block', width: '100%', padding: 13, textAlign: 'center',
            border: '1px solid var(--ink-true)', background: 'transparent',
            fontFamily: 'var(--font-system)', fontSize: 13.5, color: 'var(--ink-true)',
            textDecoration: 'none', marginBottom: 8,
          }}>
            redo lifestyle
          </Link>
          <Link href="/onboarding/physical" style={{
            display: 'block', width: '100%', padding: 13, textAlign: 'center',
            border: '1px solid var(--ink-true)', background: 'transparent',
            fontFamily: 'var(--font-system)', fontSize: 13.5, color: 'var(--ink-true)',
            textDecoration: 'none',
          }}>
            redo physical preferences
          </Link>
        </div>
      </div>
    </div>
  );
}
