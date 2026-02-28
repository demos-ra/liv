// [F-integration/R3/C2] Next.js API route wiring
// R3: contract layer.
//
// This file documents (and in some cases provides) the route → handler mapping
// for every slice that exposes an API route. Each route file is a thin Next.js
// wrapper that re-exports the handler from the slice's R3 contract.
//
// Directory: app/api/
//
// ─── Route map ────────────────────────────────────────────────────────────────
//
// POST   /api/auth/magic-link        → F-identity: auth-routes.ts
// POST   /api/auth/verify            → F-identity: auth-routes.ts
// POST   /api/auth/sign-out          → F-identity: auth-routes.ts
// GET    /api/auth/me                → F-identity: auth-routes.ts
//
// GET    /api/session                → F-session: session-contract.ts
// DELETE /api/session                → F-session: session-contract.ts
//
// GET    /api/permissions/:projectId → F-permissions: permissions-contract.ts
//
// GET    /api/profile                → F-user-profile: user-profile-contract.ts
// PATCH  /api/profile                → F-user-profile: user-profile-contract.ts
//
// GET    /api/projects               → F-project: project-contract.ts
// POST   /api/projects               → F-project: project-contract.ts
// GET    /api/projects/:id           → F-project: project-contract.ts
// PATCH  /api/projects/:id           → F-project: project-contract.ts
//
// GET    /api/projects/:id/constitution  → F-constitution: constitution-contract.ts
// POST   /api/projects/:id/constitution  → F-constitution: constitution-contract.ts
// POST   /api/projects/:id/constitution/confirm → F-constitution: constitution-contract.ts
//
// GET    /api/chat/:projectId        → F-chat: chat-contract.ts
// POST   /api/chat/:projectId        → F-chat: chat-contract.ts
//
// GET    /api/notifications          → F-notifications: notifications-contract.ts
// DELETE /api/notifications/:id      → F-notifications: notifications-contract.ts
//
// GET    /api/commit-log/:projectId  → F-commit-log: commit-log-contract.ts
//
// GET    /api/topography/:projectId  → F-topography: topography-contract.ts
// GET    /api/topography/:projectId/stream → F-topography: topography-contract.ts (SSE)
//
// GET    /api/workspace/:projectId   → F-workspace: workspace-contract.ts
// PATCH  /api/workspace/:projectId   → F-workspace: workspace-contract.ts
//
// GET    /api/git/:projectId/status  → F-git-connector: git-contract.ts
// POST   /api/git/:projectId/connect → F-git-connector: git-contract.ts
//
// POST   /api/la/run                 → F-la-config: la-runner (manual trigger)
//
// ─── Example route file (Next.js app router) ──────────────────────────────────
//
// File: app/api/topography/[projectId]/route.ts
//
// import { GET_topography } from '@/features/F-topography/contract/topography-contract'
// export { GET_topography as GET }
//
// File: app/api/topography/[projectId]/stream/route.ts
//
// import { GET_stream } from '@/features/F-topography/contract/topography-contract'
// export { GET_stream as GET }
//
// All routes follow this same one-line re-export pattern.
// No logic lives in app/api/ files — all logic is in slice R3 contracts.

// ─── LA manual trigger route ──────────────────────────────────────────────────
// This is the one route implemented directly here because la-runner is
// F-integration / F-la-config owned, not a slice with its own R3 contract.

import { NextRequest, NextResponse } from 'next/server'
import { triggerValidation } from '@/features/F-la-config/app/la-runner'
import { resolveSession } from '@/features/F-session/app/session-workflow'
import { SESSION_CONFIG } from '@/features/F-session/config/session-config'
import { requirePermission } from '@/features/F-permissions/app/permissions-workflow'

export async function POST_laRun(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const token = req.cookies.get(SESSION_CONFIG.cookieName)?.value
  if (!token) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const session = await resolveSession(token)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  await requirePermission(session.userId, params.projectId, 'la_run')

  const result = await triggerValidation(params.projectId)
  return NextResponse.json(result)
}
