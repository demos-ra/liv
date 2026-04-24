// @liv-standard v1.5.1
// [F-memory/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1
// slice:      F-memory
// layer:      R1
// wires-in:   none
// wires-out:  none (consumed by R2 service)
// deps:       none
// validated:  pending

// Living Memory v1.1 Amendment 2 — canonical label normalization.
// R1: pure function, zero I/O, zero deps. A6: declared format at origin.
// Format: lowercase, hyphenated, noun-phrase, singular.
// Examples: typescript-compiler, living-memory, api-rate-limiting

export function normalizeLabel(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)  // cap label length
}
