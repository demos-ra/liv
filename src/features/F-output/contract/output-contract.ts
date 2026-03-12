// @liv-standard v1.3
// [F-output/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-output
// layer:      R3
// wires-in:
//   W-ATOM    OutputJobId             ../types/output-types
//   W-ATOM    PushPayload             ../types/output-types
//   W-ATOM    OUTPUT_CONST            ../types/output-const
//   W-ATOM    validateSession         @/features/F-identity/contract/auth-contract
//   W-ATOM    SESSION_COOKIE_NAME     @/features/F-identity/contract/auth-contract
// wires-out:
//   W-HOOK    handleGetFiles          →  app/api/output/[jobId]/files/route.ts
//   W-HOOK    handleDownload          →  app/api/output/[jobId]/download/route.ts
//   W-HOOK    handlePush              →  app/api/output/[jobId]/push/route.ts
// deps:
//   R0  ../types/output-types
//   R0  ../types/output-const
//   R2  ../workflow/output-workflow
//   R3  ./output-inject
//   R3  @/features/F-identity/contract/auth-contract
// validated:  2026-03-12

import { NextRequest, NextResponse }           from 'next/server'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { getFiles, assembleZip, pushToRemote } from '../workflow/output-workflow'
import { createOutputDb, createGitPush }       from './output-inject'
import { OUTPUT_CONST }                        from '../types/output-const'
import type { OutputJobId, PushPayload }       from '../types/output-types'

// ── Shared session helper ─────────────────────────────────────────────────────

async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return validateSession(token)
}

// ── GET /api/output/[jobId]/files ─────────────────────────────────────────────
// Returns the OutputFiles[] as JSON for preview or inspection.
// Auth required. Pipeline must be complete.

export async function handleGetFiles(
  req:   NextRequest,
  jobId: string,
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const db     = createOutputDb()
  const result = await getFiles(db, jobId as OutputJobId)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND' ? 404
                 : result.error.code === 'PIPELINE_NOT_COMPLETE' ? 409
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

// ── GET /api/output/[jobId]/download ──────────────────────────────────────────
// Assembles the zip in memory and streams it as application/zip.
// GET — no body required. jobId from path param, auth from session cookie.
// Browser anchor download triggers GET natively.

export async function handleDownload(
  req:   NextRequest,
  jobId: string,
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const db     = createOutputDb()
  const result = await assembleZip(db, jobId as OutputJobId)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND' ? 404
                 : result.error.code === 'PIPELINE_NOT_COMPLETE' ? 409
                 : result.error.code === 'PAYLOAD_TOO_LARGE' ? 413
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  const filename = OUTPUT_CONST.ZIP_FILENAME_TPL(jobId)

  return new NextResponse(Buffer.from(result.data), {
    status:  200,
    headers: {
      'Content-Type':        'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length':      result.data.byteLength.toString(),
      'Cache-Control':       'no-store',
    },
  })
}

// ── POST /api/output/[jobId]/push ─────────────────────────────────────────────
// Pushes the assembled file tree to a git remote via HTTP API.
// Body: { remoteUrl, token, branch, message }
// Token is accepted, forwarded to R4, and never stored or logged.

export async function handlePush(
  req:   NextRequest,
  jobId: string,
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 }) }

  const { remoteUrl, token, branch, message } = body as Partial<PushPayload>

  if (!remoteUrl || !token || !branch || !message) {
    return NextResponse.json(
      { error: { code: 'MISSING_FIELDS', message: 'remoteUrl, token, branch, and message are required' } },
      { status: 400 }
    )
  }

  const payload: PushPayload = {
    jobId:     jobId as OutputJobId,
    remoteUrl,
    token,
    branch,
    message,
  }

  const db     = createOutputDb()
  const git    = createGitPush()
  const result = await pushToRemote(db, git, payload)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND'             ? 404
                 : result.error.code === 'PIPELINE_NOT_COMPLETE' ? 409
                 : result.error.code === 'INVALID_PUSH_PAYLOAD'  ? 400
                 : result.error.code === 'UNSUPPORTED_VENUE'     ? 422
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data }, { status: 200 })
}
