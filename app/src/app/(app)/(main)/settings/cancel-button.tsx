'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CancelAccountButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleCancel() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setDeleting(true);
    await fetch('/api/auth/cancel', { method: 'POST' });
    router.push('/');
  }

  return (
    <button
      onClick={handleCancel}
      disabled={deleting}
      style={{
        display: 'block',
        width: '100%',
        padding: '14px 0',
        borderBottom: '1px solid var(--rule)',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        background: 'none',
        fontFamily: 'var(--font-system)',
        fontSize: 13,
        color: confirming ? '#8B0000' : 'var(--gray-quiet)',
        cursor: deleting ? 'default' : 'pointer',
        textAlign: 'left',
      }}
    >
      {deleting ? 'deleting...' : confirming ? 'are you sure? tap again to confirm' : 'cancel my account'}
    </button>
  );
}
