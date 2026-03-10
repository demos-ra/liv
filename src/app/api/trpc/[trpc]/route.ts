// [app/api/trpc/[trpc]/route.ts]
// R3 — Next.js App Router handler for tRPC.
// appRouter sourced from F-identity/contract/router.ts (R3 assembler).

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/features/F-identity/contract/router'
import { createContext } from '@/features/F-identity/contract/trpc-context'

const handler = async (req: Request) => {
  const resHeaders = new Headers()

  const response = await fetchRequestHandler({
    endpoint:      '/api/trpc',
    req,
    router:        appRouter,
    createContext: (opts) => createContext({ ...opts, resHeaders }),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(JSON.stringify({
              level: 'error',
              event: 'trpc.error',
              path,
              message: error.message,
              code: error.code,
              timestamp: new Date().toISOString(),
            }))
          }
        : undefined,
  })

  resHeaders.forEach((value, key) => {
    response.headers.append(key, value)
  })

  return response
}

export { handler as GET, handler as POST }
