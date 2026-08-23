'use client';

import { useState, useTransition } from 'react';
import { updateRadius } from '@/lib/actions/profile-actions';

export default function RadiusEditor({
  initialRadius,
  locationName,
}: {
  initialRadius: number;
  locationName: string | null;
}) {
  const [radius, setRadius] = useState(initialRadius);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    startTransition(async () => {
      await updateRadius(radius);
      setSaved(true);
    });
  };

  return (
    <>
      <span style={{
        fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
      }}>
        CURRENT RADIUS
      </span>

      <p style={{
        fontFamily: 'var(--font-system)', fontSize: 48, fontWeight: 500,
        color: 'var(--ink-true)', marginTop: 16, textAlign: 'center',
        lineHeight: 1,
      }}>
        {radius}
      </p>
      <p style={{
        fontFamily: 'var(--font-system)', fontSize: 13,
        color: 'var(--gray-quiet)', textAlign: 'center', marginTop: 4,
      }}>
        miles
      </p>

      {/* Slider */}
      <div style={{ position: 'relative', height: 40, marginTop: 28, padding: '0 4px' }}>
        {/* Track background */}
        <div style={{
          position: 'absolute', top: 18, left: 4, right: 4, height: 2,
          background: 'var(--rule)',
        }} />
        {/* Active track */}
        <div style={{
          position: 'absolute', top: 18, height: 2, left: 0,
          width: `${((radius - 1) / (50 - 1)) * 100}%`,
          background: 'var(--ink-true)',
        }} />
        <input
          type="range"
          min={1}
          max={50}
          value={radius}
          onChange={(e) => { setRadius(parseInt(e.target.value)); setSaved(false); }}
          className="range-thumb"
          style={{
            position: 'absolute', top: 8, left: 0, width: '100%',
            appearance: 'none', WebkitAppearance: 'none',
            background: 'transparent', pointerEvents: 'auto',
            zIndex: 2, height: 20,
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)' }}>1</span>
        <span style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)' }}>50</span>
      </div>

      {locationName && (
        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 12,
          color: 'var(--gray-quiet)', marginTop: 20, lineHeight: 1.5,
        }}>
          from {locationName}
        </p>
      )}

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
        {isPending ? 'saving...' : saved ? 'saved' : 'save'}
      </button>
    </>
  );
}
