// @liv-standard v1.3
// [F-identity/contract/auth-hooks.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseA
// slice:      F-identity
// layer:      R3
// wires-in:
//   W-ATOM  AuthState       ../config/auth-types
//   W-ATOM  AuthUser        ../config/auth-types
//   W-ATOM  SessionPayload  ../config/auth-types
//   W-ATOM  AUTH_INITIAL_STATE  ../config/auth-state
//   W-ATOM  authSelectors      ../config/auth-state
// wires-out:
//   W-HOOK  useAuth              →  src/app/page.tsx, F-identity/R3
//   W-HOOK  useIsAuthenticated   →  cross-slice read
//   W-HOOK  useCurrentUserId     →  cross-slice read
//   W-HOOK  useCurrentEmail      →  cross-slice read
//   W-HOOK  useCurrentSessionId  →  cross-slice read
//   W-HOOK  useAuthStatus        →  cross-slice read
//   W-HOOK  useSession           →  cross-slice read
//   W-ATOM  AuthProvider         →  F-identity/R3 (providers)
// deps:
//   R0  ../config/auth-types
//   R0  ../config/auth-state
//   R5  react, @/core/api/trpc-client
// validated: pending
//
// step5b-phaseA (A1, A3):
//   me hydration: reads isAdmin from API response, stores in AuthState.
//   verifyMagicLink: isAdmin defaults false after verify — full hydration
//   happens via subsequent me call or page reload. Safe: magic-link verify
//   only returns user+session, not isAdmin. On next mount, me is called and
//   isAdmin is set correctly.
//   refresh: also hydrates isAdmin from me response.
//   Axiom cite: A1 — F-identity owns all auth state writes. A3 — typed atoms.

'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { AuthState, AuthUser, SessionPayload } from '../config/auth-types';
import { AUTH_INITIAL_STATE } from '../config/auth-state';
import { authSelectors } from '../config/auth-state';
import { api } from '@/core/api/trpc-client';

// ─── Auth Context ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  state:            AuthState;
  requestMagicLink: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyMagicLink:  (token: string, email: string) => Promise<{ success: boolean; error?: string }>;
  signOut:          () => Promise<void>;
  refresh:          () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Auth Provider ────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(AUTH_INITIAL_STATE);

  const requestMagicLinkMutation = api.auth.requestMagicLink.useMutation();
  const verifyMagicLinkMutation  = api.auth.verifyMagicLink.useMutation();
  const signOutMutation          = api.auth.signOut.useMutation();
  const meQuery = api.auth.me.useQuery(undefined, { retry: false, enabled: false });

  // ── Hydrate session on mount ────────────────────────────────────────────────
  useEffect(() => {
    setState(s => ({ ...s, status: 'loading' }));

    meQuery.refetch().then(result => {
      if (result.data) {
        setState({
          user:    result.data.user as AuthUser,
          session: result.data.session as SessionPayload,
          status:  'authenticated',
          error:   null,
          // step5b-phaseA: isAdmin derived server-side, hydrated here
          isAdmin: result.data.isAdmin ?? false,
        });
      } else {
        setState({ ...AUTH_INITIAL_STATE, status: 'unauthenticated' });
      }
    }).catch(() => {
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
      // isAdmin: verify endpoint does not return isAdmin — defaults false.
      // Full isAdmin hydration occurs on next mount via me query.
      setState({
        user:    result.user as AuthUser,
        session: result.session as SessionPayload,
        status:  'authenticated',
        error:   null,
        isAdmin: false,
      });
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setState(s => ({
        ...s,
        status: 'unauthenticated',
        error:  { code: 'TOKEN_INVALID', message, timestamp: new Date() },
      }));
      return { success: false, error: message };
    }
  }, [verifyMagicLinkMutation]);

  // ── signOut ─────────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    try {
      await signOutMutation.mutateAsync();
    } finally {
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
        status:  'authenticated',
        isAdmin: result.data!.isAdmin ?? false,
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
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ─── Cross-Slice Read Selectors ───────────────────────────────────────────────

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

export function useSession(): SessionPayload | null {
  const { state } = useAuth();
  return state.session;
}
