# Kind-A Sprint — Builder Delivery Report (re-issue, post spec-correction)

**Header tag:** `kind-a-v6`
**Sprint:** Kind-A — F-present v6.0 into the deployed tree + consumer patch
**Base:** HEAD `2ea38c6` (present-standard v2.0, F-present v2.0 emitter)
**Re-issue reason:** `kind-a-spec-correction.md` — the original spec scoped F-present's
consumer set as `{F-chat}`; the true set is `{F-chat, route.ts}`. This re-issue adds
`src/app/api/present/route.ts` to Shot 2. Shot 1 and the F-chat half of Shot 2 are
unchanged from the first delivery.
**Builder verdict:** **PASS with one escalation** — see §6. All patch work is complete and
type-verified against v6.0 ground; the `npm run build` exit gate could not be executed in
the builder environment because no build harness is present in any upload. Manager
disposition required before the verdict can be upgraded to unconditional PASS.

---

## 1. Pre-build — ground verification

First delivery (all passed, unchanged): `2ea38c6` lineage confirmed (`present-standard.md`
v2.0, `emit-view.ts` present); v6.0 package confirmed (20-file `sprint-b3-present-v6` set);
F-chat call site confirmed.

Correction adds one ground check, **passed**:
- `src/app/api/present/route.ts` exists in the `2ea38c6` tree and builds a v2.0
  `PresentIntent` (`focus`/`ordering`/`standpoint`), importing `FocusSelector`/`OrderingSelector`.
- **Blast-radius re-verified independently.** Tree-wide grep for the v6.0-deleted
  type/field symbols (`FocusSelector`, `OrderingSelector`, `PresentReadIntent`,
  `dominantSurfaceForm`, `maxThreads`), excluding F-present's own slice (which legitimately
  carries them in its v6.0 type history), returns exactly two consumer files:
  `src/features/F-chat/contract/chat-contract.ts` and `src/app/api/present/route.ts`.
  No third consumer. The correction's claim holds mechanically.

---

## 2. Shot 1 — v6.0 F-present into the tree (unchanged from first delivery)

**Mode:** generative. 16 v6.0 F-present files overlaid v2.0; `present-standard.md` replaced
v2.0 -> v6.0; `emit-view.ts` removed (`DELETE_MANIFEST.txt`, one line), verified referenced
by nothing post-overlay. 2 Manual amendment files carried, NOT applied. F-present slice is
now 16 files. No change in this re-issue.

---

## 3. Shot 2a — F-chat patched (unchanged from first delivery)

**Mode:** generative. `src/features/F-chat/contract/chat-contract.ts`:
- Intent envelope migrated v2.0 -> v6.0 three-control model: `camera: {mode:'derived'}`,
  `temporal: {depth:'surface'}`, `standpoint: null`, `bound` with `maxEdges`. F-chat is the
  user-driven path — camera derived, temporal surface, standpoint null = the live present.
- View-read migrated: `dominantSurfaceForm` (deleted at v6.0) -> `stack[stack.length-1]
  .surfaceForm`, `n.identity` fallback preserved.
- Imports verified against v6.0 contract; comment block, history line, header tag updated.

No change in this re-issue. All v6.0 field/type facts verified directly against the v6.0
`present-types.ts` / `present-contract.ts` — see first delivery report section 3 for the
field-by-field table.

---

## 4. Shot 2b — route.ts patched (NEW in this re-issue)

**Mode:** generative. One file: `src/app/api/present/route.ts`. route.ts maps an HTTP
request body to a `PresentIntent`, calls `present()`, returns the result. It reads no
`PresentView` fields — **intent-envelope migration only**, no `dominantSurfaceForm` concern.

Four regions changed, all verified against v6.0 ground; the file was diffed against the
`2ea38c6` original to confirm **only** these four regions changed (auth, body parse,
`present()` call, response/error paths untouched):

### 4a — Import block
`FocusSelector` and `OrderingSelector` removed (deleted at v6.0). `PresentIntent`,
`FrameworkRef`, `IntentIdRef` kept — **all three confirmed exported by v6.0
`present-contract.ts`** (lines 34, 53, 60 of the v6.0 contract). `ScopeRef`/`PositionRef`
import from `substrate.types` unchanged — both still used.

### 4b — Intent construction

| v6.0 field | value written | verified against |
|---|---|---|
| `camera` | `(body['camera'] ?? { mode: 'derived' }) as PresentIntent['camera']` | `CameraSetting = {mode:'derived'} \| {mode:'set';anchor}` — `{mode:'derived'}` is a valid arm |
| `temporal` | `(body['temporal'] ?? { depth: 'surface' }) as PresentIntent['temporal']` | `TemporalSetting = {depth:'surface'} \| {depth:'span';...}` — `{depth:'surface'}` is a valid arm |
| `standpoint` | `(body['standpoint'] ?? null) as PositionRef \| null` | `standpoint: PositionRef \| null` — unchanged from v2.0 |
| `bound` | default `{ maxNodes: 20, maxEdges: 40, walkBudget: 100 }` | `ViewBound = {maxNodes, maxEdges, walkBudget}` — middle field `maxEdges` (v6.0; was `maxThreads`) |

route.ts is the external-API path: `camera`/`temporal` are body-sourced with v6.0 defaults
applied on absence — preserves the file's existing default-on-absent pattern (the same
pattern `body['bound'] ?? {...}` already used). Body-sourced fields typed via indexed
access `PresentIntent['camera']` / `['temporal']` — consistent with the file's existing
`body['bound'] as PresentIntent['bound']`.

### 4c — Header + comment
Header pins updated `@liv-standard v1.5.2` -> `... amended kind-a-v6` and
`@present-standard v2.0` -> `v6.0`. Sprint history line and the body-mapping comment block
updated from the v2.0 `focus/ordering/standpoint` rationale to the v6.0 camera/temporal
model. Sprint tag appended; prior history not rewritten.

---

## 5. Per-file change summary (23-file deliverable)

| File | Change |
|---|---|
| `frameworks/standards/present-standard.md` | full replacement v2.0 -> v6.0 |
| `src/features/F-present/**` (16 files) | full replacement v2.0 -> v6.0 |
| `src/features/F-present/domain/emit-view.ts` | **deleted** (DELETE_MANIFEST) |
| `src/features/F-chat/contract/chat-contract.ts` | patched: v6.0 intent envelope + stack-surface view-read |
| `src/app/api/present/route.ts` | **NEW in re-issue** — patched: v6.0 intent envelope (import block + intent construction + header + comment) |
| `frameworks/manual/liv-manual-amendment-v13.4-A1.md` | carried, **not applied** |
| `frameworks/manual/liv-manual-amendment-v13.4-A2.md` | carried, **not applied** |

Deliverable: `kind-a-v6-deploy/` — 23 files (`DELETE_MANIFEST.txt`, `delivery-report.md`,
2 manual amendments, `present-standard.md`, 16 F-present files, `chat-contract.ts`,
`route.ts`).

---

## 6. Escalation — build gate could not be executed (manager disposition required)

**Unchanged from the first delivery, and it now also blocks confirming the correction's
exit gate.** The correction's exit gate reads: "`npm run build` on the composed tree — zero
errors. The build gate that caught route.ts must now come back clean."

**Gap:** No build harness is present in any upload. `liv-src-2ea38c6_tar.gz` is a partial
src extract — `src/`, `frameworks/`, `migrations/` only; no `package.json`, no
`tsconfig.json`, no lockfile, no `next.config`, no `node_modules`. `npm run build` therefore
cannot run in the builder environment.

**Required mode:** verificative — the missing artifact is the build/typecheck harness.

**Note on "the build gate that caught route.ts":** the correction states a build gate
caught route.ts as a second consumer. That build was run somewhere outside this builder
environment — the harness that produced that finding is not in the uploads given to the
builder. The builder reproduced the *finding* independently by mechanical grep (section 1),
and confirms it, but cannot run the build itself.

**What WAS verified, to the limit possible without improvising:**
- Every patched field name, union shape, and type in both `chat-contract.ts` and `route.ts`
  checked directly against the v6.0 `present-types.ts` / `present-contract.ts` — ground
  truth, not stubs (sections 3, 4b).
- All kept imports in both files confirmed exported by v6.0 `present-contract.ts`.
- `route.ts` diffed against the `2ea38c6` original — only the four intended regions changed.
- Blast radius re-verified by independent grep — exactly `{F-chat, route.ts}`, no third
  consumer.
- A standalone isolated `tsc` of the slices was again deliberately **not run** — it would
  require hand-written stubs for the entire cross-slice surface, and a wrong stub yields a
  false PASS/FAIL. Per Work Protocol Layer 3 that is improvising verification; not done.

The honest statement: both consumer patches are **type-correct against verified v6.0
ground**, and the whole-tree `npm run build` exit gate is **unexecuted, pending a buildable
tree**.

**Disposition options for the manager / L0:**
1. Re-dispatch with a complete buildable tree (full repo, or repo + lockfile/`node_modules`);
   builder runs the real `npm run build` gate and re-issues an unconditional verdict; **or**
2. Accept that the build gate fires at the deploy step on the server
   (`overlay -> npm run build (zero errors) -> git push -> ...`) — the deploy-step build IS
   the gate, and a non-zero result there blocks the push as designed.

This is a manager/L0 call, not a builder call.

**Carried from the spec (manager -> L0):** v4.0/v5.0 ratified-but-never-deployed. v6.0 must
not become the fourth ratified-undeployed version — confirm the deploy step fires for v6.0.

**Resolved, no longer an escalation:** the `/api/present` body-shape change
(`focus`/`ordering` -> `camera`/`temporal`). Per the correction, the endpoint has no
external callers — F-chat reaches F-present by direct in-process import, nothing else
references the endpoint. The body-shape change breaks nothing. Free.

---

## 7. Chain

Builder (this re-issue) -> manager review -> auditor (separate dispatch) -> fix-round if
needed -> Manual check (apply A1/A2, reconcile Manual to v6.0) -> deploy -> Playbook +
Manual update.

End of Kind-A Builder Delivery Report (re-issue).
