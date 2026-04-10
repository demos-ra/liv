// @liv-standard v1.3
// [F-admin/contract/admin-contract.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-admin
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
