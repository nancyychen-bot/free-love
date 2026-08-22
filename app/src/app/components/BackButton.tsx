'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ href }: { href?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => href ? router.push(href) : router.back()}
      style={{
        background: 'none',
        border: 'none',
        fontFamily: 'var(--font-system)',
        fontSize: 14,
        color: 'var(--gray-quiet)',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      &#8249; back
    </button>
  );
}
