-- 012-fix-embedding-dimension.sql
-- Fixes mem_node.embedding from vector(1536) to vector(768).
-- Ollama nomic-embed-text produces 768-dim vectors.
-- Original 010-living-memory-v1.sql created the column as vector(1536).
-- Safe: table confirmed empty in production (all prior INSERTs were rejected by dimension mismatch).
ALTER TABLE mem_node ALTER COLUMN embedding TYPE vector(768);
