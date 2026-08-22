'use client';

import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { mockDrought } from '@/lib/mock-data';

const stateRows = [
  { label: 'your bar', value: mockDrought.bar },
  { label: 'dealbreakers', value: String(mockDrought.dealbreakers) },
  { label: 'radius', value: mockDrought.radius },
  { label: 'people inside those filters', value: String(mockDrought.poolSize) },
];

const levers = [
  'widen radius',
  'revisit a dealbreaker',
  'rewrite a life answer',
];

export default function Drought() {
  return (
    <div className="screen">
      <StatusBar />

      {/* Content */}
      <div style={{ padding: '0 24px' }}>
        {/* Headline — 96px top padding (absurd whitespace is intentional) */}
        <h1
          style={{
            paddingTop: 96,
            fontFamily: 'var(--font-system)',
            fontSize: 15,
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: '0.16em',
            textTransform: 'uppercase' as const,
            color: 'var(--ink-true)',
          }}
        >
          NO INTRODUCTIONS TODAY
        </h1>

        {/* Sub-line */}
        <p
          style={{
            marginTop: 34,
            fontFamily: 'var(--font-system)',
            fontSize: 13.5,
            lineHeight: 1.7,
            color: 'var(--ink-true)',
          }}
        >
          We&rsquo;re not going to invent one.
        </p>

        {/* State table */}
        <div style={{ marginTop: 34 }}>
          {stateRows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderTop: '1px solid var(--rule)',
                padding: '13px 0',
                fontFamily: 'var(--font-system)',
                fontSize: 12,
              }}
            >
              <span style={{ color: 'var(--gray-quiet)' }}>{row.label}</span>
              <span style={{ color: 'var(--ink-true)' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <p
          style={{
            marginTop: 34,
            fontFamily: 'var(--font-system)',
            fontSize: 13.5,
            lineHeight: 1.7,
            color: 'var(--ink-true)',
          }}
        >
          Nothing today cleared it. That&rsquo;s the system working, not failing.
        </p>

        {/* Levers section */}
        <div style={{ marginTop: 34 }}>
          <div
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase' as const,
              color: 'var(--ink-true)',
              marginBottom: 16,
            }}
          >
            WHAT YOU CAN CHANGE
          </div>
          {levers.map((lever, i) => (
            <button
              key={i}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '13px 14px',
                marginTop: i === 0 ? 0 : 8,
                background: 'transparent',
                border: '1px solid var(--rule)',
                color: 'var(--ink-true)',
                fontFamily: 'var(--font-system)',
                fontSize: 14,
                cursor: 'pointer',
                transition: 'border-color 200ms ease',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ink-true)';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--rule)';
              }}
            >
              {lever}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', height: 56 }}>
        <FooterLink />
      </div>
    </div>
  );
}
