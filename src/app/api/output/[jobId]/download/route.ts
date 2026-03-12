// @liv-standard v1.3
// [app/api/output/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-output
// layer:      R3
// wires-in:
//   W-HOOK  handleDownload  ../../contract/output-contract
// wires-out:  none  (Next.js route — leaf node)
// deps:
//   R3  ../../contract/output-contract
// validated:  2026-03-12

// Next.js 16: params is a Promise — must await before use.
// GET — browser anchor download requires GET. No body. Auth from session cookie.
// Streams application/zip with Content-Disposition: attachment.

import { type NextRequest }   from 'next/server'
import { handleDownload }     from '@/features/F-output/contract/output-contract'

export async function GET(
  req:    NextRequest,
  ctx:    { params: Promise<{ jobId: string }> },
): Promise<Response> {
  const { jobId } = await ctx.params
  return handleDownload(req, jobId)
}
