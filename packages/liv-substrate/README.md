# @liv/substrate

The LIV **substrate** as a standalone, live package — the store, its surface, its
body, and its pool, as one self-sufficient unit. It accepts typed writes and
returns raw reads with **no LIV server present**.

This is LIV's substrate layer (Blueprint §2.1 · Law 2). It is deliberately dumb:
it holds raw lines, append-only, and knows nothing about marks, views, or the
present. The recomposition engine plugs in through a seam; absent the engine, the
store runs alone — and the present recomposes on arrival, wherever the store lands.

> **License: TBD.** Marked `private` / `UNLICENSED` until the substrate's license
> is decided — do not publish, and do not build the engine against this package
> under any assumed license. The substrate and the engine meet **only at the
> cognition-seam boundary, never as a library import** (see below): nothing in the
> paid recomposition layer links this package.

> **Only raw words travel.** There is no export format and no derived state. Marks
> are never stored; they recompose. The portable unit is the words plus the engine
> that re-renders them — nothing else.

## What's in the box

| Part | What it is | Module |
|---|---|---|
| **atom** | the unit: `RawWord → RawTurn → Transcript`; `who ∈ {wearer, llm, program}` | `types/substrate-raw.types` |
| **store surface** | the door — the socket below | `surface/substrate-store` (barrel: `index`) |
| **store body** | the write/read against the database | `store/raw-turn-write`, `store/transcript-read`, `store/substrate-repository` |
| **raw pool** | the `pg` connection underneath everything | `db/client` |
| **fuse point** | where the engine plugs onto the store without the store knowing it exists | `seam/cognition-seam` |

`pg` is the **single** runtime dependency.

## The socket

```ts
import { writeRawTurn, readTranscript, readScope, cutCells, joinCells } from '@liv/substrate'

// testimony in — raw words at a fresh coordinate; returns its sc
const sc = await writeRawTurn({ who: 'wearer', words: cutCells('hello world'), userId, scope })

// raw reads out — the flat transcript (composes nothing)
const transcript = await readTranscript(userId)        // RawTurn[]
const scoped     = await readScope(userId)             // Result<StateChangeRecord[]>
```

The word-cut is an exact inverse: `joinCells(cutCells(t)) === t` for all `t`. The
store never normalizes — `buidl` stays `buidl` forever.

## The fuse point — a boundary, not a library link

The engine is optional, and it does **not** import this package. The store and the
engine meet only here, at the cognition-seam — a registration boundary the host
wires, never a library dependency from the paid layer onto the substrate. The store
imports nothing of the engine; the engine links nothing of the store.

```ts
import { registerReplyComposer, getReplyComposer } from '@liv/substrate'

getReplyComposer()           // null → baseline: the store stands alone
registerReplyComposer(fn)    // the engine plugs in → upgraded
```

Delete the engine and its one registration line → the registry stays empty →
baseline → the loop still runs. That is what makes "the store stands alone"
literally true.

## Scope access control is *not* here

The store reads whatever `userId` arrives. Scope **access control** is a perimeter
responsibility applied above the store — exactly as in the host tree. The package
is the dumb store; the boundary clips the stamp.

## Run it

```sh
npm install
npm run build       # tsc → dist/ (self-contained; no @/ aliases, no engine)
npm test            # pure tier always; live DB tier when DATABASE_URL is set
```

The store needs only a `DATABASE_URL` and the `state_change` table to run live.

## Lineage

The store source is vendored faithfully from the LIV tree (`d6d13c8`); each file
names its canonical home in its header. Only import paths differ. A stale copy is a
mechanical diff against its origin — never a re-think.
