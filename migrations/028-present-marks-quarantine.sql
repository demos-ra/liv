-- 028-present-marks-quarantine.sql
-- COIN read-perimeter reconciliation — quarantine sink for present_marks rows that
-- FAIL the mark gate (isMark). Governing spec: COIN v1.0 (vocabulary + gate).
--
-- WHY: present_marks (023) carries pre-gate sediment written before isMark guarded
-- the write crossing (bare-number Refs; missing target/peers) — the rows the read
-- engine cannot survive (keyOf(target).who on a missing target throws → dead wake).
-- The read perimeter now SKIPS such rows at read time (present-mark-store-db.read),
-- but they remain in the table. This migration's companion reconciliation script
-- (scripts/reconcile-present-marks.ts) MOVES every failing row here so the live
-- store passes the gate end-to-end. The gate is the criterion — no hand-curated list.
--
-- This table is a FULL ROW COPY of present_marks (same columns, original seq
-- preserved as the key) plus the reconciliation provenance (reason + when). The
-- move is reversible: re-inserting a quarantined row into present_marks (same
-- columns) restores it byte-for-byte. The script owns snapshot/dry-run/manifest;
-- this file only provisions the sink.
--
-- DELIBERATELY PERMISSIVE: unlike present_marks (023), this table carries NO
-- home_who CHECK and NO jsonb-object CHECK on `mark`. It must accept exactly the
-- rows that failed validation — re-imposing the source constraints here could
-- reject the very sediment we are quarantining. Integrity lives at the live store;
-- the quarantine is a holding pen.
--
-- NOT user-downloadable (same proprietary boundary as present_marks / the v6.x
-- present_* tables, 021): exportByScope (F-memory) must not reach present_* tables.
--
-- Idempotent — CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS.
-- Pure statements: run-migrations.ts wraps apply-and-record in one transaction
-- (no BEGIN/COMMIT here, per the 022 F7 convention).

CREATE TABLE IF NOT EXISTS present_marks_quarantine (
  seq            BIGINT       PRIMARY KEY,   -- the ORIGINAL present_marks.seq (identity preserved for reversal)
  user_id        TEXT         NOT NULL,
  home_who       TEXT         NOT NULL,
  home_sc        BIGINT       NOT NULL,
  home_pos       BIGINT       NOT NULL,
  mark           JSONB        NOT NULL,      -- the failing payload, verbatim (no object-check)
  placed_at      TIMESTAMPTZ  NOT NULL,      -- carried from the source row (original placement time)
  reason         TEXT         NOT NULL,      -- why it failed the gate (e.g. 'gate-rejected', 'unparseable-jsonb')
  quarantined_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Per-wearer lookup (review / reversal scoping).
CREATE INDEX IF NOT EXISTS present_marks_quarantine_user_idx
  ON present_marks_quarantine (user_id, seq);

-- End 028-present-marks-quarantine.sql
