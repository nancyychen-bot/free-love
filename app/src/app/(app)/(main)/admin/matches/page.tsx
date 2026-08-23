'use client';

import { useState, useEffect } from 'react';
import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';

type ProfileData = {
  userId: string;
  email: string;
  name: string;
  age: number;
  gender: string;
  location: string | null;
  photo: string | null;
  bio: string | null;
  lifeAnswers: { prompt: string; answer: string }[];
  qualities: { iAm: string[]; iWant: string[] };
  values: string[];
  dealbreakers: { question: string; answer: string }[];
  allAnswers: { question: string; answer: string; isDealbreaker: boolean }[];
};

type Match = {
  id: string;
  score: string;
  explanation: string;
  status: string;
  source: string;
  userA: ProfileData;
  userB: ProfileData;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/admin/matches').then(r => r.json()).then(data => {
      setMatches(data.matches || []);
      setLoading(false);
    });
  }, []);

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="screen" style={{ padding: '0 0 60px 0' }}>
      <StatusBar />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 14px', borderBottom: '1px solid var(--rule)' }}>
        <span style={{ fontFamily: 'var(--font-system)', fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)' }}>
          MATCHES
        </span>
        <BackButton href="/admin" />
      </div>

      <div style={{ padding: '0 24px' }}>
        {loading ? (
          <p style={{ fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--gray-quiet)', paddingTop: 20 }}>loading matches...</p>
        ) : matches.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--gray-quiet)', paddingTop: 20 }}>no matches yet. run the matching engine first.</p>
        ) : (
          matches.map(match => (
            <div key={match.id} style={{ borderBottom: '1px solid var(--rule)', padding: '16px 0' }}>
              {/* Summary row */}
              <div onClick={() => toggle(match.id)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {match.userA.photo && (
                      <div className="avatar-circle" style={{ width: 28, height: 28, overflow: 'hidden' }}>
                        <img src={match.userA.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }} />
                      </div>
                    )}
                    <span style={{ fontFamily: 'var(--font-system)', fontSize: 12, color: 'var(--ink-true)' }}>
                      {match.userA.name}, {match.userA.age}
                    </span>
                    <span style={{ fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--gray-quiet)' }}>×</span>
                    {match.userB.photo && (
                      <div className="avatar-circle" style={{ width: 28, height: 28, overflow: 'hidden' }}>
                        <img src={match.userB.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }} />
                      </div>
                    )}
                    <span style={{ fontFamily: 'var(--font-system)', fontSize: 12, color: 'var(--ink-true)' }}>
                      {match.userB.name}, {match.userB.age}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-system)', fontSize: 12, fontWeight: 500, color: 'var(--introduction)' }}>
                    {(parseFloat(match.score) * 100).toFixed(0)}%
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--gray-quiet)', marginTop: 6 }}>
                  {match.explanation}
                </p>
                <p style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)', marginTop: 4 }}>
                  {match.status} · {match.source} · {expanded.has(match.id) ? 'collapse ▴' : 'expand ▾'}
                </p>
              </div>

              {/* Expanded detail */}
              {expanded.has(match.id) && (
                <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[match.userA, match.userB].map((person, pi) => (
                    <div key={pi} style={{ padding: 12, border: '1px solid var(--rule)' }}>
                      {person.photo && (
                        <img src={person.photo} alt="" style={{ width: '100%', height: 'auto', display: 'block', marginBottom: 10 }} />
                      )}
                      <p style={{ fontFamily: 'var(--font-system)', fontSize: 13, fontWeight: 500, color: 'var(--ink-true)' }}>
                        {person.name}, {person.age}
                      </p>
                      <p style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)' }}>
                        {person.gender} · {person.location}
                      </p>

                      {person.bio && (
                        <p style={{ fontFamily: 'var(--font-human)', fontSize: 13, lineHeight: 1.5, color: 'var(--ink-human)', marginTop: 10 }}>
                          {person.bio}
                        </p>
                      )}

                      {person.lifeAnswers.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          {person.lifeAnswers.map((a, i) => (
                            <div key={i} style={{ marginTop: 8 }}>
                              <p style={{ fontFamily: 'var(--font-system)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gray-quiet)' }}>
                                {a.prompt}
                              </p>
                              <p style={{ fontFamily: 'var(--font-human)', fontSize: 12, lineHeight: 1.4, color: 'var(--ink-human)', marginTop: 2 }}>
                                {a.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: 10 }}>
                        <p style={{ fontFamily: 'var(--font-system)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gray-quiet)' }}>I AM</p>
                        <p style={{ fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--ink-true)', marginTop: 2 }}>{person.qualities.iAm.join(', ') || '—'}</p>
                        <p style={{ fontFamily: 'var(--font-system)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gray-quiet)', marginTop: 6 }}>I WANT</p>
                        <p style={{ fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--ink-true)', marginTop: 2 }}>{person.qualities.iWant.join(', ') || '—'}</p>
                        <p style={{ fontFamily: 'var(--font-system)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gray-quiet)', marginTop: 6 }}>VALUES</p>
                        <p style={{ fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--ink-true)', marginTop: 2 }}>{person.values.join(', ')}</p>
                      </div>

                      {person.dealbreakers.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <p style={{ fontFamily: 'var(--font-system)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8B0000' }}>DEALBREAKERS</p>
                          {person.dealbreakers.map((d, i) => (
                            <p key={i} style={{ fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--ink-true)', marginTop: 2 }}>
                              {d.question}: {d.answer}
                            </p>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: 10 }}>
                        <p style={{ fontFamily: 'var(--font-system)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gray-quiet)' }}>ALL ANSWERS</p>
                        {person.allAnswers.map((a, i) => (
                          <p key={i} style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: a.isDealbreaker ? '#8B0000' : 'var(--gray-quiet)', marginTop: 2 }}>
                            {a.question}: {a.answer} {a.isDealbreaker ? '⚑' : ''}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
