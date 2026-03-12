// @liv-standard v1.3
// [core/types/primitives.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      core
// layer:      R5
// wires-in:   none
// wires-out:
//   W-ATOM  Result    →  all slices
//   W-ATOM  AppError  →  all slices
//   W-ATOM  generateId  →  all slices
// deps:       none
// validated:  2026-03-12

// R5: shared infrastructure. Zero domain logic. Zero slice-specific types.
// This is the extractable scaffold base — copy to every LIV-built app.

import { randomUUID } from 'crypto'

// ── Canonical Result<T> and AppError ─────────────────────────────────────────
// AK-RES: the only permitted shape for fallible operation return values. (T1.6 R4)
// A1: declared once at R5. Slices import — never redeclare.
// Slices may define scoped aliases: type ProjectResult<T> = Result<T>

export type AppError = {
  code:     string                   // SCREAMING_SNAKE_CASE — stable, treat as public API
  message:  string                   // human-readable — may change
  context?: Record<string, unknown>  // no PII, no raw objects
}

export type Result<T, E extends AppError = AppError> =
  | { ok: true;  data: T }
  | { ok: false; error: E }

// ── ID generation ─────────────────────────────────────────────────────────────
export function generateId(prefix?: string): string {
  const uuid = randomUUID()
  return prefix ? `${prefix}_${uuid}` : uuid
}

// ── Branded Ref helper ────────────────────────────────────────────────────────
// AK-REF: stable branded identifiers. Use in every slice's R0 types.
// Usage: export type UserId = Ref<'UserId'>
export type Ref<Brand extends string> = string & { _brand: Brand }

// ── R-layer type ──────────────────────────────────────────────────────────────
export type RLayer = 'R0' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5'
