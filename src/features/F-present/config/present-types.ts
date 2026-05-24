// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/present-types.ts]
// Sprint 2 — Shot 1; present-rederive — Shot 2; sprint-b3-present-build (v3.0);
//   sprint-b3-present-v4 (v4.0); sprint-b3-present-v5 (v5.0);
//   sprint-b3-present-v6 (v5.0 → v6.0: the tree-of-stacks re-derivation)
//
// All atom types from Present Standard v6.0 §2.1 + §2.4.
// Governed by: Present Standard v6.0
//
// v6.0 (sprint-b3-present-v6, the tree-of-stacks re-derivation — §16 + §16-REF):
//   The present's INTERNAL model is re-derived. The present is ONE connected
//   tree of stacks: every node (identity) and every edge (relation) is a STACK
//   — an append-only sequence of state-changes, latest = surface, the rest =
//   depth ([R3]/[R4]). Identity and relation are symmetric carriers ([R5]).
//
//   Shot 1 — tree of stacks (M1+M7, [R4]/[R5]):
//     StackEntry (NEW) — one state-change in a carrier's stack.
//     FrameNode / FrameEdge — re-shaped: each carries `stack: StackEntry[]`.
//     The v5.0 flat `dominantSurfaceForm` value and flat `{parent,child,
//     thickness}` edge are re-derived; the surface is stack[last].
//
//   Shot 3 — three controls (M3, [R9]/[R10]/[R11]):
//     CameraSetting / TemporalSetting (NEW) — the camera and temporal-dial
//     control values. GranularityDial (the lens) carried.
//     `recency` DELETED ([R11] — a frozen pre-computed motion substitute).
//     `resolvedAt` DELETED ([R11] — redundant: standpoint + frameId position
//     a present).
//
//   Shot 4 — windows (M4, [R12]/[R13]):
//     Window (NEW) — the one tree at one camera/lens/temporal/standpoint
//     setting; the unit every control-action yields. Windows accumulate.
//
//   Shot 5 — authorship (M5, [R14]):
//     StackEntry.authorship — 'user' (Path A external arrival) or 'llm'
//     (Path B internal-derivation), read from substrate SourceRef.channel.
//
//   Shot 6 — structure-carrying projection (M6, [R19]/[R20]):
//     PresentView re-shaped — composition carries stack-carrying nodes/edges,
//     `extent: 'granularity-cutoff'`, `camera`. ViewNode/ViewEdge carry stacks.
//
//   Shot 7 — intent + control surface (M3/§2):
//     PresentIntent re-stated against the three-control model — camera /
//     temporal / standpoint. zoomAnchor superseded by CameraSetting.
//
//   F-present remains a NON-EMITTER ([R1]): it writes nothing to the substrate.
//   It holds the live present and archives every present to its OWN per-user
//   store in the LIV database — never the substrate.
//
// Type-import provenance:
//   IdentityRef, RoleRef, ScopeRef, PositionRef, StateChangeId, ContentClass,
//   Relation, RelationModality, IdentityWithRole, SubstrateSourceRef
//     <- F-memory/contract/substrate-contract (cross-slice R3 per A5)
//   UserId <- core/types/primitives
//   FrameworkRef declared locally; Timestamp = number (ms epoch).

import type {
  IdentityRef,
  RoleRef,
  ScopeRef,
  PositionRef,
  StateChangeId,
  ContentClass,
  Relation,
  RelationModality,
  IdentityWithRole,
  SubstrateSourceRef,
} from '@/core/types/substrate.types'

import type { UserId } from '@/core/types/primitives'

// -- Local aliases for substrate atoms not yet exported as named types ---------

/** Substrate A-12: framework identifier (slice name string). Local alias. */
export type FrameworkRef = string & { readonly _brand: 'FrameworkRef' }

/** Substrate A-09: ms-epoch timestamp. Local alias matching codebase pattern. */
export type Timestamp = number

// -- Standard-local vocabulary (per §2.4) — tagged-string-id types -------------

export type IntentIdRef = string & { readonly _brand: 'IntentIdRef' }
export type FrameIdRef  = string & { readonly _brand: 'FrameIdRef'  }   // ref to a resolved present
export type ViewIdRef   = string & { readonly _brand: 'ViewIdRef'   }
export type ViewNodeRef = string & { readonly _brand: 'ViewNodeRef' }
export type ViewEdgeRef = string & { readonly _brand: 'ViewEdgeRef' }
export type WindowRef   = string & { readonly _brand: 'WindowRef'   }   // v6.0 NEW ([R12])

export type OriginProvenance = {
  consumerSlice: FrameworkRef
  stampedAt:     Timestamp
}

// -- ViewBound — resource ceiling, NOT a control -------------------------------
// Caps a large resolved region ([R20]); not a neighbourhood rule and not a control.

export type ViewBound = {
  maxNodes:   number
  maxEdges:   number      // v6.0: renamed from v5.0 maxThreads (ViewThread → ViewEdge lineage)
  walkBudget: number
}

// -- The three controls — §2.1 — camera, lens, temporal dial (v6.0, [R9]) ------

// The CAMERA — where the tree is centred. DERIVED on the user-driven path
// (F-present points it at the user's latest state-change); SET on an LLM look
// (a real identity the LLM located in a present it was given).
export type CameraSetting =
  | { mode: 'derived' }
  | { mode: 'set'; anchor: IdentityRef }

// The TEMPORAL DIAL — how much of each stack is in view. surface = a still
// (the latest state-change); span = motion (history across a range). [R10]/[R11]
export type TemporalSetting =
  | { depth: 'surface' }
  | { depth: 'span'; from?: PositionRef; to?: PositionRef }

// The LENS (granularity dial) is GranularityDial below — stored dial state,
// NOT carried on PresentIntent ([R2]/[R10]).

// -- PresentIntent — §2.1 — re-stated against the three controls (v6.0) --------
// camera: the camera control. temporal: the temporal dial (per-look on this
//   envelope; standing-vs-per-look is L0-parked, §16.10). standpoint: which
//   position — null = the live present, non-null = a past position resolved by
//   archive lookup ([R16]). The lens is NOT here — stored dial state.

export type PresentIntent = {
  intentId:    IntentIdRef
  consumerRef: FrameworkRef
  userId:      UserId
  scopeRef:    ScopeRef
  camera:      CameraSetting       // v6.0 ([R9]) — supersedes v5.0 zoomAnchor
  temporal:    TemporalSetting     // v6.0 ([R10]/[R11])
  standpoint:  PositionRef | null  // WHICH POSITION — live, or a scrub-back ([R16])
  bound:       ViewBound
  provenance:  OriginProvenance
}

// -- StackEntry — §2.1 — one state-change in a carrier's stack (v6.0, NEW) -----
// [R4]: a carrier (node or edge) is an append-only stack of state-changes
// ordered by the substrate append index. [R14]: each entry carries authorship.

export type StackEntry = {
  stateChangeId: StateChangeId
  position:      PositionRef        // the substrate append index — orders the stack
  surfaceForm:   string             // the value/condition this state-change asserts
  authorship:    'user' | 'llm'     // v6.0 ([R14]) — Path A external arrival (user)
                                    //   or Path B internal-derivation (llm); read
                                    //   from substrate SourceRef.channel
}

// -- PresentFrame — the present: F-present's own held-and-archived tree --------
// (§16.2, [R3]/[R4]) — one connected tree of stacks, rooted on the user.
// NOT a substrate leaf, NOT a substrate state-change. F-present holds it as its
// own live state and archives it to its own per-user LIV-database store.

export type FrameNode = {
  identity:         IdentityRef
  stack:            StackEntry[]    // v6.0 ([R4]) — the identity's append-only stack;
                                    //   stack[last] is the surface (WHAT STATE),
                                    //   the whole sequence is the history (WHEN)
  substituteValues: string[]        // folded within-node value collapse
  weight:           number          // ∈ [0, 1] — chain-ping summed mass (HOW MUCH)
  sourceCount:      number
  // v6.0: dominantSurfaceForm DELETED — it is stack[last].surfaceForm.
  // v6.0: recency DELETED ([R11]) — a frozen pre-computed motion substitute.
}

export type FrameEdge = {
  parent:       IdentityRef         // the more-rootward (denser) identity
  child:        IdentityRef         // the identity reached through the parent
  relationType: IdentityRef         // the relation's type identity
  stack:        StackEntry[]        // v6.0 ([R4]/[R5]) — the relation's append-only
                                    //   stack; SAME shape as FrameNode.stack —
                                    //   symmetric carriers ([R5])
  thickness:    number              // ∈ [0, 1] — chain-ping summed mass (HOW MUCH)
  // direction parent → child computed from weight; NO containment ([R3]).
  // v6.0: the v5.0 flat {parent,child,thickness} triple is re-derived to carry
  //   the relation's stack — M7.
}

export type CameraTrace = {         // v6.0 — replaces v5.0 AnchorTrace
  mode:        'derived' | 'set'
  anchor:      IdentityRef          // the identity the camera points at
  derivedFrom?: StateChangeId       // populated iff mode = 'derived'
}

export type ReadPrimitiveTrace = {
  primitive:           'identity-recurrence' | 'role-pattern' | 'adjacency' | 'iterate-axis'
  parameters:          Record<string, unknown>
  recordCount:         number
  contentClassFilter?: ContentClass   // read-side filter on emitter-declared class (LMA13)
}

export type WeightingTrace = {
  weightMap:      Record<string, number>
  weightingBasis: 'chain-ping-summation-v1.0'
  thresholdApplied: {
    loadBearingTheta: number
  }
}

export type FrameProvenance = {
  sourceStateChangeIds: StateChangeId[]
  readPrimitivesUsed:   ReadPrimitiveTrace[]
  cameraDerived:        CameraTrace   // v6.0 — replaces v5.0 anchorDerived
}

export type PresentFrame = {
  frameId:    FrameIdRef
  userId:     UserId                // the present's owner — the root identity (LMA12)
  scopeRef:   ScopeRef              // the scope the present was resolved within (LMA6)
  standpoint: PositionRef | null    // the append-index position resolved at; null = live edge
                                    // v6.0: NO resolvedAt — standpoint + frameId position it ([R11])
  root:       ViewNodeRef           // the user identity, the convergence point ([R3])
  nodes:      FrameNode[]           // the tree's nodes — each carrying its stack
  edges:      FrameEdge[]           // the tree's edges — each carrying its stack
  weighting:  WeightingTrace
  provenance: FrameProvenance
}

// -- Window — §2.1 — the unit every control-action yields (v6.0, NEW) ----------
// [R12]/[R13]: every present() call opens a Window — the one tree at one
// camera/lens/temporal/standpoint setting. Windows ACCUMULATE; they do not
// replace. The accumulating window-set is the session, the look-trail, and the
// authorship seam (openedBy — user windows vs llm windows).

export type Window = {
  windowId:   WindowRef
  openedBy:   'user' | 'llm'        // whose action opened it — the authorship seam ([R14])
  camera:     CameraSetting
  lensCutoff: number                // the lens (granularity cutoff) this window was opened at
  temporal:   TemporalSetting
  standpoint: PositionRef | null
  openedAt:   Timestamp
}

// -- GranularityDial — the lens — §2.1 ([R10]) ---------------------------------
// The lens dials the STRUCTURE axis. A mass-fraction cutoff over normalized node
// weight. PERSISTENT stored position, one per (userId, scopeRef), read at
// resolve time — NOT a PresentIntent field ([R2]). Turning the lens does NOT
// recompute — it reads the held present at a different cutoff.

export type GranularityDial = {
  cutoff:    number                 // ∈ [0, 1] — mass-fraction cutoff over normalized weight
  setBy:     'user' | 'llm'
  updatedAt: Timestamp
}

// -- SnapshotArchiveEntry / SnapshotArchiveKey — the per-user archive ([R15]) --
// The archived shape IS PresentFrame whole — a scrub-back returns the present as
// actually resolved ([R16]). F-present's own store, NOT the substrate.

export type SnapshotArchiveKey = {
  userId:   UserId
  scopeRef: ScopeRef
  position: PositionRef             // the append-index position resolved at — scrub-back key ([R16])
}

export type SnapshotArchiveEntry = {
  archiveKey: SnapshotArchiveKey
  present:    PresentFrame          // v6.0: renamed from v5.0 `snapshot` — the present, archived whole
  archivedAt: Timestamp             // when this present was written to the archive (the archival act)
}

// -- ViewNode, ViewEdge — PresentView projection shapes — v6.0 stack-carrying --
// ([R19]) The projection carries STRUCTURE: nodes with their stacks, edges with
// their stacks, the connectivity.

export type ViewNode = {
  identity:         IdentityRef
  stack:            StackEntry[]            // v6.0 ([R4]) — the identity's stack
  substituteValues: string[]
  weight:           number                  // ∈ [0, 1]
  parent:           ViewNodeRef | null      // the more-rootward identity (null at root)
  children:         ViewNodeRef[]           // the identities reached through this node
  sourceCount:      number
  // v6.0: the v5.0 flat dominantSurfaceForm + status fields are subsumed by
  //   `stack` — the surface (stack[last]) IS the dominant value and the
  //   current status; one mechanism ([R7]).
}

export type ViewEdge = {
  parent:       IdentityRef
  child:        IdentityRef
  relationType: IdentityRef
  stack:        StackEntry[]                // v6.0 ([R4]/[R5]) — symmetric with ViewNode.stack
  thickness:    number                      // ∈ [0, 1]
}

// -- PresentView — the consumer-renderable atom PROJECTED FROM PresentFrame ----
// v6.0 ([R19]/[R20]): carries the tree's structure at the granularity-cutoff
// extent; every PR8 projection opens a Window.

export type PresentView = {
  viewId:             ViewIdRef
  projectedFromFrame: FrameIdRef            // the held PresentFrame this view projects
  derivedFromIntent:  PresentIntent
  window:             WindowRef             // v6.0 ([R12]) — the window this projection is
  emittedAt:          Timestamp
  composition: {
    nodes:   ViewNode[]
    edges:   ViewEdge[]                     // directed parent→child, each carrying its stack
    root:    ViewNodeRef                    // the user identity, the convergence point
    camera:  ViewNodeRef                    // the centred identity — what the camera points at
    extent:  'granularity-cutoff'           // v6.0 ([R20]) — what the lens resolved
  }
  provenance: {
    sourceStateChangeIds: StateChangeId[]
    readPrimitivesUsed:   ReadPrimitiveTrace[]
    cameraDerived:        CameraTrace
    weightingApplied:     WeightingTrace
  }
  reversibility: {
    appealCourtIs:    'substrate-state-change-table'
    replayDiscipline: 'invoke F-present with same PresentIntent -> equivalent PresentFrame and PresentView per PrA8'
  }
}

// -- Re-export cross-slice types consumed by this slice ------------------------

export type {
  IdentityRef,
  RoleRef,
  ScopeRef,
  PositionRef,
  StateChangeId,
  ContentClass,
  Relation,
  RelationModality,
  IdentityWithRole,
  SubstrateSourceRef,
}

export type { UserId }
