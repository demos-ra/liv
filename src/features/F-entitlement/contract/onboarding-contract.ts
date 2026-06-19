// @liv-standard v1.5.2
// [F-entitlement/R3]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R3
// wires-in:
//   W-ATOM  StorageMode          @/features/F-entitlement/types/onboarding-types
//   W-ATOM  OnboardingPath       @/features/F-entitlement/types/onboarding-types
//   W-ATOM  DEFAULT_STORAGE_MODE @/features/F-entitlement/types/onboarding-types
//   W-ATOM  ONBOARDING_PATHS     @/features/F-entitlement/types/onboarding-types
// wires-out:
//   W-FN    getStarted        →  onboarding UI mount
//   W-FN    connectClaudeCode →  onboarding UI mount
//   W-ATOM  ONBOARDING_PATHS  →  onboarding UI mount
// deps:
//   R0  ../types/onboarding-types
// validated: pending

import type { StorageMode, OnboardingPath } from '../types/onboarding-types'
import { DEFAULT_STORAGE_MODE, ONBOARDING_PATHS } from '../types/onboarding-types'

export type { StorageMode, OnboardingPath }
export { ONBOARDING_PATHS }

// The plan a chosen path enacts. storageMode is decided here, never asked: the
// resolved mode rides back so the entry can act without surfacing the choice.
export interface OnboardingPlan {
  pathId:      OnboardingPath['id']
  storageMode: StorageMode
  endpoint:    string | null
}

function planFor(id: OnboardingPath['id']): OnboardingPlan {
  const path = ONBOARDING_PATHS.find(p => p.id === id)!
  return { pathId: path.id, storageMode: path.storageMode, endpoint: path.endpoint }
}

// "Get started" — the front door. Hosted is the default, returned, not chosen;
// the wearer never sees a storage question.
export function getStarted(): OnboardingPlan {
  return planFor('get-started')
}

// The Connect-Claude-Code path — points at the already-built delegated-token
// issuance route; storage stays the hosted default.
export function connectClaudeCode(): OnboardingPlan {
  return planFor('connect-claude-code')
}

export { DEFAULT_STORAGE_MODE }
