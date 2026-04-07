// @liv-standard v1.3
// [app/R4]
// Built with LIV · livai.dev
// [core/instrumentation.ts]
// Next.js server instrumentation hook — runs once on server worker start.
// Do NOT put initialization in layout.tsx (runs per request).

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { bootstrap } = await import('@/features/F-event-system/app/startup')
    await bootstrap()
  }
}
