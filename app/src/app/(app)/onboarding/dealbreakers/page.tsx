'use client';

import { useState } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { saveAllDealbreakers } from '../actions';

interface QuestionDef {
  key: string;
  title: string;
  options: string[];
}

const questions: QuestionDef[] = [
  { key: 'marriage', title: 'MARRIAGE', options: ['i want to get married', "i'm happy without marriage", 'not sure yet'] },
  { key: 'monogamy', title: 'MONOGAMY', options: ['monogamous', 'open to open', 'poly'] },
  { key: 'kids', title: 'KIDS', options: ['i have kids', 'i want kids', "i don't want kids"] },
  { key: 'religion', title: 'RELIGION', options: ['important to me', 'not important', 'spiritual but not religious'] },
  { key: 'politics', title: 'POLITICS', options: ['progressive', 'moderate', 'conservative', 'independent', 'apolitical'] },
  { key: 'drinking', title: 'DRINKING', options: ['i drink', "i don't drink", 'i drink socially'] },
  { key: 'smoking', title: 'SMOKING', options: ['i smoke', "i don't smoke", 'i smoke sometimes'] },
  { key: 'drugs', title: 'DRUGS', options: ["i don't use drugs", 'cannabis', 'psychedelics', 'other'] },
  { key: 'lifestyle', title: 'LIFESTYLE', options: ['homebody', 'social', 'somewhere in between'] },
];

const MULTI_SELECT_KEYS = new Set(['drugs']);
const EXCLUSIVE_OPTIONS: Record<string, string> = {
  drugs: "i don't use drugs",
};

const religionOptions = [
  'Christian — Catholic',
  'Christian — Protestant',
  'Christian — Orthodox',
  'Christian — other',
  'Jewish',
  'Muslim',
  'Hindu',
  'Buddhist',
  'Sikh',
  'other',
];

export default function DealbreakersPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [hardLines, setHardLines] = useState<Record<string, boolean>>({});
  const [religionDetail, setReligionDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function isOptionSelected(questionKey: string, option: string): boolean {
    if (MULTI_SELECT_KEYS.has(questionKey)) {
      return (multiAnswers[questionKey] ?? []).includes(option);
    }
    return answers[questionKey] === option;
  }

  function selectAnswer(questionKey: string, option: string) {
    if (MULTI_SELECT_KEYS.has(questionKey)) {
      // Multi-select behavior
      setMultiAnswers(prev => {
        const current = prev[questionKey] ?? [];
        const exclusive = EXCLUSIVE_OPTIONS[questionKey];
        let next: string[];
        if (current.includes(option)) {
          // Deselect
          next = current.filter(o => o !== option);
        } else if (option === exclusive) {
          // Selecting the exclusive option (e.g., "i don't use drugs") clears others
          next = [option];
        } else {
          // Selecting a non-exclusive option — remove exclusive if it was selected
          next = [...current.filter(o => o !== exclusive), option];
        }
        return { ...prev, [questionKey]: next };
      });
      return;
    }

    setAnswers(prev => ({ ...prev, [questionKey]: option }));
    if (questionKey === 'religion' && option !== 'important to me') {
      setReligionDetail('');
    }
  }

  function toggleHardLine(questionKey: string) {
    setHardLines(prev => ({ ...prev, [questionKey]: !prev[questionKey] }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    const singleData = Object.entries(answers).map(([question, answer]) => {
      const finalAnswer =
        question === 'religion' && answer === 'important to me' && religionDetail
          ? `important to me — ${religionDetail}`
          : answer;
      return {
        question,
        answer: finalAnswer,
        isDealbreaker: !!hardLines[question],
      };
    });
    const multiData = Object.entries(multiAnswers)
      .filter(([, options]) => options.length > 0)
      .map(([question, options]) => ({
        question,
        answer: options.join(', '),
        isDealbreaker: !!hardLines[question],
      }));
    await saveAllDealbreakers([...singleData, ...multiData]);
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
            STEP 4 OF 9
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
          THE DEALBREAKER QUESTIONS
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
          Answer each honestly. Flag the ones that are a hard line — we will
          never match you across a flagged answer.
        </p>

        {/* Questions */}
        <div style={{ marginTop: 30 }}>
          {questions.map((q, qIndex) => (
            <div key={q.key} style={{ marginTop: qIndex === 0 ? 0 : 30 }}>
              {/* Question title */}
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

              {/* Hairline */}
              <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', marginTop: 12 }} />

              {/* Multi-select hint */}
              {MULTI_SELECT_KEYS.has(q.key) && (
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
              )}

              {/* Options */}
              {q.options.map((option, index) => {
                const isSelected = isOptionSelected(q.key, option);
                const isLast = index === q.options.length - 1;

                return (
                  <div
                    key={option}
                    onClick={() => selectAnswer(q.key, option)}
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

              {/* Religion follow-up dropdown */}
              {q.key === 'religion' && answers.religion === 'important to me' && (
                <div style={{ marginTop: 16 }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-system)',
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--gray-quiet)',
                      marginBottom: 6,
                    }}
                  >
                    which one?
                  </label>
                  <select
                    value={religionDetail}
                    onChange={e => setReligionDetail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 13,
                      border: '1px solid var(--rule)',
                      background: 'var(--paper)',
                      fontFamily: 'var(--font-system)',
                      fontSize: 13,
                      color: 'var(--ink-true)',
                      outline: 'none',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                    }}
                  >
                    <option value="" disabled>select</option>
                    {religionOptions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Hard line checkbox */}
              <div
                onClick={() => toggleHardLine(q.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 16,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 15,
                    height: 15,
                    minWidth: 15,
                    border: '1px solid var(--ink-true)',
                    backgroundColor: hardLines[q.key] ? 'var(--ink-true)' : 'transparent',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-system)',
                    fontSize: 15,
                    color: 'var(--ink-true)',
                  }}
                >
                  this is a hard line
                </span>
              </div>
            </div>
          ))}
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
