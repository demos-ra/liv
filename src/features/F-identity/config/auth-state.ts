/**
 * F-identity / R0 / auth-state.ts
 * [F-identity/R0/C2] State namespace declaration for auth slice
 *
 * R0 Rule: Declarations only. Defines the shape of the auth namespace.
 * Only F-identity writes to this namespace.
 * Other slices read via selectors exported from R3 hooks.
 *
 * State Rule (LA): own your namespace, never write to another.
 * The state registry (F-state-registry, Phase 1) enforces this boundary.
 */

import type { AuthState } from './auth-types';

// ─── Namespace Key ────────────────────────────────────────────────────────────

/**
 * Reserved namespace in the global state tree.
 * F-state-registry reads this at startup to reserve the key.
 * No other slice may write to 'auth'.
 */
export const AUTH_NAMESPACE = 'auth' as const;

// ─── Initial State ────────────────────────────────────────────────────────────

export const AUTH_INITIAL_STATE: AuthState = {
  user: null,
  session: null,
  status: 'idle',
  error: null,
};

// ─── State Registry Declaration ───────────────────────────────────────────────

/**
 * Shape consumed by F-state-registry to register this slice's namespace.
 * Phase 4 integration: F-state-registry calls registerNamespace(AUTH_NAMESPACE_DECLARATION).
 */
export const AUTH_NAMESPACE_DECLARATION = {
  namespace: AUTH_NAMESPACE,
  initialState: AUTH_INITIAL_STATE,
  owner: 'F-identity',
  version: '1.0.0',
} as const;

// ─── Selectors (cross-slice read interface) ───────────────────────────────────

/**
 * Other slices that need auth state import these selectors.
 * They do NOT import AuthState directly or write to the auth namespace.
 * Selector shape — implementation lives in R3 auth-hooks.ts.
 */
export type AuthStateSelector<T> = (state: AuthState) => T;

export const authSelectors = {
  isAuthenticated: (state: AuthState): boolean =>
    state.status === 'authenticated' && state.session !== null,
  currentUserId: (state: AuthState): string | null =>
    state.user?.id ?? null,
  currentEmail: (state: AuthState): string | null =>
    state.user?.email ?? null,
  currentSessionId: (state: AuthState): string | null =>
    state.session?.sessionId ?? null,
  authStatus: (state: AuthState): AuthState['status'] =>
    state.status,
};
