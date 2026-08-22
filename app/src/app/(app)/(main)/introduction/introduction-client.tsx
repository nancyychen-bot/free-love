'use client';

import { useRouter } from 'next/navigation';
import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';

type IntroData = {
  introId: string;
  score: string;
  floor: string;
  explanation: string;
  expiresIn: string;
  profile: { displayName: string; age: number; locationName: string | null };
  lifeAnswers: { prompt: string; answer: string }[];
  photos: { theme: string; url: string }[];
};

export default function IntroductionClient({ data }: { data: IntroData }) {
  const router = useRouter();

  async function handleAction(action: string) {
    await fetch(`/api/introductions/${data.introId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    router.push('/home');
    router.refresh();
  }

  return (
    <div className="screen">
      <StatusBar />

      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px 14px',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-true)',
          }}
        >
          ONE INTRODUCTION
        </span>
        <span
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 11,
            color: 'var(--gray-quiet)',
          }}
        >
          expires in {data.expiresIn}
        </span>
      </div>

      {/* Back button */}
      <div style={{ padding: '14px 24px 0' }}>
        <BackButton href="/home" />
      </div>

      {/* Introduction surface */}
      <div
        style={{
          background: 'var(--introduction-wash)',
          padding: '30px 24px 26px',
          marginTop: 14,
        }}
      >
        {/* Avatar */}
        {data.photos.length > 0 ? (
          <div
            className="avatar-circle"
            style={{
              width: 56,
              height: 56,
              overflow: 'hidden',
            }}
          >
            <img
              src={data.photos[0].url}
              alt={data.profile.displayName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '9999px',
              }}
            />
          </div>
        ) : (
          <div
            className="avatar-circle"
            style={{
              width: 56,
              height: 56,
              border: '1.5px dashed var(--introduction)',
              background: 'transparent',
            }}
          />
        )}

        {/* Name / age */}
        <p
          style={{
            marginTop: 16,
            fontFamily: 'var(--font-system)',
            fontSize: 13,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--introduction)',
          }}
        >
          {data.profile.displayName} &middot; {data.profile.age}
        </p>

        {/* Location */}
        {data.profile.locationName && (
          <p
            style={{
              marginTop: 4,
              fontFamily: 'var(--font-system)',
              fontSize: 11,
              color: '#6B6591',
            }}
          >
            {data.profile.locationName}
          </p>
        )}

        {/* Photo count */}
        {data.photos.length > 1 && (
          <p
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 10.5,
              color: 'var(--introduction)',
              marginTop: 8,
            }}
          >
            {data.photos.length} photos
          </p>
        )}

        {/* Why this match */}
        <div style={{ marginTop: 24 }}>
          <p
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#6B6591',
            }}
          >
            WHY THIS MATCH?
          </p>
          <p
            style={{
              marginTop: 10,
              fontFamily: 'var(--font-system)',
              fontSize: 12.5,
              lineHeight: 1.6,
              color: 'var(--introduction)',
            }}
          >
            {data.explanation}
          </p>
        </div>

        {/* Score readout */}
        <p
          style={{
            marginTop: 16,
            fontFamily: 'var(--font-system)',
            fontSize: 10.5,
            color: '#6B6591',
          }}
        >
          floor: {data.floor} &middot; this pair: {data.score}
        </p>
      </div>

      {/* Life answers */}
      <div style={{ padding: '26px 24px 0' }}>
        {data.lifeAnswers.map((item, i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <p
              style={{
                fontFamily: 'var(--font-system)',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--gray-quiet)',
              }}
            >
              {item.prompt}
            </p>
            <p
              className="type-human-answer"
              style={{ marginTop: 10 }}
            >
              {item.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Photos */}
      {data.photos.length > 1 && (
        <div style={{ padding: '0 24px 10px' }}>
          <p
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
            PHOTOS
          </p>
          {data.photos.slice(1).map((photo) => (
            <div key={photo.theme} style={{ marginBottom: 16 }}>
              <p
                style={{
                  fontFamily: 'var(--font-system)',
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--gray-quiet)',
                  marginBottom: 6,
                }}
              >
                {photo.theme}
              </p>
              <img
                src={photo.url}
                alt={photo.theme}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Action footer */}
      <div
        style={{
          borderTop: '1px solid var(--rule)',
          padding: '16px 24px 32px',
        }}
      >
        {/* Open a conversation — filled button */}
        <button
          onClick={() => handleAction('open')}
          style={{
            display: 'block',
            width: '100%',
            padding: 15,
            background: 'var(--ink-true)',
            border: 'none',
            color: 'var(--paper)',
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          open a conversation
        </button>

        {/* Pass / Save row — outlined buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            onClick={() => handleAction('pass')}
            style={{
              flex: 1,
              padding: 13,
              background: 'transparent',
              border: '1px solid var(--ink-true)',
              fontFamily: 'var(--font-system)',
              fontSize: 14,
              color: 'var(--ink-true)',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            pass
          </button>
          <button
            onClick={() => handleAction('save')}
            style={{
              flex: 1,
              padding: 13,
              background: 'transparent',
              border: '1px solid var(--ink-true)',
              fontFamily: 'var(--font-system)',
              fontSize: 14,
              color: 'var(--ink-true)',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            save for later
          </button>
        </div>
      </div>
    </div>
  );
}
