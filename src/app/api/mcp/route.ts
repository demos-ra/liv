// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector)
// [app/R4]
// Built with LIV · livai.dev
// [src/app/api/mcp/route.ts]
//
// MCP transport door. JSON-RPC POST handler at /api/mcp, sibling to /api/present.
// Auto-discovered by Next; registered nowhere. Reached THROUGH proxy.ts (the
// route is not in PUBLIC_PREFIXES and is covered by the middleware matcher), so a
// bearer-token request is validated by lookupSession and stamped 'external-agent'
// before it arrives. This route wires nothing in proxy.ts — it inherits the ring.
//
// Thin (R4 discipline, J2): consult the perimeter, 401 if absent, hand the
// JSON-RPC body + session to the F-mcp R3 contract, return its result. No
// protocol logic, no contract logic here. A JSON-RPC notification yields no
// response body (202).

import { type NextRequest, NextResponse } from 'next/server'
import { getPerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'
import { handleMcpRequest } from '@/features/F-mcp/contract/mcp-contract'
import { JSONRPC_VERSION, JSONRPC_UNAUTHENTICATED } from '@/features/F-mcp/config/mcp-protocol'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = getPerimeterSession(req)
  if (!session) {
    return NextResponse.json(
      { jsonrpc: JSONRPC_VERSION, id: null, error: { code: JSONRPC_UNAUTHENTICATED, message: 'unauthenticated' } },
      { status: 401 },
    )
  }

  const body = await req.json().catch(() => null)
  const result = await handleMcpRequest(body, session)
  if (result === null) {
    return new NextResponse(null, { status: 202 })
  }
  return NextResponse.json(result)
}
