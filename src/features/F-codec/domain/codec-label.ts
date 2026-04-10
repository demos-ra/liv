// @liv-standard v1.3
// [F-codec/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R1
// wires-in:
//   W-ATOM  CODEC_CONFIG  ←  F-codec/R0
// wires-out:
//   W-FN  normalizeLabel()    →  F-codec/R2
//   W-FN  parseLabelResponse() →  F-codec/R2
// deps:
//   R0  ../config/codec-types
// validated:  pending

// R1: pure functions. Zero I/O.
// A1: F-codec owns its own label normalization. Not imported from F-memory/R1.
// The format is declared by the Cognitive Standard, not by F-memory.
// normalizeLabel: lowercase, hyphenated, noun-phrase, singular, max length.
// parseLabelResponse: extracts label from the combined classify+label JSON
// (called by R2 after parseClassifyResponse provides the raw label string).

import { CODEC_CONFIG } from '../config/codec-types'

// ─── Normalize Label ──────────────────────────────────────────────────────────
// Pure string transform. Canonical format: lowercase, hyphenated, trimmed.
// A1: F-codec owns this copy. Identical format to F-memory's normalizeLabel
// but no cross-slice import — the format is defined by the Cognitive Standard.

export function normalizeLabel(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // strip non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-')            // spaces to hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .replace(/^-|-$/g, '')           // trim leading/trailing hyphens
    .slice(0, CODEC_CONFIG.LABEL_MAX_LENGTH)
}

// ─── Parse Label Response ─────────────────────────────────────────────────────
// Takes the raw label string from the combined classify+label parse.
// Normalizes and validates. Returns null if empty or invalid.
// Called by R2 after parseClassifyResponse extracts the label field.

export function parseLabelResponse(rawLabel: string): string | null {
  if (!rawLabel || typeof rawLabel !== 'string') return null

  const normalized = normalizeLabel(rawLabel)
  if (normalized.length === 0) return null

  return normalized
}
