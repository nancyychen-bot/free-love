'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CancelAccountButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  function handleCancel() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    // Redirect to exit flow before canceling
    router.push('/settings/exit?next=cancel');
  }

  return (
    <button
      onClick={handleCancel}
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
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      {confirming ? 'are you sure? tap again to confirm' : 'cancel my account'}
    </button>
  );
}
