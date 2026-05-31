// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (tree-of-stacks, read-side — §8 two-axis call-back)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/coin-read.ts]
// COIN read — derive things/connections/colorings by POINTING INTO substrate
// coordinates (for the words) and reading F-present's OWN store (for the marks).
// Writes NOTHING to the substrate. Geometry computed here, never stored (Axis-2,
// read-time geometry). Tolerates dangling anchors (a mark whose substrate
// coordinate / referenced thing was removed → dropped; graceful degradation, the
// lens never pins content down).
//
// REFERENCE RESOLUTION (coin-spec §3 / line 48). A mark's target/peers are Ref =
// name | Coord. A Coord pins ONE exact appearance. A NAME denotes a THING — it
// resolves at READ time to the thing's identity-home(s) of that word (clusters
// across records). A name with no thing is a dangling reference → dropped (§9.4).
// Coord refs behave exactly as before this shot (proof-harness-preserving); name
// refs are the name-first path the §8 / name-or-coord schema introduced.
//
// §8 — CALL-BACK HAS TWO AXES: focus + granularity. callBack(focus, …, dial):
//   skeleton  (default) — drops article-type colorings, keeps claim-status; names,
//                         no address column. Name-first.
//   verbatim            — all colorings; surfaces the address column (who:sc:pos),
//                         the on-demand disambiguator. Address-on-granularity.
//   evolution           — one aspect: the claim-status trail down the stack (the
//                         stance/evolution history). Minimal.
// The two-axis call-back IS the present→context render; renderFocusTable serializes
// a table to context text. The '—' wearer rendering folds in here.

import type { Who, Coord, Transcript } from '@/core/types/substrate-raw.types'
import type { PresentStore, Ref }      from '@/features/F-present/config/mark-types'
import { CLAIM_STATUS }                from '@/features/F-present/config/mark-types'

const keyOf = (c: Coord) => `${c.who}:${c.sc}:${c.pos}`

type Appearance = { who: Who; sc: number; pos: number; word: string }
type Thing      = { name: string; stack: Appearance[] }
type Connection = { home: string; word: string; who: Who; sc: number; peers: string[] }
type Coloring   = { coloring: string; target: string; who: Who; sc: number }

// derive reads the SUBSTRATE (transcript → words at coordinates) and the F-PRESENT
// STORE (marks). The two organisms meet only here: marks point at coordinates.
export function derive(transcript: Transcript, store: PresentStore) {
  // words come from the substrate (intrinsic coordinates → verbatim word)
  const wordAt = new Map<string, Appearance>()
  for (const t of transcript)
    for (const w of t.words)
      wordAt.set(keyOf({ who: t.who, sc: t.sc, pos: w.pos }), { who: t.who, sc: t.sc, pos: w.pos, word: w.word })

  const present = (k: string) => wordAt.has(k)            // dangling-anchor guard

  // ── Pass A — identity homes (needed before name-refs can resolve to things) ──
  const identityKeys = new Set<string>()
  for (const pm of store) {
    const home = keyOf(pm.home)
    if (present(home) && pm.mark.op === 'identity') identityKeys.add(home)
  }
  // name (lowercased word) → the identity-home keys of that word (the thing(s))
  const nameToIdentityKeys = new Map<string, string[]>()
  for (const k of identityKeys) {
    const w = wordAt.get(k)!.word.toLowerCase()
    ;(nameToIdentityKeys.get(w) ?? nameToIdentityKeys.set(w, []).get(w)!).push(k)
  }

  // resolve a Ref to ONE present key: a Coord → its exact appearance (if present);
  // a name → the thing's (first) identity-home (if any). Dangling → null → dropped.
  // Coord branch is byte-identical to the pre-shot keyOf+present check.
  const resolveRefOne = (r: Ref): string | null => {
    if (typeof r !== 'string') { const k = keyOf(r); return present(k) ? k : null }
    const keys = nameToIdentityKeys.get(r.toLowerCase())
    return keys && keys.length > 0 ? keys[0] : null
  }

  // ── Pass B — IDENTIFY / RELATE / QUALIFY against resolved refs ───────────────
  const pairs: [string, string][] = []
  const identifyTargets = new Set<string>()
  const colorings: Coloring[] = []
  const connections: Connection[] = []

  for (const pm of store) {
    const home = keyOf(pm.home)
    if (!present(home)) continue                          // anchor removed by wearer → drop
    const m = pm.mark
    if (m.op === 'IDENTIFY') {
      const t = resolveRefOne(m.target)
      if (t) { identifyTargets.add(t); identifyTargets.add(home); pairs.push([home, t]) }
    } else if (m.op === 'RELATE') {
      const peers = m.peers.map(resolveRefOne).filter((p): p is string => p !== null)
      if (peers.length >= 2) connections.push({ home, word: wordAt.get(home)!.word, who: pm.home.who, sc: pm.home.sc, peers })
    } else if (m.op === 'QUALIFY') {
      const t = resolveRefOne(m.target)
      if (t) colorings.push({ coloring: m.coloring, target: t, who: pm.home.who, sc: pm.home.sc })
    }
  }

  // union-find: name-cluster identity homes (by their substrate word) + IDENTIFY merges
  const parent = new Map<string, string>()
  const find = (x: string): string => { while (parent.get(x) && parent.get(x) !== x) x = parent.get(x)!; return x }
  const union = (a: string, b: string) => { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra, rb) }
  for (const k of wordAt.keys()) parent.set(k, k)
  const byName = new Map<string, string[]>()
  for (const k of identityKeys) { const w = wordAt.get(k)!.word.toLowerCase(); (byName.get(w) ?? byName.set(w, []).get(w)!).push(k) }
  for (const ks of byName.values()) for (let i = 1; i < ks.length; i++) union(ks[0], ks[i])
  for (const [a, b] of pairs) union(a, b)

  // collapse to things (identity homes + IDENTIFY targets); stack ordered by (sc,pos)
  const members = new Map<string, Appearance[]>()
  for (const [k, v] of wordAt) {
    if (!identityKeys.has(k) && !identifyTargets.has(k)) continue
    const r = find(k); (members.get(r) ?? members.set(r, []).get(r)!).push(v)
  }
  const things = new Map<string, Thing>()
  for (const [root, stack] of members) {
    stack.sort((a, b) => a.sc - b.sc || a.pos - b.pos)
    const llm = stack.find(a => a.who === 'llm')
    things.set(root, { name: (llm ?? stack[0]).word, stack })
  }
  const nameToRoot = new Map<string, string>()
  for (const [root, t] of things) nameToRoot.set(t.name.toLowerCase(), root)
  return { things, connections, colorings, nameToRoot, rootOfKey: (k: string) => find(k), nameOf: (k: string) => things.get(find(k))?.name ?? wordAt.get(k)?.word ?? k }
}

// ── §8 — focus-shaped call-back, TWO AXES (focus + granularity); stored nowhere ─
export type Granularity = 'skeleton' | 'verbatim' | 'evolution'
export type FocusTable  = { focus: string; columns: string[]; rows: Record<string, string>[] }

const isClaimStatus = (c: string) => (CLAIM_STATUS as readonly string[]).includes(c)

export function callBack(
  focusName: string, transcript: Transcript, store: PresentStore, dial: Granularity = 'skeleton',
): FocusTable {
  const d = derive(transcript, store)
  const root = d.nameToRoot.get(focusName.toLowerCase())
  const focus = root ? d.things.get(root) : undefined
  if (!focus) return { focus: focusName, columns: ['who'], rows: [] }

  const colSet = new Set<string>()
  const rows: Record<string, string>[] = []
  for (const app of focus.stack) {
    const home = keyOf(app)
    const conn = d.connections.find(c => c.peers.includes(home))
    const link = conn ? conn.word : ''
    const peer = conn ? conn.peers.filter(p => p !== home).map(d.nameOf).join(',') : ''
    const cols = d.colorings.filter(q => q.target === home || (conn && q.target === conn.home))
    // '—' wearer rendering (the serializer's detail)
    const row: Record<string, string> = { who: app.who === 'wearer' ? '\u2014' : app.who, THING: app.word }
    // address-on-granularity: name-first by default; the address surfaces only at verbatim
    if (dial === 'verbatim') row['addr'] = `${app.who}:${app.sc}:${app.pos}`
    if (dial !== 'evolution') { row.LINK = link; row['\u2192peer'] = peer }
    row.sc = `sc-${app.sc}`
    for (const q of cols) {
      const claim = isClaimStatus(q.coloring)
      // skeleton: drop article-type, keep claim-status. evolution: claim-status only. verbatim: all.
      if (dial !== 'verbatim' && !claim) continue
      colSet.add(q.coloring); row[q.coloring] = q.coloring
    }
    rows.push(row)
  }

  const columns =
    dial === 'evolution' ? ['who', 'THING', 'sc', ...colSet]
    : dial === 'verbatim' ? ['who', 'addr', 'THING', 'LINK', '\u2192peer', 'sc', ...colSet]
    : ['who', 'THING', 'LINK', '\u2192peer', 'sc', ...colSet]   // skeleton (default)
  return { focus: focus.name, columns, rows }
}

// serializer — FocusTable → compact context text (present→context render, name-first).
export function renderFocusTable(t: FocusTable): string {
  const head  = t.columns.join(' | ')
  const lines = t.rows.map(r => t.columns.map(c => r[c] ?? '').join(' | '))
  return [`# ${t.focus}`, head, ...lines].join('\n')
}

// ── tree: chain-ping mass, densest = root; direction from weight, never stored ─
export function tree(transcript: Transcript, store: PresentStore) {
  const d = derive(transcript, store)
  const mass = new Map<string, number>()
  for (const c of d.connections) for (const p of c.peers) { const r = d.rootOfKey(p); mass.set(r, (mass.get(r) ?? 0) + 1) }
  let rootRoot = ''; let max = -1
  for (const [r, m] of mass) if (m > max) { max = m; rootRoot = r }
  return { edges: d.connections.map(c => ({ link: c.word, peers: c.peers.map(d.nameOf) })), root: rootRoot ? d.nameOf(rootRoot) : null }
}
