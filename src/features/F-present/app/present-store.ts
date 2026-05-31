// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-present/R2]
// Built with LIV · livai.dev
// [F-present/app/present-store.ts]
// F-present's EXTERNAL store — the lens, separate from the wearer's substrate.
// Per-wearer isolated. Holds only marks (pointers into substrate coordinates);
// never raw content. Append-only place; read returns the wearer's lens; clear =
// the wearer removes their lens (substrate untouched, traceless).
//
// The persistence BACKEND is a swappable seam — the in-memory impl below is the
// reference; the physical store (separate DB, per-wearer isolation) is the one
// infra decision flagged for L0 confirm. The CONTRACT here is final.

import type { PlacedMark, PresentStore } from '@/features/F-present/config/mark-types'

export interface PresentMarkStore {
  place(userId: string, marks: PlacedMark[]): Promise<void>   // append the lens; writes NOTHING to substrate
  read(userId: string): Promise<PresentStore>                 // the wearer's marks (for coin-read)
  clear(userId: string): Promise<void>                        // wearer removes their lens
}

// Reference in-memory impl. Per-wearer keyed; isolation is the Map boundary here,
// the per-user DB/row-scope in production (the seam). Contract identical either way.
export function createInMemoryPresentStore(): PresentMarkStore {
  const byUser = new Map<string, PlacedMark[]>()
  return {
    async place(userId, marks) { byUser.set(userId, [...(byUser.get(userId) ?? []), ...marks]) },
    async read(userId)         { return byUser.get(userId) ?? [] },
    async clear(userId)        { byUser.delete(userId) },
  }
}
