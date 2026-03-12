// @liv-standard v1.3
// [F-output/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-output
// layer:      R4
// wires-in:
//   W-ATOM  OutputFile    ../types/output-types
//   W-ATOM  OutputFiles   ../types/output-types
//   W-ATOM  OutputResult  ../types/output-types
//   W-ATOM  PushResult    ../types/output-types
//   W-ATOM  OUTPUT_CONST  ../types/output-const
// wires-out:  none  (R4 is never imported — injected via IGitPush at R3)
// deps:
//   R0  ../types/output-types
//   R0  ../types/output-const
// validated:  2026-03-12

// A4: all HTTP I/O lives here. No business logic — pure API translation.
// Token is accepted as a param, used once, never stored, never logged.
// GitHub Blob/Tree/Commit API: no git binary required, venue-agnostic.

import type { OutputFiles, OutputResult, PushResult } from '../types/output-types'
import { OUTPUT_CONST }                               from '../types/output-const'

// ── GitHub API push ───────────────────────────────────────────────────────────
// Implements the 3-step GitHub API commit flow:
//   1. GET /repos/:owner/:repo/git/refs/heads/:branch  → base commit SHA
//   2. POST /repos/:owner/:repo/git/trees              → create tree of blobs
//   3. POST /repos/:owner/:repo/git/commits            → create commit
//   4. PATCH /repos/:owner/:repo/git/refs/heads/:branch → fast-forward ref

export async function ioPushToGitHub(
  slug:    { owner: string; repo: string },
  files:   OutputFiles,
  branch:  string,
  token:   string,
  message: string,
): Promise<OutputResult<PushResult>> {
  const base    = OUTPUT_CONST.GITHUB_API_BASE
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type':  'application/json',
    'Accept':        'application/vnd.github+json',
    'X-GitHub-API-Version': '2022-11-28',
  }

  try {
    // Step 1: get base commit SHA
    const refRes = await fetch(
      `${base}/repos/${slug.owner}/${slug.repo}/git/refs/heads/${branch}`,
      { headers }
    )
    if (!refRes.ok) {
      const body = await refRes.json().catch(() => ({}))
      return {
        ok: false,
        error: {
          code:    'GITHUB_REF_FETCH_FAILED',
          message: (body as { message?: string }).message ?? `GitHub API ${refRes.status}`,
          context: { status: refRes.status },
        },
      }
    }
    const refData  = await refRes.json() as { object: { sha: string }; ref: string }
    const baseSha  = refData.object.sha

    // Step 2: build tree entries — GitHub supports blob content directly in tree
    type TreeEntryContent = { path: string; mode: string; type: string; content?: string }
    type TreeEntrySha     = { path: string; mode: string; type: string; sha: string }
    type TreeEntry        = TreeEntryContent | TreeEntrySha

    const treeEntries: TreeEntry[] = files.map(f => ({
      path:    f.path,
      mode:    '100644',   // regular file
      type:    'blob',
      content: f.encoding === 'base64'
        ? undefined        // base64 files need separate blob create — handled below
        : f.content,
    }))

    // Create blobs for base64 files separately (binary assets)
    const base64Files = files.filter(f => f.encoding === 'base64')
    for (const f of base64Files) {
      const blobRes = await fetch(
        `${base}/repos/${slug.owner}/${slug.repo}/git/blobs`,
        {
          method:  'POST',
          headers,
          body:    JSON.stringify({ content: f.content, encoding: 'base64' }),
        }
      )
      if (!blobRes.ok) {
        const body = await blobRes.json().catch(() => ({}))
        return {
          ok: false,
          error: {
            code:    'GITHUB_BLOB_FAILED',
            message: (body as { message?: string }).message ?? `Blob create failed for ${f.path}`,
          },
        }
      }
      const blobData = await blobRes.json() as { sha: string }
      // Replace content entry with sha reference
      const idx = treeEntries.findIndex(e => e.path === f.path)
      if (idx >= 0) {
        treeEntries[idx] = { path: f.path, mode: '100644', type: 'blob', sha: blobData.sha }
      }
    }

    // Step 3: create tree
    const treeRes = await fetch(
      `${base}/repos/${slug.owner}/${slug.repo}/git/trees`,
      {
        method:  'POST',
        headers,
        body:    JSON.stringify({ base_tree: baseSha, tree: treeEntries }),
      }
    )
    if (!treeRes.ok) {
      const body = await treeRes.json().catch(() => ({}))
      return {
        ok: false,
        error: {
          code:    'GITHUB_TREE_FAILED',
          message: (body as { message?: string }).message ?? `Tree create failed`,
          context: { status: treeRes.status },
        },
      }
    }
    const treeData = await treeRes.json() as { sha: string }

    // Step 4: create commit
    const commitRes = await fetch(
      `${base}/repos/${slug.owner}/${slug.repo}/git/commits`,
      {
        method:  'POST',
        headers,
        body:    JSON.stringify({
          message,
          tree:    treeData.sha,
          parents: [baseSha],
        }),
      }
    )
    if (!commitRes.ok) {
      const body = await commitRes.json().catch(() => ({}))
      return {
        ok: false,
        error: {
          code:    'GITHUB_COMMIT_FAILED',
          message: (body as { message?: string }).message ?? `Commit create failed`,
          context: { status: commitRes.status },
        },
      }
    }
    const commitData = await commitRes.json() as { sha: string }

    // Step 5: update ref
    const updateRes = await fetch(
      `${base}/repos/${slug.owner}/${slug.repo}/git/refs/heads/${branch}`,
      {
        method:  'PATCH',
        headers,
        body:    JSON.stringify({ sha: commitData.sha, force: false }),
      }
    )
    if (!updateRes.ok) {
      const body = await updateRes.json().catch(() => ({}))
      return {
        ok: false,
        error: {
          code:    'GITHUB_REF_UPDATE_FAILED',
          message: (body as { message?: string }).message ?? `Ref update failed`,
          context: { status: updateRes.status },
        },
      }
    }

    return {
      ok:   true,
      data: {
        remoteUrl:  `https://github.com/${slug.owner}/${slug.repo}`,
        branch,
        commitSha:  commitData.sha,
        filesCount: files.length,
      },
    }
  } catch (e) {
    return {
      ok: false,
      error: {
        code:    'GITHUB_NETWORK_ERROR',
        message: e instanceof Error ? e.message : 'Network error during GitHub push',
      },
    }
  }
}

// ── GitLab API push ───────────────────────────────────────────────────────────
// GitLab Commits API: POST /projects/:id/repository/commits
// Supports multi-file commits in a single request — simpler than GitHub's 4-step flow.

export async function ioPushToGitLab(
  encodedPath: string,
  files:       OutputFiles,
  branch:      string,
  token:       string,
  message:     string,
): Promise<OutputResult<PushResult>> {
  const base    = OUTPUT_CONST.GITLAB_API_BASE
  const headers = {
    'PRIVATE-TOKEN': token,
    'Content-Type':  'application/json',
  }

  // GitLab commit actions — each file is a create_or_update action
  const actions = files.map(f => ({
    action:   'create',     // GitLab auto-upgrades to update if file exists
    file_path: f.path,
    content:   f.content,
    encoding:  f.encoding === 'base64' ? 'base64' : 'text',
  }))

  try {
    const res = await fetch(
      `${base}/projects/${encodedPath}/repository/commits`,
      {
        method:  'POST',
        headers,
        body:    JSON.stringify({
          branch,
          commit_message: message,
          actions,
          // GitLab: 'create' action fails if file exists; use 'create_or_update' pattern
          // GitLab API >= v4 supports force field per-action
        }),
      }
    )

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      // Handle "file already exists" by retrying with update action
      if (res.status === 400) {
        return await _gitLabRetryWithUpdate(encodedPath, files, branch, token, message, headers)
      }
      return {
        ok: false,
        error: {
          code:    'GITLAB_COMMIT_FAILED',
          message: (body as { message?: string }).message ?? `GitLab API ${res.status}`,
          context: { status: res.status },
        },
      }
    }

    const data = await res.json() as { id: string; short_id: string; web_url?: string }
    return {
      ok:   true,
      data: {
        remoteUrl:  `https://gitlab.com/${decodeURIComponent(encodedPath)}`,
        branch,
        commitSha:  data.id,
        filesCount: files.length,
      },
    }
  } catch (e) {
    return {
      ok: false,
      error: {
        code:    'GITLAB_NETWORK_ERROR',
        message: e instanceof Error ? e.message : 'Network error during GitLab push',
      },
    }
  }
}

// ── GitLab retry with update action ───────────────────────────────────────────
// If any files already exist, GitLab returns 400. Retry using 'update' for all.

async function _gitLabRetryWithUpdate(
  encodedPath: string,
  files:       OutputFiles,
  branch:      string,
  token:       string,
  message:     string,
  headers:     Record<string, string>,
): Promise<OutputResult<PushResult>> {
  const base    = OUTPUT_CONST.GITLAB_API_BASE
  const actions = files.map(f => ({
    action:    'update',
    file_path: f.path,
    content:   f.content,
    encoding:  f.encoding === 'base64' ? 'base64' : 'text',
  }))

  try {
    const res = await fetch(
      `${base}/projects/${encodedPath}/repository/commits`,
      {
        method:  'POST',
        headers,
        body:    JSON.stringify({ branch, commit_message: message, actions }),
      }
    )
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        ok: false,
        error: {
          code:    'GITLAB_COMMIT_FAILED',
          message: (body as { message?: string }).message ?? `GitLab API ${res.status} on retry`,
        },
      }
    }
    const data = await res.json() as { id: string }
    return {
      ok:   true,
      data: {
        remoteUrl:  `https://gitlab.com/${decodeURIComponent(encodedPath)}`,
        branch,
        commitSha:  data.id,
        filesCount: files.length,
      },
    }
  } catch (e) {
    return {
      ok: false,
      error: {
        code:    'GITLAB_NETWORK_ERROR',
        message: e instanceof Error ? e.message : 'Network error during GitLab retry',
      },
    }
  }
}
