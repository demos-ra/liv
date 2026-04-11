// @liv-standard v1.4
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.4
// amended: v1.4
// slice: core
// layer: R5
// wires-in: none
// wires-out:
//   W-ATOM INSTANCE_PROFILES → core/R5 liv-api
//   W-ATOM HANDOFFS → core/R5 liv-api
//   W-ATOM FLOW_TEMPLATE_MAP → core/R5 liv-api
//   W-ATOM PACKET_SLICING_RULES → core/R5 liv-api
// deps:
//   R5 ./liv-standard.types
// validated: 2026-04-11

import type {
  InstanceId,
  InstanceProfile,
  SectionId,
  HandoffSpec,
  FlowTemplateEntry,
  PacketSlicingRule,
} from './liv-standard.types'

// ═══════════════════════════════════════════════════════════════
// §2 INSTANCE PROFILES — from Procedure Tables 11-23
// ═══════════════════════════════════════════════════════════════

export const INSTANCE_PROFILES: Record<InstanceId, InstanceProfile> = {
  'IN-MAIN': {
    id: 'IN-MAIN',
    reads: ['T0', 'T1.4', 'T1.5', 'T6.2', 'T6.3'],
    receives: ['Human natural language only — Main sets IF.09 + IF.10 from active standard versions'],
    produces: ['Completed IF.01–IF.10', 'Bundle scope list', 'PK per IN-BUILD', 'PK for IN-RESOLVE'],
    passesTo: ['IN-BUILD', 'IN-RESOLVE'],
  },
  'IN-BUILD': {
    id: 'IN-BUILD',
    reads: ['T0', 'T1.1', 'T1.2', 'T1.6', 'T2.1', 'T3.2'],
    receives: ['IF.01', 'IF.02 (this bundle)', 'IF.03 (this bundle)', 'IF.04 (this bundle)', 'IF.05 (this bundle)', 'IF.06 (this bundle)', 'IF.07 (if applicable)', 'IF.09', 'IF.10'],
    produces: ['All R0–R4 files for assigned bundle', 'Files typed to assigned TPL-IDs', '@liv-standard stamp on every file', 'No cross-bundle edits'],
    passesTo: ['IN-RESOLVE'],
  },
  'IN-RESOLVE': {
    id: 'IN-RESOLVE',
    reads: ['T0', 'T1.5', 'T1.4', 'T3.2', 'T5.3'],
    receives: ['IF.05 (full — all bundles)', 'IF.06 (full — all bundles)', 'IF.03 (full scope)', 'All IN-BUILD output files', 'IF.09', 'IF.10'],
    produces: ['Reconciled cross-bundle interfaces', 'Updated event-schema.ts (re-exports only)', 'Corrected W-ATOM imports', 'Corrected W-EVENT subscriptions', '@liv-standard stamp verified on all files'],
    passesTo: ['IN-AUDIT'],
  },
  'IN-AUDIT': {
    id: 'IN-AUDIT',
    reads: ['T1.3', 'T1.5', 'T5.3'],
    receives: ['Full reconciled file set + IF.05 (wire map)', 'Processes each file independently', 'No cross-file state', 'Parallelizable'],
    produces: ['Pass: manifest matches file body', 'Fail: {field, expected, actual, axiom}', 'FM-PENDING: generated manifest (no block)'],
    passesTo: ['IN-COMPILE', 'IN-MAIN'],
  },
  'IN-COMPILE': {
    id: 'IN-COMPILE',
    reads: ['T5.4'],
    receives: ['Full verified file set from IN-AUDIT'],
    produces: ['Zero-error file set', 'Error log: {file, tsCode, violation, axiom, fix}'],
    passesTo: ['IN-QA'],
  },
  'IN-DIAGNOSE': {
    id: 'IN-DIAGNOSE',
    reads: ['T0', 'T5.4', 'T1.1', 'T1.5'],
    receives: ['IN-COMPILE error log (stalled — error count not decreasing) + full file set'],
    produces: ['Fixed file set (if structural fix)', 'Diagnosis report: {rootCause, affectedFiles[], axiomViolations[], recommendation, detail}', '(escalation if ambiguous)'],
    passesTo: ['IN-COMPILE', 'IN-MAIN'],
  },
  'IN-QA': {
    id: 'IN-QA',
    reads: ['T0', 'T5.3', 'T4.1', 'T4.2'],
    receives: ['Zero-error file set', 'IF.08 (acceptance criteria)', 'IN-COMPILE error log'],
    produces: ['Pass: {status:"pass", buildId, standardVersion, procedureVersion, timestamp}', 'Fail: {status:"fail", violations:[{file, ruleId, axiom, description}]}'],
    passesTo: ['IN-MAIN'],
  },
} as const

// ═══════════════════════════════════════════════════════════════
// §4 HANDOFFS — from Procedure Table 28 + COMPILE→DIAGNOSE
// ═══════════════════════════════════════════════════════════════

export const HANDOFFS: readonly HandoffSpec[] = [
  { from: 'Human',       to: 'IN-MAIN',    format: 'HO-PACKET',    content: 'Natural language feature intent. No structured fields — IN-MAIN populates IF.01-IF.10.' },
  { from: 'IN-MAIN',     to: 'IN-BUILD',    format: 'HO-PACKET',    content: 'PK-{buildId}-BUILD-{slice} per bundle. Sliced IF fields only.' },
  { from: 'IN-MAIN',     to: 'IN-RESOLVE',  format: 'HO-PACKET',    content: 'PK-{buildId}-RESOLVE. IF.05 + IF.06 + IF.03 full scope.' },
  { from: 'IN-BUILD',    to: 'IN-RESOLVE',  format: 'HO-FILES',     content: 'F-{slice}/ tree. types/, domain/, workflow/, contract/, exec/. All files complete.' },
  { from: 'IN-RESOLVE',  to: 'IN-AUDIT',    format: 'HO-FILES',     content: 'Full reconciled src/ tree. event-schema.ts updated. All imports corrected.' },
  { from: 'IN-AUDIT',    to: 'IN-COMPILE',  format: 'HO-FILES',     content: 'Verified file set. Manifests validated or generated. validated date stamped.' },
  { from: 'IN-AUDIT',    to: 'IN-MAIN',     format: 'HO-REPORT',    content: 'Audit failure report: [{file, field, expected, actual, axiom}]. Structural issues beyond manifest repair.' },
  { from: 'IN-COMPILE',  to: 'IN-DIAGNOSE', format: 'HO-FILES+LOG', content: 'Stalled file set + error log (error count not decreasing)' },
  { from: 'IN-COMPILE',  to: 'IN-QA',       format: 'HO-FILES+LOG', content: 'Zero-error file set + error log: [{file, tsCode, violation, axiom, fix}]' },
  { from: 'IN-QA',       to: 'IN-MAIN',     format: 'HO-REPORT',    content: 'Pass: {status:"pass", buildId, standardVersion, procedureVersion, timestamp}. Fail: {status:"fail", violations:[{file, ruleId, axiom, description}]}' },
  { from: 'IN-DIAGNOSE', to: 'IN-COMPILE',  format: 'HO-FILES',     content: 'Fixed file set with diagnosis context' },
  { from: 'IN-DIAGNOSE', to: 'IN-MAIN',     format: 'HO-REPORT',    content: 'Diagnosis report: {rootCause, affectedFiles[], axiomViolations[], recommendation, detail}' },
] as const

// ═══════════════════════════════════════════════════════════════
// §6.1 FLOW → TEMPLATE MAPPING — from Procedure Table 37
// ═══════════════════════════════════════════════════════════════

export const FLOW_TEMPLATE_MAP: readonly FlowTemplateEntry[] = [
  { flowId: 'FL-CRUD',    layer: 'R0', templates: ['TPL-R0-TYPES', 'TPL-R0-EVENTS'],                condition: 'Always' },
  { flowId: 'FL-CRUD',    layer: 'R1', templates: ['TPL-R1-LOGIC'],                                 condition: 'Only if validation logic exists' },
  { flowId: 'FL-CRUD',    layer: 'R2', templates: ['TPL-R2-WF-CRUD'],                               condition: 'Always' },
  { flowId: 'FL-CRUD',    layer: 'R3', templates: ['TPL-R3-CONTRACT', 'TPL-R3-HOOK', 'TPL-R3-UI'],  condition: 'Always' },
  { flowId: 'FL-CRUD',    layer: 'R4', templates: ['TPL-R4-DB'],                                    condition: 'Always' },
  { flowId: 'FL-QUERY',   layer: 'R2', templates: ['TPL-R2-WF-CRUD'],                               condition: 'Query uses crud workflow — read-only ops only' },
  { flowId: 'FL-QUERY',   layer: 'R3', templates: ['TPL-R3-HOOK'],                                  condition: 'Query hook — no mutation actions' },
  { flowId: 'FL-QUERY',   layer: 'R4', templates: ['TPL-R4-DB'],                                    condition: 'Always' },
  { flowId: 'FL-STREAM',  layer: 'R2', templates: ['TPL-R2-WF-STREAM'],                             condition: 'Always' },
  { flowId: 'FL-STREAM',  layer: 'R3', templates: ['TPL-R3-HOOK'],                                  condition: 'Status includes "streaming" state' },
  { flowId: 'FL-STREAM',  layer: 'R4', templates: ['TPL-R4-IO'],                                    condition: 'Always — stream is external I/O' },
  { flowId: 'FL-AUTH',    layer: 'R0', templates: ['TPL-R0-TYPES', 'TPL-R0-CONST'],                 condition: 'Session type + token constants' },
  { flowId: 'FL-AUTH',    layer: 'R2', templates: ['TPL-R2-WF-AUTH'],                                condition: 'Always' },
  { flowId: 'FL-AUTH',    layer: 'R3', templates: ['TPL-R3-CONTRACT'],                               condition: 'Auth routes only' },
  { flowId: 'FL-AUTH',    layer: 'R4', templates: ['TPL-R4-DB', 'TPL-R4-IO'],                        condition: 'DB for sessions + IO for token service' },
  { flowId: 'FL-JOB',     layer: 'R2', templates: ['TPL-R2-WF-JOB'],                                condition: 'Always' },
  { flowId: 'FL-JOB',     layer: 'R4', templates: ['TPL-R4-DB'],                                    condition: 'Depending on job I/O target' },
  { flowId: 'FL-WEBHOOK', layer: 'R3', templates: ['TPL-R3-CONTRACT'],                               condition: 'Webhook ingress route only' },
  { flowId: 'FL-WEBHOOK', layer: 'R2', templates: ['TPL-R2-WF-CRUD'],                               condition: 'Parse + persist uses crud workflow shape' },
  { flowId: 'FL-WEBHOOK', layer: 'R4', templates: ['TPL-R4-DB'],                                    condition: 'Always' },
  { flowId: 'FL-MIGRATION', layer: 'none', templates: [],                                           condition: 'Runtime startup script — no bundle files produced. Migration SQL authored directly.' },
  { flowId: 'FL-EVENT-FAN', layer: 'none', templates: [],                                           condition: 'Event wiring implemented within existing slices — no dedicated bundle files.' },
] as const

// ═══════════════════════════════════════════════════════════════
// §6.3 PACKET SLICING RULES — RS.1-RS.6
// ═══════════════════════════════════════════════════════════════

export const PACKET_SLICING_RULES: readonly PacketSlicingRule[] = [
  { id: 'RS.1', text: 'IN-MAIN assembles one master packet with all IF fields, then slices per §2 profiles.' },
  { id: 'RS.2', text: 'Each IN-BUILD packet contains only IF fields scoped to its assigned bundle.' },
  { id: 'RS.3', text: 'IN-RESOLVE receives full IF.05 + IF.06 across all bundles.' },
  { id: 'RS.4', text: 'IN-COMPILE receives no packet fields. File set only.' },
  { id: 'RS.5', text: 'IN-QA receives IF.08 + IN-COMPILE error log. No source packet fields.' },
  { id: 'RS.6', text: 'IF.09 and IF.10 go to all instances. Every instance stamps every file. File without stamp is rejected by IN-RESOLVE.' },
] as const
