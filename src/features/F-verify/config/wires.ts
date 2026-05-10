// @liv-standard v1.3
// [F-verify/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-verify.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.
//
// sprint-13-shot-3: F-la-config collapsed into F-verify. LA capability
// absorbed as verificative binding. Wire declarations consolidated here.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-FN    getPerimeterSession()  ←  F-identity/R3 (perimeter-consultation)
//   W-FN    requirePermission()    ←  F-permissions/R3 (permissions-contract)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-FN    useNamespace()         →  F-chat/R3 (chat-hook), F-permissions/R3 (permissions-hook),
//                                     F-user-profile/R3 (user-profile-hook)
//   W-ATOM  StateRegistryProvider  →  F-dashboard/R3 (providers)
//   W-FN    executeVerificationFromInput  →  F-verify external callers

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none)
