-- 015-artifact-store.sql
-- LM v2.2 Shot 5 (lm-v2-2-shot5): Postgres backing for F-memory artifact substore.
-- Phase 9 closure of the Phase 5.5 placeholder (memory-artifact-store.ts:54-58).
--
-- AS v2.2 frozen — schema mirrors the AS atom shape verbatim. ArA4c chain key
-- (framework_id, user_id) lives on the emissions table for prior-anchor lookup.
--
-- D-A4-SCHEMA-SHAPE: per-kind tables (anchor / companion / content / mode /
-- emission / edge). Rejected single-table-polymorphic — would force payload
-- jsonb for every column-typed field and lose query-ability on
-- emissionId / anchorId / chain-key indices.
--
-- D-A4-MIGRATION-IDEMPOTENCE: every statement uses IF NOT EXISTS. Re-run safe.
--
-- Owned by F-memory. Do not modify from other slices.

-- ─── Anchor table — ArA1: present every emission ─────────────────────────────
CREATE TABLE IF NOT EXISTS art_anchor (
  id                TEXT PRIMARY KEY,
  framework_id      TEXT NOT NULL,
  framework_version TEXT NOT NULL,
  turn_id           TEXT NOT NULL,
  emission_id       TEXT NOT NULL UNIQUE,
  created_at        BIGINT NOT NULL
);

-- ─── Companion table — ArA2: 1:1 with anchor by emission_id ──────────────────
CREATE TABLE IF NOT EXISTS art_companion (
  id          TEXT PRIMARY KEY,
  emission_id TEXT NOT NULL UNIQUE REFERENCES art_anchor(emission_id) ON DELETE CASCADE,
  payload     JSONB NOT NULL,
  created_at  BIGINT NOT NULL
);

-- ─── Content table — ArA3: materialized children, cardinality ≥ 1 ────────────
CREATE TABLE IF NOT EXISTS art_content (
  id            TEXT PRIMARY KEY,
  emission_id   TEXT NOT NULL,
  content_value JSONB NOT NULL,
  created_at    BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_art_content_emission_id ON art_content (emission_id);

-- ─── Mode-node registry — MA5 / ArA4b ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS art_mode_node (
  id         TEXT PRIMARY KEY,
  primitive  TEXT NOT NULL UNIQUE,
  created_at BIGINT NOT NULL
);

-- ─── Emission registry — G-Ar8 uniqueness gate ───────────────────────────────
CREATE TABLE IF NOT EXISTS art_emission (
  emission_id        TEXT PRIMARY KEY,
  framework_id       TEXT NOT NULL,
  framework_version  TEXT NOT NULL,
  domain             TEXT NOT NULL,
  schema_ref         TEXT NOT NULL,
  user_id            TEXT NOT NULL,
  anchor_id          TEXT NOT NULL REFERENCES art_anchor(id) ON DELETE CASCADE,
  emission           JSONB NOT NULL,
  created_at         BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_art_emission_chain_key ON art_emission
  (framework_id, framework_version, domain, schema_ref, user_id);

-- ─── Edge log — ArA4 edges ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS art_edge (
  id          BIGSERIAL PRIMARY KEY,
  from_id     TEXT NOT NULL,
  to_id       TEXT NOT NULL,
  kind        TEXT NOT NULL,
  metadata    JSONB,
  created_at  BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_art_edge_from_id ON art_edge (from_id);
CREATE INDEX IF NOT EXISTS idx_art_edge_to_id   ON art_edge (to_id);
CREATE INDEX IF NOT EXISTS idx_art_edge_kind    ON art_edge (kind);
