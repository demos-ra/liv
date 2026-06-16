---
kind: build-spec
placement: frameworks/sprint-records/pivot-compute-close/
placement-status: TEMPORARY — repo placeholder; migrates to substrate as system-
  introspection rows under the repo-purification item (post-substrate-migration).
governing: Brief v38 · Playbook v10.22 · LIV-Standard v1.5.2 · Placement Standard v1.0 · COIN v1.0 (read-engine)
base: ec16426 (Wire-Economy; live-verified this session)
mode: structural (known → structured) — structures the L0-ratified four-layer model + three rulings into the build
revision: spec-out-3 (advisor 1–6 folded; renderGrid trilemma resolved by L0 render-modularity ruling: layout is input data)
dispatched: builder (after advisor re-spec-out + L0 confirm)
authority: L0 (Demos) ratified the reframe + three rulings; advisor reviewed at spec-out; L0 reviews spec, then the built tar after audit, before deploy
frozen: false   # SPEC RE-CUT v3 → advisor re-spec-out → L0 review → builder
---

# Build Spec — F-present pivot compute-close (finish R6's compute half)

## The spine (hold under every cell)

We are building the **mini-Excel tool, not two tables.** Excel is modular because the
engine is **one general compute over field-to-zone assignments** — and LIV's modular
structure is the same shape. The law, one line: **if expand / collapse / re-zone /
add-a-table ever requires touching the engine, the build failed.** The tool accommodates;
the engine never special-cases. The drift ends here, by refusing every shortcut that would
special-case the two tables we happen to have today.

This is **not** a fresh unification. R6 (wire-economy) landed the **config-half**
(`PivotConfig`, the named configs, ring-local `top`, `PRESENT_BUNDLES`) and **deliberately
deferred the compute-half** — the wire-economy log §2.4 kept `ForestResult`/`SheetResult`
"to bound render churn" and flagged it the "primary audit target." This sprint closes that
deferral. The overclaiming comments are the residue of the half-landing; they die with the
code they describe.

## L0 rulings carried as build law

1. **Reframe + comment-truth bar.** Finish R6's compute half + delete the overclaiming
   comments. **No comment may assert a structural state the code does not hold.** Comment↔code
   agreement is checked, not just token deletion.
2. **Ancestors-never-filtered.** The chain from focus up to the wearer is always shown
   whole. `top`/brightness trims **descendants only.** Severing the line to the wearer is a
   hard fail.
3. **Generic Values zone (the heart).** The cell holds whatever the Values assignment points
   at; **the engine never branches on which table it is.** No `if lineage → weight / if
   timeline → marks`. The config names the field; the engine places it, type-agnostic. A
   future table is "point Values at a different field," never "teach the engine a new type."
   The typed union is the honest declaration; **zero table-specific branching in the engine
   is the law.** Any per-table branch in compute is an automatic audit fail.

---

## §0 — Ground, verified this session (re-evaluated, not inherited)

HEAD `ec16426`. `forest`/`sheet` never escapes F-present (`grep` confirms 0 tokens outside
the slice). Contract exports `readPresent`/`presentRouter`/`registerCognitionUpgrades`/
`isMark`/`recordScoredTurn`/`lookup`/`PRESENT_BUNDLES` — **never** the result shapes; DB,
wire, REST, tRPC do not see `ForestResult`/`SheetResult`/`PivotResult`. One path:
`source → assignment → compute → render`.

**The violation at ground (each pinned):**

- **L2 — two builders, not one compute.** `pivot()` (`pivot.ts:103`) is a dispatcher:
  `config.columns === 'line' ? sheet(...) : forest(...)`. `forest()` returns a stored nested
  object `{view:'forest', root: ForestNode, threads}` (`ForestNode` recursive,
  `pivot.ts:131-139`); `sheet()` returns `{view:'sheet', columns, rows}`. Live union
  `PivotResult = ForestResult | SheetResult` (`read-engine-types.ts:86-94`).
- **L3 — structure leaks into render.** Hardcoded titles (`render-present.ts:42,58`);
  `renderForest` walks the pre-nested tree (`render-present.ts:43-49`).
- **L1 — underused.** `PivotConfig` exists (`read-engine-types.ts:76-84`) but is not the
  single assignment surface both cuts compute from — **and it has no vocabulary for the
  timeline's row axis** (only `rows?: 'lineage'`, `columns?: 'line'`). §2.1 fixes this.
- **Comment overclaim.** `read-engine-types.ts:61` + `pivot.ts:7-10` assert the enum is gone
  while the result-discriminant lives. The config-enum is gone; the result-discriminant is
  not. Tag sites: `read-engine-types.ts:61(comment),87,93`; `pivot.ts:156,168,227`.

**The honest deviation, named (ruled by L0-3):** the Values zone holds whatever the
assignment points at — for `lineage` a **scalar** (`Thing.weight`, chain-ping sum,
pre-computed by `weighDimension`); for `timeline` a **mark-list**. The cell is a typed
union; the engine reads it type-agnostic.

---

## §1 — Decomposition grid (Layer-1 discipline; every cell ruled)

**Layers:** `L0 Source` · `L1 Assignment` · `L2 Compute` · `L3 Render`.
**Axes:** `Genericity` (no per-table branch — L0-3) · `Invariant` (chain-to-wearer +
byte-fidelity — L0-2) · `Truth` (comment↔code — L0-1) · `Containment` (no token escape, no
new builder, no boundary infringement).

| | Genericity | Invariant | Truth | Containment |
|---|---|---|---|---|
| **L0 Source** | FactRow already generic — no findings | frozen ground — no findings | no structural overclaim — no findings | engine-internal — no findings |
| **L1 Assignment** | `PivotConfig` gains zone vocabulary `rows: 'lineage'\|'time'`, `columns: 'single'\|'line'`, `values: 'weight'\|'marks'`; the single surface both cuts read — **§2.1, §7(a)** | the `line` column-source carries ancestors-whole as a zone property, not a compute special-case — **§3.2** | the two named configs renamed for the assignment; comments match — **§2.1, §4** | config DATA, R0-only — **§6** |
| **L2 Compute** | one engine composes three **config-selected zone functions** (row-source · column-source · cell-filler); **no `if (table)`, no `if (type)`**; the dispatch is deleted — **§2.2, §3.1, L0-3** | `top` trims descendants only; ancestor chain whole; lineage rows DFS pre-order for byte-equivalence — **§3.2, §5** | the R6 "one instrument" comments made TRUE by deleting the second builder + union — **§4, L0-1** | one engine, one Grid; a second builder = automatic fail — **§5** |
| **L3 Render** | one general `renderGrid(grid, renderSpec, config)`; **layout is input data (a RenderSpec), not renderer-baked**; renderer reads grid + spec, **never table/assignment identity, never re-derives compute structure**; only data-reads are `cell.kind` + spec layout fields — **§2.4, §5, §7(b)** | `joinCells`-faithful; `reply-render-fidelity` + `mark-gate.corpus` byte-identical; rendered-present **equivalence** vs the step-0 golden — **§5** | baked titles gone; no comment claims a render shape the code doesn't draw — **§4, L0-1** | reads the Grid only; no token in types/keys/comments — **§5** |

No cell is "builder derives if implicit." The five cells (a)–(e) are ruled at §7. If a
cell's check fails during build → **HALT and escalate** (gap + required mode, §8).

---

## §B0 — Build step 0: capture the equivalence golden from HEAD (do this FIRST)

Before a line changes: snapshot `renderForest` + `renderSheet` over the richest fixture —
`domain/__fixtures__/travel-store.ts` (present in the repo, **currently wired to no test**) —
at `ec16426`, plus the existing synthetic dims in `pivot-instrument.test.ts`. Commit the
output as the **equivalence referent**. Then build the unification against it. Without this,
"byte-equal to the pre-build render" (§5) has no committed referent and equivalence is
unfalsifiable. (Advisor finding 6.)

---

## §2 — The build, cut from L0 Source down

### §2.1 — L1 Assignment: one surface with real zone vocabulary

`PivotConfig` is the only place a table is described, and it must **name every zone the
engine reads** — including the timeline's row axis, which ground cannot currently express
(this gap is what would force a reborn dispatch — advisor finding 1):

```
type RowAxis    = 'lineage' | 'time'     // selects the row-source
type ColAxis    = 'single'  | 'line'     // selects the column-source
type ValueField = 'weight'  | 'marks'    // selects the cell-filler
type PivotConfig = {
  rows:    RowAxis
  columns: ColAxis
  values:  ValueField
  slicer?: ThingId
  level?:  number
  top?:    number
  filter?: Selection
  sort?:   PivotSort
}
```

The two cuts are two named configs over it — nothing else distinguishes them:

```
function lineageConfig(overrides = {}): PivotConfig {
  return { rows:'lineage', columns:'single', values:'weight', top: DEFAULT_LINEAGE_TOP, sort:'weight', filter:{}, ...overrides }
}
function timelineConfig(slicer, overrides = {}): PivotConfig {
  return { rows:'time', columns:'line', values:'marks', slicer, level: DEFAULT_TIMELINE_LEVEL, sort:'weight', filter:{}, ...overrides }
}
```

(`forestConfig`/`sheetConfig` are renamed to these; `DEFAULT_FOREST_TOP`/
`DEFAULT_SHEET_LEVEL` renamed to `DEFAULT_LINEAGE_TOP`/`DEFAULT_TIMELINE_LEVEL` — §4.) A
third table is a third named config; **never a new builder, never a new renderer** (§2.4 completes it: a table is a data bundle of assignment + render spec; both mechanisms are fixed).

### §2.2 — L2 Compute: one engine that *composes*, never branches (advisor finding 1, resolved from L0-3)

The engine is a **fixed composition over three config-keyed zone-function registries.** It
indexes the registries by the config's zone names and runs the same loop for every
assignment. There is no `if (columns==='line')`, no `if (table)`, no `if (type)` — that
dispatch (`pivot.ts:103`) and the `view` discriminant are **deleted**:

```
const ROW_SOURCES: Record<RowAxis, (dim, rows, config, columns) => GridRow[]> = {
  lineage: lineageRows,   // flat rows: depth/parent + label (Thing.label), DFS pre-order (§5), ring-trimmed by top; ignores columns
  time:    timeRows,      // rows keyed by sc, label 'sc{n}'; emitted for the scs with a hit on a column member (β)
}
const COLUMN_SOURCES: Record<ColAxis, (dim, rows, config) => ColKey[]> = {
  single: () => [VALUE_COL],                  // one synthetic value column
  line:   lineColumns,                        // [...ancestors (WHOLE — §3.2), focus, ...descendants (top-trimmed)]
}
const CELL_FILLERS: Record<ValueField, (rowKey, colKey, dim, rows, config, lens) => GridCell> = {
  weight: weightCell,     // scalar { kind:'weight', weight } from Thing.weight
  marks:  marksCell,      // { kind:'marks', marks } at (thing, sc), lens-gated
}

function pivot(config: PivotConfig, dim: Dimension, rows: FactRow[]): Grid {
  const lens     = makeLens(config.filter)
  const columns  = COLUMN_SOURCES[config.columns](dim, rows, config)            // columns first (β: time rows gate on column hits)
  const gridRows = ROW_SOURCES[config.rows](dim, rows, config, columns)         // carries depth/parent + denormalized label
  const fill     = CELL_FILLERS[config.values]
  for (const r of gridRows)
    for (const c of columns)
      r.cells[c] = fill(r.key, c, dim, rows, config, lens)
  const threads  = deriveThreads(dim, rows, lens)        // ephemeral read-time overlay (§2.4); persisted nowhere
  return { columns, rows: gridRows, threads }
}
```

Adding a table = a new config triple (+ if a genuinely new axis, a new entry in a registry —
the **tool's** extensibility surface). The engine body never changes. That is the test of
"engine accommodates, never special-cases": the registries are the tool; the loop is the
engine. Indexing a config-keyed map is composition, not a branch.

The single Grid type (one shape, nothing to discriminate). `label` is denormalized onto each
row at compute so render stays `dim`-free (lineage → `Thing.label`, the modal surface; time →
`sc{n}`):

```
type GridCell = { kind:'weight'; weight:number } | { kind:'marks'; marks: MarkEntry[] }
type GridRow  = { key: RowKey; label: string; depth: number; parent: RowKey | null; cells: Record<ColKey, GridCell> }
type Grid     = { columns: ColKey[]; rows: GridRow[]; threads: Thread[] }   // threads = ephemeral overlay; not storage (§2.4)
```

Ring machinery (`rings`, `ringKeeper`, `comparator`, `makeLens`, `distinctPeers`) is
preserved — already shared and generic. What dies: the two return shapes and the two
builders.

### §2.3 — Not a transpose (pinned so the builder doesn't unify it into a bug)

`lineage` and `timeline` are **different field-to-zone assignments, not one grid rotated**
(§7(a)). `lineage`: Rows = hierarchy, no time axis, Values = scalar. `timeline`: Rows = `sc`,
Columns = one line, Values = mark-list. The engine serves both because it is general over
zones — not because it rotates one grid.

### §2.4 — L3 Render: modular too — one renderer, layout as input spec (L0 ruling; resolves the renderGrid trilemma)

Render is modular the **same way compute is.** Compute = one engine + an *assignment* (which
zones). Render = one renderer + a *render spec* (which layout). The renderer is a general,
**branchless** walker of `(grid, renderSpec, config)`; it **never inspects table/assignment
identity and never re-derives compute structure** (no re-nesting, re-grouping, re-weighting,
re-deriving columns). It reads only `grid.rows` / `grid.columns` / `grid.threads` and the
spec's layout fields, and lays them out.

The four ways the old two bodies diverged — columns line · row-key form · cell placement ·
trailing threads block (`render-present.ts:41-70`) — are **not a render branch.** They are
**declarative fields of a render spec**: data, authored per table, fed in.

```
type RenderSpec = {
  columnsLine:  boolean              // emit "columns: a | b | …"?       lineage:false  timeline:true
  cellLayout:   'inline' | 'matrix'  // cell on the row line, or per-column sub-lines    lineage:'inline'  timeline:'matrix'
  threadsBlock: boolean              // emit the trailing chord section from grid.threads?    lineage:true   timeline:false
}                                    // header = renderHeader(config); row indent+key fall out of grid.rows (depth, label)

function renderGrid(grid: Grid, spec: RenderSpec, config: PivotConfig): string {
  const out = [renderHeader(config)]                                    // config-driven header (the precedent this extends)
  if (spec.columnsLine) out.push(renderColumns(grid.columns))           // reads grid data, gated by a spec field
  for (const r of grid.rows) out.push(renderRow(r, grid.columns, spec.cellLayout))  // indent = depth; key = r.label
  if (spec.threadsBlock) out.push(renderThreads(grid.threads))          // reads grid.threads, gated by a spec field
  return out.join('\n')
}
```

`renderRow` prints `indent(depth) + label`, then the row's cells per `cellLayout` — inline
when one column, matrix sub-lines when many — switching only on `cell.kind` (`weight`→`[w=N]`,
`marks`→`note…`), which is **presentation on the cell's own data, never on table** (§5).

**This dissolves the trilemma; it does not bless a layout-branch.** One renderer (§2.4/§4
hold); zero table-branch (the renderer reads a spec, never asks which table); byte-equivalent
to both bodies (each table's spec reproduces its body against the §B0 golden). The builder's
"skin by assignment" is **redirected**, not ratified: the renderer does **not** look at the
assignment and pick a skin — it consumes a spec that *is* the layout, the same legitimacy
`renderHeader(config)` already carries. "Never on table" (§1·L3) means **render never
re-implements the engine**, not "render emits one layout."

**A "table" is now pure data — two halves, each fed to a fixed general mechanism:**

```
type PresentView = { assignment: PivotConfig; render: RenderSpec }
const lineageView:  PresentView = { assignment: lineageConfig(),        render: { columnsLine:false, cellLayout:'inline', threadsBlock:true  } }
const timelineView: PresentView = { assignment: timelineConfig(focus),  render: { columnsLine:true,  cellLayout:'matrix', threadsBlock:false } }
```

`pivot(view.assignment, …)` produces the Grid; `renderGrid(grid, view.render, view.assignment)`
emits the text. **Add-a-table = add a `PresentView` data bundle; touch neither engine nor
renderer.** The spine is now whole across compute *and* render.

**Threads under the spec model (carries §7(b) + advisor finding 2):** the engine always
derives `grid.threads` generically from RELATE (no engine branch); whether a table renders the
chord block is `spec.threadsBlock` (timeline:false — RELATE rides in its cells; lineage:true).
A computed-but-unshown overlay is no storage and no contradiction. **Store-nothing** = persist
nothing to the mark store / substrate; a field on the read-time Grid is not storage.

---

## §3 — The three rulings as build law

### §3.1 — Generic Values (L0-3), as the enforced invariant + its mechanism

The mechanism is §2.2: the engine reads `config.values`, indexes `CELL_FILLERS`, and places
the result type-agnostic. The compute body contains **no** reference to `lineage`,
`timeline`, `weight`, `marks`, `forest`, `sheet`, or a `view`/`kind` branch. **Audit
predicate:** grep the compute body (`pivot()` + the row/column/cell zone functions, minus the
fillers' own internals) for any table-name or value-field branch → must be **zero**. The
cell union (`kind:'weight' | 'marks'`) is declared at the type boundary for honesty; the
engine never reads the tag — only the renderer does (presentation, legal).

### §3.2 — Ancestors-never-filtered (L0-2), as a stated rule in `lineColumns`

In the `line` column-source, the ancestor chain from focus up to the wearer is taken
**whole**; `top`/brightness trims **descendants only**. At ground `sheet()` already walks
ancestors unconditionally (`pivot.ts:176-179`) and applies `keep` only to descendants
(`pivot.ts:187`); `lineColumns` must carry this as an **explicit, commented rule**, not an
accident of code order. Severing the line to the wearer is a hard fail.

### §3.3 — Comment-truth (L0-1)

Every comment touched describes the code as built. The R6 "enum GONE / one pivot()" comments
are made true (union + second builder deleted); any comment asserting a not-true structural
state is rewritten or deleted. **Auditor checks comment↔code agreement, not just token
deletion.**

---

## §4 — Deletion / rename manifest (complete; each cascade-traced — advisor finding 3)

| Site | Action | Cascade |
|---|---|---|
| `forest()` / `sheet()` builders (`pivot.ts:109,164`) | deleted | folded into one `pivot()` engine |
| `config.columns==='line' ?` dispatch (`pivot.ts:103`) | deleted | one engine, nothing to dispatch |
| `view:'forest'\|'sheet'` discriminant — 6 sites | deleted | `read-engine-types.ts:61,87,93`; `pivot.ts:156,168,227` |
| `ForestResult`/`SheetResult`/`PivotResult` union (`read-engine-types.ts:86-94`) | deleted | one `Grid` type |
| `ForestNode` + `renderForest` tree-walk | deleted | flat `GridRow{depth,parent}` + read-time indent in `renderGrid` |
| stored `ForestResult.threads` field | deleted | ephemeral `grid.threads` overlay (§2.4) |
| hardcoded titles (`render-present.ts:42,58`) | deleted | `renderHeader(config)` |
| `forestConfig`/`sheetConfig` (`pivot.ts:30,33`) | **renamed** → `lineageConfig`/`timelineConfig` | callers in `cognition-orchestrator.ts:88,179,181` |
| `DEFAULT_FOREST_TOP`/`DEFAULT_SHEET_LEVEL` (`read-engine-types.ts:102,103`) | **renamed** → `DEFAULT_LINEAGE_TOP`/`DEFAULT_TIMELINE_LEVEL` | imports in `pivot.ts:24,31,34` |
| `renderForest`/`renderSheet` (`render-present.ts:41,57`) | deleted | one general `renderGrid(grid, renderSpec, config)`; callers `cognition-orchestrator.ts:45,89,179,181` |
| render layout (the 4 divergences) | **lifted to data** | new `RenderSpec` + `PresentView` (`lineageView`/`timelineView`); `GridRow` gains denormalized `label`; renderer branchless over the spec (§2.4) |
| `as ForestResult`/`as SheetResult` casts (`cognition-orchestrator.ts:179,181`) | deleted | consume `Grid` directly |
| `bundle.forest`/`bundle.sheet` keys (`read-engine-types.ts:109,111,112`) | **renamed** → `PresentBundle = { transcript, structure, state }` | `PRESENT_BUNDLES` + call sites `cognition-orchestrator.ts:179,181` (§7(e)) |
| **`config/wires.ts:15,20`** (manifest doc carries `Forest/Sheet`, `renderForest/renderSheet`) | **updated** | 5th production file — manifest re-describes the one engine + `renderGrid` |
| overclaiming comments (`read-engine-types.ts:61`, `pivot.ts:7-10`) | rewritten | describe the one-engine reality (L0-1) |

**Test cascade (3 files — rename + re-golden):** `domain/__tests__/pivot-instrument.test.ts`
(incl. the `renderForest` golden at line ~101 → `renderGrid`), `domain/__tests__/render-present.test.ts`,
`config/__tests__/present-bundle.test.ts`. No `forest`/`sheet` token survives anywhere —
types, builders, configs, constants, bundle keys, comments, manifest, tests.

---

## §5 — Auditor bars (each a hard fail)

- **Step-0 golden first** — equivalence has no referent until the HEAD golden is committed
  (§B0). Building before snapshotting = fail.
- **Rendered-present equivalence** — the model sees the same lineage outline + timeline grid
  as at `ec16426`, now via flat-rows + render-time indent. Equivalence of **output**.
- **Lineage flat-row order = DFS pre-order** — parent immediately before its children,
  siblings in sort order; reproduces the current nested `renderForest` walk byte-for-byte.
  A BFS / group-by-depth emission type-checks and **silently diverges the golden** — fail.
  (Advisor finding 5.)
- **Native byte-identical** — `reply-render-fidelity`, `mark-gate.corpus` unmodified.
- **One L2 engine** — a second builder peer to `pivot()` = automatic fail.
- **[L0-3] Generic-Values law** — zero table-name / value-field / `view`/`kind` branch in
  the **compute** body (engine + zone-source functions). The sharpest bar.
- **Render carve-out, scoped (so the bar doesn't false-fire — and can't reopen the fork)** —
  `renderGrid` reads exactly two kinds of data: the **`cell.kind`** tag (`weight`→`[w=N]`,
  `marks`→`note…`) and the **RenderSpec layout fields** (`columnsLine`/`cellLayout`/`threadsBlock`).
  Both are input data. The renderer **may never** branch on table/assignment identity and
  **may never re-derive compute structure** (no re-nest, re-group, re-weight, re-column) — it
  reads `grid.rows`/`grid.columns`/`grid.threads` and lays them out. 'Never on table' = 'render
  never re-implements the engine,' not 'render emits one layout.' (Advisor finding 4 + L0
  render-modularity ruling.)
- **[L0-2] Ancestors-never-filtered** — focus→wearer chain renders whole under any
  `top`/`level`; a test driving `top` high must still show every ancestor.
- **[L0-1] Comment-truth** — no comment asserts a structural state the code doesn't hold.
- **L0 hard bars (carried):** no hardcoding / patchwork / duplication / redundancy /
  non-modular shortcut / boundary infringement / legacy drift / hanging wires.
- **Contract unaffected** — `present-contract.ts` exports unchanged; result shapes still
  never cross R3.

---

## §6 — Blast radius (verified: 5 production + 3 test, not four — advisor finding 3)

Production (5): `config/read-engine-types.ts` (types + union → `Grid`; `PRESENT_BUNDLES`
rename); `domain/pivot.ts` (two builders + dispatch → one composing engine; config renames);
`domain/render-present.ts` (two renderers + baked titles → `renderGrid` + `renderHeader`);
`app/cognition-orchestrator.ts` (call sites + casts + bundle keys); **`config/wires.ts`**
(manifest lines 15, 20). Test (3): `pivot-instrument.test.ts`, `render-present.test.ts`,
`present-bundle.test.ts`.

`forest`/`sheet` never escapes F-present (verified §0). Contract exports `readPresent`/
`lookup`, **not** result shapes. One path: `source → assignment → compute → render`.

Placement (PL-A1 self-declaration): `frameworks/sprint-records/pivot-compute-close/`, by
precedent — same class/placement as the `render-fidelity` F-present cycle record.
Housekeeping settled by precedent; migrates to substrate later.

---

## §7 — Derivation cells, ruled from standing law (resolved, not open)

**(a) One grid type with zones, not a transpose.** RULED (§2.1–§2.3): different
field-to-zone assignments over one Grid type, not one grid rotated. Basis: forest has no time
axis and a scalar Value; sheet's rows are time and its Value is a list — a rotate cannot
produce both.

**(b) Threads' honest home.** RULED from store-nothing + advisor finding 2: a thread is a
view of the marks, not a saved fact, so the **engine** derives it (it holds `dim` + `rows`)
onto the Grid as an **ephemeral `grid.threads` overlay** at compute time, always and
generically (no engine branch). `renderGrid(grid, renderSpec, config)` displays it iff
`renderSpec.threadsBlock` (lineage:true; timeline:false — RELATE rides in its cells). A
computed-but-unshown overlay is no storage: store-nothing = persist nothing to the mark store;
a read-time Grid field is not storage. Stored `ForestResult.threads` deleted. (§2.4.)

**(c) Axis asymmetry of the knobs.** RULED: `level`/`top` are the same two knobs on different
axes per assignment. Refinement (L0-2): within `timeline`, `top` is asymmetric across the
ancestor/descendant split — **ancestors whole, descendants trimmed** (§3.2). State it so the
builder doesn't "unify" `top` into filtering the ancestor chain.

**(d) Values zone carries two field types, by design.** RULED (L0-3): scalar `weight` for
`lineage`, mark-list for `timeline`. The cell is a typed union declared at the type boundary;
**the engine never branches on the tag** — only the renderer does (presentation). "Point
Values at a different field," never "teach the engine a new type."

**(e) Bundle keys.** RULED from zero-dead-words + the model: renamed for the section they
select — `PresentBundle = { transcript, structure, state }`; `PRESENT_BUNDLES` + both call
sites updated.

---

## §8 — No-shortcut / escalation discipline

The builder produces fixed files as one tar; L0 overlays/commits/deploys. **HALT and
escalate** (gap + required mode) — do not paper over — if:

- the one-engine collapse needs a `view`/table/type branch to pass a test → the Grid type or
  zone model is wrong (**structural**), not a branch;
- a value type won't ride the generic `CELL_FILLERS` path without an engine-side `if` → the
  cell union or filler registry is wrong (**structural**);
- `top` cannot trim descendants without touching ancestors → the `line` column-source is
  wrong (**structural**); never sever the chain to satisfy the knob;
- the equivalence golden diverges → the flat-rows + read-time indent is not output-equivalent
  (**verificative**); find the divergence, do not adjust the golden;
- a comment cannot be made true without a change outside these five files → **escalate**;
  don't let the comment lie, don't silently widen blast radius.

L0 mode minimal: holds the structure, exact grouped commands one gate at a time, **verify
intent, never infer it** — inferring intent is how the original fork shipped.

---

## §9 — Deploy discipline (carried)

Local build clean → push → server pull/build → `pm2 restart liv --update-env` → `sleep 12`,
then read the **fresh** `startup.begin→complete` marker (not pre-restart sediment) →
transport check: prove the present in the **model's context** via `claude --debug` + a turn
that advances the substrate position. Prod `45.76.29.179`, `/root/liv-app-v2`, pm2 `liv`,
`main`. **ASO `144.202.60.185` — never touch.**

---

## §10 — Route

Spec re-cut (spec-out-3): advisor findings **1–6 folded**; the builder's **renderGrid layout
trilemma resolved by L0's render-modularity ruling** — render is modular the same way compute
is, layout is **input data** (a `RenderSpec`), `renderGrid` is a general branchless walker
over `(grid, renderSpec, config)`, and a table is a pure data bundle (`PresentView` =
assignment + render spec) consumed by two fixed mechanisms. The builder's "skin by assignment"
is redirected (the renderer consumes a spec, never inspects table identity); the §1·L3 "never
on table" is scoped to "render never re-implements the engine." The builder's two
non-forks are **absorbed and now in-spec**: β (columns computed before rows; `time` rows gate
on column hits) and label-denormalization onto `GridRow` (render stays `dim`-free). The five
cells (a)–(e) resolved from standing law. **→ advisor at re-spec-out.** On advisor sign-off +
L0 spec review, dispatch to builder; build from §B0 (golden first) straight through.
