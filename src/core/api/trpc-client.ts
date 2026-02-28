// [core/api/trpc-client.ts]
// R5 — tRPC React client singleton.
// 'use client' — browser only.

'use client'

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from './router'

export const trpc = createTRPCReact<AppRouter>()

// Alias — F-identity/contract/auth-hooks imports { api }
export const api = trpc
