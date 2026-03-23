// @liv-standard v1.3
// [F-identity/config/auth-state.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseA
// slice:      F-identity
// layer:      R0
// wires-out:
//   W-ATOM  AUTH_INITIAL_STATE        →  F-identity/R3 (auth-hooks.tsx)
//   W-ATOM  AUTH_NAMESPACE_DECLARATION →  F-identity/R3
//   W-ATOM  authSelectors             →  F-identity/R3 (auth-hooks.tsx)
// deps:
//   R0  ./auth-types
// validated: pending
//
// step5b-phaseA (A1, A3, A6):
//   Added: isAdmin: false to AUTH_INITIAL_STATE.
//   Matches new AuthState field. Defaults false — safe until hydration confirms admin.
//   Axiom cite: A6 — initial state declared at R0 alongside the type.

/**
 * F-identity / R0 / auth-state.ts
 * R0 Rule: Declarations only. No logic.
 */

import type { AuthState } from './auth-types';

export const AUTH_NAMESPACE = 'auth' as const;

export const AUTH_INITIAL_STATE: AuthState = {
  user:    null,
  session: null,
  status:  'idle',
  error:   null,
  isAdmin: false,
};

export const AUTH_NAMESPACE_DECLARATION = {
  namespace:    AUTH_NAMESPACE,
  initialState: AUTH_INITIAL_STATE,
  owner:        'F-identity',
  version:      '1.0.0',
} as const;

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
