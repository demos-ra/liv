// @liv-standard v1.5.1
// [F-plan/R0]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-sprint-a (slice introduction)
// slice:      F-plan
// layer:      R0
// wires-in:   none
// wires-out:  (this file IS the wire contract registry — see @wire blocks below)
// deps:       none
// validated:  pending

// Wire contract registry for F-plan.
// A1: F-plan owns every wire declared here. Plan Standard atoms (PlanArtifactContent,
//     DomainBinding, PlanValidityError, etc.) are NOT redeclared — they belong to
//     core/R5 plan-standard.types and only flow through F-plan as imports.
// A6: all outbound wires declared at R0 of the defining slice.
//
// Sprint A: zero W-EVENT wires. F-plan emits no events to event bus this sprint.
// (Sprint B may add W-EVENT-plan-dispatched at registry-pointer wire-up.)

// ─── F-plan-internal atoms ────────────────────────────────────────────────────

// @wire
// type:    W-ATOM
// id:      W-ATOM-plan-draft-id
// payload: PlanDraftId
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-plan-draft-state
// payload: PlanDraftState
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-plan-composer-input
// payload: PlanComposerInput
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-plan-reject-error
// payload: PlanRejectError
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-plan-execute-result
// payload: PlanExecuteResult
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-plan-draft-summary
// payload: PlanDraftSummary
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-plan-artifact-summary
// payload: PlanArtifactSummary
// version: 1
// status:  active

// ─── F-plan domain binding (instance value, A1-owned by F-plan) ──────────────

// @wire
// type:    W-ATOM
// id:      W-ATOM-plan-domain-binding
// payload: PLAN_DOMAIN_BINDING (instance of DomainBinding)
// version: 1
// status:  active

// ─── AS carrier identity (Plan Standard, A1-owned by F-plan as caller binding) ──

// @wire
// type:    W-ATOM
// id:      W-ATOM-plan-standard-id
// payload: PLAN_STANDARD_ID ('plan')
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-plan-standard-version
// payload: PLAN_STANDARD_VERSION ('2.2')
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-plan-schema-ref
// payload: PLAN_SCHEMA_REF ('PlanArtifactContent')
// version: 1
// status:  active

// ─── R3 surface — Sprint B consumers ─────────────────────────────────────────
// Not yet wired this sprint; declared so Sprint B's registry pointer has a
// known target. dispatch wire-up at codec-orchestrate is Sprint B work.

// @wire
// type:    W-INJECT
// id:      W-INJECT-plan-db
// payload: IPlanDb (see contract/plan-inject.ts)
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-execute-plan
// payload: executePlan(content, userId, projectId, turnId, modelId?) → Result<PlanExecuteResult, PlanRejectError>
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-confirm-plan-draft
// payload: confirmDraft(userId, projectId, turnId, content, modelId?) → Result<{ planAnchorNodeId: NodeId; summary: PlanArtifactSummary }, PlanRejectError>
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-get-open-draft-summary
// payload: getOpenDraftSummary(userId, projectId) → Result<PlanDraftSummary | null, PlanRejectError>
// version: 1
// status:  active

export {}  // module marker — declarations live in @wire blocks above
