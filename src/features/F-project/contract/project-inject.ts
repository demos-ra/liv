// @liv-standard v1.3
// [F-project/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R3
// wires-in:
//   W-INJECT  IProjectDb  ../workflow/project-workflow  (interface defined at R2)
//   W-ATOM    (all R4 db functions)  ../exec/project-db
// wires-out:
//   W-INJECT  createProjectDb  →  F-project/R3 callers (project-contract.ts, project-hook.ts)
// deps:
//   R2  ../workflow/project-workflow  (type import only — IProjectDb)
//   R4  ../exec/project-db
// validated:  2026-03-12

// W-INJECT binding — R3 is the only layer that may import both R2 (type) and R4 (impl).
// A2: R2 declares interface. R4 provides raw functions. R3 assembles the concrete binding.
// R4 never imports R2. R2 never imports R4. R3 bridges them here.

import type { IProjectDb } from '../workflow/project-workflow'
import {
  dbGetProject,
  dbListProjectsForUser,
  dbCreateProject,
  dbUpdateProject,
  dbDeleteProject,
  dbGetBuild,
  dbGetLatestBuildForProject,
  dbListBuildsForProject,
  dbCreateBuild,
  dbUpdateBuildStatus,
} from '../exec/project-db'

export function createProjectDb(): IProjectDb {
  return {
    getProject:               (id)                     => dbGetProject(id),
    listProjectsForUser:      (userId)                 => dbListProjectsForUser(userId),
    createProject:            (id, name, owner, desc)  => dbCreateProject(id, name, owner, desc),
    updateProject:            (id, delta)              => dbUpdateProject(id, delta),
    deleteProject:            (id)                     => dbDeleteProject(id),
    getBuild:                 (id)                     => dbGetBuild(id),
    getLatestBuildForProject: (projectId)              => dbGetLatestBuildForProject(projectId),
    listBuildsForProject:     (projectId)              => dbListBuildsForProject(projectId),
    createBuild:              (id, pid, uid, src, base) => dbCreateBuild(id, pid, uid, src, base),
    updateBuildStatus:        (id, status, at)         => dbUpdateBuildStatus(id, status, at),
  }
}
