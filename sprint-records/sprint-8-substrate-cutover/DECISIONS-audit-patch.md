# Sprint 8 Audit-Patch — Decision-D Table

Per Manager Playbook §1.8.

Closes Sprint 8 close-audit FAIL finding (F-A) plus deploy-readiness drift (F-D).

L0 audit verdict: FAIL on F-A (single blocker) + 4 MINOR (F-B, F-C, F-D + 3 carryover from Shot 1). Per audit ruling: F-A blocks deploy; F-B/F-C deferred to Sprint 9 stability-window cleanup. F-D not explicitly deferred — kept in this patch because deploy-step-3 verification reads from this note and would mislead the manager if not corrected.

## Patch scope

| Finding | Severity | Closed in this patch? | Rationale |
|---------|----------|----------------------|-----------|
| F-A     | FAIL     | YES                  | Single-line build blocker. Re-export `SUBSTRATE_EVENTS` + `SubstrateEventType` from substrate-contract per A2. |
| F-B     | MINOR    | NO — deferred        | Per audit verdict: "author 017-add-identity-role-index.sql in next sprint after deploy stability window". Composite index missing; correctness preserved (TS-side role filter). Subsumes carryover F-3 (`SUBSTRATE_INDICES.identityRole` constant + 016 SQL comment misreading). |
| F-C     | MINOR    | NO — deferred        | Per audit verdict: "convert sprint-8-shot-3b annotations to canonical `// TODO Sprint 9` markers". Cosmetic — disconnect itself is achieved. |
| F-D     | MINOR    | YES                  | Deploy-readiness fix. Audit-spec deploy step 3 (`\d state_change`) reads from migration-016.md; mismatch would mislead manager. Rewrite schema block to mirror actual SQL. |
| F-2     | NOTE     | NO                   | Vocabulary collision; informational only. |
| F-3     | MINOR    | NO — subsumed by F-B | Same misreading as F-B; cleaned together when F-B lands. |
| F-4     | MINOR    | NO — deferred        | `readRolePattern` limit-before-filter semantic. Performance, not correctness. |
| F-5     | MINOR    | NO — deferred        | substrate-service header doc-drift. Non-functional. |

## Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| **AP-1** | Close F-A by re-exporting `SUBSTRATE_EVENTS` + `SubstrateEventType` from `F-memory/contract/substrate-contract.ts` (R3) via pass-through to `F-memory/config/substrate-events.ts` (R0). | Path (a) per audit recommendation. Cross-slice access through R3 contract per A2 — `event-schema.ts` is consuming F-memory atoms; the access boundary is correctly the R3 contract surface. Path (b) (changing event-schema.ts to import from R0 directly) would be R0→R0 cross-slice import, violating A2. Pattern matches the existing `REVOKE_REF` re-export already in substrate-contract.ts:83. |
| **AP-2** | Also re-export `SubstrateEventType` (the union type derived from `SUBSTRATE_EVENTS` values). | Defensive completeness — any future event-bus typing that needs `SubstrateEventType` (e.g. when F-event-system rewires to substrate emissions in Sprint 9) routes through the same R3 surface. Single-line addition; no cost. |
| **AP-3** | Update substrate-contract.ts manifest header: add the new `wires-in` (R0 atoms) and `wires-out` (R0 atom flowing to F-event-system R0) entries; add `R0 ../config/substrate-events` to deps. | Spec compliance. Manifest accuracy is part of the LIV-Standard wire-tracking discipline; the edit must not just add the export but also declare the wire. |
| **AP-4** | Close F-D by rewriting deploy-notes/migration-016.md schema block to mirror the actual `016-substrate.sql` verbatim. Add a "Notes on schema decisions (corrected)" section explaining each design choice that the previous note got wrong. Update pre-deploy checklist step 3 to specify expected column list and step 4 to specify expected index list. Add explicit reference in step 5 that the audit-patch F-A re-export must be present. | The deploy note is the manager's deploy-step verification reference. If `\d state_change` returns a different column set than the note describes, the manager pauses or escalates. Note correction prevents that. The original note was speculative/aspirational; the corrected note is a faithful description of what the migration actually does. |
| **AP-5** | Do NOT touch carryover F-3, F-4, F-5 in this patch. Do NOT add the `(identity, role)` composite index (F-B). Do NOT convert TODO Sprint 9 markers (F-C). | Audit verdict explicitly placed F-B and F-C in Sprint 9 cleanup. Carryover F-3/F-4/F-5 inherit deferral status from Shot 1 audit. Expanding scope would convert this from a surgical close-audit patch to an unauthorized cleanup pass. Manager Playbook §1.8: builder operates within audit-defined scope unless escalating. |

## Files changed

| File | Type | Change |
|------|------|--------|
| `src/features/F-memory/contract/substrate-contract.ts` | edit | Add `export { SUBSTRATE_EVENTS } from '../config/substrate-events'` + `export type { SubstrateEventType }`; update manifest header. |
| `deploy-notes/migration-016.md` | edit (audit-bundle artifact, not src) | Rewrite schema block + checklist to match actual SQL. |

## Build verification

After this patch lands in composed-tree, `npm run build` should succeed:
- `event-schema.ts:14` import resolves (`SUBSTRATE_EVENTS` now present on substrate-contract R3)
- No other consumers of `SUBSTRATE_EVENTS` outside F-memory exist (verified across composed-tree)
- TypeScript surface unchanged for all other consumers

## End
