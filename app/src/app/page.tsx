'use client';

import Link from 'next/link';
import StatusBar from '@/app/components/StatusBar';
import FaceIllustration from '@/app/components/FaceIllustration';
import Wordmark from '@/app/components/Wordmark';

export default function SignIn() {
  return (
    <div className="screen">
      <StatusBar />

      <div style={{ padding: '40px 24px 24px' }}>
        <FaceIllustration />

        <div style={{ marginTop: 38 }}>
          <Wordmark size={21} />
        </div>

        <p style={{ marginTop: 30, fontFamily: 'var(--font-human)', fontSize: 23, lineHeight: 1.5, color: '#2A2A2A', maxWidth: '28ch' }}>
          Like being introduced by a friend who actually knows you.
        </p>

        <p style={{ marginTop: 26, fontFamily: 'var(--font-system)', fontSize: 12.5, lineHeight: 1.7, color: '#8A8A85' }}>
          Non-profit. Open source. Operated at cost.
        </p>

        <div style={{ marginTop: 60 }}>
          <Link
            href="/signup"
            style={{
              display: 'block',
              width: '100%',
              padding: 15,
              background: '#0A0A0A',
              color: '#F8F8F6',
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            sign up
          </Link>

          <Link
            href="/login"
            style={{
              display: 'block',
              width: '100%',
              padding: 15,
              marginTop: 8,
              background: 'transparent',
              border: '1px solid #0A0A0A',
              color: '#0A0A0A',
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            login
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <Link
              href="/how-this-works"
              style={{ fontFamily: 'var(--font-system)', fontSize: 11, color: '#8A8A85', textDecoration: 'none' }}
            >
              how this works
            </Link>
            <Link
              href="/manifesto"
              style={{ fontFamily: 'var(--font-system)', fontSize: 11, color: '#8A8A85', textDecoration: 'none' }}
            >
              the manifesto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
