// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/resolve-dimension.ts]
//
// KEYSTONE — the one pre-pivot step; every fix lives here. Pure ("resolve the
// columns"; G1-G3). Reads the flat fact table, welds the identity homes into
// things, and returns a resolveRef the rest of the engine reads geometry through.
// Rules (each mechanical, each closes a finding by construction):
//  1. Member = identity only (a referenced-only coord is never a member; G3).
//  2. Cluster identity-homes by lowercased surface AND IDENTIFY between two
//     identities; an IDENTIFY to a non-identity resolves the word to that coord's
//     host thing, mints nothing (G1 pronoun/typo weld = ordinary IDENTIFY).
//  3. Label = modal surface of the cluster (most-frequent word), not first.
//  4. Fold is applied where rows become relations (M3/M4) via this resolveRef.
//  5. Distinctness guard (G2): a RELATE resolving to < 2 distinct things is an
//     IDENTIFY, not a RELATE — rejected at the relation sites (M3/M4) through
//     this resolveRef (it collapses a self-RELATE to one thing).
//  6. resolveRef: name -> the thing of that surface's identity-home(s); coord ->
//     its member-thing, else its host thing (value-on-host); unresolvable -> null.
//
// ThingId = the cluster's canonical key (lowercased modal surface). It is the
// stable cross-call key the views address columns by; Thing.label keeps the
// original-case modal surface for the name-first render.

import type { Coord } from '@/core/types/substrate-raw.types'
import type { Ref } from '@/features/F-present/config/mark-types'
import type { FactRow, ThingId, Thing, Dimension } from '@/features/F-present/config/read-engine-types'
import { MarkSurfaceError } from '../config/mark-surface-error'   // R4b (§F) — same class as the surface-mark guard, zero-dep leaf (no graph drag)

const keyOf = (c: Coord) => `${c.who}:${c.sc}:${c.pos}`

export function resolveDimension(rows: FactRow[]): Dimension {
  // ── coord <-> key, and the surface at each mark home ──────────────────────────
  const coordAt = new Map<string, Coord>()
  const surfaceAt = new Map<string, string>()
  for (const r of rows) {
    const k = keyOf(r.home)
    coordAt.set(k, r.home)
    surfaceAt.set(k, r.surface)
  }

  // ── Rule 1 — members are identity homes only ──────────────────────────────────
  const identityKeys = new Set<string>()
  for (const r of rows) if (r.op === 'identity') identityKeys.add(keyOf(r.home))

  // lowercased surface -> the identity-home keys carrying that word
  const surfaceToIdentityKeys = new Map<string, string[]>()
  for (const k of identityKeys) {
    const w = (surfaceAt.get(k) ?? '').toLowerCase()
    ;(surfaceToIdentityKeys.get(w) ?? surfaceToIdentityKeys.set(w, []).get(w)!).push(k)
  }

  // ── union-find over identity keys (Rule 2) ────────────────────────────────────
  const parent = new Map<string, string>()
  for (const k of identityKeys) parent.set(k, k)
  const find = (x: string): string => { let r = x; while (parent.get(r) && parent.get(r) !== r) r = parent.get(r)!; return r }
  const union = (a: string, b: string) => { const ra = find(a), rb = find(b); if (ra && rb && ra !== rb) parent.set(ra, rb) }

  for (const ks of surfaceToIdentityKeys.values())          // weld by shared lowercased surface
    for (let i = 1; i < ks.length; i++) union(ks[0], ks[i])

  // weld by IDENTIFY between two identities; record value-on-host redirects otherwise
  const hostRedirect = new Map<string, Ref>()               // non-identity coord key -> the ref it is a value on
  for (const r of rows) {
    if (r.op !== 'IDENTIFY') continue
    const home = keyOf(r.home)
    const target = r.refs[0]
    const tIsIdentityCoord = typeof target !== 'string' && identityKeys.has(keyOf(target))
    if (identityKeys.has(home) && tIsIdentityCoord) union(home, keyOf(target as Coord))
    else if (identityKeys.has(home) && typeof target === 'string') {
      // R4b (infra §F) — same-turn name-tie: an identity home IDENTIFYs another
      // identity by NAME (not coord). Resolve the named span to its identity-
      // home(s) by surface and weld. A non-resolving tie silent-dropped before
      // (a silent split); now it is LOUD — mirroring MarkSurfaceError, naming the
      // unresolved span. Never a nearest-attach, a guess, or a faked coord.
      const tk = surfaceToIdentityKeys.get(target.toLowerCase()) ?? []
      if (tk.length === 0)
        throw new MarkSurfaceError(
          `IDENTIFY names surface "${target}" but no identity-home in this turn carries it — the tie does not resolve (no nearest-attach, no guess).`,
        )
      for (const k of tk) union(home, k)
    }
    else if (!identityKeys.has(home)) hostRedirect.set(home, target) // word redirects to target's host
  }
  for (const r of rows) {                                    // QUALIFY value coords sit on their target's host thing
    if (r.op !== 'QUALIFY') continue
    const home = keyOf(r.home)
    if (!identityKeys.has(home) && !hostRedirect.has(home)) hostRedirect.set(home, r.refs[0])
  }

  // ── build things (Rule 3 — modal label); id = lowercased modal surface ─────────
  const clusters = new Map<string, string[]>()              // root coord-key -> member coord-keys
  for (const k of identityKeys) { const root = find(k); (clusters.get(root) ?? clusters.set(root, []).get(root)!).push(k) }

  const things = new Map<ThingId, Thing>()
  const coordKeyToThingId = new Map<string, ThingId>()
  const nameToThingId = new Map<string, ThingId>()

  for (const keys of clusters.values()) {
    const members: Coord[] = keys.map(k => coordAt.get(k)!).sort((a, b) => a.sc - b.sc || a.pos - b.pos)
    const freq = new Map<string, number>()
    for (const k of keys) { const w = (surfaceAt.get(k) ?? '').toLowerCase(); freq.set(w, (freq.get(w) ?? 0) + 1) }
    let modalLower = ''; let modalLabel = ''; let best = -1
    for (const k of keys) {
      const surf = surfaceAt.get(k) ?? ''
      const f = freq.get(surf.toLowerCase()) ?? 0
      if (f > best) { best = f; modalLower = surf.toLowerCase(); modalLabel = surf }   // representative original case
    }
    const id = modalLower as ThingId
    things.set(id, { id, label: modalLabel, members, weight: 0, parent: null })
    for (const k of keys) {
      coordKeyToThingId.set(k, id)
      const surf = (surfaceAt.get(k) ?? '').toLowerCase()
      nameToThingId.set(surf, id)                            // every member surface resolves to this thing (welds: 'buidl' -> 'build')
    }
  }

  // ── resolveRef (Rule 6) ───────────────────────────────────────────────────────
  const refToThingId = (r: Ref): ThingId | null => {
    if (typeof r === 'string') return nameToThingId.get(r.toLowerCase()) ?? null
    const k = keyOf(r)
    return coordKeyToThingId.get(k) ?? null
  }
  const resolveRef = (r: Ref): ThingId | null => {
    const direct = refToThingId(r)
    if (direct) return direct
    if (typeof r === 'string') return null
    const host = hostRedirect.get(keyOf(r))                  // value-on-host: bound to a target's thing
    return host !== undefined ? refToThingId(host) : null
  }

  return { things, resolveRef }
}
