'use client';

import { useState, useCallback, useTransition } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import DragRankList from '@/app/components/DragRankList';
import { saveQualities } from '../actions';

const DEFAULT_RANKED = ['humor', 'candor', 'curiosity', 'warmth'];
const DEFAULT_UNRANKED = ['ambition', 'steadiness', 'depth', 'playfulness', 'self-awareness'];

export default function QualitiesPage() {
  const [ranked, setRanked] = useState<string[]>(DEFAULT_RANKED);
  const [unranked, setUnranked] = useState<string[]>(DEFAULT_UNRANKED);
  const [isPending, startTransition] = useTransition();

  const handleChipClick = useCallback(
    (chipLabel: string) => {
      const lastRanked = ranked[ranked.length - 1];
      setRanked((prev) => [...prev.slice(0, -1), chipLabel]);
      setUnranked((prev) => [...prev.filter((u) => u !== chipLabel), lastRanked]);
    },
    [ranked]
  );

  const handleSave = () => {
    startTransition(async () => {
      await saveQualities(ranked);
    });
  };

  return (
    <div className="screen" style={{ padding: '0 0 60px 0' }}>
      <StatusBar />

      <div style={{ padding: '40px 24px 0' }}>
        {/* Step row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
          }}>
            STEP 7 OF 9
          </span>
          <span style={{
            fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
          }}>
            PRIVATE MATCHING INPUT
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-system)', fontSize: 14, fontWeight: 500,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--ink-true)', marginTop: 28,
        }}>
          PUT THESE IN ORDER
        </h1>

        {/* Explanation */}
        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 12.5, lineHeight: 1.7,
          color: 'var(--gray-quiet)', marginTop: 12,
        }}>
          Four qualities, ranked one through four. They cannot be tied. The order is what we match on.
        </p>

        {/* Ranked list with drag */}
        <div style={{ marginTop: 28 }}>
          <DragRankList items={ranked} onChange={setRanked} />
        </div>

        {/* Not ranked section */}
        <div style={{ marginTop: 28 }}>
          <div style={{
            fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--gray-quiet)', marginBottom: 12,
          }}>
            NOT RANKED
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {unranked.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                style={{
                  fontFamily: 'var(--font-system)', fontSize: 13.5,
                  color: 'var(--gray-quiet)', border: '1px solid var(--rule)',
                  background: 'transparent', padding: '9px 12px',
                  cursor: 'pointer', lineHeight: 1,
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 11.5, lineHeight: 1.65,
          color: 'var(--gray-quiet)', marginTop: 20,
        }}>
          Swap any of these in. You can change the order forever. You cannot rank them equally.
        </p>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isPending}
          style={{
            width: '100%', padding: 15, marginTop: 28,
            background: isPending ? 'var(--gray-quiet)' : 'var(--ink-true)',
            color: 'var(--paper)', fontFamily: 'var(--font-system)',
            fontSize: 13.5, fontWeight: 500, border: 'none',
            cursor: isPending ? 'default' : 'pointer',
          }}
        >
          {isPending ? 'saving...' : 'save this order'}
        </button>
      </div>

      <FooterLink />
    </div>
  );
}
