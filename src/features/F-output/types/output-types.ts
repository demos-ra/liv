// @liv-standard v1.3
// [F-output/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-output
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  OutputFile          →  F-output/R1, F-output/R2, F-output/R3, F-output/R4
//   W-ATOM  OutputFiles         →  F-output/R1, F-output/R2, F-output/R3, F-output/R4
//   W-ATOM  OutputResult        →  F-output/R2, F-output/R3, F-output/R4
//   W-ATOM  PushPayload         →  F-output/R2, F-output/R3, F-output/R4
//   W-ATOM  OutputJobId         →  F-output/R2, F-output/R3, F-output/R4
//   W-ATOM  FilesPayload        →  F-output/R2, F-output/R3
//   W-ATOM  DownloadPayload     →  F-output/R2, F-output/R3
//   W-ATOM  GitHubSlug          →  F-output/R1, F-output/R2, F-output/R4
//   W-ATOM  GitLabSlug          →  F-output/R1, F-output/R2, F-output/R4
//   W-ATOM  GitVenue            →  F-output/R1, F-output/R2
// deps:       none
// validated:  2026-03-12

// ── AK-PRIM ───────────────────────────────────────────────────────────────────
// Branded string so jobId cannot be confused with a plain string at R3/R4.
export type OutputJobId = string & { _brand: 'OutputJobId' }

// ── AK-ENT — single file in the generated output tree ────────────────────────
export type OutputFile = {
  path:     string              // relative, e.g. "src/features/F-foo/types/foo-types.ts"
  content:  string              // full file content
  encoding: 'utf8' | 'base64'  // base64 for binary assets, utf8 for all source files
}

export type OutputFiles = OutputFile[]

// ── AK-RES — standard result wrapper used at every R4 boundary ───────────────
export type OutputResult<T> =
  | { ok: true;  data: T }
  | { ok: false; error: { code: string; message: string; context?: Record<string, unknown> } }

// ── AK-PAY — request payloads ─────────────────────────────────────────────────

// GET /api/output/[jobId]/files — no body, jobId from path
export type FilesPayload = {
  jobId: OutputJobId
}

// POST /api/output/[jobId]/download — no body, jobId from path
export type DownloadPayload = {
  jobId: OutputJobId
}

// POST /api/output/[jobId]/push
export type PushPayload = {
  jobId:     OutputJobId
  remoteUrl: string   // https://github.com/org/repo or git@github.com:org/repo
  token:     string   // PAT or deploy key — never persisted, used once and discarded
  branch:    string   // target branch, e.g. "main"
  message:   string   // commit message
}

// ── AK-ENT — push result summary ─────────────────────────────────────────────
export type PushResult = {
  remoteUrl:  string
  branch:     string
  commitSha:  string   // SHA returned from GitHub/GitLab API
  filesCount: number
}

// ── AK-ENT — git slug types ───────────────────────────────────────────────────
// Consumed at R1 (parsers) and R2 (venue dispatch) — must be at R0 (A6).

export type GitHubSlug = { owner: string; repo: string } | null
export type GitLabSlug = { encodedPath: string } | null

// ── AK-ENUM — git venue ───────────────────────────────────────────────────────
// Determines which HTTP API to use for the push. Declared at R0 (A6).
export type GitVenue = 'github' | 'gitlab' | 'generic'
