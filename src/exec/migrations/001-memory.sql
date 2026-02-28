-- [F-memory/exec/migrations/001-memory.sql]
-- Idempotent — safe to run on every boot.
-- Owned by F-memory. Do not modify from other slices.

CREATE TABLE IF NOT EXISTS mem_concept_candidates (
  text        TEXT PRIMARY KEY,
  count       INTEGER NOT NULL DEFAULT 1,
  first_seen  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mem_concept_cooccurrences (
  token_a    TEXT NOT NULL,
  token_b    TEXT NOT NULL,
  count      INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (token_a, token_b)
  -- token_a < token_b always enforced at write (alphabetical ordering)
);

CREATE TABLE IF NOT EXISTS mem_concept_vocab (
  id          TEXT PRIMARY KEY,
  text        TEXT NOT NULL UNIQUE,
  embedding   JSONB NOT NULL,
  persistence REAL NOT NULL DEFAULT 0.1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mem_nodes (
  id          TEXT PRIMARY KEY,
  type        TEXT NOT NULL CHECK (type IN ('concept','episode')),
  persistence REAL NOT NULL DEFAULT 0.1,
  timestamp   BIGINT,
  concept_id  TEXT REFERENCES mem_concept_vocab(id)
);

CREATE TABLE IF NOT EXISTS mem_edges (
  from_id  TEXT NOT NULL REFERENCES mem_nodes(id),
  to_id    TEXT NOT NULL REFERENCES mem_nodes(id),
  weight   REAL NOT NULL DEFAULT 0.1,
  PRIMARY KEY (from_id, to_id)
);

CREATE INDEX IF NOT EXISTS idx_mem_edges_from ON mem_edges(from_id);
CREATE INDEX IF NOT EXISTS idx_mem_edges_to   ON mem_edges(to_id);
CREATE INDEX IF NOT EXISTS idx_mem_nodes_type ON mem_nodes(type);
