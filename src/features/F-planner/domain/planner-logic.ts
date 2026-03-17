// @liv-standard v1.3
// [F-planner/domain/planner-logic.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b4-handoff
// slice:      F-planner
// layer:      R1
// wires-in:
//   W-ATOM  PipelineStage         ../types/planner-types
//   W-ATOM  StageStatus           ../types/planner-types
//   W-ATOM  PlannerJob            ../types/planner-types
//   W-ATOM  IfContract            ../types/planner-types
//   W-ATOM  StageLogEntry         ../types/planner-types
//   W-ATOM  FileEntry             ../types/planner-types
//   W-ATOM  ParsedInstanceResponse ../types/planner-types
//   W-ATOM  PLANNER_CONST         ../types/planner-const
// wires-out:  none  (R1 logic consumed intra-slice by R2 only — A2)
// deps:
//   R0  ../types/planner-types
//   R0  ../types/planner-const
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

import type {
  PipelineStage,
  StageStatus,
  PlannerJob,
  IfContract,
  StageLogEntry,
  FileEntry,
  ParsedInstanceResponse,
} from '../types/planner-types'
import { PLANNER_CONST } from '../types/planner-const'

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

// ── IN-MAIN: prompt assembly (step4b2-phase-a, extended in step4b2-phase-c) ───
// reentryContext: optional — passed by R2 when job.reentryCount > 0.
// When present, prepends a failure context block so IN-MAIN knows the prior
// build failed and can ask the user what to change. Existing callers with no
// re-entry context omit the param and receive the same prompt as Phase A.

export function buildInMainPrompt(
  standardSlice:   string,
  profile:         InMainInstanceProfile,
  currentContract: Partial<IfContract>,
  reentryContext?: { failureReason: string; failedStage: string; reentryCount: number }
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

// ── Pipeline: instance prompt assembly (step4b2-phase-b) ─────────────────────
// Assembles the system prompt for any pipeline instance (IN-BUILD through IN-QA).
// R2 pre-fetches standardSlice, profile, packet via liv-api.ts and passes them.
// templates: IN-BUILD only — one TemplateLike per flow template to fill.
// existingFiles: passed to IN-RESOLVE, IN-AUDIT, IN-COMPILE, IN-QA as prior output.
// errorLog: passed to IN-COMPILE (fail path) and IN-QA for context.
// Pure — no I/O (A4).

export function buildInstancePrompt(params: {
  standardSlice:  string
  profile:        InMainInstanceProfile
  packet:         JobPacketLike
  templates?:     TemplateLike[]
  existingFiles?: FileEntry[]
  errorLog?:      string
}): string {
  const { standardSlice, profile, packet, templates, existingFiles, errorLog } = params

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
