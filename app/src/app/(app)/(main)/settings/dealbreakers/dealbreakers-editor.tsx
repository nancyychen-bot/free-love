'use client';

import { useState, useTransition } from 'react';
import { updateDealbreaker, toggleDealbreaker } from '@/lib/actions/dealbreaker-actions';

const ANSWER_OPTIONS: Record<string, string[]> = {
  marriage: ['i want to get married', "i'm happy without marriage", 'not sure yet'],
  monogamy: ['monogamous', 'open to open', 'poly'],
  kids_have: ['yes', 'no'],
  kids_want: ['yes', 'no', 'maybe'],
  religion: ['important to me', 'not important', 'spiritual but not religious'],
  politics: ['progressive', 'moderate', 'conservative', 'independent', 'apolitical'],
  drinking: ['i drink', "i don't drink", 'i drink socially'],
  smoking: ['i smoke', "i don't smoke", 'i smoke sometimes'],
  drugs: ["i don't use drugs", 'cannabis', 'psychedelics', 'other'],
  lifestyle: ['homebody', 'social', 'somewhere in between'],
  sexuality: ['vanilla', 'kinky'],
  height: ['short', 'average', 'tall'],
  body_type: ['slim', 'athletic', 'average', 'curvy', 'plus-size'],
  hair_color: ['black', 'brown', 'blonde', 'red', 'gray', 'bald', 'other'],
  fitness: ['very active', 'active', 'moderate', 'not very active'],
};

const DEALBREAKER_QUESTIONS = ['marriage', 'monogamy', 'kids_have', 'kids_want', 'religion', 'politics', 'drinking', 'smoking', 'drugs', 'lifestyle', 'sexuality'];
const PHYSICAL_QUESTIONS = ['height', 'body_type', 'hair_color', 'ethnicity', 'fitness'];
const PREFERENCE_QUESTIONS = ['height_preference', 'body_type_preference', 'hair_color_preference', 'ethnicity_preference', 'fitness_preference'];

type BasicRow = {
  id: string;
  question: string;
  answer: string;
  isDealbreaker: boolean;
};

function formatLabel(q: string): string {
  return q
    .replace(/_preference$/, ' preference')
    .replace(/_/g, ' ')
    .replace('kids have', 'do you have kids')
    .replace('kids want', 'do you want kids');
}

function RowEditor({ row }: { row: BasicRow }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const options = ANSWER_OPTIONS[row.question];

  const handleSelect = (newAnswer: string) => {
    setEditing(false);
    startTransition(async () => {
      await updateDealbreaker(row.id, newAnswer, row.isDealbreaker);
    });
  };

  const handleToggle = () => {
    startTransition(async () => {
      await toggleDealbreaker(row.id);
    });
  };

  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{
          fontFamily: 'var(--font-system)', fontSize: 11,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--gray-quiet)',
        }}>
          {formatLabel(row.question)}
        </span>
        {DEALBREAKER_QUESTIONS.includes(row.question) && (
          <button
            onClick={handleToggle}
            disabled={isPending}
            style={{
              background: 'none', border: 'none', padding: 0,
              fontFamily: 'var(--font-system)', fontSize: 10,
              color: row.isDealbreaker ? '#8B0000' : 'var(--gray-quiet)',
              cursor: 'pointer',
            }}
          >
            {row.isDealbreaker ? 'dealbreaker' : 'not a dealbreaker'}
          </button>
        )}
      </div>

      {options && !editing ? (
        <button
          onClick={() => setEditing(true)}
          style={{
            background: 'none', border: 'none', padding: 0,
            fontFamily: 'var(--font-system)', fontSize: 13,
            color: 'var(--ink-true)', marginTop: 4,
            cursor: 'pointer', textAlign: 'left',
            textDecoration: 'underline',
            textDecorationColor: 'var(--rule)',
            textUnderlineOffset: '3px',
          }}
        >
          {row.answer}
        </button>
      ) : options && editing ? (
        <div style={{ marginTop: 8 }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: opt === row.answer ? 'var(--introduction-wash)' : 'none',
                border: 'none', padding: '10px 8px',
                fontFamily: 'var(--font-system)', fontSize: 13,
                color: opt === row.answer ? 'var(--ink-true)' : 'var(--gray-quiet)',
                cursor: 'pointer',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 13,
          color: 'var(--ink-true)', marginTop: 4,
        }}>
          {row.answer}
        </p>
      )}
    </div>
  );
}

export default function DealbreakersEditor({
  dealbreakers,
  physical,
  preferences,
}: {
  dealbreakers: BasicRow[];
  physical: BasicRow[];
  preferences: BasicRow[];
}) {
  const sectionLabelStyle = {
    fontFamily: 'var(--font-system)',
    fontSize: 10,
    fontWeight: 500 as const,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    color: 'var(--ink-true)',
    marginBottom: 8,
  };

  return (
    <>
      {dealbreakers.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <p style={sectionLabelStyle}>DEALBREAKERS</p>
          {dealbreakers.map(d => <RowEditor key={d.id} row={d} />)}
        </div>
      )}

      {physical.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <p style={sectionLabelStyle}>ABOUT YOU</p>
          {physical.map(d => <RowEditor key={d.id} row={d} />)}
        </div>
      )}

      {preferences.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <p style={sectionLabelStyle}>YOUR PREFERENCES</p>
          {preferences.map(d => <RowEditor key={d.id} row={d} />)}
        </div>
      )}
    </>
  );
}
