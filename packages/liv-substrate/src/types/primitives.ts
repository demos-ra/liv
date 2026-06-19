// @liv-standard v1.5.2
// Built with LIV · livai.dev
// Vendored (substrate subset) — portable substrate package.
// Canonical home: src/core/types/primitives.ts (d6d13c8). The full file carries
// app-wide atoms (FSlice, LivEvent, Project, …) the standalone store has no use
// for; this copy ships only the substrate-relevant leaf primitives.

import { randomUUID } from 'crypto'

// ── Canonical Result<T> and AppError ─────────────────────────────────────────
// AK-RES: the only permitted shape for fallible operation return values.

export type AppError = {
  code:     string                        // SCREAMING_SNAKE_CASE — stable, treat as public API
  message:  string                        // human-readable — may change
  context?: Record<string, unknown>       // no PII, no raw objects
}

export type Result<T, E extends AppError = AppError> =
  | { ok: true;  data: T }
  | { ok: false; error: E }

// ── ID generation ─────────────────────────────────────────────────────────────

export function generateId(prefix?: string): string {
  const uuid = randomUUID()
  return prefix ? `${prefix}_${uuid}` : uuid
}
