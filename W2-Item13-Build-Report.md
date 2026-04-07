# W2 Item #13 — Error Boundaries — Build Report

LIV-Standard v1.3 · April 2026 · HEAD: post-W2

## Files Delivered

| File | Action | Sub-Item | Lines |
|------|--------|----------|-------|
| src/app/error.tsx | NEW | A | 108 |
| src/app/auth/error.tsx | NEW | A | 90 |
| F-chat/config/chat-config.ts | MODIFIED | B | 181 |
| F-chat/contract/chat-hook.ts | REWRITTEN | B | 175 |
| F-chat/contract/chat-ui.tsx | MODIFIED | B | 299 |
| F-planner/contract/planner-hook.ts | MODIFIED | C | 173 |

New: 2. Modified: 3. Rewritten: 1. Verified-as-is: see sub-items C/D/E below.

---

## Sub-Item A: React Error Boundaries — NEW

### src/app/error.tsx (root)
- Next.js error.tsx convention. `'use client'`. Catches unhandled React rendering errors app-wide.
- Zero external imports beyond React. Inline fallback styles match board.ts defaults (dark theme: #0e0e10 bg, SF Mono, overcast daylight palette).
- Renders: LIV brand, "Something went wrong.", "The error has been logged.", Try again button (calls `reset()`), Return to chat link (href="/").
- Logs structured JSON error to console for server-side capture.
- Axiom: A1 (core/app owns root boundary), A7 (self-contained, deletable).

### src/app/auth/error.tsx (auth)
- Auth-specific error boundary for /auth/* routes.
- Same zero-dependency constraints. Renders: LIV brand, "Unable to sign in. Please try again.", Try again button, Back to sign in link (href="/auth/login").
- Does NOT duplicate OAuth callback error handling (already in AuthPage via useSearchParams, deployed in #14).
- Axiom: A1, A7.

---

## Sub-Item B: Chat Streaming Errors — MODIFIED

### ChatError type (chat-config.ts)
Added at R0 (A6 — declare at origin):
```
ChatErrorCode = 'PROVIDER_UNREACHABLE' | 'STREAM_INTERRUPTED' | 'API_KEY_MISSING' | 'RATE_LIMITED' | 'NETWORK_UNREACHABLE'
ChatError = { code: ChatErrorCode, message: string }
```

### Error classification (chat-hook.ts)
Rewritten `useChatStream` with two classification paths:

| Error Path | Detection | ChatErrorCode | User Message |
|-----------|-----------|---------------|--------------|
| Network unreachable | fetch throws TypeError | NETWORK_UNREACHABLE | "Connection lost. Check your internet and try again." |
| LIV rate limited | HTTP 429 response (pre-stream) | RATE_LIMITED | "You're sending messages too quickly. Wait a moment." |
| API key missing | HTTP 401 or 403 (pre-stream) | API_KEY_MISSING | "No API key configured. Add one in Account settings." |
| Provider unreachable | Any other non-ok HTTP status | PROVIDER_UNREACHABLE | "Couldn't reach the AI provider. Try again or switch models." |
| SSE error event | `{ error: '...' }` in stream data | PROVIDER_UNREACHABLE | Server message or fallback |
| Stream interrupted | Reader throws mid-stream | STREAM_INTERRUPTED | "Couldn't reach the AI provider. Try again or switch models." |

### Partial stream failure
- `chunksReceived` flag tracks whether any content was delivered before error.
- If partial content exists: `onStreamError` callback appends "[Response interrupted. Try sending again.]" inline to the assistant message content.
- If no content delivered: sets `state.error` (rendered below messages as before).
- Partial content is never cleared.

### 429 disambiguation (confirmed by architect)
- LIV rate limit: HTTP 429 response with `{ error: { code: 'RATE_LIMITED' } }` — returned pre-stream.
- AI provider 429: caught server-side in chat-workflow.ts, sent as SSE `{ error: '...' }` event mid-stream.
- Two distinct code paths in the hook. No ambiguity.

### chat-ui.tsx changes
- `error` type changed from `string | null` to `ChatError | null`.
- Error div renders `{error.message}` instead of `{error}`.
- `handleStreamError` callback wired to `useChatStream` — appends inline indicator to assistant message, clears streaming flag.

---

## Sub-Item C: Pipeline Errors — VERIFIED + 1 FIX

### Verification results

| Condition | Expected UI | Status |
|-----------|-------------|--------|
| CLASS_1 (human error) | Actionable message | VERIFIED — planner-ui.tsx escalated state calls `buildFailureSummary(true)` which returns "Something went wrong on our end. We're looking into it." Non-escalated returns "This build couldn't be completed. Try describing it differently." No raw error strings reach the UI. |
| CLASS_3 (LIV error) | "Something went wrong on our end." | VERIFIED — `buildFailureSummary(true)` in planner-summary-logic.ts. Renders in escalated state block. |
| Build timeout | Clean UI state | VERIFIED — failsafe ceiling triggers escalated status. planner-hook.ts polling detects terminal status (`!isRunning()`) and stops polling. |
| Connection lost mid-build | UI reconnects on refresh | VERIFIED — planner-hook.ts loads initial job via `initialJobId` effect on mount. If user refreshes, the hook re-fetches job status. Polling resumes if job is still running. |

### Fix: polling interval .catch()

**Gap found:** The `setInterval` callback in the auto-poll effect called `fetchJob(job.jobId)` without `.catch()`. If the server returned a non-JSON 500, `res.json()` inside `fetchJob` would throw, producing an unhandled promise rejection.

**Fix applied:** Wrapped the polling callback:
```typescript
pollRef.current = setInterval(() => {
  fetchJob(job.jobId).catch(() => {
    setError({ code: 'NETWORK_ERROR', message: 'Lost connection to build server' })
    setStatus('error')
    stopPolling()
  })
}, POLL_INTERVAL_MS)
```

On catch: sets user-friendly error, stops polling. Pipeline continues server-side. On next mount/refresh, polling resumes.

---

## Sub-Item D: Network / Connection Errors — VERIFIED-AS-IS

| Condition | Behavior | Status |
|-----------|----------|--------|
| 401 from /api/ | Redirect to login | VERIFIED — auth-hooks.tsx `meQuery.refetch()` returns no data on 401 → state set to `unauthenticated` → page.tsx renders `<AuthPage />`. No silent swallowing. |
| 500 from /api/ | User-friendly message | VERIFIED — Chat: covered by sub-item B (classifyHttpError handles all non-ok statuses). Planner: fetchJob checks `data.ok` and sets `data.error` (which is `{ code, message }`). Polling .catch() now handles non-JSON 500s (sub-item C fix). |
| Network unreachable | Each hook shows own error | VERIFIED — Chat: TypeError → NETWORK_UNREACHABLE. Planner: `.catch()` blocks on startPipeline, advanceStage, failStage, freezeContract, refresh all set `{ code: 'NETWORK_ERROR', message: '...' }`. Auth: tRPC catch sets unauthenticated. |
| Global connection indicator | Deferred | CONFIRMED — each hook handles its own. Cross-slice banner adds complexity for marginal gain. Deferred to Wave 5 if needed. |

No modifications needed. All paths covered.

---

## Sub-Item E: Memory Boot Failure — VERIFIED-AS-IS

| Condition | Behavior | Status |
|-----------|----------|--------|
| Boot load failure | Empty graph, app continues | VERIFIED — `onBoot()`: if `loadGraph()` fails, logs `memory.boot.load-failed`, sets `_booted = true` with empty graph, returns. Non-fatal. |
| Embedding service down during traversal | Returns empty, no throw | VERIFIED — `runTraversal()` Step 1: if `encode()` fails, logs `memory.traversal.encode-failed`, returns `{ ok: true, data: null }`. Graceful. |
| Persist failure during traversal | Logs, continues | VERIFIED — `commitAndUpdate()`: if `persistMutations()` fails, logs error, returns. In-memory graph already updated. DB catches up on next successful persist. |
| Persist failure in background dominance | Logs, returns | VERIFIED — `recomputeDominance()`: if `persistDominance()` fails, logs error, returns early. In-memory dominance map already updated. |
| getPresentState() on empty graph | Returns empty statements | VERIFIED — `computePresentState()` on empty graph returns `{ statements: [] }`. No throw. |

No modifications needed. All paths are robustly handled.

---

## Compliance Checklist

- [x] Every new/modified file stamped (lines 1–3)
- [x] Every change cites axiom
- [x] @manifest on new files (error.tsx × 2, chat-hook.ts)
- [x] @manifest updated on modified files (chat-config.ts, chat-ui.tsx, planner-hook.ts)
- [x] ChatError declared at R0 (A6)
- [x] ChatError crosses hook→UI boundary as typed atom (A3)
- [x] No cross-slice imports added
- [x] No new slices created
- [x] error.tsx files: 'use client', zero external deps, inline fallback styles
- [x] Result<T> not retrofitted (Wave 6 scope)
- [x] CC.16: no inline SVG in new files (error.tsx uses text only)

---

LIV · livai.dev · 45.76.29.179 · demos-ra/liv · HEAD: post-W2
