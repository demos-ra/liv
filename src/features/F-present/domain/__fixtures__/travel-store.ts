// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/__fixtures__/travel-store.ts]
//
// The travel-store gate fixture. Test artifact ONLY; external to the runtime
// path, never imported by src runtime (strict-functional rule). Gates M1-M4 read
// it. Words live in the substrate (transcript); marks live in F-present's store
// and point at coords. Tuned for the every-touch M3 (v1.2): each mark deposits one
// ping on its resolved thing, so the tree is balanced by total touches —
//   japan (root) -> { kyoto -> ryokan(leaf, long stack), tokyo, q3 }
// plus two added cases:
//   bangkok — one thing reached by two spellings ("Bangkok" + the pronoun "there",
//             IDENTIFY-welded). Out-weighs osaka though "osaka" appears more often.
//   dentist — touched ONLY by QUALIFY (no RELATE): carries weight, parent = null.

import type { Transcript } from '@/core/types/substrate-raw.types'
import type { PresentStore } from '@/features/F-present/config/mark-types'

export const transcript: Transcript = [
  // main tree
  { sc: 0,  who: 'wearer', words: [{ pos: 0, word: 'Japan' }, { pos: 1, word: 'beautiful' }] },
  { sc: 1,  who: 'llm',    words: [{ pos: 0, word: 'Tokyo' }, { pos: 1, word: 'flew' }] },
  { sc: 2,  who: 'wearer', words: [{ pos: 0, word: 'Kyoto' }, { pos: 1, word: 'toured' }] },
  { sc: 3,  who: 'llm',    words: [{ pos: 0, word: 'Q3' }, { pos: 1, word: 'itinerary' }, { pos: 2, word: 'September' }] },
  { sc: 4,  who: 'wearer', words: [{ pos: 0, word: 'ryokan' }, { pos: 1, word: 'stayed' }, { pos: 2, word: 'traditional' }] },
  { sc: 5,  who: 'llm',    words: [{ pos: 0, word: 'ryokan' }, { pos: 1, word: 'tatami' }, { pos: 2, word: 'onsen' }] },
  { sc: 6,  who: 'wearer', words: [{ pos: 0, word: 'ryokan' }, { pos: 1, word: 'quiet' }] },
  { sc: 7,  who: 'llm',    words: [{ pos: 0, word: 'Japan' }, { pos: 1, word: 'landed' }, { pos: 2, word: 'Kyoto' }] },
  { sc: 8,  who: 'wearer', words: [{ pos: 0, word: 'Kyoto' }, { pos: 1, word: 'deadline' }, { pos: 2, word: 'ryokan' }, { pos: 3, word: '30th' }] },
  { sc: 9,  who: 'llm',    words: [{ pos: 0, word: 'spring' }, { pos: 1, word: 'sunny' }, { pos: 2, word: 'amazing' }] },
  { sc: 10, who: 'wearer', words: [{ pos: 0, word: 'loved' }] },
  { sc: 11, who: 'llm',    words: [{ pos: 0, word: 'Kyoto' }, { pos: 1, word: 'ancient' }] },
  { sc: 12, who: 'wearer', words: [{ pos: 0, word: 'temple' }] },
  // bangkok (multi-spelling) + osaka (single spelling, more frequent)
  { sc: 13, who: 'wearer', words: [{ pos: 0, word: 'Bangkok' }, { pos: 1, word: 'trip' }] },
  { sc: 14, who: 'llm',    words: [{ pos: 0, word: 'Bangkok' }, { pos: 1, word: 'lovely' }] },
  { sc: 15, who: 'wearer', words: [{ pos: 0, word: 'there' }] },
  { sc: 16, who: 'llm',    words: [{ pos: 0, word: 'there' }] },
  { sc: 17, who: 'wearer', words: [{ pos: 0, word: 'Osaka' }] },
  { sc: 18, who: 'llm',    words: [{ pos: 0, word: 'Osaka' }] },
  { sc: 19, who: 'wearer', words: [{ pos: 0, word: 'Osaka' }] },
  // dentist (QUALIFY-only)
  { sc: 20, who: 'llm',    words: [{ pos: 0, word: 'dentist' }, { pos: 1, word: 'anxious' }] },
  { sc: 21, who: 'wearer', words: [{ pos: 0, word: 'Monday' }] },
]

export const store: PresentStore = [
  // main tree — identities
  { home: { who: 'wearer', sc: 0,  pos: 0 }, mark: { op: 'identity' } },          // Japan
  { home: { who: 'llm',    sc: 1,  pos: 0 }, mark: { op: 'identity' } },          // Tokyo
  { home: { who: 'wearer', sc: 2,  pos: 0 }, mark: { op: 'identity' } },          // Kyoto
  { home: { who: 'llm',    sc: 3,  pos: 0 }, mark: { op: 'identity' } },          // Q3
  { home: { who: 'wearer', sc: 4,  pos: 0 }, mark: { op: 'identity' } },          // ryokan
  { home: { who: 'llm',    sc: 5,  pos: 0 }, mark: { op: 'identity' } },          // ryokan
  { home: { who: 'wearer', sc: 6,  pos: 0 }, mark: { op: 'identity' } },          // ryokan
  { home: { who: 'llm',    sc: 7,  pos: 0 }, mark: { op: 'identity' } },          // Japan
  { home: { who: 'llm',    sc: 7,  pos: 2 }, mark: { op: 'identity' } },          // Kyoto
  { home: { who: 'wearer', sc: 8,  pos: 0 }, mark: { op: 'identity' } },          // Kyoto
  { home: { who: 'wearer', sc: 8,  pos: 2 }, mark: { op: 'identity' } },          // ryokan
  { home: { who: 'llm',    sc: 11, pos: 0 }, mark: { op: 'identity' } },          // Kyoto

  // main tree — RELATE (edges; home word is the chord name)
  { home: { who: 'llm',    sc: 1,  pos: 1 }, mark: { op: 'RELATE', peers: ['Japan', 'Tokyo'] } },   // flew
  { home: { who: 'wearer', sc: 2,  pos: 1 }, mark: { op: 'RELATE', peers: ['Japan', 'Kyoto'] } },   // toured
  { home: { who: 'llm',    sc: 3,  pos: 1 }, mark: { op: 'RELATE', peers: ['Japan', 'Q3'] } },       // itinerary
  { home: { who: 'wearer', sc: 4,  pos: 1 }, mark: { op: 'RELATE', peers: ['Kyoto', 'ryokan'] } },   // stayed
  { home: { who: 'llm',    sc: 7,  pos: 1 }, mark: { op: 'RELATE', peers: ['Japan', 'Tokyo'] } },    // landed
  { home: { who: 'wearer', sc: 8,  pos: 1 }, mark: { op: 'RELATE', peers: ['Kyoto', 'Q3'] } },       // deadline
  { home: { who: 'wearer', sc: 10, pos: 0 }, mark: { op: 'RELATE', peers: ['Japan', 'Kyoto'] } },    // loved

  // main tree — QUALIFY (colorings; never members)
  { home: { who: 'wearer', sc: 0,  pos: 1 }, mark: { op: 'QUALIFY', coloring: 'beautiful', target: 'Japan' } },
  { home: { who: 'llm',    sc: 3,  pos: 2 }, mark: { op: 'QUALIFY', coloring: 'september', target: 'Q3' } },
  { home: { who: 'wearer', sc: 4,  pos: 2 }, mark: { op: 'QUALIFY', coloring: 'traditional', target: 'ryokan' } },
  { home: { who: 'llm',    sc: 5,  pos: 1 }, mark: { op: 'QUALIFY', coloring: 'tatami', target: 'ryokan' } },
  { home: { who: 'llm',    sc: 5,  pos: 2 }, mark: { op: 'QUALIFY', coloring: 'onsen', target: 'ryokan' } },
  { home: { who: 'wearer', sc: 6,  pos: 1 }, mark: { op: 'QUALIFY', coloring: 'quiet', target: 'ryokan' } },
  { home: { who: 'wearer', sc: 8,  pos: 3 }, mark: { op: 'QUALIFY', coloring: '30th', target: 'Q3' } },
  { home: { who: 'llm',    sc: 9,  pos: 0 }, mark: { op: 'QUALIFY', coloring: 'spring', target: 'Japan' } },
  { home: { who: 'llm',    sc: 9,  pos: 1 }, mark: { op: 'QUALIFY', coloring: 'sunny', target: 'Japan' } },
  { home: { who: 'llm',    sc: 9,  pos: 2 }, mark: { op: 'QUALIFY', coloring: 'amazing', target: 'Japan' } },
  { home: { who: 'llm',    sc: 11, pos: 1 }, mark: { op: 'QUALIFY', coloring: 'ancient', target: 'Kyoto' } },
  { home: { who: 'wearer', sc: 12, pos: 0 }, mark: { op: 'QUALIFY', coloring: 'temple', target: 'Kyoto' } },

  // bangkok: two spellings welded by IDENTIFY (pronoun -> the name's coord)
  { home: { who: 'wearer', sc: 13, pos: 0 }, mark: { op: 'identity' } },          // Bangkok
  { home: { who: 'wearer', sc: 13, pos: 1 }, mark: { op: 'RELATE', peers: ['Bangkok', 'Osaka'] } },  // trip
  { home: { who: 'llm',    sc: 14, pos: 0 }, mark: { op: 'identity' } },          // Bangkok (2nd)
  { home: { who: 'llm',    sc: 14, pos: 1 }, mark: { op: 'QUALIFY', coloring: 'lovely', target: 'Bangkok' } },
  { home: { who: 'wearer', sc: 15, pos: 0 }, mark: { op: 'identity' } },          // there
  { home: { who: 'wearer', sc: 15, pos: 0 }, mark: { op: 'IDENTIFY', target: { who: 'wearer', sc: 13, pos: 0 } } },  // there IS Bangkok
  { home: { who: 'llm',    sc: 16, pos: 0 }, mark: { op: 'identity' } },          // there
  { home: { who: 'llm',    sc: 16, pos: 0 }, mark: { op: 'IDENTIFY', target: { who: 'wearer', sc: 13, pos: 0 } } },

  // osaka: single spelling, appears more often (3x) but fewer total touches
  { home: { who: 'wearer', sc: 17, pos: 0 }, mark: { op: 'identity' } },          // Osaka
  { home: { who: 'llm',    sc: 18, pos: 0 }, mark: { op: 'identity' } },          // Osaka
  { home: { who: 'wearer', sc: 19, pos: 0 }, mark: { op: 'identity' } },          // Osaka

  // dentist: touched ONLY by QUALIFY (no RELATE)
  { home: { who: 'llm',    sc: 20, pos: 0 }, mark: { op: 'identity' } },          // dentist
  { home: { who: 'llm',    sc: 20, pos: 1 }, mark: { op: 'QUALIFY', coloring: 'anxious', target: 'dentist' } },
  { home: { who: 'wearer', sc: 21, pos: 0 }, mark: { op: 'QUALIFY', coloring: 'monday', target: 'dentist' } },
]
