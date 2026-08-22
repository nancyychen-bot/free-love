import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';

export default function BillingPaused() {
  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {/* Content */}
      <div style={{ flex: 1, padding: '0 24px' }}>
        {/* Headline — 200px top padding (even more whitespace than drought) */}
        <h1
          style={{
            paddingTop: 200,
            fontFamily: 'var(--font-system)',
            fontSize: 15,
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: '0.16em',
            textTransform: 'uppercase' as const,
            color: 'var(--ink-true)',
          }}
        >
          BILLING PAUSED
        </h1>

        {/* First line */}
        <p
          style={{
            marginTop: 26,
            fontFamily: 'var(--font-system)',
            fontSize: 13.5,
            lineHeight: 1.75,
            color: 'var(--ink-true)',
            maxWidth: '46ch',
          }}
        >
          21 days without an introduction. We&rsquo;ve stopped charging you.
        </p>

        {/* Second line */}
        <p
          style={{
            marginTop: 26,
            fontFamily: 'var(--font-system)',
            fontSize: 13.5,
            lineHeight: 1.75,
            color: 'var(--ink-true)',
            maxWidth: '46ch',
          }}
        >
          It restarts the day we have someone for you. Nothing for you to do.
        </p>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', height: 56 }}>
        <FooterLink />
      </div>
    </div>
  );
}
