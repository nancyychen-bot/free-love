'use client';

import { useState } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { savePhysical } from '../actions';

const HEIGHT_OPTIONS = ['short', 'average', 'tall'];
const HEIGHT_PREF_OPTIONS = ['short', 'average', 'tall', 'no preference'];

const BODY_OPTIONS = ['slim', 'athletic', 'average', 'curvy', 'plus-size'];
const BODY_PREF_OPTIONS = ['slim', 'athletic', 'average', 'curvy', 'plus-size', 'no preference'];

const ETHNICITY_OPTIONS = ['Black', 'White', 'Hispanic / Latino', 'East Asian', 'South Asian', 'Southeast Asian', 'Middle Eastern', 'Mixed', 'other'];
const ETHNICITY_PREF_OPTIONS = ['Black', 'White', 'Hispanic / Latino', 'East Asian', 'South Asian', 'Southeast Asian', 'Middle Eastern', 'Mixed', 'other', 'no preference'];

const HAIR_OPTIONS = ['black', 'brown', 'blonde', 'red', 'gray', 'bald', 'other'];
const HAIR_PREF_OPTIONS = ['black', 'brown', 'blonde', 'red', 'gray', 'bald', 'other', 'no preference'];

const FITNESS_OPTIONS = ['very active', 'active', 'moderate', 'not very active'];
const FITNESS_PREF_OPTIONS = ['very active', 'active', 'moderate', 'not very active', 'no preference'];

export default function PhysicalPage() {
  const [ageMin, setAgeMin] = useState(22);
  const [ageMax, setAgeMax] = useState(45);
  const [ageDealbreaker, setAgeDealbreaker] = useState(false);

  // Your height in inches
  const [myHeight, setMyHeight] = useState(66); // 5'6" default

  // Height preference in total inches
  const [heightMin, setHeightMin] = useState(60); // 5'0"
  const [heightMax, setHeightMax] = useState(76); // 6'4"
  const [heightNoPreference, setHeightNoPreference] = useState(true);

  function inchesToDisplay(inches: number): string {
    const ft = Math.floor(inches / 12);
    const rem = inches % 12;
    return `${ft}'${rem}"`;
  }

  const [aboutYou, setAboutYou] = useState<{
    height: string;
    body_type: string;
    hair_color: string;
    ethnicity: string[];
    fitness: string;
  }>({
    height: '',
    body_type: '',
    hair_color: '',
    ethnicity: [],
    fitness: '',
  });

  const [preferences, setPreferences] = useState<{
    height_preference: string[];
    body_type_preference: string[];
    hair_color_preference: string[];
    ethnicity_preference: string[];
    fitness_preference: string[];
  }>({
    height_preference: [],
    body_type_preference: [],
    hair_color_preference: [],
    ethnicity_preference: [],
    fitness_preference: [],
  });

  const [prefDealbreakers, setPrefDealbreakers] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  function togglePrefDealbreaker(key: string) {
    setPrefDealbreakers(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function selectAboutSingle(key: 'height' | 'body_type' | 'hair_color' | 'fitness', value: string) {
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

  function togglePrefMulti(key: 'height_preference' | 'body_type_preference' | 'hair_color_preference' | 'ethnicity_preference' | 'fitness_preference', value: string) {
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
      { question: 'age_preference', answer: `${ageMin}–${ageMax}`, isDealbreaker: ageDealbreaker },
      { question: 'height', answer: aboutYou.height, isDealbreaker: false },
      { question: 'my_height', answer: inchesToDisplay(myHeight), isDealbreaker: false },
      { question: 'body_type', answer: aboutYou.body_type, isDealbreaker: false },
      { question: 'hair_color', answer: aboutYou.hair_color, isDealbreaker: false },
      { question: 'ethnicity', answer: aboutYou.ethnicity.join(', '), isDealbreaker: false },
      { question: 'fitness', answer: aboutYou.fitness, isDealbreaker: false },
      { question: 'height_preference', answer: heightNoPreference ? 'no preference' : `${inchesToDisplay(heightMin)}–${inchesToDisplay(heightMax)}`, isDealbreaker: !!prefDealbreakers.height },
      { question: 'body_type_preference', answer: preferences.body_type_preference.join(', '), isDealbreaker: !!prefDealbreakers.body_type },
      { question: 'hair_color_preference', answer: preferences.hair_color_preference.join(', '), isDealbreaker: !!prefDealbreakers.hair_color },
      { question: 'ethnicity_preference', answer: preferences.ethnicity_preference.join(', '), isDealbreaker: !!prefDealbreakers.ethnicity },
      { question: 'fitness_preference', answer: preferences.fitness_preference.join(', '), isDealbreaker: !!prefDealbreakers.fitness },
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

        {/* ─── AGE PREFERENCE ─── */}
        <div style={{ marginTop: 30 }}>
          <h2 style={{
            fontFamily: 'var(--font-system)', fontSize: 14, fontWeight: 500,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--ink-true)', marginBottom: 0,
          }}>
            AGE PREFERENCE
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', marginTop: 12 }} />

          <div style={{ marginTop: 20 }}>
            {/* Display current range */}
            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 22, fontWeight: 500,
              color: 'var(--ink-true)', textAlign: 'center',
            }}>
              {ageMin} — {ageMax}
            </p>

            {/* Double range slider */}
            <div style={{ position: 'relative', height: 40, marginTop: 16, padding: '0 4px' }}>
              {/* Track background */}
              <div style={{
                position: 'absolute', top: 18, left: 4, right: 4, height: 2,
                background: 'var(--rule)',
              }} />
              {/* Active track */}
              <div style={{
                position: 'absolute', top: 18, height: 2,
                left: `${((ageMin - 18) / (65 - 18)) * 100}%`,
                right: `${100 - ((ageMax - 18) / (65 - 18)) * 100}%`,
                background: 'var(--ink-true)',
              }} />

              {/* Min slider */}
              <input
                type="range"
                min={18}
                max={65}
                value={ageMin}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (v < ageMax) setAgeMin(v);
                }}
                style={{
                  position: 'absolute', top: 8, left: 0, width: '100%',
                  appearance: 'none', WebkitAppearance: 'none',
                  background: 'transparent', pointerEvents: 'none',
                  zIndex: 2, height: 20,
                }}
                className="range-thumb"
              />

              {/* Max slider */}
              <input
                type="range"
                min={18}
                max={65}
                value={ageMax}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (v > ageMin) setAgeMax(v);
                }}
                style={{
                  position: 'absolute', top: 8, left: 0, width: '100%',
                  appearance: 'none', WebkitAppearance: 'none',
                  background: 'transparent', pointerEvents: 'none',
                  zIndex: 3, height: 20,
                }}
                className="range-thumb"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)' }}>18</span>
              <span style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)' }}>65+</span>
            </div>
          </div>

          {/* Dealbreaker checkbox */}
          <div
            onClick={() => setAgeDealbreaker(prev => !prev)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginTop: 20, cursor: 'pointer',
            }}
          >
            <div style={{
              width: 15, height: 15, minWidth: 15,
              border: '1px solid var(--ink-true)',
              backgroundColor: ageDealbreaker ? 'var(--ink-true)' : 'transparent',
            }} />
            <span style={{
              fontFamily: 'var(--font-system)', fontSize: 15, color: 'var(--ink-true)',
            }}>
              dealbreaker
            </span>
          </div>
        </div>

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

          {/* Actual height slider */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-system)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)' }}>
                YOUR ACTUAL HEIGHT
              </span>
              <span style={{ fontFamily: 'var(--font-system)', fontSize: 18, fontWeight: 500, color: 'var(--ink-true)' }}>
                {inchesToDisplay(myHeight)}
              </span>
            </div>
            <div style={{ position: 'relative', height: 40, marginTop: 8, padding: '0 4px' }}>
              <div style={{ position: 'absolute', top: 18, left: 4, right: 4, height: 2, background: 'var(--rule)' }} />
              <div style={{ position: 'absolute', top: 18, height: 2, left: 0, width: `${((myHeight - 54) / (84 - 54)) * 100}%`, background: 'var(--ink-true)' }} />
              <input
                type="range" min={54} max={84} value={myHeight}
                onChange={(e) => setMyHeight(parseInt(e.target.value))}
                className="range-thumb"
                style={{
                  position: 'absolute', top: 8, left: 0, width: '100%',
                  appearance: 'none', WebkitAppearance: 'none',
                  background: 'transparent', pointerEvents: 'auto', zIndex: 2, height: 20,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)' }}>4&apos;6&quot;</span>
              <span style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)' }}>7&apos;0&quot;</span>
            </div>
          </div>

          <div style={{ ...subLabelStyle, marginTop: 20 }}>YOUR PREFERENCE</div>

          {/* No preference toggle */}
          <div
            onClick={() => setHeightNoPreference(prev => !prev)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginTop: 10, cursor: 'pointer',
            }}
          >
            <div style={{
              width: 15, height: 15, minWidth: 15,
              border: '1px solid var(--ink-true)',
              backgroundColor: heightNoPreference ? 'var(--ink-true)' : 'transparent',
            }} />
            <span style={{ fontFamily: 'var(--font-system)', fontSize: 14, color: 'var(--ink-true)' }}>
              no preference
            </span>
          </div>

          {/* Height range slider — shown when they DO have a preference */}
          {!heightNoPreference && (
            <div style={{ marginTop: 16 }}>
              <p style={{
                fontFamily: 'var(--font-system)', fontSize: 22, fontWeight: 500,
                color: 'var(--ink-true)', textAlign: 'center',
              }}>
                {inchesToDisplay(heightMin)} — {inchesToDisplay(heightMax)}
              </p>

              <div style={{ position: 'relative', height: 40, marginTop: 16, padding: '0 4px' }}>
                <div style={{
                  position: 'absolute', top: 18, left: 4, right: 4, height: 2,
                  background: 'var(--rule)',
                }} />
                <div style={{
                  position: 'absolute', top: 18, height: 2,
                  left: `${((heightMin - 54) / (84 - 54)) * 100}%`,
                  right: `${100 - ((heightMax - 54) / (84 - 54)) * 100}%`,
                  background: 'var(--ink-true)',
                }} />
                <input
                  type="range" min={54} max={84} value={heightMin}
                  onChange={(e) => { const v = parseInt(e.target.value); if (v < heightMax) setHeightMin(v); }}
                  className="range-thumb"
                  style={{
                    position: 'absolute', top: 8, left: 0, width: '100%',
                    appearance: 'none', WebkitAppearance: 'none',
                    background: 'transparent', pointerEvents: 'none', zIndex: 2, height: 20,
                  }}
                />
                <input
                  type="range" min={54} max={84} value={heightMax}
                  onChange={(e) => { const v = parseInt(e.target.value); if (v > heightMin) setHeightMax(v); }}
                  className="range-thumb"
                  style={{
                    position: 'absolute', top: 8, left: 0, width: '100%',
                    appearance: 'none', WebkitAppearance: 'none',
                    background: 'transparent', pointerEvents: 'none', zIndex: 3, height: 20,
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)' }}>4&apos;6&quot;</span>
                <span style={{ fontFamily: 'var(--font-system)', fontSize: 10, color: 'var(--gray-quiet)' }}>7&apos;0&quot;</span>
              </div>
            </div>
          )}
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
          {preferences.body_type_preference.length > 0 && !preferences.body_type_preference.includes('no preference') && (
            <div onClick={() => togglePrefDealbreaker('body_type')} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, cursor: 'pointer' }}>
              <div style={{ width: 15, height: 15, minWidth: 15, border: '1px solid var(--ink-true)', backgroundColor: prefDealbreakers.body_type ? 'var(--ink-true)' : 'transparent' }} />
              <span style={{ fontFamily: 'var(--font-system)', fontSize: 14, color: 'var(--ink-true)' }}>dealbreaker</span>
            </div>
          )}
        </div>

        {/* ─── HAIR COLOR ─── */}
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
            HAIR COLOR
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', marginTop: 12 }} />
          <div style={subLabelStyle}>YOU ARE</div>
          {renderSingleSelectRows(HAIR_OPTIONS, aboutYou.hair_color, (v) => selectAboutSingle('hair_color', v))}
          <div style={{ ...subLabelStyle, marginTop: 20 }}>YOUR PREFERENCE</div>
          {renderMultiSelectChips(HAIR_PREF_OPTIONS, preferences.hair_color_preference, (v) => togglePrefMulti('hair_color_preference', v))}
          {preferences.hair_color_preference.length > 0 && !preferences.hair_color_preference.includes('no preference') && (
            <div onClick={() => togglePrefDealbreaker('hair_color')} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, cursor: 'pointer' }}>
              <div style={{ width: 15, height: 15, minWidth: 15, border: '1px solid var(--ink-true)', backgroundColor: prefDealbreakers.hair_color ? 'var(--ink-true)' : 'transparent' }} />
              <span style={{ fontFamily: 'var(--font-system)', fontSize: 14, color: 'var(--ink-true)' }}>dealbreaker</span>
            </div>
          )}
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
          {preferences.ethnicity_preference.length > 0 && !preferences.ethnicity_preference.includes('no preference') && (
            <div onClick={() => togglePrefDealbreaker('ethnicity')} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, cursor: 'pointer' }}>
              <div style={{ width: 15, height: 15, minWidth: 15, border: '1px solid var(--ink-true)', backgroundColor: prefDealbreakers.ethnicity ? 'var(--ink-true)' : 'transparent' }} />
              <span style={{ fontFamily: 'var(--font-system)', fontSize: 14, color: 'var(--ink-true)' }}>dealbreaker</span>
            </div>
          )}
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
          {preferences.fitness_preference.length > 0 && !preferences.fitness_preference.includes('no preference') && (
            <div onClick={() => togglePrefDealbreaker('fitness')} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, cursor: 'pointer' }}>
              <div style={{ width: 15, height: 15, minWidth: 15, border: '1px solid var(--ink-true)', backgroundColor: prefDealbreakers.fitness ? 'var(--ink-true)' : 'transparent' }} />
              <span style={{ fontFamily: 'var(--font-system)', fontSize: 14, color: 'var(--ink-true)' }}>dealbreaker</span>
            </div>
          )}
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
