'use client';

import { useState, useTransition } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { saveLifeAnswers } from '../actions';

const BIO_PROMPT = 'about me';

const OPTIONAL_PROMPTS = [
  'what a really good day looks like for me',
  'what I\'m most grateful for',
  'what I value most in a friendship',
  'something I\'ve dreamed of doing and why I haven\'t yet',
  'my most treasured memory',
  'something that changed how I see things',
  'what I\'m still figuring out',
  'what I care about most right now',
  'what people get wrong about me',
];

const MIN_OPTIONAL = 2;

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export default function LifeAnswersPage() {
  const [bio, setBio] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function togglePrompt(prompt: string) {
    setSelected(prev => {
      if (prev.includes(prompt)) return prev.filter(p => p !== prompt);
      return [...prev, prompt];
    });
  }

  function updateAnswer(prompt: string, value: string) {
    setAnswers(prev => ({ ...prev, [prompt]: value }));
  }

  const handleSave = () => {
    const allAnswers = [
      { prompt: BIO_PROMPT, answer: bio, displayOrder: 0 },
      ...selected.map((prompt, i) => ({
        prompt,
        answer: answers[prompt] || '',
        displayOrder: i + 1,
      })),
    ];

    startTransition(async () => {
      await saveLifeAnswers(allAnswers);
    });
  };

  const bioValid = bio.trim().length > 0;
  const optionalAnswered = selected.every(p => (answers[p]?.trim().length || 0) > 0);
  const canSubmit = bioValid && selected.length >= MIN_OPTIONAL && optionalAnswered;

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
          IN YOUR OWN WORDS
        </h1>

        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 12.5, lineHeight: 1.7,
          color: 'var(--gray-quiet)', marginTop: 12,
        }}>
          These are designed to help us match you for real compatibility. Your bio is required. Then pick at least two more questions to answer. Add as many as you like.
        </p>

        {/* Required bio */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{
              fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)',
            }}>
              ABOUT ME
            </span>
            <span style={{
              fontFamily: 'var(--font-system)', fontSize: 10,
              color: 'var(--gray-quiet)',
            }}>
              required
            </span>
          </div>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share whatever you think someone should know about you..."
            style={{
              fontFamily: 'var(--font-human)', fontSize: 17, lineHeight: 1.55,
              color: 'var(--ink-human)', width: '100%', minHeight: 120,
              border: '1px solid var(--rule)', padding: 16, resize: 'none',
              background: 'var(--paper)', outline: 'none',
            }}
          />
          <div style={{
            fontFamily: 'var(--font-system)', fontSize: 10,
            color: 'var(--gray-quiet)', marginTop: 6,
          }}>
            ~{countWords(bio)} words
          </div>
        </div>

        {/* Optional prompts — selection */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{
              fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-true)',
            }}>
              ADD MORE
            </span>
            <span style={{
              fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
              letterSpacing: '0.16em',
              color: selected.length >= MIN_OPTIONAL ? 'var(--ink-true)' : 'var(--gray-quiet)',
            }}>
              {selected.length} CHOSEN{selected.length < MIN_OPTIONAL ? ` (${MIN_OPTIONAL - selected.length} MORE)` : ''}
            </span>
          </div>

          {/* Unselected prompts as tappable list */}
          {OPTIONAL_PROMPTS.filter(p => !selected.includes(p)).map(prompt => (
            <div
              key={prompt}
              onClick={() => togglePrompt(prompt)}
              style={{
                padding: '12px 0', borderBottom: '1px solid var(--rule)',
                cursor: 'pointer', fontFamily: 'var(--font-system)',
                fontSize: 13, color: 'var(--gray-quiet)',
              }}
            >
              + {prompt}
            </div>
          ))}
        </div>

        {/* Selected prompts with textareas */}
        {selected.length > 0 && (
          <div style={{ marginTop: 28 }}>
            {selected.map((prompt, index) => (
              <div key={prompt} style={{ marginTop: index === 0 ? 0 : 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{
                    fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
                    letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
                  }}>
                    {prompt}
                  </span>
                  <span
                    onClick={() => togglePrompt(prompt)}
                    style={{
                      fontFamily: 'var(--font-system)', fontSize: 11,
                      color: 'var(--gray-quiet)', cursor: 'pointer',
                    }}
                  >
                    remove
                  </span>
                </div>

                <textarea
                  value={answers[prompt] || ''}
                  onChange={(e) => updateAnswer(prompt, e.target.value)}
                  placeholder="write at least a few sentences..."
                  style={{
                    fontFamily: 'var(--font-human)', fontSize: 17, lineHeight: 1.55,
                    color: 'var(--ink-human)', width: '100%', minHeight: 100,
                    border: '1px solid var(--rule)', padding: 16, resize: 'none',
                    background: 'var(--paper)', outline: 'none',
                  }}
                />
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
          {isPending ? 'saving...' : canSubmit ? 'save and continue' : bio.trim() ? `pick ${Math.max(0, MIN_OPTIONAL - selected.length)} more` : 'write your bio first'}
        </button>
      </div>

      <FooterLink />
    </div>
  );
}
