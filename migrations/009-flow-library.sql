-- 009-flow-library.sql
-- Flow Library table — stores proven IN-BUILD output as reusable patterns.
-- Per-bundle granularity. Global scope. Self-correcting via reuse_failure_count.
-- Idempotent: CREATE TABLE IF NOT EXISTS + CREATE INDEX IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS flow_library (
  id                    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id               TEXT          NOT NULL,
  standard_version      TEXT          NOT NULL,
  atom_shape_hash       TEXT          NOT NULL,
  wire_signature_hash   TEXT          NOT NULL,
  bundle_name           TEXT          NOT NULL,
  slot_values           JSONB         NOT NULL,
  output_files          JSONB         NOT NULL,
  source_build_id       TEXT          NOT NULL REFERENCES builds(build_id),
  reuse_failure_count   INTEGER       NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Unique index enforces one entry per structural fingerprint.
-- ON CONFLICT DO NOTHING at insert time — first write wins, no overwrites.
CREATE UNIQUE INDEX IF NOT EXISTS idx_flow_library_lookup
  ON flow_library (flow_id, standard_version, atom_shape_hash, wire_signature_hash);

-- Index for partial lookups (flow_id + standard_version, any hash).
CREATE INDEX IF NOT EXISTS idx_flow_library_partial
  ON flow_library (flow_id, standard_version, reuse_failure_count, created_at DESC);
