'use client';

import Link from 'next/link';
import StatusBar from '@/app/components/StatusBar';

type IntroData = {
  introId: string;
  score: string;
  floorA: string;
  explanation: string;
  expiresIn: string;
  profile: { displayName: string; age: number; locationName: string | null };
  lifeAnswers: { prompt: string; answer: string }[];
  photos: { theme: string; url: string }[];
};

type ConvoData = { id: string; name: string; lastMessage: string };

export default function HomeClient({
  userName,
  introductions,
  conversations,
}: {
  userName: string;
  introductions: (IntroData | null)[];
  conversations: ConvoData[];
}) {
  const activeIntros = introductions.filter(
    (i): i is IntroData => i !== null
  );

  const currentIntro = activeIntros[0] || null;

  return (
    <div className="screen">
      <StatusBar />

      {/* Header: wordmark + settings */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px 14px',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-human)',
            fontSize: 18,
            fontWeight: 400,
            color: 'var(--ink-true)',
          }}
        >
          free love.
        </span>
        <Link
          href="/settings"
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 12,
            color: 'var(--gray-quiet)',
          }}
        >
          settings
        </Link>
      </div>

      {/* Introduction section */}
      {currentIntro ? (
        <Link
          href="/introduction"
          style={{ display: 'block', textDecoration: 'none' }}
        >
          <div
            style={{
              background: 'var(--introduction-wash)',
              padding: '20px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Avatar */}
              {currentIntro.photos.length > 0 ? (
                <div
                  className="avatar-circle"
                  style={{
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={currentIntro.photos[0].url}
                    alt={currentIntro.profile.displayName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '9999px',
                    }}
                  />
                </div>
              ) : (
                <div
                  className="avatar-circle"
                  style={{
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    border: '1.5px dashed var(--introduction)',
                    background: 'transparent',
                  }}
                />
              )}

              {/* Info */}
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-system)',
                    fontSize: 13,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--introduction)',
                  }}
                >
                  {currentIntro.profile.displayName} &middot; {currentIntro.profile.age}
                </p>
                {currentIntro.profile.locationName && (
                  <p
                    style={{
                      fontFamily: 'var(--font-system)',
                      fontSize: 11,
                      color: '#6B6591',
                      marginTop: 2,
                    }}
                  >
                    {currentIntro.profile.locationName}
                  </p>
                )}
                <p
                  style={{
                    fontFamily: 'var(--font-system)',
                    fontSize: 11,
                    color: 'var(--introduction)',
                    marginTop: 4,
                  }}
                >
                  see introduction &#8250;
                </p>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div style={{ padding: '24px 24px 0' }}>
          <p
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 13,
              lineHeight: 1.6,
              color: 'var(--gray-quiet)',
            }}
          >
            no introductions today
          </p>
        </div>
      )}

      {/* Conversations section */}
      <div style={{ padding: '24px 24px 40px' }}>
        <div
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-true)',
            paddingBottom: 12,
            borderBottom: '1px solid var(--rule)',
          }}
        >
          CONVERSATIONS
        </div>

        {conversations.length > 0 ? (
          conversations.map((convo) => (
            <Link
              key={convo.id}
              href={`/conversations/${convo.id}`}
              style={{
                display: 'block',
                padding: '16px 0',
                borderBottom: '1px solid var(--rule)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 12.5,
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-true)',
                }}
              >
                {convo.name}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-human)',
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: 'var(--ink-human)',
                  marginTop: 4,
                }}
              >
                {convo.lastMessage}
              </p>
            </Link>
          ))
        ) : (
          <p
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 12.5,
              color: 'var(--gray-quiet)',
              paddingTop: 14,
            }}
          >
            no conversations yet
          </p>
        )}
      </div>
    </div>
  );
}
