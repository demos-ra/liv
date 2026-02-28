/**
 * F-identity / R3 / auth-pages.tsx
 * [F-identity/R3/C2] Auth pages — login and verify
 * commit: fix verify page infinite loop + redirect to / not /dashboard
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from './auth-hooks';

import {
  Box,
  Stack,
  Text,
  Input,
  Button,
} from '@/features/F-design-system/contract';

// ─── /auth/login ──────────────────────────────────────────────────────────────

export function AuthPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { requestMagicLink, state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.status === 'authenticated') {
      router.replace('/');
    }
  }, [state.status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    const result = await requestMagicLink(email.trim());

    setIsLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <Stack gap="4" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <Text as="h1" variant="heading-lg">Check your email</Text>
          <Text variant="body" color="muted">
            We sent a sign-in link to <strong>{email}</strong>. It expires in 15 minutes.
          </Text>
          <Text variant="body-sm" color="subtle">
            Didn't get it? Check your spam folder, or{' '}
            <button
              onClick={() => setSubmitted(false)}
              style={{ textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: 'inherit' }}
            >
              try again
            </button>
            .
          </Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <Stack gap="8" style={{ width: '100%', maxWidth: '400px' }}>
        <Stack gap="2">
          <Text as="h1" variant="heading-lg">Sign in to LIV</Text>
          <Text variant="body" color="muted">Enter your email to receive a sign-in link.</Text>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack gap="4">
            <Stack gap="2">
              <Text as="label" htmlFor="email" variant="label">Email address</Text>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                disabled={isLoading}
                required
              />
            </Stack>

            {error && <Text variant="body-sm" color="error">{error}</Text>}

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !email.trim()}
              style={{ width: '100%', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Sending…' : 'Send sign-in link'}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}

// ─── /auth/verify ─────────────────────────────────────────────────────────────
// Guard with useRef so the mutation fires exactly once even in Strict Mode.

export function AuthVerifyPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);
  const { verifyMagicLink } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('error');
      setError('Invalid link. Please request a new sign-in link.');
      return;
    }

    verifyMagicLink(token, email).then(result => {
      if (result.success) {
        setStatus('success');
        window.location.href = "/";
      } else {
        setStatus('error');
        setError(result.error ?? 'This link is invalid or has expired.');
      }
    });
  }, []); // empty deps — intentional, fires once on mount

  return (
    <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <Stack gap="4" style={{ maxWidth: '400px', textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <Text as="h1" variant="heading-lg">Signing you in…</Text>
            <Text variant="body" color="muted">One moment.</Text>
          </>
        )}
        {status === 'success' && (
          <>
            <Text as="h1" variant="heading-lg">Signed in</Text>
            <Text variant="body" color="muted">Redirecting…</Text>
          </>
        )}
        {status === 'error' && (
          <>
            <Text as="h1" variant="heading-lg">Link expired</Text>
            <Text variant="body" color="muted">{error}</Text>
            <Button variant="secondary" onClick={() => router.push('/auth/login')}>
              Request new link
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
