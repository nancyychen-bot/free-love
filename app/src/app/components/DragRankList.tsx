'use client';

import { useState, useRef, useCallback } from 'react';

export default function DragRankList({
  items,
  onChange,
}: {
  items: string[];
  onChange: (newItems: string[]) => void;
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartY = useRef(0);
  const touchDragIdx = useRef<number | null>(null);

  // Desktop drag
  const onDragStart = useCallback((i: number) => setDragIdx(i), []);
  const onDragOver = useCallback((e: React.DragEvent, i: number) => {
    e.preventDefault();
    setOverIdx(i);
  }, []);
  const onDrop = useCallback((e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== dropIdx) {
      const next = [...items];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(dropIdx, 0, moved);
      onChange(next);
    }
    setDragIdx(null);
    setOverIdx(null);
  }, [dragIdx, items, onChange]);
  const onDragEnd = useCallback(() => { setDragIdx(null); setOverIdx(null); }, []);

  // Touch drag
  const onTouchStart = useCallback((e: React.TouchEvent, i: number) => {
    touchStartY.current = e.touches[0].clientY;
    touchDragIdx.current = i;
    setDragIdx(i);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchDragIdx.current === null) return;
    e.preventDefault();
    const touchY = e.touches[0].clientY;

    // Find which row the touch is over
    for (let i = 0; i < rowRefs.current.length; i++) {
      const row = rowRefs.current[i];
      if (!row) continue;
      const rect = row.getBoundingClientRect();
      if (touchY >= rect.top && touchY <= rect.bottom) {
        setOverIdx(i);
        break;
      }
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    const from = touchDragIdx.current;
    const to = overIdx;
    if (from !== null && to !== null && from !== to) {
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onChange(next);
    }
    touchDragIdx.current = null;
    setDragIdx(null);
    setOverIdx(null);
  }, [overIdx, items, onChange]);

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item}
          ref={(el) => { rowRefs.current[index] = el; }}
          draggable
          onDragStart={() => onDragStart(index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDrop={(e) => onDrop(e, index)}
          onDragEnd={onDragEnd}
          onTouchStart={(e) => onTouchStart(e, index)}
          onTouchMove={(e) => onTouchMove(e)}
          onTouchEnd={onTouchEnd}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '18px 0',
            borderBottom: '1px solid var(--rule)',
            cursor: 'grab',
            opacity: dragIdx === index ? 0.4 : 1,
            backgroundColor: overIdx === index && dragIdx !== index ? 'var(--introduction-wash)' : 'transparent',
            transition: 'background-color 0.15s ease',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-system)', fontSize: 12,
            color: 'var(--gray-quiet)', width: 14, minWidth: 14,
          }}>
            {index + 1}
          </span>
          <span style={{
            fontFamily: 'var(--font-system)', fontSize: 16,
            color: 'var(--ink-true)', flex: 1, marginLeft: 12,
          }}>
            {item}
          </span>
          <span style={{
            fontFamily: 'var(--font-system)', fontSize: 13,
            color: 'var(--gray-quiet)',
          }}>
            ≡
          </span>
        </div>
      ))}
    </div>
  );
}
