# v3.2.7 Canonical Bundle Manifest

**Cycle:** MF-Cycle-2 Spec↔Referent Alignment Closure
**Date:** 2026-04-30
**Authority:** L0 confirmed
**Predecessor:** v3.2.6 (MF-Cycle-1.6 Identifier Discipline Corrective, 2026-04-29)

## Frameworks

- frameworks/substrate-v1-1.md → v1.6
- frameworks/metaframework-v3-1.md → v3.2.7
- frameworks/framework-audit-v1-2.md → v1.3.6
- frameworks/framework-registry-v1-0.md → v1.4
- frameworks/amendment-propagation-v1-0.md → v1.3.3
- frameworks/generation-procedure-v1-0.md → v1.1.6

## Spec

- spec/v3-1-spec.md → v3.2.7

## Reports

- reports/mf-cycle-2-delivery-report.md (this cycle)
- reports/mf-cycle-1-6-delivery-report.md
- reports/mf-cycle-1-5-delivery-report.md
- reports/mf-cycle-1-delivery-report.md
- reports/v3-2-3-delivery-report.md
- reports/phase-9h-terminal-delivery-report.md
- reports/phase-9h-cross-file-consistency-report.md
- reports/phase-9h-G-U1-first-run-report.md
- reports/phase-9h-ap-self-recursion-report.md
- reports/phase-1-2-fix-trail-hygiene-delivery-report.md

## Bundle integrity (cycle-2 verification)

- 3 new substrate atoms added (A-18 ReferentCitation with inline ExpectedShape sub-shape + ReferentResolver interface, A-19 ReferentAlignmentState, A-20 ReferentSnapshot)
- 3 new metaframework axioms added with paired gates (MA-V10/G-V10 Validity, MA-S8/G-S8 Schema, MA-L11/G-L11 Lifecycle)
- MA-S7 predicate tightened in-place to recursive `≼` relation governing discriminated-union sub-shapes; cycle-1 atom set (A-01..A-17) re-validated zero-regression
- G-S7 predicate amended in-place to evaluate the recursive `≼` relation
- 4-site framework-audit schema-field amendment cluster:
  - §2.1 AuditRequest: `referentSnapshotRef?: ReferentSnapshot`
  - §5.9 AuditRunRecord: `referentSnapshotRef: ReferentSnapshot | null` + `referentAlignmentStatesRef: ReferentAlignmentState[]`
  - §8.1 SelfAuditRecord: `referentAlignmentStates: ReferentAlignmentState[]`
- metaframework §2.2 GeneratedFrameworkTemplate `schema:` block extended with `referentCitations: ReferentCitation[]` (canonical declaration site per L0 ratification on cycle-2 §13 item 3)
- amendment-propagation §3.5 drift-disposition flow declared per cycle-2 spec §3.6 (5-step flow; closes outer loop on cycle-1 G9 finding; routes patch-cycle ownership to referent owner per L0 ratification on cycle-2 §13 item 1)
- substrate §1.5 cycle-2 locus row added (required by S6 + SG5)
- All 7 canonical files at cycle-2 v3.2.7 versions
- Registry self-amendment closure: §5 entries table at cycle-2 versions; §5.1 v3.2.7 cycle-2 AmendmentLogEntry block (RE2-bound; all 7 targets resolve)

## Counts (cycle-2 cascade)

| Count | Pre-cycle-2 (v3.2.6) | Post-cycle-2 (v3.2.7) | Delta |
|---|---|---|---|
| Substrate atoms | 17 | 20 | +3 |
| Metaframework axioms | 66 | 69 | +3 |
| Framework-tier gates | 82 | 85 | +3 |
| Total all-gates | 87 | 90 | +3 |
| Substrate gates SG1–SG5 | 5 | 5 | 0 (unchanged) |
| AP procedure steps | 8 | 8 | 0 (drift-disposition is a routing rule expressed as procedural prose) |

## First-run validation events scheduled

- G-V10 first-run: Cognitive Standard v1.2.2 (per cycle-2 spec §11.1)
- G-V10 second-run: L0-selected at cycle-2 step 10 (recommended Plan v2.2 per cycle-2 spec §11.2)
- G-S7 (tightened) first-run: substrate v1.5 → v1.6 transition (expected PASS per cycle-2 spec §11.4 re-validation)

## Self-application result

G-V10 result on MFv3 v3.2.7 / substrate v1.6 / framework-audit v1.3.6: applicability='n/a' with basis "MF tier declares zero ReferentCitations — MF cites itself, not code as referent." Per substrate §10.1 S4 + MA-V11 vacuous-pass clause. Expected and correct result per cycle-2 spec §11.5.
