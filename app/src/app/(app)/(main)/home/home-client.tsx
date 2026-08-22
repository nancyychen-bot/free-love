'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBar from '@/app/components/StatusBar';
import Wordmark from '@/app/components/Wordmark';

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
  openConvoCount,
}: {
  userName: string;
  introductions: (IntroData | null)[];
  conversations: ConvoData[];
  openConvoCount: number;
}) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const activeIntros = introductions.filter(
    (i): i is IntroData => i !== null && !dismissed.has(i.introId)
  );

  const currentIntro = activeIntros[0] || null;

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
    <div className="screen">
      <StatusBar />

      {currentIntro ? (
        /* ── Introduction view ──────────────────────────── */
        <div>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px 24px 14px', borderBottom: '1px solid var(--rule)',
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
              expires in {currentIntro.expiresIn}
            </span>
          </div>

          {/* Violet wash surface */}
          <div style={{
            background: 'var(--introduction-wash)', padding: '30px 24px 26px',
          }}>
            {/* Avatar */}
            {currentIntro.photos.length > 0 && (
              <div className="avatar-circle" style={{
                width: 56, height: 56, overflow: 'hidden',
              }}>
                <img
                  src={currentIntro.photos[0].url}
                  alt={currentIntro.profile.displayName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }}
                />
              </div>
            )}

            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 13,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--introduction)', marginTop: 16,
            }}>
              {currentIntro.profile.displayName} &middot; {currentIntro.profile.age}
            </p>

            {currentIntro.profile.locationName && (
              <p style={{
                fontFamily: 'var(--font-system)', fontSize: 11,
                color: '#6B6591', marginTop: 4,
              }}>
                {currentIntro.profile.locationName}
              </p>
            )}

            {currentIntro.photos.length > 1 && (
              <p style={{
                fontFamily: 'var(--font-system)', fontSize: 10.5,
                color: 'var(--introduction)', marginTop: 8,
              }}>
                {currentIntro.photos.length} photos &rsaquo;
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
                {currentIntro.explanation}
              </p>
            </div>

            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 10.5,
              color: '#6B6591', marginTop: 16,
            }}>
              floor: {currentIntro.floorA} &middot; this pair: {currentIntro.score}
            </p>
          </div>

          {/* Life answers */}
          <div style={{ padding: '0 24px' }}>
            {currentIntro.lifeAnswers.slice(0, 2).map((answer) => (
              <div key={answer.prompt} style={{ marginTop: 26 }}>
                <p style={{
                  fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
                }}>
                  {answer.prompt}
                </p>
                <p style={{
                  fontFamily: 'var(--font-human)', fontSize: 17,
                  lineHeight: 1.55, color: 'var(--ink-human)', marginTop: 8, maxWidth: '62ch',
                }}>
                  {answer.answer}
                </p>
              </div>
            ))}

            {/* Photos grid */}
            {currentIntro.photos.length > 1 && (
              <div style={{ marginTop: 26 }}>
                <p style={{
                  fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--gray-quiet)', marginBottom: 12,
                }}>
                  HER PHOTOS
                </p>
                {currentIntro.photos.slice(1, 4).map((photo) => (
                  <div key={photo.theme} style={{ marginBottom: 16 }}>
                    <p style={{
                      fontFamily: 'var(--font-system)', fontSize: 10,
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: 'var(--gray-quiet)', marginBottom: 6,
                    }}>
                      {photo.theme}
                    </p>
                    <img
                      src={photo.url}
                      alt={photo.theme}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ marginTop: 32, paddingBottom: 20 }}>
              <button
                onClick={() => handleAction(currentIntro.introId, 'open')}
                style={{
                  display: 'block', width: '100%', padding: 15,
                  background: 'var(--ink-true)', color: 'var(--paper)',
                  fontFamily: 'var(--font-system)', fontSize: 14, border: 'none',
                  cursor: 'pointer', textAlign: 'center',
                }}
              >
                open a conversation
              </button>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => handleAction(currentIntro.introId, 'pass')}
                  style={{
                    flex: 1, padding: 13, background: 'transparent',
                    border: '1px solid var(--ink-true)', fontFamily: 'var(--font-system)',
                    fontSize: 14, color: 'var(--ink-true)', cursor: 'pointer', textAlign: 'center',
                  }}
                >
                  pass
                </button>
                <button
                  onClick={() => handleAction(currentIntro.introId, 'save')}
                  style={{
                    flex: 1, padding: 13, background: 'transparent',
                    border: '1px solid var(--ink-true)', fontFamily: 'var(--font-system)',
                    fontSize: 14, color: 'var(--ink-true)', cursor: 'pointer', textAlign: 'center',
                  }}
                >
                  save for later
                </button>
              </div>
            </div>
          </div>

          {/* Nav footer */}
          <div style={{
            padding: '20px 24px', borderTop: '1px solid var(--rule)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <Link href="/conversations" style={{
              fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--gray-quiet)',
            }}>
              conversations{openConvoCount > 0 ? ` (${openConvoCount})` : ''}
            </Link>
            <Link href="/how-this-works" style={{
              fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--gray-quiet)',
            }}>
              how this works
            </Link>
          </div>
        </div>
      ) : (
        /* ── No introduction state ────────────────────── */
        <div style={{ padding: '0 24px' }}>
          <div style={{ paddingTop: 60 }}>
            <Wordmark size={18} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-system)', fontSize: 15, fontWeight: 500,
            lineHeight: 1.5, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--ink-true)', marginTop: 40,
          }}>
            NO INTRODUCTIONS TODAY
          </h1>

          <p style={{
            marginTop: 16, fontFamily: 'var(--font-system)',
            fontSize: 13.5, lineHeight: 1.7, color: 'var(--ink-true)',
          }}>
            We are not going to invent one.
          </p>

          <p style={{
            marginTop: 12, fontFamily: 'var(--font-system)',
            fontSize: 12.5, lineHeight: 1.7, color: 'var(--gray-quiet)',
          }}>
            Nothing today cleared your bar. That is the system working, not failing.
          </p>

          {/* State summary */}
          <div style={{ marginTop: 30 }}>
            {[
              { label: 'your bar', value: '5 values · 4 qualities' },
              { label: 'radius', value: '15 miles' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                borderTop: '1px solid var(--rule)', padding: '13px 0',
                fontFamily: 'var(--font-system)', fontSize: 12,
              }}>
                <span style={{ color: 'var(--gray-quiet)' }}>{row.label}</span>
                <span style={{ color: 'var(--ink-true)' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--rule)' }} />
          </div>

          {/* Quick actions */}
          <div style={{ marginTop: 30 }}>
            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--ink-true)', marginBottom: 12,
            }}>
              WHAT YOU CAN CHANGE
            </p>
            {['widen radius', 'revisit a dealbreaker', 'rewrite a life answer'].map((lever, i) => (
              <button key={i} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '13px 14px', marginTop: i === 0 ? 0 : 8,
                background: 'transparent', border: '1px solid var(--rule)',
                color: 'var(--ink-true)', fontFamily: 'var(--font-system)', fontSize: 14,
                cursor: 'pointer',
              }}>
                {lever}
              </button>
            ))}
          </div>

          {/* Conversations */}
          {conversations.length > 0 && (
            <div style={{ marginTop: 30 }}>
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
                <Link key={convo.id} href={`/conversations/${convo.id}`} style={{
                  display: 'block', padding: '18px 0', borderBottom: '1px solid var(--rule)',
                }}>
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

          {/* Navigation footer */}
          <div style={{ marginTop: 40, paddingBottom: 40 }}>
            <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20 }}>
              {[
                { href: '/conversations', label: 'conversations' + (openConvoCount > 0 ? ` (${openConvoCount})` : '') },
                { href: '/how-this-works', label: 'how this works' },
                { href: '/manifesto', label: 'the manifesto' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{
                  display: 'block', padding: '10px 0',
                  fontFamily: 'var(--font-system)', fontSize: 12.5, color: 'var(--gray-quiet)',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
