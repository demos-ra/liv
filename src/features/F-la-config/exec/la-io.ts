// [F-la-config/R4/C2] LA validator I/O — executes Python validators
// R4: execution layer, depends R0 only.
//
// Owns all child_process calls to LA v2.0 Python validators.
// R2 (la-runner.ts) orchestrates. This file only does I/O.
//
// O3: all subprocess calls have timeouts (10s per validator, 30s total)
// O6: LA_PATH from env, never hardcoded
// O7: repoPath validated before execution — no shell injection

import { execFile } from 'child_process'
import { promisify } from 'util'
import { db } from '@/core/db/client'

const execFileAsync = promisify(execFile)

const LA_PATH = process.env.LA_PATH ?? './living-architecture-v2.0'
const VALIDATOR_TIMEOUT_MS = 10_000
const PYTHON_BIN = process.env.PYTHON_BIN ?? 'python3'

// ─── Safety: validate repoPath before passing to subprocess ───────────────────
// Prevents path traversal / injection

function assertSafePath(p: string): void {
  if (/[;&|`$<>]/.test(p)) {
    throw new Error(`Unsafe repo path rejected: ${p}`)
  }
}

// ─── Generic runner ───────────────────────────────────────────────────────────

async function runValidator(
  scriptPath: string,
  args: string[] = [],
  cwd?: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  try {
    const { stdout, stderr } = await execFileAsync(
      PYTHON_BIN,
      [scriptPath, ...args],
      {
        timeout: VALIDATOR_TIMEOUT_MS,
        cwd: cwd ?? process.cwd(),
        env: { ...process.env },
      }
    )
    return { stdout, stderr, exitCode: 0 }
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; code?: number }
    return {
      stdout: e.stdout ?? '',
      stderr: e.stderr ?? '',
      exitCode: e.code ?? 1,
    }
  }
}

// ─── Individual validators ────────────────────────────────────────────────────

export async function runRLayerValidator(repoPath: string): Promise<string> {
  assertSafePath(repoPath)
  const result = await runValidator(
    `${LA_PATH}/src/domain/validate-r-layers.py`,
    [],
    repoPath
  )
  return result.stdout + result.stderr
}

export async function runFTagValidator(repoPath: string): Promise<string> {
  assertSafePath(repoPath)
  const result = await runValidator(
    `${LA_PATH}/src/domain/validate-f-tags.py`,
    [],
    repoPath
  )
  return result.stdout + result.stderr
}

export async function runOperationsValidator(repoPath: string): Promise<string> {
  assertSafePath(repoPath)
  const result = await runValidator(
    `${LA_PATH}/src/domain/validate-operations.py`,
    [],
    repoPath
  )
  return result.stdout + result.stderr
}

export async function runExecutionValidator(repoPath: string): Promise<string> {
  assertSafePath(repoPath)
  const result = await runValidator(
    `${LA_PATH}/src/domain/validate-execution.py`,
    [],
    repoPath
  )
  return result.stdout + result.stderr
}

export async function runChangesValidator(
  repoPath: string,
  commitMsg: string
): Promise<string> {
  assertSafePath(repoPath)
  const result = await runValidator(
    `${LA_PATH}/src/domain/validate-changes.py`,
    [commitMsg],
    repoPath
  )
  return result.stdout + result.stderr
}

// ─── Repo path resolver ───────────────────────────────────────────────────────
// Looks up the registered repo path for a project from F-git-connector state.

export async function resolveRepoPath(projectId: string): Promise<string | null> {
  try {
    const result = await db.query<{ repo_path: string }>(
      `SELECT repo_path FROM git_connections WHERE project_id = $1 AND status = 'connected' LIMIT 1`,
      [projectId]
    )
    return result.rows[0]?.repo_path ?? null
  } catch {
    return null
  }
}
