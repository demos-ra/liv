// [F-la-config/contract/execution-check.ts]
// R3 — exposes buildGridFromResults for cross-slice use.
// The LA validator CLI lives at F-la-config/exec/la-validator.ts
// and is run manually or in CI — never imported at boot time.

export { buildGridFromResults } from "../app/la-runner"
