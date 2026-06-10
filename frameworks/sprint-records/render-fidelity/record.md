---
kind: cycle-record
placement: frameworks/sprint-records/render-fidelity/
placement-status: TEMPORARY — repo placeholder; migrates to substrate as system-
  introspection rows under the repo-purification item (post-substrate-migration).
governing: LIV-Standard v1.5.2 · COIN v1.0 (G1 cutter inverse)
base: db47c65 (mark-perimeter tip; "main at db47c65" per dispatch)
frozen: false   # DIAGNOSIS → L0 ratified Option B → FIX IMPLEMENTED (pending Auditor)
---

# Cycle Record — 2-B reply-render fidelity (space-before-punctuation)

## Dispatch hypothesis vs. finding

Dispatch hypothesised a render-site bypass: "a render site space-joins the cell grid
instead of using joinCells." **The sweep disproves it.** Every cell→text render site
already routes through joinCells. The space-before-punctuation originates one step
UPSTREAM of rendering — in grid *construction* — and is surfaced verbatim by the
(correct) render layer because `joinCells ∘ cutCells` is the identity.

## Consumer-sweep — every cell→text site, with verdict

| # | Site | What it joins | Verdict |
|---|------|---------------|---------|
| 1 | `cognition-orchestrator.ts:140` `text = joinCells(cells)` | reply grid → reply text | **canonical** ✓ |
| 2 | `cognition-orchestrator.ts:164` `joinCells(tt.words)` | transcript turn → text (presentContext) | **canonical** ✓ |
| 3 | `chat-contract.ts:491` `joinCells(t.words)` | transcript turn → text (serializeTranscript) | **canonical** ✓ |
| 4 | `chat-contract.ts:777` `send({ chunk: aiResult.text })` | delivers text #1 to UI (once; not token-streamed) | passthrough ✓ |
| 5 | `chat-contract.ts:778-795` baseline path | `cutCells(reply)`; `text = reply` (raw model text) | **faithful** ✓ (no join) |
| 6 | UI (`*.tsx`) | — | **no site** reconstructs cells; UI shows server text ✓ |
| 7 | `render-present.ts:62` `parts.join(' ')` | mark op-summary labels (`RELATE[…]`) | not cell→text — n/a |
| 8 | `render-present.ts:28` `${t.word}: ${peers}` | thing label + peers (structure) | not cell→text — n/a |
| 9 | `plan-logic.ts:1189` `parts.join(' ')` | F-plan directive summary sentences | unrelated slice — n/a |
| 10 | `coin-score.ts:117` `positions.map(p => p.word).join(' ')` | **model tokens → reply text fed to cutCells** | **ROOT CAUSE** ✗ |

ai-io / streamStructuredEmit: no word-join during stream (verified). No export-path
join (F-memory). The sweep is exhaustive.

## Root cause (site #10)

Live path: `composeAndWrite` → `text = joinCells(cells)`, `cells =
rekeyReply(positions).cells`, and `rekeyReply` builds `text = positions.map(p =>
p.word).join(' ')` then `cutCells(text)`. Since `joinCells(cutCells(X)) === X`, the
rendered reply **equals** `positions.map(p => p.word).join(' ')`.

M1 (`coin-manual.ts:57`) tells the model "one word per position … punctuation kept
with its word." When obeyed (`["hello,","world."]`) the space-join is correct
(`"hello, world."`). When the model emits a standalone punctuation token
(`["hello",",","world"]`) the join yields `"hello , world"` — and the faithful render
layer reproduces it exactly. That is the live symptom.

Executed evidence: `domain/__tests__/reply-render-fidelity.test.ts` (4/4) — render
fidelity holds across punctuation/quote/ellipsis/contraction/whitespace; the identity
consequence; M1-compliant renders clean; the standalone-punct defect characterized.

## Why the prescribed fix was a no-op, and the real fix (Option B)

The dispatch's fix — "route every bypass through joinCells" — has **nothing to
reroute**: sites #1–#3 already use joinCells; #10 is not a render of a cell grid (it
reassembles model tokens into the text that is *then* cut). Making #10 punctuation-
robust needs one of:

- **A — reassembly heuristic in rekeyReply** (suppress the space before punctuation-
  only tokens). This re-implements cutCells' boundary rule = a local re-implementation
  / patch. **Forbidden** by the dispatch.
- **B — emission-contract change (the clean fix):** the model emits its reply as a
  single `reply` text field; `cutCells(reply)` is the canonical grid; `positions`
  carry only marks, keyed to word cells by index. The space-join disappears; reply
  text flows through G1 authoritatively. Changes SCORE_SCHEMA, emissionFromStructured,
  rekeyReply, splitEmission, and M1 — a redesign of §FORK-A reassembly.
- **C — prompt-only:** harden M1. Cheap but relies on model compliance; no fidelity
  guarantee. Not a fix, a mitigation.

B is correct but is an architecture/contract decision, not a builder reroute. It was
escalated and **L0 ratified Option B** (with four scope additions, below).

## Resolution — Option B implemented (§FORK-A reassembly fix)

New emission contract (the reply is one authoritative plain-text field; the space-join
is deleted):

```
ReplyMark     = { word: number; marks: Mark[] }            // word = 1-based reply word-cell index
ScoredEmission = { reply: string; replyMarks: ReplyMark[]; priorMarks: PriorMark[] }
```

- `reply` → `cutReply` (= cutCells) is the canonical river grid; `joinCells(cells) ===
  reply` byte-for-byte, so the rendered reply carries the model's exact spacing. No
  re-join exists — the space-before-punct class is structurally impossible now.
- `replyMarks` home on the canonical word-cell named by their 1-based word index;
  `cutReply` returns `wordCellPos` (the ordered word-cell positions). Out-of-range
  index → dropped (fail-closed). `priorMarks` unchanged.
- `cutReply` replaces `rekeyReply` (the space-join/char-span re-key is gone).

Fix at source, no string patches anywhere (the fidelity is structural — the cutter's
inverse — not a cleanup pass).

### Consumer enumeration of SCORE_SCHEMA / emission shape (scope #4)

| Consumer | Change |
|---|---|
| `coin-score.ts` | types (`ScoredPosition`→`ReplyMark`, `ScoredEmission`), `SCORE_SCHEMA`, `SCORE_EMIT_CONFIG`, `emissionFromStructured`, `rekeyReply`→`cutReply`, `splitEmission` |
| `cognition-orchestrator.ts` | import `cutReply`; empty-guard on `reply`; `cutReply(emission.reply)`; comments; manifest wire |
| `coin-manual.ts` (M1) | **date bumped 2026-06-08 → 2026-06-10** (scope #1); reply section + worked example + return line rewritten to plain-text `reply` + `replyMarks` by word index |
| `ai-adapter` (structured-stream / ai-adapter-config) | none — transports `schema` opaquely; `streamArray/streamField` advisory (no behaviour bound). `SCORE_EMIT_CONFIG.streamArray` dropped, `streamField:'reply'` |
| UI (`*.tsx`) | none — receives server text |

### Scope #2 — historical river rows untouched

The substrate is append-only historical truth. Existing space-glued reply rows are
NOT rewritten — no backfill, no migration. The fix applies to writes from here
forward; old rows render exactly as they were recorded (their own truth).

## Verify (executed)

Node v24.16.0 (local), `npx tsx --test`:
- `reply-render-fidelity.test.ts` — **6/6**, exercising the REAL pipeline
  (`emissionFromStructured`→`splitEmission`→`cutReply`→`joinCells`): adversarial
  punctuation renders byte-identical (comma, comma-after-paren, ellipsis, quotes,
  abbreviations, contractions, em-dash, multi-space); no space-before-punct; replyMarks
  key by word index; out-of-range dropped; priorMarks unchanged; empty reply → no write.
- `mark-gate.corpus.test.ts` — **8/8** (gate untouched by the shape change; no regression).
- `tsc --noEmit` — exit 0; touched files clean.

## Deliverable state

Branch `render-fidelity` (base db47c65): the §FORK-A fix + M1 + verification test.
`main` untouched. No push.
