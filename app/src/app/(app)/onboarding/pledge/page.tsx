import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { signPledge } from '../actions';

const pledgeLines = [
  "I'm here for something real — not a hookup, not a distraction, not a game.",
  "My profile is honest. I show up as who I actually am.",
  "When a conversation isn't working, I'll say so, not vanish.",
  "I won't harass, coerce, or send anything unsolicited.",
  "If something feels unsafe, I'll speak up — and breaking this ends my account.",
];

export default function PledgePage() {
  return (
    <div className="screen">
      <StatusBar />

      <div style={{ padding: '40px 24px 100px' }}>
        {/* Step row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            STEP 1 OF 9
          </span>
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
            INTERNAL
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-true)',
            marginTop: 30,
          }}
        >
          THE PLEDGE
        </h1>

        {/* Intro line */}
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 12.5,
            lineHeight: 1.65,
            color: 'var(--gray-quiet)',
            marginTop: 14,
          }}
        >
          Read it, mean it, sign it.
        </p>

        {/* Pledge lines — each as its own paragraph */}
        <div style={{ marginTop: 32 }}>
          {pledgeLines.map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-human)',
                fontSize: 17,
                lineHeight: 1.5,
                color: 'var(--ink-human)',
                marginTop: i === 0 ? 0 : 18,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Sign button */}
        <form action={signPledge} style={{ marginTop: 44 }}>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: 15,
              background: 'var(--ink-true)',
              color: 'var(--paper)',
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            i agree — take me in
          </button>
        </form>
      </div>

      <FooterLink />
    </div>
  );
}
