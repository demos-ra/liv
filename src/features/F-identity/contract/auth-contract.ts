// [F-identity/contract/auth-contract.ts]
// R3 — server-side auth validation for cross-slice use.
// Other slices (F-chat, F-session, etc.) import from here.
// Delegates to R2 auth-workflow — never imports exec/ directly.

import { lookupSession } from '../app/auth-workflow'

export type { ValidatedSession } from '../app/auth-workflow'

export { lookupSession as validateSession }
