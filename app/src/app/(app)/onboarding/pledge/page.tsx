import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { signPledge } from '../actions';

export default function PledgePage() {
  return (
    <div className="screen">
      <StatusBar />

      <div style={{ padding: '40px 24px 0' }}>
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
            STEP 2 OF 9
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

        {/* Pledge text */}
        <p
          style={{
            fontFamily: 'var(--font-human)',
            fontSize: 18.5,
            lineHeight: 1.62,
            color: 'var(--ink-human)',
            marginTop: 30,
          }}
        >
          I am who I say I am, and my profile accurately represents who I am.
          I will engage with respect and honesty. I will not harass, coerce,
          or send unsolicited explicit content. When I&rsquo;m done with a
          conversation, I&rsquo;ll say so — not vanish. I&rsquo;ll report
          unsafe behavior and trust it will be taken seriously. I understand
          violations end my account, permanently.
        </p>

        {/* Footer button */}
        <form action={signPledge} style={{ marginTop: 40, paddingBottom: 80 }}>
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
            i agree
          </button>
        </form>
      </div>

      <FooterLink />
    </div>
  );
}
