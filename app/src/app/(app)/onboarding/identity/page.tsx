'use client';

import { useState } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { saveIdentity } from '../actions';

const genderOptions = ['woman', 'man', 'non-binary'];
const orientationOptions = ['straight', 'gay', 'lesbian', 'bisexual', 'queer', 'other'];
const seekingOptions = ['women', 'men', 'non-binary people'];

const nycNeighborhoods = [
  // Manhattan
  'Battery Park City',
  'Chelsea',
  'Chinatown',
  'East Village',
  'Financial District',
  'Flatiron',
  'Gramercy',
  'Greenwich Village',
  'Harlem',
  "Hell's Kitchen",
  'Lower East Side',
  'Midtown',
  'Morningside Heights',
  'Murray Hill',
  'NoHo',
  'NoLIta',
  'SoHo',
  'Tribeca',
  'Upper East Side',
  'Upper West Side',
  'Washington Heights',
  'West Village',
  // Brooklyn
  'Bed-Stuy',
  'Boerum Hill',
  'Brooklyn Heights',
  'Bushwick',
  'Carroll Gardens',
  'Clinton Hill',
  'Cobble Hill',
  'Crown Heights',
  'DUMBO',
  'Fort Greene',
  'Gowanus',
  'Greenpoint',
  'Park Slope',
  'Prospect Heights',
  'Prospect Lefferts Gardens',
  'Red Hook',
  'Sunset Park',
  'Williamsburg',
  'Windsor Terrace',
  // Queens
  'Astoria',
  'Long Island City',
  'Ridgewood',
  'Sunnyside',
  'Woodside',
  // The Bronx
  'Riverdale',
  'South Bronx',
];

const labelStyle = {
  display: 'block' as const,
  fontFamily: 'var(--font-system)',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: 'var(--gray-quiet)',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: 13,
  border: '1px solid var(--rule)',
  background: 'var(--paper)',
  fontFamily: 'var(--font-system)',
  fontSize: 13,
  color: 'var(--ink-true)',
  outline: 'none',
};

export default function IdentityPage() {
  const [gender, setGender] = useState('');
  const [customGender, setCustomGender] = useState('');
  const [seeking, setSeeking] = useState<string[]>([]);

  function toggleSeeking(value: string) {
    setSeeking(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
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
              textTransform: 'uppercase' as const,
              color: 'var(--gray-quiet)',
            }}
          >
            STEP 1 OF 9
          </span>
          <span
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase' as const,
              color: 'var(--gray-quiet)',
            }}
          >
            PRIVATE — USED FOR FILTERING
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
            color: 'var(--ink-true)',
            marginTop: 30,
          }}
        >
          WHO YOU ARE AND WHO YOU&rsquo;RE LOOKING FOR
        </h1>

        {/* Form */}
        <form action={saveIdentity} style={{ marginTop: 32 }}>
          {/* Display name */}
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="displayName" style={labelStyle}>Display name</label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              style={inputStyle}
            />
          </div>

          {/* Age */}
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="age" style={labelStyle}>Age</label>
            <input
              id="age"
              name="age"
              type="number"
              required
              min={18}
              max={120}
              style={inputStyle}
            />
          </div>

          {/* Gender identity */}
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="genderSelect" style={labelStyle}>Gender identity</label>
            <select
              id="genderSelect"
              value={gender}
              onChange={e => setGender(e.target.value)}
              style={{
                ...inputStyle,
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <option value="" disabled>select</option>
              {genderOptions.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
              <option value="custom">other (type below)</option>
            </select>
            {gender === 'custom' ? (
              <input
                name="gender"
                type="text"
                required
                placeholder="how do you identify?"
                value={customGender}
                onChange={e => setCustomGender(e.target.value)}
                style={{ ...inputStyle, marginTop: 8 }}
              />
            ) : (
              <input type="hidden" name="gender" value={gender} />
            )}
          </div>

          {/* Sexual orientation */}
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="orientation" style={labelStyle}>Sexual orientation</label>
            <select
              id="orientation"
              name="orientation"
              required
              style={{
                ...inputStyle,
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <option value="" disabled>select</option>
              {orientationOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Who you're looking for */}
          <div style={{ marginBottom: 20 }}>
            <span style={labelStyle}>Who you&rsquo;re looking for</span>
            <div style={{ marginTop: 4 }}>
              {seekingOptions.map(option => (
                <label
                  key={option}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 0',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-system)',
                    fontSize: 13,
                    color: seeking.includes(option) ? 'var(--ink-true)' : 'var(--gray-quiet)',
                  }}
                >
                  <div
                    style={{
                      width: 15,
                      height: 15,
                      minWidth: 15,
                      border: '1px solid var(--ink-true)',
                      backgroundColor: seeking.includes(option) ? 'var(--ink-true)' : 'transparent',
                    }}
                  />
                  <input
                    type="checkbox"
                    name="seeking"
                    value={option}
                    checked={seeking.includes(option)}
                    onChange={() => toggleSeeking(option)}
                    style={{ display: 'none' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="locationName" style={labelStyle}>Which neighborhood do you live in, New York?</label>
            <select
              id="locationName"
              name="locationName"
              required
              defaultValue=""
              style={{
                ...inputStyle,
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <option value="" disabled>select</option>
              {nycNeighborhoods.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div style={{ paddingBottom: 80 }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: 15,
                background: 'var(--ink-true)',
                color: 'var(--paper)',
                fontFamily: 'var(--font-system)',
                fontSize: 13.5,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              save and continue
            </button>
          </div>
        </form>
      </div>

      <FooterLink />
    </div>
  );
}
