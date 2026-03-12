// @liv-standard v1.3
// [app/api/output/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-output
// layer:      R3
// wires-in:
//   W-HOOK  handleGetFiles  ../../contract/output-contract
// wires-out:  none  (Next.js route — leaf node)
// deps:
//   R3  ../../contract/output-contract
// validated:  2026-03-12

// Next.js 16: params is a Promise — must await before use.
// Contract handler receives plain string — async unwrap at route boundary only.

import { type NextRequest }   from 'next/server'
import { handleGetFiles }     from '@/features/F-output/contract/output-contract'

export async function GET(
  req:    NextRequest,
  ctx:    { params: Promise<{ jobId: string }> },
): Promise<Response> {
  const { jobId } = await ctx.params
  return handleGetFiles(req, jobId)
}
