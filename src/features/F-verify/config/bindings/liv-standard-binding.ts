// @liv-standard v1.5.1
// [F-verify/R0]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-4-vs (slice introduction)
// slice:      F-verify
// layer:      R0
// wires-in:
//   W-ATOM  VerificationBinding, VerificationPredicate,
//          PredicateGroundClass, PredicateId, Semver  ←  F-verify/R0 f-verify-types
// wires-out:
//   W-ATOM  LIV_STANDARD_SMOKE_BINDING  →  F-verify/R4 verify-binding-loader
// deps:
//   R0 ../f-verify-types
// validated:  pending
//
// F-verify R0 — LIV-Standard smoke binding (Sprint 4 v1.0).
//
// Sprint 4 D3 cycle decision (γ, Demos confirmed):
//
//   "smoke binding, 3–5 groundClass: 'structural-property' predicates against
//    a known target shape. Exercises VA5 all-must-pass branch + vacuous-pass
//    branch covered separately. Real LIV-Standard 153-predicate binding
//    deferred to its own cycle once the pre-pass classification work runs as
//    discrete L0 task."
//
// Spec amendment (Demos confirmed) — VS v1.0 §1 framing softens to:
//   "F-verify slice supplies smoke binding at Sprint 4 close; full
//    LIV-Standard 153-predicate binding lands in subsequent cycle (Sprint
//    4.x) post pre-pass."
//
// ─── Binding target shape ────────────────────────────────────────────────────
//
// Smoke evidence shape (v1.0, Sprint 4):
//
//   type LivFrameworkDeclarationProbe = {
//     kind:    'Framework'              // exact literal
//     mode:    'verificative'           // exact literal — pinned to VS itself
//                                       // for the first emission's
//                                       // self-application probe
//     level:   'L3'                     // exact literal
//   }
//
// Why this shape: it is the minimum shape any L3 framework-declaration carries
// in its identity row (substrate §4 A-10 Kind, §2 Mode, §5 AuthorityLevel).
// A predicate evaluating these three fields exercises the structural-property
// ground class against literal expectedValues — fully mechanical, fully
// reducible to substrate §6.3.
//
// First-run emission target (Sprint 4 close criterion):
//   - target.artifactKind = 'plan' | 'verification' | <other> — caller threads
//   - evidence: a LivFrameworkDeclarationProbe matching VS's own identity
//   - All 3 predicates → passed → verdict='verified' → exercises VA5
//     all-must-pass branch on a non-empty predicateSet (γ requirement).
//
// VA5 vacuous-pass branch is covered structurally by the binding shape allowing
// predicateSet = [] in future bindings; v1.0 binding does NOT exercise the
// vacuous branch — that path is already verified by the gate logic in R1
// (deriveVerdict returns 'verified' on empty predicateResults).

import type {
  VerificationBinding,
  VerificationPredicate,
  PredicateId,
} from '../f-verify-types'
import type { Semver } from '@/core/types/primitives'

// ─── Predicate declarations ──────────────────────────────────────────────────

/**
 * P-LS-1 — kind == 'Framework'
 *
 * Substrate §6.3 ground class: structural-property.
 * Evidence path: 'kind'
 * Expected value: 'Framework'
 *
 * Failure surface: declared with explicit narrative pointing at LIV-Standard
 * A-10 Kind enum + Sprint 4 smoke binding scope.
 */
const P_LS_1_KIND: VerificationPredicate = {
  predicateId:    'p-ls-smoke-1-kind' as PredicateId,
  groundClass:    'structural-property',
  evidencePath:   'kind',
  expectedValue:  'Framework',
  failureSurface: "evidence.kind !== 'Framework' (substrate §4 A-10 Kind enum violation; LIV-Standard smoke binding p-ls-smoke-1-kind)",
}

/**
 * P-LS-2 — mode == 'verificative'
 *
 * Substrate §6.3 ground class: structural-property.
 * Evidence path: 'mode'
 * Expected value: 'verificative'
 *
 * Note: this predicate is shape-pinned to VS's own identity for the first-run
 * self-probe (Sprint 4 close criterion). Future bindings parameterize Mode per
 * target framework; the smoke binding uses the literal 'verificative' so the
 * first emission's evidence-against-VS-identity exercises VA5 all-must-pass.
 */
const P_LS_2_MODE: VerificationPredicate = {
  predicateId:    'p-ls-smoke-2-mode' as PredicateId,
  groundClass:    'structural-property',
  evidencePath:   'mode',
  expectedValue:  'verificative',
  failureSurface: "evidence.mode !== 'verificative' (substrate §2 Mode enum violation against pinned smoke target; LIV-Standard smoke binding p-ls-smoke-2-mode)",
}

/**
 * P-LS-3 — level == 'L3'
 *
 * Substrate §6.3 ground class: structural-property.
 * Evidence path: 'level'
 * Expected value: 'L3'
 */
const P_LS_3_LEVEL: VerificationPredicate = {
  predicateId:    'p-ls-smoke-3-level' as PredicateId,
  groundClass:    'structural-property',
  evidencePath:   'level',
  expectedValue:  'L3',
  failureSurface: "evidence.level !== 'L3' (substrate §5 AuthorityLevel violation against pinned smoke target; LIV-Standard smoke binding p-ls-smoke-3-level)",
}

// ─── Binding instance ────────────────────────────────────────────────────────

/**
 * LIV-Standard smoke binding.
 *
 * domainId = 'liv-standard'
 * domainVersion = '1.5.1' (current LIV-Standard ratified version per
 *                          src/core/constants/liv-standard.ts LIV_STANDARD.version)
 *
 * predicateSet: 3 entries (P-LS-1, P-LS-2, P-LS-3) — all structural-property
 *               class. Each evidencePath resolves into a flat object with
 *               { kind, mode, level } string fields.
 *
 * evidenceSchema: shapeRef pointer at the canonical probe shape. Schema
 *                 itself is opaque to VS (per AS v2.2 ArA7 verbatim-carry
 *                 + spec §3.6 VA3); shapeRef serves as identifier for
 *                 framework-audit X3 traceability.
 *
 * failsafes: empty at v1.0 — smoke binding has no domain-declared failsafe
 *            policies. VA6 multi-source closure is satisfied vacuously over
 *            an empty failsafe set.
 */
export const LIV_STANDARD_SMOKE_BINDING: VerificationBinding = {
  domainId:      'liv-standard',
  domainVersion: '1.5.1' as Semver,
  predicateSet: [
    P_LS_1_KIND,
    P_LS_2_MODE,
    P_LS_3_LEVEL,
  ],
  evidenceSchema: {
    shapeRef: 'LivFrameworkDeclarationProbe',
  },
  failsafes: {
    // Empty at v1.0. Future binding upgrades may declare failsafe rules per
    // domain policy; VA6 closure scope expands accordingly.
  },
}

// ─── End of liv-standard-binding.ts ─────────────────────────────────────────
