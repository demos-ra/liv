// @liv-standard v1.5.1
// [F-codec/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.8-artifact-decode, lm-v2-2-shot5-fix-2
// slice:      F-codec
// layer:      R1
// wires-in:
//   W-ATOM  DecodeOutput      F-codec/R0
//   W-ATOM  DecodedContext    F-codec/R0
//   W-ATOM  DecodedStructure  F-codec/R0
//   W-ATOM  DECODE_MAX_TOKENS F-codec/R0
//   W-ATOM  MLayer            F-memory/R3
// wires-out:  none (consumed by R2 codec-orchestrate and memory program)
// deps:
//   R0  ../config/codec-decode-types
// validated:  pending

// Decode renderers — two pure projections of DecodeOutput.
// R1: pure functions. No I/O, no side effects.
// CA5: deterministic rendering — same DecodeOutput = same text/list.
// CA8: renders graph-derived structures, not LLM-generated prose.

import type {
  DecodeOutput,
  DecodedContext,
  DecodedStructure,
} from '../config/codec-decode-types'

import { DECODE_MAX_TOKENS } from '../config/codec-decode-types'

// ─── Layer Label ─────────────────────────────────────────────────────────────
// Human-readable layer names for system prompt rendering.

const LAYER_LABELS: Record<number, string> = {
  0: 'M0',
  1: 'M1',
  2: 'M2',
  3: 'M3',
  4: 'M4',
}

// ─── Render For System Prompt ────────────────────────────────────────────────
// Produces structured text for LLM system prompt injection.
// CA8: graph structures → structured text. Not prose — parseable context.
//
// Order: Entities (M0→M1→M2) with nested Relations, then Claims, Sequences, Tensions.
// Truncates lowest-energy items to fit DECODE_MAX_TOKENS budget.
// Token estimate: ~4 chars per token (conservative).

export function renderForSystemPrompt(decoded: DecodeOutput): DecodedContext {
  // A3: typed boundary — takes atom, returns atom.

  const totalStructures =
    decoded.entities.length +
    decoded.relations.length +
    decoded.claims.length +
    decoded.sequences.length +
    decoded.tensions.length +
    decoded.artifacts.length

  if (totalStructures === 0) {
    return { systemPromptBlock: '', structureCount: 0 }
  }

  // Sort entities by layer ascending (M0 first), then energy descending within layer
  const sortedEntities = [...decoded.entities].sort((a, b) => {
    if (a.layer !== b.layer) return a.layer - b.layer
    return b.energy - a.energy
  })

  // Index relations by source entity for nesting
  const relationsBySource = new Map<string, typeof decoded.relations>()
  for (const rel of decoded.relations) {
    const list = relationsBySource.get(rel.fromNodeId)
    if (list) list.push(rel)
    else relationsBySource.set(rel.fromNodeId, [rel])
  }

  // Sort claims by energy descending
  const sortedClaims = [...decoded.claims].sort((a, b) => b.energy - a.energy)

  // Sort tensions by bridgeWeight ascending (weakest bridge = most interesting)
  const sortedTensions = [...decoded.tensions].sort((a, b) => a.bridgeWeight - b.bridgeWeight)

  // Build lines with estimated token cost
  const lines: Array<{ text: string; energy: number }> = []

  // ── Entities + nested Relations ────────────────────────────────────────────
  for (const entity of sortedEntities) {
    const layerLabel = LAYER_LABELS[entity.layer] ?? `M${entity.layer}`
    lines.push({
      text: `[${layerLabel}] ${entity.name} (energy: ${entity.energy.toFixed(2)})`,
      energy: entity.energy,
    })

    // Nest relations under their source entity, sorted by weight descending
    const rels = relationsBySource.get(entity.nodeId)
    if (rels) {
      const sorted = [...rels].sort((a, b) => b.weight - a.weight)
      for (const rel of sorted) {
        lines.push({
          text: `  → ${rel.relationType}: ${entityName(decoded, rel.toNodeId)} (weight: ${rel.weight.toFixed(2)})`,
          energy: rel.weight,
        })
      }
    }
  }

  // ── Claims ─────────────────────────────────────────────────────────────────
  for (const claim of sortedClaims) {
    lines.push({
      text: `[Claim] ${claim.name} — confidence: ${claim.confidence.toFixed(2)}, supported by ${claim.supportCount} edge${claim.supportCount !== 1 ? 's' : ''}`,
      energy: claim.energy,
    })
  }

  // ── Sequences ──────────────────────────────────────────────────────────────
  for (const seq of decoded.sequences) {
    const chain = seq.labels.join(' → ')
    const armSuffix = seq.armId ? ` (arm: ${seq.armId})` : ''
    // Energy: average of entity energies in the sequence
    const seqEnergy = averageEntityEnergy(decoded, seq.nodeIds)
    lines.push({
      text: `[Sequence] ${chain}${armSuffix}`,
      energy: seqEnergy,
    })
  }

  // ── Tensions ───────────────────────────────────────────────────────────────
  for (const tension of sortedTensions) {
    lines.push({
      text: `[Tension] ${tension.nameA} ↔ ${tension.nameB} — bridge: ${tension.bridgeWeight.toFixed(2)}`,
      // Invert: weak bridge = high importance
      energy: tension.bridgeWeight > 0 ? 1 / tension.bridgeWeight : 1,
    })
  }

  // ── Artifacts ──────────────────────────────────────────────────────────────
  // 6.8: rendered with schema fields as natural language.
  // Sorted by energy descending (most active artifacts first).
  const sortedArtifacts = [...decoded.artifacts].sort((a, b) => b.energy - a.energy)

  for (const artifact of sortedArtifacts) {
    const fieldLines = Object.entries(artifact.fields)
      .filter(([_, v]) => v && v.length > 0)
      .map(([k, v]) => `  ${k}: ${v}`)
      .join('\n')

    const artifactText = fieldLines
      ? `[Artifact: ${artifact.title}] (${artifact.mode}, v${artifact.version})\n${fieldLines}`
      : `[Artifact: ${artifact.title}] (${artifact.mode}, v${artifact.version})`

    lines.push({
      text: artifactText,
      energy: artifact.energy,
    })
  }

  // ── Truncate to token budget ───────────────────────────────────────────────
  // Estimate ~4 chars per token. Remove lowest-energy lines until under budget.
  const maxChars = DECODE_MAX_TOKENS * 4
  let totalChars = 0
  for (const line of lines) totalChars += line.text.length + 1 // +1 for newline

  if (totalChars > maxChars) {
    // Sort by energy ascending (lowest first) for removal candidates,
    // but preserve original order for output. Mark lines to keep.
    const indexed = lines.map((line, i) => ({ ...line, index: i }))
    indexed.sort((a, b) => a.energy - b.energy)

    const removed = new Set<number>()
    let currentChars = totalChars
    for (const item of indexed) {
      if (currentChars <= maxChars) break
      removed.add(item.index)
      currentChars -= item.text.length + 1
    }

    const kept = lines.filter((_, i) => !removed.has(i))
    const block = kept.map(l => l.text).join('\n')
    return { systemPromptBlock: block, structureCount: totalStructures }
  }

  const block = lines.map(l => l.text).join('\n')
  return { systemPromptBlock: block, structureCount: totalStructures }
}

// ─── Render For UI ───────────────────────────────────────────────────────────
// Flat list of all structures, sorted by energy/confidence descending.
// For memory program tree UI (#19). No formatting — typed structures only.
// CA5: deterministic projection.

export function renderForUI(decoded: DecodeOutput): DecodedStructure[] {
  // A3: typed boundary — returns atom array.

  const all: Array<{ structure: DecodedStructure; sortKey: number }> = []

  for (const e of decoded.entities) {
    all.push({ structure: e, sortKey: e.energy })
  }
  for (const r of decoded.relations) {
    all.push({ structure: r, sortKey: r.weight })
  }
  for (const c of decoded.claims) {
    all.push({ structure: c, sortKey: c.confidence })
  }
  for (const s of decoded.sequences) {
    // Sequence sort: average energy of constituent entities
    all.push({ structure: s, sortKey: averageEntityEnergy(decoded, s.nodeIds) })
  }
  for (const t of decoded.tensions) {
    // Tensions: invert bridge weight — weakest bridge = most interesting
    all.push({ structure: t, sortKey: t.bridgeWeight > 0 ? 1 / t.bridgeWeight : 1 })
  }
  for (const a of decoded.artifacts) {
    all.push({ structure: a, sortKey: a.energy })
  }

  all.sort((a, b) => b.sortKey - a.sortKey)
  return all.map(item => item.structure)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function entityName(decoded: DecodeOutput, nodeId: string): string {
  const entity = decoded.entities.find(e => e.nodeId === nodeId)
  return entity?.name ?? nodeId
}

function averageEntityEnergy(decoded: DecodeOutput, nodeIds: string[]): number {
  if (nodeIds.length === 0) return 0
  let total = 0
  let count = 0
  for (const nid of nodeIds) {
    const entity = decoded.entities.find(e => e.nodeId === nid)
    if (entity) {
      total += entity.energy
      count++
    }
  }
  return count > 0 ? total / count : 0
}
