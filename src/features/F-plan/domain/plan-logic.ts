// @liv-standard v1.5.1 amended sprint-13-shot-2
// [F-plan/domain/plan-logic.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-13-shot-2 (NEW — relocated from F-planner/domain/planner-logic.ts on dissolution)
// slice:      F-plan
// layer:      R1
// wires-in:
//   W-ATOM  PipelineStage         ../types/pipeline-types
//   W-ATOM  StageStatus           ../types/pipeline-types
//   W-ATOM  PlannerJob            ../types/pipeline-types
//   W-ATOM  IfContract            ../types/pipeline-types
//   W-ATOM  StageLogEntry         ../types/pipeline-types
//   W-ATOM  FileEntry             ../types/pipeline-types
//   W-ATOM  ParsedInstanceResponse ../types/pipeline-types
//   W-ATOM  PLANNER_CONST         F-builder/config/builder-const
// wires-out:  none  (R1 logic consumed intra-slice by R2 only — A2)
// deps:
//   R0  ../types/pipeline-types
//   R0  @/features/F-builder/config/builder-const
// validated:  pending
//
// A4: pure — no I/O, no throws. All functions return typed values.
// R1 never logs — pure functions have no side effects. (T5.2)
//
// step4b2-phase-a (A2, A4, A6): (unchanged — see original)
//
// step4b2-phase-b (A2, A4, A6):
//   Three new pure functions for the autonomous pipeline loop (runPipeline, R2).
//   Local types JobPacketLike and TemplateLike declared at R1 (A6, A2) — R1
//   cannot import JobPacket or Template from core/ (R5). R2 fetches these via
//   liv-api.ts and passes values conforming to these shapes as arguments.
//   buildInstancePrompt() assembles the system prompt for any pipeline instance.
//   parseInstanceResponse() extracts FileEntry[] from AI response code blocks.
//     Conservative: malformed → files empty, raw always preserved.
//   W-FN  validateHandoffShape   →  (deleted step4b4-handoff — A7, zero consumers)
//   Axiom cite: A2 — R1 imports R0 only. A4 — pure, no I/O. A6 — local types.
//
// phase-4.2 (A2, A3, A4, A6, A7):
//   Three new pure functions for tiered parallel execution and stress decomposition.
//   classifyBundleTiers: topological sort of bundles by structural wire dependencies.
//   assessBuildOutput: mechanical stress check on IN-BUILD output files.
//   groupTemplatesByLayer: groups templates by R-layer for decomposition path.
//   WireEntryLike declared at R1 (A6, A2) — R1 cannot import WireEntry from
//   canonical (R5). R2 passes contract.wireMap which structurally conforms.
//   buildInstancePrompt extended with referenceContext param for prior-tier R0 files.
//   Axiom cite: A2 — R1 imports R0 only. A4 — pure, no I/O. A6 — local types.
//   A7 — all functions removable without affecting other slices.
//
// phase-4.3 (A2, A4, A6, A7):
//   Two new pure functions for read phase structural analysis.
//   assessFileCompliance: per-file LIV-Standard compliance check (stamp, manifest).
//   buildReadSnapshot: assembles structural snapshot from scan + stored snapshot.
//   Local types FileComplianceInput, SnapshotInput declared at R1 (A6, A2).
//   ReadSnapshot, FileAssessment, SliceSummary, FileDiffStatus imported from R0 types.
//   Axiom cite: A2 — R1 imports R0 only. A4 — pure, no I/O. A6 — local types.
//   A7 — all functions removable.

import type {
  PipelineStage,
  StageStatus,
  PlannerJob,
  IfContract,
  StageLogEntry,
  FileEntry,
  ParsedInstanceResponse,
  ReadSnapshot,
  FileAssessment,
  SliceSummary,
  FileDiffStatus,
  FileSnapshot,
  ScopingConstraints,
  BundleDirective,
} from '../types/pipeline-types'
import { PLANNER_CONST } from '@/features/F-builder/config/builder-const'

// ── Local shapes — R5 type subsets used by R1 ─────────────────────────────────
// R1 cannot import from core/ (R5) — A2. R2 fetches full types via liv-api.ts
// and passes values conforming to these shapes as plain arguments.
// None of these are exported — declared at R1 of owner (A6).

type InMainInstanceProfile = {
  readonly reads:     readonly string[]
  readonly receives:  readonly string[]
  readonly produces:  readonly string[]
}

// Subset of JobPacket fields that buildInstancePrompt needs.
// R2 passes getPacketForInstance() result typed as this shape.
type JobPacketLike = {
  readonly instanceType: string
  readonly fields:       Record<string, unknown>
}

// Subset of Template fields that buildInstancePrompt needs for IN-BUILD.
// R2 passes getTemplate() result typed as this shape.
type TemplateLike = {
  readonly id:     string
  readonly file:   string
  readonly layer:  string
  readonly body:   string
  readonly slots:  readonly string[]
}

// ── Stage sequencing ──────────────────────────────────────────────────────────

export function nextStage(current: PipelineStage): PipelineStage | null {
  const order = PLANNER_CONST.STAGE_ORDER
  const idx   = order.indexOf(current)
  if (idx === -1 || idx === order.length - 1) return null
  return order[idx + 1]
}

export function isTerminalStatus(status: StageStatus): boolean {
  return status === 'failed' || status === 'complete' || status === 'skipped'
}

export function isPipelineComplete(job: PlannerJob): boolean {
  return job.currentStage === 'IN_QA' && job.stageStatus === 'complete'
}

export function isPipelineFailed(job: PlannerJob): boolean {
  return job.pipelineStatus === 'failed'
}

// ── Retry logic ───────────────────────────────────────────────────────────────

export function canRetry(stage: PipelineStage, retryCount: number): boolean {
  return retryCount < PLANNER_CONST.MAX_RETRIES_PER_STAGE[stage]
}

// ── Stage log construction ────────────────────────────────────────────────────

export function buildStageLogEntry(opts: {
  stage:       PipelineStage
  status:      StageStatus
  startedAt:   number
  completedAt: number | null
  message:     string | null
  axiomCite:   string | null
  retryCount:  number
}): StageLogEntry {
  return {
    stage:       opts.stage,
    status:      opts.status,
    startedAt:   opts.startedAt,
    completedAt: opts.completedAt,
    message:     opts.message,
    axiomCite:   opts.axiomCite,
    retryCount:  opts.retryCount,
  }
}

// ── IF Contract validation ────────────────────────────────────────────────────

export function validateIfContract(
  contract: unknown
): { code: string; message: string } | null {
  if (!contract || typeof contract !== 'object') {
    return { code: 'VALIDATION_FAILED', message: 'IF contract must be an object' }
  }

  const c = contract as Record<string, unknown>

  const requiredStrings: (keyof IfContract)[] = [
    'featureIntent',
    'standardVersion',
    'procedureVersion',
  ]

  for (const field of requiredStrings) {
    if (!c[field] || typeof c[field] !== 'string' || !(c[field] as string).trim()) {
      return { code: 'VALIDATION_FAILED', message: `IF contract field '${field}' is required` }
    }
  }

  const requiredArrays: (keyof IfContract)[] = [
    'atomDeclarations',
    'bundleScope',
    'flowSelection',
    'wireMap',
    'eventContracts',
    'acceptanceCriteria',
  ]

  for (const field of requiredArrays) {
    if (!Array.isArray(c[field])) {
      return { code: 'VALIDATION_FAILED', message: `IF contract field '${field}' must be an array` }
    }
  }

  if (typeof c['frozenAt'] !== 'number') {
    return { code: 'VALIDATION_FAILED', message: "IF contract 'frozenAt' must be a number" }
  }

  if (!c['frozenBy'] || typeof c['frozenBy'] !== 'string') {
    return { code: 'VALIDATION_FAILED', message: "IF contract 'frozenBy' is required" }
  }

  return null
}

// ── Summary projection ────────────────────────────────────────────────────────

export function getStageSummary(job: PlannerJob): {
  currentStage: PipelineStage | null
  stageStatus:  StageStatus
  completedStages: PipelineStage[]
  failedStage:     PipelineStage | null
} {
  const completedStages = job.pipelineLog
    .filter(e => e.status === 'complete')
    .map(e => e.stage)

  const failedEntry = job.pipelineLog.find(e => e.status === 'failed')

  return {
    currentStage:    job.currentStage,
    stageStatus:     job.stageStatus,
    completedStages,
    failedStage:     failedEntry?.stage ?? null,
  }
}

// ── IN-MAIN: prompt assembly (step4b2-phase-a, extended phase-4.4) ───────────
// reentryContext: optional — passed by R2 when job.reentryCount > 0.
// scopingConstraints: optional — derived from ReadSnapshot by deriveScopingConstraints (R1).
// When present, injects structured scoping section between Contract State and Instructions.
// Existing callers without it produce the same prompt as before (A7 fallback).

export function buildInMainPrompt(
  standardSlice:       string,
  profile:             InMainInstanceProfile,
  currentContract:     Partial<IfContract>,
  reentryContext?:     { failureReason: string; failedStage: string; reentryCount: number },
  scopingConstraints?: ScopingConstraints
): string {
  const filled = Object.keys(currentContract).filter(k => {
    const v = currentContract[k as keyof IfContract]
    return v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)
  })

  const allFields: (keyof IfContract)[] = [
    'featureIntent', 'atomDeclarations', 'bundleScope', 'flowSelection',
    'wireMap', 'eventContracts', 'migrationDelta', 'acceptanceCriteria',
    'standardVersion', 'procedureVersion',
  ]

  const missing = allFields.filter(f => !filled.includes(f))

  const contractState = filled.length > 0
    ? `Current contract state (${filled.length}/${allFields.length} fields filled):\n` +
      JSON.stringify(currentContract, null, 2)
    : 'No contract fields filled yet — this is the first turn.'

  const missingList = missing.length > 0
    ? `Missing fields: ${missing.join(', ')}`
    : 'All required fields are present — ready for confirmation.'

  return [
    '# LIV IN-MAIN Instance',
    '',
    ...(reentryContext ? [
      '## ⚠ Re-entry Context',
      `This build previously failed (re-entry ${reentryContext.reentryCount}).`,
      `Failed at stage: **${reentryContext.failedStage}**`,
      `Reason: ${reentryContext.failureReason}`,
      '',
      'The existing contract is shown below. Ask the user what they want to change,',
      'or if they want to retry as-is. Only update fields the user explicitly amends.',
      '',
    ] : []),
    '## Standard Slice',
    standardSlice,
    '',
    '## Instance Profile',
    `Reads:    ${profile.reads.join(', ')}`,
    `Receives: ${profile.receives.join(', ')}`,
    `Produces: ${profile.produces.join(', ')}`,
    '',
    '## Contract State',
    contractState,
    '',
    missingList,
    '',
    ...(scopingConstraints ? [
      '## Codebase Scoping',
      scopingConstraints.summary,
      '',
      'Bundle directives:',
      ...scopingConstraints.directives.map(d =>
        `- ${d.name}: ${d.action} — ${d.reason}`
      ),
      '',
      'Rules:',
      "- 'skip' bundles: do NOT include in bundleScope unless user explicitly requests changes to this slice.",
      "- 'rebuild' bundles: include in bundleScope with status 'modified'.",
      "- 'delta' bundles: include only if user intent touches this slice.",
      ...(scopingConstraints.foreignDetected
        ? ['- External files detected but not managed by LIV.']
        : []),
      '',
    ] : []),
    '## Instructions',
    'You are IN-MAIN. Your job is to fill the IF contract by conversing with the user.',
    'Ask for any missing fields. When you have enough information, emit a JSON block',
    'wrapped in ```json\n...\n``` containing the fields you have extracted or inferred.',
    'Only emit fields you are confident about. Do not hallucinate values.',
    '',
    '## Field shapes — emit exactly these structures',
    'bundleScope: [{ "name": "F-slice-name", "status": "new" | "modified" }]',
    'atomDeclarations: [{ "kind": "AK-ENT"|"AK-PAY"|"AK-RES"|"AK-CONST"|"AK-ENUM"|"AK-REF"|"AK-SUM"|"AK-DELTA", "name": "TypeName", "owner": "F-slice", "fields": [{ "name": "fieldName", "type": "string" }] }]',
    'wireMap: [{ "wire": "W-ATOM"|"W-EVENT"|"W-INJECT"|"W-HOOK", "from": "F-slice", "to": "F-slice", ... }]',
    '  W-ATOM:   add "atomName": "TypeName"',
    '  W-EVENT:  add "eventId": "EVENT_NAME", "payloadType": "TypeName"',
    '  W-INJECT: add "interfaceName": "IName", "methods": [{ "name": "fn", "params": [], "returns": "type" }]',
    '  W-HOOK:   add "hookName": "useName"',
    'eventContracts: [{ "eventId": "EVENT_NAME", "owner": "F-slice", "payload": "TypeName", "consumers": ["F-slice"] }]',
    'migrationDelta: [{ "op": "create_table"|"add_column"|"add_index"|"drop_column", "target": "table_name", "detail": "description" }]  — use null if no migration',
    'flowSelection: ["FL-CRUD"|"FL-QUERY"|"FL-STREAM"|"FL-AUTH"|"FL-MIGRATION"|"FL-EVENT-FAN"|"FL-JOB"|"FL-WEBHOOK"]',
    '',
    'When all fields are filled, present a decomposition summary and ask for confirmation.',
  ].join('\n')
}

// ── IN-MAIN: response parsing (step4b2-phase-a) ───────────────────────────────

export function parseIfFieldsFromResponse(
  aiResponse:       string,
  existingContract: Partial<IfContract>
): Partial<IfContract> {
  const jsonBlockMatch = aiResponse.match(/```json\s*([\s\S]*?)```/)
  if (!jsonBlockMatch || !jsonBlockMatch[1]) {
    return existingContract
  }

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(jsonBlockMatch[1].trim()) as Record<string, unknown>
  } catch {
    return existingContract
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return existingContract
  }

  // Mutable working copy — canonical IfContract fields are readonly.
  const merged: Record<string, unknown> = { ...existingContract }

  const stringFields: (keyof IfContract)[] = [
    'featureIntent', 'standardVersion', 'procedureVersion',
  ]
  for (const field of stringFields) {
    const v = parsed[field]
    if (typeof v === 'string' && v.trim()) {
      merged[field] = v
    }
  }

  const arrayFields: (keyof IfContract)[] = [
    'atomDeclarations', 'bundleScope', 'flowSelection',
    'wireMap', 'eventContracts', 'acceptanceCriteria',
  ]
  for (const field of arrayFields) {
    const v = parsed[field]
    if (Array.isArray(v) && v.length > 0) {
      merged[field] = v
    }
  }

  // migrationDelta: canonical is readonly MigrationDelta[] | null (array of {op,target,detail}).
  // null is valid (no migration). Non-array non-null values are rejected.
  if ('migrationDelta' in parsed) {
    const md = parsed.migrationDelta
    if (md === null) {
      merged.migrationDelta = null
    } else if (Array.isArray(md)) {
      merged.migrationDelta = md
    }
    // Non-array, non-null: ignore (malformed AI output)
  }

  return merged as Partial<IfContract>
}

// ── IN-MAIN: contract completeness check (step4b2-phase-a) ────────────────────

export function isContractComplete(
  contract: Partial<IfContract>
): { complete: boolean; missing: string[] } {
  const required: (keyof IfContract)[] = [
    'featureIntent',
    'atomDeclarations',
    'bundleScope',
    'flowSelection',
    'wireMap',
    'eventContracts',
    'acceptanceCriteria',
    'standardVersion',
    'procedureVersion',
  ]

  const missing: string[] = []

  for (const field of required) {
    const v = contract[field]
    if (v === undefined || v === null) { missing.push(field); continue }
    if (typeof v === 'string' && !v.trim()) { missing.push(field); continue }
    if (Array.isArray(v) && v.length === 0) { missing.push(field) }
  }

  return { complete: missing.length === 0, missing }
}

// ── IN-MAIN: decomposition summary (step4b2-phase-a) ─────────────────────────

export function buildDecompositionSummary(contract: IfContract): string {
  // bundleScope: canonical { name, status } — no slice/action/layers
  const bundleList = contract.bundleScope
    .map(b => `  • ${b.name} (${b.status})`)
    .join('\n')

  const flowList = contract.flowSelection.length > 0
    ? contract.flowSelection.map(f => `  • ${f}`).join('\n')
    : '  • (none)'

  // wireMap: discriminated union on 'wire', not 'wireType'
  const wireList = contract.wireMap.length > 0
    ? contract.wireMap
        .map(w => {
          const base = `${w.wire}: ${w.from} → ${w.to}`
          if (w.wire === 'W-ATOM')   return `  • ${base} (${w.atomName})`
          if (w.wire === 'W-EVENT')  return `  • ${base} [${w.eventId}: ${w.payloadType}]`
          if (w.wire === 'W-INJECT') return `  • ${base} (${w.interfaceName})`
          if (w.wire === 'W-HOOK')   return `  • ${base} (${w.hookName})`
          return `  • ${base}`
        })
        .join('\n')
    : '  • (none)'

  // eventContracts: canonical { eventId, owner, payload, consumers }
  const eventList = contract.eventContracts.length > 0
    ? contract.eventContracts
        .map(e => `  • ${e.eventId} — owned by ${e.owner} (${e.payload}) → [${e.consumers.join(', ')}]`)
        .join('\n')
    : '  • (none)'

  const criteriaList = contract.acceptanceCriteria
    .map((c, i) => `  ${i + 1}. ${c}`)
    .join('\n')

  // migrationDelta: canonical readonly MigrationDelta[] | null — array of {op, target, detail}
  const migrationNote = contract.migrationDelta && contract.migrationDelta.length > 0
    ? contract.migrationDelta.map(m => `  • ${m.op} ${m.target}: ${m.detail}`).join('\n')
    : '  None'

  return [
    '## Decomposition Summary',
    '',
    `**Intent:** ${contract.featureIntent}`,
    '',
    '**Bundles:**',
    bundleList,
    '',
    '**Flows:**',
    flowList,
    '',
    '**Wire Map:**',
    wireList,
    '',
    '**Events:**',
    eventList,
    '',
    '**Migration:**',
    migrationNote,
    '',
    '**Acceptance Criteria:**',
    criteriaList,
    '',
    '---',
    'Does this look correct? Reply **confirm** to freeze the contract and begin the build,',
    'or describe any changes you want to make.',
  ].join('\n')
}

// ── Local shape — ModelPreferences subset used by R1 ─────────────────────────
// R1 cannot import from F-user-profile (cross-slice) — A2. R2 fetches full
// ModelPreferences via IPlannerDb.getModelPreferences and passes a value
// conforming to this shape as an argument. Not exported — A6.
type ModelTierPreferenceLike = { provider: string; model: string }
type ModelPreferencesLike = {
  largest:  ModelTierPreferenceLike | null
  medium:   ModelTierPreferenceLike | null
  smallest: ModelTierPreferenceLike | null
}

// ── Model resolution (step4b2-phase-a, extended in step4b2-phase-d) ───────────
// preferences: optional — passed by R2 from IPlannerDb.getModelPreferences().
// When a tier has a non-null preference AND the provider still has a key, uses it.
// Falls back to MODEL_TIER_MAP when preference is null, absent, or provider lost.
// Pure — no I/O (A4). Reads PLANNER_CONST.MODEL_TIER_MAP (R0).

export function resolveModel(
  sizeTier:           'Largest' | 'Medium' | 'Smallest',
  availableProviders: string[],
  preferences?:       ModelPreferencesLike | null
): { provider: string; model: string } {
  // User preference takes priority if provider still has a key
  if (preferences) {
    const tierKey = sizeTier.toLowerCase() as keyof ModelPreferencesLike
    const pref    = preferences[tierKey]
    if (pref && pref.model.trim() && availableProviders.includes(pref.provider)) {
      return { provider: pref.provider, model: pref.model }
    }
  }

  // Default: MODEL_TIER_MAP auto-assign (Phase A logic)
  const hasAnthropic = availableProviders.includes('anthropic')
  const hasDeepseek  = availableProviders.includes('deepseek')

  const tierKey: keyof typeof PLANNER_CONST.MODEL_TIER_MAP =
    hasAnthropic && hasDeepseek ? 'both'
    : hasAnthropic              ? 'anthropic-only'
    : hasDeepseek               ? 'deepseek-only'
    : 'deepseek-only'

  const model    = PLANNER_CONST.MODEL_TIER_MAP[tierKey][sizeTier]
  const provider = model.startsWith('claude') ? 'anthropic' : 'deepseek'

  return { provider, model }
}

// ── Pipeline: instance prompt assembly (step4b2-phase-b, extended phase-4.2) ──
// Assembles the system prompt for any pipeline instance (IN-BUILD through IN-QA).
// R2 pre-fetches standardSlice, profile, packet via liv-api.ts and passes them.
// templates: IN-BUILD only — one TemplateLike per flow template to fill.
// existingFiles: passed to IN-RESOLVE, IN-AUDIT, IN-COMPILE, IN-QA as prior output.
//   Also used in decomposition: prior-layer output passed as existingFiles.
// referenceContext: prior-tier R0 files passed to downstream-tier IN-BUILD calls.
//   Coexists with existingFiles — both can be populated simultaneously.
//   Orchestration data only — not part of JobPacket or IF contract.
// errorLog: passed to IN-COMPILE (fail path) and IN-QA for context.
// Pure — no I/O (A4).

export function buildInstancePrompt(params: {
  standardSlice:    string
  profile:          InMainInstanceProfile
  packet:           JobPacketLike
  templates?:       TemplateLike[]
  existingFiles?:   FileEntry[]
  referenceContext?: FileEntry[]
  errorLog?:        string
}): string {
  const { standardSlice, profile, packet, templates, existingFiles, referenceContext, errorLog } = params

  const parts: string[] = [
    `# LIV ${packet.instanceType} Instance`,
    '',
    '## Standard Slice',
    standardSlice,
    '',
    '## Instance Profile',
    `Reads:    ${profile.reads.join(', ')}`,
    `Receives: ${profile.receives.join(', ')}`,
    `Produces: ${profile.produces.join(', ')}`,
    '',
    '## Job Packet',
    '```json',
    JSON.stringify(packet.fields, null, 2),
    '```',
  ]

  if (templates && templates.length > 0) {
    parts.push('', '## Templates to fill')
    for (const tpl of templates) {
      parts.push(
        '',
        `### ${tpl.id} — ${tpl.file} (${tpl.layer})`,
        'Fill all slots marked {SLOT_NAME}. Emit the complete file in a code block.',
        '```typescript',
        tpl.body,
        '```',
      )
    }
  }

  if (existingFiles && existingFiles.length > 0) {
    parts.push(
      '',
      `## Prior output (${existingFiles.length} files)`,
      'These files were produced by the previous instance.',
      ...existingFiles.slice(0, 20).map(f =>
        `\n### ${f.path}\n\`\`\`typescript\n${f.content}\n\`\`\``
      ),
    )
    if (existingFiles.length > 20) {
      parts.push(`\n_(${existingFiles.length - 20} additional files omitted for brevity)_`)
    }
  }

  if (referenceContext && referenceContext.length > 0) {
    parts.push(
      '',
      `## Reference context (prior tier R0)`,
      'These R0 type/config files were produced by bundles in earlier tiers.',
      'Import from them as needed — they are already built and available.',
      ...referenceContext.slice(0, 20).map(f =>
        `\n### ${f.path}\n\`\`\`typescript\n${f.content}\n\`\`\``
      ),
    )
    if (referenceContext.length > 20) {
      parts.push(`\n_(${referenceContext.length - 20} additional reference files omitted)_`)
    }
  }

  if (errorLog) {
    parts.push('', '## Error context', '```', errorLog, '```')
  }

  parts.push(
    '',
    '## Output instructions',
    'Emit ALL generated files as fenced code blocks with the file path as the fence label:',
    '```typescript src/features/F-foo/types/foo-types.ts',
    '// file content here',
    '```',
    'Each file must be complete and LIV-Standard v1.3 compliant.',
    'Stamp every file with the 3-line header and manifest block (T1.3).',
    'Do not truncate. Do not emit placeholder comments.',
  )

  return parts.join('\n')
}

// ── Pipeline: instance response parsing (step4b2-phase-b) ────────────────────
// Extracts FileEntry[] from AI response code blocks.
// Looks for fenced blocks with a path label: ```lang path/to/file.ts
// Conservative: malformed block → skipped. raw always preserved.
// Returns ParsedInstanceResponse — R2 uses files[] to accumulate output.
// Pure — no I/O, no throws (A4).

export function parseInstanceResponse(
  raw:        string,
  instanceId: string
): ParsedInstanceResponse {
  const files: FileEntry[] = []

  // Match fenced code blocks with a path label after the language tag.
  // Pattern: ```[lang] path/to/file.ext\n...content...\n```
  // The path must contain a slash or end in a known extension to avoid
  // matching non-file blocks.
  const fencePattern = /```(?:[a-z]*)\s+([\w./-]+\.[a-z]+)\n([\s\S]*?)```/g
  let match: RegExpExecArray | null

  while ((match = fencePattern.exec(raw)) !== null) {
    const path    = match[1].trim()
    const content = match[2]

    // Require path to look like a file path (has extension, no spaces)
    if (!path || path.includes(' ') || !path.includes('.')) continue

    files.push({ path, content, encoding: 'utf8' })
  }

  // Extract report block if present (IN-QA, IN-RESOLVE emit structured reports)
  const reportMatch = raw.match(/```(?:json)?\s*report\n([\s\S]*?)```/i)
  const report      = reportMatch ? reportMatch[1].trim() : undefined

  // Extract error log if present (IN-COMPILE fail path)
  const errorMatch = raw.match(/```(?:text)?\s*error[-_]?log\n([\s\S]*?)```/i)
  const errorLog   = errorMatch ? errorMatch[1].trim() : undefined

  return { files, report, errorLog, raw }
}

// ── Error classification (step4b2-phase-c) ────────────────────────────────────
// Maps error code + stage to error class 1|2|3.
// CLASS_1: IF field issue — pre-pipeline, handled by IN-MAIN gate. Not expected
//   in pipeline execution path but included for completeness.
// CLASS_2: Instance output wrong — bad files, handoff mismatch, validation fail.
//   Retry with error context. Budget exhausted → re-entry to IN-MAIN.
// CLASS_3: Infrastructure — AI I/O error, executor crash, DB error.
//   Retry once (FAILSAFE.AI_RETRY_LIMIT). Second failure → 'escalated'.
// Unknown codes → CLASS_2 (conservative: retry before escalating).
// Pure — no I/O, no throws (A4).

export function classifyError(
  error: { code: string; message: string },
  _stage: PipelineStage
): 1 | 2 | 3 {
  // CLASS_3 — infrastructure failures
  const class3Codes = [
    'AI_IO_ERROR',
    'AI_TIMEOUT',
    'DB_ERROR',
    'EXECUTOR_ERROR',
    'NETWORK_ERROR',
    'NO_PROVIDERS',
  ]
  if (class3Codes.includes(error.code)) return 3

  // CLASS_2 — output quality / validation failures
  const class2Codes = [
    'HANDOFF_SHAPE_INVALID',
    'VALIDATION_FAILED',
    'PARSE_ERROR',
    'EMPTY_OUTPUT',
    'CONFLICT',
    'NOT_FOUND',
  ]
  if (class2Codes.includes(error.code)) return 2

  // Default: CLASS_2 — conservative, retry before escalating
  return 2
}

// ── Stall detection (step4b2-phase-c) ────────────────────────────────────────
// Returns true if error count is not decreasing between IN-COMPILE iterations.
// R2 tracks errorCount per iteration and calls this to decide whether to route
// to IN-DIAGNOSE. Two equal counts = stall; increasing count = stall.
// Pure — no I/O (A4).

export function detectStall(
  currentErrors:  number,
  previousErrors: number
): boolean {
  return currentErrors >= previousErrors
}

// ── Failsafe checks (step4b2-phase-c) ────────────────────────────────────────
// Checks all hard caps before a stage transition. R2 calls this before every
// stage advance in runPipeline(). Returns { safe: false, reason } on breach —
// R2 sets pipeline_status = 'failed' and logs the reason immediately.
// buildStartedAt: timestamp when runPipeline() began (Date.now() at entry).
// Pure — no I/O (A4). Reads PLANNER_CONST.FAILSAFE (R0).

export function checkFailsafes(
  job:             PlannerJob,
  buildStartedAt:  number
): { safe: boolean; reason?: string } {
  const { FAILSAFE } = PLANNER_CONST

  if (job.transitionCount >= FAILSAFE.MAX_TRANSITIONS) {
    return {
      safe:   false,
      reason: `Failsafe: transition_count ${job.transitionCount} >= MAX_TRANSITIONS ${FAILSAFE.MAX_TRANSITIONS}`,
    }
  }

  if (job.reentryCount >= FAILSAFE.MAX_REENTRIES) {
    return {
      safe:   false,
      reason: `Failsafe: reentry_count ${job.reentryCount} >= MAX_REENTRIES ${FAILSAFE.MAX_REENTRIES}`,
    }
  }

  const elapsedMs = Date.now() - buildStartedAt
  if (elapsedMs >= FAILSAFE.MAX_BUILD_TIME_MS) {
    const elapsedMin = Math.round(elapsedMs / 60_000)
    return {
      safe:   false,
      reason: `Failsafe: build elapsed ${elapsedMin} min >= MAX_BUILD_TIME_MS ${FAILSAFE.MAX_BUILD_TIME_MS / 60_000} min`,
    }
  }

  return { safe: true }
}

// ── Local shape — WireEntry subset for classifyBundleTiers (phase-4.2) ──────
// R1 cannot import WireEntry from canonical (R5) — A2. R2 passes contract.wireMap
// which structurally conforms. Only 'wire', 'from', 'to' are needed for
// topological sort — discriminated union variants are filtered by wire value.
// Not exported — declared at R1 of owner (A6).
type WireEntryLike = {
  readonly wire: string
  readonly from: string
  readonly to:   string
}

// ── classifyBundleTiers (phase-4.2) ──────────────────────────────────────────
// Topological sort of bundles by structural wire dependencies.
// Returns Map where key = tier number (0, 1, 2...), value = bundle names in that tier.
// Only W-ATOM and W-INJECT wires create build-order edges. W-EVENT and W-HOOK
// are runtime coupling — filtered out before sort (A2).
// Cycle detection: if wireMap contains a cycle among structural wires, returns
// all bundles in tier 0 (fallback to full parallel — let compile-retry resolve).
// Pure — no I/O (A4).

export function classifyBundleTiers(
  bundles: readonly { name: string; status: string }[],
  wireMap: readonly WireEntryLike[]
): Map<number, string[]> {
  const bundleNames = new Set(bundles.map(b => b.name))
  const result = new Map<number, string[]>()

  // Filter to structural wires between bundles in this job only
  const structuralWires = wireMap.filter(
    w => (w.wire === 'W-ATOM' || w.wire === 'W-INJECT')
      && bundleNames.has(w.from)
      && bundleNames.has(w.to)
      && w.from !== w.to  // self-references are not dependencies
  )

  // Build adjacency: inbound[bundle] = set of bundles it depends on
  const inbound = new Map<string, Set<string>>()
  for (const name of bundleNames) {
    inbound.set(name, new Set())
  }
  for (const w of structuralWires) {
    // w.from produces → w.to consumes → w.to depends on w.from
    inbound.get(w.to)!.add(w.from)
  }

  // Kahn's algorithm — iterative topological sort
  const assigned = new Set<string>()
  let tier = 0

  while (assigned.size < bundleNames.size) {
    const tierBundles: string[] = []

    for (const name of bundleNames) {
      if (assigned.has(name)) continue
      const deps = inbound.get(name)!
      // All dependencies must be in prior tiers (already assigned)
      const allDepsAssigned = [...deps].every(d => assigned.has(d))
      if (allDepsAssigned) {
        tierBundles.push(name)
      }
    }

    if (tierBundles.length === 0) {
      // Cycle detected — remaining bundles have circular deps.
      // Fallback: put all bundles in tier 0 (full parallel).
      result.clear()
      result.set(0, [...bundleNames])
      return result
    }

    result.set(tier, tierBundles)
    for (const name of tierBundles) {
      assigned.add(name)
    }
    tier++
  }

  return result
}

// ── assessBuildOutput (phase-4.2) ────────────────────────────────────────────
// Mechanical stress check on IN-BUILD output.
// expectedTemplates: derived by R2 from getTemplatesForFlow() for each flow.
// actualFiles: parsed from IN-BUILD response.
// Stress signals per file:
//   (1) expected path not present → missing
//   (2) content contains placeholder markers or length < STRESS_MIN_CONTENT_LENGTH → stressed
// Returns clean=true only if missing=[] and stressed=[].
// Pure — no I/O (A4).

export function assessBuildOutput(
  expectedTemplates: readonly { id: string; file: string }[],
  actualFiles:       readonly { path: string; content: string }[]
): { clean: boolean; missing: string[]; stressed: string[] } {
  const actualByPath = new Map(actualFiles.map(f => [f.path, f.content]))
  const missing:  string[] = []
  const stressed: string[] = []

  const placeholderPatterns = [
    '// TODO',
    '// ...',
    '/* placeholder */',
  ]

  for (const tpl of expectedTemplates) {
    const content = actualByPath.get(tpl.file)
    if (content === undefined) {
      missing.push(tpl.file)
      continue
    }
    // Check for placeholder markers
    const hasPlaceholder = placeholderPatterns.some(p => content.includes(p))
    if (hasPlaceholder || content.length < PLANNER_CONST.STRESS_MIN_CONTENT_LENGTH) {
      stressed.push(tpl.file)
    }
  }

  return {
    clean:   missing.length === 0 && stressed.length === 0,
    missing,
    stressed,
  }
}

// ── Local shape — FlowTemplateEntry subset for groupTemplatesByLayer ─────────
// R1 cannot import FlowTemplateEntry from canonical (R5) — A2. R2 passes
// getTemplatesForFlow() results which structurally conform.
// Not exported — declared at R1 of owner (A6).
type FlowTemplateEntryLike = {
  readonly layer:     string
  readonly templates: readonly string[]
}

// ── groupTemplatesByLayer (phase-4.2, updated phase-4.3) ─────────────────────
// Groups all templates by R-layer. Returns Map where key = layer string
// ('R0','R1','R2','R3','R4'), value = template IDs.
// Used by R2 decomposition path to split a stressed bundle into sequential
// per-layer IN-BUILD calls.
// Input type is a local subset of FlowTemplateEntry (drops flowId and condition).
// R2 passes getTemplatesForFlow() results narrowed to this shape.
// Pure — no I/O (A4).

export function groupTemplatesByLayer(
  flowEntries: readonly FlowTemplateEntryLike[]
): Map<string, string[]> {
  const result = new Map<string, string[]>()

  for (const entry of flowEntries) {
    const existing = result.get(entry.layer) ?? []
    for (const tplId of entry.templates) {
      if (!existing.includes(tplId)) {
        existing.push(tplId)
      }
    }
    result.set(entry.layer, existing)
  }

  return result
}

// ── assessFileCompliance (phase-4.3) ─────────────────────────────────────────
// Per-file LIV-Standard compliance check for the read phase. Pure string analysis.
// Checks: (1) Line 1 stamp. (2) Line 2 location. (3) Line 3 built-with.
// (4) @manifest block present. (5) Declared layer matches directory convention.
// Returns compliant=true only if all checks pass. Issues array lists each failure.
// Pure — no I/O (A4).

// Layer inference from path — R0 convention
const LAYER_DIR_MAP: Record<string, string> = {
  'types':    'R0',
  'config':   'R0',
  'domain':   'R1',
  'workflow': 'R2',
  'app':      'R2',
  'contract': 'R3',
  'exec':     'R4',
}

export function assessFileCompliance(
  content:  string,
  filePath: string
): { compliant: boolean; issues: string[] } {
  const issues: string[] = []
  const lines = content.split('\n')

  // (1) Line 1: // @liv-standard v{x.y}
  if (!lines[0] || !/^\/\/ @liv-standard v\d+\.\d+/.test(lines[0])) {
    issues.push('Line 1: missing or invalid @liv-standard stamp')
  }

  // (2) Line 2: // [F-{slice}/...] or // [{path}]
  if (!lines[1] || !/^\/\/ \[.+\]/.test(lines[1])) {
    issues.push('Line 2: missing or invalid location tag')
  }

  // (3) Line 3: // Built with LIV · livai.dev
  if (!lines[2] || !lines[2].includes('Built with LIV')) {
    issues.push('Line 3: missing built-with line')
  }

  // (4) @manifest block present with required fields
  const hasManifest = content.includes('// @manifest')
  if (!hasManifest) {
    issues.push('@manifest block missing')
  } else {
    const requiredFields = ['standard:', 'slice:', 'layer:']
    for (const field of requiredFields) {
      if (!content.includes(`// ${field}`) && !content.includes(`//   ${field}`)) {
        issues.push(`@manifest missing field: ${field}`)
      }
    }
  }

  // (5) Declared layer matches directory convention
  const pathParts  = filePath.split('/')
  const featureIdx = pathParts.findIndex(p => p.startsWith('F-'))
  if (featureIdx >= 0 && featureIdx + 1 < pathParts.length) {
    const dirName       = pathParts[featureIdx + 1]
    const expectedLayer = LAYER_DIR_MAP[dirName]

    if (expectedLayer && hasManifest) {
      const layerMatch = content.match(/\/\/\s*layer:\s*(R\d)/)
      if (layerMatch && layerMatch[1] !== expectedLayer) {
        issues.push(`Layer mismatch: manifest says ${layerMatch[1]}, directory '${dirName}' implies ${expectedLayer}`)
      }
    }
  }

  return { compliant: issues.length === 0, issues }
}

// ── buildReadSnapshot (phase-4.3) ────────────────────────────────────────────
// Assembles the structural snapshot from filesystem scan results and optional
// stored snapshot for diffing.
// Per-file diff status: untouched, modified-compliant, modified-non-compliant,
// new-foreign, deleted.
// Output groups files by slice. Each slice summary: name, file count, compliance.
// Pure — no I/O (A4).

export function buildReadSnapshot(
  files:          readonly { path: string; content: string; compliant: boolean; issues: string[] }[],
  storedSnapshot: readonly FileSnapshot[] | null
): ReadSnapshot {
  const storedMap = new Map<string, string>()
  if (storedSnapshot) {
    for (const f of storedSnapshot) {
      storedMap.set(f.path, f.content)
    }
  }

  const sliceMap = new Map<string, FileAssessment[]>()
  const foreignFiles: { path: string }[] = []
  let compliantCount = 0
  let driftedCount   = 0

  for (const file of files) {
    const sliceMatch = file.path.match(/src\/features\/(F-[^/]+)\//)
    const sliceName  = sliceMatch ? sliceMatch[1] : null

    const pathParts  = file.path.split('/')
    const featureIdx = pathParts.findIndex(p => p.startsWith('F-'))
    const dirName    = featureIdx >= 0 && featureIdx + 1 < pathParts.length ? pathParts[featureIdx + 1] : null
    const layer      = dirName ? (LAYER_DIR_MAP[dirName] ?? null) : null

    let diffStatus: FileDiffStatus
    if (!storedSnapshot) {
      diffStatus = file.compliant ? 'modified-compliant' : 'new-foreign'
    } else if (!storedMap.has(file.path)) {
      diffStatus = 'new-foreign'
    } else if (storedMap.get(file.path) === file.content) {
      diffStatus = 'untouched'
    } else {
      diffStatus = file.compliant ? 'modified-compliant' : 'modified-non-compliant'
      driftedCount++
    }

    if (file.compliant) compliantCount++

    if (!sliceName) {
      foreignFiles.push({ path: file.path })
      continue
    }

    const assessment: FileAssessment = {
      path:       file.path,
      content:    file.content,
      slice:      sliceName,
      layer,
      compliant:  file.compliant,
      issues:     file.issues,
      diffStatus,
    }

    const existing = sliceMap.get(sliceName) ?? []
    existing.push(assessment)
    sliceMap.set(sliceName, existing)
  }

  // Detect deleted files (in snapshot, not on disk)
  if (storedSnapshot) {
    const diskPaths = new Set(files.map(f => f.path))
    for (const stored of storedSnapshot) {
      if (!diskPaths.has(stored.path)) {
        const sliceMatch = stored.path.match(/src\/features\/(F-[^/]+)\//)
        if (sliceMatch) {
          const sliceName = sliceMatch[1]
          const existing = sliceMap.get(sliceName) ?? []
          existing.push({
            path:       stored.path,
            content:    '',
            slice:      sliceName,
            layer:      null,
            compliant:  false,
            issues:     ['File deleted from disk'],
            diffStatus: 'deleted',
          })
          sliceMap.set(sliceName, existing)
        }
      }
    }
  }

  const slices: SliceSummary[] = []
  for (const [name, assessments] of sliceMap) {
    slices.push({
      name,
      fileCount:  assessments.length,
      compliant:  assessments.every(a => a.compliant || a.diffStatus === 'deleted'),
      files:      assessments,
    })
  }

  slices.sort((a, b) => a.name.localeCompare(b.name))

  return {
    slices,
    foreignFiles,
    metadata: {
      scannedAt:      Date.now(),
      totalFiles:     files.length,
      compliantFiles: compliantCount,
      foreignFiles:   foreignFiles.length,
      driftedFiles:   driftedCount,
    },
  }
}
// ── deriveScopingConstraints (phase-4.4) ─────────────────────────────────────
// Pure function. Derives typed scoping constraints from ReadSnapshot.
// Per-slice logic determines skip/rebuild/delta action based on file diffStatus.
// Summary is a human-readable 1–3 sentence description for the prompt.
// Pure — no I/O (A4). Deterministic.

export function deriveScopingConstraints(
  snapshot: ReadSnapshot
): ScopingConstraints {
  // Edge case: empty snapshot
  if (snapshot.slices.length === 0 && snapshot.foreignFiles.length === 0) {
    return {
      directives:      [],
      foreignDetected: false,
      driftedSlices:   [],
      summary:         'No existing codebase. Full build.',
    }
  }

  const directives: BundleDirective[] = []
  const driftedSlices: string[] = []

  for (const slice of snapshot.slices) {
    // Slice with zero files (all deleted) → rebuild
    if (slice.files.length === 0) {
      directives.push({ name: slice.name, action: 'rebuild', reason: 'No files on disk (all deleted)' })
      driftedSlices.push(slice.name)
      continue
    }

    const statuses = slice.files.map(f => f.diffStatus)

    const hasNonCompliant = statuses.includes('modified-non-compliant')
    const hasDeleted      = statuses.includes('deleted')
    const hasNewForeign   = statuses.includes('new-foreign')
    const allUntouched    = statuses.every(s => s === 'untouched')
    const allNewForeign   = statuses.every(s => s === 'new-foreign')

    if (allUntouched) {
      directives.push({ name: slice.name, action: 'skip', reason: 'All files untouched and compliant' })
    } else if (hasNonCompliant || hasDeleted || allNewForeign) {
      const reasons: string[] = []
      if (hasNonCompliant) reasons.push('non-compliant modifications')
      if (hasDeleted)      reasons.push('deleted files')
      if (allNewForeign)   reasons.push('entire slice is foreign')
      directives.push({ name: slice.name, action: 'rebuild', reason: reasons.join(', ') })
      driftedSlices.push(slice.name)
    } else {
      // Remaining case: modifications are all compliant (no non-compliant, no deleted)
      directives.push({ name: slice.name, action: 'delta', reason: 'Modified files pass compliance' })
    }
  }

  const foreignDetected = snapshot.foreignFiles.length > 0

  // Build summary
  const skipCount    = directives.filter(d => d.action === 'skip').length
  const rebuildCount = directives.filter(d => d.action === 'rebuild').length
  const deltaCount   = directives.filter(d => d.action === 'delta').length

  const parts: string[] = [`${snapshot.slices.length} slices exist.`]
  if (skipCount > 0)    parts.push(`${skipCount} untouched (skip).`)
  if (rebuildCount > 0) parts.push(`${rebuildCount} drifted/non-compliant (rebuild).`)
  if (deltaCount > 0)   parts.push(`${deltaCount} modified-compliant (delta if needed).`)
  if (foreignDetected)  parts.push(`${snapshot.foreignFiles.length} foreign files detected.`)
  else                  parts.push('No foreign files.')

  return {
    directives,
    foreignDetected,
    driftedSlices,
    summary: parts.join(' '),
  }
}
