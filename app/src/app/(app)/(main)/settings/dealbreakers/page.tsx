import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';

export default function DealbreakersPage() {
  return (
    <div className="screen">
      <StatusBar />

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
          DEALBREAKERS
        </span>
        <BackButton href="/settings" />
      </div>

      <div style={{ padding: '40px 24px' }}>
        <p
          style={{
            fontFamily: 'var(--font-system)',
            fontSize: 13,
            color: 'var(--gray-quiet)',
            lineHeight: 1.6,
          }}
        >
          editing coming soon
        </p>
      </div>
    </div>
  );
}
