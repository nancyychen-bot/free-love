'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBar from '@/app/components/StatusBar';
import Wordmark from '@/app/components/Wordmark';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      router.push('/introduction');
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className="screen">
      <StatusBar />

      <div style={{ padding: '0 24px' }}>
        {/* Wordmark */}
        <div style={{ paddingTop: 48 }}>
          <Wordmark size={21} />
        </div>

        {/* Title */}
        <h1
          style={{
            marginTop: 40,
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
            color: 'var(--ink-true)',
          }}
        >
          Log in
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontFamily: 'var(--font-system)',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase' as const,
                color: 'var(--gray-quiet)',
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: 13,
                border: '1px solid var(--rule)',
                background: 'var(--paper)',
                fontFamily: 'var(--font-system)',
                fontSize: 13.5,
                color: 'var(--ink-true)',
                outline: 'none',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontFamily: 'var(--font-system)',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase' as const,
                color: 'var(--gray-quiet)',
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: 13,
                border: '1px solid var(--rule)',
                background: 'var(--paper)',
                fontFamily: 'var(--font-system)',
                fontSize: 13.5,
                color: 'var(--ink-true)',
                outline: 'none',
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                marginBottom: 16,
                fontFamily: 'var(--font-system)',
                fontSize: 12,
                color: '#8B0000',
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 15,
              background: loading ? 'var(--gray-quiet)' : 'var(--ink-true)',
              color: 'var(--paper)',
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              border: 'none',
              cursor: loading ? 'default' : 'pointer',
              transition: 'background 200ms ease',
            }}
          >
            {loading ? 'logging in...' : 'log in'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: 60, textAlign: 'center' }}>
          <Link
            href="/signup"
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 12.5,
              color: 'var(--gray-quiet)',
            }}
          >
            need an account? sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
