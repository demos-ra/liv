// @liv-standard v1.5.1 amended sprint-11-shot-6c
// [core/types/state-registry.ts]
// Built with LIV · livai.dev
// R5 — pure namespace declaration. Zero dependencies.
// Enforcement logic lives in F-la-config/domain/state-enforce.ts (R1).
// React hook lives in F-la-config/contract/registry-hook.tsx (R3).

import type { FSlice } from './primitives'

// Step 4: F-types, F-state-registry removed (absorbed into core/types/).
//         F-workspace reserved for Phase 2 (IDE surface).
// Step 3: F-executor added — Docker code execution. Count parity with FSlice maintained.
// Phase 4b: F-artifact + F-multi-instance added (AS v2.2 + M-I v2.3 runtimes).
// Sprint 8 Shot 2: F-router added — pure routing slice (no DB-backed state at Shot 2; namespace declared for FSlice parity).
// Sprint 8 Shot 3a: F-codec removed — dissolved entirely.
export const STATE_NAMESPACES: Record<FSlice, string> = {
  'F-executor':        'executor',      // Step 3
  'F-design-system':   'designSystem',
  'F-event-system':    'eventSystem',
  'F-la-config':       'laConfig',
  'F-identity':        'identity',
  'F-permissions':     'permissions',
  'F-git-connector':   'gitConnector',
  'F-terminal-bridge': 'terminalBridge',
  'F-project':         'project',
  'F-topography':      'topography',
  'F-ai-adapter':      'aiAdapter',
  'F-chat':            'chat',
  'F-constitution':    'constitution',
  'F-notifications':   'notifications',
  'F-commit-log':      'commitLog',
  'F-user-profile':    'userProfile',
  'F-dashboard':       'dashboard',
  'F-editor':          'editor',
  'F-health-panel':    'healthPanel',
  'F-execution-panel': 'executionPanel',
  'F-memory':          'memory',
  'F-planner':         'planner',          // Phase 4
  'F-intake':          'intake',           // Phase 5
  'F-output':          'output',           // Phase 6
  'F-artifact':        'artifact',         // Phase 4b — AS v2.2 runtime
  'F-multi-instance':  'multiInstance',    // Phase 4b — M-I v2.3 runtime
  'F-router':          'router',           // Sprint 8 Shot 2 — message routing infrastructure
  'F-plan':            'plan',             // Sprint 11 Shot 6c
  'F-discover':        'discover',          // Sprint 11 Shot 6c
  'F-verify':          'verify',            // Sprint 11 Shot 6c
  'F-builder':         'builder',           // Sprint 11 Shot 6c
}

export const NAMESPACE_OWNER: Record<string, FSlice> = Object.fromEntries(
  Object.entries(STATE_NAMESPACES).map(([slice, ns]) => [ns, slice as FSlice])
)

export function namespaceOf(slice: FSlice): string {
  return STATE_NAMESPACES[slice]
}

export function ownerOf(namespace: string): FSlice | undefined {
  return NAMESPACE_OWNER[namespace]
}
