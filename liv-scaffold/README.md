# liv-scaffold

The extractable base every LIV-built app starts from.

Built to LIV-Standard v1.3. Every file in this scaffold is compliant, stamped, and zero-dependency on LIV-app-specific code.

---

## What's included

```
liv-scaffold/
  src/
    core/
      types/
        primitives.ts       R5 — Result<T>, AppError, generateId, Ref<Brand>
      db/
        client.ts           R5 — PostgreSQL pool (pg), env-driven, lazy init
    features/
      F-event-system/
        types/
          event-types.ts    R0 — BusEvent, EventHandler atoms
          event-schema.ts   R0 — EVENTS barrel (empty — add slices as built)
        domain/
          bus.ts            R1 — in-memory subscriber registry, pure dispatch
        contract/
          event-bus.ts      R3 — emitEvent, subscribeToEvent public surface
  migrations/
    run-migrations.ts       R4 — deploy-time migration runner, never runtime
  scripts/
    migrate.ts              entrypoint — npm run migrate
  package.json              all required deps pinned
  tsconfig.json             strict, LIV path aliases (@/core/*, @/features/*)
  next.config.ts            ignoreBuildErrors: false
```

---

## How to use

1. Copy `liv-scaffold/` contents to your new app root
2. Replace `{{APP_NAME}}` in `package.json` with your app name
3. Run `npm install`
4. Add your first migration SQL file to `migrations/` and register it in `run-migrations.ts`
5. Build your first slice in `src/features/F-{slice}/`

---

## Rules

- `core/` contains zero domain logic — only shared infrastructure
- `F-event-system/` is the only pre-wired slice — every app needs an event bus
- All other slices are added by IN-BUILD per the LIV-Procedure
- Never add domain types to `core/types/primitives.ts`
- `Result<T>` and `AppError` are declared once here — slices never redeclare them

---

LIV-Standard v1.3 · LIV-Procedure v1.3 · livai.dev
