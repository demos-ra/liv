// @liv-standard v1.5.2
// [F-router/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-8-shot-2 (F-router authoring); sprint-b2-unified-close (category tag set to Tool; "infrastructure" residue swept per Manual v13.3 reclassification); sprint-b2-unified-close-fix-round (LIV-Standard pin sweep v1.5.1 → v1.5.2)
// slice:      F-router
// category:   Tool
// layer:      R1
// wires-in:
//   W-ATOM RouterMessage         F-router/R0 router-types
//   W-ATOM RouterSessionContext  F-router/R0 router-types
//   W-ATOM RouterRule            F-router/R0 router-types
//   W-ATOM Destination           F-router/R0 router-types
// wires-out:
//   W-FN  evaluateRules         →  F-router/R2 (router-service)
//   W-FN  sortRulesByPriority   →  F-router/R2 (router-service)
//   W-FN  matchFirst            →  F-router/R2 (router-service)
// deps:
//   R0  ../config/router-types
// validated:  pending

// F-router R1 — pure rule evaluation domain.
// R1: pure functions, zero I/O, zero state.
// A4: no async; no DB; no network.
//
// Sprint 8 Shot 2: rule engine logic. Registry data lives at R2; rules
// flow through these pure functions for evaluation.
//
// First-match-wins protocol per LM v3.1 Decision-D-S2-1 (registry shape):
//   1. Sort rules by priority (descending; ties broken by registration order).
//   2. Evaluate each rule's match predicate against (message, context).
//   3. Return the first rule whose predicate returns true.

import type {
  RouterMessage,
  RouterSessionContext,
  RouterRule,
  Destination,
} from '../config/router-types'

// ─── Sort by priority (stable; ties preserve registration order) ──────────────
// Higher priority value = evaluated first.
// Stable sort guarantee: V8's Array.prototype.sort is stable since Node 12.
// Registration order is preserved when priorities tie.

export function sortRulesByPriority(rules: readonly RouterRule[]): RouterRule[] {
  return [...rules].sort((a, b) => b.priority - a.priority)
}

// ─── Evaluate a single rule (pure boolean wrapper) ────────────────────────────
// Defensive: catches predicate exceptions and treats them as non-match.
// A rule whose predicate throws should not crash the routing call;
// it should fail to match. Diagnostic surface is the caller's concern.

export function evaluateRule(
  rule: RouterRule,
  message: RouterMessage,
  context: RouterSessionContext,
): boolean {
  try {
    return rule.match(message, context) === true
  } catch {
    return false
  }
}

// ─── First-match selection ────────────────────────────────────────────────────
// Walks rules in priority order, returning the first match.
// Returns null if no rule matches.

export function matchFirst(
  rules: readonly RouterRule[],
  message: RouterMessage,
  context: RouterSessionContext,
): RouterRule | null {
  const ordered = sortRulesByPriority(rules)
  for (const rule of ordered) {
    if (evaluateRule(rule, message, context)) {
      return rule
    }
  }
  return null
}

// ─── Composite evaluation (returns rule + destination) ────────────────────────
// Convenience wrapper: matches and returns the destination.

export function evaluateRules(
  rules: readonly RouterRule[],
  message: RouterMessage,
  context: RouterSessionContext,
): { rule: RouterRule; destination: Destination } | null {
  const matched = matchFirst(rules, message, context)
  if (matched === null) return null
  return { rule: matched, destination: matched.destination }
}

// ─── End ──────────────────────────────────────────────────────────────────────
