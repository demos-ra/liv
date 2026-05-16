// @liv-standard v1.5.2 amended sprint-11-shot-3 sprint-11-shot-5 sprint-11-shot-6 sprint-11-shot-6a
// [F-router/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-11-shot-3 (initial authoring — domain program registrations); sprint-b2-unified-close (category tag set to Tool; "infrastructure" residue swept per Manual v13.3 reclassification); sprint-b2-unified-close-fix-round (LIV-Standard pin sweep v1.5.1 → v1.5.2)
//             sprint-11-shot-5 (F-builder registration added; priority 90 — highest)
//             sprint-11-shot-6a (S11-C3: stale deferred comment updated; all four destinations confirmed active)
// slice:      F-router
// category:   Tool
// layer:      R4  (I/O at startup; populates in-memory registry)
// wires-in:
//   W-FN    registerDestination      F-router/contract/router-contract  (registry mutation)
//   W-ATOM  DestinationRegistration  F-router/config/router-types
//   W-ATOM  RouterMessage            F-router/config/router-types
//   W-ATOM  RouterSessionContext     F-router/config/router-types
// wires-out:
//   W-FN    registerDomainPrograms  →  F-event-system/R2 startup  (called at boot after onBoot)
// deps:
//   R3  ../contract/router-contract
//   R0  ../config/router-types
// validated:  pending
//
// Decision-D: Routing predicate shape.
//   Shape: keyword-set match on message.text (lowercased).
//   Each destination owns a frozen Set<string> of domain keywords.
//   Predicate: (message) => keywords.some(k => message.text.toLowerCase().includes(k))
//   Rationale: pure function, no I/O, no async — satisfies RouterMatchPredicate contract.
//   Deterministic. Keywords derived from each program's canonical domain vocabulary.
//   Priority ordering: F-verify (80) > F-plan (70) > F-discover (60).
//   F-verify is most specific (verification/audit); F-discover broadest (research/explore).
//   Priority ensures tighter match wins; first-match-wins per router-service evaluateRules.
//
// F-builder registered at Shot 5 — all four destinations active:
// F-builder (90) > F-verify (80) > F-plan (70) > F-discover (60).

import {
  registerDestination,
}                              from '../contract/router-contract'
import type {
  DestinationRegistration,
  RouterMessage,
  RouterSessionContext,
}                              from '../contract/router-contract'

// ─── Keyword sets (frozen — deterministic predicate inputs) ───────────────────

const PLAN_KEYWORDS: ReadonlySet<string> = new Set([
  'plan',
  'planning',
  'draft',
  'design',
  'architect',
  'roadmap',
  'sprint',
  'milestone',
  'backlog',
  'spec',
  'specification',
  'scope',
  'implement',
  'implementation',
  'build plan',
  'execution plan',
])

const DISCOVER_KEYWORDS: ReadonlySet<string> = new Set([
  'research',
  'discover',
  'explore',
  'investigate',
  'find',
  'search',
  'analyze',
  'analyse',
  'study',
  'survey',
  'review',
  'what is',
  'how does',
  'explain',
  'understand',
  'learn',
  'look into',
])

const VERIFY_KEYWORDS: ReadonlySet<string> = new Set([
  'verify',
  'verification',
  'validate',
  'validation',
  'audit',
  'check',
  'confirm',
  'assert',
  'test',
  'lint',
  'review code',
  'is correct',
  'does this pass',
  'compliance',
  'gate',
])


const BUILDER_KEYWORDS: ReadonlySet<string> = new Set([
  'build',
  'run build',
  'start build',
  'deploy',
  'execute',
  'compile',
  'pipeline',
  'ship',
  'release',
  'run pipeline',
  'trigger build',
])
// ─── Predicates ───────────────────────────────────────────────────────────────

function makePredicate(
  keywords: ReadonlySet<string>,
): (message: RouterMessage, _context: RouterSessionContext) => boolean {
  return (message) => {
    const lower = message.text.toLowerCase()
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return true
    }
    return false
  }
}

// ─── Registration table ───────────────────────────────────────────────────────

const REGISTRATIONS: DestinationRegistration[] = [
  {
    destination: { slice: 'F-verify', programId: 'f-verify' },
    priority:    80,
    match:       makePredicate(VERIFY_KEYWORDS),
    label:       'F-verify — verification/audit intent',
  },
  {
    destination: { slice: 'F-plan', programId: 'f-plan' },
    priority:    70,
    match:       makePredicate(PLAN_KEYWORDS),
    label:       'F-plan — planning/design intent',
  },
  {
    destination: { slice: 'F-discover', programId: 'f-discover' },
    priority:    60,
    match:       makePredicate(DISCOVER_KEYWORDS),
    label:       'F-discover — research/exploration intent',
  },
  {
    destination: { slice: 'F-builder', programId: 'f-builder' },
    priority:    90,
    match:       makePredicate(BUILDER_KEYWORDS),
    label:       'F-builder — build/deploy intent',
  },
]

// ─── registerDomainPrograms() — called at boot after F-router/onBoot ─────────
// Registers F-plan, F-discover, F-verify destinations with F-router registry.
// F-builder registered at Shot 5 — four destinations active post-boot.
// Non-fatal on individual registration failure — logs error and continues.

export function registerDomainPrograms(): void {
  for (const reg of REGISTRATIONS) {
    const result = registerDestination(reg)
    if (result.ok) {
      console.log(JSON.stringify({
        level: 'info',
        event: 'router.registration.added',
        slice:     reg.destination.slice,
        programId: reg.destination.programId,
        priority:  reg.priority,
        label:     reg.label,
        timestamp: new Date().toISOString(),
      }))
    } else {
      console.error(JSON.stringify({
        level: 'error',
        event: 'router.registration.failed',
        slice:     reg.destination.slice,
        programId: reg.destination.programId,
        code:      result.error.code,
        message:   result.error.message,
        timestamp: new Date().toISOString(),
      }))
    }
  }
}

// ─── End ──────────────────────────────────────────────────────────────────────
