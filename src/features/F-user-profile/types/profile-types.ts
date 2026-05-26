// @liv-standard v1.3
// [F-user-profile/types/profile-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b2-phase-d, sprint-beta-addon-shot-1
// slice:      F-user-profile
// layer:      R0
// wires-in:
//   W-ATOM  ProviderId  ../config/provider-keys-config
// wires-out:
//   W-ATOM  ModelPreferences  →  F-user-profile/R4, F-user-profile/R3
// deps:
//   R0  ../config/provider-keys-config
// validated:  pending
//
// step4b2-phase-d (A3, A6):
//   ModelPreferences declared at R0 of F-user-profile (A1: F-user-profile owns
//   user preferences). Stored as jsonb in user_profiles.model_preferences (008).
//   ProviderId imported from config/provider-keys-config — the existing R0 atom
//   for provider identity. config/ files predate the types/ directory; this file
//   is the first true R0 in F-user-profile. Provider-keys-config remains at config/
//   for backward compatibility (other slices import from there directly).
//   Axiom cite: A6 — declared at R0 of owning slice. A3 — typed atom, no logic.
//
// sprint-beta-addon-shot-1 (L0 ruling):
//   Per-tier ModelPreferences struck in totality. The ModelTierPreference atom
//   and the largest/medium/smallest tier shape are deleted; ModelPreferences is
//   now the flat single-selection atom { provider, model }. MODEL_TIER_MAP tier
//   fallback no longer applies. F-builder/F-plan keep type-independent local
//   mirrors (out of scope — carried follow-on).

import type { ProviderId } from '../config/provider-keys-config'

// ── AK-ENT — Model preferences atom ──────────────────────────────────────────
// sprint-beta-addon-shot-1 (L0 ruling): the per-tier structure is struck in
// totality. ModelPreferences is the wearer's single engine selection — one
// { provider, model } pair, no tiers. The former ModelTierPreference wrapper
// and the largest/medium/smallest tier shape are deleted; MODEL_TIER_MAP tier
// fallback no longer applies to this atom.
//
// The atom is intentionally flat and self-contained: a future sprint can wrap
// tiers around it additively without touching this definition.
//
// Stored as jsonb in user_profiles.model_preferences.
// Written by F-user-profile/exec/user-profile-db.ts via PUT /api/profile/models.
// provider + model must be a valid pair for a provider the wearer has a key
// for; validation enforced at R3 (PUT /api/profile/models) before write.
export type ModelPreferences = {
  provider: ProviderId
  model:    string
}
