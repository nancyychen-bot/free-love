'use client';

import { useState } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { saveLifestyle } from '../actions';

interface QuestionDef {
  key: string;
  title: string;
  options: string[];
}

const questions: QuestionDef[] = [
  { key: 'drinking', title: 'DRINKING', options: ['i drink', "i don't drink", 'i drink socially'] },
  { key: 'smoking', title: 'SMOKING', options: ['i smoke', "i don't smoke", 'i smoke sometimes'] },
  { key: 'drugs', title: 'DRUGS', options: ["i don't use drugs", 'cannabis', 'psychedelics', 'other'] },
  { key: 'lifestyle', title: 'LIFESTYLE', options: ['homebody', 'social', 'somewhere in between'] },
  { key: 'sexuality', title: 'IN THE BEDROOM', options: ['vanilla', 'kinky'] },
];

const KINK_OPTIONS = [
  'dominant', 'submissive', 'switch', 'bdsm', 'rough', 'sensual', 'threesome', 'parties',
];

const MULTI_SELECT_KEYS = new Set(['drugs', 'kinks']);
const EXCLUSIVE_OPTIONS: Record<string, string> = {
  drugs: "i don't use drugs",
};
const FLEXIBLE_ANSWERS = new Set(['somewhere in between', 'i drink socially', 'i smoke sometimes']);

export default function LifestylePage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [hardLines, setHardLines] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  function isOptionSelected(questionKey: string, option: string): boolean {
    if (MULTI_SELECT_KEYS.has(questionKey)) {
      return (multiAnswers[questionKey] ?? []).includes(option);
    }
    return answers[questionKey] === option;
  }

  function selectAnswer(questionKey: string, option: string) {
    if (MULTI_SELECT_KEYS.has(questionKey)) {
      setMultiAnswers(prev => {
        const current = prev[questionKey] ?? [];
        const exclusive = EXCLUSIVE_OPTIONS[questionKey];
        let next: string[];
        if (current.includes(option)) {
          next = current.filter(o => o !== option);
        } else if (option === exclusive) {
          next = [option];
        } else {
          next = [...current.filter(o => o !== exclusive), option];
        }
        return { ...prev, [questionKey]: next };
      });
      return;
    }

    setAnswers(prev => ({ ...prev, [questionKey]: option }));
  }

  function toggleHardLine(questionKey: string) {
    setHardLines(prev => ({ ...prev, [questionKey]: !prev[questionKey] }));
  }

  function toggleKink(kink: string) {
    setMultiAnswers(prev => {
      const current = prev['kinks'] ?? [];
      const next = current.includes(kink)
        ? current.filter(k => k !== kink)
        : [...current, kink];
      return { ...prev, kinks: next };
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    const singleData = Object.entries(answers).map(([question, answer]) => {
      let finalAnswer = answer;
      // Append kinks if kinky
      if (question === 'sexuality' && answer === 'kinky' && (multiAnswers['kinks'] ?? []).length > 0) {
        finalAnswer = `kinky: ${(multiAnswers['kinks'] ?? []).join(', ')}`;
      }
      return {
        question,
        answer: finalAnswer,
        isDealbreaker: !!hardLines[question],
      };
    });
    const multiData = Object.entries(multiAnswers)
      .filter(([key, options]) => key !== 'kinks' && options.length > 0)
      .map(([question, options]) => ({
        question,
        answer: options.join(', '),
        isDealbreaker: !!hardLines[question],
      }));
    await saveLifestyle([...singleData, ...multiData]);
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
            STEP 5 OF 9
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
          LIFESTYLE
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
          Answer honestly. Mark any dealbreakers — we&rsquo;ll never match you across
          one.
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

              {/* Kink options — shown when "kinky" is selected */}
              {q.key === 'sexuality' && answers.sexuality === 'kinky' && (
                <div style={{ marginTop: 16 }}>
                  <p style={{
                    fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'var(--gray-quiet)', marginBottom: 10,
                  }}>
                    PREFERENCES — THESE HELP US MATCH, NOT FILTER
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {KINK_OPTIONS.map(kink => {
                      const isKinkSelected = (multiAnswers['kinks'] ?? []).includes(kink);
                      return (
                        <button
                          key={kink}
                          onClick={() => toggleKink(kink)}
                          style={{
                            fontFamily: 'var(--font-system)', fontSize: 13.5,
                            color: isKinkSelected ? 'var(--ink-true)' : 'var(--gray-quiet)',
                            border: `1px solid ${isKinkSelected ? 'var(--ink-true)' : 'var(--rule)'}`,
                            background: 'transparent', padding: '9px 12px',
                            cursor: 'pointer', lineHeight: 1,
                          }}
                        >
                          {kink}
                        </button>
                      );
                    })}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-system)', fontSize: 11,
                    lineHeight: 1.6, color: 'var(--gray-quiet)', marginTop: 12,
                  }}>
                    The dealbreaker is kinky vs. vanilla. Your specific preferences are weighted in matching but never used as a hard filter.
                  </p>
                </div>
              )}

              {/* Dealbreaker checkbox — hidden on flexible/middle-ground answers */}
              {(() => {
                const selected = MULTI_SELECT_KEYS.has(q.key)
                  ? (multiAnswers[q.key] ?? []).length > 0
                  : !!answers[q.key];
                const isFlexible = !MULTI_SELECT_KEYS.has(q.key) && FLEXIBLE_ANSWERS.has(answers[q.key] ?? '');
                if (!selected || isFlexible) return null;
                return (
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
                      dealbreaker
                    </span>
                  </div>
                );
              })()}
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
