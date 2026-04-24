// @liv-standard v1.5.1
// [core/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    w2-item-12, phase-5-audit, 4b-stamp-fix
// slice:      core
// layer:      R1
// wires-in:   none
// wires-out:
//   W-ATOM  RateLimitConfig   →  F-chat/R3, F-planner/R3
//   W-ATOM  RateLimitResult   →  F-chat/R3, F-planner/R3
//   W-ATOM  createRateLimiter →  F-chat/R3, F-planner/R3
// deps:       none
// validated:  pending
//
// phase-5-audit (ROOT-2):
//   Promoted from F-chat/domain/rate-limiter to core/domain/.
//   Two slices (F-chat, F-planner) import identical pure function — T6.5-R1
//   threshold met. No slice owns this; it's shared infrastructure.
//   Original: w2-item-12.
//
// w2-item-12 (A4, A6):
//   Sliding window rate limiter. Pure logic — no I/O (A4).
//   Types declared at R1 alongside the logic that owns them (A6).
//   Factory pattern: each consumer creates its own limiter instance
//   with an isolated Map. No shared mutable state between consumers.
//   `now` parameter injectable for deterministic testing.
//   Lazy per-user cleanup on every check call (filter expired timestamps).
//   Axiom cite: A4 — no I/O. A6 — types declared at origin.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RateLimitConfig {
  windowMs: number      // sliding window duration
  maxRequests: number   // max requests per window
}

export interface RateLimitResult {
  allowed: boolean
  retryAfterMs: number  // 0 if allowed, ms until next window if blocked
}

// ── Factory ───────────────────────────────────────────────────────────────────
// Each call returns a limiter with its own isolated store.
// Chat and planner each call createRateLimiter() once — independent limits.

export function createRateLimiter(): {
  check: (userId: string, config: RateLimitConfig, now?: number) => RateLimitResult
} {
  const store = new Map<string, number[]>()

  function check(
    userId: string,
    config: RateLimitConfig,
    now: number = Date.now()
  ): RateLimitResult {
    const cutoff = now - config.windowMs
    const timestamps = store.get(userId) ?? []

    // Lazy cleanup: filter expired timestamps for this user
    const active = timestamps.filter(t => t > cutoff)

    if (active.length >= config.maxRequests) {
      // Blocked — retryAfterMs = time until oldest active timestamp expires
      const retryAfterMs = active[0] + config.windowMs - now
      store.set(userId, active)
      return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) }
    }

    // Allowed — record this request
    active.push(now)
    store.set(userId, active)
    return { allowed: true, retryAfterMs: 0 }
  }

  return { check }
}
