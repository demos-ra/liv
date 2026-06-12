---
kind: derivation-log
shot: Sprint Wire-Economy — Build Spec v1.0, Shots 1–5 + governance
dispatched: builder
authority: L0 (Demos) directing; ratification pending at sprint close
predecessor: Sprint Wire-Economy Build Spec v1.0 (L0-gated 2026-06-12); HEAD 538be22 (post-Wire-Cognition)
branch: sprint-wire-economy (commits b6d2b0b, e8d603b, 455ca23)
date: 2026-06-12
env: repo-only — NO DB, no network (path B). In-memory/local edits + tests only.
---

# Derivation log — Sprint Wire-Economy (Shots 1–5)

Governing law executed: **what is static rides a once-channel; what is alive rides the turn.
Marks are the memory; words are ground truth — fetched, not carried. The model testifies; the
structure validates.** This log records the builder's decisions for L0 ratification and for the
terminal audit. The continuity bar (§5.1) and real-DB persistence are formally moved to
post-deploy per the path-B dispatch; the in-memory smoke is the interim gate.

---

## §1 — Rulings executed (R1–R10)

- **R1 one call per turn** — the wire `turn` door carries BOTH turns ({wearerText, reply,
  replyMarks, priorMarks}) and responds with the fresh present. The separate wearer/llm `write`
  calls are gone. (Shot 2)
- **R2 manual → once-channels** — `COIN_MANUAL` rides the `turn` tool description (delivered once
  at tools/list); native delivers it as the system message. Zero per-turn manual tokens on the
  wire. One source, two deliveries. (Shot 2)
- **R3 marking = claim + validate** — both turns marked by 1-based WORD-INDEX into the call's
  text, each mark carrying its `surface`; LIV cuts, resolves index→canonical pos, and verifies
  cell.word === surface byte-exact; mismatch/out-of-range → loud `MarkSurfaceError`. (Shot 1)
- **R4 priorMark narrowing** — fresh priorMark homes = the current wearer turn only (word-index +
  surface); deeper reach lives in marks via Ref (name | lookup-copied coordinate). NF1 dissolved:
  home-validation = index range-check + surface-check. Existing stored marks stand as history. (Shots 1, 5)
- **R5 native rides by construction** — the resolver change landed in the one shared
  `recordScoredTurn`; native inherits via the `wearer:{written}` source. No native conversion, no
  resistance → no HALT. (Shot 1)
- **R6 one instrument** — the `view` enum is gone; one `pivot()` over Excel-register zones
  (rows·columns·slicer·level·top·filter·sort). Ring-semantics: `level` = rings; `top` =
  share-of-ring (concentric, scale-invariant) — the cross-branch inversion is fixed. (Shot 3)
- **R7 defaults layer** — `PRESENT_BUNDLES`, rail-aware named CONFIG data: native = transcript +
  both tables; wire = both tables only. The model deviates per call; never edits defaults. (Shot 5)
- **R8 lookup** — grid re-homed as the F-present read control `lookup` (turn | span | thing →
  numbered cells); the wire exposes it; the transcript is fetched, never carried per turn. (Shot 5)
- **R9 registers** — content musical (note·tie·chord·expression) on every model/wearer surface;
  engine technical (identity·RELATE·QUALIFY·IDENTIFY); `register-map.ts` is the one
  name-translation seam, mark-gate untouched. (Shot 4)
- **R10 latency close** — deferred: the live timed measurement is post-deploy (no DB in-repo). The
  sprint's CODE is complete; the latency close is the L0 measurement, not in this build's reach.

---

## §2 — Builder-derived decisions (flagged for audit)

The spec marked several points "builder derives." Each derivation + its basis:

1. **E1 fork → "feeds it", not "moves inside" (Shot 1).** Native's wearer turn is already written
   by chat-contract E1 at the perimeter (the sprint-beta race fix, F6-fatal). recordScoredTurn
   takes the wearer as `{written:{sc,wordCells}}` (native) or `{text}` (wire). Moving the wearer
   write out of E1 would trip the §7 HALT trigger (E1 perimeter stamping disturbed) and break the
   race fix → "feeds it" is forced. E1 untouched.
2. **Surface-check failure → loud + ATOMIC, validate-before-write (Shot 1).** The resolver throws
   `MarkSurfaceError` before any write; nothing persists; the model re-emits. Basis: the wire's
   claim→validate→re-emit loop — a partial commit would double-write on re-emit. Native's wearer
   is E1's pre-write (only the llm reply is withheld). **Open to veto.**
3. **Shots 1 & 2 are ATOMIC on the wire (Shots 1–2).** The priorMark model needs the wearer text
   in the same call (the turn door) — no coherent Shot-1-only wire state. Committed together.
4. **Zone param semantics (Shot 3) — the largest derivation.** The spec gives the 7 register NAMES
   but not exact semantics. Derived: `top` = share-of-ring where a ring = nodes at the same depth
   from the wearer (concentric — matches done-#4 "heavy deep vs light ring-1"); `level` = one depth
   bound collapsing the old asymmetric ancestorsUp/descendantsDown; forest/sheet = named configs
   over one engine sharing the ring filter + sort. Output types (ForestResult/SheetResult)
   preserved to bound render churn. **The substantive fix is pinned by done-#4; the precise param
   surface is builder-derived — primary audit target.**
5. **Musical mapping (Shot 4):** note=identity, tie=IDENTIFY, chord=RELATE, expression=QUALIFY
   (R9 order note·tie·chord·expression; tie=co-reference reads as a musical tie of same pitch).
   Intake translation is lenient (already-engine ops pass through) so internal callers/tests hold.
6. **Lookup shape (Shot 5):** turn | span | thing. `thing` resolves a name to its cluster's member
   coordinates (the read control lives in F-present because it needs the dimension). Selector
   declared inline in F-mcp's ToolIntention to keep R1 pure (no F-present import).

---

## §3 — Deletion manifest (filed; each cascade-traced)

| Deleted | Cascade-traced consumers updated |
|---|---|
| `write` tool | mcp-tools, tool-registry (ToolIntention + planToolCall), mcp-contract, wire-write-v2 test → wire-turn test |
| `grid` tool | mcp-tools, tool-registry, mcp-contract, mcp-tools.schema test, wire-turn test → re-homed as `lookup` |
| write echo | mcp-contract turn response = present (not a cell echo) |
| WEARER-TURN CELLS block (both rails) | cognition-orchestrator (renderWearerCells + buildScoringContext param), chat-contract wearerTurn still feeds the recorder (not rendered), scoring-context test |
| per-turn wire manual | manual rides the turn description (once-channel) |
| per-turn wire transcript | wire bundle = tables only (R7) |
| `view` enum | read-engine-types PivotConfig, pivot, cognition-orchestrator, render-present test |
| coordinate-counting teaching for fresh marks | manual v2 (word-index + surface) |
| `splitEmission` | replaced by locateWordMarks + homeMarks |
| `WHO_VALUES` (dead after the turn door dropped `who`) | mcp-tools, tool-registry |
| `DEFAULT_FOREST_CUTOFF` / `ANCESTORS_UP` / `DESCENDANTS_DOWN` | → DEFAULT_FOREST_TOP / DEFAULT_SHEET_LEVEL |

---

## §4 — Standards deltas to ratify (STAGED — not applied to the canonical framework files)

The canonical framework files (present-standard v6.0, perimeter-standard v1.3) carry the strict
metaframework apparatus and explicit derive→audit→ratify gates. Per repo governance, the builder
does NOT unilaterally bump them mid-build. The required deltas are staged here for the proper
derive/ratify pass:

- **Present Standard amendment (closes the STALE gap):** the read model gains (a) the ONE
  instrument — zone-driven pivot, no view enum; (b) ring semantics — `top` = share-of-ring,
  concentric/scale-invariant; (c) the rail-aware defaults layer (PRESENT_BUNDLES); (d) the
  claim+validate write contract — both turns by word-index+surface, loud+atomic surface-check;
  (e) the musical content register (note·tie·chord·expression) vs the technical engine; (f) the
  `lookup` read control (turn|span|thing) re-homed from the wire.
- **Perimeter Standard delta — the TURN-DOOR CLASS:** a write door whose response carries the
  present (a read). Demanded shape, circumstance perimeter-stamped (never sent), extras rejected;
  the loud claim+validate rejection is a law-named invalid-params, atomic (nothing persisted).
- **Manager Playbook note — the hard-request rule:** a manager missing ground BLOCKS and requests
  it (the DB-target precondition halt this sprint is the worked example); soft-flagging is drift.

---

## §5 — Gates & evidence

- **typecheck** clean; **70/70 tests pass**; **eslint 0 errors**; **mark-gate.corpus byte-unmodified**
  (§4 invariant — one gate, untouched); **reply-render-fidelity** render gate held byte-identical.
- **Adversarial surface-check suite (done-#2):** miscount, cell-position-as-index, out-of-range,
  duplicate-word — all loud, none silent; one bad mark fails the batch atomically.
- **Instrument bars (done-#4):** ring-inversion/concentric proof, level bound, off-default config,
  forest golden byte-equal.
- **R9 leakage sweep** clean both directions (manual/schema/render musical; gate/engine technical).
- **A2.4 read-engine sweep** clean — homes consumed generically (op-agnostic resolveRef).
- **Interim gate (path B):** in-memory smoke green — JSON-RPC handshake, `write` absent / `turn`
  flat with the manual once-channel, door rejections law-named, a turn recorded both-turns-one-call
  with marks homed, surface mismatch loud + atomic (0 writes).
- **DEFERRED post-deploy:** real-DB persistence, the §5.1 continuity bar (two fresh sessions + DB
  ground), and the §5.6 / R10 live latency measurement. No DB or network in the build env (the DB
  precondition resolved only to production 45.76.29.179 — HALTED, touched nothing).

---

## §6 — Escalation / HALT status

No §7 trigger fired during the build: native did not resist the shared resolver (R5); E1's
perimeter stamping was not disturbed ("feeds it"); no second home appeared (one cutter, one
filter semantic, one map, one bundle home); FIX-1 pinned the new example; the flat ad held
transport-safe (T5 carried); nothing required a sign/prompt/police instead of structure. The
build HALTS here for audit per dispatch — no deploy actions taken.
