// @liv-standard v1.3
// [F-user-profile/types/profile-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b2-phase-d
// slice:      F-user-profile
// layer:      R0
// wires-in:
//   W-ATOM  ProviderId  ../config/provider-keys-config
// wires-out:
//   W-ATOM  ModelPreferences  →  F-user-profile/R4, F-user-profile/R3
//   W-ATOM  ModelTierPreference →  F-user-profile/R4, F-user-profile/R3
// deps:
//   R0  ../config/provider-keys-config
// validated:  pending
//
// step4b2-phase-d (A3, A6):
//   ModelPreferences declared at R0 of F-user-profile (A1: F-user-profile owns
//   user preferences). Stored as jsonb in user_profiles.model_preferences (008).
//   null per tier = "use default" (Phase A MODEL_TIER_MAP auto-assign).
//   ProviderId imported from config/provider-keys-config — the existing R0 atom
//   for provider identity. config/ files predate the types/ directory; this file
//   is the first true R0 in F-user-profile. Provider-keys-config remains at config/
//   for backward compatibility (other slices import from there directly).
//   Axiom cite: A6 — declared at R0 of owning slice. A3 — typed atom, no logic.

import type { ProviderId } from '../config/provider-keys-config'

// ── AK-ENT — Per-tier model selection ─────────────────────────────────────────
// One entry per size tier. null = use default (MODEL_TIER_MAP fallback in R1).
// provider + model must be a valid pair for a provider the user has a key for.
// Validation enforced at R3 (PUT /api/profile/models) before write.
export type ModelTierPreference = {
  provider: ProviderId
  model:    string
}

// ── AK-ENT — Full model preferences atom ─────────────────────────────────────
// Stored as jsonb in user_profiles.model_preferences.
// Read by F-planner/exec/planner-db.ts (structural exception, documented).
// Written by F-user-profile/exec/user-profile-db.ts via PUT /api/profile/models.
export type ModelPreferences = {
  largest:  ModelTierPreference | null
  medium:   ModelTierPreference | null
  smallest: ModelTierPreference | null
}
