// @liv-standard v1.5.1 amended sprint-11-shot-1
// [F-permissions/R0]
// Built with LIV · livai.dev
// [F-permissions/R0/C2] Permission configuration — roles, actions, resources
// R0: pure config, zero dependencies
// wires-out: ROLES, ACTIONS, Action, PERMISSION_MATRIX, PERMISSIONS_NAMESPACE
//   actions: project_create, project_read, project_update, project_delete,
//            constitution_read, constitution_write, constitution_confirm,
//            build_trigger, commit_confirm, git_connect, git_read,
//            terminal_connect, topography_read, la_run,
//            substrate_write, program_invoke_plan, program_invoke_discover,
//            program_invoke_verify, program_invoke_build

export const ROLES = {
  owner: 'owner',
  member: 'member',
  viewer: 'viewer',
} as const

export type Role = keyof typeof ROLES

export const ACTIONS = {
  // project
  project_create: 'project_create',
  project_read: 'project_read',
  project_update: 'project_update',
  project_delete: 'project_delete',
  // constitution
  constitution_read: 'constitution_read',
  constitution_write: 'constitution_write',
  constitution_confirm: 'constitution_confirm',
  // build
  build_trigger: 'build_trigger',
  commit_confirm: 'commit_confirm',
  // git
  git_connect: 'git_connect',
  git_read: 'git_read',
  // terminal
  terminal_connect: 'terminal_connect',
  // topography
  topography_read: 'topography_read',
  la_run: 'la_run',
  // substrate
  substrate_write: 'substrate_write',
  // program invoke
  program_invoke_plan: 'program_invoke_plan',
  program_invoke_discover: 'program_invoke_discover',
  program_invoke_verify: 'program_invoke_verify',
  program_invoke_build: 'program_invoke_build',
} as const

export type Action = keyof typeof ACTIONS

export const PERMISSION_MATRIX: Record<Role, Action[]> = {
  owner: Object.keys(ACTIONS) as Action[],
  member: [
    'project_read',
    'constitution_read',
    'constitution_write',
    'build_trigger',
    'commit_confirm',
    'git_read',
    'topography_read',
    'substrate_write',
    'program_invoke_plan',
    'program_invoke_discover',
    'program_invoke_verify',
    'program_invoke_build',
  ],
  viewer: [
    'project_read',
    'constitution_read',
    'topography_read',
    'git_read',
  ],
}

export const PERMISSIONS_NAMESPACE = 'permissions' as const
