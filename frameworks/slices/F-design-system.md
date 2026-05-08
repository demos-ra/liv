---
kind: framework
placement: frameworks/slices/
---

# F-design-system

**Type:** Infrastructure slice — design board, physics engines, UI primitives
**Layers:** R0 (config/board, config/tokens), R1 (domain/engines), R3 (contract/primitives, contract/index), R4 (exec/design-system-provider, exec/use-planet, exec/use-page-transition)

## Structure

config/board.ts          — Design board. All masters and authored constants.
config/tokens.ts         — Runtime values for JS/canvas contexts.
config/index.ts          — Re-export.

domain/light-engine.ts   — 4 masters → 70 CSS vars. Beer-Lambert, inverse square.
domain/type-engine.ts    — Base + R1 ratio → type scale.
domain/space-engine.ts   — Base unit → spacing grid.
domain/motion.ts         — Timing grid + curves + z-index.
domain/index.ts          — Re-export.

contract/primitives.tsx  — React components. Consume CSS classes only.
contract/index.ts        — Re-export config + domain motion constants.

exec/design-system-provider.tsx — Engine initialization. Only DOM access point.
exec/use-planet.ts              — 10-state planet state machine. Imperative DOM (A4).
exec/use-page-transition.ts     — Page dissolve/form choreography. Imperative DOM (A4).

## Import path

Components:
  import { Brand, InputContainer, ... } from '@/features/F-design-system/contract/primitives'

Runtime tokens:
  import { COLORS, SPACE, FONTS } from '@/features/F-design-system/contract'

Motion constants for JS animation:
  import { TIMING, CURVES } from '@/features/F-design-system/contract'

Provider (layout.tsx only):
  import { DesignSystemProvider } from '@/features/F-design-system/exec/design-system-provider'

Hooks (page.tsx only — R4 direct import):
  import { usePlanet } from '@/features/F-design-system/exec/use-planet'
  import { usePageTransition } from '@/features/F-design-system/exec/use-page-transition'

## Why no app/?

No business orchestration, no async workflows. app/ (R2) intentionally absent.

## Why exec/?

DesignSystemProvider writes CSS custom properties to the DOM — that is I/O (R4).
usePlanet and usePageTransition perform imperative DOM manipulation (classList,
style.transition, querySelector, style.setProperty) — R4 per A4.
layout.tsx and page.tsx import from exec/ directly.
contract/ does not re-export R4 (A2: R3 cannot import R4).
