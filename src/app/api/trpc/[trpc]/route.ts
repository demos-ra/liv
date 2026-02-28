// [F-integration/R3/C3] Next.js App Router handler for tRPC
// commit: forward resHeaders (Set-Cookie) from context into response

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/core/api/router'
import { createContext } from '@/features/F-identity/contract/trpc-context'

const handler = async (req: Request) => {
  // resHeaders accumulates Set-Cookie and other response headers
  // from procedures (e.g. setSessionCookie, clearSessionCookie)
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

  // Merge resHeaders into the response (Set-Cookie etc.)
  resHeaders.forEach((value, key) => {
    response.headers.append(key, value)
  })

  return response
}

export { handler as GET, handler as POST }
