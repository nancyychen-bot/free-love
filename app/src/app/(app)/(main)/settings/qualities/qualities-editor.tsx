'use client';

import { useState, useCallback, useTransition } from 'react';
import DragRankList from '@/app/components/DragRankList';
import { updateQualities, updateValues } from '@/lib/actions/ranking-actions';

const ALL_QUALITIES = ['humor', 'candor', 'curiosity', 'warmth', 'ambition', 'steadiness', 'depth', 'playfulness', 'self-awareness'];
const ALL_VALUES = ['family', 'freedom', 'growth', 'honesty', 'adventure', 'faith', 'security', 'creativity', 'justice', 'intellectual life'];

export default function QualitiesEditor({
  initialIAm,
  initialIWant,
  initialValues,
}: {
  initialIAm: string[];
  initialIWant: string[];
  initialValues: string[];
}) {
  const [iAm, setIAm] = useState<string[]>(initialIAm);
  const [iAmUnranked, setIAmUnranked] = useState<string[]>(ALL_QUALITIES.filter(q => !initialIAm.includes(q)));
  const [iWant, setIWant] = useState<string[]>(initialIWant);
  const [iWantUnranked, setIWantUnranked] = useState<string[]>(ALL_QUALITIES.filter(q => !initialIWant.includes(q)));
  const [values, setValues] = useState<string[]>(initialValues);
  const [valuesUnranked, setValuesUnranked] = useState<string[]>(ALL_VALUES.filter(v => !initialValues.includes(v)));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleChipSwap = useCallback(
    (chipLabel: string, ranked: string[], setRanked: (v: string[]) => void, unranked: string[], setUnranked: (v: string[]) => void) => {
      const lastRanked = ranked[ranked.length - 1];
      setRanked([...ranked.slice(0, -1), chipLabel]);
      setUnranked([...unranked.filter(u => u !== chipLabel), lastRanked]);
      setSaved(false);
    },
    []
  );

  const handleSave = () => {
    startTransition(async () => {
      await updateQualities(iAm, iWant);
      await updateValues(values);
      setSaved(true);
    });
  };

  const sectionLabelStyle = {
    fontFamily: 'var(--font-system)',
    fontSize: 10,
    fontWeight: 500 as const,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    color: 'var(--gray-quiet)',
    marginBottom: 12,
  };

  const chipPoolStyle = {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
    marginTop: 12,
  };

  return (
    <>
      {/* QUALITIES I AM */}
      <div style={{ marginTop: 24 }}>
        <div style={sectionLabelStyle}>QUALITIES I AM</div>
        <DragRankList items={iAm} onChange={(next) => { setIAm(next); setSaved(false); }} />
        <div style={{ ...sectionLabelStyle, marginTop: 20 }}>NOT RANKED</div>
        <div style={chipPoolStyle}>
          {iAmUnranked.map(chip => (
            <button
              key={chip}
              onClick={() => handleChipSwap(chip, iAm, setIAm, iAmUnranked, setIAmUnranked)}
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

      <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '28px 0 0' }} />

      {/* QUALITIES I WANT */}
      <div style={{ marginTop: 24 }}>
        <div style={sectionLabelStyle}>QUALITIES I WANT</div>
        <DragRankList items={iWant} onChange={(next) => { setIWant(next); setSaved(false); }} />
        <div style={{ ...sectionLabelStyle, marginTop: 20 }}>NOT RANKED</div>
        <div style={chipPoolStyle}>
          {iWantUnranked.map(chip => (
            <button
              key={chip}
              onClick={() => handleChipSwap(chip, iWant, setIWant, iWantUnranked, setIWantUnranked)}
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

      <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '28px 0 0' }} />

      {/* VALUES */}
      <div style={{ marginTop: 24 }}>
        <div style={sectionLabelStyle}>VALUES</div>
        <DragRankList items={values} onChange={(next) => { setValues(next); setSaved(false); }} />
        <div style={{ ...sectionLabelStyle, marginTop: 20 }}>NOT RANKED</div>
        <div style={chipPoolStyle}>
          {valuesUnranked.map(chip => (
            <button
              key={chip}
              onClick={() => handleChipSwap(chip, values, setValues, valuesUnranked, setValuesUnranked)}
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

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={isPending}
        style={{
          width: '100%', padding: 15, marginTop: 32,
          background: isPending ? 'var(--gray-quiet)' : 'var(--ink-true)',
          color: 'var(--paper)', fontFamily: 'var(--font-system)',
          fontSize: 13.5, fontWeight: 500, border: 'none',
          cursor: isPending ? 'default' : 'pointer',
        }}
      >
        {isPending ? 'saving...' : saved ? 'saved' : 'save changes'}
      </button>
    </>
  );
}
