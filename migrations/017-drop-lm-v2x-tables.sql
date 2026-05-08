-- 017-drop-lm-v2x-tables.sql
-- Sprint 9 Shot 3 — Drop LM v2.x tables
--
-- Drops Living Memory v2.x tables (mem_node, mem_edge, mem_arm, mem_dominance)
-- superseded by LM v3.1 substrate (state_change table, migration 016).
--
-- Pre-condition verified at Sprint 9 Shot 3: zero references to any of these
-- four table names exist in src/ at HEAD. Safe to drop.
--
-- Apply: sudo -u postgres psql -d liv -f migrations/017-drop-lm-v2x-tables.sql

DROP TABLE IF EXISTS mem_node CASCADE;
DROP TABLE IF EXISTS mem_edge CASCADE;
DROP TABLE IF EXISTS mem_arm CASCADE;
DROP TABLE IF EXISTS mem_dominance CASCADE;
