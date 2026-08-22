'use client';

import { useState, useTransition } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { saveLifeAnswers } from '../actions';

const PROMPTS = [
  'THE KIND OF PEOPLE I’M DRAWN TO',
  'WHAT A GOOD LIFE LOOKS LIKE TO ME',
  'SOMETHING I’VE LEARNED ABOUT MYSELF RECENTLY',
];

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export default function LifeAnswersPage() {
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [isPending, startTransition] = useTransition();

  const updateAnswer = (index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      await saveLifeAnswers(
        PROMPTS.map((prompt, index) => ({
          prompt,
          answer: answers[index],
          displayOrder: index + 1,
        }))
      );
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
            STEP 8 OF 9
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
            PUBLIC — SHOWN ON YOUR PROFILE
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
          THREE QUESTIONS, IN YOUR OWN WORDS
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
          These appear on your profile and are read by the matching engine. Write
          at least a few sentences.
        </p>

        {/* Questions */}
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {PROMPTS.map((prompt, index) => (
            <div key={prompt}>
              {/* Prompt label */}
              <div
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--gray-quiet)',
                  marginBottom: 10,
                }}
              >
                {prompt}
              </div>

              {/* Textarea */}
              <textarea
                value={answers[index]}
                onChange={(e) => updateAnswer(index, e.target.value)}
                style={{
                  fontFamily: 'var(--font-human)',
                  fontSize: 18.5,
                  lineHeight: 1.62,
                  color: 'var(--ink-human)',
                  width: '100%',
                  minHeight: 120,
                  border: '1px solid var(--rule)',
                  padding: 16,
                  resize: 'none',
                  background: 'var(--paper)',
                  outline: 'none',
                }}
              />

              {/* Word count */}
              <div
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 10,
                  color: 'var(--gray-quiet)',
                  marginTop: 6,
                }}
              >
                ~{countWords(answers[index])} words
              </div>
            </div>
          ))}
        </div>

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
          {isPending ? 'saving...' : 'save and continue'}
        </button>
      </div>

      <FooterLink />
    </div>
  );
}
