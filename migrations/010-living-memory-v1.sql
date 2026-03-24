-- 010-living-memory-v1.sql
-- Living Memory v1.0 migration from v0.6
-- LIV-Standard v1.3 · F-memory
--
-- This migration:
--   1. Creates new v1.0 tables (mem_node, mem_edge, mem_arm, mem_dominance)
--   2. Migrates data from v0.6 tables (mem_nodes, mem_edges)
--   3. Drops v0.6-only tables (mem_concept_candidates, mem_concept_vocab, mem_concept_cooccurrences)
--   4. Drops v0.6 tables after migration (mem_nodes, mem_edges)
--
-- Requires: pgvector extension for VECTOR(1536) type.
-- Run: sudo -u postgres psql -d liv -f migrations/010-living-memory-v1.sql

-- Enable pgvector if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- ─── 1. Create v1.0 tables ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mem_node (
  id              TEXT PRIMARY KEY,
  content         TEXT NOT NULL,
  embedding       VECTOR(1536),
  source_text     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_traversed  TIMESTAMPTZ,
  cached_layer    SMALLINT DEFAULT 4,
  cached_closure  REAL DEFAULT 0,
  cached_asymmetry REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mem_edge (
  from_id     TEXT NOT NULL REFERENCES mem_node(id) ON DELETE CASCADE,
  to_id       TEXT NOT NULL REFERENCES mem_node(id) ON DELETE CASCADE,
  weight      REAL NOT NULL DEFAULT 0,
  PRIMARY KEY (from_id, to_id)
);

CREATE TABLE IF NOT EXISTS mem_arm (
  id          TEXT PRIMARY KEY,
  label       TEXT,
  node_ids    TEXT[] NOT NULL,
  depth       SMALLINT NOT NULL DEFAULT 1,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mem_dominance (
  node_id     TEXT PRIMARY KEY REFERENCES mem_node(id) ON DELETE CASCADE,
  convergence REAL NOT NULL DEFAULT 0,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 2. Indexes ──────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_mem_edge_from ON mem_edge(from_id);
CREATE INDEX IF NOT EXISTS idx_mem_edge_to ON mem_edge(to_id);
CREATE INDEX IF NOT EXISTS idx_mem_node_layer ON mem_node(cached_layer);

-- Note: ivfflat index on embedding requires rows to exist first.
-- Created after data migration, or deferred to first traversal.
-- CREATE INDEX idx_mem_node_embedding ON mem_node USING ivfflat (embedding vector_cosine_ops);

-- ─── 3. Migrate data from v0.6 ───────────────────────────────────────────────
-- Only runs if v0.6 tables exist. Safe to re-run.

DO $$
BEGIN
  -- Migrate nodes: v0.6 mem_nodes → v1.0 mem_node
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mem_nodes') THEN
    INSERT INTO mem_node (id, content, created_at, cached_layer)
    SELECT
      id,
      id,  -- use id as content (v0.6 didn't have a content field)
      COALESCE(to_timestamp(timestamp::double precision / 1000), now()),
      4    -- all migrated nodes start at M4, will be recomputed on first traversal
    FROM mem_nodes
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Migrated nodes from mem_nodes to mem_node';
  END IF;

  -- Migrate edges: v0.6 mem_edges → v1.0 mem_edge
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mem_edges') THEN
    INSERT INTO mem_edge (from_id, to_id, weight)
    SELECT from_id, to_id, weight
    FROM mem_edges
    WHERE from_id IN (SELECT id FROM mem_node)
      AND to_id IN (SELECT id FROM mem_node)
    ON CONFLICT (from_id, to_id) DO NOTHING;

    RAISE NOTICE 'Migrated edges from mem_edges to mem_edge';
  END IF;

  -- Migrate embeddings from concept vocab if available
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mem_concept_vocab') THEN
    -- Try to update embeddings. The embedding column in vocab is jsonb,
    -- but mem_node.embedding is VECTOR(1536). Only migrate if dimensions match.
    -- This is a best-effort migration — embeddings will be recomputed on traversal.
    RAISE NOTICE 'Skipping embedding migration — v1.0 uses VECTOR(1536), will recompute on first traversal';
  END IF;
END
$$;

-- ─── 4. Drop v0.6-only tables ────────────────────────────────────────────────
-- These constructs are killed in v1.0 (§11):
--   mem_concept_candidates — extractConcepts() replaced by pure embedding projection
--   mem_concept_vocab — concept promotion replaced by binding
--   mem_concept_cooccurrences — PMI replaced by graph-relative thresholds

DROP TABLE IF EXISTS mem_concept_cooccurrences;
DROP TABLE IF EXISTS mem_concept_vocab;
DROP TABLE IF EXISTS mem_concept_candidates;

-- ─── 5. Drop v0.6 tables (after migration) ──────────────────────────────────
-- Only drop if data has been migrated to v1.0 tables.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mem_nodes')
     AND EXISTS (SELECT 1 FROM mem_node LIMIT 1) THEN
    DROP TABLE IF EXISTS mem_edges;
    DROP TABLE IF EXISTS mem_nodes;
    RAISE NOTICE 'Dropped v0.6 tables (mem_nodes, mem_edges) — data migrated to mem_node, mem_edge';
  ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mem_nodes') THEN
    -- v0.6 tables exist but no data migrated — drop anyway (empty graph)
    DROP TABLE IF EXISTS mem_edges;
    DROP TABLE IF EXISTS mem_nodes;
    RAISE NOTICE 'Dropped empty v0.6 tables';
  END IF;
END
$$;
