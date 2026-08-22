'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '14px 0',
        borderBottom: '1px solid var(--rule)',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        background: 'none',
        fontFamily: 'var(--font-system)',
        fontSize: 13,
        color: 'var(--ink-true)',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      log out
    </button>
  );
}
