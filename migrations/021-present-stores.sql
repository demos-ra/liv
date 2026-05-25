-- 021-present-stores.sql
-- Sprint Item-1 — Shot 1b — F-present per-user store backing
-- Canonical spec: frameworks/standards/present-standard.md (v6.0 §2.1 line 341)
--
-- F-present v6.0 has four own stores (Present Standard v6.0 §2.1 — "three
-- F-present stores, one substrate"; the held-present tier groups three). v6.0
-- specified them as F-present's own per-user stores in the LIV database; the
-- shipped v6.0 implemented them as in-process Maps. This migration creates the
-- durable per-user backing. The substrate (state_change, 016) is NOT touched —
-- F-present is a non-emitter ([R1]); it never writes the substrate.
--
-- One table per store. Each persisted store declared in present-config.ts
-- (PRESENT_STORE_POLICY) gets a table; a store declared non-persisted would
-- get none. All four are persisted this sprint (basis per store: present-
-- config.ts).
--
-- Keyed (user_id, scope_ref) — present state is per-wearer-and-scope (v6.0
-- §2.1: the held PresentFrame is keyed (userId, scopeRef); the archive is
-- per-user, §16.7). JSONB payload columns carry the contract-fixed v6.0 shapes
-- verbatim (PresentFrame / GranularityDial / SnapshotArchiveEntry / Window).
--
-- PROPRIETARY-BOUNDARY NOTE. These four tables are F-present-owned. F-present
-- is proprietary on-top service; present data is per-user but NOT user-
-- downloadable. The boundary is structural-by-absence: a store is exportable
-- only when its owning slice's contract publishes an export surface, and
-- F-present's contract publishes only `present.read`. No export routine
-- enumerates these tables. `exportByScope` (F-memory) exports substrate
-- state_change rows only — it does not and must not reach present_* tables.
--
-- Idempotent — CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS. Safe to
-- re-run on every deploy. Peer: 015-artifact-store.sql, 016-substrate.sql.
--
-- Author at deploy: sudo -u postgres psql -d liv -f migrations/021-present-stores.sql

BEGIN;

-- ────────────────────────────────────────────────────────────────────────────
-- present_held — store (2a): the held live present.
--   One live PresentFrame per (user_id, scope_ref). Last-write-wins: a new
--   resolution supersedes the prior (PrG7 held-present discipline). frame is
--   the PresentFrame JSON whole.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS present_held (
  user_id     TEXT        NOT NULL,
  scope_ref   TEXT        NOT NULL,
  frame       JSONB       NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT present_held_pkey PRIMARY KEY (user_id, scope_ref),
  CONSTRAINT present_held_frame_object
    CHECK (jsonb_typeof(frame) = 'object')
);

-- ────────────────────────────────────────────────────────────────────────────
-- present_dial — store (2b): the lens (granularity dial).
--   One GranularityDial per (user_id, scope_ref). A persistent stored position
--   (v6.0 §2.1 lines 316-319). dial is the GranularityDial JSON whole.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS present_dial (
  user_id     TEXT        NOT NULL,
  scope_ref   TEXT        NOT NULL,
  dial        JSONB       NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT present_dial_pkey PRIMARY KEY (user_id, scope_ref),
  CONSTRAINT present_dial_object
    CHECK (jsonb_typeof(dial) = 'object')
);

-- ────────────────────────────────────────────────────────────────────────────
-- present_window — store (2c): the accumulating Window set.
--   Windows ACCUMULATE — they do not replace ([R12]). One row per Window;
--   the set for a (user_id, scope_ref) is every row, ordered by opened_at.
--   window_id is the per-window unique key; window is the Window JSON whole.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS present_window (
  window_id   TEXT        NOT NULL,
  user_id     TEXT        NOT NULL,
  scope_ref   TEXT        NOT NULL,
  window      JSONB       NOT NULL,
  opened_at   BIGINT      NOT NULL,    -- Window.openedAt (epoch ms) — orders the look-trail
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT present_window_pkey PRIMARY KEY (window_id),
  CONSTRAINT present_window_object
    CHECK (jsonb_typeof(window) = 'object')
);

-- Look-trail read: every window for a (user_id, scope_ref), opened-order.
CREATE INDEX IF NOT EXISTS present_window_set_idx
  ON present_window (user_id, scope_ref, opened_at);

-- ────────────────────────────────────────────────────────────────────────────
-- present_archive — store (3): the per-user present archive.
--   Every resolved present, archived whole as a SnapshotArchiveEntry, keyed
--   (user_id, scope_ref, position) — the scrub-back lookup key ([R16]).
--   Played in position order, the archive is the movie. entry is the
--   SnapshotArchiveEntry JSON whole.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS present_archive (
  user_id     TEXT        NOT NULL,
  scope_ref   TEXT        NOT NULL,
  position    BIGINT      NOT NULL,    -- SnapshotArchiveKey.position — substrate append-index
  entry       JSONB       NOT NULL,
  archived_at BIGINT      NOT NULL,    -- SnapshotArchiveEntry.archivedAt (epoch ms)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT present_archive_pkey PRIMARY KEY (user_id, scope_ref, position),
  CONSTRAINT present_archive_entry_object
    CHECK (jsonb_typeof(entry) = 'object')
);

-- Movie playback / position listing: the archived positions for a
-- (user_id, scope_ref), ascending.
CREATE INDEX IF NOT EXISTS present_archive_movie_idx
  ON present_archive (user_id, scope_ref, position);

COMMIT;

-- End 021-present-stores.sql
