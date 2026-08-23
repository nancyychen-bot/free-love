'use client';

import { useState, useCallback, useTransition } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import DragRankList from '@/app/components/DragRankList';
import { saveQualities } from '../actions';

const ALL_QUALITIES = ['humor', 'candor', 'curiosity', 'warmth', 'ambition', 'steadiness', 'depth', 'playfulness', 'self-awareness'];
const DEFAULT_I_AM = ['humor', 'candor', 'curiosity', 'warmth'];
const DEFAULT_I_WANT = ['warmth', 'humor', 'depth', 'candor'];

export default function QualitiesPage() {
  const [phase, setPhase] = useState<'i-am' | 'i-want'>('i-am');
  const [iAm, setIAm] = useState<string[]>(DEFAULT_I_AM);
  const [iAmUnranked, setIAmUnranked] = useState<string[]>(ALL_QUALITIES.filter(q => !DEFAULT_I_AM.includes(q)));
  const [iWant, setIWant] = useState<string[]>(DEFAULT_I_WANT);
  const [iWantUnranked, setIWantUnranked] = useState<string[]>(ALL_QUALITIES.filter(q => !DEFAULT_I_WANT.includes(q)));
  const [isPending, startTransition] = useTransition();

  const handleChipClick = useCallback(
    (chipLabel: string, ranked: string[], setRanked: (v: string[]) => void, unranked: string[], setUnranked: (v: string[]) => void) => {
      const lastRanked = ranked[ranked.length - 1];
      setRanked([...ranked.slice(0, -1), chipLabel]);
      setUnranked([...unranked.filter(u => u !== chipLabel), lastRanked]);
    },
    []
  );

  const handleSave = () => {
    startTransition(async () => {
      await saveQualities(iAm, iWant);
    });
  };

  const currentRanked = phase === 'i-am' ? iAm : iWant;
  const currentUnranked = phase === 'i-am' ? iAmUnranked : iWantUnranked;
  const setCurrentRanked = phase === 'i-am' ? setIAm : setIWant;
  const setCurrentUnranked = phase === 'i-am' ? setIAmUnranked : setIWantUnranked;

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
            STEP 5 OF 9
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
          {phase === 'i-am' ? 'QUALITIES THAT DESCRIBE YOU' : 'QUALITIES YOU WANT IN A PARTNER'}
        </h1>

        {/* Explanation */}
        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 12.5, lineHeight: 1.7,
          color: 'var(--gray-quiet)', marginTop: 12,
        }}>
          {phase === 'i-am'
            ? 'Rank four qualities that best describe who you are. Be honest — we match what you say you are against what someone else says they want.'
            : 'Now rank four qualities you want most in a partner. These can be different from what you ranked for yourself.'}
        </p>

        {/* Phase indicator */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <div style={{
            flex: 1, height: 3,
            background: 'var(--ink-true)',
          }} />
          <div style={{
            flex: 1, height: 3,
            background: phase === 'i-want' ? 'var(--ink-true)' : 'var(--rule)',
          }} />
        </div>

        {/* Ranked list */}
        <div style={{ marginTop: 24 }}>
          <DragRankList items={currentRanked} onChange={setCurrentRanked} />
        </div>

        {/* Not ranked */}
        <div style={{ marginTop: 24 }}>
          <div style={{
            fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--gray-quiet)', marginBottom: 12,
          }}>
            NOT RANKED
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {currentUnranked.map(chip => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip, currentRanked, setCurrentRanked, currentUnranked, setCurrentUnranked)}
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

        {/* Button */}
        {phase === 'i-am' ? (
          <button
            onClick={() => setPhase('i-want')}
            style={{
              width: '100%', padding: 15, marginTop: 28,
              background: 'var(--ink-true)', color: 'var(--paper)',
              fontFamily: 'var(--font-system)', fontSize: 13.5, fontWeight: 500,
              border: 'none', cursor: 'pointer',
            }}
          >
            next: what you want in a partner
          </button>
        ) : (
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
            {isPending ? 'saving...' : 'save both and continue'}
          </button>
        )}
      </div>

      <FooterLink />
    </div>
  );
}
