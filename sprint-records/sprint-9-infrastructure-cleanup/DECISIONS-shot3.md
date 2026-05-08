---
kind: cycle-record
placement: sprint-records/sprint-9-infrastructure-cleanup/
---

# Sprint 9 Shot 3 — Decision-D Table + F-FORWARD Dispositions

**Sprint:** 9 / Phase 1 — Infrastructure Cleanup
**Shot:** 3
**HEAD at entry:** ccd8693 (post-Shot-1+2 overlay)

## Migration 017

**File:** `migrations/017-drop-lm-v2x-tables.sql`
**Action:** Authored.
**Pre-condition verified:** Zero references to `mem_node`, `mem_edge`, `mem_arm`, `mem_dominance` in `src/` at HEAD.
**Content:** `DROP TABLE IF EXISTS <table> CASCADE` for all four LM v2.x tables.

## F-FORWARD Dispositions

### F-FORWARD-2 — DEFERRED
`execution-check.ts` `knownMetaFiles` `'SLICE.md'` hardcode. Inverted validator does not resolve — slice-internal runtime logic, not a placement drift item. Out of Sprint 9 scope per DD-Exec-Check-Scope. Forward LIV-Standard cycle.

### F-FORWARD-9(a) — DEFERRED
F-memory missing `domain/`. Structural decision required on F-memory architecture. Forward LIV-Standard cycle.

### F-FORWARD-9(b) — DEFERRED
Six on-disk slices undeclared (`F-admin`, `F-artifact`, `F-executor`, `F-multi-instance`, `F-plan`, `F-router`). Layer-completeness reconciliation required per-slice. Forward LIV-Standard cycle.

### F-FORWARD-10 — DEFERRED
17 CC.18 violations remain. Per-site triage required (elevate to types/contract or document exception). Not mechanical. Forward LIV-Standard cycle.

### F-FORWARD-11 — DEFERRED
10 reserved names in `FSlice` + `STATE_NAMESPACES`. L0 ratification required on reserved-vs-retracted semantics. Forward LIV-Standard cycle.

### F-FORWARD-3 — CLOSED Sprint 9 Shot 1
### F-FORWARD-4 — CLOSED Sprint 9 Shot 1

## Decision-D Table

| ID | Item | Decision | Basis |
|---|---|---|---|
| D-S3-017 | migration 017 | Authored | Zero src/ refs confirmed pre-authoring |
| D-S3-FF2 | F-FORWARD-2 | Deferred | Slice-internal; out of Sprint 9 scope |
| D-S3-FF9 | F-FORWARD-9 a+b | Deferred | Structural decisions required |
| D-S3-FF10 | F-FORWARD-10 | Deferred | Per-site architectural triage required |
| D-S3-FF11 | F-FORWARD-11 | Deferred | L0 ratification required |
