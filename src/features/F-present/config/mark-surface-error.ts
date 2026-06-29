// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/mark-surface-error.ts]

// The loud, ATOMIC mark-surface reject — one class, one home. A distinct error
// class so the perimeters (native composer, wire turn door) can catch THIS
// specifically and state it truthfully, separate from any other failure.
//
// It lives here at R0 with ZERO imports so BOTH R1 derivation modules can name
// it without dragging each other's graph: the surface-mark guard (coin-score)
// throws it at write-validate; the same-turn name-tie weld (resolve-dimension,
// R4b §F) throws it at read-derive. coin-score re-exports it, so every existing
// importer — and the `instanceof MarkSurfaceError` catch at the wire door —
// keeps the identical class.

export class MarkSurfaceError extends Error {
  constructor(message: string) { super(message); this.name = 'MarkSurfaceError' }
}
