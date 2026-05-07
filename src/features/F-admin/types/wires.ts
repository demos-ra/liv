// @liv-standard v1.3
// [F-admin/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-admin.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-FN    useRegisterProgram()   ←  F-dashboard/R3 (dashboard-registry)
//   W-ATOM  GlobalGraphAdmin       ←  (formerly F-codec/R3 global-graph-admin; F-codec dissolved Sprint 8 Shot 3a — admin global-graph routes return 501 pending Sprint 9 reauthor)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-ATOM  AdminBuild             →  (internal — route surface only)
//   W-ATOM  AdminBuildsFilter      →  (internal — route surface only)
//   W-FN    dbGetUserEmail()       →  re-exported via F-admin/R3 (admin-contract)
//   W-FN    dbGetBuilds()          →  consumed by src/app/api/admin/builds/route.ts

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none)
