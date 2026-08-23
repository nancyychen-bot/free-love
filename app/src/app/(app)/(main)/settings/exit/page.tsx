'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';
import { recordExit } from '@/lib/actions/exit-actions';
import { pauseAccount } from '@/lib/actions/account-actions';

export default function ExitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next'); // 'pause' or 'cancel'

  const [foundSomeone, setFoundSomeone] = useState<boolean | null>(null);
  const [story, setStory] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (foundSomeone === null) return;
    startTransition(async () => {
      await recordExit(foundSomeone, story || undefined);

      if (next === 'pause') {
        await pauseAccount();
        setSubmitted(true);
      } else if (next === 'cancel') {
        await fetch('/api/auth/cancel', { method: 'POST' });
        router.push('/');
        return;
      } else {
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <div className="screen">
        <StatusBar />
        <div style={{ padding: '40px 24px' }}>
          <p style={{
            fontFamily: 'var(--font-system)', fontSize: 13, fontWeight: 500,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-true)',
          }}>
            THANK YOU
          </p>
          <p style={{
            fontFamily: 'var(--font-human)', fontSize: 16, lineHeight: 1.5,
            color: 'var(--gray-quiet)', marginTop: 12,
          }}>
            {foundSomeone
              ? 'That is the only number we care about. We are glad the system worked.'
              : 'We appreciate you telling us. This helps us build something better.'}
          </p>
          <div style={{ marginTop: 32 }}>
            <button
              onClick={() => router.push('/settings')}
              style={{
                display: 'block', width: '100%', padding: '13px 0',
                border: '1px solid var(--rule)', background: 'none',
                fontFamily: 'var(--font-system)', fontSize: 14,
                color: 'var(--ink-true)', cursor: 'pointer', textAlign: 'center',
              }}
            >
              back to settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <StatusBar />

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 24px 14px', borderBottom: '1px solid var(--rule)',
      }}>
        <span style={{
          fontFamily: 'var(--font-system)', fontSize: 11, fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)',
        }}>
          BEFORE YOU GO
        </span>
        <BackButton href="/settings" />
      </div>

      <div style={{ padding: '24px 24px 40px' }}>
        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 13, fontWeight: 500,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-true)',
          marginBottom: 20,
        }}>
          DID YOU FIND SOMEONE?
        </p>

        {/* Yes option */}
        <button
          onClick={() => setFoundSomeone(true)}
          style={{
            display: 'block', width: '100%', padding: '14px 0',
            borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)',
            borderLeft: 'none', borderRight: 'none', background: 'none',
            fontFamily: 'var(--font-system)', fontSize: 13,
            color: foundSomeone === true ? 'var(--ink-true)' : 'var(--gray-quiet)',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span style={{
            display: 'inline-block', width: 18, height: 18, borderRadius: '50%',
            border: foundSomeone === true ? '5px solid var(--ink-true)' : '1px solid var(--gray-quiet)',
            verticalAlign: 'middle', marginRight: 12,
          }} />
          yes
        </button>

        {/* No option */}
        <button
          onClick={() => setFoundSomeone(false)}
          style={{
            display: 'block', width: '100%', padding: '14px 0',
            borderTop: 'none', borderBottom: '1px solid var(--rule)',
            borderLeft: 'none', borderRight: 'none', background: 'none',
            fontFamily: 'var(--font-system)', fontSize: 13,
            color: foundSomeone === false ? 'var(--ink-true)' : 'var(--gray-quiet)',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span style={{
            display: 'inline-block', width: 18, height: 18, borderRadius: '50%',
            border: foundSomeone === false ? '5px solid var(--ink-true)' : '1px solid var(--gray-quiet)',
            verticalAlign: 'middle', marginRight: 12,
          }} />
          no
        </button>

        {/* Conditional textarea */}
        {foundSomeone === true && (
          <div style={{ marginTop: 20 }}>
            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 13.5,
              color: 'var(--gray-quiet)', marginBottom: 10,
            }}>
              Tell us about it (optional)
            </p>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={4}
              style={{
                width: '100%', padding: 12, border: '1px solid var(--rule)',
                background: 'none', fontFamily: 'var(--font-human)', fontSize: 15,
                lineHeight: 1.5, color: 'var(--ink-human)', resize: 'vertical',
              }}
            />
            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 11,
              color: 'var(--gray-quiet)', marginTop: 8,
            }}>
              This is the only number we care about.
            </p>
          </div>
        )}

        {foundSomeone === false && (
          <div style={{ marginTop: 20 }}>
            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 13.5,
              color: 'var(--gray-quiet)', marginBottom: 10,
            }}>
              Anything you would like us to know? (optional)
            </p>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={4}
              style={{
                width: '100%', padding: 12, border: '1px solid var(--rule)',
                background: 'none', fontFamily: 'var(--font-human)', fontSize: 15,
                lineHeight: 1.5, color: 'var(--ink-human)', resize: 'vertical',
              }}
            />
          </div>
        )}

        {/* Submit button */}
        {foundSomeone !== null && (
          <button
            onClick={handleSubmit}
            disabled={isPending}
            style={{
              display: 'block', width: '100%', padding: '13px 0', marginTop: 24,
              border: '1px solid var(--rule)', background: 'none',
              fontFamily: 'var(--font-system)', fontSize: 14,
              color: isPending ? 'var(--gray-quiet)' : 'var(--ink-true)',
              cursor: isPending ? 'default' : 'pointer', textAlign: 'center',
            }}
          >
            {isPending ? 'submitting...' : 'submit'}
          </button>
        )}
      </div>
    </div>
  );
}
