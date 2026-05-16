// @liv-standard v1.5.2
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-b1-7-shot-1-amendment (Mediator added per LC3 + advisor framing); sprint-b2-unified-close (Mediator dissolved — descriptive residue closure per Manual v13.3; loop reduced to 3 positions); sprint-b2-unified-close-fix-round (LIV-Standard pin sweep v1.5.1 → v1.5.2 per cascade discipline)
// slice:      core
// category:   Tool
// layer:      R5
// wires-in:   none (R5 — pure declarations)
// wires-out:
//   W-ATOM SliceCategory             → all slice-category consumers, la-validator (G-SC enumeration)
//   W-ATOM SLICE_CATEGORY_VALUES     → la-validator (G-SC runtime membership check)
// deps:       none
// validated:  pending

// ═══════════════════════════════════════════════════════════════
// SLICE CATEGORY — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Vocabulary codification for L0-ruled slice categories.
// Structural isomorph of placement-standard.types.ts (PlacementItemKind).
// Three documented differences from Placement Standard precedent:
//   (a) 6 values not 5: Store | Boundary | Modality | Generator | Domain | Tool
//   (b) Closed-by-derivation, not amendment-additive — see doc comment below
//   (c) Gate prefix G-SC (slice-category) vs G-PL (placement)
//
// la-validator G-SC enforcement extension: separate work (B1.7 final shot or B3).
// This file makes vocabulary parser-readable; enforcement is staged.
//
// Discipline: no implementation logic; type declarations only.

// slice-category.types.ts
// R5 type atoms for slice-category vocabulary
// Codified in B1.7 against L0 rulings from session 2026-05-12

// ─── SliceCategory enum ───────────────────────────────────────────────────────

/**
 * SliceCategory — the six structural categories of LIV programs.
 *
 * Derived from the structural commitments of the LIV root claim (Manual
 * SPEC-v12.0; formalized in v13.0 post-B1.7). Bound to `@manifest category:`
 * field per G-SC.
 *
 * Three structural axes organize the categories:
 *
 * 1. MEMORY LOOP (always-present, linear):
 *    Modality ↔ Boundary ↔ Store
 *    - Store:    substrate write/read mechanics (unitary)
 *    - Boundary: typed/untyped crossing gate (unitary)
 *    - Modality: wearer-facing channels and surfaces (open set)
 *
 * 2. CONDITIONAL PERPENDICULARS (activate against the substrate the loop
 *    accumulates; not in the loop):
 *    - Generator: cycle work on a target (closed at four: F-discover, F-plan,
 *                 F-builder, F-verify). Activates when a gap surfaces.
 *    - Domain:    built programs — what Generators produce (open set,
 *                 currently empty). Activates when invoked.
 *
 * 3. UTILITY (orthogonal to loop and perpendiculars):
 *    - Tool: injected utility programs reach for (open set; interaction
 *            pattern — sync call, pub/sub, trigger — is orthogonal to
 *            category membership)
 *
 * CLOSED BY DERIVATION — not amendment-additive.
 * Six categories ruled by L0 (B1.7 session; Mediator dissolved at sprint-b2-unified-close). Manual v13.0 (post-B1.7)
 * formalizes the derivation. Until v13.0, source of authority is L0 ruling
 * at HEAD. Adding a seventh category requires Manual SPEC bump (vision
 * revision), not amendment.
 *
 * Contrast with PlacementItemKind (placement-standard.types.ts) which is
 * amendment-additive per PR2. SliceCategory does NOT have that semantic.
 */
export type SliceCategory =
  | 'Store'
  | 'Boundary'
  | 'Modality'
  | 'Generator'
  | 'Domain'
  | 'Tool'

// ─── End of slice-category.types.ts ──────────────────────────────────────────
