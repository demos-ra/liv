// @liv-standard v1.5.2
// [F-admin/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-b2-unified-close (category retagged Modality → Tool per Manual v13.3 reclassification — F-admin is an L0-tier operational utility, not a wearer-facing Modality channel); sprint-b2-unified-close-fix-round (LIV-Standard pin sweep → v1.5.2 per cascade discipline)
// slice:      F-admin
// category:   Tool
// layer:      R3
// wires-in:
//   W-FN  dbGetUserEmail  ←  F-admin/R4 (exec/admin-db)
// wires-out:
//   W-FN  dbGetUserEmail  →  app/R4 routes
// deps:
//   R4  ../exec/admin-db
// validated:  pending

// Re-export dbGetUserEmail through R3 contract boundary.
// A3: external consumers import from here, not exec/.

export { dbGetUserEmail } from '../exec/admin-db'
