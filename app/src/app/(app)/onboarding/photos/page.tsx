'use client';

import { useState, useRef, useTransition } from 'react';
import StatusBar from '@/app/components/StatusBar';
import FooterLink from '@/app/components/FooterLink';
import { savePhotos } from '../actions';

const REQUIRED_THEME = 'just me';

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

const MIN_OPTIONAL = 4; // 1 required + 4 optional = 5 minimum

export default function PhotosPage() {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [phase, setPhase] = useState<'choose' | 'upload'>('choose');
  const [uploadedUrls, setUploadedUrls] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const allThemes = [REQUIRED_THEME, ...selectedThemes];
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
      // silently fail -- user can retry by tapping again
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
          }}>
            STEP 10 OF 10
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
          YOUR PHOTOS
        </h1>

        {/* Explanation */}
        <p style={{
          fontFamily: 'var(--font-system)', fontSize: 12.5, lineHeight: 1.7,
          color: 'var(--gray-quiet)', marginTop: 12,
        }}>
          {phase === 'choose'
            ? "Your 'just me' photo is your profile picture. Pick at least four more themes. Upload as many as you like."
            : "Upload a photo for each theme. Tap a box to choose a file."}
        </p>

        {phase === 'choose' && (
          <>
            {/* Required theme */}
            <div style={{ marginTop: 28 }}>
              <div style={{
                fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--gray-quiet)', marginBottom: 10,
              }}>
                YOUR PROFILE PICTURE — REQUIRED
              </div>
              <div style={{
                fontFamily: 'var(--font-system)', fontSize: 13.5,
                color: 'var(--ink-true)', border: '1px solid var(--ink-true)',
                padding: '9px 12px', lineHeight: 1, display: 'inline-block',
              }}>
                just me
              </div>
            </div>

            {/* Optional theme selection */}
            <div style={{ marginTop: 24 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 12,
              }}>
                <span style={{
                  fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray-quiet)',
                }}>
                  CHOOSE MORE THEMES
                </span>
                <span style={{
                  fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.16em',
                  color: selectedThemes.length >= MIN_OPTIONAL ? 'var(--ink-true)' : 'var(--gray-quiet)',
                }}>
                  {selectedThemes.length} CHOSEN{selectedThemes.length < MIN_OPTIONAL ? ` (${MIN_OPTIONAL - selectedThemes.length} MORE)` : ''}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {OPTIONAL_THEMES.map((theme) => {
                  const isSelected = selectedThemes.includes(theme);
                  return (
                    <button
                      key={theme}
                      onClick={() => toggleTheme(theme)}
                      style={{
                        fontFamily: 'var(--font-system)', fontSize: 13.5,
                        color: isSelected ? 'var(--ink-true)' : 'var(--gray-quiet)',
                        border: `1px solid ${isSelected ? 'var(--ink-true)' : 'var(--rule)'}`,
                        background: 'transparent', padding: '9px 12px',
                        cursor: 'pointer', lineHeight: 1,
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
                width: '100%', padding: 15, marginTop: 28,
                background: selectedThemes.length >= MIN_OPTIONAL ? 'var(--ink-true)' : 'var(--gray-quiet)',
                color: 'var(--paper)', fontFamily: 'var(--font-system)',
                fontSize: 13.5, fontWeight: 500, border: 'none',
                cursor: selectedThemes.length >= MIN_OPTIONAL ? 'pointer' : 'default',
              }}
            >
              continue to upload
            </button>
          </>
        )}

        {phase === 'upload' && (
          <>
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {allThemes.map((theme) => {
                const url = uploadedUrls[theme];
                const isUploading = uploading[theme];

                return (
                  <div key={theme}>
                    <div style={{
                      fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 500,
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: 'var(--gray-quiet)', marginBottom: 8,
                    }}>
                      {theme}
                    </div>

                    <div
                      onClick={() => { if (!isUploading) fileInputRefs.current[theme]?.click(); }}
                      style={{
                        width: '100%', minHeight: 180,
                        border: url ? '1px solid var(--rule)' : '1px dashed var(--rule)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: isUploading ? 'wait' : 'pointer', overflow: 'hidden',
                      }}
                    >
                      {url ? (
                        <img src={url} alt={theme} style={{ width: '100%', height: 'auto', display: 'block' }} />
                      ) : (
                        <span style={{
                          fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--gray-quiet)',
                        }}>
                          {isUploading ? 'uploading...' : 'tap to upload'}
                        </span>
                      )}
                    </div>

                    <input
                      ref={(el) => { fileInputRefs.current[theme] = el; }}
                      type="file"
                      accept="image/*,.heic,.heif"
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

            <p style={{
              fontFamily: 'var(--font-system)', fontSize: 11.5, lineHeight: 1.65,
              color: 'var(--gray-quiet)', marginTop: 20,
            }}>
              {uploadedCount} of {allThemes.length} uploaded
            </p>

            <button
              onClick={handleFinish}
              disabled={!allUploaded || isPending}
              style={{
                width: '100%', padding: 15, marginTop: 28,
                background: (allUploaded && !isPending) ? 'var(--ink-true)' : 'var(--gray-quiet)',
                color: 'var(--paper)', fontFamily: 'var(--font-system)',
                fontSize: 13.5, fontWeight: 500, border: 'none',
                cursor: (allUploaded && !isPending) ? 'pointer' : 'default',
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
