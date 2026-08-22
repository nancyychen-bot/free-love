'use client';

import { useState } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { savePartnership } from '../actions';

interface QuestionDef {
  key: string;
  title: string;
  options: string[];
}

const questions: QuestionDef[] = [
  { key: 'marriage', title: 'MARRIAGE', options: ['i want to get married', "i'm happy without marriage", 'not sure yet'] },
  { key: 'monogamy', title: 'MONOGAMY', options: ['monogamous', 'open to open', 'poly'] },
  { key: 'kids_have', title: 'DO YOU HAVE KIDS?', options: ['yes', 'no'] },
  { key: 'kids_want', title: 'DO YOU WANT (MORE) KIDS?', options: ['yes', 'no', 'maybe'] },
];

export default function PartnershipPage() {
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
    await savePartnership(data);
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
            STEP 3 OF 9
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
          PARTNERSHIP
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
          Answer honestly. Flag the ones that matter most — you&rsquo;ll only
          match with people who share those answers.
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

              {/* Must-match checkbox */}
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
                  must match
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
