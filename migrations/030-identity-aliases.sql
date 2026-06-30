-- 030-identity-aliases.sql
-- Reconcile (alias-trust pass) — the append-only alias join. DORMANT this migration:
-- the table is created; nothing reads or writes it yet (the live verifiers — Google OAuth,
-- magic-link — resolve by email and mint NO alias). Its first writer is appendAlias (R4); its
-- first reader is aliasPrincipalSet (R4), folded at read by aliasesOf → scopeClause's
-- user_id = ANY($ids). Both land dormant in Part 1; their consumer is the later activation
-- increment (first non-email verifier / Wave-4 forum reconcile).
--
-- L0 reconciliation shape (append-only / resolved-at-read): a principal (a forum-over-MCP id,
-- or a later federated signup) is LINKED to a canonical principal by APPENDING a row — nothing
-- in auth_users is rewritten, no prior row orphaned. The read folds user_id = ANY(principal-set)
-- at read; THIS TABLE SUPPLIES THE SET. It is data for the seam, never a read-authority itself.
--
-- THE WALL (a stranger's write never yields a read) — structural, in the constraints:
--   * alias_user_id and canonical_user_id are BOTH auth_users rows (the fold matches
--     state_change.user_id, which is an auth_users id).
--   * UNIQUE(alias_user_id): a principal folds to EXACTLY ONE canonical. A second claim on an
--     already-linked principal is rejected by the constraint — two canonicals can never reach
--     one principal (which would be a cross-principal read leak).
--   * CHECK(alias_user_id <> canonical_user_id): no self-alias.
--   * FLAT STAR (no chaining): canonical_user_id is always a ROOT. appendAlias resolves the
--     incoming canonical to its own root before insert (the union-find find()), so the set is
--     never deeper than one level; aliasPrincipalSet never walks a chain.
--   * APPEND-ONLY: there is no UPDATE path. appendAlias INSERTs; re-appending the same proven
--     link is ON CONFLICT(alias_user_id) DO NOTHING (a no-op, never a provenance rewrite).
--     Once written, a link's provenance is immutable.
--
-- source_channel / verified_provenance record WHICH in-call proof authorized the link (the
-- verifier adapter's verified result) — provenance for audit, never an authority input at read.
--
-- STAY disposition (this pass): email remains the canonical key (proof-gated at resolve); this
-- table links NON-email channels to an email-keyed canonical. Swap to LOOSEN touches the resolve
-- rule only — this table's shape does not change.
--
-- Idempotent — CREATE TABLE / CREATE INDEX IF NOT EXISTS, named-constraint inline.
-- Pure statements: the runner wraps apply-and-record in ONE transaction (029 / F7 convention) —
-- no BEGIN/COMMIT here.

CREATE TABLE IF NOT EXISTS auth_user_aliases (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_user_id   UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  alias_user_id       UUID NOT NULL UNIQUE REFERENCES auth_users(id) ON DELETE CASCADE,
  source_channel      TEXT NOT NULL,
  verified_provenance TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT auth_user_aliases_no_self CHECK (alias_user_id <> canonical_user_id)
);

-- Resolve read support: gather a root's linked alias principals (aliasPrincipalSet's second arm).
-- alias_user_id already carries a unique index via UNIQUE (the find() lookup).
CREATE INDEX IF NOT EXISTS idx_auth_user_aliases_canonical
  ON auth_user_aliases (canonical_user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- ROLLBACK PROCEDURE (execute manually if needed; not run by this script)
-- ────────────────────────────────────────────────────────────────────────────
-- DROP INDEX IF EXISTS idx_auth_user_aliases_canonical;
-- DROP TABLE IF EXISTS auth_user_aliases;

-- End 030-identity-aliases.sql
