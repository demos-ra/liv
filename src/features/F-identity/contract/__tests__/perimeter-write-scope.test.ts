// @liv-standard v1.5.2
// [F-identity/R3]
// Built with LIV · livai.dev
// [F-identity/contract/__tests__/perimeter-write-scope.test.ts]
//
// Run: npx tsx --test src/features/F-identity/contract/__tests__/perimeter-write-scope.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  stampPerimeterHeaders,
  PERIMETER_HEADERS,
  PERIMETER_HEADER_USER_ID,
  PERIMETER_HEADER_SESSION_ID,
} from '@/core/constants/perimeter-headers'

// THE WRITE-PERIMETER HOLDS AGAINST A STRANGER (PA-I, Part 6). The route's write userId is
// read ONLY from the perimeter headers (never the body). So the one cross-scope vector is a
// forged inbound x-perimeter-user-id. The perimeter site strips every inbound perimeter
// header before stamping the authoritative (token-derived) values, so a forgery cannot survive.

test('a forged inbound x-perimeter-user-id is stripped — the authoritative userId wins', () => {
  const forged = new Headers({
    [PERIMETER_HEADER_USER_ID]: 'victim-wearer',          // a stranger forges the victim's id
    authorization: 'Bearer attacker-token',
  })
  const out = stampPerimeterHeaders(forged, {
    [PERIMETER_HEADER_USER_ID]:    'real-wearer',          // the site's token-derived id
    [PERIMETER_HEADER_SESSION_ID]: 'real-session',
  })
  assert.equal(out.get(PERIMETER_HEADER_USER_ID), 'real-wearer', 'forgery overridden — cannot cross scope')
  assert.equal(out.get(PERIMETER_HEADER_SESSION_ID), 'real-session')
  assert.equal(out.get('authorization'), 'Bearer attacker-token', 'non-perimeter headers pass through untouched')
})

test('a forged perimeter header with no authoritative replacement is removed, not leaked', () => {
  const forged = new Headers({ [PERIMETER_HEADER_USER_ID]: 'victim-wearer' })
  const out = stampPerimeterHeaders(forged, {})            // site stamps nothing
  // strip precedes set: absence is conservative — getPerimeterSession then returns null (no session).
  assert.equal(out.get(PERIMETER_HEADER_USER_ID), null, 'forged header removed, never leaked through')
})

test('PERIMETER_HEADERS covers every x-perimeter-* header (no gap a forgery slips through)', () => {
  for (const name of PERIMETER_HEADERS) assert.match(name, /^x-perimeter-/)
  assert.equal(new Set(PERIMETER_HEADERS).size, PERIMETER_HEADERS.length, 'no duplicates')
  assert.ok(PERIMETER_HEADERS.includes(PERIMETER_HEADER_USER_ID))
  assert.ok(PERIMETER_HEADERS.includes(PERIMETER_HEADER_SESSION_ID))
})
