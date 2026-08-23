'use client';

import { useState } from 'react';
import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';

type UserData = {
  id: string;
  email: string;
  displayName: string | null;
  isAdmin: boolean;
  onboardingComplete: boolean;
  conversationCount: number;
};

export default function AdminClient({ users }: { users: UserData[] }) {
  const [matchResult, setMatchResult] = useState<string | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [userAId, setUserAId] = useState('');
  const [userBId, setUserBId] = useState('');
  const [introResult, setIntroResult] = useState<string | null>(null);
  const [introLoading, setIntroLoading] = useState(false);

  async function runMatching() {
    setMatchLoading(true);
    setMatchResult(null);
    try {
      const res = await fetch('/api/matching/run', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMatchResult(`${data.matchCount} matches created.`);
      } else {
        setMatchResult(data.error || 'Failed.');
      }
    } catch {
      setMatchResult('Network error.');
    } finally {
      setMatchLoading(false);
    }
  }

  async function createIntro() {
    if (!userAId || !userBId || userAId === userBId) {
      setIntroResult('Select two different users.');
      return;
    }
    setIntroLoading(true);
    setIntroResult(null);
    try {
      const res = await fetch('/api/admin/create-intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAId, userBId }),
      });
      const data = await res.json();
      if (res.ok) {
        setIntroResult('Introduction created.');
      } else {
        setIntroResult(data.error || 'Failed.');
      }
    } catch {
      setIntroResult('Network error.');
    } finally {
      setIntroLoading(false);
    }
  }

  return (
    <div className="screen">
      <StatusBar />

      <div style={{ padding: '14px 24px 0' }}>
        <BackButton href="/home" />
      </div>

      <div style={{ padding: '20px 24px' }}>
        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 13, fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)',
        }}>
          ADMIN
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--rule)' }} />

      {/* User list */}
      <div style={{ padding: '0 24px' }}>
        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
          padding: '16px 0 10px',
        }}>
          USERS ({users.length})
        </p>

        {users.map((u) => (
          <div key={u.id} style={{
            padding: '10px 0',
            borderTop: '1px solid var(--rule)',
          }}>
            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 12.5, fontWeight: 500,
              color: 'var(--ink-true)',
            }}>
              {u.displayName || 'No profile'}{u.isAdmin ? ' (admin)' : ''}
            </p>
            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 11,
              color: 'var(--gray-quiet)', marginTop: 2,
            }}>
              {u.email} &middot; {u.onboardingComplete ? 'onboarded' : 'incomplete'} &middot; {u.conversationCount} conversations
            </p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--rule)', margin: '8px 24px 0' }} />

      {/* Run matching */}
      <div style={{ padding: '20px 24px' }}>
        <button
          onClick={runMatching}
          disabled={matchLoading}
          style={{
            display: 'block', width: '100%', padding: 14,
            background: 'var(--ink-true)', border: 'none',
            color: 'var(--paper)', fontFamily: 'var(--font-system)',
            fontSize: 13, cursor: matchLoading ? 'default' : 'pointer',
            textAlign: 'center', textTransform: 'uppercase',
            letterSpacing: '0.14em',
          }}
        >
          {matchLoading ? 'running...' : 'RUN MATCHING'}
        </button>
        {matchResult && (
          <p style={{
            fontFamily: 'var(--font-system)', fontSize: 11,
            color: 'var(--gray-quiet)', marginTop: 8,
          }}>
            {matchResult}
          </p>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--rule)', margin: '0 24px' }} />

      {/* Create introduction */}
      <div style={{ padding: '20px 24px' }}>
        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
          marginBottom: 12,
        }}>
          CREATE INTRODUCTION
        </p>

        <div style={{ marginBottom: 8 }}>
          <label style={{
            fontFamily: 'var(--font-system)', fontSize: 11,
            color: 'var(--gray-quiet)', display: 'block', marginBottom: 4,
          }}>
            User A
          </label>
          <select
            value={userAId}
            onChange={(e) => setUserAId(e.target.value)}
            style={{
              width: '100%', padding: 10,
              fontFamily: 'var(--font-system)', fontSize: 13,
              color: 'var(--ink-true)', background: 'var(--paper)',
              border: '1px solid var(--rule)', outline: 'none',
            }}
          >
            <option value="">select...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName || u.email}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{
            fontFamily: 'var(--font-system)', fontSize: 11,
            color: 'var(--gray-quiet)', display: 'block', marginBottom: 4,
          }}>
            User B
          </label>
          <select
            value={userBId}
            onChange={(e) => setUserBId(e.target.value)}
            style={{
              width: '100%', padding: 10,
              fontFamily: 'var(--font-system)', fontSize: 13,
              color: 'var(--ink-true)', background: 'var(--paper)',
              border: '1px solid var(--rule)', outline: 'none',
            }}
          >
            <option value="">select...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName || u.email}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={createIntro}
          disabled={introLoading}
          style={{
            display: 'block', width: '100%', padding: 14,
            background: 'transparent', border: '1px solid var(--ink-true)',
            color: 'var(--ink-true)', fontFamily: 'var(--font-system)',
            fontSize: 13, cursor: introLoading ? 'default' : 'pointer',
            textAlign: 'center', textTransform: 'uppercase',
            letterSpacing: '0.14em',
          }}
        >
          {introLoading ? 'creating...' : 'CREATE'}
        </button>
        {introResult && (
          <p style={{
            fontFamily: 'var(--font-system)', fontSize: 11,
            color: 'var(--gray-quiet)', marginTop: 8,
          }}>
            {introResult}
          </p>
        )}
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}
