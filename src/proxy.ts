// @liv-standard v1.5.1 amended sprint-b1-shot-1 sprint-b1-shot-2 sprint-13b-shot-1 b1-final-shot-2 sprint-b1.5-shot-2 sprint-b2-shot-2 sprint-beta-shot-3
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
// @manifest-delta sprint-beta-shot-3
//   Token-auth branch added (the connector door): no session cookie → check
//   Authorization: Bearer → validate via lookupSession → on success stamp the
//   'external-agent' channel; on failure 401 JSON (not redirect). The existing
//   cookie path is behavior-unchanged. The post-validation stamp block was
//   lifted verbatim into buildStampedResponse(), channel- and validationBasis-
//   parameterized; both credential branches call it (cookie path with
//   'wearer-message', token path with 'external-agent'). Authority stamp added:
//   permittedAuthorityByChannel consulted, the channel's AuthorityAssertion[]
//   stamped as PERIMETER_HEADER_AUTHORITY — the capability mechanism made live.
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-b1-shot-1 (boundary stamp: crossingId, crossedAt, resolvedChannel; session cookie refresh)
//             sprint-b1-shot-2 (resolvedDisposition + cellGovernance added; PERIMETER_HEADER_DISPOSITION set)
//             b1-final-shot-2 (PA-IR1..4 closed via ambiguous-pending outcome; PA-Co1 self-correlation; PA-A1..6 authorityEnforced record)
//             sprint-b1.5-shot-2 (middleware→proxy rename; runtime export removed; closes F-NEXT-PROXY-1)
//             sprint-b2-shot-2 (Part 2a: 10 missing PS v1.2.1 fields landed; Part 2b: resolvedIdentities via threadQuery)
//             sprint-beta-shot-3 (token-auth branch + buildStampedResponse extraction + authority stamp; external-agent channel)
// placement:  src/proxy.ts (Next.js proxy; self-declared per inverted PL-A1, Sprint 9 Shot 1; renamed sprint-b1.5-shot-2)
// wires-in:
//   W-ATOM    SESSION_COOKIE_NAME           @/features/F-identity/contract/auth-contract
//   W-FN      validateAndRefreshSession     @/features/F-identity/app/auth-workflow
//   W-FN      createAuthDeps               @/features/F-identity/app/auth-workflow
//   W-FN      lookupSession                @/features/F-identity/app/auth-workflow  (sprint-beta-shot-3: token-auth validation)
//   W-FN      createAuthDb                 @/features/F-identity/exec/auth-db  (F-5 fix: declared)
//   W-FN      emitEvent                    @/features/F-event-system/contract/event-bus
//   W-FN      writeStateChange              @/features/F-memory/contract/substrate-contract
//   W-FN      threadQuery                   @/features/F-memory/contract/substrate-contract
//   W-FN      generateId                    @/core/types/primitives
//   W-ATOM    PERIMETER_HEADER_USER_ID      @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_SESSION_ID   @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_CHANNEL      @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_CROSSED_AT   @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_DISPOSITION  @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_AUTHORITY    @/core/constants/perimeter-headers  (sprint-beta-shot-3: authority stamp)
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
//   W-ATOM    DEFAULT_PERIMETER_BINDING     @/core/constants/perimeter-standard  (sprint-beta-shot-3: permittedAuthorityByChannel consultation)
//   W-ATOM    SubstrateWriteInput           @/core/types/substrate.types
// wires-out:
//   W-HEADER  x-perimeter-user-id           → all distributed R3 contracts via getPerimeterSession
//   W-HEADER  x-perimeter-session-id        → all distributed R3 contracts via getPerimeterSession
//   W-HEADER  x-perimeter-channel           → all distributed R3 contracts via getPerimeterSession
//   W-HEADER  x-perimeter-crossed-at        → all distributed R3 contracts via getPerimeterSession
//   W-HEADER  x-perimeter-disposition       → all distributed R3 contracts via getPerimeterSession
//   W-HEADER  x-perimeter-authority         → all distributed R3 contracts via getPerimeterSession  (sprint-beta-shot-3)
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
import { validateAndRefreshSession, createAuthDeps, lookupSession } from '@/features/F-identity/app/auth-workflow'
import { writeStateChange, threadQuery } from '@/features/F-memory/contract/substrate-contract'
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
  PERIMETER_HEADER_AUTHORITY,
  PERIMETER_HEADER_ENTITLEMENT,
  stampPerimeterHeaders,
} from '@/core/constants/perimeter-headers'
import { resolveGrantKey, type GrantKey } from '@/features/F-entitlement/contract/entitlement-contract'
import type { CrossingId, EpochMs, ChannelKind, DispositionKind, CellKind, CellGovernanceRecord, GovernanceLevel, ConfirmationStatus, AuditStatus, ReversibilityFlag } from '@/core/types/perimeter-standard.types'
import { FOUR_CELL_GOVERNANCE_MAP, LIV_INSTANCE_PERIMETER_SITE_REF, DEFAULT_PERIMETER_BINDING } from '@/core/constants/perimeter-standard'
import type { SubstrateWriteInput, IdentityRef, ScopeRef, RoleRef } from '@/core/types/substrate.types'
import { toSourceChannel } from '@/features/F-identity/config/channel-register'

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

// ChannelKind → SourceChannel is the channel register (Decision-D-CHANNEL), now ONE declared
// home at F-identity R0 (config/channel-register) — imported above, no local switch. The
// dispatch-direction consumer (perimeter-consultation) derives from the same register.

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
  // (completion-wave1) /api/memory/action removed — F-codec-dissolution 501 stub deleted.
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


// ─── buildStampedResponse — the boundary stamp-and-respond routine ────────────
// sprint-beta-shot-3: extracted verbatim from proxy()'s post-validation block
// (a pure, behavior-preserving lift — inlining this back into the cookie path
// yields the original code instruction-for-instruction). Channel-parameterized
// on `resolvedChannel` and provenance-parameterized on `validationBasis` — the
// two values that genuinely differ between a cookie crossing and a token
// crossing; everything else is identical. Both credential branches in proxy()
// call this: the cookie path with resolvedChannel='wearer-message', the
// token-auth path with resolvedChannel='external-agent'.
//
// Inputs are the minimal surface the block consumes: the wearer's userId and
// the sessionId (the cookie path passes user.id / session.sessionId; the token
// path passes lookupSession's { userId, sessionId }), plus the cookie-refresh
// signals (sessionRefreshed/newToken — only the cookie path sets them; the
// token path passes false/undefined and the cookie re-set is correctly skipped).
async function buildStampedResponse(args: {
  req:              NextRequest
  userId:           string
  sessionId:        string
  resolvedChannel:  ChannelKind
  validationBasis:  string
  sessionRefreshed: boolean
  newToken?:        string
  // build-spec-part5: the trial anchor for the entitlement seam. The cookie path
  // supplies the wearer's account createdAt; the token path has no account record
  // and passes null (the provider decides what a null anchor means).
  accountCreatedAt?: Date | null
}): Promise<NextResponse> {
  // ── Part B — Boundary stamp ───────────────────────────────────────────────
  // Fields determinable at crossing time: crossingId, crossedAt, args.resolvedChannel,
  // resolvedDisposition, cellGovernance (Shot 2).
  // Browser session = wearer-message channel per Perimeter Standard CHANNEL_KIND_ENUM.
  const crossingId: CrossingId       = generateId('cx') as CrossingId
  const crossedAt: EpochMs           = Date.now() as EpochMs

  // Decision-D-INTAKE-DIRECTION: all middleware crossings are intake direction.
  const resolvedDisposition: DispositionKind = resolveDisposition(args.req.nextUrl.pathname, args.req.method)
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

  // PA-IR1..PA-IR4 closure (b1-final-shot-2 → sprint-b2-shot-2 upgrade):
  // Part 2b: threadQuery now available at crossing. resolveIdentity attempts
  // surface-form-to-Ref matching on args.userId via identity-recurrence thread kind.
  // G-PS-IR2 invariant: ambiguous → ref===null + ambiguityDetail non-empty.
  // bound-to-existing-Ref or new-Ref-created → ref!==null.

  type IdentityResolutionOutcome =
    | { outcome: 'bound-to-existing-Ref';          ref: IdentityRef; ambiguityDetail?: never }
    | { outcome: 'new-Ref-created';                ref: IdentityRef; ambiguityDetail?: never }
    | { outcome: 'ambiguous-pending-disambiguation'; ref: null;       ambiguityDetail: Array<{ reason: string }> }

  async function resolveIdentity(surfaceForm: string, scope: ScopeRef): Promise<IdentityResolutionOutcome> {
    let queryResult: Awaited<ReturnType<typeof threadQuery>>
    try {
      queryResult = await threadQuery(
        { threadKind: 'identity-recurrence', anchor: surfaceForm as IdentityRef, scope },
        surfaceForm,
      )
    } catch (err) {
      return {
        outcome:         'ambiguous-pending-disambiguation',
        ref:             null,
        ambiguityDetail: [{ reason: err instanceof Error ? err.message : 'threadQuery threw' }],
      }
    }

    if (!queryResult.ok) {
      return {
        outcome:         'ambiguous-pending-disambiguation',
        ref:             null,
        ambiguityDetail: [{ reason: queryResult.error.message }],
      }
    }

    const records = queryResult.data.records
    if (records.length === 1) {
      // Single match — bound to existing Ref.
      const matchedRef = records[0]!.content.identities[0] ?? surfaceForm as IdentityRef
      return { outcome: 'bound-to-existing-Ref', ref: matchedRef }
    }
    if (records.length === 0) {
      // No match — userId itself becomes the new Ref.
      return { outcome: 'new-Ref-created', ref: surfaceForm as IdentityRef }
    }
    // Multiple matches — ambiguous.
    return {
      outcome:         'ambiguous-pending-disambiguation',
      ref:             null,
      ambiguityDetail: [{ reason: `${records.length} identity-recurrence matches; disambiguation required` }],
    }
  }

  const identityResolution = await resolveIdentity(args.userId, args.userId as ScopeRef)

  // PA-Co1 closure: crossingId self-correlates (no upstream MI correlation at v1.0).
  // PA-A1..PA-A6 closure: authority validated at session check above; record constructed here.
  const selfCorrelationRef = crossingId
  const authorityEnforcedRecord = {
    authorityClaimed:      { level: 'L0', actor: 'wearer', source: null },
    authorityValidated:    true,   // session validation passed — we reached this point
    authorityScopeMatch:   true,   // userId scope matches session.userId
    validationBasis:       args.validationBasis,
  }

  const arrivalRef = generateId('ar') as unknown as IdentityRef
  const authorityAssertion: IdentityRef = JSON.stringify({ level: 'L0', actor: 'wearer', source: null }) as IdentityRef

  // Write crossing record to substrate (HR-PS-LM1).
  // Fire-and-forget: write failure must not block the request.
  const crossingWrite: SubstrateWriteInput = {
    userId: args.userId,
    content: {
      identities: [
        args.userId                              as IdentityRef,
        crossingId                           as unknown as IdentityRef,
        args.sessionId                    as IdentityRef,
        resolvedDisposition                  as IdentityRef,
        cellGovernance.governanceLevel       as IdentityRef,
        selfCorrelationRef                   as unknown as IdentityRef,
        'authority-validated'                as IdentityRef,
        // Part 2b: identity-outcome now reflects actual resolution result
        identityResolution.outcome           as IdentityRef,
        // Part 2a: new identities
        arrivalRef,
        'intake'                             as IdentityRef,
        authorityAssertion,
        'true'                               as IdentityRef,
        args.validationBasis as IdentityRef,
        LIV_INSTANCE_PERIMETER_SITE_REF       as IdentityRef,
        ...(identityResolution.ref !== null ? [identityResolution.ref] : []),
      ],
      relations: [
        {
          type:                'boundary-crossing' as IdentityRef,
          modality:            'declarative',
          identitiesWithRoles: [
            { identity: args.userId as IdentityRef,                        role: 'agent'                    as RoleRef },
            { identity: crossingId as unknown as IdentityRef,          role: 'crossing'                 as RoleRef },
            { identity: resolvedDisposition as IdentityRef,            role: 'disposition'              as RoleRef },
            { identity: selfCorrelationRef as unknown as IdentityRef,  role: 'correlation'              as RoleRef },
            { identity: 'authority-validated' as IdentityRef,          role: 'authority-outcome'        as RoleRef },
            { identity: identityResolution.outcome as IdentityRef,     role: 'identity-outcome'         as RoleRef },
            // Part 2a: 10 missing fields
            { identity: 'intake' as IdentityRef,                       role: 'direction'                as RoleRef },
            { identity: arrivalRef,                                     role: 'arrival'                  as RoleRef },
            { identity: authorityAssertion,                            role: 'resolved-authority'       as RoleRef },
            { identity: authorityAssertion,                            role: 'authority-claimed'        as RoleRef },
            { identity: 'true' as IdentityRef,                         role: 'authority-validated-flag' as RoleRef },
            { identity: 'true' as IdentityRef,                         role: 'authority-scope-match'    as RoleRef },
            { identity: args.validationBasis as IdentityRef,
                                                                        role: 'validation-basis'         as RoleRef },
            { identity: cellGovernance.cell as unknown as IdentityRef, role: 'cell'                     as RoleRef },
            { identity: cellGovernance.confirmationStatus as IdentityRef,
                                                                        role: 'confirmation-status'      as RoleRef },
            { identity: cellGovernance.auditStatus as IdentityRef,     role: 'audit-status'             as RoleRef },
            { identity: cellGovernance.reversibilityStatus as IdentityRef,
                                                                        role: 'reversibility-status'     as RoleRef },
            { identity: LIV_INSTANCE_PERIMETER_SITE_REF as IdentityRef, role: 'unitary-site'             as RoleRef },
            // Part 2b: resolvedIdentities outcome at identity-resolution role
            ...(identityResolution.ref !== null
              ? [{ identity: identityResolution.ref,                   role: 'identity-resolution'      as RoleRef }]
              : [{ identity: identityResolution.outcome as IdentityRef, role: 'identity-resolution'     as RoleRef }]),
          ],
          negation: false,
        },
      ],
    },
    metadata: {
      time:   crossedAt,
      // contentclass-coreloop: the crossing record is an apparatus trace
      // (Manual L139/L145) — its contentClass is declared at the Boundary that
      // owns it ('system-introspection'), not derived from channel. proxy.ts is
      // the canonical Path A Boundary stamping site for intake. (Channel is
      // still resolved via toSourceChannel for the channel field; only the
      // class stamp is no longer channel-derived.)
      source: (() => {
        const ch = toSourceChannel(args.resolvedChannel)
        return {
          channel:      ch,
          contentClass: 'system-introspection',   // crossing record is an apparatus trace (Manual L139/L145); class declared at the Boundary that owns it, not derived from channel
          scope:        args.userId as ScopeRef,
        }
      })(),
    },
  }

  // fixround-substrate-write (F6): inspect-and-log — Boundary crossing write,
  // a side-record. Ruled non-fatal (same basis as the perimeter-consultation
  // crossing write); the failure must be observed, not silent.
  const crossingWriteResult = await writeStateChange(crossingWrite)
  if (!crossingWriteResult.ok) {
    console.error('[middleware] boundary crossing substrate write failed',
      crossingWriteResult.error.message)
  }

  // ── Build response + forward sanitized perimeter headers ──────────────────
  // sprint-beta-shot-3 — authority stamp. Resolve the requesting channel's
  // PermittedAuthoritySet (AuthorityAssertion[]) from the PerimeterBinding once,
  // here, and stamp it (the capability mechanism made live; PA-I unitary discipline —
  // downstream contracts read via getPerimeterSession, never re-resolve). Open-vocabulary
  // channels with no binding entry resolve to [] (no admitted authority) — conservative.
  const permittedAuthority =
    DEFAULT_PERIMETER_BINDING.permittedAuthorityByChannel[
      args.resolvedChannel as keyof typeof DEFAULT_PERIMETER_BINDING.permittedAuthorityByChannel
    ] ?? []

  // gate-wiring-e — the entitlement attribute is now the resolved GRANT KEY ('free'|'paid'),
  // resolved BY PRINCIPAL once, here, at the unitary site (PA-I). Liveness is computed ONCE here;
  // the KEY crosses (no Date through the header), so R2 re-resolves nothing. Site-originated +
  // token-derived like the user-id, so it rides the same hardened strip+stamp path below (a forged
  // x-perimeter-entitlement is stripped, re-set authoritatively). A null anchor → the free floor
  // (the retired null→'trial' permissive is gone — absence resolves to free, no carve-out). A seam
  // failure FAILS CLOSED to free (a fault must not grant paid access).
  let grantKey: GrantKey = 'free'
  try {
    grantKey = resolveGrantKey(args.accountCreatedAt ?? null, new Date())
  } catch (err) {
    console.error('[perimeter] grant resolution failed — fail-closed to free', err instanceof Error ? err.message : 'unknown')
  }

  // PA-I ENFORCEMENT (the write-perimeter's teeth). Forward the request to the route with
  // any INBOUND perimeter headers STRIPPED and the authoritative site values stamped — a
  // stranger cannot forge x-perimeter-user-id (or x-perimeter-entitlement) to cross another
  // wearer's scope or claim paid access. The strip+stamp is one home, beside the reader in
  // F-identity. getPerimeterSession reads these off the forwarded request.
  const stampedRequestHeaders = stampPerimeterHeaders(args.req.headers, {
    [PERIMETER_HEADER_USER_ID]:     args.userId,
    [PERIMETER_HEADER_SESSION_ID]:  args.sessionId,
    [PERIMETER_HEADER_CHANNEL]:     args.resolvedChannel,
    [PERIMETER_HEADER_CROSSED_AT]:  String(crossedAt),
    [PERIMETER_HEADER_DISPOSITION]: resolvedDisposition,
    [PERIMETER_HEADER_AUTHORITY]:   JSON.stringify(permittedAuthority),
    [PERIMETER_HEADER_ENTITLEMENT]: grantKey,
  })
  const response = NextResponse.next({ request: { headers: stampedRequestHeaders } })

  // Also mirror the stamps onto the RESPONSE — the existing PA-A1 surface for downstream
  // contracts (preserved behavior).
  response.headers.set(PERIMETER_HEADER_USER_ID,    args.userId)
  response.headers.set(PERIMETER_HEADER_SESSION_ID, args.sessionId)
  response.headers.set(PERIMETER_HEADER_CHANNEL,    args.resolvedChannel)
  response.headers.set(PERIMETER_HEADER_CROSSED_AT, String(crossedAt))
  response.headers.set(PERIMETER_HEADER_DISPOSITION, resolvedDisposition)
  response.headers.set(PERIMETER_HEADER_AUTHORITY, JSON.stringify(permittedAuthority))
  response.headers.set(PERIMETER_HEADER_ENTITLEMENT, grantKey)

  // Part A — re-set cookie if session was refreshed in DB.
  // Same token string; new Max-Age anchors browser expiry to DB expiry.
  if (args.sessionRefreshed && args.newToken) {
    response.headers.append('Set-Cookie', buildSetCookieHeader(SESSION_COOKIE_NAME, args.newToken, {
      maxAge:   MAX_AGE,
      httpOnly: true,
      secure:   IS_PROD,
      sameSite: 'lax',
      path:     '/',
    }))
  }

  return response
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
    // ── sprint-beta-shot-3 — token-auth branch (the connector door) ─────────
    // No session cookie. Before redirecting (browser-no-cookie behavior), check
    // for a wearer-delegated bearer token — an external agent cannot present a
    // cookie. This branch is additive: a request with neither cookie nor bearer
    // token redirects exactly as before; only a bearer-bearing request takes
    // the new path. Token validation reuses lookupSession (auth-workflow) — the
    // delegated agent token is a session row issued under the wearer's userId,
    // so the existing session machinery validates it; findSession filters
    // expired rows at the SQL layer, so an expired token yields null here.
    const authHeader  = req.headers.get('authorization')
    const bearerToken =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length).trim()
        : null

    if (!bearerToken) {
      // No cookie and no bearer token — redirect to auth (unchanged behavior).
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/auth/login'
      return NextResponse.redirect(loginUrl)
    }

    // Validate the delegated token via lookupSession (reuses session machinery).
    const tokenAuthDb = createAuthDb(taggedDb(db))
    const validated   = await lookupSession(bearerToken, tokenAuthDb)

    if (!validated) {
      // Token-path failure returns 401 JSON, not a redirect — an external agent
      // cannot follow a browser redirect (sprint-beta-shot-3 compliance item 3).
      return new NextResponse(
        JSON.stringify({ error: { code: 'UNAUTHENTICATED', message: 'invalid or expired agent token' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Valid delegated token. Stamp the crossing on the external-agent channel.
    // The agent crosses as the wearer by delegation — userId is the wearer's,
    // sourced from the token's session row. No cookie refresh on the token path.
    // gate-wiring-e: resolve the WEARER's account anchor by userId — the agent IS the wearer
    // (standards: agent=wearer, entitlement per principal, no exempt door). The retired null anchor
    // is gone; the connector path resolves the wearer's grant like any principal. A miss fails
    // closed to null → free floor (never a permissive trial).
    const wearerRec = await tokenAuthDb.findUserById(validated.userId)
    return buildStampedResponse({
      req,
      userId:           validated.userId,
      sessionId:        validated.sessionId,
      resolvedChannel:  'external-agent',
      validationBasis:  'session-token-validated-by-middleware',
      sessionRefreshed: false,
      newToken:         undefined,
      accountCreatedAt: wearerRec.success ? wearerRec.data.createdAt : null,
    })
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
    loginUrl.pathname = '/auth/login'
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

  // ── Boundary stamp + response — sprint-beta-shot-3 ────────────────────────
  // The cookie path delegates to buildStampedResponse, the routine extracted
  // verbatim from the former inline block. resolvedChannel='wearer-message',
  // validationBasis the cookie-validation string — the wearer crossing behaves
  // identically to before the extraction (pure, behavior-preserving lift).
  return buildStampedResponse({
    req,
    userId:           user.id,
    sessionId:        session.sessionId,
    resolvedChannel:  'wearer-message',
    validationBasis:  'session-cookie-validated-by-middleware',
    sessionRefreshed,
    newToken,
    // The wearer's account anchor for the entitlement seam (build-spec-part5).
    accountCreatedAt: user.createdAt,
  })
}

// ─── Matcher ─────────────────────────────────────────────────────────────────
// Exclude static assets and Next.js internals. Middleware runs on all other routes.

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
