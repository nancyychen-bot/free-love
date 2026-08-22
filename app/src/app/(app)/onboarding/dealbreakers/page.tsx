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
  { key: 'kids', title: 'KIDS', options: ['i have kids', 'i want kids', "i don't want kids"] },
  { key: 'smoking', title: 'SMOKING', options: ['i smoke', "i don't smoke", 'i smoke sometimes'] },
  { key: 'drinking', title: 'DRINKING', options: ['i drink', "i don't drink", 'i drink socially'] },
  { key: 'religion', title: 'RELIGION', options: ['important to me', 'not important', 'spiritual but not religious'] },
  { key: 'politics', title: 'POLITICS', options: ['progressive', 'moderate', 'conservative'] },
  { key: 'lifestyle', title: 'LIFESTYLE', options: ['homebody', 'social', 'somewhere in between'] },
];

export default function DealbreakersPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hardLines, setHardLines] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  function selectAnswer(questionKey: string, option: string) {
    setAnswers(prev => ({ ...prev, [questionKey]: option }));
  }

  function toggleHardLine(questionKey: string) {
    setHardLines(prev => ({ ...prev, [questionKey]: !prev[questionKey] }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    const data = Object.entries(answers).map(([question, answer]) => ({
      question,
      answer,
      isDealbreaker: !!hardLines[question],
    }));
    await saveAllDealbreakers(data);
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

              {/* Options */}
              {q.options.map((option, index) => {
                const isSelected = answers[q.key] === option;
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
