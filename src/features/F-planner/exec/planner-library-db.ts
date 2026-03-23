// @liv-standard v1.3
// [F-planner/exec/planner-library-db.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4d-corrective
// slice:      F-planner
// layer:      R4
// wires-in:
//   W-ATOM  FlowLibraryEntry     ../types/planner-library-types
//   W-ATOM  LibraryInsertPayload ../types/planner-library-types
//   W-ATOM  PlannerResult        ../types/planner-types
//   W-ATOM  AtomDecl             @/core/constants/liv-standard.types
//   W-ATOM  WireEntry            @/core/constants/liv-standard.types
// wires-out:
//   W-FN  hashAtomShape     →  F-planner/R2 (via IPlannerDb)
//   W-FN  hashWireSignature →  F-planner/R2 (via IPlannerDb)
// deps:
//   R0  ../types/planner-library-types
//   R0  ../types/planner-types   (PlannerResult)
//   R0  @/core/constants/liv-standard.types  (AtomDecl, WireEntry, FlowId)
//   R5  @/core/db/client
//   R5  crypto  (Node built-in — createHash. Precedent: F-identity/exec/auth-db.ts)
// validated:  pending
//
// step4d-phase2 (A1, A2, A3, A4):
//   New file. Four R4 functions for the flow library table.
//   All bound into IPlannerDb via planner-inject.ts — never imported directly (A2).
//   Axiom cite: A1 — F-planner owns library state. A2 — R4 never imported at R3+.
//   A3 — FlowLibraryEntry is the typed R4 boundary atom. A4 — all I/O here.
//
// step4d-corrective (A2):
//   hashAtomShape, hashWireSignature, wireStructureKey moved here from R1.
//   Reason: createHash (Node crypto) is infrastructure — R4 is correct layer.
//   Both exported and bound into IPlannerDb via planner-inject.ts — A2 compliant.
//   AtomDecl + WireEntry imported from liv-standard.types (R0 canonical — A1).
//   Axiom cite: A2 — infrastructure imports at R4 only. A4 — I/O layer.

import { createHash } from 'crypto'
import { db }  from '@/core/db/client'
import type { FlowId, AtomDecl, WireEntry } from '@/core/constants/liv-standard.types'
import type { FlowLibraryEntry, LibraryInsertPayload } from '../types/planner-library-types'
import type { PlannerResult } from '../types/planner-types'

// ── Row type — typed R4 boundary (A3) ─────────────────────────────────────────
type FlowLibraryRow = {
  id:                  string
  flow_id:             string
  standard_version:    string
  atom_shape_hash:     string
  wire_signature_hash: string
  bundle_name:         string
  slot_values:         unknown   // JSONB
  output_files:        unknown   // JSONB
  source_build_id:     string
  reuse_failure_count: number
  created_at:          Date
}

// ── Row mapper ────────────────────────────────────────────────────────────────
function mapEntry(r: FlowLibraryRow): FlowLibraryEntry {
  let slotValues: Record<string, string> = {}
  try {
    slotValues = (typeof r.slot_values === 'string'
      ? JSON.parse(r.slot_values)
      : r.slot_values) as Record<string, string>
  } catch { slotValues = {} }

  let outputFiles: { path: string; content: string }[] = []
  try {
    outputFiles = (typeof r.output_files === 'string'
      ? JSON.parse(r.output_files)
      : r.output_files) as { path: string; content: string }[]
  } catch { outputFiles = [] }

  return {
    id:                 r.id,
    flowId:             r.flow_id as FlowId,
    standardVersion:    r.standard_version,
    atomShapeHash:      r.atom_shape_hash,
    wireSignatureHash:  r.wire_signature_hash,
    bundleName:         r.bundle_name,
    slotValues,
    outputFiles,
    sourceBuildId:      r.source_build_id,
    reuseFailureCount:  r.reuse_failure_count,
    createdAt:          r.created_at.getTime(),
  }
}

// ── wireStructureKey — private structural serializer ──────────────────────────
// Strips concrete names (from/to, eventId, atomName, hookName).
// Keeps structural signal only: wire type + method count/signatures/payload type.

function wireStructureKey(wire: WireEntry): string {
  switch (wire.wire) {
    case 'W-ATOM':
      return 'W-ATOM:has-atom'
    case 'W-EVENT':
      return `W-EVENT:payload=${wire.payloadType}`
    case 'W-INJECT': {
      const methodSigs = [...wire.methods]
        .map(m => `${m.params.length}:${m.returns}`)
        .sort()
        .join(',')
      return `W-INJECT:methods=${wire.methods.length}:${methodSigs}`
    }
    case 'W-HOOK':
      return 'W-HOOK:has-hook'
    default: {
      const _never: never = wire
      return String(_never)
    }
  }
}

// ── hashAtomShape ─────────────────────────────────────────────────────────────
// Deterministic structural hash of AtomDecl[].
// Names stripped — only kind + field count + field types (sorted) matter.
// Two atom sets with different names but same structure → same hash.
// Bound into IPlannerDb at R3 — called via deps.db at R2.

export function hashAtomShape(atoms: readonly AtomDecl[]): string {
  const sorted = [...atoms].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind)
    return a.fields.length - b.fields.length
  })

  const serialized = sorted.map(atom => {
    const fieldTypes = [...atom.fields]
      .map(f => f.type)
      .sort()
      .join(',')
    return `${atom.kind}:${atom.fields.length}:${fieldTypes}`
  }).join('|')

  return createHash('sha256').update(serialized).digest('hex')
}

// ── hashWireSignature ─────────────────────────────────────────────────────────
// Deterministic structural hash of WireEntry[].
// Concrete slice names stripped. Structure only.
// Bound into IPlannerDb at R3 — called via deps.db at R2.

export function hashWireSignature(wires: readonly WireEntry[]): string {
  const sorted = [...wires].sort((a, b) => {
    if (a.wire !== b.wire) return a.wire.localeCompare(b.wire)
    return wireStructureKey(a).localeCompare(wireStructureKey(b))
  })

  const serialized = sorted.map(wireStructureKey).join('|')
  return createHash('sha256').update(serialized).digest('hex')
}

// ── dbLookupExactFlowLibrary ──────────────────────────────────────────────────
export async function dbLookupExactFlowLibrary(
  flowId:            FlowId,
  standardVersion:   string,
  atomShapeHash:     string,
  wireSignatureHash: string
): Promise<PlannerResult<FlowLibraryEntry | null>> {
  try {
    const result = await db.query<FlowLibraryRow>(
      `SELECT id, flow_id, standard_version, atom_shape_hash, wire_signature_hash,
              bundle_name, slot_values, output_files, source_build_id,
              reuse_failure_count, created_at
       FROM flow_library
       WHERE flow_id            = $1
         AND standard_version   = $2
         AND atom_shape_hash    = $3
         AND wire_signature_hash = $4
         AND reuse_failure_count < 3
       LIMIT 1`,
      [flowId, standardVersion, atomShapeHash, wireSignatureHash]
    )
    if (!result.rows[0]) return { ok: true, data: null }
    return { ok: true, data: mapEntry(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Flow library exact lookup failed', context: { cause: String(e) } } }
  }
}

// ── dbLookupPartialFlowLibrary ────────────────────────────────────────────────
export async function dbLookupPartialFlowLibrary(
  flowId:          FlowId,
  standardVersion: string
): Promise<PlannerResult<FlowLibraryEntry | null>> {
  try {
    const result = await db.query<FlowLibraryRow>(
      `SELECT id, flow_id, standard_version, atom_shape_hash, wire_signature_hash,
              bundle_name, slot_values, output_files, source_build_id,
              reuse_failure_count, created_at
       FROM flow_library
       WHERE flow_id          = $1
         AND standard_version = $2
       ORDER BY reuse_failure_count ASC, created_at DESC
       LIMIT 1`,
      [flowId, standardVersion]
    )
    if (!result.rows[0]) return { ok: true, data: null }
    return { ok: true, data: mapEntry(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Flow library partial lookup failed', context: { cause: String(e) } } }
  }
}

// ── dbInsertFlowLibraryEntry ──────────────────────────────────────────────────
export async function dbInsertFlowLibraryEntry(
  payload: LibraryInsertPayload
): Promise<PlannerResult<FlowLibraryEntry | null>> {
  try {
    const result = await db.query<FlowLibraryRow>(
      `INSERT INTO flow_library
         (flow_id, standard_version, atom_shape_hash, wire_signature_hash,
          bundle_name, slot_values, output_files, source_build_id)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8)
       ON CONFLICT (flow_id, standard_version, atom_shape_hash, wire_signature_hash)
       DO NOTHING
       RETURNING id, flow_id, standard_version, atom_shape_hash, wire_signature_hash,
                 bundle_name, slot_values, output_files, source_build_id,
                 reuse_failure_count, created_at`,
      [
        payload.flowId,
        payload.standardVersion,
        payload.atomShapeHash,
        payload.wireSignatureHash,
        payload.bundleName,
        JSON.stringify(payload.slotValues),
        JSON.stringify(payload.outputFiles),
        payload.sourceBuildId,
      ]
    )
    if (!result.rows[0]) return { ok: true, data: null }
    return { ok: true, data: mapEntry(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Flow library insert failed', context: { cause: String(e) } } }
  }
}

// ── dbIncrementReuseFailure ───────────────────────────────────────────────────
export async function dbIncrementReuseFailure(
  id: string
): Promise<PlannerResult<void>> {
  try {
    await db.query(
      `UPDATE flow_library
       SET reuse_failure_count = reuse_failure_count + 1
       WHERE id = $1`,
      [id]
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to increment reuse failure count', context: { cause: String(e) } } }
  }
}
