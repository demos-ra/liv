-- 023-present-marks.sql
-- COIN write-side — sprint-COIN-shot-3 — F-present per-wearer PlacedMark store.
-- Governing spec: frameworks/coin-spec.md (COIN v1.0).
--
-- The PRODUCTION backing for present-store.ts's PresentMarkStore contract
-- (place / read / clear). This is the disclosed infra seam: present-store.ts ships
-- only an in-memory Map reference impl; this table is its durable form. Contract
-- identical to the in-memory ref — keyed by user_id only (per-wearer isolation at
-- the row boundary; the in-memory ref keys Map<userId, PlacedMark[]>, no scopeRef).
--
-- A mark is a POINTER into substrate coordinates (home_who/home_sc/home_pos)
-- carrying one mark from the closed set (identity / RELATE / QUALIFY / IDENTIFY),
-- stored as jsonb. The store writes NOTHING to the substrate — it is the lens:
-- append-only place, per-wearer read, clear = wearer removes the lens. The
-- substrate is byte-unchanged whether the lens is on or off (coin-spec §0, §9).
--
-- NOT user-downloadable (same proprietary boundary as the v6.x present_* tables,
-- 021): F-present's contract publishes only `present.read`; exportByScope (F-memory)
-- reaches substrate state_change rows ONLY and must not reach present_* tables.
--
-- ── RECONCILIATION FLAG (Shot 4 integration — reconcile, do NOT assume) ───────
-- home_sc/home_pos are COIN's two-level Coord (turn sc, word pos within turn). The
-- substrate's Axis-1 coordinate (state_change.position, 016/022) is a SINGLE
-- monotonic BIGINT. These coordinate systems are NOT asserted equivalent here. The
-- mapping (and whether the Shot-4 RawTurn substrate carries sc/pos directly or
-- derives them from position) is a Shot 4 substrate-integration decision. Types are
-- BIGINT here to avoid foreclosing that reconciliation, not to assert alignment.
--
-- Idempotent — CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS.
-- Pure statements: run-migrations.ts wraps apply-and-record in one transaction
-- (no BEGIN/COMMIT here, per the 022 F7 convention).

CREATE TABLE IF NOT EXISTS present_marks (
  seq         BIGSERIAL    PRIMARY KEY,
  user_id     TEXT         NOT NULL,
  home_who    TEXT         NOT NULL,
  home_sc     BIGINT       NOT NULL,
  home_pos    BIGINT       NOT NULL,
  mark        JSONB        NOT NULL,
  placed_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT present_marks_home_who_chk CHECK (home_who IN ('wearer', 'llm', 'program')),
  CONSTRAINT present_marks_mark_object  CHECK (jsonb_typeof(mark) = 'object')
);

-- Per-wearer read in append order (seq). coin-read re-sorts each thing's stack by
-- (sc, pos) itself, so storage order is not load-bearing — the index serves the
-- WHERE user_id filter and a deterministic read order.
CREATE INDEX IF NOT EXISTS present_marks_user_idx
  ON present_marks (user_id, seq);

-- End 023-present-marks.sql
