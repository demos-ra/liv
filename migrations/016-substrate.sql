-- 016-substrate.sql
-- Sprint 8 Shot 1 — Living Memory v3.1 substrate
-- Canonical spec: src/core/standards/living-memory.md
--
-- Pure event-store substrate per LM v3.1:
--   Two axes: position (Axis 1, monotonic), identity threads (Axis 2, read-time geometry)
--   Single physical store; scope is an attribute (LMA6)
--   Forward-additive writes (LMA1); revocation as sole destructive exception (LMA2)
--   Atomic commit (LMA4) — guaranteed by single-row INSERT semantics
--
-- This migration is additive — old F-memory tables (mem_node, mem_edge, mem_arm,
-- mem_dominance) coexist with the new state_change table during Sprint 8 Shot 1.
-- Shot 3 dissolves the old F-memory tables in a separate migration.
--
-- Author at deploy: sudo -u postgres psql -d liv -f migrations/016-substrate.sql

BEGIN;

-- ────────────────────────────────────────────────────────────────────────────
-- state_change — the single substrate table.
--   id           — UUID-prefixed StateChangeId ('sc_' + uuid).
--   position     — monotonic integer; Axis 1 coordinate. Primary key.
--   time_ms      — write-time epoch ms (bigint). Past event-times live inside relation content.
--   source_channel — origin channel enum (extensible; 'wearer'|'ai'|'cron'|'integration-event'|'internal-derivation').
--   source_scope — open-vocabulary scope attribute. 'global', user_*, team_*, project_* etc.
--   identities   — JSONB array of IdentityRef strings (≥1 enforced at SW1).
--   relations    — JSONB array of Relation objects. May be empty (silent positions valid).
--
-- Position gaps are honest (LMA2): revocation deletes a row, position is not renumbered.
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS state_change (
  id              TEXT        NOT NULL,
  position        BIGINT      NOT NULL,
  time_ms         BIGINT      NOT NULL,
  source_channel  TEXT        NOT NULL,
  source_scope    TEXT        NOT NULL,
  identities      JSONB       NOT NULL,
  relations       JSONB       NOT NULL,

  CONSTRAINT state_change_pkey PRIMARY KEY (position),
  CONSTRAINT state_change_id_unique UNIQUE (id),

  -- LMA3: identities array must be non-empty. (Defense-in-depth; SW1 also validates.)
  CONSTRAINT state_change_identities_nonempty
    CHECK (jsonb_typeof(identities) = 'array' AND jsonb_array_length(identities) >= 1),

  -- relations must be a JSONB array (may be empty).
  CONSTRAINT state_change_relations_array
    CHECK (jsonb_typeof(relations) = 'array'),

  -- LMA10: position must be positive (Axis 1 monotonic from 1).
  CONSTRAINT state_change_position_positive
    CHECK (position > 0)
);

-- ────────────────────────────────────────────────────────────────────────────
-- Indices per LM v3.1 §3.11.
--   - position is the PK, supplies Axis 1 ordering, adjacency, iterate_axis.
--   - identities GIN supports identity-recurrence (TQ3 'identity-recurrence')
--     and the SQL-prefilter for role-pattern.
--   - source_scope index supports scope-filtered queries.
-- ────────────────────────────────────────────────────────────────────────────

-- GIN index on identities — supports `identities @> '["foo"]'::jsonb` queries.
CREATE INDEX IF NOT EXISTS state_change_identity_idx
  ON state_change USING GIN (identities jsonb_path_ops);

-- B-tree on (source_scope, position) — scope-filtered position-ordered scans.
CREATE INDEX IF NOT EXISTS state_change_scope_idx
  ON state_change (source_scope, position);

-- Note: LM v3.1 §3.11 also lists `(identity, role) → positions` as an optimization.
-- Not authored here — role filtering at TS level (substrate-repository.readRolePattern)
-- is acceptable at current scale. Composite index can be added in a future migration
-- if profiling shows it necessary. Decision-D-6: rationale recorded — see
-- DECISIONS-shot1.md.

COMMIT;

-- End 016-substrate.sql
