'use client';

import { useState, useCallback, useTransition } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { saveValues } from '../actions';

const DEFAULT_RANKED = [
  'family',
  'freedom',
  'growth',
  'honesty',
  'adventure',
];
const DEFAULT_UNRANKED = [
  'faith',
  'security',
  'creativity',
  'justice',
  'intellectual life',
];

export default function ValuesPage() {
  const [ranked, setRanked] = useState<string[]>(DEFAULT_RANKED);
  const [unranked, setUnranked] = useState<string[]>(DEFAULT_UNRANKED);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (dragIndex === null) return;
      setDragOverIndex(index);
    },
    [dragIndex]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === dropIndex) {
        setDragIndex(null);
        setDragOverIndex(null);
        return;
      }
      const newRanked = [...ranked];
      const [moved] = newRanked.splice(dragIndex, 1);
      newRanked.splice(dropIndex, 0, moved);
      setRanked(newRanked);
      setDragIndex(null);
      setDragOverIndex(null);
    },
    [dragIndex, ranked]
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

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
      await saveValues(ranked);
    });
  };

  return (
    <div className="screen" style={{ padding: '0 0 60px 0' }}>
      <StatusBar />

      <div style={{ padding: '40px 24px 0' }}>
        {/* Step row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--gray-quiet)',
            }}
          >
            STEP 7 OF 9
          </span>
          <span
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--gray-quiet)',
            }}
          >
            PRIVATE MATCHING INPUT
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-true)',
            marginTop: 28,
          }}
        >
          PUT THESE IN ORDER
        </h1>

        {/* Explanation */}
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 12.5,
            lineHeight: 1.7,
            color: 'var(--gray-quiet)',
            marginTop: 12,
          }}
        >
          Five values, ranked one through five. They cannot be tied. The order is
          what we match on.
        </p>

        {/* Ranked list */}
        <div style={{ marginTop: 28 }}>
          {ranked.map((item, index) => (
            <div
              key={item}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '18px 0',
                borderBottom: '1px solid var(--rule)',
                cursor: 'grab',
                opacity: dragIndex === index ? 0.4 : 1,
                backgroundColor:
                  dragOverIndex === index && dragIndex !== index
                    ? 'var(--introduction-wash)'
                    : 'transparent',
                transition: 'background-color 0.15s ease',
              }}
            >
              {/* Rank number */}
              <span
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 12,
                  color: 'var(--gray-quiet)',
                  width: 14,
                  minWidth: 14,
                }}
              >
                {index + 1}
              </span>

              {/* Label */}
              <span
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 16,
                  color: 'var(--ink-true)',
                  flex: 1,
                  marginLeft: 12,
                }}
              >
                {item}
              </span>

              {/* Drag handle */}
              <span
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 13,
                  color: 'var(--gray-quiet)',
                }}
              >
                ≡
              </span>
            </div>
          ))}
        </div>

        {/* Not ranked section */}
        <div style={{ marginTop: 28 }}>
          <div
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--gray-quiet)',
              marginBottom: 12,
            }}
          >
            NOT RANKED
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {unranked.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 13.5,
                  color: 'var(--gray-quiet)',
                  border: '1px solid var(--rule)',
                  background: 'transparent',
                  padding: '9px 12px',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11.5,
            lineHeight: 1.65,
            color: 'var(--gray-quiet)',
            marginTop: 20,
          }}
        >
          Swap any of these in. You can change the order forever. You cannot rank
          them equally.
        </p>

        {/* Footer button */}
        <button
          onClick={handleSave}
          disabled={isPending}
          style={{
            width: '100%',
            border: '1px solid var(--ink-true)',
            background: 'transparent',
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            color: 'var(--ink-true)',
            padding: '14px 0',
            cursor: isPending ? 'wait' : 'pointer',
            marginTop: 28,
            opacity: isPending ? 0.5 : 1,
            transition: 'background-color 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!isPending) {
              e.currentTarget.style.backgroundColor = 'var(--ink-true)';
              e.currentTarget.style.color = 'var(--paper)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--ink-true)';
          }}
        >
          {isPending ? 'saving...' : 'save this order'}
        </button>
      </div>

      <FooterLink />
    </div>
  );
}
