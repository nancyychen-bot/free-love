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

type SavedIntroData = {
  introId: string;
  profile: { displayName: string; age: number };
  photos: { theme: string; url: string }[];
};

type ConvoData = { id: string; name: string; photo: string | null; lastMessage: string };

export default function HomeClient({
  userName,
  userLocation,
  userPhoto,
  introductions,
  savedIntroductions,
  conversations,
  convoCount,
}: {
  userName: string;
  userLocation: string | null;
  userPhoto: string | null;
  introductions: (IntroData | null)[];
  savedIntroductions: (SavedIntroData | null)[];
  conversations: ConvoData[];
  convoCount: number;
}) {
  const currentIntro = introductions.find((i): i is IntroData => i !== null) || null;

  return (
    <div className="screen">
      <StatusBar />

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 24px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {userPhoto ? (
            <div className="avatar-circle" style={{ width: 34, height: 34, overflow: 'hidden' }}>
              <img src={userPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }} />
            </div>
          ) : (
            <div className="avatar-circle" style={{ width: 34, height: 34, border: '1px dashed var(--gray-quiet)' }} />
          )}
          <div>
            <p style={{ fontFamily: 'var(--font-system)', fontSize: 13, fontWeight: 500, color: 'var(--ink-true)' }}>
              {userName}
            </p>
            {userLocation && (
              <p style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)', marginTop: 1 }}>
                {userLocation}
              </p>
            )}
          </div>
        </div>
        <Link href="/settings" style={{
          fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--gray-quiet)',
        }}>
          settings
        </Link>
      </div>

      <div style={{ borderTop: '1px solid var(--rule)' }} />

      {/* Introduction card */}
      {currentIntro ? (
        <Link href="/introduction" style={{ display: 'block', textDecoration: 'none' }}>
          <div style={{ background: 'var(--introduction-wash)', padding: '22px 24px' }}>
            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6B6591', marginBottom: 14,
            }}>
              NEW INTRODUCTION &middot; EXPIRES IN {currentIntro.expiresIn.toUpperCase()}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {currentIntro.photos.length > 0 && (
                <div className="avatar-circle" style={{ width: 56, height: 56, minWidth: 56, overflow: 'hidden' }}>
                  <img src={currentIntro.photos[0].url} alt={currentIntro.profile.displayName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }} />
                </div>
              )}
              <div>
                <p style={{
                  fontFamily: 'var(--font-system)', fontSize: 14, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--introduction)',
                }}>
                  {currentIntro.profile.displayName} &middot; {currentIntro.profile.age}
                </p>
                {currentIntro.profile.locationName && (
                  <p style={{ fontFamily: 'var(--font-system)', fontSize: 11, color: '#6B6591', marginTop: 3 }}>
                    {currentIntro.profile.locationName}
                  </p>
                )}
              </div>
            </div>

            {/* Preview of first life answer */}
            {currentIntro.lifeAnswers.length > 0 && (
              <p style={{
                fontFamily: 'var(--font-human)', fontSize: 15, lineHeight: 1.5,
                color: 'var(--ink-human)', marginTop: 16,
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                &ldquo;{currentIntro.lifeAnswers[0].answer}&rdquo;
              </p>
            )}

            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--introduction)', marginTop: 12,
            }}>
              see full introduction &#8250;
            </p>
          </div>
        </Link>
      ) : (
        <div style={{ padding: '28px 24px' }}>
          <p style={{
            fontFamily: 'var(--font-system)', fontSize: 13, fontWeight: 500,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-true)',
          }}>
            NO INTRODUCTIONS TODAY
          </p>
          <p style={{
            fontFamily: 'var(--font-human)', fontSize: 16, lineHeight: 1.5,
            color: 'var(--gray-quiet)', marginTop: 10,
          }}>
            We are not going to invent one. When someone clears your bar, they will appear here.
          </p>
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--rule)' }} />

      {/* Conversations */}
      <div style={{ padding: '0 24px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 0 12px',
        }}>
          <span style={{
            fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)',
          }}>
            CONVERSATIONS
          </span>
          {convoCount > 0 && (
            <span style={{
              fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)',
            }}>
              {convoCount} of 3 open
            </span>
          )}
        </div>

        {conversations.length > 0 ? (
          conversations.map((convo) => (
            <Link key={convo.id} href={`/conversations/${convo.id}`} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 0', borderTop: '1px solid var(--rule)',
              textDecoration: 'none',
            }}>
              {convo.photo ? (
                <div className="avatar-circle" style={{ width: 40, height: 40, minWidth: 40, overflow: 'hidden' }}>
                  <img src={convo.photo} alt={convo.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }} />
                </div>
              ) : (
                <div className="avatar-circle" style={{ width: 40, height: 40, minWidth: 40, border: '1px dashed var(--gray-quiet)' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-system)', fontSize: 12.5, fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-true)',
                }}>
                  {convo.name}
                </p>
                <p style={{
                  fontFamily: 'var(--font-human)', fontSize: 15, lineHeight: 1.5,
                  color: 'var(--ink-human)', marginTop: 4,
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                }}>
                  {convo.lastMessage}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ padding: '16px 0', borderTop: '1px solid var(--rule)' }}>
            <p style={{
              fontFamily: 'var(--font-human)', fontSize: 15, lineHeight: 1.5,
              color: 'var(--gray-quiet)',
            }}>
              When you open an introduction, your conversation will appear here.
            </p>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--rule)' }} />
      </div>

      {/* Saved introductions */}
      {savedIntroductions.filter(Boolean).length > 0 && (
        <div style={{ padding: '0 24px' }}>
          <div style={{ padding: '18px 0 12px' }}>
            <span style={{
              fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)',
            }}>
              SAVED
            </span>
          </div>

          {savedIntroductions.filter((s): s is SavedIntroData => s !== null).map((saved) => (
            <Link key={saved.introId} href="/introduction" style={{
              display: 'block', textDecoration: 'none',
              background: 'var(--introduction-wash)', padding: '14px 16px',
              marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {saved.photos.length > 0 ? (
                  <div className="avatar-circle" style={{ width: 36, height: 36, minWidth: 36, overflow: 'hidden' }}>
                    <img src={saved.photos[0].url} alt={saved.profile.displayName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }} />
                  </div>
                ) : (
                  <div className="avatar-circle" style={{ width: 36, height: 36, minWidth: 36, border: '1.5px dashed var(--introduction)' }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'var(--font-system)', fontSize: 12, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--introduction)',
                  }}>
                    {saved.profile.displayName} &middot; {saved.profile.age}
                  </p>
                </div>
                <span style={{
                  fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--introduction)',
                }}>
                  review &#8250;
                </span>
              </div>
            </Link>
          ))}

          <div style={{ borderTop: '1px solid var(--rule)', marginTop: 8 }} />
        </div>
      )}

      {/* Bottom padding */}
      <div style={{ height: 40 }} />
    </div>
  );
}
