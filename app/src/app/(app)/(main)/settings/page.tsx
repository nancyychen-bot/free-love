import Link from 'next/link';
import StatusBar from '@/app/components/StatusBar';
import BackButton from '@/app/components/BackButton';
import LogoutButton from './logout-button';
import CancelAccountButton from './cancel-button';

const profileLinks = [
  { label: 'my profile', href: '/settings/profile' },
  { label: 'my qualities and values', href: '/settings/qualities' },
  { label: 'my preferences & dealbreakers', href: '/settings/dealbreakers' },
  { label: 'radius', href: '/settings/radius' },
];

const infoLinks = [
  { label: 'how this works', href: '/how-this-works' },
  { label: 'the manifesto', href: '/manifesto' },
];

const rowStyle = {
  display: 'flex' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  padding: '14px 0',
  borderBottom: '1px solid var(--rule)',
  fontFamily: 'var(--font-system)',
  fontSize: 13,
  color: 'var(--ink-true)',
};

export default function SettingsPage() {
  return (
    <div className="screen">
      <StatusBar />

      {/* Header */}
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
          SETTINGS
        </span>
        <BackButton href="/home" />
      </div>

      <div style={{ padding: '0 24px 40px' }}>
        {/* Profile links */}
        {profileLinks.map((link) => (
          <Link key={link.href} href={link.href} style={rowStyle}>
            <span>{link.label}</span>
            <span style={{ color: 'var(--gray-quiet)' }}>&#8250;</span>
          </Link>
        ))}

        {/* Spacer hairline */}
        <div style={{ height: 16 }} />

        {/* Info links */}
        {infoLinks.map((link) => (
          <Link key={link.href} href={link.href} style={rowStyle}>
            <span>{link.label}</span>
            <span style={{ color: 'var(--gray-quiet)' }}>&#8250;</span>
          </Link>
        ))}

        {/* Spacer hairline */}
        <div style={{ height: 16 }} />

        {/* Pause account */}
        <div
          style={{
            ...rowStyle,
            color: 'var(--gray-quiet)',
            cursor: 'default',
          }}
        >
          <span>pause account</span>
        </div>

        {/* Log out */}
        <LogoutButton />

        {/* Spacer */}
        <div style={{ height: 16 }} />

        {/* Cancel account */}
        <CancelAccountButton />
      </div>
    </div>
  );
}
