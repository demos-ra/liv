# F-identity Slice

**LIV Build Bible Phase 2 — Vertical Proof**

---

## Declaration

| Property | Value |
|---|---|
| Slice | F-identity |
| Phase | 2 — Vertical Proof |
| Layers | R0, R1, R2, R3, R4 |
| State Namespace | `auth` |
| Owner | F-identity exclusively |
| Auth Method | Passwordless magic link |

---

## What This Slice Owns

- User records (email, createdAt, lastLoginAt)
- Magic link tokens (hashed, single-use, 15-minute TTL)
- Session tokens (hashed, 30-day TTL, auto-refresh at <7 days)
- All 5 auth events on the T-axis

## What This Slice Does NOT Own

- User profile data (displayName, avatar, preferences) → F-user-profile
- Role and permission logic → F-permissions
- Session management UI beyond auth pages → F-session

---

## File Constitution

```
F-identity/
├── config/                     R0 — Declarations only
│   ├── auth-types.ts           All shared types: AuthUser, Session, MagicLinkToken, AuthState, AuthError
│   ├── auth-events.ts          5 event declarations + IEventBus interface + noop stub
│   └── auth-state.ts           Namespace declaration, initial state, selectors
│
├── domain/                     R1 — Pure logic, no I/O
│   ├── auth-validation.ts      Email validation, token validation, expiry checks
│   ├── auth-session.ts         TTL calculation, session payload builder, email content builder
│   └── auth-errors.ts          Structured error factory, named constructors, log shape
│
├── app/                        R2 — Orchestration, wires R1 + R4, emits events
│   └── auth-workflow.ts        requestMagicLink(), verifyMagicLink(), signOut(), validateAndRefreshSession()
│
├── contract/                   R3 — API boundary, pages, hooks. Never imports R4.
│   ├── auth-routes.ts          tRPC router: requestMagicLink, verifyMagicLink, signOut, me
│   ├── auth-hooks.ts           AuthProvider, useAuth(), 5 cross-slice selector hooks
│   ├── auth-pages.tsx          AuthPage (/auth/login), AuthVerifyPage (/auth/verify)
│   └── auth-middleware.ts      Next.js middleware: session guard, cookie management
│
├── exec/                       R4 — Postgres I/O, email I/O. Only imports R0.
│   ├── auth-db.ts              IAuthDb interface, IEmailService interface, createAuthDb()
│   └── auth-queries.ts         createEmailService(), checkRateLimit(), getDbConfig(), schema DDL
│
├── execution-check.ts          Structural validator — run to verify slice health
└── SLICE.md                    This file
```

---

## Events (T-Axis)

All events are `immediate` type. Declared at R0. Emitted from R2.

| Event | Trigger |
|---|---|
| `auth.user.registered` | New user upserted on first magic link request |
| `auth.user.authenticated` | Magic link verified, session created |
| `auth.user.signed-out` | Session deleted |
| `auth.token.refreshed` | Session auto-renewed (<7 days remaining) |
| `auth.user.failed` | Token invalid/expired/used, verification fails |

Phase 4: `noopEventBus` replaced by F-event-system's Postgres-backed bus.

---

## Phase 2 Proof Flows

### Register (new user)
```
POST /api/trpc/auth.requestMagicLink { email }
  → R3 rate check (email: 3/hr, IP: 10/hr)
  → R2 requestMagicLink()
    → R4 upsertUser() → new user created
    → R4 createMagicLinkToken() → hashed, 15min TTL
    → R4 sendMagicLink() → email sent
    → emit auth.user.registered
  → 200 { message: "Magic link sent." }
```

### Login (existing user)
```
POST /api/trpc/auth.requestMagicLink { email }
  → Same flow, upsertUser() returns existing user, isNew: false
  → No auth.user.registered event
  → 200 { message: "Magic link sent." }
```

### Verify → Authenticated
```
GET /auth/verify?token=<raw>&email=<email>
  → AuthVerifyPage mounts, calls verifyMagicLink(token, email)
  → POST /api/trpc/auth.verifyMagicLink
    → R3 rate check (IP: 5/15min)
    → R2 verifyMagicLink()
      → R4 findMagicLinkToken() — hash comparison
      → R1 validateTokenState() — expiry + used check
      → R4 markTokenUsed() — atomic, prevents replay
      → R4 createSession() — 30-day session
      → emit auth.user.authenticated
    → R3 sets httpOnly session cookie
  → Redirect /dashboard
```

### Sign Out
```
POST /api/trpc/auth.signOut (requires session cookie)
  → R2 signOut()
    → R4 deleteSession()
    → emit auth.user.signed-out
  → R3 clears session cookie
  → Redirect /auth/login
```

---

## O-Rule Compliance

| Rule | Implementation |
|---|---|
| O1 Access Control | Routes explicitly public or protectedProcedure. No auth logic in R4. |
| O2 Traffic Management | Rate limits in R3: 3/hr email, 10/hr IP (request), 5/15min IP (verify) |
| O3 Reliability | Email send: 10s timeout + AbortSignal. Session validation: 5s timeout. Postgres: statement timeout from env. |
| O4 Performance | No unbounded queries. All lookups by indexed columns (token_hash, email). |
| O5 Observability | Structured JSON logs at every R2 decision point. Errors are typed objects with code/message/context/timestamp. |
| O6 Configuration | DATABASE_URL, EMAIL_API_KEY, SESSION_COOKIE_NAME all from env. Startup throws if missing. |
| O7 Data Safety | Token invalidation preserves audit trail (soft-delete via used_at). Deletion via deleteSession() is explicit and logged. Schema versioned (1.0.0). |

---

## Phase 4 Integration Points

```typescript
// F-state-registry registers this slice's namespace
import { AUTH_NAMESPACE_DECLARATION } from 'F-identity/config/auth-state';
stateRegistry.registerNamespace(AUTH_NAMESPACE_DECLARATION);

// F-event-system replaces the noop bus
import { postgresEventBus } from 'F-event-system/contract';
const deps: AuthWorkflowDeps = {
  db: createAuthDb(sql),
  email: createEmailService(getEmailConfig()),
  eventBus: postgresEventBus, // replaces noopEventBus
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
};

// F-permissions subscribes to auth events
eventBus.subscribe(AUTH_EVENTS.USER_REGISTERED, assignDefaultRole);
```

---

## Commit Log

```
[F-identity/R0/C2] Declare auth types, events, state namespace
[F-identity/R1/C2] Add email validation, token validation, session logic, error factory
[F-identity/R2/C2] Add auth workflow: requestMagicLink, verifyMagicLink, signOut, validateSession
[F-identity/R3/C2] Add tRPC routes, React hooks, auth pages, middleware
[F-identity/R4/C2] Add Postgres implementation, email service, rate limiter, schema DDL
```
