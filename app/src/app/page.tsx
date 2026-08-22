'use client';

import Link from 'next/link';
import StatusBar from '@/app/components/StatusBar';
import FaceIllustration from '@/app/components/FaceIllustration';
import Wordmark from '@/app/components/Wordmark';

export default function SignIn() {
  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {/* Main content */}
      <div style={{ flex: 1, padding: '0 24px' }}>
        {/* Illustration */}
        <div style={{ paddingTop: 74 }}>
          <FaceIllustration />
        </div>

        {/* Wordmark */}
        <div style={{ marginTop: 38 }}>
          <Wordmark size={21} />
        </div>

        {/* Statement */}
        <p
          className="type-sign-in-statement"
          style={{ marginTop: 30, maxWidth: '28ch' }}
        >
          Like being introduced by a friend who actually knows you.
        </p>

        {/* Commitment line */}
        <p
          style={{
            marginTop: 26,
            fontFamily: 'var(--font-system)',
            fontSize: 12.5,
            lineHeight: 1.7,
            color: 'var(--gray-quiet)',
          }}
        >
          Non-profit. Open source. Operated at cost.
        </p>
      </div>

      {/* Footer pinned to bottom */}
      <div style={{ padding: '0 24px 22px' }}>
        {/* Primary button */}
        <Link
          href="/signup"
          style={{
            display: 'block',
            width: '100%',
            padding: 15,
            background: 'var(--ink-true)',
            color: 'var(--paper)',
            fontFamily: 'var(--font-system)',
            fontSize: 13.5,
            textAlign: 'center',
            transition: 'background 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--introduction)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--ink-true)';
          }}
        >
          start the nine questions
        </Link>

        {/* Secondary button */}
        <Link
          href="/login"
          style={{
            display: 'block',
            width: '100%',
            padding: 15,
            marginTop: 8,
            background: 'transparent',
            border: '1px solid var(--ink-true)',
            color: 'var(--ink-true)',
            fontFamily: 'var(--font-system)',
            fontSize: 13.5,
            textAlign: 'center',
            transition: 'background 200ms ease, color 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--ink-true)';
            e.currentTarget.style.color = 'var(--paper)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--ink-true)';
          }}
        >
          i already have an account
        </Link>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <Link
            href="/how-this-works"
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 11,
              color: 'var(--gray-quiet)',
            }}
          >
            how this works
          </Link>
          <span
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 11,
              color: 'var(--gray-quiet)',
            }}
          >
            what we do with your answers
          </span>
        </div>
      </div>
    </div>
  );
}
