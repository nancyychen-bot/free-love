'use client';

import { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  updateDisplayName,
  updateBio,
  updateLifeAnswer,
  deleteLifeAnswer,
  deletePhoto,
} from '@/lib/actions/profile-actions';

type InterleavedItem = {
  type: 'photo' | 'answer';
  id: string;
  theme?: string;
  url?: string;
  prompt?: string;
  answer?: string;
};

type ProfileEditorProps = {
  displayName: string;
  age: number;
  locationName: string | null;
  profilePhoto: string | null;
  bio: string | null;
  bioId: string | null;
  interleaved: InterleavedItem[];
  qualities: { quality: string; rank: number }[];
  values: { value: string; rank: number }[];
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-system)',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--gray-quiet)',
};

const editLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-system)',
  fontSize: 11,
  color: 'var(--gray-quiet)',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  textDecoration: 'none',
};

const savedStyle: React.CSSProperties = {
  fontFamily: 'var(--font-system)',
  fontSize: 11,
  color: 'var(--gray-quiet)',
};

function SavedFlash({ show }: { show: boolean }) {
  if (!show) return null;
  return <span style={savedStyle}>saved</span>;
}

export default function ProfileEditor({
  displayName,
  age,
  locationName,
  profilePhoto,
  bio,
  bioId,
  interleaved,
  qualities,
  values,
}: ProfileEditorProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Editing states
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);

  // Draft values
  const [nameDraft, setNameDraft] = useState(displayName);
  const [bioDraft, setBioDraft] = useState(bio ?? '');
  const [answerDraft, setAnswerDraft] = useState('');

  // Saved flash states
  const [savedField, setSavedField] = useState<string | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function flashSaved(field: string) {
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    setSavedField(field);
    savedTimerRef.current = setTimeout(() => setSavedField(null), 1500);
  }

  async function saveName() {
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === displayName) {
      setEditingName(false);
      setNameDraft(displayName);
      return;
    }
    setEditingName(false);
    await updateDisplayName(trimmed);
    flashSaved('name');
    startTransition(() => router.refresh());
  }

  async function saveBio() {
    const trimmed = bioDraft.trim();
    if (trimmed === (bio ?? '')) {
      setEditingBio(false);
      return;
    }
    setEditingBio(false);
    await updateBio(trimmed);
    flashSaved('bio');
    startTransition(() => router.refresh());
  }

  async function saveAnswer(answerId: string, originalAnswer: string) {
    const trimmed = answerDraft.trim();
    if (!trimmed || trimmed === originalAnswer) {
      setEditingAnswerId(null);
      return;
    }
    setEditingAnswerId(null);
    await updateLifeAnswer(answerId, trimmed);
    flashSaved(`answer-${answerId}`);
    startTransition(() => router.refresh());
  }

  async function handleDeleteAnswer(answerId: string) {
    await deleteLifeAnswer(answerId);
    startTransition(() => router.refresh());
  }

  async function handleDeletePhoto(photoId: string) {
    await deletePhoto(photoId);
    startTransition(() => router.refresh());
  }

  return (
    <div style={{ padding: '24px 24px 0' }}>
      {/* Profile header -- photo + name/age/location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {profilePhoto ? (
          <div className="avatar-circle" style={{ width: 72, height: 72, minWidth: 72, overflow: 'hidden' }}>
            <img src={profilePhoto} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }} />
          </div>
        ) : (
          <div className="avatar-circle" style={{ width: 72, height: 72, minWidth: 72, border: '1px dashed var(--gray-quiet)' }} />
        )}
        <div style={{ minWidth: 0 }}>
          {editingName ? (
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => { if (e.key === 'Enter') saveName(); }}
              style={{
                fontFamily: 'var(--font-system)',
                fontSize: 13.5,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-true)',
                border: '1px solid var(--rule)',
                background: 'var(--paper)',
                padding: '4px 8px',
                width: '100%',
                outline: 'none',
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <p style={{ fontFamily: 'var(--font-system)', fontSize: 14, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-true)' }}>
                {displayName}, {age}
              </p>
              <button
                onClick={() => { setNameDraft(displayName); setEditingName(true); }}
                style={editLinkStyle}
              >
                edit
              </button>
              <SavedFlash show={savedField === 'name'} />
            </div>
          )}
          {locationName && (
            <p style={{ fontFamily: 'var(--font-system)', fontSize: 11, color: 'var(--gray-quiet)', marginTop: 4 }}>
              {locationName}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span style={labelStyle}>ABOUT ME</span>
          {!editingBio && (
            <button
              onClick={() => { setBioDraft(bio ?? ''); setEditingBio(true); }}
              style={editLinkStyle}
            >
              edit
            </button>
          )}
          <SavedFlash show={savedField === 'bio'} />
        </div>
        {editingBio ? (
          <textarea
            autoFocus
            value={bioDraft}
            onChange={(e) => setBioDraft(e.target.value)}
            onBlur={saveBio}
            rows={4}
            style={{
              fontFamily: 'var(--font-human)',
              fontSize: 17,
              lineHeight: 1.55,
              color: 'var(--ink-human)',
              border: '1px solid var(--rule)',
              background: 'var(--paper)',
              padding: '8px',
              width: '100%',
              resize: 'vertical',
              outline: 'none',
            }}
          />
        ) : (
          bio && (
            <p style={{ fontFamily: 'var(--font-human)', fontSize: 17, lineHeight: 1.55, color: 'var(--ink-human)' }}>
              {bio}
            </p>
          )
        )}
      </div>

      {/* Interleaved photos and answers */}
      <div style={{ marginTop: 24 }}>
        {interleaved.map((item) => {
          if (item.type === 'photo') {
            return (
              <div key={`photo-${item.id}`} style={{ marginTop: 20 }}>
                {item.theme && (
                  <p style={{ ...labelStyle, marginBottom: 6 }}>
                    {item.theme}
                  </p>
                )}
                <img src={item.url!} alt={item.theme || ''} style={{ width: '100%', height: 'auto', display: 'block' }} />
                <button
                  onClick={() => handleDeletePhoto(item.id)}
                  style={{ ...editLinkStyle, marginTop: 6, color: 'var(--gray-quiet)' }}
                >
                  remove
                </button>
              </div>
            );
          }
          if (item.type === 'answer') {
            const isEditing = editingAnswerId === item.id;
            return (
              <div key={`answer-${item.id}`} style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <p style={labelStyle}>{item.prompt}</p>
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => { setAnswerDraft(item.answer ?? ''); setEditingAnswerId(item.id); }}
                        style={editLinkStyle}
                      >
                        edit
                      </button>
                      <button
                        onClick={() => handleDeleteAnswer(item.id)}
                        style={editLinkStyle}
                      >
                        remove
                      </button>
                    </>
                  )}
                  <SavedFlash show={savedField === `answer-${item.id}`} />
                </div>
                {isEditing ? (
                  <textarea
                    autoFocus
                    value={answerDraft}
                    onChange={(e) => setAnswerDraft(e.target.value)}
                    onBlur={() => saveAnswer(item.id, item.answer ?? '')}
                    rows={3}
                    style={{
                      fontFamily: 'var(--font-human)',
                      fontSize: 17,
                      lineHeight: 1.55,
                      color: 'var(--ink-human)',
                      border: '1px solid var(--rule)',
                      background: 'var(--paper)',
                      padding: '8px',
                      width: '100%',
                      resize: 'vertical',
                      outline: 'none',
                      marginTop: 8,
                    }}
                  />
                ) : (
                  <p style={{ fontFamily: 'var(--font-human)', fontSize: 17, lineHeight: 1.55, color: 'var(--ink-human)', marginTop: 8 }}>
                    {item.answer}
                  </p>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Add more links */}
      <div style={{ marginTop: 28, display: 'flex', gap: 20 }}>
        <Link
          href="/onboarding/life-answers"
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-true)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--rule)',
            paddingBottom: 2,
          }}
        >
          + ADD ANSWERS
        </Link>
        <Link
          href="/onboarding/photos"
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-true)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--rule)',
            paddingBottom: 2,
          }}
        >
          + ADD PHOTOS
        </Link>
      </div>

      {/* Qualities + Values as chips */}
      {(qualities.length > 0 || values.length > 0) && (
        <div style={{ marginTop: 28 }}>
          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)' }} />

          {qualities.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p style={{ ...labelStyle, marginBottom: 10 }}>
                QUALITIES I VALUE
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {qualities.map(q => (
                  <span key={q.quality} style={{
                    fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--ink-true)',
                    border: '1px solid var(--rule)', padding: '8px 12px', lineHeight: 1,
                  }}>
                    {q.quality}
                  </span>
                ))}
              </div>
            </div>
          )}

          {values.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p style={{ ...labelStyle, marginBottom: 10 }}>
                WHAT MATTERS TO ME
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {values.map(v => (
                  <span key={v.value} style={{
                    fontFamily: 'var(--font-system)', fontSize: 13, color: 'var(--ink-true)',
                    border: '1px solid var(--rule)', padding: '8px 12px', lineHeight: 1,
                  }}>
                    {v.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
