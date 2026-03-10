// [core/api/routes.ts]
// R5 — route map documentation only. Zero imports. Zero logic.
// All handlers live in their owning slice R3 contract.
// POST_laRun moved to F-la-config/contract/la-contract.ts (R3).
//
// ─── Route map ────────────────────────────────────────────────────────────────
//
// POST   /api/trpc/[trpc]            → core/api/trpc route (auto)
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
// GET    /api/projects/:id/constitution      → F-constitution: constitution-contract.ts
// POST   /api/projects/:id/constitution      → F-constitution: constitution-contract.ts
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
// GET    /api/topography/:projectId        → F-topography: topography-contract.ts
// GET    /api/topography/:projectId/stream → F-topography: topography-contract.ts (SSE)
//
// GET    /api/workspace/:projectId   → F-workspace: workspace-contract.ts
// PATCH  /api/workspace/:projectId   → F-workspace: workspace-contract.ts
//
// GET    /api/git/:projectId/status  → F-git-connector: git-contract.ts
// POST   /api/git/:projectId/connect → F-git-connector: git-contract.ts
//
// POST   /api/la/:projectId/run      → F-la-config: la-contract.ts (POST_laRun)
