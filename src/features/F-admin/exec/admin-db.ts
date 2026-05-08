// @liv-standard v1.4
// [F-admin/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.4
// amended:    phase-b-item4, phase-ab-blast-radius
// slice:      F-admin
// layer:      R4
// wires-in:
//   W-ATOM  AdminBuild            ../types/admin-types
//   W-ATOM  AdminBuildsFilter     ../types/admin-types
//   W-FN    getBuildsForAdmin     @/features/F-planner/contract/planner-contract
//   W-FN    getUserEmail          @/features/F-identity/contract/auth-contract
// wires-out:  none  (R4 is never imported. Bound via API route at R4.)
// deps:
//   R0  ../types/admin-types
//   R0  @/core/types/primitives
//   R3  @/features/F-planner/contract/planner-contract
//   R3  @/features/F-identity/contract/auth-contract
// validated: pending
//
// phase-b-item4 (A1, A2):
//   dbGetBuilds replaced: was a direct cross-slice read on builds table
//   (owned by F-planner — A1 violation). Now delegates to F-planner/R3 contract.
//   dbGetUserEmail replaced: was a direct cross-slice read on auth_users table
//   (owned by F-identity — A1 violation). Now delegates to F-identity/R3 contract.
//   Both A1 exceptions removed. Row types and mapping logic removed — now owned
//   by the respective table owners at R4.
//   Axiom cite: A1 — single ownership restored. A2 — imports from R3 contracts only.
//
// phase-ab-blast-radius (A4):
//   Result<T> return types restored. Phase A (CC.07) wrapped these in Result<T>.
//   Phase B delegation dropped the wrapper. Callers (builds/route.ts Phase A version,
//   global-graph routes deleted Sprint 9 Shot 2) expect Result<T>. Signature contract retained for builds route.
//   Axiom cite: A4 — typed error propagation at I/O boundary.

import type { Result } from '@/core/types/primitives'
import type { AdminBuild, AdminBuildsFilter } from '../types/admin-types'
import { getBuildsForAdmin } from '@/features/F-planner/contract/planner-contract'
import { getUserEmail as _getUserEmail } from '@/features/F-identity/contract/auth-contract'

// ── dbGetBuilds ───────────────────────────────────────────────────────────────
// Delegates to F-planner/R3 contract. F-planner owns builds table (A1).
// Returns Result<AdminBuild[]> — CC.07 contract preserved.

export async function dbGetBuilds(filters: AdminBuildsFilter = {}): Promise<Result<AdminBuild[]>> {
  return getBuildsForAdmin(filters)
}

// ── dbGetUserEmail ────────────────────────────────────────────────────────────
// Delegates to F-identity/R3 contract. F-identity owns auth_users table (A1).
// Returns Result<string | null> — CC.07 contract preserved.

export async function dbGetUserEmail(userId: string): Promise<Result<string | null>> {
  try {
    const email = await _getUserEmail(userId)
    return { ok: true, data: email }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'ADMIN_DB_QUERY_FAILED', message } }
  }
}
