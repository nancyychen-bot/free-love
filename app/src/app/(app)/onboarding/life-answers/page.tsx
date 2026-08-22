'use client';

import { useState, useTransition } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { saveLifeAnswers } from '../actions';

const ALL_PROMPTS = [
  'what a really good day looks like for me',
  'what I\'m most grateful for',
  'what I value most in a friendship',
  'something I\'ve dreamed of doing and why I haven\'t yet',
  'my most treasured memory',
  'something that changed how I see things',
  'one thing I\'d change about how I was raised',
  'what I care about most right now',
  'what people get wrong about me',
];

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export default function LifeAnswersPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function togglePrompt(prompt: string) {
    setSelected(prev => {
      if (prev.includes(prompt)) {
        return prev.filter(p => p !== prompt);
      }
      if (prev.length >= 3) return prev;
      return [...prev, prompt];
    });
  }

  function updateAnswer(prompt: string, value: string) {
    setAnswers(prev => ({ ...prev, [prompt]: value }));
  }

  const handleSave = () => {
    startTransition(async () => {
      await saveLifeAnswers(
        selected.map((prompt, index) => ({
          prompt,
          answer: answers[prompt] || '',
          displayOrder: index + 1,
        }))
      );
    });
  };

  const canSubmit = selected.length === 3 && selected.every(p => (answers[p]?.trim().length || 0) > 0);

  return (
    <div className="screen" style={{ padding: '0 0 60px 0' }}>
      <StatusBar />

      <div style={{ padding: '40px 24px 0' }}>
        {/* Step row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
          }}>
            STEP 8 OF 9
          </span>
          <span style={{
            fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
          }}>
            PUBLIC
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-system)', fontSize: 14, fontWeight: 500,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--ink-true)', marginTop: 28,
        }}>
          PICK THREE AND ANSWER THEM
        </h1>

        {/* Explanation */}
        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 12.5, lineHeight: 1.7,
          color: 'var(--gray-quiet)', marginTop: 12,
        }}>
          These are designed to help us match you for real compatibility — not just shared interests, but how you think and what you care about. They also appear on your profile. Choose the three you connect with most.
        </p>

        {/* Prompt selection — show when < 3 selected */}
        {selected.length < 3 && (
          <div style={{ marginTop: 24 }}>
            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 11,
              color: 'var(--gray-quiet)', marginBottom: 12,
            }}>
              {selected.length} of 3 chosen
            </p>
            {ALL_PROMPTS.filter(p => !selected.includes(p)).map(prompt => (
              <div
                key={prompt}
                onClick={() => togglePrompt(prompt)}
                style={{
                  padding: '14px 0',
                  borderBottom: '1px solid var(--rule)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-system)',
                  fontSize: 14,
                  color: 'var(--gray-quiet)',
                }}
              >
                {prompt}
              </div>
            ))}
          </div>
        )}

        {/* Selected prompts with text areas */}
        {selected.length > 0 && (
          <div style={{ marginTop: 28 }}>
            {selected.map((prompt, index) => (
              <div key={prompt} style={{ marginTop: index === 0 ? 0 : 28 }}>
                {/* Prompt label with remove option */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{
                    fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
                    letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
                  }}>
                    {prompt}
                  </span>
                  <span
                    onClick={() => setSelected(prev => prev.filter(p => p !== prompt))}
                    style={{
                      fontFamily: 'var(--font-system)', fontSize: 11,
                      color: 'var(--gray-quiet)', cursor: 'pointer',
                    }}
                  >
                    change
                  </span>
                </div>

                {/* Textarea */}
                <textarea
                  value={answers[prompt] || ''}
                  onChange={(e) => updateAnswer(prompt, e.target.value)}
                  placeholder="write at least a few sentences..."
                  style={{
                    fontFamily: 'var(--font-human)', fontSize: 17, lineHeight: 1.55,
                    color: 'var(--ink-human)', width: '100%', minHeight: 120,
                    border: '1px solid var(--rule)', padding: 16, resize: 'none',
                    background: 'var(--paper)', outline: 'none',
                  }}
                />

                {/* Word count */}
                <div style={{
                  fontFamily: 'var(--font-system)', fontSize: 10,
                  color: 'var(--gray-quiet)', marginTop: 6,
                }}>
                  ~{countWords(answers[prompt] || '')} words
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSave}
          disabled={isPending || !canSubmit}
          style={{
            width: '100%', padding: 15, marginTop: 32,
            background: (isPending || !canSubmit) ? 'var(--gray-quiet)' : 'var(--ink-true)',
            color: 'var(--paper)', fontFamily: 'var(--font-system)',
            fontSize: 13.5, fontWeight: 500, border: 'none',
            cursor: (isPending || !canSubmit) ? 'default' : 'pointer',
          }}
        >
          {isPending ? 'saving...' : canSubmit ? 'save and continue' : `pick ${3 - selected.length} more`}
        </button>
      </div>

      <FooterLink />
    </div>
  );
}
