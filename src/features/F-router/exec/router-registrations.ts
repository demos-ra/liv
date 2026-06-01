// @liv-standard v1.5.2 amended sprint-11-shot-3 sprint-11-shot-5 sprint-11-shot-6 sprint-11-shot-6a
// [F-router/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-11-shot-3 (initial authoring — domain program registrations); sprint-b2-unified-close (category tag set to Tool; "infrastructure" residue swept per Manual v13.3 reclassification); sprint-b2-unified-close-fix-round (LIV-Standard pin sweep v1.5.1 → v1.5.2)
//             sprint-11-shot-5 (F-builder registration added; priority 90 — highest)
//             sprint-11-shot-6a (S11-C3: stale deferred comment updated; all four destinations confirmed active)
//             registration-lifetime-unification (ensureDomainPrograms added — idempotent ensure-on-read guard)
//             registration-guard-ordering (ensureDomainPrograms: _ensureDone set after registerDomainPrograms() — throw must not latch done-and-empty)
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
//   W-FN    ensureDomainPrograms    →  F-router/R2 router-service  (called at head of route())
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

// ─── ensureDomainPrograms() — ensure-on-read, idempotent ─────────────────────
// Registration is boot-call-based (registerDomainPrograms wired into bootstrap()).
// Bootstrap runs in one module instance; request handlers resolve a different
// instance where bootstrap never ran → registry reads empty at request time.
//
// Fix: ensure-on-read. route() calls this at its head; subsequent calls are
// no-ops (guard flag). Guard ordering: _ensureDone is set AFTER
// registerDomainPrograms() returns, not before. A throw inside
// registerDomainPrograms() leaves _ensureDone false so the next call retries —
// a failed registration must not permanently mark the registry as done-and-empty.
// Re-entry is safe: if registerDomainPrograms() throws, the partial state is
// whatever registerDestination managed to apply before the throw; the retry
// on next call re-runs the full REGISTRATIONS loop (non-fatal per-entry logging,
// registry.set is idempotent for the same key only if key is stable — keys
// include generateId('rule') so a retry produces new keys; acceptable: the
// retry path is the throw-recovery path, not the normal path).
// The boolean guard prevents double-registration on the normal (non-throw) path.
//
// Layer note: ensureDomainPrograms is declared in R4 (exec — where the
// REGISTRATIONS table lives) and imported directly by route() in R2 (app).
// R2→R4 same-slice is the mirror of the established R3→R4 same-slice pattern
// (router-contract imports router-registrations). flagged here for apparatus
// record; no cross-slice boundary is crossed.

let _ensureDone = false

export function ensureDomainPrograms(): void {
  if (_ensureDone) return
  registerDomainPrograms()
  _ensureDone = true
}

// ─── End ──────────────────────────────────────────────────────────────────────
