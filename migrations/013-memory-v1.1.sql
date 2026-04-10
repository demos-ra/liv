-- 013-memory-v1.1.sql
-- Living Memory v1.1: edge primitive_type/created_at + scoped binding (user_id)
-- Amendments 1+3. Idempotent.

DO $$ BEGIN
  CREATE TYPE edge_primitive_type AS ENUM ('anchor','relate','restructure','reinforce','suppress');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE mem_edge ADD COLUMN IF NOT EXISTS primitive_type edge_primitive_type;
ALTER TABLE mem_edge ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE mem_edge ADD COLUMN IF NOT EXISTS user_id TEXT;

ALTER TABLE mem_node ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE mem_arm ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE mem_dominance ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Rekey edge uniqueness to include scope
ALTER TABLE mem_edge DROP CONSTRAINT IF EXISTS mem_edge_pkey;
ALTER TABLE mem_edge DROP CONSTRAINT IF EXISTS mem_edge_from_id_to_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS mem_edge_scope_uq ON mem_edge (from_id, to_id, COALESCE(user_id, '__global__'));

CREATE INDEX IF NOT EXISTS idx_mem_edge_created_at ON mem_edge (created_at);
CREATE INDEX IF NOT EXISTS idx_mem_node_user_id ON mem_node (user_id);
CREATE INDEX IF NOT EXISTS idx_mem_edge_user_id ON mem_edge (user_id);
CREATE INDEX IF NOT EXISTS idx_mem_arm_user_id ON mem_arm (user_id);
CREATE INDEX IF NOT EXISTS idx_mem_dominance_user_id ON mem_dominance (user_id);
