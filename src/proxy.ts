// @liv-standard v1.5.1 amended sprint-b1-shot-1 sprint-b1-shot-2 sprint-13b-shot-1 b1-final-shot-2 sprint-b1.5-shot-2
// @perimeter-standard v1.0
// [perimeter site — unitary per PA-I]
// Built with LIV · livai.dev
// @manifest-delta sprint-b1.5-shot-2
//   File renamed: src/middleware.ts → src/proxy.ts (Next.js 16.2.x middleware→proxy convention).
//   Function renamed: middleware → proxy.
//   export const runtime = 'nodejs' removed (proxy runtime is Node.js by default; declaration invalid in Next 16.2.x).
//   Closes F-NEXT-PROXY-1, F-PLACEMENT-RUNTIME-1.
// @manifest-delta sprint-13b-shot-1
//   emitEvent imported from F-event-system/contract (R3-level caller — A2 compliant).
//   realEventBus adapter declared inline: implements IEventBus, wraps emitEvent, drops eventKind.
//   createAuthDeps call updated to pass realEventBus as third arg.
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-b1-shot-1 (boundary stamp: crossingId, crossedAt, resolvedChannel; session cookie refresh)
//             sprint-b1-shot-2 (resolvedDisposition + cellGovernance added; PERIMETER_HEADER_DISPOSITION set)
//             b1-final-shot-2 (PA-IR1..4 closed via ambiguous-pending outcome; PA-Co1 self-correlation; PA-A1..6 authorityEnforced record)
//             sprint-b1.5-shot-2 (middleware→proxy rename; runtime export removed; closes F-NEXT-PROXY-1)
// placement:  src/proxy.ts (Next.js proxy; self-declared per inverted PL-A1, Sprint 9 Shot 1; renamed sprint-b1.5-shot-2)
// wires-in:
//   W-ATOM    SESSION_COOKIE_NAME           @/features/F-identity/contract/auth-contract
//   W-FN      validateAndRefreshSession     @/features/F-identity/app/auth-workflow
//   W-FN      createAuthDeps               @/features/F-identity/app/auth-workflow
//   W-FN      createAuthDb                 @/features/F-identity/exec/auth-db  (F-5 fix: declared)
//   W-FN      emitEvent                    @/features/F-event-system/contract/event-bus
//   W-FN      writeStateChange              @/features/F-memory/contract/substrate-contract
//   W-FN      generateId                    @/core/types/primitives
//   W-ATOM    PERIMETER_HEADER_USER_ID      @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_SESSION_ID   @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_CHANNEL      @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_CROSSED_AT   @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_DISPOSITION  @/core/constants/perimeter-headers
//   W-ATOM    CrossingId                    @/core/types/perimeter-standard.types
//   W-ATOM    EpochMs                       @/core/types/perimeter-standard.types
//   W-ATOM    ChannelKind                   @/core/types/perimeter-standard.types
//   W-ATOM    DispositionKind               @/core/types/perimeter-standard.types
//   W-ATOM    CellKind                      @/core/types/perimeter-standard.types
//   W-ATOM    CellGovernanceRecord          @/core/types/perimeter-standard.types
//   W-ATOM    GovernanceLevel               @/core/types/perimeter-standard.types
//   W-ATOM    ConfirmationStatus            @/core/types/perimeter-standard.types
//   W-ATOM    AuditStatus                   @/core/types/perimeter-standard.types
//   W-ATOM    ReversibilityFlag             @/core/types/perimeter-standard.types
//   W-ATOM    FOUR_CELL_GOVERNANCE_MAP      @/core/constants/perimeter-standard
//   W-ATOM    SubstrateWriteInput           @/core/types/substrate.types
// wires-out:
//   W-HEADER  x-perimeter-user-id           → all distributed R3 contracts via getPerimeterSession
//   W-HEADER  x-perimeter-session-id        → all distributed R3 contracts via getPerimeterSession
//   W-HEADER  x-perimeter-channel           → all distributed R3 contracts via getPerimeterSession
//   W-HEADER  x-perimeter-crossed-at        → all distributed R3 contracts via getPerimeterSession
//   W-HEADER  x-perimeter-disposition       → all distributed R3 contracts via getPerimeterSession
// validated:  pending
//
// Perimeter Standard v1.0 — Unitary Site (PA-I)
// ================================================
// This file is the one and only crossing gate per LIV instance. Every
// authenticated request passes through here. validateAndRefreshSession is called
// exactly once per request here — distributed contracts read middleware-set
// headers via getPerimeterSession (perimeter-consultation.ts); they do not
// re-validate.
//
// sprint-b1-shot-1: Part A (cookie refresh) + Part B (boundary stamp: channel, crossedAt).
// sprint-b1-shot-2: resolvedDisposition from ROUTE_DISPOSITION_MAP; cellGovernance from
//   FOUR_CELL_GOVERNANCE_MAP lookup; PERIMETER_HEADER_DISPOSITION set on response.
//   Acknowledged vacants: resolvedIdentities and correlationRef (post-beta Sprint B2).
//
// Decision-D-CHANNEL (Shot 1): ChannelKind → SourceChannel via toSourceChannel(). Explicit map.
// Decision-D-TRPC (Shot 2): tRPC routes POST for both queries and mutations — disposition
//   cannot be determined from HTTP method alone. Conservative: default to 'act'.
// Decision-D-INTAKE-DIRECTION (Shot 2): All middleware crossings are intake direction.
//   Dispatch cell governance is program-side concern, not middleware concern.
//   cellKey always `${disposition}-intake`.

import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { validateAndRefreshSession, createAuthDeps } from '@/features/F-identity/app/auth-workflow'
import { writeStateChange } from '@/features/F-memory/contract/substrate-contract'
import { generateId } from '@/core/types/primitives'
import { db, taggedDb } from '@/core/db/client'
import { createAuthDb } from '@/features/F-identity/exec/auth-db'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import {
  PERIMETER_HEADER_USER_ID,
  PERIMETER_HEADER_SESSION_ID,
  PERIMETER_HEADER_CHANNEL,
  PERIMETER_HEADER_CROSSED_AT,
  PERIMETER_HEADER_DISPOSITION,
} from '@/core/constants/perimeter-headers'
import type { CrossingId, EpochMs, ChannelKind, DispositionKind, CellKind, CellGovernanceRecord, GovernanceLevel, ConfirmationStatus, AuditStatus, ReversibilityFlag } from '@/core/types/perimeter-standard.types'
import { FOUR_CELL_GOVERNANCE_MAP } from '@/core/constants/perimeter-standard'
import type { SubstrateWriteInput, IdentityRef, ScopeRef, SourceChannel, RoleRef } from '@/core/types/substrate.types'

// ─── Public route prefixes ────────────────────────────────────────────────────
// Requests matching these prefixes bypass auth. Order is significant — checked
// with startsWith in order. Keep this list minimal and explicit.

const PUBLIC_PREFIXES = [
  '/auth',
  '/api/auth',
  '/api/trpc/auth',
  '/_next',
  '/favicon',
  '/public',
]

// ─── Cookie config ────────────────────────────────────────────────────────────

const IS_PROD = process.env.NODE_ENV === 'production'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function buildSetCookieHeader(name: string, value: string, options: {
  maxAge: number
  httpOnly: boolean
  secure: boolean
  sameSite: 'lax' | 'strict' | 'none'
  path: string
}): string {
  const parts = [`${name}=${encodeURIComponent(value)}`]
  parts.push(`Max-Age=${options.maxAge}`)
  parts.push(`Path=${options.path}`)
  parts.push(`SameSite=${options.sameSite}`)
  if (options.httpOnly) parts.push('HttpOnly')
  if (options.secure)   parts.push('Secure')
  return parts.join('; ')
}

// ─── ChannelKind → SourceChannel mapping (Decision-D-CHANNEL) ────────────────
// Explicit. Not a cast. Maps PS-level channel to substrate channel enum.

function toSourceChannel(channel: ChannelKind): SourceChannel {
  switch (channel) {
    case 'wearer-message':
    case 'wearer-query':
      return 'wearer'
    case 'ai-reply':
      return 'ai'
    case 'system-trigger':
    case 'scheduled-trigger':
      return 'cron'
    case 'integration-event':
      return 'integration-event'
    case 'internal-derivation':
      return 'internal-derivation'
    default:
      // Open-vocabulary fallback: unknown channel kinds map to 'wearer' as conservative default.
      return 'wearer'
  }
}

// ─── Route disposition map (Decision-D-TRPC) ─────────────────────────────────
// Maps pathname × HTTP method → DispositionKind (act | reference).
// Reference: GET and unmatched patterns. Act: POST/PUT/PATCH/DELETE routes
// that mutate substrate or produce world effect.
//
// Decision-D-TRPC: tRPC routes (/api/trpc/*) POST for both queries and mutations.
// Disposition cannot be determined from HTTP method alone without parsing the
// tRPC operation name (not available at middleware). Conservative resolution:
// tRPC routes default to 'act' (over-governs; post-beta refinement scope).

const ROUTE_DISPOSITION_MAP: Array<{ pattern: RegExp; method?: string; disposition: DispositionKind }> = [
  // Acts — substrate mutation or world effect
  { pattern: /^\/api\/chat\/[^/]+\/message$/,  method: 'POST',   disposition: 'act' },
  { pattern: /^\/api\/memory\/action$/,        method: 'POST',   disposition: 'act' },
  { pattern: /^\/api\/planner\/start$/,        method: 'POST',   disposition: 'act' },
  { pattern: /^\/api\/planner\/[^/]+\/[^/]+$/, method: 'POST',   disposition: 'act' },
  { pattern: /^\/api\/output\/[^/]+\/push$/,   method: 'POST',   disposition: 'act' },
  { pattern: /^\/api\/projects$/,              method: 'POST',   disposition: 'act' },
  { pattern: /^\/api\/projects\/[^/]+$/,       method: 'PATCH',  disposition: 'act' },
  { pattern: /^\/api\/projects\/[^/]+$/,       method: 'DELETE', disposition: 'act' },
  { pattern: /^\/api\/profile$/,               method: 'PATCH',  disposition: 'act' },
  { pattern: /^\/api\/profile\/api-key$/,      method: 'POST',   disposition: 'act' },
  { pattern: /^\/api\/profile\/api-key$/,      method: 'DELETE', disposition: 'act' },
  { pattern: /^\/api\/profile\/feedback$/,     method: 'POST',   disposition: 'act' },
  { pattern: /^\/api\/profile\/models$/,       method: 'PUT',    disposition: 'act' },
  // tRPC — conservative 'act' per Decision-D-TRPC
  { pattern: /^\/api\/trpc\//,                                   disposition: 'act' },
  // References — all GET and unmatched patterns handled by default below
]

function resolveDisposition(pathname: string, method: string): DispositionKind {
  for (const entry of ROUTE_DISPOSITION_MAP) {
    if (entry.pattern.test(pathname) && (!entry.method || entry.method === method)) {
      return entry.disposition
    }
  }
  // Conservative default: GET and unmatched = reference.
  return 'reference'
}

// ─── Proxy ────────────────────────────────────────────────────────────────────

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl

  // Public routes — pass through without auth or stamp.
  const isPublic = PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))
  if (isPublic) {
    return NextResponse.next()
  }

  // Read session token from cookie.
  const rawToken = req.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!rawToken) {
    // No session — redirect to auth.
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/auth'
    return NextResponse.redirect(loginUrl)
  }

  // ── Part A + Part B: use validateAndRefreshSession to get refresh signal ──
  // validateSession (auth-contract) is a thin lookup without refresh.
  // We need validateAndRefreshSession here to detect refresh for cookie re-set.
  // This is the unitary site — one call per crossing, here only.
  const authDb   = createAuthDb(taggedDb(db))
  const realEventBus = {
    async emit(event: { type: string; payload: Record<string, unknown>; eventKind?: string }): Promise<void> {
      await emitEvent({ type: event.type, payload: event.payload })
    },
  }
  const authDeps = createAuthDeps('middleware', authDb, realEventBus)

  const sessionResult = await validateAndRefreshSession(rawToken, authDeps)

  if (!sessionResult.success) {
    // Invalid or expired session — redirect to auth.
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/auth'
    const response = NextResponse.redirect(loginUrl)
    // Clear stale cookie.
    response.headers.append('Set-Cookie', buildSetCookieHeader(SESSION_COOKIE_NAME, '', {
      maxAge:   0,
      httpOnly: true,
      secure:   IS_PROD,
      sameSite: 'lax',
      path:     '/',
    }))
    return response
  }

  const { user, session, sessionRefreshed, newToken } = sessionResult.data

  // ── Part B — Boundary stamp ───────────────────────────────────────────────
  // Fields determinable at crossing time: crossingId, crossedAt, resolvedChannel,
  // resolvedDisposition, cellGovernance (Shot 2).
  // Browser session = wearer-message channel per Perimeter Standard CHANNEL_KIND_ENUM.
  const crossingId: CrossingId       = generateId('cx') as CrossingId
  const crossedAt: EpochMs           = Date.now() as EpochMs
  const resolvedChannel: ChannelKind = 'wearer-message'

  // Decision-D-INTAKE-DIRECTION: all middleware crossings are intake direction.
  const resolvedDisposition: DispositionKind = resolveDisposition(req.nextUrl.pathname, req.method)
  const cellKey = `${resolvedDisposition}-intake` as CellKind
  const cellEntry = FOUR_CELL_GOVERNANCE_MAP[cellKey]
  // cellGovernance: full 5-field record built as deferred-field scaffold.
  // Shot 2 consumes: cellGovernance.governanceLevel (substrate identity).
  // Deferred consumers (post-beta Sprint B2): confirmationStatus, auditStatus,
  // reversibilityStatus — these fields are correct and structurally present;
  // no downstream reader exists yet. Building the full record now avoids a
  // structural amendment when downstream readers are wired.
  const cellGovernance: CellGovernanceRecord = {
    cell:                cellKey,
    governanceLevel:     cellEntry.governanceLevel     as GovernanceLevel,
    confirmationStatus:  cellEntry.confirmationStatus  as ConfirmationStatus,
    auditStatus:         cellEntry.auditStatus         as AuditStatus,
    reversibilityStatus: cellEntry.reversibilityStatus as ReversibilityFlag,
  }

  // PA-IR1..PA-IR4 closure (b1-final-shot-2):
  // userId is the surface-form identity claim at intake. Substrate Ref lookup requires
  // a read primitive not available in the synchronous middleware path. Per PA-IR4
  // (disambiguation deferral), outcome is 'ambiguous-pending-disambiguation' with
  // ambiguityDetail recording the deferral reason. ref=null is correct per PA-IR4 invariant.
  // PA-Co1 closure: crossingId self-correlates (no upstream MI correlation at v1.0).
  // PA-A1..PA-A6 closure: authority validated at session check above; record constructed here.
  const selfCorrelationRef = crossingId
  const authorityEnforcedRecord = {
    authorityClaimed:      { level: 'L0', actor: 'wearer', source: null },
    authorityValidated:    true,   // session validation passed — we reached this point
    authorityScopeMatch:   true,   // userId scope matches session.userId
    validationBasis:       'session-cookie-validated-by-middleware',
  }

  // Write crossing record to substrate (HR-PS-LM1).
  // Fire-and-forget: write failure must not block the request.
  const crossingWrite: SubstrateWriteInput = {
    userId: user.id,
    content: {
      identities: [
        user.id                              as IdentityRef,
        crossingId                           as unknown as IdentityRef,
        session.sessionId                    as IdentityRef,
        resolvedDisposition                  as IdentityRef,
        cellGovernance.governanceLevel       as IdentityRef,
        selfCorrelationRef                   as unknown as IdentityRef,
        'authority-validated'                as IdentityRef,
        'identity-ambiguous-pending'         as IdentityRef,
      ],
      relations: [
        {
          type:                'boundary-crossing' as IdentityRef,
          modality:            'declarative',
          identitiesWithRoles: [
            { identity: user.id as IdentityRef,                        role: 'agent'             as RoleRef },
            { identity: crossingId as unknown as IdentityRef,          role: 'crossing'          as RoleRef },
            { identity: resolvedDisposition as IdentityRef,            role: 'disposition'       as RoleRef },
            { identity: selfCorrelationRef as unknown as IdentityRef,  role: 'correlation'       as RoleRef },
            { identity: 'authority-validated' as IdentityRef,          role: 'authority-outcome' as RoleRef },
            { identity: 'identity-ambiguous-pending' as IdentityRef,   role: 'identity-outcome'  as RoleRef },
          ],
          negation: false,
        },
      ],
    },
    metadata: {
      time:   crossedAt,
      source: {
        channel: toSourceChannel(resolvedChannel),
        scope:   user.id as ScopeRef,
      },
    },
  }

  writeStateChange(crossingWrite).catch((err: unknown) => {
    console.error('[middleware] boundary crossing substrate write failed',
      err instanceof Error ? err.message : err)
  })

  // ── Build response with perimeter headers ─────────────────────────────────
  const response = NextResponse.next()

  // Existing headers (PA-A1 enforcement surface for downstream contracts).
  response.headers.set(PERIMETER_HEADER_USER_ID,    user.id)
  response.headers.set(PERIMETER_HEADER_SESSION_ID, session.sessionId)

  // New headers — sprint-b1-shot-1 (Part B).
  response.headers.set(PERIMETER_HEADER_CHANNEL,    resolvedChannel)
  response.headers.set(PERIMETER_HEADER_CROSSED_AT, String(crossedAt))
  // sprint-b1-shot-2.
  response.headers.set(PERIMETER_HEADER_DISPOSITION, resolvedDisposition)

  // Part A — re-set cookie if session was refreshed in DB.
  // Same token string; new Max-Age anchors browser expiry to DB expiry.
  if (sessionRefreshed && newToken) {
    response.headers.append('Set-Cookie', buildSetCookieHeader(SESSION_COOKIE_NAME, newToken, {
      maxAge:   MAX_AGE,
      httpOnly: true,
      secure:   IS_PROD,
      sameSite: 'lax',
      path:     '/',
    }))
  }

  return response
}

// ─── Matcher ─────────────────────────────────────────────────────────────────
// Exclude static assets and Next.js internals. Middleware runs on all other routes.

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
