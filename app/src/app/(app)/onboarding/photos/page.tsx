'use client';

import { useState, useRef, useTransition } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { savePhotos } from '../actions';

const REQUIRED_THEMES = ['just me', 'me, again'];

const OPTIONAL_THEMES = [
  'me in my element',
  'my living space',
  'my bookshelf',
  'my neighborhood',
  'something I love doing',
  'what I\'m working on',
  'how I move',
  'something I made or cooked',
  'where I spend my weekends',
  'my people',
  'my pet(s)',
  'my favorite place',
  'a place I\'ve traveled to',
];

const MIN_OPTIONAL = 3; // 2 required + 3 optional = 5 minimum

export default function PhotosPage() {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [phase, setPhase] = useState<'choose' | 'upload'>('choose');
  const [uploadedUrls, setUploadedUrls] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const allThemes = [...REQUIRED_THEMES, ...selectedThemes];
  const uploadedCount = Object.keys(uploadedUrls).length;
  const allUploaded = allThemes.every((t) => uploadedUrls[t]);

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const handleContinue = () => {
    if (selectedThemes.length >= MIN_OPTIONAL) {
      setPhase('upload');
    }
  };

  const handleFileSelect = async (theme: string, file: File) => {
    setUploading((prev) => ({ ...prev, [theme]: true }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('theme', theme);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setUploadedUrls((prev) => ({ ...prev, [theme]: data.url }));
    } catch {
      // silently fail — user can retry by tapping again
    } finally {
      setUploading((prev) => ({ ...prev, [theme]: false }));
    }
  };

  const handleFinish = () => {
    const photos = allThemes
      .filter((t) => uploadedUrls[t])
      .map((t) => ({ theme: t, url: uploadedUrls[t] }));

    startTransition(async () => {
      await savePhotos(photos);
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
            STEP 9 OF 9
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
            PUBLIC
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
          YOUR PHOTOS
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
          {phase === ‘choose’
            ? "Two face photos are required. Pick at least three more themes — as many as you like. The more you share, the more someone can see who you are."
            : "Upload a photo for each theme. Tap a box to choose a file."}
        </p>

        {phase === 'choose' && (
          <>
            {/* Required themes */}
            <div style={{ marginTop: 28 }}>
              <div
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--gray-quiet)',
                  marginBottom: 12,
                }}
              >
                TWO FACE PHOTOS — REQUIRED
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {REQUIRED_THEMES.map(theme => (
                  <div
                    key={theme}
                    style={{
                      fontFamily: 'var(--font-system)',
                      fontSize: 13.5,
                      color: 'var(--ink-true)',
                      border: '1px solid var(--ink-true)',
                      padding: '9px 12px',
                      lineHeight: 1,
                    }}
                  >
                    {theme}
                  </div>
                ))}
              </div>
            </div>

            {/* Optional themes */}
            <div style={{ marginTop: 28 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
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
                  CHOOSE YOUR THEMES
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-system)',
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.16em',
                    color:
                      selectedThemes.length >= MIN_OPTIONAL
                        ? 'var(--ink-true)'
                        : 'var(--gray-quiet)',
                  }}
                >
                  {selectedThemes.length} CHOSEN{selectedThemes.length < MIN_OPTIONAL ? ` (${MIN_OPTIONAL - selectedThemes.length} MORE)` : ''}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                {OPTIONAL_THEMES.map((theme) => {
                  const isSelected = selectedThemes.includes(theme);
                  return (
                    <button
                      key={theme}
                      onClick={() => toggleTheme(theme)}
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
                      {theme}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Continue button */}
            <button
              onClick={handleContinue}
              disabled={selectedThemes.length < MIN_OPTIONAL}
              style={{
                width: '100%',
                border: '1px solid var(--ink-true)',
                background: 'transparent',
                fontFamily: 'var(--font-system)',
                fontSize: 14,
                color: 'var(--ink-true)',
                padding: '14px 0',
                cursor:
                  selectedThemes.length >= MIN_OPTIONAL ? 'pointer' : 'not-allowed',
                marginTop: 28,
                opacity: selectedThemes.length >= MIN_OPTIONAL ? 1 : 0.35,
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedThemes.length >= MIN_OPTIONAL) {
                  e.currentTarget.style.backgroundColor = 'var(--ink-true)';
                  e.currentTarget.style.color = 'var(--paper)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--ink-true)';
              }}
            >
              continue to upload
            </button>
          </>
        )}

        {phase === 'upload' && (
          <>
            {/* Upload areas */}
            <div
              style={{
                marginTop: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {allThemes.map((theme) => {
                const url = uploadedUrls[theme];
                const isUploading = uploading[theme];

                return (
                  <div key={theme}>
                    {/* Theme label */}
                    <div
                      style={{
                        fontFamily: 'var(--font-system)',
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--gray-quiet)',
                        marginBottom: 8,
                      }}
                    >
                      {theme}
                      {REQUIRED_THEMES.includes(theme) && (
                        <span style={{ marginLeft: 6 }}>(face photo)</span>
                      )}
                    </div>

                    {/* Upload box */}
                    <div
                      onClick={() => {
                        if (!isUploading) fileInputRefs.current[theme]?.click();
                      }}
                      style={{
                        width: '100%',
                        aspectRatio: '3 / 2',
                        border: url ? '1px solid var(--rule)' : '1px dashed var(--rule)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isUploading ? 'wait' : 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {url ? (
                        <img
                          src={url}
                          alt={theme}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontFamily: 'var(--font-system)',
                            fontSize: 13,
                            color: 'var(--gray-quiet)',
                          }}
                        >
                          {isUploading ? 'uploading...' : 'tap to upload'}
                        </span>
                      )}
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={(el) => {
                        fileInputRefs.current[theme] = el;
                      }}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(theme, file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Upload count */}
            <p
              style={{
                fontFamily: 'var(--font-system)',
                fontSize: 11.5,
                lineHeight: 1.65,
                color: 'var(--gray-quiet)',
                marginTop: 20,
              }}
            >
              {uploadedCount} of {allThemes.length} uploaded
            </p>

            {/* Finish button */}
            <button
              onClick={handleFinish}
              disabled={!allUploaded || isPending}
              style={{
                width: '100%',
                border: '1px solid var(--ink-true)',
                background: 'transparent',
                fontFamily: 'var(--font-system)',
                fontSize: 14,
                color: 'var(--ink-true)',
                padding: '14px 0',
                cursor: allUploaded && !isPending ? 'pointer' : 'not-allowed',
                marginTop: 28,
                opacity: allUploaded && !isPending ? 1 : 0.35,
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (allUploaded && !isPending) {
                  e.currentTarget.style.backgroundColor = 'var(--ink-true)';
                  e.currentTarget.style.color = 'var(--paper)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--ink-true)';
              }}
            >
              {isPending ? 'finishing...' : 'finish setup'}
            </button>
          </>
        )}
      </div>

      <FooterLink />
    </div>
  );
}
