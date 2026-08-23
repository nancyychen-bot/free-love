'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resumeAccount } from '@/lib/actions/account-actions';

export default function PauseButton({
  currentStatus,
}: {
  currentStatus: 'active' | 'paused_user' | 'paused_inactive';
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isPaused = currentStatus === 'paused_user' || currentStatus === 'paused_inactive';

  const handleClick = () => {
    if (isPaused) {
      startTransition(async () => {
        await resumeAccount();
      });
      return;
    }

    if (!confirming) {
      setConfirming(true);
      return;
    }

    // Redirect to exit flow before pausing
    router.push('/settings/exit?next=pause');
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
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
        color: isPaused ? 'var(--ink-true)' : confirming ? '#8B0000' : 'var(--gray-quiet)',
        cursor: isPending ? 'default' : 'pointer',
        textAlign: 'left',
      }}
    >
      {isPending
        ? (isPaused ? 'resuming...' : 'pausing...')
        : isPaused
          ? 'resume account'
          : confirming
            ? 'are you sure? tap again to confirm'
            : 'pause account'}
    </button>
  );
}
