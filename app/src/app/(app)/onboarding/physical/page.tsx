'use client';

import { useState } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { savePhysical } from '../actions';

const HEIGHT_OPTIONS = ['short', 'average', 'tall'];
const HEIGHT_PREF_OPTIONS = ['taller', 'shorter', 'similar', 'no preference'];

const BODY_OPTIONS = ['slim', 'athletic', 'average', 'curvy', 'plus-size'];
const BODY_PREF_OPTIONS = ['slim', 'athletic', 'average', 'curvy', 'plus-size', 'no preference'];

const ETHNICITY_OPTIONS = ['Black', 'White', 'Hispanic / Latino', 'East Asian', 'South Asian', 'Southeast Asian', 'Middle Eastern', 'Mixed', 'other'];
const ETHNICITY_PREF_OPTIONS = ['Black', 'White', 'Hispanic / Latino', 'East Asian', 'South Asian', 'Southeast Asian', 'Middle Eastern', 'Mixed', 'other', 'no preference'];

const FITNESS_OPTIONS = ['very active', 'active', 'moderate', 'not very active'];
const FITNESS_PREF_OPTIONS = ['very active', 'active', 'moderate', 'not very active', 'no preference'];

export default function PhysicalPage() {
  const [aboutYou, setAboutYou] = useState<{
    height: string;
    body_type: string;
    ethnicity: string[];
    fitness: string;
  }>({
    height: '',
    body_type: '',
    ethnicity: [],
    fitness: '',
  });

  const [preferences, setPreferences] = useState<{
    height_preference: string;
    body_type_preference: string[];
    ethnicity_preference: string[];
    fitness_preference: string[];
  }>({
    height_preference: '',
    body_type_preference: [],
    ethnicity_preference: [],
    fitness_preference: [],
  });

  const [submitting, setSubmitting] = useState(false);

  function selectAboutSingle(key: 'height' | 'body_type' | 'fitness', value: string) {
    setAboutYou(prev => ({ ...prev, [key]: value }));
  }

  function toggleAboutMulti(key: 'ethnicity', value: string) {
    setAboutYou(prev => {
      const current = prev[key];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(v => v !== value) };
      }
      return { ...prev, [key]: [...current, value] };
    });
  }

  function selectPrefSingle(key: 'height_preference', value: string) {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }

  function togglePrefMulti(key: 'body_type_preference' | 'ethnicity_preference' | 'fitness_preference', value: string) {
    setPreferences(prev => {
      const current = prev[key];
      if (value === 'no preference') {
        return { ...prev, [key]: current.includes('no preference') ? [] : ['no preference'] };
      }
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(v => v !== value) };
      }
      return { ...prev, [key]: [...current.filter(v => v !== 'no preference'), value] };
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    const data = [
      { question: 'height', answer: aboutYou.height, isDealbreaker: false },
      { question: 'body_type', answer: aboutYou.body_type, isDealbreaker: false },
      { question: 'ethnicity', answer: aboutYou.ethnicity.join(', '), isDealbreaker: false },
      { question: 'fitness', answer: aboutYou.fitness, isDealbreaker: false },
      { question: 'height_preference', answer: preferences.height_preference, isDealbreaker: false },
      { question: 'body_type_preference', answer: preferences.body_type_preference.join(', '), isDealbreaker: false },
      { question: 'ethnicity_preference', answer: preferences.ethnicity_preference.join(', '), isDealbreaker: false },
      { question: 'fitness_preference', answer: preferences.fitness_preference.join(', '), isDealbreaker: false },
    ].filter(d => d.answer);

    await savePhysical(data);
  }

  function renderSingleSelectRows(options: string[], selectedValue: string, onSelect: (value: string) => void) {
    return options.map((option, index) => {
      const isSelected = selectedValue === option;
      const isLast = index === options.length - 1;
      return (
        <div
          key={option}
          onClick={() => onSelect(option)}
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
    });
  }

  function renderMultiSelectChips(options: string[], selected: string[], onToggle: (value: string) => void) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(option => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
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
    );
  }

  const subLabelStyle = {
    fontFamily: 'var(--font-system)',
    fontSize: 10,
    fontWeight: 500 as const,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    color: 'var(--gray-quiet)',
  };

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
            fontFamily: 'var(--font-human)',
            fontSize: 17,
            lineHeight: 1.5,
            color: 'var(--ink-human)',
            marginTop: 14,
          }}
        >
          Be honest about yourself and open about what you&rsquo;re attracted to.
          Narrowing your preferences means fewer matches — the more open you are,
          the more introductions you&rsquo;ll receive.
        </p>

        {/* ─── HEIGHT ─── */}
        <div style={{ marginTop: 30 }}>
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
            HEIGHT
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', marginTop: 12 }} />

          <div style={{ ...subLabelStyle, marginTop: 14 }}>YOU ARE</div>
          {renderSingleSelectRows(HEIGHT_OPTIONS, aboutYou.height, (v) => selectAboutSingle('height', v))}

          <div style={{ ...subLabelStyle, marginTop: 20 }}>YOUR PREFERENCE</div>
          {renderSingleSelectRows(HEIGHT_PREF_OPTIONS, preferences.height_preference, (v) => selectPrefSingle('height_preference', v))}
        </div>

        {/* ─── BODY TYPE ─── */}
        <div style={{ marginTop: 30 }}>
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
            BODY TYPE
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', marginTop: 12 }} />

          <div style={{ ...subLabelStyle, marginTop: 14 }}>YOU ARE</div>
          {renderSingleSelectRows(BODY_OPTIONS, aboutYou.body_type, (v) => selectAboutSingle('body_type', v))}

          <div style={{ ...subLabelStyle, marginTop: 20 }}>YOUR PREFERENCE</div>
          {renderMultiSelectChips(BODY_PREF_OPTIONS, preferences.body_type_preference, (v) => togglePrefMulti('body_type_preference', v))}
        </div>

        {/* ─── ETHNICITY ─── */}
        <div style={{ marginTop: 30 }}>
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
            ETHNICITY
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', marginTop: 12 }} />

          <div style={{ ...subLabelStyle, marginTop: 14 }}>YOU ARE</div>
          <div style={{ marginTop: 8 }}>
            {renderMultiSelectChips(ETHNICITY_OPTIONS, aboutYou.ethnicity, (v) => toggleAboutMulti('ethnicity', v))}
          </div>

          <div style={{ ...subLabelStyle, marginTop: 20 }}>YOUR PREFERENCE</div>
          <div style={{ marginTop: 8 }}>
            {renderMultiSelectChips(ETHNICITY_PREF_OPTIONS, preferences.ethnicity_preference, (v) => togglePrefMulti('ethnicity_preference', v))}
          </div>
        </div>

        {/* ─── FITNESS ─── */}
        <div style={{ marginTop: 30 }}>
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
            FITNESS
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', marginTop: 12 }} />

          <div style={{ ...subLabelStyle, marginTop: 14 }}>YOU ARE</div>
          {renderSingleSelectRows(FITNESS_OPTIONS, aboutYou.fitness, (v) => selectAboutSingle('fitness', v))}

          <div style={{ ...subLabelStyle, marginTop: 20 }}>YOUR PREFERENCE</div>
          {renderMultiSelectChips(FITNESS_PREF_OPTIONS, preferences.fitness_preference, (v) => togglePrefMulti('fitness_preference', v))}
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
