import Link from 'next/link';
import StatusBar from '@/app/components/StatusBar';
import Wordmark from '@/app/components/Wordmark';
import FooterLink from '@/app/components/FooterLink';

export default function IntroPage() {
  return (
    <div className="screen">
      <StatusBar />

      <div style={{ padding: '48px 24px 100px' }}>
        {/* Wordmark */}
        <Wordmark size={18} />

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-human)',
            fontWeight: 300,
            fontSize: 26,
            lineHeight: 1.35,
            color: 'var(--ink-human)',
            marginTop: 36,
          }}
        >
          A few questions. Answer them honestly.
        </h1>

        {/* Body */}
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 12.5,
            lineHeight: 1.75,
            color: 'var(--gray-quiet)',
            marginTop: 24,
          }}
        >
          This takes about ten minutes. Everything you share is used to find
          you someone genuinely compatible — not to fill a deck.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 12.5,
            lineHeight: 1.75,
            color: 'var(--gray-quiet)',
            marginTop: 14,
          }}
        >
          The more honest you are, the better your matches will be. The more
          dealbreakers you add, the smaller your pool becomes. That&rsquo;s by
          design.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 12.5,
            lineHeight: 1.75,
            color: 'var(--gray-quiet)',
            marginTop: 14,
          }}
        >
          Nothing here is public unless we tell you it is.
        </p>

        {/* Button */}
        <Link
          href="/onboarding/identity"
          style={{
            display: 'block',
            width: '100%',
            padding: 15,
            marginTop: 40,
            background: 'var(--ink-true)',
            color: 'var(--paper)',
            fontFamily: 'var(--font-system)',
            fontSize: 13.5,
            fontWeight: 500,
            border: 'none',
            textAlign: 'center',
            textDecoration: 'none',
          }}
        >
          let&rsquo;s go
        </Link>
      </div>

      <FooterLink />
    </div>
  );
}
