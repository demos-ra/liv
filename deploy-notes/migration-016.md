# Sprint 8 — Migration 016 (substrate tables)

## Migration file

`migrations/016-substrate.sql` — creates the `state_change` table and 2 indices per LM v3.1 §3.11.

The migration file is part of the Shot 1 deliverable. Manager applies it manually before `npm run build` on the server.

## Apply command

```bash
sudo -u postgres psql -d liv -f /path/to/migrations/016-substrate.sql
```

## Schema created

Single table `state_change`. **Actual SQL** (matches `016-substrate.sql` verbatim):

```sql
CREATE TABLE IF NOT EXISTS state_change (
  id              TEXT        NOT NULL,                      -- StateChangeId, format 'sc_<uuid>'
  position        BIGINT      NOT NULL,                      -- Axis 1 monotonic, manually assigned by SW3 inside tx (LMA1, LMA10)
  time_ms         BIGINT      NOT NULL,                      -- write-time epoch ms (informational; LMA11 modality lives inside relations)
  source_channel  TEXT        NOT NULL,                      -- 'wearer'|'ai'|'cron'|'integration-event'|'internal-derivation'
  source_scope    TEXT        NOT NULL,                      -- open-vocabulary scope attribute (LMA6)
  identities      JSONB       NOT NULL,                      -- IdentityRef[] (≥1 per LMA3/LMA5)
  relations       JSONB       NOT NULL,                      -- Relation[] (may be empty; identitiesWithRoles + modality nest inside)

  CONSTRAINT state_change_pkey         PRIMARY KEY (position),
  CONSTRAINT state_change_id_unique    UNIQUE (id),
  CONSTRAINT state_change_identities_nonempty
    CHECK (jsonb_typeof(identities) = 'array' AND jsonb_array_length(identities) >= 1),
  CONSTRAINT state_change_relations_array
    CHECK (jsonb_typeof(relations) = 'array'),
  CONSTRAINT state_change_position_positive
    CHECK (position > 0)
);

CREATE INDEX IF NOT EXISTS state_change_identity_idx
  ON state_change USING GIN (identities jsonb_path_ops);

CREATE INDEX IF NOT EXISTS state_change_scope_idx
  ON state_change (source_scope, position);
```

### Notes on schema decisions (corrected)

- **No `content` column.** Domain payload lives inside `relations[]` JSONB per LM v3.1 §3.5 — content is a write-input wrapper, not a substrate column.
- **No `modality` column.** Modality is recorded per-relation inside `relations[].modality` per LMA11 (re-derived at execution).
- **No `revoke_target` column.** Revocation is in-band per §3.6: SW3 detects `revoke-Ref` literal in the input and deletes the target row directly. No FK column needed; `RevokeRef` is the literal sentinel value.
- **`position BIGINT` not `BIGSERIAL`.** SW3 manually assigns position via `SELECT MAX(position) + 1` inside the tx (per LMA10 — substrate-repository.ts `nextPosition()`). Manual assignment lets revocation create honest position gaps without renumbering.
- **`time_ms BIGINT` not `TIMESTAMPTZ`.** Code uses `Date.now()` and stores epoch ms; spec §3.5 SourceRef carries `time` as recorded metadata, semantically informational rather than canonical event-time (LMA11).
- **2 indices, not 3 + PK.** Two named indices (`state_change_identity_idx`, `state_change_scope_idx`) plus the primary key constraint. The `(identity, role)` composite from §3.11 is **not** authored at Shot 1 (Decision-D-6 carryover; tracked as audit-finding F-B for Sprint 9 cleanup).

## Tables that should still exist (not dropped by migration 016)

These are F-artifact's tables (relocated from F-memory at Shot 3b; underlying Postgres tables unchanged):

- `art_anchor`
- `art_companion`
- `art_content`
- `art_emission`
- `art_mode`
- `art_edge`

The artifact-store's `hydrateArtifactStore()` reads these on every server boot.

## Tables that should be dropped (LM v2.x — separate cleanup migration)

These tables held the dissolved F-memory legacy state and are no longer read by any code path post-Shot-3b. **They are NOT dropped by migration 016** — Sprint 8 src tar does not include the LM v2.x cleanup migration. Manager should drop them in a separate migration after deploy verification confirms substrate is stable:

- `mem_node`
- `mem_edge`
- `mem_arm`
- `mem_dominance`
- (any other `mem_*` tables present at HEAD baseline)

Recommended: schedule an LM v2.x cleanup migration (e.g. `018-drop-lm-v2.sql`) for next sprint after substrate is verified live. Hold the tables until then for rollback safety.

## Pre-deploy checklist

1. ✅ Migration 016 file present in deploy artifact
2. ✅ Apply migration: `sudo -u postgres psql -d liv -f migrations/016-substrate.sql`
3. ✅ Verify `state_change` table exists: `psql -d liv -c '\d state_change'` — expect 7 columns: `id, position, time_ms, source_channel, source_scope, identities, relations`
4. ✅ Verify the 2 indices + PK: `psql -d liv -c '\di state_change*'` — expect `state_change_pkey`, `state_change_identity_idx`, `state_change_scope_idx`
5. ✅ `npm run build` against composed tree (zero TypeScript errors expected) — including audit-patch F-A which adds the `SUBSTRATE_EVENTS` re-export to `substrate-contract.ts`
6. ✅ `pm2 restart liv --update-env`
7. ✅ Verify boot markers per `boot-sequence.md`
8. ⏳ (Defer) LM v2.x table drops to next sprint after stability window
9. ⏳ (Defer) F-B follow-up migration for `(identity, role) → positions` composite per §3.11 — author after deploy stability window
