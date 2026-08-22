'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type IntroData = {
  introId: string;
  score: string;
  floorA: string;
  explanation: string;
  expiresIn: string;
  profile: {
    displayName: string;
    age: number;
    locationName: string | null;
  };
  lifeAnswers: { prompt: string; answer: string }[];
  photos: { theme: string; url: string }[];
};

type ConvoData = {
  id: string;
  name: string;
  lastMessage: string;
};

export default function HomeClient({
  introductions,
  conversations,
  openConvoCount,
}: {
  introductions: (IntroData | null)[];
  conversations: ConvoData[];
  openConvoCount: number;
}) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const activeIntros = introductions.filter(
    (i): i is IntroData => i !== null && !dismissed.has(i.introId)
  );

  async function handleAction(introId: string, action: string) {
    await fetch(`/api/introductions/${introId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    setDismissed(prev => new Set(prev).add(introId));
    if (action === 'open') {
      router.refresh();
    }
  }

  return (
    <div style={{ padding: '0 24px' }}>
      {/* Introduction section */}
      {activeIntros.length > 0 ? (
        activeIntros.map((intro) => (
          <div key={intro.introId}>
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '28px 0 20px', borderBottom: '1px solid var(--rule)',
            }}>
              <span style={{
                fontFamily: 'var(--font-system)', fontSize: 11, fontWeight: 500,
                letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)',
              }}>
                ONE INTRODUCTION
              </span>
              <span style={{
                fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--gray-quiet)',
              }}>
                expires in {intro.expiresIn}
              </span>
            </div>

            {/* Introduction surface */}
            <div style={{
              background: 'var(--introduction-wash)',
              padding: '30px 24px 26px', marginTop: 0,
              animation: 'fadeIn 520ms ease-out',
            }}>
              {/* Avatar placeholder */}
              {intro.photos.length > 0 && (
                <div className="avatar-circle" style={{
                  width: 56, height: 56, overflow: 'hidden',
                  border: '1px dashed var(--gray-quiet)',
                }}>
                  <img src={intro.photos[0].url} alt="" style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    borderRadius: '9999px',
                  }} />
                </div>
              )}

              {/* Name */}
              <p style={{
                fontFamily: 'var(--font-system)', fontSize: 13,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--introduction)', marginTop: 16,
              }}>
                {intro.profile.displayName} &middot; {intro.profile.age}
              </p>

              {/* Location */}
              {intro.profile.locationName && (
                <p style={{
                  fontFamily: 'var(--font-system)', fontSize: 11,
                  color: '#6B6591', marginTop: 4,
                }}>
                  {intro.profile.locationName}
                </p>
              )}

              {/* Photos link */}
              {intro.photos.length > 0 && (
                <p style={{
                  fontFamily: 'var(--font-system)', fontSize: 10.5,
                  color: 'var(--introduction)', marginTop: 8,
                }}>
                  {intro.photos.length} photos &rsaquo;
                </p>
              )}

              {/* Why this match */}
              <div style={{ marginTop: 20 }}>
                <p style={{
                  fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6B6591',
                }}>
                  WHY THIS MATCH?
                </p>
                <p style={{
                  fontFamily: 'var(--font-system)', fontSize: 12.5,
                  lineHeight: 1.6, color: 'var(--introduction)', marginTop: 8,
                }}>
                  {intro.explanation}
                </p>
              </div>

              {/* Score */}
              <p style={{
                fontFamily: 'var(--font-system)', fontSize: 10.5,
                color: '#6B6591', marginTop: 16,
              }}>
                floor: {intro.floorA} &middot; this pair: {intro.score}
              </p>
            </div>

            {/* Life answers */}
            {intro.lifeAnswers.slice(0, 2).map((answer) => (
              <div key={answer.prompt} style={{ marginTop: 26 }}>
                <p style={{
                  fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
                }}>
                  {answer.prompt}
                </p>
                <p style={{
                  fontFamily: 'var(--font-human)', fontSize: 17,
                  lineHeight: 1.55, color: 'var(--ink-human)', marginTop: 8,
                  maxWidth: '62ch',
                }}>
                  {answer.answer}
                </p>
              </div>
            ))}

            {/* Actions */}
            <div style={{ marginTop: 32, borderTop: '1px solid var(--rule)', paddingTop: 20 }}>
              <button
                onClick={() => handleAction(intro.introId, 'open')}
                style={{
                  display: 'block', width: '100%', padding: 13,
                  background: 'transparent', border: '1px solid var(--ink-true)',
                  fontFamily: 'var(--font-system)', fontSize: 14, color: 'var(--ink-true)',
                  cursor: 'pointer', textAlign: 'center',
                }}
              >
                open a conversation
              </button>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => handleAction(intro.introId, 'pass')}
                  style={{
                    flex: 1, padding: 13,
                    background: 'transparent', border: '1px solid var(--ink-true)',
                    fontFamily: 'var(--font-system)', fontSize: 14, color: 'var(--ink-true)',
                    cursor: 'pointer', textAlign: 'center',
                  }}
                >
                  pass
                </button>
                <button
                  onClick={() => handleAction(intro.introId, 'save')}
                  style={{
                    flex: 1, padding: 13,
                    background: 'transparent', border: '1px solid var(--ink-true)',
                    fontFamily: 'var(--font-system)', fontSize: 14, color: 'var(--ink-true)',
                    cursor: 'pointer', textAlign: 'center',
                  }}
                >
                  save for later
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        /* No introductions state */
        <div style={{ paddingTop: 60 }}>
          <h1 style={{
            fontFamily: 'var(--font-system)', fontSize: 15, fontWeight: 500,
            lineHeight: 1.5, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--ink-true)',
          }}>
            NO INTRODUCTIONS TODAY
          </h1>
          <p style={{
            marginTop: 16, fontFamily: 'var(--font-system)',
            fontSize: 13.5, lineHeight: 1.7, color: 'var(--ink-true)',
          }}>
            We're not going to invent one.
          </p>
          <p style={{
            marginTop: 16, fontFamily: 'var(--font-system)',
            fontSize: 12.5, lineHeight: 1.7, color: 'var(--gray-quiet)',
          }}>
            Nothing today cleared your bar. That's the system working, not failing.
          </p>
        </div>
      )}

      {/* Conversations section */}
      {conversations.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid var(--rule)', paddingBottom: 14,
          }}>
            <span style={{
              fontFamily: 'var(--font-system)', fontSize: 11, fontWeight: 500,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)',
            }}>
              CONVERSATIONS
            </span>
            <span style={{
              fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--gray-quiet)',
            }}>
              {openConvoCount} of 3 open
            </span>
          </div>

          {conversations.map((convo) => (
            <Link
              key={convo.id}
              href={`/conversations/${convo.id}`}
              style={{
                display: 'block', padding: '18px 0',
                borderBottom: '1px solid var(--rule)',
              }}
            >
              <p style={{
                fontFamily: 'var(--font-system)', fontSize: 12.5, fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-true)',
              }}>
                {convo.name}
              </p>
              <p style={{
                fontFamily: 'var(--font-human)', fontSize: 15,
                lineHeight: 1.5, color: 'var(--ink-human)', marginTop: 6,
              }}>
                {convo.lastMessage}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
