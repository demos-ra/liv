-- [src/exec/migrations/000-schema.sql]
-- Built with LIV · livai.dev
-- Consolidated DDL — all tables, idempotent (CREATE TABLE IF NOT EXISTS).
-- Owned by: core/exec/migrations
-- Run order: this file FIRST, then 001-memory.sql
-- Source of truth for all slice schemas.
-- Do NOT modify schema here without amending the owning slice R0.
-- See: G4 + G7 compliance.

-- ─── F-event-system ──────────────────────────────────────────────────────────
-- Source: src/features/F-event-system/exec/queue.ts → EVENT_QUEUE_SCHEMA

CREATE TABLE IF NOT EXISTS liv_events (
  id              TEXT        PRIMARY KEY,
  type            TEXT        NOT NULL CHECK (type IN ('immediate','scheduled','delayed','reactive')),
  slice           TEXT        NOT NULL,
  name            TEXT        NOT NULL,
  payload         JSONB       NOT NULL DEFAULT '{}',
  status          TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  scheduled_at    TIMESTAMPTZ,
  delay_ms        INTEGER,
  after_event_id  TEXT        REFERENCES liv_events(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at    TIMESTAMPTZ,
  error           TEXT
);

CREATE INDEX IF NOT EXISTS idx_liv_events_status    ON liv_events(status);
CREATE INDEX IF NOT EXISTS idx_liv_events_scheduled ON liv_events(scheduled_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_liv_events_slice     ON liv_events(slice);
CREATE INDEX IF NOT EXISTS idx_liv_events_name      ON liv_events(name);

-- ─── F-identity / auth ────────────────────────────────────────────────────────
-- Source: src/features/F-identity/exec/auth-db.ts → AUTH_SCHEMA_DDL

CREATE TABLE IF NOT EXISTS auth_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS auth_magic_link_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_magic_link_token_hash     ON auth_magic_link_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_magic_link_email_pending  ON auth_magic_link_tokens(email) WHERE used_at IS NULL;

CREATE TABLE IF NOT EXISTS auth_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_agent  TEXT,
  ip_address  TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON auth_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON auth_sessions(expires_at);

-- ─── F-identity / rate limits ─────────────────────────────────────────────────
-- Source: src/features/F-identity/exec/auth-queries.ts → RATE_LIMIT_SCHEMA_DDL

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_type   TEXT NOT NULL,  -- 'ip', 'email'
  identity_value  TEXT NOT NULL,
  action          TEXT NOT NULL,  -- 'magic-link-request', 'magic-link-verify'
  attempt_count   INTEGER NOT NULL DEFAULT 1,
  window_start    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limits_identity_action
  ON auth_rate_limits(identity_type, identity_value, action);

-- ─── F-user-profile ───────────────────────────────────────────────────────────
-- Source: src/features/F-user-profile/exec/user-profile-db.ts
-- A1: F-user-profile is sole owner of this table.
-- Note: github_login + avatar_url omitted — deferred to F-git-connector (A7).

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id           UUID        PRIMARY KEY REFERENCES auth_users(id) ON DELETE CASCADE,
  display_name      TEXT,
  email             TEXT,
  preferred_model_id TEXT       NOT NULL DEFAULT 'claude-sonnet-4-6',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── F-user-profile / api keys ────────────────────────────────────────────────
-- Source: src/features/F-user-profile/exec/api-key-db.ts
-- One row per (user_id, provider). AES-256-GCM encrypted at rest.
-- provider values must match PROVIDERS registry in provider-keys-config.ts (A6).

CREATE TABLE IF NOT EXISTS user_api_keys (
  user_id       UUID        NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  provider      TEXT        NOT NULL,  -- 'anthropic' | 'deepseek' — from PROVIDERS registry
  encrypted_key TEXT        NOT NULL,  -- AES-256-GCM: iv:authTag:ciphertext (base64, colon-separated)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_user_api_keys_user_id ON user_api_keys(user_id);

-- ─── F-permissions / projects ────────────────────────────────────────────────
-- Source: src/features/F-permissions/exec/permissions-db.ts
-- A1: F-permissions owns project_members. F-project (when built) will own projects.
-- projects table added here now so project_members FK resolves.

CREATE TABLE IF NOT EXISTS projects (
  project_id  TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        TEXT        NOT NULL,
  owner_id    UUID        NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);

CREATE TABLE IF NOT EXISTS project_members (
  user_id     UUID        NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  project_id  TEXT        NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  role        TEXT        NOT NULL DEFAULT 'member' CHECK (role IN ('owner','member','viewer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);

-- ─── F-project / builds ───────────────────────────────────────────────────────
-- A1: F-project owns builds table.
-- Build.status is the source of truth — Project.status is always derived (never stored).
-- Build.if_contract is immutable after freeze (enforced at application layer).

CREATE TABLE IF NOT EXISTS builds (
  build_id       TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id     TEXT        NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  user_id        UUID        NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  status         TEXT        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending','running','complete','failed','cancelled')),
  source         TEXT        NOT NULL DEFAULT 'CONTINUOUS'
                             CHECK (source IN ('CONTINUOUS','REENTRY')),
  if_contract    TEXT,                         -- serialised IF.01–IF.10 JSON, immutable after freeze
  drift_report   JSONB,                        -- populated on REENTRY path only
  base_build_id  TEXT        REFERENCES builds(build_id) ON DELETE SET NULL,
  started_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_builds_project_id  ON builds(project_id);
CREATE INDEX IF NOT EXISTS idx_builds_user_id     ON builds(user_id);
CREATE INDEX IF NOT EXISTS idx_builds_status      ON builds(status);

-- ─── F-chat ───────────────────────────────────────────────────────────────────
-- Source: src/features/F-chat/exec/chat-db.ts

CREATE TABLE IF NOT EXISTS chat_messages (
  message_id        TEXT        PRIMARY KEY,
  project_id        TEXT        NOT NULL,
  session_id        TEXT        NOT NULL,
  user_id           TEXT        NOT NULL,
  role              TEXT        NOT NULL CHECK (role IN ('user','assistant','system')),
  content           TEXT        NOT NULL DEFAULT '',
  status            TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','streaming','complete','error')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at      TIMESTAMPTZ,
  token_count       INTEGER,
  model_id          TEXT,
  parent_message_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
