-- [src/exec/migrations/000-schema.sql]
-- Consolidated DDL — all tables, idempotent (CREATE TABLE IF NOT EXISTS).
-- Owned by: core/exec/migrations
-- Run order: this file FIRST, then 001-memory.sql
-- Source of truth for: F-event-system, F-identity (auth + rate limits)
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
