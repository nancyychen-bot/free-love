'use client';

import Link from 'next/link';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { mockIntroduction } from '@/lib/mock-data';

export default function Introduction() {
  const data = mockIntroduction;

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '28px 24px 20px',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase' as const,
            color: 'var(--ink-true)',
          }}
        >
          ONE INTRODUCTION
        </span>
        <span
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11,
            color: 'var(--gray-quiet)',
          }}
        >
          expires in {data.expiresIn}
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Introduction surface */}
        <div
          style={{
            background: 'var(--introduction-wash)',
            padding: '30px 24px 26px',
            animation: 'introFadeIn 520ms ease-out',
          }}
        >
          <style>{`
            @keyframes introFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @media (prefers-reduced-motion: reduce) {
              .intro-surface { animation: none !important; }
            }
          `}</style>

          {/* Avatar */}
          <Link href="/photos">
            <div
              className="avatar-circle"
              style={{
                width: 56,
                height: 56,
                border: '1.5px dashed var(--introduction)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'transparent',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2266" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          </Link>

          {/* Name / age */}
          <div
            style={{
              marginTop: 16,
              fontFamily: 'var(--font-system)',
              fontSize: 13,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: 'var(--introduction)',
            }}
          >
            {data.name} &middot; {data.age}
          </div>

          {/* Location */}
          <div
            style={{
              marginTop: 4,
              fontFamily: 'var(--font-system)',
              fontSize: 11,
              color: '#6B6591',
            }}
          >
            {data.location} &middot; {data.distance}
          </div>

          {/* Photo link */}
          <Link
            href="/photos"
            style={{
              display: 'inline-block',
              marginTop: 10,
              fontFamily: 'var(--font-system)',
              fontSize: 10.5,
              color: 'var(--introduction)',
            }}
          >
            {data.photoCount === 1
              ? 'one photo'
              : data.photoCount === 2
                ? 'two photos'
                : 'three photos'}{' '}
            &rsaquo;
          </Link>

          {/* WHY THIS MATCH? */}
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontFamily: 'var(--font-system)',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color: '#6B6591',
              }}
            >
              WHY THIS MATCH?
            </div>
            <p
              style={{
                marginTop: 10,
                fontFamily: 'var(--font-system)',
                fontSize: 12.5,
                lineHeight: 1.6,
                color: 'var(--introduction)',
              }}
            >
              {data.explanation}
            </p>
          </div>

          {/* Score readout */}
          <div
            style={{
              marginTop: 16,
              fontFamily: 'var(--font-system)',
              fontSize: 10.5,
              color: '#6B6591',
            }}
          >
            floor: {data.floor.toFixed(2)} &middot; this pair: {data.score.toFixed(2)}
          </div>
        </div>

        {/* Life answers */}
        <div style={{ padding: '26px 24px 0' }}>
          {data.lifeAnswers.map((item, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--gray-quiet)',
                }}
              >
                {item.prompt}
              </div>
              <p
                className="type-human-answer"
                style={{ marginTop: 10 }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action footer */}
      <div
        style={{
          borderTop: '1px solid var(--rule)',
          padding: '16px 24px 0',
        }}
      >
        {/* Open a conversation */}
        <button
          style={{
            display: 'block',
            width: '100%',
            padding: 13,
            background: 'transparent',
            border: '1px solid var(--ink-true)',
            color: 'var(--ink-true)',
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            cursor: 'pointer',
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
          open a conversation
        </button>

        {/* Pass / Save row */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 8,
          }}
        >
          <button
            style={{
              flex: 1,
              padding: 13,
              background: 'transparent',
              border: '1px solid var(--ink-true)',
              color: 'var(--ink-true)',
              fontFamily: 'var(--font-system)',
              fontSize: 14,
              cursor: 'pointer',
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
            pass
          </button>
          <button
            style={{
              flex: 1,
              padding: 13,
              background: 'transparent',
              border: '1px solid var(--ink-true)',
              color: 'var(--ink-true)',
              fontFamily: 'var(--font-system)',
              fontSize: 14,
              cursor: 'pointer',
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
            save for later
          </button>
        </div>
      </div>

      {/* FooterLink */}
      <div style={{ position: 'relative', height: 56 }}>
        <FooterLink />
      </div>
    </div>
  );
}
