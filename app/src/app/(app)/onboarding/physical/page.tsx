'use client';

import { useState } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { savePhysical } from '../actions';

interface SingleSelectDef {
  key: string;
  title: string;
  options: string[];
  type: 'single';
}

interface MultiSelectDef {
  key: string;
  title: string;
  options: string[];
  type: 'multi';
  exclusiveOption?: string;
}

type QuestionDef = SingleSelectDef | MultiSelectDef;

const aboutYouQuestions: QuestionDef[] = [
  { key: 'height', title: 'HEIGHT', options: ['short', 'average', 'tall'], type: 'single' },
  { key: 'body_type', title: 'BODY TYPE', options: ['slim', 'athletic', 'average', 'curvy', 'plus-size'], type: 'single' },
  { key: 'ethnicity', title: 'ETHNICITY', options: ['Black', 'White', 'Hispanic / Latino', 'East Asian', 'South Asian', 'Southeast Asian', 'Middle Eastern', 'Mixed', 'other'], type: 'multi' },
  { key: 'fitness', title: 'FITNESS', options: ['very active', 'active', 'moderate', 'not very active'], type: 'single' },
];

const preferenceQuestions: QuestionDef[] = [
  { key: 'height_preference', title: 'HEIGHT PREFERENCE', options: ['taller', 'shorter', 'similar', 'no preference'], type: 'single' },
  { key: 'body_type_preference', title: 'BODY TYPE PREFERENCE', options: ['slim', 'athletic', 'average', 'curvy', 'plus-size', 'no preference'], type: 'multi', exclusiveOption: 'no preference' },
  { key: 'ethnicity_preference', title: 'ETHNICITY PREFERENCE', options: ['Black', 'White', 'Hispanic / Latino', 'East Asian', 'South Asian', 'Southeast Asian', 'Middle Eastern', 'Mixed', 'other', 'no preference'], type: 'multi', exclusiveOption: 'no preference' },
  { key: 'fitness_preference', title: 'FITNESS PREFERENCE', options: ['very active', 'active', 'moderate', 'no preference'], type: 'single' },
];

export default function PhysicalPage() {
  const [singleAnswers, setSingleAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  function selectSingle(key: string, option: string) {
    setSingleAnswers(prev => ({ ...prev, [key]: option }));
  }

  function toggleMulti(key: string, option: string, exclusiveOption?: string) {
    setMultiAnswers(prev => {
      const current = prev[key] ?? [];
      if (option === exclusiveOption) {
        return { ...prev, [key]: current.includes(option) ? [] : [option] };
      }
      if (current.includes(option)) {
        return { ...prev, [key]: current.filter(o => o !== option) };
      }
      return { ...prev, [key]: [...current.filter(o => o !== exclusiveOption), option] };
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    const data: { question: string; answer: string; isDealbreaker: boolean }[] = [];

    const allQuestions = [...aboutYouQuestions, ...preferenceQuestions];
    for (const q of allQuestions) {
      if (q.type === 'single') {
        const answer = singleAnswers[q.key];
        if (answer) {
          data.push({ question: q.key, answer, isDealbreaker: false });
        }
      } else {
        const answers = multiAnswers[q.key] ?? [];
        if (answers.length > 0) {
          data.push({ question: q.key, answer: answers.join(', '), isDealbreaker: false });
        }
      }
    }

    await savePhysical(data);
  }

  function renderSingleSelect(q: SingleSelectDef, isFirst: boolean) {
    return (
      <div key={q.key} style={{ marginTop: isFirst ? 0 : 30 }}>
        <h2
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-true)',
            marginBottom: 0,
          }}
        >
          {q.title}
        </h2>

        <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', marginTop: 12 }} />

        {q.options.map((option, index) => {
          const isSelected = singleAnswers[q.key] === option;
          const isLast = index === q.options.length - 1;

          return (
            <div
              key={option}
              onClick={() => selectSingle(q.key, option)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 0',
                borderBottom: isLast ? '1px solid var(--rule)' : 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 15,
                  color: isSelected ? 'var(--ink-true)' : 'var(--gray-quiet)',
                }}
              >
                {option}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: isSelected ? 11 : 15,
                  color: isSelected ? 'var(--ink-true)' : 'var(--gray-quiet)',
                }}
              >
                {isSelected ? 'selected' : '—'}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  function renderMultiSelect(q: MultiSelectDef, isFirst: boolean) {
    const selected = multiAnswers[q.key] ?? [];

    return (
      <div key={q.key} style={{ marginTop: isFirst ? 0 : 30 }}>
        <h2
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-true)',
            marginBottom: 0,
          }}
        >
          {q.title}
        </h2>

        <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', marginTop: 12 }} />

        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11,
            color: 'var(--gray-quiet)',
            marginTop: 8,
            marginBottom: 4,
          }}
        >
          select any that apply
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {q.options.map(option => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleMulti(q.key, option, q.exclusiveOption)}
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 13.5,
                  color: isSelected ? 'var(--ink-true)' : 'var(--gray-quiet)',
                  border: `1px solid ${isSelected ? 'var(--ink-true)' : 'var(--rule)'}`,
                  background: 'transparent',
                  padding: '9px 12px',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function renderQuestion(q: QuestionDef, isFirst: boolean) {
    if (q.type === 'single') return renderSingleSelect(q, isFirst);
    return renderMultiSelect(q, isFirst);
  }

  return (
    <div className="screen">
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
            STEP 3 OF 10
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
            PRIVATE
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
            marginTop: 30,
          }}
        >
          THE PHYSICAL STUFF
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
          Be honest. Your answers and preferences are used for matching, never
          shown on your profile.
        </p>

        {/* Section: About You */}
        <div style={{ marginTop: 30 }}>
          <div
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--gray-quiet)',
              marginBottom: 20,
            }}
          >
            ABOUT YOU
          </div>

          {aboutYouQuestions.map((q, i) => renderQuestion(q, i === 0))}
        </div>

        {/* Section: Your Preferences */}
        <div style={{ marginTop: 40 }}>
          <div
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--gray-quiet)',
              marginBottom: 20,
            }}
          >
            YOUR PREFERENCES
          </div>

          {preferenceQuestions.map((q, i) => renderQuestion(q, i === 0))}
        </div>

        {/* Footer button */}
        <div style={{ marginTop: 40, paddingBottom: 80 }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: '100%',
              padding: 15,
              background: submitting ? 'var(--gray-quiet)' : 'var(--ink-true)',
              color: 'var(--paper)',
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              fontWeight: 500,
              border: 'none',
              cursor: submitting ? 'default' : 'pointer',
            }}
          >
            {submitting ? 'saving...' : 'save and continue'}
          </button>
        </div>
      </div>

      <FooterLink />
    </div>
  );
}
