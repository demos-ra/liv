-- 026-preferred-provider.sql
-- Provider is the stored fact; model is derived forward.
-- Governing: dispatch Chain B (provider-as-stored-fact). L0-confirmed.
--
-- ── ROOT ─────────────────────────────────────────────────────────────────────
-- The engine-selection path stored { provider, model } as jsonb in
-- model_preferences. model is a sub-value of provider (PROVIDER_DEFAULT_MODEL
-- maps provider→model); storing both creates drift: the stored model can
-- diverge from the provider's canonical model, and backward derivation
-- (providerForModel) re-introduces the same asymmetry from the other direction.
--
-- ── FIX ──────────────────────────────────────────────────────────────────────
-- Store only preferred_provider TEXT NULL. Model is derived forward from
-- provider via PROVIDER_DEFAULT_MODEL at the call site — never stored.
-- null = wearer has no saved preference; resolution falls back to key-aware
-- PROVIDER_ORDER walk at request time (resolveActiveProvider).
--
-- ── SCOPE ────────────────────────────────────────────────────────────────────
-- Additive: preferred_provider column added. model_preferences jsonb stays
-- (not dropped mid-flight — vestigial, slated for removal post-burn-in once
-- nothing reads it). preferred_model_id column (000-schema.sql:94) likewise
-- stays vestigial; code stops depending on its default.
--
-- ── DEPLOY PROCEDURE ─────────────────────────────────────────────────────────
-- Pre-migrate: pg_dump -Fc snapshot of user_profiles.
-- Dry-run: server rolled-back-transaction test (§1.43) before apply.
-- Apply: via run-migrations.ts (standard runner).
--
-- ── IDEMPOTENCY ──────────────────────────────────────────────────────────────
-- ADD COLUMN IF NOT EXISTS — safe to re-run.
-- No BEGIN/COMMIT — run-migrations.ts wraps apply-and-record in one transaction
-- (022/024/025 convention).
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS preferred_provider TEXT DEFAULT NULL;

-- End 026-preferred-provider.sql
