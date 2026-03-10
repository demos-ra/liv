/**
 * F-identity / R3 / auth-hooks.ts
 * [F-identity/R3/C2] React hooks for auth state
 *
 * R3 Rules:
 * - Client-side only hooks.
 * - Imports from R0 (types, selectors), R1 (validation), R2 (via tRPC). Never R4.
 * - These are the ONLY way other slices read auth state (cross-slice selector rule).
 * - Other slices import useIsAuthenticated, useCurrentUserId — not AuthState directly.
 *
 * State Rule: F-identity writes to 'auth' namespace. Other slices read via these hooks.
 */

'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { AuthState, AuthUser, SessionPayload } from '../config/auth-types';
import { AUTH_INITIAL_STATE } from '../config/auth-state';
import { authSelectors } from '../config/auth-state';
import { api } from '@/core/api/trpc-client'; // tRPC client — from F-trpc slice (Phase 3)

// ─── Auth Context (owns the auth namespace in React state tree) ───────────────

interface AuthContextValue {
  state: AuthState;
  requestMagicLink: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyMagicLink: (token: string, email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Auth Provider ────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(AUTH_INITIAL_STATE);

  const requestMagicLinkMutation = api.auth.requestMagicLink.useMutation();
  const verifyMagicLinkMutation = api.auth.verifyMagicLink.useMutation();
  const signOutMutation = api.auth.signOut.useMutation();
  const meQuery = api.auth.me.useQuery(undefined, { retry: false, enabled: false });

  // ── Hydrate session on mount ────────────────────────────────────────────────
  useEffect(() => {
    setState(s => ({ ...s, status: 'loading' }));

    meQuery.refetch().then(result => {
      if (result.data) {
        setState({
          user: result.data.user as AuthUser,
          session: result.data.session as SessionPayload,
          status: 'authenticated',
          error: null,
        });
      } else {
        setState({ ...AUTH_INITIAL_STATE, status: 'unauthenticated' });
      }
    }).catch(() => {
      // 401 / network error — session invalid or missing, force unauthenticated
      setState({ ...AUTH_INITIAL_STATE, status: 'unauthenticated' });
    });
  }, []);

  // ── requestMagicLink ────────────────────────────────────────────────────────
  const requestMagicLink = useCallback(async (email: string) => {
    try {
      const result = await requestMagicLinkMutation.mutateAsync({ email });
      return { success: true, message: result.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send magic link';
      return { success: false, error: message };
    }
  }, [requestMagicLinkMutation]);

  // ── verifyMagicLink ─────────────────────────────────────────────────────────
  const verifyMagicLink = useCallback(async (token: string, email: string) => {
    setState(s => ({ ...s, status: 'loading' }));
    try {
      const result = await verifyMagicLinkMutation.mutateAsync({ token, email });
      setState({
        user: result.user as AuthUser,
        session: result.session as SessionPayload,
        status: 'authenticated',
        error: null,
      });
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setState(s => ({
        ...s,
        status: 'unauthenticated',
        error: { code: 'TOKEN_INVALID', message, timestamp: new Date() },
      }));
      return { success: false, error: message };
    }
  }, [verifyMagicLinkMutation]);

  // ── signOut ─────────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    try {
      await signOutMutation.mutateAsync();
    } finally {
      // Always clear local state — cookie cleared server-side
      setState({ ...AUTH_INITIAL_STATE, status: 'unauthenticated' });
    }
  }, [signOutMutation]);

  // ── refresh ─────────────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    const result = await meQuery.refetch();
    if (result.data) {
      setState(s => ({
        ...s,
        session: result.data!.session as SessionPayload,
        status: 'authenticated',
      }));
    }
  }, [meQuery]);

  return (
    <AuthContext.Provider value={{ state, requestMagicLink, verifyMagicLink, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Primary Hook ─────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

// ─── Cross-Slice Read Selectors (other slices import these, never AuthState) ──

export function useIsAuthenticated(): boolean {
  const { state } = useAuth();
  return authSelectors.isAuthenticated(state);
}

export function useCurrentUserId(): string | null {
  const { state } = useAuth();
  return authSelectors.currentUserId(state);
}

export function useCurrentEmail(): string | null {
  const { state } = useAuth();
  return authSelectors.currentEmail(state);
}

export function useCurrentSessionId(): string | null {
  const { state } = useAuth();
  return authSelectors.currentSessionId(state);
}

export function useAuthStatus(): AuthState['status'] {
  const { state } = useAuth();
  return authSelectors.authStatus(state);
}

// ─── useSession (absorbed from F-session — A1: single owner) ─────────────────

export function useSession(): SessionPayload | null {
  const { state } = useAuth()
  return state.session
}
