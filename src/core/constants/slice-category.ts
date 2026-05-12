// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-b1-7-shot-1-amendment (Mediator added per LC3 + advisor framing)
// slice:      core
// category:   Tool
// layer:      R5
// wires-in:
//   W-ATOM SliceCategory         ← core/R5 ../types/slice-category.types
// wires-out:
//   W-ATOM SLICE_CATEGORY_VALUES → la-validator (G-SC runtime membership check)
// deps:
//   R5 ../types/slice-category.types
// validated:  pending

// ═══════════════════════════════════════════════════════════════
// SLICE CATEGORY — R5 CONSTANTS
// ═══════════════════════════════════════════════════════════════
// Structural isomorph of placement-standard.ts (PLACEMENT_ITEM_KIND_VALUES).
// Three documented differences from Placement Standard precedent:
//   (a) 7 values not 5: Store | Boundary | Mediator | Modality | Generator | Domain | Tool
//   (b) Closed-by-derivation — see SliceCategory doc comment in types file
//   (c) Gate prefix G-SC (slice-category) vs G-PL (placement)

import type { SliceCategory } from '../types/slice-category.types'

// ─── Enum literal set (mirror type export for runtime membership checks) ──────

/**
 * SliceCategory enum literal set for runtime membership check.
 * Consumed by la-validator G-SC (domain-bounded enforcement per G-SC gate).
 *
 * Order mirrors the type declaration: memory loop categories (Store, Boundary,
 * Mediator, Modality), conditional perpendiculars (Generator, Domain), then
 * utility (Tool).
 *
 * CLOSED BY DERIVATION — not amendment-additive.
 * Seven categories ruled by L0 in B1.7 session. Manual v13.0 (post-B1.7)
 * formalizes the derivation. Until v13.0, source of authority is L0 ruling
 * at HEAD. Adding an eighth category requires Manual SPEC bump (vision
 * revision), not amendment.
 */
export const SLICE_CATEGORY_VALUES: readonly SliceCategory[] = [
  'Store',
  'Boundary',
  'Mediator',
  'Modality',
  'Generator',
  'Domain',
  'Tool',
] as const

// ─── End of slice-category.ts ─────────────────────────────────────────────────
