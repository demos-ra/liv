// @liv-standard v1.3
// [F-admin/R0]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-admin
// category:   Modality
// layer:      R0
// wires-in:
//   W-FN    useRegisterProgram()   ←  F-dashboard/R3 (dashboard-registry)
// wires-out:
//   W-ATOM  AdminBuild             →  (internal — route surface only)
//   W-FN    dbGetUserEmail()       →  re-exported via F-admin/R3 (admin-contract)
// deps:      none
// validated: pending

// Boundary declaration for F-admin.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-FN    useRegisterProgram()   ←  F-dashboard/R3 (dashboard-registry)
//   W-ATOM  GlobalGraphAdmin       ←  (formerly F-codec/R3 global-graph-admin; F-codec dissolved Sprint 8 Shot 3a — Sprint 9 Shot 2 Decision-D: global-graph stub routes deleted per §1.20 strict-functional + §1.21 natural-defer; implementation deferred to Sprint 11 / Phase 3)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-ATOM  AdminBuild             →  (internal — route surface only)
//   W-ATOM  AdminBuildsFilter      →  (internal — route surface only)
//   W-FN    dbGetUserEmail()       →  re-exported via F-admin/R3 (admin-contract)
//   W-FN    dbGetBuilds()          →  consumed by src/app/api/admin/builds/route.ts

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none)
