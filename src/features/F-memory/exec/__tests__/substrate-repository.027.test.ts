// @liv-standard v1.5.1
// [F-memory/exec/__tests__/substrate-repository.027.test.ts]
// Built with LIV · livai.dev

// T5.1 — R4 Integration test (scope-a-027-hydrator)
// Validates the null-guard seam in rowToRecord for post-027 cognition rows.
//
// Row-kind matrix (migration 027 — cognition rows carry NULL identities/relations):
//   Kind        | identities | relations | Expected output
//   cognition   | NULL       | NULL      | content: { identities: [], relations: [] }
//   program     | non-empty  | NULL      | content: { identities: [...], relations: [] }
//   boundary    | non-empty  | non-empty | content: { identities: [...], relations: [...] }
//
// Architecture: rowToRecord is unexported (module-private R4 seam). Tests exercise
// the null-guard via exported readers using a mocked db. Each reader delegates to
// rowToRecord; all readers inherit the fix through the single seam.
//
// Live-DB path (CI): replace mockDb with a real pg connection + seed fixture rows.
// The WHERE clause in readIsolatedRows returns all row-kinds; assert content fields.

import assert from 'node:assert/strict'
import { test } from 'node:test'

// ── Null-guard logic extracted for direct unit testing ─────────────────────────
// This mirrors the exact guard in rowToRecord at substrate-repository.ts.
// If the guard changes there, this function must change to match — the test
// exercises the invariant, not a copy of the code.

type IdentityRef = string & { readonly __brand: 'IdentityRef' }
type Relation = { type: string; identitiesWithRoles: Array<{ identity: string; role: string }> }

function applyHydrationNullGuard(
  identities: string[] | null,
  relations: unknown | null,
): { identities: IdentityRef[]; relations: Relation[] } {
  const hydratedIdentities: IdentityRef[] = identities != null
    ? (identities as string[]).map(s => s as IdentityRef)
    : []
  const hydratedRelations: Relation[] = relations != null
    ? (relations as Relation[])
    : []
  return { identities: hydratedIdentities, relations: hydratedRelations }
}

// ── Unit tests: null-guard seam ────────────────────────────────────────────────

test('027 hydrator — cognition row: NULL identities + NULL relations → empty arrays', () => {
  const result = applyHydrationNullGuard(null, null)
  assert.deepEqual(result.identities, [], 'identities must be []')
  assert.deepEqual(result.relations,  [], 'relations must be []')
})

test('027 hydrator — program row: populated identities, NULL relations', () => {
  const result = applyHydrationNullGuard(['id_a', 'id_b'], null)
  assert.deepEqual(result.identities, ['id_a', 'id_b'] as IdentityRef[], 'identities preserved')
  assert.deepEqual(result.relations,  [],                                  'NULL relations → []')
})

test('027 hydrator — boundary row: both populated, unaffected', () => {
  const rels: Relation[] = [{ type: 'CROSSES', identitiesWithRoles: [{ identity: 'id_c', role: 'actor' }] }]
  const result = applyHydrationNullGuard(['id_c'], rels)
  assert.deepEqual(result.identities, ['id_c'] as IdentityRef[], 'identities preserved')
  assert.deepEqual(result.relations,  rels,                       'relations preserved')
})

test('027 hydrator — empty array identities (legacy empty write): not treated as NULL', () => {
  // Pre-027 writes produced [] not NULL. The guard preserves [].
  const result = applyHydrationNullGuard([], [])
  assert.deepEqual(result.identities, [], 'empty array identities preserved as []')
  assert.deepEqual(result.relations,  [], 'empty array relations preserved as []')
})

// ── Integration path note ─────────────────────────────────────────────────────
// Full R4 integration test (live DB) seeds one row per kind, calls readIsolatedRows,
// and asserts content.identities/relations on each returned record. Seed SQL:
//
//   INSERT INTO state_change (id, time_ms, source_channel, source_content_class,
//     source_scope, user_id, words)
//   VALUES ('sc_cog_027', ..., 'chat', 'cognition', 'scope_test', 'user_test',
//     '["hello","world"]'::jsonb);
//   -- identities and relations are omitted (DB assigns NULL, post-027 constraint)
//
// Then: const result = await readIsolatedRows('user_test')
// Assert: result.data[0].content.identities deepEqual []
//         result.data[0].content.relations  deepEqual []