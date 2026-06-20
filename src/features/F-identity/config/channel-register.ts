// @liv-standard v1.5.2
// @governing-spec Perimeter v1.0 (channel register)
// [F-identity/R0]
// Built with LIV · livai.dev
// [F-identity/config/channel-register.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// slice:      F-identity
// layer:      R0
// wires-in:
//   W-ATOM  ChannelKind     @/core/types/perimeter-standard.types  (type-only)
//   W-ATOM  SourceChannel   @/core/types/substrate.types           (type-only)
// wires-out:
//   W-FN    toSourceChannel  →  src/proxy.ts (intake), F-identity/contract/perimeter-consultation (dispatch)
//   W-ATOM  CHANNEL_TO_SOURCE / KNOWN_CHANNEL_KINDS  →  the one channel register, one home
// deps:
//   R0  @/core/types/perimeter-standard.types
//   R0  @/core/types/substrate.types

import type { ChannelKind } from '@/core/types/perimeter-standard.types'
import type { SourceChannel } from '@/core/types/substrate.types'

// The KNOWN ChannelKind members, as a closed array (the union ChannelKind's open-vocab tail
// erases at the type level). `satisfies readonly ChannelKind[]` checks each entry is a channel
// kind; `as const` keeps the literal tuple so the union below is exactly these members.
export const KNOWN_CHANNEL_KINDS = [
  'wearer-message',
  'wearer-query',
  'ai-reply',
  'system-trigger',
  'scheduled-trigger',
  'integration-event',
  'internal-derivation',
  'external-agent',
] as const satisfies readonly ChannelKind[]

type KnownChannelKind = (typeof KNOWN_CHANNEL_KINDS)[number]

// The register — one substrate SourceChannel per known channel. Typed Record over the CLOSED
// known-union, so the compiler REJECTS this file if any known ChannelKind is missing (or extra).
export const CHANNEL_TO_SOURCE: Record<KnownChannelKind, SourceChannel> = {
  'wearer-message':      'wearer',
  'wearer-query':        'wearer',
  'ai-reply':            'ai',
  'system-trigger':      'cron',
  'scheduled-trigger':   'cron',
  'integration-event':   'integration-event',
  'internal-derivation': 'internal-derivation',
  'external-agent':      'external-agent',
}

// The explicit default for a genuinely-unknown FUTURE channel — NOT 'wearer'. An unknown
// channel is the apparatus's own internal origin, never mis-attributed to the wearer.
const UNKNOWN_CHANNEL_SOURCE: SourceChannel = 'internal-derivation'

// The one reader (mirrors register-map's toEngineMark: table + one reader). Every known channel
// resolves from the register; the open-vocab tail falls through to the explicit default.
export function toSourceChannel(channel: ChannelKind): SourceChannel {
  return CHANNEL_TO_SOURCE[channel as KnownChannelKind] ?? UNKNOWN_CHANNEL_SOURCE
}
