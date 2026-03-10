// @liv-standard v1.0
// [app/api/trpc/[trpc]/route.ts]
// Built with LIV · livai.dev
// R4 — Next.js App Router handler for tRPC.
// A4: I/O at R4 only. appRouter sourced from F-identity/contract/router (R3).
// Note: Response.headers is immutable — must reconstruct Response to write Set-Cookie.

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

  // Response.headers is immutable in the Web Fetch API.
  // Reconstruct the Response to merge in resHeaders (Set-Cookie, etc).
  const mergedHeaders = new Headers(response.headers)
  resHeaders.forEach((value, key) => {
    mergedHeaders.append(key, value)
  })

  return new Response(response.body, {
    status:  response.status,
    headers: mergedHeaders,
  })
}

export { handler as GET, handler as POST }
