// @liv-standard v1.5.2
// [F-router/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-8-shot-2 (F-router authoring); sprint-b2-unified-close (category tag set to Tool; "infrastructure" residue swept per Manual v13.3 reclassification); sprint-b2-unified-close-fix-round (LIV-Standard pin sweep v1.5.1 → v1.5.2)
// slice:      F-router
// category:   Tool
// layer:      R2
// wires-in:
//   W-ATOM   RouterMessage             F-router/R0 router-types
//   W-ATOM   RouterSessionContext      F-router/R0 router-types
//   W-ATOM   Destination               F-router/R0 router-types
//   W-ATOM   DestinationRegistration   F-router/R0 router-types
//   W-ATOM   RouterRule                F-router/R0 router-types
//   W-ATOM   RouterRegistrationKey     F-router/R0 router-types
//   W-ATOM   RouteResult               F-router/R0 router-types
//   W-CONST  ROUTER_ERROR_CODES        F-router/R0 router-types
//   W-CONST  ROUTER_EVENTS             F-router/R0 router-events
//   W-FN     evaluateRules             F-router/R1 router-rules
// wires-out:
//   W-FN  route                  →  F-router/R3 (router-contract)
//   W-FN  registerDestination    →  F-router/R3 (router-contract)
//   W-FN  unregisterDestination  →  F-router/R3 (router-contract)
//   W-FN  listDestinations       →  F-router/R3 (router-contract)
//   W-FN  resetRegistry          →  F-router/R3 (router-contract; test/boot only)
//   W-FN  onBoot                 →  F-event-system/R2 (Sprint 9 wiring)
// deps:
//   R0  ../config/router-types
//   R0  ../config/router-events
//   R1  ../domain/router-rules
//   R5  @/core/types/primitives
// validated:  pending

// F-router R2 — service tier.
// R2: orchestrates registration + routing. Holds in-memory registry state.
// A4: no I/O; registry is process-local module state per Decision-D-S2-4
// (in-memory, no DB persistence at Shot 2).
//
// Decision-D-S2-6: registry is module-singleton state. Reset path
// (resetRegistry) is provided for testing and boot. Concurrent access
// safety: Node.js is single-threaded for module state; no locking needed.
// If a future deployment introduces worker-thread concurrency for routing
// calls, registry must move to a thread-safe structure or shared store.

import { generateId } from '@/core/types/primitives'
import type { Result } from '@/core/types/primitives'
import type {
  RouterMessage,
  RouterSessionContext,
  Destination,
  DestinationRegistration,
  RouterRule,
  RouterRegistrationKey,
  RouteResult,
} from '../config/router-types'
import { ROUTER_ERROR_CODES } from '../config/router-types'
import { ROUTER_EVENTS } from '../config/router-events'
import { evaluateRules } from '../domain/router-rules'

// ─── Registry state ───────────────────────────────────────────────────────────
// Module-singleton. Initialized empty at module load; populated by
// registerDestination calls (Sprint 9 wiring registers domain destinations).

const registry = new Map<RouterRegistrationKey, RouterRule>()
let registrationOrderCounter = 0  // tiebreaker for sortRulesByPriority stability

// ─── route() — primary R3 surface ─────────────────────────────────────────────
// Sprint 8 Shot 2: registry empty at boot; every route() call returns
// REGISTRY_EMPTY until Sprint 9 wires domain registrations. NO_MATCH is
// returned only if registry is non-empty and no rule matches.
//
// Input validation per Decision-D-S2-7:
//   - message.text must be a string (may be empty)
//   - message.kind must be one of the four declared RouterMessageKind values
//   - context.userId and context.scope must be non-empty strings
// Validation failures return ROUTER_INVALID_INPUT.

const VALID_MESSAGE_KINDS = new Set([
  'user-turn',
  'scheduled-trigger',
  'integration-event',
  'internal-derivation',
])

function validateInput(
  message: RouterMessage,
  context: RouterSessionContext,
): { ok: true } | { ok: false; reason: string } {
  if (!message || typeof message !== 'object') {
    return { ok: false, reason: 'message is not an object' }
  }
  if (typeof message.text !== 'string') {
    return { ok: false, reason: 'message.text must be a string' }
  }
  if (!VALID_MESSAGE_KINDS.has(message.kind)) {
    return { ok: false, reason: `message.kind invalid: ${String(message.kind)}` }
  }
  if (!context || typeof context !== 'object') {
    return { ok: false, reason: 'context is not an object' }
  }
  if (typeof context.userId !== 'string' || context.userId.length === 0) {
    return { ok: false, reason: 'context.userId must be a non-empty string' }
  }
  if (typeof context.scope !== 'string' || context.scope.length === 0) {
    return { ok: false, reason: 'context.scope must be a non-empty string' }
  }
  return { ok: true }
}

export function route(
  message: RouterMessage,
  context: RouterSessionContext,
): RouteResult {
  const validation = validateInput(message, context)
  if (!validation.ok) {
    return {
      ok: false,
      error: {
        code:    ROUTER_ERROR_CODES.INVALID_INPUT,
        message: validation.reason,
      },
    }
  }

  if (registry.size === 0) {
    void emitRouteUnmatched(message.kind, 0)
    return {
      ok: false,
      error: {
        code:    ROUTER_ERROR_CODES.REGISTRY_EMPTY,
        message: 'router registry is empty (no destinations registered)',
      },
    }
  }

  const rules = Array.from(registry.values())
  const matched = evaluateRules(rules, message, context)

  if (matched === null) {
    void emitRouteUnmatched(message.kind, rules.length)
    return {
      ok: false,
      error: {
        code:    ROUTER_ERROR_CODES.NO_MATCH,
        message: `no rule matched ${message.kind} message`,
      },
    }
  }

  void emitRouteMatched(matched.rule.ruleId, matched.destination, message.kind)
  return { ok: true, data: matched.destination }
}

// ─── Registry mutation ────────────────────────────────────────────────────────

function buildRegistrationKey(
  destination: Destination,
  ruleId: string,
): RouterRegistrationKey {
  // Composite: slice|programId|ruleId. Allows multiple rules per slice.
  const programPart = destination.programId ?? '_'
  return `${destination.slice}|${programPart}|${ruleId}` as RouterRegistrationKey
}

export function registerDestination(
  reg: DestinationRegistration,
): Result<RouterRegistrationKey> {
  if (!reg || typeof reg !== 'object') {
    return {
      ok: false,
      error: {
        code:    ROUTER_ERROR_CODES.INVALID_INPUT,
        message: 'registration is not an object',
      },
    }
  }
  if (!reg.destination || typeof reg.destination.slice !== 'string') {
    return {
      ok: false,
      error: {
        code:    ROUTER_ERROR_CODES.INVALID_INPUT,
        message: 'registration.destination.slice missing',
      },
    }
  }
  if (typeof reg.match !== 'function') {
    return {
      ok: false,
      error: {
        code:    ROUTER_ERROR_CODES.INVALID_INPUT,
        message: 'registration.match must be a function',
      },
    }
  }
  if (typeof reg.priority !== 'number' || !Number.isFinite(reg.priority)) {
    return {
      ok: false,
      error: {
        code:    ROUTER_ERROR_CODES.INVALID_INPUT,
        message: 'registration.priority must be a finite number',
      },
    }
  }

  const ruleId = generateId('rule')
  const key    = buildRegistrationKey(reg.destination, ruleId)
  registrationOrderCounter += 1

  const rule: RouterRule = {
    ...reg,
    ruleId,
  }

  registry.set(key, rule)
  void emitRegistrationAdded(rule)
  return { ok: true, data: key }
}

export function unregisterDestination(
  key: RouterRegistrationKey,
): Result<void> {
  const existing = registry.get(key)
  if (!existing) {
    return {
      ok: false,
      error: {
        code:    ROUTER_ERROR_CODES.INVALID_INPUT,
        message: `no registration with key: ${key}`,
      },
    }
  }
  registry.delete(key)
  void emitRegistrationRemoved(existing.ruleId)
  return { ok: true, data: undefined }
}

// ─── Registry inspection ──────────────────────────────────────────────────────

export function listDestinations(): Result<RouterRule[]> {
  return { ok: true, data: Array.from(registry.values()) }
}

// ─── Registry reset (boot/test path) ──────────────────────────────────────────
// Provided for boot reinitialization and test isolation. Not part of the
// general R3 surface; the contract re-exports this for boot wiring.

export function resetRegistry(): void {
  registry.clear()
  registrationOrderCounter = 0
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

export function onBoot(): Promise<Result<{ ruleCount: number }>> {
  // Sprint 8 Shot 2: registry is empty at boot; Sprint 9 wires
  // domain registrations into this hook from F-event-system startup.
  void emitBootComplete(registry.size)
  return Promise.resolve({ ok: true, data: { ruleCount: registry.size } })
}

// ─── Event emission (stub per Sprint 8 pattern) ───────────────────────────────
// Decision-D-S2-8: console.log JSON-line emission at Shot 2; replaced by
// F-event-system wiring at Sprint 9 (one-line port swap per §1.9 stub-deferral).

function emitRegistrationAdded(rule: RouterRule): void {
  console.log(JSON.stringify({
    level: 'info',
    event: ROUTER_EVENTS.REGISTRATION_ADDED,
    ruleId:    rule.ruleId,
    slice:     rule.destination.slice,
    programId: rule.destination.programId,
    priority:  rule.priority,
    timestamp: new Date().toISOString(),
  }))
}

function emitRegistrationRemoved(ruleId: string): void {
  console.log(JSON.stringify({
    level: 'info',
    event: ROUTER_EVENTS.REGISTRATION_REMOVED,
    ruleId,
    timestamp: new Date().toISOString(),
  }))
}

function emitRouteMatched(
  ruleId: string,
  destination: Destination,
  messageKind: string,
): void {
  console.log(JSON.stringify({
    level: 'info',
    event: ROUTER_EVENTS.ROUTE_MATCHED,
    ruleId,
    slice:       destination.slice,
    programId:   destination.programId,
    messageKind,
    timestamp: new Date().toISOString(),
  }))
}

function emitRouteUnmatched(messageKind: string, ruleCount: number): void {
  console.log(JSON.stringify({
    level: 'warn',
    event: ROUTER_EVENTS.ROUTE_UNMATCHED,
    messageKind,
    ruleCount,
    timestamp: new Date().toISOString(),
  }))
}

function emitBootComplete(ruleCount: number): void {
  console.log(JSON.stringify({
    level: 'info',
    event: ROUTER_EVENTS.BOOT_COMPLETE,
    ruleCount,
    timestamp: new Date().toISOString(),
  }))
}

// ─── End ──────────────────────────────────────────────────────────────────────
