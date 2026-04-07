// @liv-standard v1.3
// [F-executor/app/executor-io.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-executor
// layer:      R4
// wires-in:
//   W-ATOM  ExecutionJob     ../types/executor-types
//   W-ATOM  ExecutionResult  ../types/executor-types
//   W-ATOM  ExecutorResult   ../types/executor-types
//   W-ATOM  EXECUTOR_CONST   ../types/executor-types
//   W-FN    parseTestSummary ../domain/executor-logic
//   W-FN    truncateOutput   ../domain/executor-logic
// wires-out:  none  (R4 is never imported — injected via IExecutor at R3)
// deps:
//   R0  ../types/executor-types
//   R1  ../domain/executor-logic
//   R5  node:child_process, node:fs/promises, node:path, node:os, node:crypto
// validated:  2026-03-13
//
// Step 3 (A4): all Docker I/O lives here. No logic beyond orchestration and
// delegation to R1 parsers. Container lifecycle:
//   1. Write files to host tmp dir (mkdtemp)
//   2. docker run — mount tmp dir, enforce timeout, stream stdout/stderr
//   3. Capture streams, truncate, parse test summary
//   4. docker rm (cleanup — best effort, never throws)
//   5. Return typed ExecutionResult
//
// Timeout: enforced via AbortController + SIGKILL on the docker process.
// Cleanup: always runs in finally block — leaked containers are named
//          with CONTAINER_PREFIX so a VPS-level cron can sweep them.
//
// Axiom cite: A4 — I/O at R4 only. A2 — no R2/R3 imports.

import { spawn }         from 'node:child_process'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { join }          from 'node:path'
import { tmpdir }        from 'node:os'
import { randomUUID }    from 'node:crypto'
import {
  EXECUTOR_CONST,
  type ExecutionJob,
  type ExecutionResult,
  type ExecutorResult,
} from '../types/executor-types'
import {
  parseTestSummary,
  truncateOutput,
} from '../domain/executor-logic'

// ── ioRunExecution ─────────────────────────────────────────────────────────────
// Full Docker lifecycle for a single ExecutionJob.
// Never throws — all errors are captured into ExecutorResult.

export async function ioRunExecution(
  job: ExecutionJob,
): Promise<ExecutorResult<ExecutionResult>> {
  const containerName = `${EXECUTOR_CONST.CONTAINER_PREFIX}${job.jobId.slice(0, 8)}-${randomUUID().slice(0, 8)}`
  const hostTmpDir    = join(tmpdir(), containerName)
  const startedAt     = Date.now()

  // ── 1. Write files to host tmp dir ─────────────────────────────────────────
  try {
    await mkdir(hostTmpDir, { recursive: true })
    await Promise.all(
      job.files.map(async (file) => {
        const dest = join(hostTmpDir, file.path)
        // Ensure parent directories exist inside tmp
        await mkdir(join(dest, '..'), { recursive: true })
        await writeFile(dest, file.content, 'utf8')
      })
    )
  } catch (err) {
    await cleanup(hostTmpDir, containerName)
    return {
      ok: false,
      error: {
        code:    'FILE_WRITE_ERROR',
        message: err instanceof Error ? err.message : 'Failed to write execution files',
        context: { jobId: job.jobId },
      },
    }
  }

  // ── 2. Spawn docker run ────────────────────────────────────────────────────
  const timeoutMs  = job.timeoutMs ?? EXECUTOR_CONST.DEFAULT_TIMEOUT_MS
  const controller = new AbortController()
  const timer      = setTimeout(() => controller.abort(), timeoutMs)

  let stdoutBuf = ''
  let stderrBuf = ''
  let timedOut  = false
  let exitCode  = -1

  try {
    exitCode = await new Promise<number>((resolve, reject) => {
      const dockerArgs = [
        'run',
        '--rm',
        '--name',        containerName,
        '--volume',      `${hostTmpDir}:${EXECUTOR_CONST.WORK_DIR}`,
        '--workdir',     EXECUTOR_CONST.WORK_DIR,
        '--network',     'none',          // no outbound network — security boundary
        '--memory',      '512m',          // reasonable default; VPS has >=1GB
        '--cpus',        '1',
        '--user',        'node',          // non-root inside container
        '--read-only',                                       // #11: immutable root filesystem
        '--tmpfs',       '/tmp:rw,noexec,nosuid,size=64m',   // #11: npm needs /tmp for temp files
        '--env',         'HOME=/tmp',                        // #11: npm cache writes to $HOME/.npm — redirect to writable tmpfs
        EXECUTOR_CONST.DOCKER_IMAGE,
        'sh', '-c',
        'npm install --prefer-offline --no-audit --silent && npm test',
      ]

      const proc = spawn('docker', dockerArgs, {
        signal: controller.signal as AbortSignal,
      })

      proc.stdout.on('data', (chunk: Buffer) => {
        stdoutBuf += chunk.toString('utf8')
      })
      proc.stderr.on('data', (chunk: Buffer) => {
        stderrBuf += chunk.toString('utf8')
      })

      proc.on('close', (code) => {
        resolve(code ?? 1)
      })
      proc.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'ABORT_ERR') {
          timedOut = true
          resolve(137)   // SIGKILL exit code convention
        } else {
          reject(err)
        }
      })
    })
  } catch (err) {
    clearTimeout(timer)
    await cleanup(hostTmpDir, containerName)
    return {
      ok: false,
      error: {
        code:    'DOCKER_SPAWN_ERROR',
        message: err instanceof Error ? err.message : 'Docker process failed to start',
        context: { jobId: job.jobId, containerName },
      },
    }
  } finally {
    clearTimeout(timer)
  }

  // ── 3. Truncate + parse ────────────────────────────────────────────────────
  const stdout      = truncateOutput(stdoutBuf, EXECUTOR_CONST.MAX_OUTPUT_BYTES)
  const stderr      = truncateOutput(stderrBuf, EXECUTOR_CONST.MAX_OUTPUT_BYTES)
  const testSummary = parseTestSummary(stdout + '\n' + stderr)
  const durationMs  = Date.now() - startedAt

  // ── 4. Cleanup ────────────────────────────────────────────────────────────
  await cleanup(hostTmpDir, containerName)

  // ── 5. Return result ──────────────────────────────────────────────────────
  const result: ExecutionResult = {
    jobId:  job.jobId,
    exitCode,
    passed: exitCode === 0,
    stdout,
    stderr,
    testSummary,
    durationMs,
    timedOut,
  }

  return { ok: true, data: result }
}

// ── cleanup ────────────────────────────────────────────────────────────────────
// Best-effort: removes tmp dir and force-removes container if still running.
// Never throws — a leaked container is recoverable; a thrown cleanup error is not.

async function cleanup(hostTmpDir: string, containerName: string): Promise<void> {
  await Promise.allSettled([
    rm(hostTmpDir, { recursive: true, force: true }),
    runDockerRm(containerName),
  ])
}

function runDockerRm(containerName: string): Promise<void> {
  return new Promise((resolve) => {
    const proc = spawn('docker', ['rm', '-f', containerName], { stdio: 'ignore' })
    proc.on('close', () => resolve())
    proc.on('error', () => resolve())   // swallow — container may not exist
  })
}
