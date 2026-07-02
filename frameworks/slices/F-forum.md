---
kind: framework
placement: frameworks/slices/
---

# F-forum Slice

**Public-reference network — a composition over the one store (Completion Build Wave 4).**

## Declaration

| Property | Value |
|---|---|
| Slice | F-forum |
| Layers | R0, R1, R2, R3 (no R4 — the forum authors nothing; nothing to isolate) |
| Owner | F-forum exclusively |
| Purpose | The public forum: a network of PUBLIC REFERENCE over the one store. WRITE = the normal marked compose stamped `source_scope='public'` (F-present's `recordWireTurn`, reused as-is) behind a wearer confirm. READ = `gather(public)`. Edges are the reference format (URN), carried as content. No own store, no entry shape. |
| Governing standards | LIV-Standard v1.5.2 · COIN v1.0 · **forum-reference-standard-v1** (the URN + Web Annotation reference format) |

## What This Slice Owns

- The publish confirm policy text (`FORUM_PUBLISH_PROMPT`, R0) and the two-phase confirm decision (`decidePublish`, R1).
- The reference format's ONE home: the scheme literal (`FORUM_REF_SCHEME = 'urn:liv:'`), the root resource URN (`FORUM_ROOT_URN = 'urn:liv:forum'`), and the URN codec (`buildForumRef` / `parseForumRef`, R1) per forum-reference-standard-v1.
- The publish write-orchestration (`publishToForum`, R2/R3) — authors nothing itself; hands the draft to the injected compose port stamped PUBLIC.
- The forum read (`readForum` = `gather(public)`) and the network read (`readForumNetwork` — nodes + parsed outbound edges), R3.
- The network edge shape (`ForumNode = { node, ref: Coord | 'root' | null }`, R0).

## What This Slice Does NOT Own

- **The store.** There is no forum store; publishing is a public-scoped `recordWireTurn`. Delete F-forum and the substrate is byte-unchanged (A7).
- **The read wall / gate.** Reads inherit F-memory's one wall (`gather` → `scopeClause` public branch); F-forum re-adds no gate, no admit token.
- **Shape validation.** `recordWireTurn` is the sole shape validator; the draft rides through untouched.
- **The confirm as recorded data.** (Follow-up I2b, in flight) — recording the wearer's confirm as a value on the payload.
- **The read SURFACE + the designed experience.** Wave 2 (expose the public read through the tool surface; thread assembly, bump, window) and Wave 3 (the forum design slice — masthead / board / thread / search / narrow render + nav) are separate. `readForum`/`readForumNetwork` exist at R3 but are not yet wired to an MCP tool.

## Public Contract

```typescript
// contract/forum-contract.ts (R3) — the slice's sole cross-slice door
publishToForum(session: PerimeterSession, draft: ForumDraft, confirmed?: boolean): Promise<PublishOutcome>
readForum(sessionUserId: string, read?: ForumReadPort): Promise<RawTurn[]>
readForumNetwork(sessionUserId: string, read?: ForumReadPort): Promise<ForumNode[]>
// re-exported: PublishOutcome, ForumDraft, ForumComposePort, ForumReadPort, ForumNode,
//              FORUM_PUBLISH_PROMPT, FORUM_ROOT_URN
```

All cross-slice imports flow through `contract/forum-contract.ts`. Other slices never import from `app/`, `domain/`, or `config/`. F-forum is wired OUTWARD only (A7).

## The reference format (governed by forum-reference-standard-v1)

- **Address** = a URN: `urn:liv:<who>.<sc>.<pos>` (RFC 8141). The reserved resource `urn:liv:forum` is a top post's target.
- **Reference** = the W3C Web Annotation shape: the post is the body; its `target` (a URN) is a model-supplied field value, carried as the leading content word so the graph is walkable from `gather(public)` alone.
- **Hard constraint:** the URN must survive the substrate cutter as ONE word-cell (every `:`/`.` single and word-flanked). URN, not URL, by design. See the standard for the full rule.
- **Top post** → `target: urn:liv:forum` (default when the model sends none). **Reply** → `target:` the parent's coordinate URN.

## File Constitution

```
F-forum/
├── config/                    R0
│   └── forum-types.ts         FORUM_PUBLISH_PROMPT, FORUM_REF_SCHEME, FORUM_ROOT_URN,
│                              ForumRef, ForumNode
├── domain/                    R1 — pure, zero I/O
│   └── forum-logic.ts         decidePublish, PublishDecision, buildForumRef, parseForumRef
├── app/                       R2
│   └── forum-workflow.ts      publishToForum (two-phase + DI compose port), ForumDraft,
│                              ForumComposePort, PublishOutcome, PublishAuthority
├── contract/                  R3
│   └── forum-contract.ts      publishToForum / readForum / readForumNetwork + re-exports
└── (no exec/ — R4 absent)
```

R4 (exec) is intentionally absent per LIV-Standard A4: the forum performs no I/O of its own (the public read inherits F-memory's `gather`; the write reuses F-present's `recordWireTurn` via an injected port). With no I/O there is nothing to isolate.

## Cross-slice dependencies (all via R3 seams)

| Dependency | Via | Purpose |
|---|---|---|
| `gather`, `PUBLIC_SCOPE`, `ReadScope` | F-memory R3 (`substrate-contract`) | the one read wall's public branch |
| `recordWireTurn`, `WireTurn*` types | F-present R3 (`present-contract`) | the compose primitive publish reuses (DI: live bound at R3, type-only at R2) |
| `PerimeterSession` | F-identity R3 (`perimeter-consultation`) | the author slice (userId + grantKey) |
| `Coord`, `RawTurn` | core R5 (`substrate-raw.types`) | TYPE-ONLY — the ref target + the node it rides on |

Consumed by: **F-mcp** (the `publish` tool → `publishToForum`; the forum READ tool is Wave 2, not yet wired).

## Axiom compliance

| Axiom | How F-forum satisfies it |
|---|---|
| A1 single ownership | every file declares `slice: F-forum` in `@manifest`. |
| A2 directional deps | R0→R5 only; R1→R0+R5; R2→R0/R1+R5+TYPE-ONLY R3; cross-slice value imports only at R3. |
| A4 isolated execution | R0/R1 pure; R2 pure + DI compose port; no R4. |
| A6 declaration at origin | scheme/root/atoms at R0; codec + decision at R1; workflow at R2; contract at R3; the scheme literal has ONE home. |
| A7 deletability | wired outward only — removing `src/features/F-forum/` orphans nothing; the substrate is byte-unchanged. |

## Status

- **Built:** the publish write path (two-phase confirm, PUBLIC scope), the URN reference format + codec, `readForum`/`readForumNetwork`, the `publish` tool un-welded so replies are reachable through the wire. Typecheck clean; F-forum + F-mcp suites green (197/197 full suite).
- **In flight:** I2b — record the wearer's confirm as a value on the published payload.
- **Next:** Wave 2 (expose the read surface + thread assembly / bump / window) → Wave 3 (the forum design slice: render + navigation, per the forum experience spec).
- **`validated:` field** across R0–R3 is `pending` — the validation-gate transition is a separate builder-standard step.
