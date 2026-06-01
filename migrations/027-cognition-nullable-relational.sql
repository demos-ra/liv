-- 027-cognition-nullable-relational.sql
-- COIN foundation cleanup — decouple the cognition write from the legacy relational carriers.
-- Governing spec: COIN v1.0; LM-Standard v3.x. L0-confirmed dispatch.
--
-- ── ROOT ────────────────────────────────────────────────────────────────────
-- After 024/025 the cognition path carries content in `words`; `identities` and
-- `relations` are inert on cognition rows (written as `[]`, never read — the
-- foundation read is `WHERE words IS NOT NULL`, coin-read is words+marks only).
-- The ONLY thing forcing `writeRawTurn` to write the empty `[]` is the 016
-- `JSONB NOT NULL` COLUMN constraint on identities/relations. (025 already dropped
-- the *nonempty* CHECK; the NOT NULL on the columns themselves is 016 and remained.)
--
-- This migration removes that structural cause so the cognition write becomes pure
-- words. It does NOT migrate, rewrite, or drop the legacy relational subsystem —
-- the program writers, `compose-view`, the columns, and the identities GIN index
-- all stay, valid and separable, to be retired later on their own (per 025's note).
-- Modular decouple at source, not a compensating default.
--
-- ── FIX (three schema touches; app-side touch is writeRawTurn, separate) ──────
-- 1. Relax identities/relations to NULLABLE — cognition rows write NULL, not `[]`.
--    Legacy writers continue to write non-empty values; nullable is a strict
--    superset of their NOT-NULL writes, so no legacy row becomes invalid.
--
-- 2. Relax `state_change_relations_array` to permit NULL. The 016 form
--    (`jsonb_typeof(relations) = 'array'`) FAILS on NULL; once cognition rows
--    write NULL relations they would violate it. Guard with `relations IS NULL OR`.
--
-- 3. Re-arm `state_change_content_nonempty`. With identities now nullable, the
--    025 identities branch (`jsonb_typeof(identities)='array' AND length>=1`)
--    evaluates to NULL on a NULL identities, and Postgres PASSES a CHECK that is
--    NULL (it only fails on FALSE). An all-empty row (words NULL, identities NULL)
--    would therefore slip through. Guarding each branch with `... IS NOT NULL AND`
--    forces a NULL column to resolve the branch to FALSE, so the OR is FALSE and
--    the row is rejected. "No empty rows" is preserved under nullability.
--
--   VERIFIED EMPIRICALLY (Postgres 16, this dispatch) across all row-kinds:
--     cognition (words, identities NULL) ............ PASS
--     program   (words NULL, identities non-empty) .. PASS
--     boundary  (identities + relations populated) .. PASS
--     all-empty (words NULL, identities NULL) ....... REJECT
--     empty-array identities / empty-array words .... REJECT
--   The naive relax (without the re-armed guard) was shown to ACCEPT the all-empty
--   row — the hole this re-arm closes.
--
-- ── DEPLOY DISCIPLINE (real migration — touches live DB shape) ────────────────
-- Pre-migrate snapshot:   pg_dump -Fc -t state_change ... (command in dispatch note)
-- Rolled-back dry-run on the snapshot BEFORE apply (BEGIN; \i 027; ROLLBACK;).
-- Apply BEFORE build per the deploy sequence.
--
-- Idempotent: DROP NOT NULL is a no-op if already dropped; constraints dropped
-- IF EXISTS then re-added.
-- ─────────────────────────────────────────────────────────────────────────────

-- Touch 1 — relax the column NOT NULL (the structural cause of the inert `[]`).
ALTER TABLE state_change ALTER COLUMN identities DROP NOT NULL;
ALTER TABLE state_change ALTER COLUMN relations  DROP NOT NULL;

-- Touch 2 — relations array-type check must permit NULL (cognition rows write NULL).
ALTER TABLE state_change DROP CONSTRAINT IF EXISTS state_change_relations_array;
ALTER TABLE state_change
  ADD CONSTRAINT state_change_relations_array
    CHECK (relations IS NULL OR jsonb_typeof(relations) = 'array');

-- Touch 3 — re-arm the content invariant so a NULL branch resolves FALSE, not NULL.
-- A row is valid iff it carries content: non-empty words OR non-empty identities.
ALTER TABLE state_change DROP CONSTRAINT IF EXISTS state_change_content_nonempty;
ALTER TABLE state_change
  ADD CONSTRAINT state_change_content_nonempty
    CHECK (
      (
        words IS NOT NULL
        AND jsonb_typeof(words) = 'array'
        AND jsonb_array_length(words) >= 1
      )
      OR
      (
        identities IS NOT NULL
        AND jsonb_typeof(identities) = 'array'
        AND jsonb_array_length(identities) >= 1
      )
    );

-- End 027-cognition-nullable-relational.sql
