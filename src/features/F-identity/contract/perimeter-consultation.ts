// @liv-standard v1.5.1 amended sprint-13-shot-2 sprint-b1-shot-1 sprint-b1-shot-2 sprint-13c-shot-1 boundary-symmetry-shot sprint-beta-shot-3
// @perimeter-standard v1.3
// [F-identity/R3]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-b1-shot-1 (PerimeterSession extended: resolvedChannel + crossedAt; new header reads)
//             sprint-b1-shot-2 (PerimeterSession extended: resolvedDisposition; PERIMETER_HEADER_DISPOSITION read)
//             sprint-13c-shot-1 (dispatchCrossing added: dispatch-direction BoundaryCrossingRecord → substrate)
//             b1-final-shot-2 (PA-A1..6 authorityEnforced identity added to dispatch write; PA-Co1 correlationRef already present)
//             boundary-symmetry-shot (dispatchCrossing extended to full 17-field landing parallel to proxy.ts intake; closes Manual v13.4 §IV.4 directional symmetry; LIV_INSTANCE_PERIMETER_SITE_REF imported from canonical constant — local shadow dissolved per S1)
//             sprint-beta-shot-3 (PerimeterSession extended: resolvedAuthority; PERIMETER_HEADER_AUTHORITY read via toPermittedAuthority parse helper)
// slice:      F-identity
// layer:      R3
// wires-in:
//   W-ATOM    NextRequest                     next/server
//   W-ATOM    ValidatedSession                ../app/auth-workflow
//   W-ATOM    PERIMETER_HEADER_USER_ID        @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_SESSION_ID     @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_CHANNEL        @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_CROSSED_AT     @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_DISPOSITION    @/core/constants/perimeter-headers
//   W-ATOM    CHANNEL_KIND_ENUM               @/core/constants/perimeter-standard  (F-1 fix: guarded narrowing)
//   W-ATOM    DISPOSITION_KIND_ENUM           @/core/constants/perimeter-standard  (F-1 fix: guarded narrowing)
//   W-ATOM    ChannelKind                     @/core/types/perimeter-standard.types
//   W-ATOM    DispositionKind                 @/core/types/perimeter-standard.types
//   W-FN      writeStateChange                @/features/F-memory/contract/substrate-contract  (sprint-13c-shot-1)
//   W-FN      generateId                      @/core/types/primitives                          (sprint-13c-shot-1)
//   W-ATOM    SubstrateWriteInput             @/core/types/substrate.types                     (sprint-13c-shot-1)
//   W-ATOM    IdentityRef                     @/core/types/substrate.types                     (sprint-13c-shot-1)
//   W-ATOM    ScopeRef                        @/core/types/substrate.types                     (sprint-13c-shot-1)
//   W-ATOM    SourceChannel                   @/core/types/substrate.types                     (sprint-13c-shot-1)
//   W-ATOM    RoleRef                         @/core/types/substrate.types                     (sprint-13c-shot-1)
//   W-ATOM    BoundaryDispatchRequest         @/core/types/perimeter-standard.types            (sprint-13c-shot-1)
//   W-ATOM    CrossingId                      @/core/types/perimeter-standard.types            (sprint-13c-shot-1)
//   W-ATOM    EpochMs                         @/core/types/perimeter-standard.types            (sprint-13c-shot-1)
//   W-ATOM    CorrelationRefBrand             @/core/types/perimeter-standard.types            (sprint-13c-shot-1)
//   W-ATOM    LIV_INSTANCE_PERIMETER_SITE_REF @/core/constants/perimeter-standard              (boundary-symmetry-shot; replaces local shadow — S1 closure)
//   W-ATOM    FOUR_CELL_GOVERNANCE_MAP        @/core/constants/perimeter-standard              (boundary-symmetry-shot; cellGovernance decomposition at dispatch direction)
//   W-ATOM    PERIMETER_HEADER_ENTITLEMENT    @/core/constants/perimeter-headers               (build-spec-part5; entitlement stamp reader)
//   W-ATOM    EntitlementStatus               @/features/F-entitlement/types/entitlement-types  (build-spec-part5; the stamped field type)
// wires-out:
//   W-FN      getPerimeterSession             → all distributed R3 contracts (F-chat, F-verify, F-output, F-permissions, F-plan, F-project, F-user-profile)
//   W-ATOM    PerimeterSession                → all distributed R3 contracts
//   W-FN      dispatchCrossing                → F-chat/contract/chat-contract (sprint-13c-shot-1)
// validated:  pending
//
// Perimeter consultation surface — Sprint 6 Shot 3 wire-in.
// =========================================================
// Per Perimeter Standard v1.0 §6.9 (Audit query pattern): distributed contracts
// consult the perimeter for already-validated session state via this thin
// header-reader. The header names are owned by src/proxy.ts (the unitary
// perimeter site per Manual §I.4 + PS PA-I; renamed from middleware.ts sprint-b1.5-shot-2).
//
// This file replaces the pre-Shot-3 distributed pattern in which each contract
// imported `validateSession` from F-identity/contract/auth-contract and re-ran
// session validation per route handler. F-005 audit finding closure: distributed
// validation is removed; contracts now read middleware-set headers only.
//
// Discipline:
// - This function MUST NOT call validateSession itself. It is a pure header
//   reader. validateSession is called exactly once per crossing — at the
//   unitary perimeter site (src/proxy.ts).
// - If a request has not passed through middleware (e.g., an internal call
//   bypassing HTTP routing), the headers will be absent and this returns null.
//   That is the correct state — non-routed crossings are not covered by the
//   perimeter at this v1.0 delivery (out-of-scope per Perimeter Standard §1
//   scopeOut: "runtime execution of boundary typing — owned by L4 program;
//   F-identity slice middleware").
// - Contracts that need ValidatedSession-shaped data should consume this
//   function's return value directly. Re-validating is a structural defect
//   (PA-I unitary-site violation).

import type { NextRequest } from 'next/server'
import type { ValidatedSession } from '../app/auth-workflow'
import {
  PERIMETER_HEADER_USER_ID,
  PERIMETER_HEADER_SESSION_ID,
  PERIMETER_HEADER_CHANNEL,
  PERIMETER_HEADER_CROSSED_AT,
  PERIMETER_HEADER_DISPOSITION,
  PERIMETER_HEADER_AUTHORITY,
  PERIMETER_HEADER_ENTITLEMENT,
} from '@/core/constants/perimeter-headers'
import type { EntitlementStatus } from '@/features/F-entitlement/types/entitlement-types'
import { CHANNEL_KIND_ENUM, DISPOSITION_KIND_ENUM, LIV_INSTANCE_PERIMETER_SITE_REF, FOUR_CELL_GOVERNANCE_MAP } from '@/core/constants/perimeter-standard'
import type { ChannelKind, DispositionKind } from '@/core/types/perimeter-standard.types'
import type { Who } from '@/core/types/substrate-raw.types'
import type {
  BoundaryDispatchRequest,
  CrossingId,
  EpochMs,
  CorrelationRefBrand,
} from '@/core/types/perimeter-standard.types'
import { writeStateChange } from '@/features/F-memory/contract/substrate-contract'
import type { SubstrateWriteInput, IdentityRef, ScopeRef, SourceChannel, RoleRef } from '@/core/types/substrate.types'
import { generateId } from '@/core/types/primitives'

// ─── ChannelKind → SourceChannel mapping (dispatch direction) ─────────────────
// Mirrors toSourceChannel() in src/proxy.ts (intake direction).
// Declared locally — perimeter-consultation is R3; importing from middleware
// would be a module boundary violation (middleware is not a slice).

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
      return 'wearer'
  }
}

// ─── Guarded narrowing helpers (F-1 fix) ─────────────────────────────────────
// Header values arrive as string | null. Casting directly to ChannelKind /
// DispositionKind is structurally impure — an unknown string bypasses the enum.
// These helpers validate against the declared enum sets before narrowing.
// Unknown values fall through to the caller-supplied default.

function toChannelKind(raw: string | null, fallback: ChannelKind): ChannelKind {
  if (raw && (CHANNEL_KIND_ENUM as readonly string[]).includes(raw)) {
    return raw as ChannelKind
  }
  return fallback
}

function toDispositionKind(raw: string | null, fallback: DispositionKind): DispositionKind {
  if (raw && (DISPOSITION_KIND_ENUM as readonly string[]).includes(raw)) {
    return raw as DispositionKind
  }
  return fallback
}

// sprint-beta-shot-3: parse the authority stamp. proxy.ts JSON-serializes the
// channel's PermittedAuthoritySet (AuthorityAssertion[]) into PERIMETER_HEADER_
// AUTHORITY. The reader parses it back; an absent header, malformed JSON, or a
// non-array payload all yield [] — conservative (no admitted authority rather
// than a false grant). Entries are shape-checked: each must have string-valued
// level and actor; entries failing the shape are dropped.
function toPermittedAuthority(
  raw: string | null,
): ReadonlyArray<{ level: string; actor: string; source?: string | null }> {
  if (!raw) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  const out: Array<{ level: string; actor: string; source?: string | null }> = []
  for (const entry of parsed) {
    if (
      entry && typeof entry === 'object' &&
      typeof (entry as Record<string, unknown>).level === 'string' &&
      typeof (entry as Record<string, unknown>).actor === 'string'
    ) {
      const e = entry as Record<string, unknown>
      out.push({
        level:  e.level as string,
        actor:  e.actor as string,
        source: typeof e.source === 'string' ? e.source : null,
      })
    }
  }
  return out
}

// build-spec-part5: narrow the entitlement stamp. The header is one of the three
// statuses; an absent or unknown value falls back to 'trial' — permissive, since
// the attribute gates nothing yet and a missing stamp must not lock a wearer out.
const ENTITLEMENT_STATUS_ENUM: readonly EntitlementStatus[] = ['paid', 'trial', 'lapsed']

function toEntitlementStatus(raw: string | null): EntitlementStatus {
  if (raw && (ENTITLEMENT_STATUS_ENUM as readonly string[]).includes(raw)) {
    return raw as EntitlementStatus
  }
  return 'trial'
}

/**
 * PerimeterSession — extended session surface carrying boundary-stamped fields.
 *
 * sprint-b1-shot-1: resolvedChannel and crossedAt added.
 * sprint-b1-shot-2: resolvedDisposition added. Derived from route classification
 * at the unitary perimeter site; carried downstream so programs know the
 * governance level of their crossing without re-classifying.
 */
export interface PerimeterSession {
  userId:              string
  sessionId:           string
  resolvedChannel:     ChannelKind
  // COIN authorship axis (`who`), resolved ONCE here from resolvedChannel — the
  // single site, co-located with the channel, mirroring resolvedAuthority/
  // resolvedDisposition. Cognition writes inherit session.who rather than hardcode
  // it. (The LLM-response write stamps 'llm' directly — the one response-authorship
  // site, not a session channel.)
  who:                 Who
  crossedAt:           number
  resolvedDisposition: DispositionKind
  // sprint-beta-shot-3: the channel's resolved PermittedAuthoritySet, stamped
  // at proxy.ts from PerimeterBinding.permittedAuthorityByChannel. Each entry
  // is an AuthorityAssertion ({ level, actor, source? }). Empty array when the
  // channel has no binding entry or the stamp is absent/malformed —
  // conservative (no admitted authority rather than a false grant).
  resolvedAuthority:   ReadonlyArray<{ level: string; actor: string; source?: string | null }>
  // build-spec-part5: the entitlement attribute resolved at proxy.ts from the
  // swappable seam (F-entitlement) and stamped. Carried downstream so a crossing
  // decision can read it without re-resolving (PA-I); the deny decision itself is
  // not made here. 'trial' on an absent/unknown stamp (permissive).
  resolvedEntitlement: EntitlementStatus
}

/**
 * Reads the perimeter-validated session from middleware-set request headers.
 *
 * Returns PerimeterSession if all required perimeter headers are present; null otherwise.
 *
 * Per Perimeter Standard v1.0:
 * - PA-A1 (authority validation) was performed at src/proxy.ts before
 *   this header set was applied — null return means perimeter rejected the
 *   crossing or the route is in PUBLIC_PREFIXES.
 * - PA-I (unitary site) preserved: this function does not re-validate; the
 *   perimeter is the sole validation site.
 *
 * sprint-b1-shot-1:
 *   resolvedChannel: read from PERIMETER_HEADER_CHANNEL; defaults to 'wearer-message' if absent.
 *   crossedAt: read from PERIMETER_HEADER_CROSSED_AT; defaults to 0 if absent.
 * sprint-b1-shot-2:
 *   resolvedDisposition: read from PERIMETER_HEADER_DISPOSITION; defaults to 'act' if absent
 *   (conservative — over-governs rather than under-governs on missing stamp).
 */
// Authorship (`who`) as a pure function of the channel — the single resolution,
// mirroring the old ChannelKind→SourceChannel mapping but onto the COIN authorship
// axis. RESTORES the external-agent cognition-turn case: a connector-door turn
// authors as 'program', not 'wearer'. Defaults to 'wearer' only for the
// wearer-message family; every automated/external channel authors as 'program'.
function resolveWhoFromChannel(channel: ChannelKind): Who {
  switch (channel) {
    case 'wearer-message':
    case 'wearer-query':
      return 'wearer'
    case 'ai-reply':
      return 'llm'
    default:
      // external-agent, system-trigger, scheduled-trigger, integration-event,
      // internal-derivation → automated / external authorship.
      return 'program'
  }
}

export function getPerimeterSession(req: NextRequest): PerimeterSession | null {
  const userId    = req.headers.get(PERIMETER_HEADER_USER_ID)
  const sessionId = req.headers.get(PERIMETER_HEADER_SESSION_ID)

  if (!userId || !sessionId) {
    return null
  }

  const channelRaw     = req.headers.get(PERIMETER_HEADER_CHANNEL)
  const crossedAtRaw   = req.headers.get(PERIMETER_HEADER_CROSSED_AT)
  const dispositionRaw = req.headers.get(PERIMETER_HEADER_DISPOSITION)
  const authorityRaw   = req.headers.get(PERIMETER_HEADER_AUTHORITY)
  const entitlementRaw = req.headers.get(PERIMETER_HEADER_ENTITLEMENT)

  const resolvedChannel: ChannelKind         = toChannelKind(channelRaw, 'wearer-message')
  // Authorship resolved here, once, from the channel (the single site).
  const who: Who                             = resolveWhoFromChannel(resolvedChannel)
  const crossedAt: number                    = crossedAtRaw ? Number(crossedAtRaw) : 0
  // Default 'act': conservative — over-governs (triggers confirmation/audit) rather than
  // under-governs (skips governance) when stamp is absent.
  const resolvedDisposition: DispositionKind = toDispositionKind(dispositionRaw, 'act')
  // sprint-beta-shot-3: the channel's permitted-authority set, parsed from the
  // stamp. Absent/malformed → [] (no admitted authority — conservative).
  const resolvedAuthority                    = toPermittedAuthority(authorityRaw)
  // build-spec-part5: the entitlement attribute, narrowed from its stamp.
  const resolvedEntitlement: EntitlementStatus = toEntitlementStatus(entitlementRaw)

  return {
    userId,
    sessionId,
    resolvedChannel,
    who,
    crossedAt,
    resolvedDisposition,
    resolvedAuthority,
    resolvedEntitlement,
  }
}

// ─── Dispatch crossing (sprint-13c-shot-1) ────────────────────────────────────
// dispatchCrossing: produces a BoundaryCrossingRecord (direction='dispatch') and
// writes it to substrate via HR-PS-LM1. Called fire-and-forget by F-chat at every
// outbound emission site. Returns void — callers do not await.
//
// Layer discipline: R3→R3 for writeStateChange (F-memory/contract). R3→R5 for
// generateId (core/types/primitives). Types from R5 — all A2 compliant.
//
// scopeContext from request: used as substrate write scope. The LIV_INSTANCE_PERIMETER_SITE_REF
// constant ('src/proxy.ts') is the unitary site identity per PA-I — shared across
// intake and dispatch directions for audit-trail coherence.

const PERIMETER_FRAMEWORK_VERSION = '1.0.0'

export async function dispatchCrossing(request: BoundaryDispatchRequest): Promise<void> {
  const crossingId: CrossingId = generateId('cx') as CrossingId
  const crossedAt: EpochMs     = Date.now() as EpochMs

  // correlationRef: self-correlated if null (Sprint B2 will wire MI correlation).
  // Cast matches intake pattern: crossingId as unknown as CorrelationRefBrand.
  const correlationRef: CorrelationRefBrand =
    request.correlationRef ?? (crossingId as unknown as CorrelationRefBrand)

  // resolvedChannel: promote to top scope for reuse in metadata + identity landing.
  const resolvedChannel = toSourceChannel(request.channelTarget)

  // dispatchRef: parallel to intake arrivalRef (proxy.ts L336). generateId('dr').
  const dispatchRef = generateId('dr') as unknown as IdentityRef

  // cellGovernance: full 5-field decomposition from FOUR_CELL_GOVERNANCE_MAP.
  // Key: (direction='dispatch', request.dispositionClaim) → 'reference-dispatch' | 'act-dispatch'.
  const cellKey: string = `${request.dispositionClaim}-dispatch`
  const cellEntry = FOUR_CELL_GOVERNANCE_MAP[cellKey as keyof typeof FOUR_CELL_GOVERNANCE_MAP]
    ?? FOUR_CELL_GOVERNANCE_MAP['act-dispatch']  // conservative fallback per PS §IV.2
  const cellGovernance = {
    cell:                cellKey,
    governanceLevel:     cellEntry.governanceLevel,
    confirmationStatus:  cellEntry.confirmationStatus,
    auditStatus:         cellEntry.auditStatus,
    reversibilityStatus: request.reversibility,  // PA-T4: runtime override per emitting program
  }

  // authorityEnforced: dispatch-direction record parallel to proxy.ts L329–334.
  // Caller scope-validated upstream by F-permissions before reaching dispatchCrossing.
  const authorityAssertion: IdentityRef = JSON.stringify(request.authorityContext) as IdentityRef

  // SubstrateWriteInput — 17-field parallel to proxy.ts intake structure L341–399.
  // Identities: 17 entries. identitiesWithRoles relation: 17 entries.
  // Relation type: 'boundary-crossing-dispatch' — distinct from intake 'boundary-crossing'
  // for audit-trail separation per direction. Preserved from prior delivery.
  const crossingWrite: SubstrateWriteInput = {
    userId: request.source.programId,
    content: {
      identities: [
        crossingId                                     as unknown as IdentityRef,
        request.dispatchId                             as unknown as IdentityRef,
        request.dispositionClaim                       as IdentityRef,
        request.channelTarget                          as IdentityRef,
        request.source.programId                       as IdentityRef,
        correlationRef                                 as unknown as IdentityRef,
        'authority-validated'                          as IdentityRef,
        'pre-resolved'                                 as IdentityRef,  // PA-IR1 scopeOut: dispatch carries pre-resolved refs
        dispatchRef,
        'dispatch'                                     as IdentityRef,
        authorityAssertion,
        'true'                                         as IdentityRef,
        'caller-authority-validated-at-source-program' as IdentityRef,
        LIV_INSTANCE_PERIMETER_SITE_REF               as IdentityRef,
        cellGovernance.cell                            as IdentityRef,
        cellGovernance.confirmationStatus              as IdentityRef,
        cellGovernance.auditStatus                     as IdentityRef,
      ],
      relations: [
        {
          type:                'boundary-crossing-dispatch' as IdentityRef,
          modality:            'declarative',
          identitiesWithRoles: [
            { identity: request.source.programId          as IdentityRef,      role: 'agent'                    as RoleRef },
            { identity: crossingId                        as unknown as IdentityRef, role: 'crossing'           as RoleRef },
            { identity: request.dispositionClaim          as IdentityRef,      role: 'disposition'              as RoleRef },
            { identity: correlationRef                    as unknown as IdentityRef, role: 'correlation'        as RoleRef },
            { identity: 'authority-validated'             as IdentityRef,      role: 'authority-outcome'        as RoleRef },
            { identity: 'pre-resolved'                    as IdentityRef,      role: 'identity-outcome'         as RoleRef },
            { identity: 'dispatch'                        as IdentityRef,      role: 'direction'                as RoleRef },
            { identity: dispatchRef,                                            role: 'dispatch'                 as RoleRef },
            { identity: authorityAssertion,                                    role: 'resolved-authority'       as RoleRef },
            { identity: authorityAssertion,                                    role: 'authority-claimed'        as RoleRef },
            { identity: 'true'                            as IdentityRef,      role: 'authority-validated-flag' as RoleRef },
            { identity: 'true'                            as IdentityRef,      role: 'authority-scope-match'    as RoleRef },
            { identity: 'caller-authority-validated-at-source-program' as IdentityRef,
                                                                                role: 'validation-basis'         as RoleRef },
            { identity: cellGovernance.cell               as IdentityRef,      role: 'cell'                     as RoleRef },
            { identity: cellGovernance.confirmationStatus as IdentityRef,      role: 'confirmation-status'      as RoleRef },
            { identity: cellGovernance.auditStatus        as IdentityRef,      role: 'audit-status'             as RoleRef },
            { identity: cellGovernance.reversibilityStatus as IdentityRef,     role: 'reversibility-status'     as RoleRef },
            { identity: LIV_INSTANCE_PERIMETER_SITE_REF  as IdentityRef,      role: 'unitary-site'             as RoleRef },
            // PA-IR1 scopeOut: dispatch direction carries pre-resolved Refs (no surface-form-to-Ref work needed)
            { identity: 'pre-resolved'                    as IdentityRef,      role: 'identity-resolution'      as RoleRef },
          ],
          negation: false,
        },
      ],
    },
    metadata: {
      time:   crossedAt,
      // Boundary stamping site — dispatch direction (B-direction crossing of the Boundary).
      // contentclass-coreloop: ContentClass declared at the Boundary that owns it
      // ('system-introspection' — apparatus trace), not derived from channel.
      source: (() => {
        return {
          channel:      resolvedChannel,
          contentClass: 'system-introspection',   // crossing record is an apparatus trace (Manual L139/L145); class declared at the Boundary that owns it, not derived from channel
          scope:        request.scopeContext as ScopeRef,
        }
      })(),
    },
  }

  // fixround-substrate-write (F6): inspect-and-log — the Boundary crossing
  // write is a side-record. Ruled non-fatal: making a perimeter crossing fail
  // on a substrate-write error is a heavier security-boundary change, out of
  // this round's scope (flagged for L0 as a possible separate round). For F6
  // the failure must be observed, not silent.
  const r = await writeStateChange(crossingWrite)
  if (!r.ok) {
    console.error('[perimeter] dispatch crossing substrate write failed', r.error.message)
  }
}
