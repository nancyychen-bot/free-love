'use client';

import { useTransition } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { completeOnboarding } from '../actions';

export default function PhotosPage() {
  const [isPending, startTransition] = useTransition();

  const handleFinish = () => {
    startTransition(async () => {
      await completeOnboarding();
    });
  };

  return (
    <div className="screen" style={{ padding: '0 0 60px 0' }}>
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
            STEP 9 OF 9
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
            PUBLIC
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
            marginTop: 28,
          }}
        >
          TWO PHOTOS
        </h1>

        {/* Explanation */}
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 12.5,
            lineHeight: 1.7,
            color: 'var(--gray-quiet)',
            marginTop: 12,
          }}
        >
          One clear face photo. One full-body photo. Both required before you can
          be matched — but you can add them later.
        </p>

        {/* Placeholder boxes */}
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              width: 342,
              height: 228,
              border: '1px dashed var(--rule)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-system)',
                fontSize: 13,
                color: 'var(--gray-quiet)',
              }}
            >
              face photo
            </span>
          </div>

          <div
            style={{
              width: 342,
              height: 228,
              border: '1px dashed var(--rule)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-system)',
                fontSize: 13,
                color: 'var(--gray-quiet)',
              }}
            >
              full-body photo
            </span>
          </div>
        </div>

        {/* Note */}
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11.5,
            lineHeight: 1.65,
            color: 'var(--gray-quiet)',
            marginTop: 20,
          }}
        >
          Photo upload is coming soon. For now, skip this step to finish setting
          up your profile.
        </p>

        {/* Footer button */}
        <button
          onClick={handleFinish}
          disabled={isPending}
          style={{
            width: '100%',
            border: '1px solid var(--ink-true)',
            background: 'transparent',
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            color: 'var(--ink-true)',
            padding: '14px 0',
            cursor: isPending ? 'wait' : 'pointer',
            marginTop: 28,
            opacity: isPending ? 0.5 : 1,
            transition: 'background-color 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!isPending) {
              e.currentTarget.style.backgroundColor = 'var(--ink-true)';
              e.currentTarget.style.color = 'var(--paper)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--ink-true)';
          }}
        >
          {isPending ? 'finishing...' : 'finish setup'}
        </button>
      </div>

      <FooterLink />
    </div>
  );
}
