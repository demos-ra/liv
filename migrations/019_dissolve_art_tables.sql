-- migration 019 — b1-final-shot-3
-- Dissolve art_* tables. Artifact payload now lives in substrate (state_change rows).
-- Run AFTER deploying b1-final-shot-3 overlay (art_* writes already stopped by new code).
-- Safe to run: DROP TABLE IF EXISTS is idempotent.

DROP TABLE IF EXISTS art_edge        CASCADE;
DROP TABLE IF EXISTS art_emission    CASCADE;
DROP TABLE IF EXISTS art_content     CASCADE;
DROP TABLE IF EXISTS art_companion   CASCADE;
DROP TABLE IF EXISTS art_mode_node   CASCADE;
DROP TABLE IF EXISTS art_anchor      CASCADE;

-- Verify dissolution
DO $$
DECLARE
  tbl TEXT;
  remaining TEXT[] := ARRAY['art_anchor','art_companion','art_content','art_mode_node','art_emission','art_edge'];
BEGIN
  FOREACH tbl IN ARRAY remaining LOOP
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = tbl) THEN
      RAISE EXCEPTION 'Dissolution incomplete: table % still exists', tbl;
    END IF;
  END LOOP;
  RAISE NOTICE 'art_* dissolution verified — all 6 tables dropped';
END $$;
