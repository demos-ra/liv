// @liv-standard v1.5.2
// [F-entitlement/R0]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  StorageMode          →  F-entitlement/R3
//   W-ATOM  DEFAULT_STORAGE_MODE →  F-entitlement/R3
//   W-ATOM  OnboardingPath       →  F-entitlement/R3
//   W-ATOM  ONBOARDING_PATHS     →  F-entitlement/R3
// deps:      none
// validated: pending

export type StorageMode = 'hosted' | 'user-hosted'
// Where a wearer's store lives. Hosted is the central store LIV runs;
// user-hosted is the deliberate opt-in that carries the Part 1 package install.

// The invisible default. "Get started" lands here without ever surfacing the
// choice — hosted is hard default; user-hosted is reached on purpose, later.
export const DEFAULT_STORAGE_MODE: StorageMode = 'hosted'

// One onboarding path the entry offers. `endpoint` is the existing route the
// path drives (never re-declared here); `storageMode` is what taking it sets.
export interface OnboardingPath {
  id:          'get-started' | 'connect-claude-code'
  label:       string
  storageMode: StorageMode
  endpoint:    string | null
}

// The two paths. get-started is the front door (hosted, choice invisible);
// connect-claude-code drives the already-built delegated-token issuance route
// (the connector door — see src/app/api/agent-token/route.ts).
export const ONBOARDING_PATHS: readonly OnboardingPath[] = [
  { id: 'get-started',        label: 'Get started',        storageMode: DEFAULT_STORAGE_MODE, endpoint: null },
  { id: 'connect-claude-code', label: 'Connect Claude Code', storageMode: DEFAULT_STORAGE_MODE, endpoint: '/api/agent-token' },
] as const
