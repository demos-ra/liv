# F-design-system

**Type:** Pre-built infrastructure slice  
**Layers:** R0 (config/tokens), R1 (domain/primitives), R3 (contract/index)

## Why no app/ or exec/?

`F-design-system` is a pure UI token and component library. It has:
- No server-side operations
- No database I/O
- No event emission or subscription
- No business orchestration

`app/` (R2) and `exec/` (R4) layers are intentionally absent. Adding them
would be dead code — a violation of the "no fluff" principle.

## Import path

All consumers import from the single canonical contract:

```ts
import { color, font, Button, Stack, Text } from '@/features/F-design-system/contract'
```

Tokens only (R0):
```ts
import { color, font, space } from '@/features/F-design-system/config'
```
