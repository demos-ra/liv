---
kind: framework
placement: frameworks/standards/
---

# design-standard-v1-0

**Kind:** Framework
**Level:** L3
**Mode:** `generative` (per substrate §2 Mode enum; `structured → produced` — Design Standard's engine pipeline transforms structured master inputs into produced design tokens; classification per L0 disposition Sprint 5.5 close per §10.D1, with the substrate §2.2 binding argument identical in form to the per-framework precedent set when L0 confirmed Living Memory v2.x's `mode: generative` declaration)
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.6 under metaframework-v3-1 v3.2.7
**Cross-framework input:** Substrate v1.6, Metaframework v3.2.7, Generation Procedure v1.1.6 (generation parents); F-design-system slice at HEAD `9862092` (runtime referent for reverse-derivation)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema, generated under bootstrap discipline per substrate §4 A-14 (`bootstrapped: true`). Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus change log, self-audit, and provenance per v3-1-spec §4.4 file-specific placement).

Design Standard is the L3 framework declaring the masters, derivations, and cross-engine invariants under which a runtime computes the design tokens consumed by all wearer-facing surface code. Mode is `generative` per substrate §2 Mode enum (`structured → produced`): Design Standard's engine pipeline transforms structured master inputs (`DesignInput` per §2.1) into produced design tokens (`DesignVarBundle` per §2.2 + JS-resolved `TIMING` / `CURVES` / `Z` constants). Classification per L0 disposition Sprint 5.5 close per §10.D1. The substrate §2.2 Mode binding is a per-framework argument: each framework declares its Mode by argument from its own input-output transformation shape, and L0 confirms each individually. Living Memory v2.x establishes per-framework precedent for the same form of argument — LM's derivation pipeline produces structured graph state from master inputs, justifying its `mode: generative` declaration; L0 confirmed LM's binding in its own confirmation gate. Design Standard's binding is independent (its own input-output shape in §2.1 + §2.2) and was confirmed in this sprint's gate; the LM precedent supplies the **form** of the §2.2 binding argument, not class-membership.

Design Standard is distinct in **domain** from the L3 frameworks classifying typed-work transitions: Plan v2.2 (structural — typed-work decomposition), Verification Standard v1.0 (verificative — typed-work verification), Research Standard v1.0 (epistemic — typed-work knowledge discovery), and the future builder framework (generative — typed-work synthesis). Design Standard and the future builder framework will both declare `mode: generative` per substrate §2; the Mode-axis classification is shared, the input-output domain is not (Design Standard transforms master atoms into rendering tokens; the future builder framework will transform planning inputs into typed-work artifacts). Substrate §2 classifies frameworks by Mode only; domain-distinction is documented at the per-framework level via each framework's §2.1 / §2.2 declarations.

The runtime referent — the F-design-system slice at HEAD `9862092` — pre-dates this spec md. Spec md formalizes what runtime already does. `referentCitations` is therefore non-empty at v1.0 (the inverse of the VS / RS / Cognitive v1.2.2 vacuous-pass case): every master declared in board.ts and every derivation rule encoded in the engines is cited as the implementation that this spec formalizes. G-V10 / G-S8 / G-L11 evaluate substantively at first audit run.

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Design Standard` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed) |
| `mode` | `generative` (per substrate §2 Mode enum; `structured → produced` — Design Standard's engine pipeline transforms structured master inputs (`DesignInput` per §2.1) into produced design tokens (`DesignVarBundle` per §2.2 + JS-resolved `TIMING` / `CURVES` / `Z` constants). L0 disposition Sprint 5.5 close per §10.D1. Substrate §2.2 binding is a per-framework argument: Design Standard's binding rests on its own §2.1 / §2.2 input-output shape, confirmed by L0 in this sprint's gate. Living Memory v2.x established per-framework precedent for the same form of binding argument; precedent applies to argument shape, not class-membership.) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference; per Manual v10 II.5 declaration) |
| `version` | `1.0` (per substrate §7 Semver) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `applied` (per substrate §9 LifecycleState; transitioned from `declared` at L0 confirmation Sprint 5.5 close. Runtime application: F-design-system slice at HEAD `9862092` invokes the engines via DesignSystemProvider on every app mount and on every `data-theme` MutationObserver callback per design-system-provider.tsx:54–86 — the framework has been in continuous active use across all wearer-facing surfaces since pre-Sprint-5.5 deployment; `applied` formalizes this state per the bootstrap-lift discipline declared at §1.1.) |
| `genesis` | see §1.1 GenesisDeclaration below — `bootstrapped: true` |
| `carrier` | `self` (per substrate §9 Carrier enum; applied §6.1; Design Standard emits its own outputs — CSS variable map + derived constants — directly to DOM via DesignSystemProvider; does not ride AS v2.2; mirrors Living Memory v2.x carrier=self pattern) |
| `primitive` | `physical-derivation` (Design-local atomic unit; defined §3.9 Vocabulary — one master + one derivation rule producing one derived value via declared physics) |
| `consumes` | master values declared in board.ts (`I_LIGHT, I_DARK, H, Thue, Tsat, R1..R4, L_CEIL, SCALE_FLOOR, COOL_SHIFT, DARK_THRESHOLD, SCOTOPIC_HUE, BREATH_DELTA, PX_SCALE, BLUE, RED, AMBER, DENSITY_*, H_REST, H_HOVER, H_PRESS, TYPE_BASE, TYPE_RATIO, FONT_*, WEIGHT, LINE_HEIGHT, LETTER_SPACING, SPACE_UNIT, RADIUS_BUBBLE, COL_WIDTH*, LOGIN_WIDTH, BREAKPOINT_*, DOT_SIZE, SPINNER_SIZE*, DASH_MIN_H, PANEL_WIDTH, ATTACK, RELEASE, BLOOM, CYCLE_STREAM, CURVE_*, Z`); composition context (current `data-theme` attribute value via `getBaseI()` returning `I_LIGHT` or `I_DARK` per design-system-provider.tsx lines 34–38) |
| `produces` | `LightVarSet` (70 CSS variables; light-engine.ts `deriveLight` output per engine note line 15), `TypeVarSet` (8 CSS variables; type-engine.ts `deriveType` output per engine note line 15), `SpaceVarSet` (24 CSS variables; space-engine.ts `deriveSpace` output per engine note line 15), `MotionVarSet` (8 CSS variables; motion.ts `deriveMotion` output per module note line 15), plus `TIMING` and `CURVES` JS constants (motion.ts lines 41–42) and `Z` re-export (motion.ts line 43). Total CSS variable cardinality: 110 keys across four engines (with 7-var overlap between deriveLight and deriveMotion on `--S, --E, --T, --B, --G, --dur-attack, --dur-release` per motion.ts module note line 18–21 — overlap is intentional, both engines produce the values independently and last-write wins under DesignSystemProvider's setVars sequence per design-system-provider.tsx lines 56–63). |
| `consumedBy` | F-design-system contract layer (`contract/primitives.tsx` consumes via CSS class names per slice doc line 50); F-design-system R4 layer (`exec/design-system-provider.tsx` writes derived values to `document.documentElement.style`; `exec/use-planet.ts` and `exec/use-page-transition.ts` read `window._livTiming` per design-system-provider.tsx lines 66–70); all wearer-facing React components in F-chat, F-dashboard, F-discover, F-identity, F-codec consuming via CSS class strings (verified per consumer-sweep brief §6) |
| `adjacentFrameworks` | F-design-system slice (sole runtime tenant; all engines + provider implement Design Standard's declared mechanics); future RSF v1.0 (Sprint 8 — semantics layer over Design Standard's rendering layer; consumes Design Standard atoms by reference, declares semantic-to-mechanics binding); Cognitive Standard v1.3+ (future — visual dispatch governance amendment Sprint 8; cross-perimeter visual carry); Living Memory (no direct dependency at runtime; Design Standard does not write to graph); Artifact Standard v2.2 (no direct dependency; Design Standard outputs are not artifacts). LM, Cognitive, and AS are declared peers at L3 but are independent frameworks with independent Mode declarations and independent carrier declarations confirmed via their own L0 gates; no shared class is declared between them and Design Standard. |
| `referentCitations` | **non-empty at v1.0** — bootstrap case per substrate §4 A-14. The runtime referent (F-design-system slice at HEAD `9862092`) pre-dates this spec md; spec md formalizes the framework template under which the slice already operates. Citation set declared in §2.10 referentCitations table below (one row per master, derivation rule, and engine output). Each citation conforms to substrate §4 A-18 ReferentCitation typed shape: `{citationId, citingFrameworkRef, atomName, referentKind: 'code', path, expectedShape}`. G-V10 / G-S8 / G-L11 evaluate **substantively** at first audit run (not vacuous-pass). |
| `scopeOut` | `['view-kind semantics (owned by RSF v1.0 — Sprint 8; what kind of view renders for what typed work)', 'visual dispatch governance (owned by Cognitive Standard v1.3+ dispatch-side amendments — Sprint 8)', 'L4 program rendering logic (owned by each program — F-dashboard renders dashboard cards, F-chat renders conversation surface, etc.)', 'CSS-to-DOM application implementation (owned by DesignSystemProvider in F-design-system R4 — implementation, not declaration; Design Standard declares what is applied, not the apply mechanism)', 'theme variation, dark mode, accessibility presets (post-beta — v1.0 supports two themes via I_LIGHT / I_DARK only)', 'animation choreography (owned by usePlanet, usePageTransition in F-design-system R4 — Design Standard provides timing constants TIMING + curves CURVES, not choreography)', 'authored constants outside the four mechanics axes (font stacks, breakpoints, component dimensions are Design-Standard-declared but not Light/Type/Space/Motion-axis-derived; carry as authored atoms per §3.6 DSA10)', 'B-direction symmetric re-derivation at B3 (post-beta)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 (consumed by reference; string-typed):

```
genesis = {
  origin: 'reverse-derived-from-runtime-referent-via-bootstrap',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.6' },
  generationCycle: 'sprint-5.5-design-standard-v1-0-genesis',
  confirmedAt: '2026-05-02T00:00:00Z',
  predecessorVersion: null,
  bootstrapped: true,
  bootstrapBasis: 'F-design-system slice (15 files; 822 lines; HEAD 9862092) deployed pre-spec-md authoring; v1.0 spec md formalizes the framework template under which the slice already operates. Per substrate §4 A-14, bootstrapped=true is the structurally honest declaration when a v0 lift formalizes pre-existing runtime mechanics. No v0 spec md predecessor exists — `git log --all --diff-filter=A -- design-standard.md` returned empty per brief §1.'
}
```

**Bootstrap status:** `bootstrapped: true` per A-14 — Design Standard v1.0 is a v0 lift of pre-existing runtime mechanics, not a fresh forward-generation. (Contrast with VS v1.0 `bootstrapped: false` per its §1.1 — VS was forward-generated under GP v1.1.6 unmodified; Design Standard formalizes a runtime referent that pre-dates the spec.) The full GP v1.1.6 twelve-step pipeline (S1–S12) does not apply unmodified: S2 mechanical-derivation step is replaced by reverse-derivation from the runtime referent; E1–E8 gate execution applies normally to the resulting template; S11 L0-observation gate applies normally and was cleared at Sprint 5.5 close per the `confirmedAt` timestamp above. Future versions (v1.1+) follow forward GP v1.1.6 unmodified per §10.D3.

Genesis block shape mirrors Verification Standard v1.0 §1.1 precedent (six VS-shared fields: `origin`, `parentFrameworkRef`, `generationProcedureRef`, `generationCycle`, `confirmedAt`, `predecessorVersion`) extended additively with two A-14 bootstrap-specific fields (`bootstrapped`, `bootstrapBasis`) per substrate §4 A-14 typed shape. Extension is additive per MA-S7; non-bootstrap-lifted frameworks (VS, Plan, future cycles) populate the six shared fields and treat the two bootstrap fields as default-absent or `bootstrapped: false`.

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I7:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `generative` in §1 row per L0 disposition Sprint 5.5 close. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template + applied in §1 rows per substrate A-11. |
| MA-I4 | LifecycleState declared for template + applied in §1 rows per substrate §9. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named per substrate A-14; `bootstrapped: true` declared honestly. |
| MA-I6 | Authority source classified: L0 authority for template ownership; system-under-L0 for applied. |
| MA-I7 | Identity declarations are mutually consistent. Mode + Kind + Level alignment: generative-mode + Framework-kind + L3 is a valid triple per substrate §2.4 Mode binding + §1.5 canonical kind registry. Living Memory v2.x is the per-framework precedent that the (generative + Framework + L3) triple has been L0-confirmed for an L3 framework whose §2.2 binding rests on master-to-derived-state transformation; the precedent applies to argument shape, not class-membership. |

---

## §2 Schema

### §2.1 Inputs (R3 surface — what consumers supply)

Per MA-S1 (input is W-ATOM). Design Standard's input surface is the master set declared in `features/F-design-system/config/board.ts` plus runtime composition context. Each master is a typed atom; the full set is declared verbatim from the runtime referent (per §1 referentCitations bootstrap basis).

```
DesignInput = {
  // ── Light masters (board.ts lines 19–23) ──
  light: LightMasters

  // ── Russell scale (board.ts lines 27–30) ──
  russell: RussellScale

  // ── Light constants (board.ts lines 34–40) ──
  lightConstants: LightConstants

  // ── Pinned materials (board.ts lines 44–46) ──
  pinned: PinnedMaterials

  // ── Density scale (board.ts lines 50–53; derived) ──
  density: DensityScale

  // ── H compression tiers (board.ts lines 57–59; derived) ──
  hCompression: HCompressionTiers

  // ── Type masters (board.ts lines 63–64) ──
  typeMasters: TypeMasters

  // ── Type authored (board.ts lines 68–90) ──
  typeAuthored: TypeAuthored

  // ── Space master (board.ts line 94) ──
  spaceMasters: SpaceMasters

  // ── Space authored (board.ts lines 98–112) ──
  spaceAuthored: SpaceAuthored

  // ── Motion masters (board.ts lines 116–141) ──
  motion: MotionMasters

  // ── Composition context (runtime, supplied by DesignSystemProvider per design-system-provider.tsx lines 34–38) ──
  context: CompositionContext
}
```

**Master atom typed shapes** (each declared at point of use; runtime referent in board.ts column):

```
LightMasters = {
  I_LIGHT: number       // 0.95     — board.ts:19
  I_DARK:  number       // 0.08     — board.ts:20
  H:       number       // 0.125    — board.ts:21
  Thue:    number       // 45       — board.ts:22 (degrees, hue origin)
  Tsat:    number       // 0.125    — board.ts:23
}

RussellScale = {
  R1: number   // 2^(1/4) ≈ 1.1892  — board.ts:27
  R2: number   // 2^(1/2) ≈ 1.4142  — board.ts:28
  R3: number   // 2^(3/4) ≈ 1.6818  — board.ts:29
  R4: number   // 2 (octave)        — board.ts:30
}

LightConstants = {
  L_CEIL:         number   // 0.99       — board.ts:34
  SCALE_FLOOR:    number   // 0.003      — board.ts:35
  COOL_SHIFT:     number   // 1/32       — board.ts:36
  DARK_THRESHOLD: number   // 0.5        — board.ts:37
  SCOTOPIC_HUE:   number   // 175        — board.ts:38
  BREATH_DELTA:   number   // 1/64       — board.ts:39
  PX_SCALE:       number   // 32         — board.ts:40
}

PinnedMaterial = {
  hue: number     // degrees
  sat: number     // [0, 1]
  L:   number     // [0, 1]
}

PinnedMaterials = {
  BLUE:  PinnedMaterial   // {220, 1.0,  0.71}  — board.ts:44 (frozen via `as const`)
  RED:   PinnedMaterial   // {7,   0.52, 0.53}  — board.ts:45 (frozen via `as const`)
  AMBER: PinnedMaterial   // {40,  0.75, 0.55}  — board.ts:46 (frozen via `as const`)
}

DensityScale = {
  DENSITY_FULL:  number   // 1.0           — board.ts:50
  DENSITY_SOFT:  number   // 1/R1          — board.ts:51
  DENSITY_HALF:  number   // 1/R4          — board.ts:52
  DENSITY_FAINT: number   // 1/(R4*R4)     — board.ts:53
}

HCompressionTiers = {
  H_REST:  number   // H               — board.ts:57
  H_HOVER: number   // H/R1             — board.ts:58
  H_PRESS: number   // H/R4             — board.ts:59
}

TypeMasters = {
  TYPE_BASE:  number   // 16 (px)        — board.ts:63
  TYPE_RATIO: number   // R1 (shared)    — board.ts:64
}

TypeAuthored = {
  fontUI:    string                                     // board.ts:68
  fontMono:  string                                     // board.ts:69
  fontBrand: string                                     // board.ts:70
  weight:    { regular: number; medium: number; bold: number }   // board.ts:74 (frozen)
  lineHeight: { tight: number; body: number; reading: number }   // board.ts:78 (frozen)
  letterSpacing: { brand, brandLg, mono, monoSm, monoXs, monoWide, label: string }  // board.ts:82–90 (frozen)
}

SpaceMasters = {
  SPACE_UNIT: number   // 8 (px)         — board.ts:94
}

SpaceAuthored = {
  RADIUS_BUBBLE:   number   // 18 (px, optical)   — board.ts:98
  COL_WIDTH:       number   // 680                — board.ts:99
  COL_WIDTH_LG:    number   // 720                — board.ts:100
  LOGIN_WIDTH:     number   // 340                — board.ts:101
  BREAKPOINT_SM:   number   // 480                — board.ts:102
  BREAKPOINT_MD:   number   // 768                — board.ts:103
  BREAKPOINT_LG:   number   // 1281               — board.ts:104
  DOT_SIZE:        number   // 6                  — board.ts:108
  SPINNER_SIZE:    number   // 14                 — board.ts:109
  SPINNER_SIZE_SM: number   // 12                 — board.ts:110
  DASH_MIN_H:      number   // 100                — board.ts:111
  PANEL_WIDTH:     number   // 320                — board.ts:112
}

MotionMasters = {
  ATTACK:       number   // 256  = 2^8  ms     — board.ts:116
  RELEASE:      number   // 512  = 2^9  ms     — board.ts:117
  BLOOM:        number   // 1024 = 2^10 ms     — board.ts:118
  CYCLE_STREAM: number   // 2048 = 2^11 ms     — board.ts:119
  curveS:       string   // 'cubic-bezier(0.08, 0.82, 0.36, 1)'  — board.ts:123
  curveE:       string   // 'cubic-bezier(0, 0, 0.2, 1)'         — board.ts:124
  curveT:       string   // 'cubic-bezier(0.4, 0, 1, 1)'         — board.ts:125
  curveB:       string   // 'cubic-bezier(0.45, 0, 0.55, 1)'     — board.ts:126
  curveG:       string   // 'cubic-bezier(0, 0, 0.58, 1)'        — board.ts:127
  Z: { field, content, forming, mask, dash, header, overlay, panel, toast: number }  // board.ts:131–141 (frozen via `as const`)
}

CompositionContext = {
  baseI: number    // current intensity master; supplied by DesignSystemProvider getBaseI() per design-system-provider.tsx:34–38; resolves to LightMasters.I_LIGHT or LightMasters.I_DARK by data-theme attribute
}
```

Every field traces to declared source in §6.5 Custody table. Typed shape declared in `design-standard.types.ts` (R5; future hygiene sprint per brief §7).

### §2.2 Outputs (carrier = self → declared as named W-ATOMs)

Per MA-S2 (output is W-ATOM; Design Standard carrier = `self`, so each output is a W-ATOM — not AxiomRef[] under AS shell). Mirror Living Memory v2.x carrier=self pattern. Design Standard emits four named W-ATOMs corresponding to the four engine outputs:

```
LightVarSet = Record<string, string>   // 70 keys per light-engine.ts comment line 15 (25 shared + 45 per-tier)
                                       // produced by deriveLight(I: number) per light-engine.ts:85

TypeVarSet  = Record<string, string>   // 8 keys per type-engine.ts comment line 15 (5 type sizes + 3 font stacks)
                                       // produced by deriveType() per type-engine.ts:22

SpaceVarSet = Record<string, string>   // 24 keys per space-engine.ts comment line 15
                                       //   (10 unit-multiples u05..u6 + 5 component dims + 3 radii + 2 col widths + 1 login + 1 dot + 2 spinner + 1 dash-min + 1 panel + 3 input/header heights)
                                       //   exact key set declared at §3.6 DSA8
                                       // produced by deriveSpace() per space-engine.ts:24

MotionVarSet = Record<string, string>  // 8 keys per motion.ts comment line 15
                                       //   ('--S', '--E', '--T', '--B', '--G', '--dur-attack', '--dur-release', '--cycle-stream')
                                       // produced by deriveMotion() per motion.ts:28
                                       // 7 keys overlap with LightVarSet per motion.ts module note line 18–21 (intentional)
```

Plus three JS-resolved constants for direct consumption (avoiding `var()` indirection in JS contexts per motion.ts module note line 19–21):

```
TIMING = { attack: number; release: number; bloom: number }   // motion.ts:41 — frozen via `as const`
CURVES = { S, E, T, B, G: string }                            // motion.ts:42 — frozen via `as const`
Z      = { field, content, forming, mask, dash, header, overlay, panel, toast: number }  // motion.ts:43 re-exports board.ts:131
```

**Atomicity note (per DSA1 + DSA2 declared at §3.6):** every output is a pure function of inputs. `deriveLight(I)` is a pure function of `(I, LightMasters \ {I_LIGHT, I_DARK}, LightConstants, PinnedMaterials, RussellScale, DensityScale, HCompressionTiers, MotionMasters.curve*, MotionMasters.{ATTACK,RELEASE})` per the import set at light-engine.ts:19–29. `deriveType()` is a pure function of `(TypeMasters, TypeAuthored.font*)` per type-engine.ts:17–20. `deriveSpace()` is a pure function of `(SpaceMasters, SpaceAuthored)` per space-engine.ts:17–22. `deriveMotion()` is a pure function of `(MotionMasters)` per motion.ts:23–26. No I/O during derivation; I/O only at R4 DOM application via `setVars` in design-system-provider.tsx:40–45. DSA9 enforces this.

### §2.3 Consumed types (from substrate-v1-1, by reference)

Per substrate §1.3 S-01 single-source-via-reference; string-typed:

| Type | Home |
|---|---|
| `Mode` | substrate §2 |
| `AuthorityLevel` | substrate §5 |
| `WAtom` | substrate §4 A-01 |
| `FrameworkRef` | substrate §4 A-09 |
| `Kind` | substrate §4 A-10 |
| `Ownership` | substrate §4 A-11 |
| `OperatorInterface` | substrate §4 A-13 |
| `GenesisDeclaration` | substrate §4 A-14 |
| `LifecycleState` | substrate §9 |
| `Carrier` | substrate §9 |
| `Stage` | substrate §8.3 |
| `StageContentKind` | substrate §8.3 |
| `CaptureShape` | substrate §8.2 (consumed by §6.3 captureShape declarations) |
| `Judgment` | substrate §6 (consumed by empty-declaration basis §7.1) |
| `EmptyPrimitiveDeclaration` | substrate §4 A-17 (consumed by §3.2 P7 + P8 empty markers) |
| `ReferentCitation` | substrate §4 A-18 (consumed by §2.10 referentCitations table; §1 referentCitations row) |
| `ReferentAlignmentState` | substrate §4 A-19 (consumed at audit time per G-V10) |
| `ReferentSnapshot` | substrate §4 A-20 (consumed at audit time per G-L11) |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `Semver` | primitives.ts | §1 version |
| `Result<T, E>` | primitives.ts | §2.5 DesignDerivationResult success/failure shape |
| `AppError` | primitives.ts | §2.5 DesignDerivationError extends |

Design Standard does **not** consume `NodeId`, `UserId`, `EpochMs` — outputs are not graph-bound, not user-bound, not timestamped. CSS variables are immediate-value writes; no anchor.

### §2.5 Consumed types (none from Artifact Standard — Design Standard does NOT use AS carrier)

Design Standard carrier = `self` per §1 row + §6.1. AS v2.2 atoms are **not** consumed at v1.0. No `ArtifactPayload`, `ArtifactEmission`, `CreateArtifactInput`, or `ArtifactRef` references. Mirrors Living Memory v2.x carrier=self pattern (LM also does not consume AS atoms at its declaration tier — though AS consumes LM at its commit pipeline; reverse direction).

`DesignDerivationResult` and `DesignDerivationError` are Design-Standard-local types (not AS-derived):

```
DesignDerivationResult = Result<DesignVarBundle, DesignDerivationError>

DesignVarBundle = {
  light:  LightVarSet
  type:   TypeVarSet
  space:  SpaceVarSet
  motion: MotionVarSet
}

DesignDerivationError = AppError & {
  code: 'DESIGN_INPUT_INVALID' | 'DESIGN_DERIVATION_FAILED' | 'DESIGN_DOM_APPLICATION_FAILED'
  failedAxiom: 'DSA1' | 'DSA2' | 'DSA3' | ... // populated when known
}
```

### §2.6 Consumed types (from metaframework-v3-1, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `GeneratedFrameworkTemplate` | metaframework §2.2 | this file is an instance per HR6 output contract |
| `MetaframeworkInput` | metaframework §2.1 | `sourceInputRef` target per provenance §6.6 |

### §2.7 Design-local atoms (declared at point of use in §3 + §6)

Atoms owned by Design Standard (custody row per atom in §6.5):

`LightMasters`, `RussellScale`, `LightConstants`, `PinnedMaterial`, `PinnedMaterials`, `DensityScale`, `HCompressionTiers`, `TypeMasters`, `TypeAuthored`, `SpaceMasters`, `SpaceAuthored`, `MotionMasters`, `CompositionContext`, `DesignInput`, `LightVarSet`, `TypeVarSet`, `SpaceVarSet`, `MotionVarSet`, `DesignVarBundle`, `TIMING`, `CURVES`, `Z` (re-exported from board.ts but custody owned by Design Standard's domain), `DesignDerivationResult`, `DesignDerivationError`, `DesignAxisPositional`, `DesignDerivationPositional`.

Each atom declared at first use in §3 (Structure) or §6 (Coupling) per S1 single-source declaration. Typed shapes intended for `design-standard.types.ts` (R5 file deferred to subsequent hygiene sprint per brief §7).

### §2.8 Schema rules (ScR-series)

Per metaframework §2.5 ScR-series, consumed by reference. Applied to Design Standard:

- **ScR1** (input is W-ATOM): `DesignInput` declared §2.1 as typed shape composed of master-atom typed sub-shapes.
- **ScR2** (output is W-ATOM): each output (`LightVarSet`, `TypeVarSet`, `SpaceVarSet`, `MotionVarSet`, `TIMING`, `CURVES`, `Z`) declared §2.2 as named typed shape per carrier=self pattern.
- **ScR3** (custody coverage): every atom consumed or declared has §6.5 custody row.

### §2.9 Custody pointer

Full custody table in §6.5 Coupling. Summary pointer only at this section per A-08 single-source-via-reference.

### §2.10 referentCitations (non-empty bootstrap declaration per §1 + MF v3.2.7 §2.2 schema-block site)

Per substrate §4 A-18 ReferentCitation typed shape `{citationId, citingFrameworkRef, atomName, referentKind, path, expectedShape}`. Design Standard v1.0 declares the citation set exhaustively from the F-design-system runtime referent at HEAD `9862092`. Each citation is mechanically resolvable: the referent at `path` parses, and its declaration structurally matches `expectedShape` per substrate §4 A-18 `ExpectedShape` discriminated union. G-V10 evaluates `applicability='applicable'` for every citation below (substantive first-run, not vacuous-pass).

`citingFrameworkRef = { id: 'design-standard', version: '1.0' }` for every row below.

| citationId | atomName | referentKind | path | expectedShape |
|---|---|---|---|---|
| `dsa-cite-light-masters` | `LightMasters` | `code` | `features/F-design-system/config/board.ts` (lines 19–23) | `{ kind: 'object', fieldNames: ['I_LIGHT','I_DARK','H','Thue','Tsat'] }` |
| `dsa-cite-russell-scale` | `RussellScale` | `code` | `features/F-design-system/config/board.ts` (lines 27–30) | `{ kind: 'object', fieldNames: ['R1','R2','R3','R4'] }` |
| `dsa-cite-light-constants` | `LightConstants` | `code` | `features/F-design-system/config/board.ts` (lines 34–40) | `{ kind: 'object', fieldNames: ['L_CEIL','SCALE_FLOOR','COOL_SHIFT','DARK_THRESHOLD','SCOTOPIC_HUE','BREATH_DELTA','PX_SCALE'] }` |
| `dsa-cite-pinned-materials` | `PinnedMaterials` | `code` | `features/F-design-system/config/board.ts` (lines 44–46) | `{ kind: 'object', fieldNames: ['BLUE','RED','AMBER'] }` |
| `dsa-cite-pinned-shape` | `PinnedMaterial` | `code` | `features/F-design-system/config/board.ts` (lines 44–46; `as const` literals) | `{ kind: 'object', fieldNames: ['hue','sat','L'] }` |
| `dsa-cite-density-scale` | `DensityScale` | `code` | `features/F-design-system/config/board.ts` (lines 50–53) | `{ kind: 'object', fieldNames: ['DENSITY_FULL','DENSITY_SOFT','DENSITY_HALF','DENSITY_FAINT'] }` |
| `dsa-cite-h-compression` | `HCompressionTiers` | `code` | `features/F-design-system/config/board.ts` (lines 57–59) | `{ kind: 'object', fieldNames: ['H_REST','H_HOVER','H_PRESS'] }` |
| `dsa-cite-type-masters` | `TypeMasters` | `code` | `features/F-design-system/config/board.ts` (lines 63–64) | `{ kind: 'object', fieldNames: ['TYPE_BASE','TYPE_RATIO'] }` |
| `dsa-cite-space-master` | `SpaceMasters` | `code` | `features/F-design-system/config/board.ts` (line 94) | `{ kind: 'object', fieldNames: ['SPACE_UNIT'] }` |
| `dsa-cite-motion-timing` | `MotionMasters.timing` | `code` | `features/F-design-system/config/board.ts` (lines 116–119) | `{ kind: 'object', fieldNames: ['ATTACK','RELEASE','BLOOM','CYCLE_STREAM'] }` |
| `dsa-cite-motion-curves` | `MotionMasters.curves` | `code` | `features/F-design-system/config/board.ts` (lines 123–127) | `{ kind: 'object', fieldNames: ['CURVE_S','CURVE_E','CURVE_T','CURVE_B','CURVE_G'] }` |
| `dsa-cite-z-index` | `MotionMasters.Z` | `code` | `features/F-design-system/config/board.ts` (lines 131–141; `as const` literal) | `{ kind: 'object', fieldNames: ['field','content','forming','mask','dash','header','overlay','panel','toast'] }` |
| `dsa-cite-derive-light` | `deriveLight` | `code` | `features/F-design-system/domain/light-engine.ts` (function declaration line 85) | `{ kind: 'object', fieldNames: ['deriveLight'] }` (export presence + signature `(I: number) => Record<string, string>`) |
| `dsa-cite-derive-type` | `deriveType` | `code` | `features/F-design-system/domain/type-engine.ts` (function declaration line 22) | `{ kind: 'object', fieldNames: ['deriveType'] }` (export presence + signature `() => Record<string, string>`) |
| `dsa-cite-derive-space` | `deriveSpace` | `code` | `features/F-design-system/domain/space-engine.ts` (function declaration line 24) | `{ kind: 'object', fieldNames: ['deriveSpace'] }` (export presence + signature `() => Record<string, string>`) |
| `dsa-cite-derive-motion` | `deriveMotion` | `code` | `features/F-design-system/domain/motion.ts` (function declaration line 28) | `{ kind: 'object', fieldNames: ['deriveMotion'] }` (export presence + signature `() => Record<string, string>`) |
| `dsa-cite-light-cardinality` | `LightVarSet.cardinality` | `code` | `features/F-design-system/domain/light-engine.ts` (engine note line 15: "70 CSS custom properties: 25 shared + 45 per-tier") | `{ kind: 'enum-const', values: [70] }` |
| `dsa-cite-type-cardinality` | `TypeVarSet.cardinality` | `code` | `features/F-design-system/domain/type-engine.ts` (engine note line 15: "8 CSS custom properties: 5 type sizes + 3 font stacks") | `{ kind: 'enum-const', values: [8] }` |
| `dsa-cite-space-cardinality` | `SpaceVarSet.cardinality` | `code` | `features/F-design-system/domain/space-engine.ts` (engine note line 15: "24 CSS custom properties") | `{ kind: 'enum-const', values: [24] }` |
| `dsa-cite-motion-cardinality` | `MotionVarSet.cardinality` | `code` | `features/F-design-system/domain/motion.ts` (engine note line 15: "8 CSS custom properties") | `{ kind: 'enum-const', values: [8] }` |
| `dsa-cite-provider-dom-only` | `DesignSystemProvider.domAccess` | `code` | `features/F-design-system/exec/design-system-provider.tsx` (file note line 19: "ONLY file in F-design-system that accesses DOM") | `{ kind: 'object', fieldNames: ['DesignSystemProvider'] }` (export presence; DOM-access locality enforced by R4 layer assignment per slice doc line 49) |
| `dsa-cite-pinned-frozen` | `PinnedMaterials.{BLUE,RED,AMBER}` | `code` | `features/F-design-system/config/board.ts` (lines 44–46; `as const` discriminator) | `{ kind: 'enum-const', values: ['as const'] }` (compile-time immutability marker; TypeScript const assertion) |
| `dsa-cite-h-press-derivation` | `HCompressionTiers.H_PRESS` | `code` | `features/F-design-system/config/board.ts` (line 59: `H_PRESS = H / R4`) | `{ kind: 'enum-const', values: ['H / R4'] }` (literal expression text) |
| `dsa-cite-h-hover-derivation` | `HCompressionTiers.H_HOVER` | `code` | `features/F-design-system/config/board.ts` (line 58: `H_HOVER = H / R1`) | `{ kind: 'enum-const', values: ['H / R1'] }` (literal expression text) |
| `dsa-cite-density-derivation` | `DensityScale.{SOFT,HALF,FAINT}` | `code` | `features/F-design-system/config/board.ts` (lines 51–53: `1/R1, 1/R4, 1/(R4*R4)`) | `{ kind: 'object', fieldNames: ['DENSITY_SOFT','DENSITY_HALF','DENSITY_FAINT'] }` (each derived exclusively from R-scale powers per DSA6) |
| `dsa-cite-type-derivation` | `TypeVarSet.derivation` | `code` | `features/F-design-system/domain/type-engine.ts` (lines 24–28: `TYPE_BASE * Math.pow(TYPE_RATIO, n)` for n ∈ {-2,-1,0,+1,+2}) | `{ kind: 'enum-const', values: ['TYPE_BASE * TYPE_RATIO^n'] }` |
| `dsa-cite-space-derivation` | `SpaceVarSet.derivation` | `code` | `features/F-design-system/domain/space-engine.ts` (lines 25–34: `SPACE_UNIT * k` for k ∈ {0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 5.5, 6}) | `{ kind: 'enum-const', values: ['SPACE_UNIT * k'] }` |
| `dsa-cite-motion-2pow` | `MotionMasters.timing.derivation` | `code` | `features/F-design-system/config/board.ts` (lines 116–119; values are 2^8, 2^9, 2^10, 2^11) | `{ kind: 'enum-const', values: [256, 512, 1024, 2048] }` (Russell powers of 2, ms) |
| `dsa-cite-motion-light-overlap` | `MotionVarSet ∩ LightVarSet` | `code` | `features/F-design-system/domain/motion.ts` (module note lines 18–21 declaring intentional overlap) | `{ kind: 'union-string-literal', values: ['--S','--E','--T','--B','--G','--dur-attack','--dur-release'] }` |

29 citations declared. Each `expectedShape` is one of the four substrate §4 A-18 ExpectedShape kinds (`object`, `enum-const`, `union-string-literal`, `union-discriminated-object`). G-S8 evaluates structural conformance of each row (substantively, not vacuous). G-L11 evaluates audit-run snapshot stamping (substantively — every audit run against Design Standard must populate `referentSnapshotRef`).

**Decision-D anchor §10.D5:** the citation set is the builder's exhaustive enumeration from a non-trivial reverse-derivation. **Resolved** at L0 disposition Sprint 5.5 close — 29 citations confirmed exhaustive; future runtime evolution introducing new structural invariants triggers additive amendment per MA-S7. See §10.D5 for full disposition.

---

## §3 Structure

### §3.1 Axes (inherited)

Design Standard inherits metaframework-v3-1's seven-axis decomposition (A1 Identity, A2 Schema, A3 Structure, A4 Validity, A5 Lifecycle, A6 Coupling, A7 Judgment). Per substrate §1.3 S-03 permitted-multi-execution: axes are declared once at metaframework and consumed at multiple sites. Design Standard does not redeclare the seven-axis shell.

Per v3-1-spec §4.4 file-specific placement, Design Standard's own structural content populates §3.3–§3.9 below: four Design-local P1 Axis instances (Light, Type, Space, Motion), sub-axis instances, leaves, axioms (DSA1..DSA11), and the empty P7 declaration. P8 is **declared and non-empty** — seven procedure steps (S1–S7) under Mode = `generative` per §1; substrate §8.3 P8-binding satisfied directly per §3.7 with PR4 stage monotonicity [2,2,2,2,2,3,5] + PR5 stage↔kind alignment + PG6 amended self-checks all passing.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 4 | `{primitiveKind: 'P1', instanceCount: 4, basis: "Design-local mechanics axes declared at §3.3: Light, Type, Space, Motion. The seven metaframework axes (A1–A7) are the framework-file shape shell per substrate §9 File-shape applicability; Design-local P1 instances populate §3 Structure under the inherited shell under A3 Structure. Four-axis decomposition is derived directly from the F-design-system slice's four-engine architecture per SLICE.md lines 12–15 (light-engine, type-engine, space-engine, motion). Orthogonality verified §3.3 MECE check — no axis derives from another at v1.0; light masters consume H from board.ts, but H is itself a Light-axis master (axis-internal), not a derivation from Type/Space/Motion."}` |
| P2 Sub-axis | 14 | Light: 4 (Masters, Constants, Pinned, Compression-Density); Type: 3 (Masters, Authored-fonts, Authored-typography); Space: 3 (Master, Authored-engine-consumed, Authored-consumer-direct); Motion: 4 (Timing, Curves, Z-index, Overlap-with-Light). Declared §3.4. |
| P3 Leaf | 11 | One leaf per axiom condition per MA-St2 leaf atomicity: DSA1 (1) + DSA2 (1) + DSA3 (1) + DSA4 (1) + DSA5 (1) + DSA6 (1) + DSA7 (1) + DSA8 (1) + DSA9 (1) + DSA10 (1) + DSA11 (1) = 11. Declared §3.5. |
| P4 Axiom | 11 | DSA1, DSA2, DSA3, DSA4, DSA5, DSA6, DSA7, DSA8, DSA9, DSA10, DSA11. Declared §3.6. |
| P5 Gate | 11 | G-DS1, G-DS2, G-DS3, G-DS4, G-DS5, G-DS6, G-DS7, G-DS8, G-DS9, G-DS10, G-DS11. One primary gate per axiom per G-M1. Declared §4.2. |
| P6 Handoff rule | 4 | HR-DS1 (F-design-system R3 surface — config/contract re-exports), HR-DS2 (DesignSystemProvider R4 boundary — DOM application), HR-DS3 (forward-compatible — RSF v1.0 future, Sprint 8), HR-DS4 (forward-compatible — Cognitive Standard v1.3+ dispatch-side, Sprint 8). Declared §6.2. |
| P7 Judgment input | 0 | `{primitiveKind: 'P7', instanceCount: 0, basis: "Design Standard's derivations are fully mechanical: every output is a pure function of declared inputs (masters + composition context); no judgment inputs consumed at derivation time. Every DSA1..DSA11 condition reduces to substrate §6.3 mechanical-criterion ground — type-check (DSA1, DSA10), structural property (DSA2, DSA3, DSA9), reference resolution (DSA4, DSA11), cardinality (DSA8), deterministic-function-result (DSA5, DSA6, DSA7). Theme dispatch (light vs dark via I_LIGHT/I_DARK) is mechanical attribute observation per design-system-provider.tsx:34–38 (reads data-theme attribute, no judgment). MA-J4 emptyDeclared satisfied with positive basis."}` |
| P8 Procedure step | 7 | Seven derivation steps (S1–S7) declared §3.7 corresponding to: input validation (S1), four engine derivations (S2 light, S3 type, S4 space, S5 motion), gate execution (S6), DOM application via HR-DS2 handoff (S7). Mode = `generative` per §1 + L0 disposition Sprint 5.5 close → substrate §8.3 P8-binding satisfied directly. Stage distribution: [2,2,2,2,2,3,5] non-decreasing per PR4. Stage↔kind alignment per PR5: stages 2 and 5 → kind=mechanical (S1–S5, S7); stage 3 → kind=gate-execution (S6). Declared §3.7 with PR4 monotonicity + PR5 stage↔kind alignment + PG6 amended self-checks. Audit-close item 2 closes the substrate §10.2 PR5 violation introduced by the prior 6-instance amendment (S6 was incorrectly declared as stage-3 mechanical; substrate §10.2 PR5 binds stage 3 ↔ gate-execution; corrected by inserting explicit gate-execution step at S6 and relocating DOM application to a new stage-5 mechanical-handoff step S7). |

Positive empty-declaration markers conform to substrate §4 A-17 `EmptyPrimitiveDeclaration` typed shape: `{primitiveKind: PrimitiveKindRef, instanceCount: 0, basis: string with length ≥ 1}`. No implicit absence.

### §3.3 P1 Axis instances (Design-local mechanics axes)

Four mechanics axes derived from F-design-system's four-engine architecture per SLICE.md lines 12–15. MECE over Design Standard's concern space.

| id | Axis | Concern | Atomic question |
|---|---|---|---|
| `Light` | Light | Color, intensity, density, glow physics | Given an intensity master I and the masters {H, Thue, Tsat, R-scale, light constants, pinned materials, density scale, H compression}, what is the resulting set of CSS variables that encode the rendered light field across rest/hover/press tiers? |
| `Type` | Type | Type scale, fonts | Given the type masters (TYPE_BASE, TYPE_RATIO) and the authored font stacks, what is the resulting type scale (xs/sm/base/lg/xl) and font set? |
| `Space` | Space | Spacing grid, dimensions, radii | Given the space master (SPACE_UNIT) and authored dimensions, what is the resulting spacing grid and component-dimension set? |
| `Motion` | Motion | Timing, curves, z-layers | Given the motion masters (timing constants, curves, z-index), what is the resulting motion-variable set and JS-resolved constants? |

**MECE verification:**
- Orthogonality: Light governs the color/intensity field (continuous physical derivations from `(I, H, T*, R*)` via Beer-Lambert and inverse-square); Type governs character size and stack (modular scale from `TYPE_BASE * TYPE_RATIO^n`); Space governs unit grid and discrete dimensions (linear scale from `SPACE_UNIT * k` plus authored constants); Motion governs time-domain quantities (Russell-2-power timings, cubic-bezier curves, integer z-layers). No pair-overlap. The 7-key overlap between MotionVarSet and LightVarSet on `--S, --E, --T, --B, --G, --dur-attack, --dur-release` (per motion.ts module note 18–21) is **declared overlap of identical values** at the output layer, not axis-content overlap — both engines derive the same constants from the same MotionMasters via deterministic identity, and the duplication exists so each engine can be invoked independently. Cross-axis invariant declared at DSA11.
- Exhaustiveness: every CSS variable produced by F-design-system's four engines and every JS-resolved constant exported from contract/index.ts traces to exactly one Design-local axis (verified §3.8 universal-variables table; verified by referent citations §2.10 covering all four engines).
- No axis exceeds boundary: each axis's content strictly within its declared concern. Authored constants outside the four mechanics axes (font stacks, breakpoints, component pixel dimensions) are declared at the relevant axis (Type-Authored, Space-Authored) as **authored** atoms per DSA10, not as derivation outputs.

### §3.4 P2 Sub-axis instances

Per P1 axis per substrate §8.2:

**Light sub-axes (4):**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Light/masters` | Light masters (I_*, H, Thue, Tsat) | `leaf-DSA1-master-immutability`, `leaf-DSA2-pure-derivation` |
| `Light/constants` | Light constants (L_CEIL, SCALE_FLOOR, COOL_SHIFT, DARK_THRESHOLD, SCOTOPIC_HUE, BREATH_DELTA, PX_SCALE) | `leaf-DSA1-master-immutability` |
| `Light/pinned` | Pinned materials (BLUE, RED, AMBER frozen `as const`) | `leaf-DSA5-pinned-stability` |
| `Light/compression-density` | H compression tiers (H_REST, H_HOVER, H_PRESS) + density scale (DENSITY_FULL, _SOFT, _HALF, _FAINT) | `leaf-DSA6-density-derivation`, `leaf-DSA7-h-compression-derivation` |

**Type sub-axes (3):**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Type/masters` | TYPE_BASE, TYPE_RATIO | `leaf-DSA1-master-immutability`, `leaf-DSA3-russell-totality` |
| `Type/authored-fonts` | FONT_UI, FONT_MONO, FONT_BRAND | `leaf-DSA10-authored-atom-discipline` |
| `Type/authored-typography` | WEIGHT, LINE_HEIGHT, LETTER_SPACING (frozen `as const`) | `leaf-DSA10-authored-atom-discipline` |

**Space sub-axes (3):**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Space/master` | SPACE_UNIT | `leaf-DSA1-master-immutability`, `leaf-DSA3-russell-totality` (note: Space uses linear multipliers k ∈ {0.5..6}, not R-ratios per space-engine.ts; DSA3 applicability='applicable' per Type+Motion only — Space is a declared **exception** per DSA3 basis, see §3.6) |
| `Space/authored-engine-consumed` | RADIUS_BUBBLE, COL_WIDTH, COL_WIDTH_LG, LOGIN_WIDTH, DOT_SIZE, SPINNER_SIZE, SPINNER_SIZE_SM, DASH_MIN_H, PANEL_WIDTH | `leaf-DSA10-authored-atom-discipline` (atoms read by space-engine.ts:17–22 import set; consumed in deriveSpace() body per space-engine.ts:25–62; contribute to DSA8 SpaceVarSet cardinality of 24) |
| `Space/authored-consumer-direct` | BREAKPOINT_SM, BREAKPOINT_MD, BREAKPOINT_LG | `leaf-DSA10-authored-atom-discipline` (atoms NOT imported by space-engine.ts; read directly at consumer sites via media queries — the breakpoint values are consumed as JavaScript matchMedia/CSS @media query thresholds, not as CSS variable derivations; do NOT contribute to DSA8 SpaceVarSet cardinality. Sub-axis split per audit-close item 1 BREAKPOINT MECE fix: bundling engine-consumed atoms with consumer-direct atoms violates P2 sub-axis MECE because the two atom classes have distinct consumption paths and distinct downstream-axiom relationships) |

**Motion sub-axes (4):**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Motion/timing` | ATTACK, RELEASE, BLOOM, CYCLE_STREAM (Russell powers of 2 ms) | `leaf-DSA1-master-immutability`, `leaf-DSA2-pure-derivation` |
| `Motion/curves` | CURVE_S, _E, _T, _B, _G | `leaf-DSA1-master-immutability` |
| `Motion/z-index` | Z field (frozen `as const`; integer z-layers) | `leaf-DSA1-master-immutability`, `leaf-DSA10-authored-atom-discipline` |
| `Motion/light-overlap` | --S, --E, --T, --B, --G, --dur-attack, --dur-release shared with Light | `leaf-DSA11-cross-engine-overlap-identity` |

**Sub-axis attachment note:** Several sub-axes share the same axiom-anchored leaf because the axiom condition is unitary at the axis level (e.g., DSA1 covers Light/masters + Light/constants + Type/masters + Space/master + Motion/timing + Motion/curves + Motion/z-index jointly via master-immutability). MA-St2 leaf-atomicity satisfied: one leaf per axiom condition; sub-axes provide the structural decomposition for §3.8 universal-variables purposes; axiom binding is at the axiom-condition level per G-M1.

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic per substrate leaf primitive shape):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-DSA1-master-immutability` | `axiom` | `Every master atom in DesignInput is typed `as const` or declared as a top-level export with no exported mutator; runtime cannot mutate a master between application boots — per DSA1 type-check (TypeScript const-assertion presence)` |
| `leaf-DSA2-pure-derivation` | `axiom` | `Each engine function (deriveLight, deriveType, deriveSpace, deriveMotion) is a pure function of its declared imports; no I/O, no closure-captured external state, no Math.random, no Date.now during derivation — per DSA2 structural property (function-purity predicate over engine bodies)` |
| `leaf-DSA3-russell-totality` | `axiom` | `Every Type and Motion derivation uses R-ratios from {R1, R2, R3, R4} (or 2^n powers for Motion timings — equivalent to R4^n), with no ad-hoc multipliers; Space is the declared exception (linear k ∈ {0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 5.5, 6} per space-engine.ts:25–34) — per DSA3 reference resolution (multiplier ∈ Russell-derived enum or declared exception)` |
| `leaf-DSA4-light-physics-conformance` | `axiom` | `light-engine concentration() satisfies 1/(1-Hx)^2 (Beer-Lambert form, light-engine.ts:63–65); absorption() satisfies exp(-Hx) (inverse-square / exponential decay form, light-engine.ts:67–69); darkBlend() interpolates COOL_SHIFT * max(0, 1 - I/DARK_THRESHOLD) (cool-shift physics for low-intensity scotopic blend, light-engine.ts:71–73) — per DSA4 deterministic-function-result (predicate over engine code constants matching declared physics)` |
| `leaf-DSA5-pinned-stability` | `axiom` | `PinnedMaterials.{BLUE, RED, AMBER} are declared `as const` literals at board.ts:44–46; their {hue, sat, L} triples are not derived from any other master and remain frozen across all theme transitions; light-engine consumes them by reference (BLUE.hue, BLUE.sat, BLUE.L per light-engine.ts:101) without modifying — per DSA5 structural property (`as const` marker presence + non-derivation invariant)` |
| `leaf-DSA6-density-derivation` | `axiom` | `DensityScale.DENSITY_SOFT === 1/R1 AND DENSITY_HALF === 1/R4 AND DENSITY_FAINT === 1/(R4*R4) per board.ts:51–53; DENSITY_FULL === 1.0 (identity) per board.ts:50; no density value derives from any non-Russell quantity — per DSA6 deterministic-function-result (literal expression match against declared formulas)` |
| `leaf-DSA7-h-compression-derivation` | `axiom` | `H_REST === H AND H_HOVER === H/R1 AND H_PRESS === H/R4 per board.ts:57–59; H is the Light master from board.ts:21; no H-compression value derives from any non-Russell quantity — per DSA7 deterministic-function-result (literal expression match against declared formulas)` |
| `leaf-DSA8-cardinality` | `axiom` | `LightVarSet has exactly 70 keys (25 shared + 45 per-tier per light-engine.ts comment line 15; mechanically: 25 shared `out[...]` assignments outside the tier loop + 3 tiers × 15 per-tier assignments = 25 + 45 = 70); TypeVarSet has exactly 8 keys (per type-engine.ts comment line 15); SpaceVarSet has exactly 24 keys (per space-engine.ts comment line 15); MotionVarSet has exactly 8 keys (per motion.ts comment line 15) — per DSA8 cardinality (output-set size predicate per engine)` |
| `leaf-DSA9-dom-application-isolation` | `axiom` | `DesignSystemProvider in features/F-design-system/exec/design-system-provider.tsx is the only file in F-design-system that accesses the DOM (per file note line 19: "ONLY file in F-design-system that accesses DOM"); R4 layer assignment per slice doc line 49 enforces this; no other code path writes design tokens (CSS variables, derived constants) to document.documentElement.style — per DSA9 structural property (file-set predicate: DOM-accessing files in F-design-system equals {design-system-provider, use-planet, use-page-transition} per SLICE.md, of which only design-system-provider writes design tokens)` |
| `leaf-DSA10-authored-atom-discipline` | `axiom` | `Every Design-Standard-declared atom that is NOT a derivation output (font stacks FONT_*; weights WEIGHT; line heights LINE_HEIGHT; letter spacings LETTER_SPACING; component dimensions RADIUS_BUBBLE, COL_WIDTH*, LOGIN_WIDTH, BREAKPOINT_*, DOT_SIZE, SPINNER_SIZE*, DASH_MIN_H, PANEL_WIDTH; z-index Z) is declared verbatim in board.ts as a frozen literal (`as const` marker present where applicable) and consumed by reference; no engine derives an authored atom from a master — per DSA10 type-check (`as const` presence) + structural property (no derivation predicate matching authored atom identifiers)` |
| `leaf-DSA11-cross-engine-overlap-identity` | `axiom` | `For every key k ∈ {'--S', '--E', '--T', '--B', '--G', '--dur-attack', '--dur-release'}: deriveLight(I)[k] === deriveMotion()[k] for any I — i.e., the 7-key intersection between LightVarSet and MotionVarSet evaluates to byte-identical strings; the duplication is declared at motion.ts module note lines 18–21 ("deriveMotion() exists so motion values can be set independently without recalculating light"); identity is enforced by both engines reading the same MotionMasters constants (CURVE_S..CURVE_G, ATTACK, RELEASE) per shared imports — per DSA11 reference resolution (key-set equality + value identity over the overlap)` |

### §3.6 P4 Axiom instances (DSA1..DSA11)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate). DSA1, DSA10 are cross-axis (apply to multiple Design-local axes) — explicit cross-axis-invariant declared per substrate §9; primary attachment per AxR1 is to the axis where the dominant referent lives.

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **DSA1** | `Light` (cross-axis: all four — primary at Light because light masters are the largest master set) / `leaf-DSA1-master-immutability` | Every master atom declared in `features/F-design-system/config/board.ts` (LightMasters lines 19–23, RussellScale lines 27–30, LightConstants lines 34–40, PinnedMaterials lines 44–46 with `as const`, DensityScale lines 50–53, HCompressionTiers lines 57–59, TypeMasters lines 63–64, TypeAuthored.weight line 74 with `as const`, TypeAuthored.lineHeight line 78 with `as const`, TypeAuthored.letterSpacing lines 82–90 with `as const`, SpaceMasters line 94, SpaceAuthored lines 98–112, MotionMasters timing lines 116–119, MotionMasters curves lines 123–127, MotionMasters.Z lines 131–141 with `as const`) is exported as a top-level `const` declaration with no module-level mutator function exporting modification access. | type-check (TypeScript `const` declaration + `as const` assertion presence) |
| **DSA2** | `Light` (cross-axis: applies to all four engines — primary at Light per same rationale as DSA1) / `leaf-DSA2-pure-derivation` | Every engine function in `features/F-design-system/domain/{light-engine, type-engine, space-engine, motion}.ts` is a pure function of its declared imports: function bodies contain no `Math.random`, no `Date.now`, no `new Date()`, no `fetch`, no `setTimeout`, no `setInterval`, no DOM access (`document.*`, `window.*`), no closure capture of external mutable state. (Helper functions internal to light-engine — `hslRgb`, `rgb`, `rgbStr`, `concentration`, `absorption`, `darkBlend`, `shiftedHue`, `shiftedSat` — are also pure per same predicate.) | structural property (purity predicate over engine module bodies) |
| **DSA3** | `Type` (primary; cross-axis with Motion at output level) / `leaf-DSA3-russell-totality` | Every multiplier used in Type derivation is a power of TYPE_RATIO ∈ {R1^-2, R1^-1, R1^0=1, R1^+1, R1^+2} per type-engine.ts:24–28; every multiplier used in Motion timing derivation is a Russell power of 2 ∈ {2^8=256, 2^9=512, 2^10=1024, 2^11=2048} per board.ts:116–119 (equivalent to R4^n powers). Space derivation uses linear multipliers k ∈ {0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 5.5, 6} per space-engine.ts:25–34 — declared as **exception** to Russell-totality with basis text in §3.9 vocabulary entry for `space-linear-grid` (linear pixel grid serves authored optical hierarchy; not a Russell ratio). | reference resolution (multiplier ∈ Russell-set ∪ declared-exception-set per axis) |
| **DSA4** | `Light` / `leaf-DSA4-light-physics-conformance` | `concentration(Hx)` evaluates `1 / ((1 - Hx) * (1 - Hx))` per light-engine.ts:63–65 (Beer-Lambert concentration form for absorbance H over reference path); `absorption(Hx)` evaluates `Math.exp(-Hx)` per light-engine.ts:67–69 (Beer-Lambert exponential-decay form); `darkBlend(I)` evaluates `COOL_SHIFT * Math.max(0, 1 - I / DARK_THRESHOLD)` per light-engine.ts:71–73 (linear interpolation of COOL_SHIFT toward scotopic regime as I drops below DARK_THRESHOLD); `shiftedHue(baseHue, I)` evaluates `baseHue + (SCOTOPIC_HUE - baseHue) * darkBlend(I)` per light-engine.ts:75–77 (hue interpolation toward SCOTOPIC_HUE under low intensity); `shiftedSat(baseSat, I)` evaluates `baseSat * (1 - darkBlend(I) * 0.5)` per light-engine.ts:79–81 (saturation desaturation at low intensity). | deterministic-function-result (formula identity over engine code) |
| **DSA5** | `Light` / `leaf-DSA5-pinned-stability` | `BLUE`, `RED`, `AMBER` at board.ts:44–46 are declared with `as const` literal-type assertions; their `{hue, sat, L}` triples are encoded as numeric literals; no engine code reassigns or derives these values from any other master. light-engine.ts consumes them via property access (`BLUE.hue`, `BLUE.sat`, `BLUE.L` at lines 101, 102, 150 etc.) without modification. | structural property (`as const` marker + non-derivation predicate over engine consumers) |
| **DSA6** | `Light` / `leaf-DSA6-density-derivation` | `DENSITY_FULL === 1.0`, `DENSITY_SOFT === 1/R1`, `DENSITY_HALF === 1/R4`, `DENSITY_FAINT === 1/(R4*R4)` per board.ts:50–53; expressions match literally; R1, R4 are Russell scale members from board.ts:27, 30. | deterministic-function-result (literal expression match) |
| **DSA7** | `Light` / `leaf-DSA7-h-compression-derivation` | `H_REST === H`, `H_HOVER === H/R1`, `H_PRESS === H/R4` per board.ts:57–59; expressions match literally; H is Light master from board.ts:21; R1, R4 are Russell scale members from board.ts:27, 30. | deterministic-function-result (literal expression match) |
| **DSA8** | `Light` (primary; cross-axis cardinality predicate over all four engines) / `leaf-DSA8-cardinality` | `\|keys(deriveLight(I))\| === 70` for any I (25 shared assignments + 3 tiers × 15 per-tier assignments = 70 per light-engine.ts:104–138 (shared block, 25 keys including `--bg, --surface, --canyon, --blue, --red, --text, --text-sec, --text-dis, --text-halo, --density-full, --density-soft, --density-half, --density-faint, --identity-density, --overlay-bg, --S, --E, --T, --B, --G, --dur-attack, --dur-release, --halo-bias, --scale-floor, --amber`) + per-tier loop lines 154–185 with 15 keys per tier (`--ink-{name}, --glow-color-{name}` + 3 levels × 4 colors `--glow-{color}-{name}-{level}` = 12 + `--shadow-{name}` = 15)); `\|keys(deriveType())\| === 8` per type-engine.ts:23–32 (5 type sizes + 3 font stacks); `\|keys(deriveSpace())\| === 24` per space-engine.ts:40–65; `\|keys(deriveMotion())\| === 8` per motion.ts:29–38. | cardinality (output-set size predicate per engine) |
| **DSA9** | `Light` (primary; cross-axis with all four — DOM application is the perimeter of the entire Design Standard surface) / `leaf-DSA9-dom-application-isolation` | The set of files in `features/F-design-system/` that perform DOM I/O is `{exec/design-system-provider.tsx, exec/use-planet.ts, exec/use-page-transition.ts}` per SLICE.md lines 22–24 (R4 layer assignment); of these, only `exec/design-system-provider.tsx` writes design-token CSS variables to `document.documentElement.style` per design-system-provider.tsx:40–45 (`setVars` helper) called at lines 56–63 (mount effect). `use-planet.ts` and `use-page-transition.ts` perform DOM manipulation for animation choreography, not design-token writes. No file in `config/`, `domain/`, or `contract/` accesses `document.*` or `window.*` (per file notes lines 9–11 across all R0/R1/R3 files: `wires-out: (internal — consumed by F-design-system barrel)`). | structural property (file-set predicate; DOM-token-write site = singleton {design-system-provider}) |
| **DSA10** | `Type` (primary; cross-axis with Space and Motion — authored atoms exist in all three axes; Light has zero authored atoms outside the master/constant/pinned/derivation set) / `leaf-DSA10-authored-atom-discipline` | Every authored atom (font stacks FONT_UI/FONT_MONO/FONT_BRAND at board.ts:68–70; WEIGHT at line 74 frozen `as const`; LINE_HEIGHT at line 78 frozen `as const`; LETTER_SPACING at lines 82–90 frozen `as const`; RADIUS_BUBBLE at line 98; COL_WIDTH/COL_WIDTH_LG/LOGIN_WIDTH at lines 99–101; BREAKPOINT_SM/MD/LG at lines 102–104; DOT_SIZE/SPINNER_SIZE/SPINNER_SIZE_SM/DASH_MIN_H/PANEL_WIDTH at lines 108–112; Z at lines 131–141 frozen `as const`) is declared as a verbatim numeric or string literal in board.ts and consumed by reference at the relevant engine site (type-engine for FONT_*, space-engine for component dimensions, motion module re-export for Z). No engine function contains a derivation that produces an authored atom from a master. | type-check (`as const` presence where applicable) + structural property (no derivation predicate; authored atoms are leaf imports in engine consumers) |
| **DSA11** | `Motion` (primary; cross-axis with Light — declared overlap of identical values per motion.ts module note lines 18–21) / `leaf-DSA11-cross-engine-overlap-identity` | For every key `k ∈ {'--S', '--E', '--T', '--B', '--G', '--dur-attack', '--dur-release'}`: `deriveLight(I)[k] === deriveMotion()[k]` for any I. Light's assignments at light-engine.ts:129–136 produce these keys from the same MotionMasters constants (CURVE_S, CURVE_E, CURVE_T, CURVE_B, CURVE_G, ATTACK, RELEASE) imported at lines 27–28; Motion's assignments at motion.ts:30–36 produce the same keys from the same imports at lines 23–25. The overlap is by-identity, not by-coincidence; both engines compute the same string from the same constants. | reference resolution (key-set equality {7 keys} ∩ value identity over overlap) |

**AxR1 self-check:** each axiom binds to exactly one primary axis/leaf per attachment column. DSA1, DSA2, DSA8, DSA9 are explicit cross-axis-invariants per substrate §9 (one primary axis declared, cross-axis applicability declared). G-G13 cross-axis universal at metaframework §3.2.1 governs. Pass.

**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.

**AxR3 self-check:** axiom set is the v1.0 baseline (no predecessor — Design Standard v1.0 is bootstrap-lift per §1.1 GenesisDeclaration). DSA1..DSA11 declared once; future versions amend additively per MA-L1 + MA-S7. Pass.

**AxR4 self-check:** all axiom text declarative (no imperative mood; stated as invariant conditions). Pass.

**Decision-D anchor §10.D4:** axiom enumeration completeness. Builder enumerated 11 axioms by inspection of the F-design-system runtime referent. **Resolved** at L0 disposition Sprint 5.5 close — 11 axioms confirmed exhaustive; future runtime evolution introducing new structural invariants triggers additive amendment per MA-S7. See §10.D4 for full disposition.

### §3.7 P8 Procedure step instances (S1–S7 under Mode = generative per §1)

Per substrate §8.3 (`P8 — Procedure step. Mode = generative only.`): Mode = `generative` per §1 → P8 is **declared and non-empty**. P8 satisfies the substrate Mode-binding rule. Seven instances S1–S7 corresponding to the input-validate → engine-derive → gate-execute → DOM-apply pipeline. Each step declares the amended P8 shape per substrate §8.3 + §11.2 PG6 amended (`{id, order, stage, kind, input, output, derivation | gates, gates}` — `derivation` for kind=mechanical, `gates` field at top-level for kind=gate-execution).

**Substrate §10.2 PR5 stage↔kind binding (consumed by reference; string-typed):**
- Stage 1 ↔ judgment-input (P7 sourcing)
- Stage 2 ↔ mechanical (derivation steps)
- Stage 3 ↔ gate-execution
- Stage 5 ↔ mechanical (handoff steps; HR-bound)

P7=0 per §3.2 + §7.1 → no stage-1 steps exist for Design Standard. All Design Standard P8 steps fall under stages 2 (mechanical derivation), 3 (gate execution), or 5 (mechanical handoff).

| id | order | stage | kind | input | output | kind-specific field | gates |
|---|---|---|---|---|---|---|---|
| **S1** | 1 | 2 | mechanical | runtime-supplied `CompositionContext` (data-theme attribute via getBaseI per design-system-provider.tsx:34–38) | validated `DesignInput` (masters loaded from board.ts; baseI resolved to I_LIGHT or I_DARK) | `derivation = "validate baseI ∈ {I_LIGHT, I_DARK} per LightMasters; assert all master atoms loaded from config/board.ts module imports satisfy DSA1 master-immutability"` | `gates = ['G-DS1']` |
| **S2** | 2 | 2 | mechanical | validated DesignInput | `LightVarSet` (70 keys) | `derivation = "invoke deriveLight(baseI) per features/F-design-system/domain/light-engine.ts:85; pure function over (baseI, LightMasters\\{I_*}, LightConstants, PinnedMaterials, RussellScale, DensityScale, HCompressionTiers, MotionMasters.curve*, MotionMasters.{ATTACK,RELEASE})"` | `gates = ['G-DS2', 'G-DS4', 'G-DS5', 'G-DS6', 'G-DS7', 'G-DS8 (light)']` |
| **S3** | 3 | 2 | mechanical | validated DesignInput | `TypeVarSet` (8 keys) | `derivation = "invoke deriveType() per features/F-design-system/domain/type-engine.ts:22; pure function over (TypeMasters, TypeAuthored.font*); derivation pattern TYPE_BASE * TYPE_RATIO^n per DSA3"` | `gates = ['G-DS2', 'G-DS3', 'G-DS8 (type)']` |
| **S4** | 4 | 2 | mechanical | validated DesignInput | `SpaceVarSet` (24 keys) | `derivation = "invoke deriveSpace() per features/F-design-system/domain/space-engine.ts:24; pure function over (SpaceMasters, SpaceAuthored.{engine-consumed}); derivation pattern SPACE_UNIT * k for k ∈ {0.5..6} (DSA3 declared exception) plus authored constants per DSA10. BREAKPOINT_* atoms (Space/authored-consumer-direct sub-axis per §3.4) are NOT consumed by deriveSpace; they are read directly at consumer sites and do not contribute to SpaceVarSet."` | `gates = ['G-DS2', 'G-DS8 (space)', 'G-DS10 (authored)']` |
| **S5** | 5 | 2 | mechanical | validated DesignInput | `MotionVarSet` (8 keys) + `TIMING` + `CURVES` + `Z` constants | `derivation = "invoke deriveMotion() per features/F-design-system/domain/motion.ts:28; pure function over (MotionMasters); also produces JS-resolved TIMING + CURVES per motion.ts:41–42 and re-exports Z per motion.ts:43"` | `gates = ['G-DS2', 'G-DS8 (motion)', 'G-DS11']` |
| **S6** | 6 | 3 | gate-execution | `DesignVarBundle` (LightVarSet + TypeVarSet + SpaceVarSet + MotionVarSet) plus the F-design-system file set (board.ts + four engine modules + design-system-provider.tsx) | gate evaluation results: `Record<gateId, GateResult>` per substrate §11 GateResult typed shape | (no `derivation` field — kind=gate-execution; substrate §10.2 PR5 binds stage 3 ↔ gate-execution) | `gates = ['G-DS1', 'G-DS2', 'G-DS3', 'G-DS4', 'G-DS5', 'G-DS6', 'G-DS7', 'G-DS8', 'G-DS9', 'G-DS10', 'G-DS11']` (full DSA suite executed against the just-derived DesignVarBundle and the runtime referent file set; framework-audit-tier inherited gates execute at framework-audit time, not at this step) |
| **S7** | 7 | 5 | mechanical | `DesignVarBundle` (gate-passed) | DOM-applied state (CSS variables on `document.documentElement.style`) | `derivation = "invoke setVars per features/F-design-system/exec/design-system-provider.tsx:40–45 (sequence: type, space, motion, light per mount effect lines 56–63); R4 boundary; only DOM-token-write site per DSA9; performs I/O — declared at R4. HR-DS2 (R3 → R4 handoff per §6.2) governs this step's perimeter crossing; substrate §10.2 PR5 binds stage 5 ↔ mechanical-handoff."` | — |

**PR4 — stage monotonicity:** stage values [2, 2, 2, 2, 2, 3, 5] non-decreasing across order. Pass.

**PR5 — stage↔kind alignment:** S1–S5 are stage=2 + kind=mechanical (substrate §10.2 stage 2 ↔ mechanical). S6 is stage=3 + kind=gate-execution (substrate §10.2 stage 3 ↔ gate-execution). S7 is stage=5 + kind=mechanical (substrate §10.2 stage 5 ↔ mechanical-handoff). All 7 aligned. Pass.

**PG6 amended (substrate §11.2):** S1–S5, S7 declare `derivation` (kind=mechanical); S6 declares `gates` at top-level (kind=gate-execution; no `derivation` field per kind discriminator). All steps populate the appropriate kind-specific fields. Pass.

**Substrate §8.3 P8-binding satisfaction:** Mode = generative + P8 declared with seven instances spanning the input-validate → derive → gate → handoff pipeline → binding satisfied. The four-engine derivation block (S2–S5) plus the gate-execution step (S6) plus the DOM-application handoff (S7) covers the substrate §8.3 admitted stages (2, 3, 5) for generative-mode P8 instances; no structural drift; substrate rule applied directly.

**Audit-close item 2 disposition:** the prior 6-instance declaration violated substrate §10.2 PR5 (S6 was incorrectly declared as stage=3 + kind=mechanical, but substrate §10.2 binds stage 3 ↔ gate-execution exclusively). Correction: explicit gate-execution step inserted at S6 (stage=3, kind=gate-execution, gates=full DSA suite); DOM application relocated to S7 (stage=5, kind=mechanical, HR-DS2-bound handoff). Audit-close item 2 closes the violation. Cascades documented at §10.D2 status, §3.2 P8 row, §3.1.

### §3.8 Universal-variables table

Per substrate §3.5 (each axis expressed across all four universal variables, producing a four-cell row). Per MA-St3 (no content under more than one axis). MA-G6 strict: every cell is named type, enum literal, or inlined shape.

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Light` | `Semver` (bound to `design-standard` version `1.0`; LightMasters frozen at this version per DSA1) | `string` enum (`'I_LIGHT' \| 'I_DARK'`) (bound to `CompositionContext.baseI` via runtime data-theme attribute per design-system-provider.tsx:34–38) | `LightMasters` paired with `RussellScale + LightConstants + PinnedMaterials + DensityScale + HCompressionTiers` (Light masters consume Russell + Constants + Pinned + Density + H-compression jointly per light-engine.ts:19–28 import set) | `DesignAxisPositional` enum `'declared' \| 'derived' \| 'applied'` (declared §3.9 vocabulary; tracks per-axis lifecycle state through pipeline) |
| `Type` | `Semver` (bound to `design-standard` version `1.0`; TypeMasters frozen at this version per DSA1) | `string` enum (`'TYPE_BASE' \| 'TYPE_RATIO' \| 'FONT_UI' \| 'FONT_MONO' \| 'FONT_BRAND' \| 'WEIGHT' \| 'LINE_HEIGHT' \| 'LETTER_SPACING'`) (master + authored atom keys) | `TypeMasters` paired with `TypeAuthored` (Type derivation consumes both jointly per type-engine.ts:17–20 import set) | `DesignAxisPositional` (shared with Light; per-axis lifecycle position) |
| `Space` | `Semver` (bound to `design-standard` version `1.0`; SpaceMasters + SpaceAuthored frozen at this version per DSA1 + DSA10) | `string` enum (`'SPACE_UNIT' \| 'RADIUS_BUBBLE' \| 'COL_WIDTH' \| 'COL_WIDTH_LG' \| 'LOGIN_WIDTH' \| 'BREAKPOINT_SM' \| 'BREAKPOINT_MD' \| 'BREAKPOINT_LG' \| 'DOT_SIZE' \| 'SPINNER_SIZE' \| 'SPINNER_SIZE_SM' \| 'DASH_MIN_H' \| 'PANEL_WIDTH'`) | `SpaceMasters` paired with `SpaceAuthored` (Space derivation consumes both jointly per space-engine.ts:17–22 import set; linear-grid exception declared at DSA3) | `DesignAxisPositional` (shared) |
| `Motion` | `Semver` (bound to `design-standard` version `1.0`; MotionMasters frozen at this version per DSA1) | `string` enum (`'ATTACK' \| 'RELEASE' \| 'BLOOM' \| 'CYCLE_STREAM' \| 'CURVE_S' \| 'CURVE_E' \| 'CURVE_T' \| 'CURVE_B' \| 'CURVE_G' \| 'Z'`) | `MotionMasters` paired with self (Motion derivation consumes only its own masters per motion.ts:23–26 import set; cross-engine overlap with Light per DSA11 is declared at output level, not input level) | `DesignAxisPositional` (shared) |

Every cell is a named type, an enum literal set, an inlined type shape, or a declared type-to-type paired reference. No prose cells.

**MA-St3 self-check:** no content appears under more than one axis at the input declaration level. The 7-key value-overlap between LightVarSet and MotionVarSet at the output level is declared at DSA11 as a cross-axis-invariant per substrate §9 cross-axis-invariant rule, not duplication. Pass.

### §3.9 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Substrate terms referenced by identifier per S1.

| Term | Declared | Definition |
|---|---|---|
| `physical-derivation` | §1 primitive | atomic unit of work in Design Standard: one master + one derivation rule producing one derived value via declared physics; framework-local atomic operation analogous to LM's `traversal` and Cognitive's `encode-step` |
| `master` | §2.1 | a typed atom declared in `features/F-design-system/config/board.ts` as a top-level `const` export; immutable per DSA1 |
| `authored atom` | §2.1 + DSA10 | a Design-Standard-declared atom that is NOT a derivation output; declared verbatim in board.ts as a frozen literal; consumed by reference (not derived); covers font stacks, weights, line heights, letter spacings, component dimensions, breakpoints, z-index |
| `derivation` | §2.2 + DSA2 | a pure function from masters and composition context to a CSS variable map or JS-resolved constant; implemented in one of the four engines (light-engine, type-engine, space-engine, motion); satisfies DSA2 purity predicate |
| `engine` | §2.2 | one of the four pure-function modules in `features/F-design-system/domain/`: light-engine.ts, type-engine.ts, space-engine.ts, motion.ts |
| `Russell scale` | §3.6 DSA3 | the four ratios `{R1=2^(1/4), R2=2^(1/2), R3=2^(3/4), R4=2}` declared at board.ts:27–30; used as the totality-set for Type and Motion multipliers per DSA3 |
| `space-linear-grid` | §3.6 DSA3 basis | the linear pixel grid `SPACE_UNIT * k` for k ∈ {0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 5.5, 6} per space-engine.ts:25–34; declared exception to DSA3 Russell-totality with basis "linear pixel grid serves authored optical hierarchy at integer-pixel boundaries; not derivable from Russell ratios" |
| `Beer-Lambert` | §3.6 DSA4 | the absorbance-to-intensity decay relations encoded in light-engine.ts:63–69; `concentration(Hx) = 1/(1-Hx)^2` (concentration form) and `absorption(Hx) = exp(-Hx)` (exponential decay) |
| `inverse-square` | §3.6 DSA4 | declared physics class for light-engine derivations; in v1.0, the Beer-Lambert exponential-decay form serves as the inverse-square equivalent (intensity drops as exp(-Hx) over absorbance H per ray path); literal inverse-square (1/r^2) is reserved for future glow-falloff amendments |
| `pinned material` | §3.6 DSA5 | one of three frozen `{hue, sat, L}` triples (BLUE, RED, AMBER) at board.ts:44–46; not derived; stable across themes |
| `H compression tier` | §3.6 DSA7 | one of three derivations of the H master scaling absorbance for interaction state: `H_REST = H` (rest), `H_HOVER = H/R1` (hover, lighter), `H_PRESS = H/R4` (press, lightest) per board.ts:57–59 |
| `density scale` | §3.6 DSA6 | four levels of Russell-derived opacity: `DENSITY_FULL=1.0, DENSITY_SOFT=1/R1, DENSITY_HALF=1/R4, DENSITY_FAINT=1/(R4*R4)` per board.ts:50–53 |
| `R-layer` | inherited from LIV-Standard | layer assignment in F-design-system: R0 (config/board, config/tokens), R1 (domain/engines), R3 (contract/primitives, contract/index), R4 (exec/design-system-provider, exec/use-planet, exec/use-page-transition) per SLICE.md lines 4 |
| `R3 surface` | §6.2 HR-DS1 | the contract-layer re-export site `features/F-design-system/contract/index.ts`; consumers import masters and motion constants via this barrel per slice doc lines 31–34 |
| `R4 boundary` | §6.2 HR-DS2 | the exec-layer DOM-write site `features/F-design-system/exec/design-system-provider.tsx`; sole DOM-token-write site per DSA9 |
| `DesignAxisPositional` | §3.8 | enum `'declared' \| 'derived' \| 'applied'` — per-axis lifecycle position: `declared` after master loading + DSA1 satisfaction; `derived` after engine invocation produces output; `applied` after R4 boundary writes to DOM |
| `bootstrap genesis` | §1.1 + §10.D3 | substrate §4 A-14 `bootstrapped: true` declaration mode: spec md formalizes a runtime referent that pre-dates the spec; reverse-derivation replaces forward-generation S2 step in GP v1.1.6 |
| `referent` | §2.10 | the F-design-system slice at HEAD `9862092` (15 files, 822 lines); the runtime artifact whose mechanics this spec md formalizes per substrate §4 A-18 ReferentCitation |

---

## §4 Validity

### §4.1 Gate count

Design Standard declares **11 own primary gates** (G-DS1 .. G-DS11, 1:1 with DSA1..DSA11 per G-M1). Plus **85 framework-tier metaframework gates** inherited (per metaframework v3.2.7 §4.1 enumeration: 7 PG + 68 axiom gates including cycle-1 G-S7+G-V11 and cycle-2 G-V10+G-S8+G-L11 + 1 MA-G13 + 5 F-69 universal + 4 meta).

| Tier | Count | Source | Executed when Design Standard is audit target |
|---|---|---|---|
| Substrate gates (SG1–SG5) | 5 | substrate §11.5 | run once, not per framework |
| Design-own axiom gates (G-DS*) | 11 | this §4.2 | framework-audit applies DSA1..DSA11 suite per MA-V1; **substantive first-run** at audit time (not vacuous-pass — referentCitations non-empty per §1) |
| Metaframework primitive gates (PG1..PG7) | 7 | metaframework §4.1 | inherited; applied by framework-audit at E1..E7 of generation-procedure S3..S9 |
| Metaframework axiom gates (G-I1..G-J5, G-G13) | 69 | metaframework §4.1 (post-cycle-2 v3.2.7) | inherited; test Design Standard's conformance to MA-I1..MA-J5 + MA-G13. **G-V10 (spec↔referent), G-S8 (citation shape), G-L11 (snapshot stamping) execute substantively** per non-empty §2.10 citation set. |
| Metaframework universal gates (G-U1..G-U5) | 5 | metaframework §4.1 | inherited |
| Metaframework meta-gates (G-M1..G-M4) | 4 | metaframework §4.1 | inherited |
| **Total per-audit framework-tier gates** | **11 + 85 = 96** | | |

Design Standard's 11 own gates execute in addition to the 85 inherited — same pattern as VS v1.0 §4.1 + Plan v2.2 §4.1 + AS v2.2 §4.1 (framework-own gates supplement, do not replace, the inherited framework-tier suite).

### §4.2 Design-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + G-M1 (every axiom has exactly one primary gate). 11 axioms → 11 primary gates, 1:1.

| Gate | Tests axiom | Predicate (machine-form) | Ground class |
|---|---|---|---|
| **G-DS1** | DSA1 | For every master atom name `m` declared in the §1 `consumes` row: parse `features/F-design-system/config/board.ts`; locate the top-level `export const m = ...` declaration; verify (a) declaration is `const` (not `let`, `var`); verify (b) for object-typed masters (PinnedMaterials.{BLUE,RED,AMBER}, TypeAuthored.WEIGHT, TypeAuthored.LINE_HEIGHT, TypeAuthored.LETTER_SPACING, MotionMasters.Z), declaration carries `as const` assertion; verify (c) module exports no mutator function whose body would assign to `m` or any subfield. | type-check (`const` keyword + `as const` assertion presence per declared-set) |
| **G-DS2** | DSA2 | For each engine module `e ∈ {light-engine.ts, type-engine.ts, space-engine.ts, motion.ts}`: parse exported function bodies; verify zero occurrences of `Math.random`, `Date.now`, `new Date(`, `fetch(`, `setTimeout(`, `setInterval(`, `document.`, `window.`; verify no closure-captured external mutable state (every identifier referenced in function body resolves either to a function parameter or to an immutable `const` import from `../config/board`). | structural property (purity predicate over function bodies; AST scan or regex over engine sources) |
| **G-DS3** | DSA3 | For type-engine.ts: parse derivation expressions at lines 24–28; verify each non-base size uses `Math.pow(TYPE_RATIO, n)` for integer `n ∈ {-2, -1, 1, 2}` (n=0 is `TYPE_BASE` itself with no multiplier). For motion timing in board.ts:116–119: verify each value is exactly `2^n` for integer `n ∈ {8, 9, 10, 11}`. For space-engine.ts:25–34: verify each multiplier `k ∈ {0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 5.5, 6}` (declared exception per DSA3 basis); reject any other multiplier value. | reference resolution (multiplier ∈ Russell-set ∪ declared-exception-set per axis) |
| **G-DS4** | DSA4 | Parse light-engine.ts function bodies and verify literal expressions: `concentration` body (line 64) === `1 / ((1 - Hx) * (1 - Hx))`; `absorption` body (line 68) === `Math.exp(-Hx)`; `darkBlend` body (line 72) === `COOL_SHIFT * Math.max(0, 1 - I / DARK_THRESHOLD)`; `shiftedHue` body (line 76) === `baseHue + (SCOTOPIC_HUE - baseHue) * darkBlend(I)`; `shiftedSat` body (line 80) === `baseSat * (1 - darkBlend(I) * 0.5)`. Each predicate is a normalized-AST equality check. | deterministic-function-result (formula identity over engine code) |
| **G-DS5** | DSA5 | Parse board.ts:44–46; verify `BLUE`, `RED`, `AMBER` declarations carry `as const` assertion; verify each is an object literal with exactly the field set `{hue, sat, L}`; verify no engine module contains an assignment to `BLUE.*`, `RED.*`, `AMBER.*` (regex scan over `features/F-design-system/domain/` and `features/F-design-system/exec/` for assignment patterns matching `(BLUE\|RED\|AMBER)\.\w+\s*=`); zero matches required. | structural property (`as const` marker + non-mutation predicate over consumers) |
| **G-DS6** | DSA6 | Parse board.ts:50–53; verify literal expressions: `DENSITY_FULL === 1.0` (line 50); `DENSITY_SOFT === 1 / R1` (line 51); `DENSITY_HALF === 1 / R4` (line 52); `DENSITY_FAINT === 1 / (R4 * R4)` (line 53). Each predicate is a normalized-AST equality check against the literal RHS expression. | deterministic-function-result (literal expression match) |
| **G-DS7** | DSA7 | Parse board.ts:57–59; verify literal expressions: `H_REST === H` (line 57); `H_HOVER === H / R1` (line 58); `H_PRESS === H / R4` (line 59). Each predicate is a normalized-AST equality check. | deterministic-function-result (literal expression match) |
| **G-DS8** | DSA8 | Invoke each engine function with valid input and verify output cardinality: `Object.keys(deriveLight(I_LIGHT)).length === 70` AND `Object.keys(deriveLight(I_DARK)).length === 70`; `Object.keys(deriveType()).length === 8`; `Object.keys(deriveSpace()).length === 24`; `Object.keys(deriveMotion()).length === 8`. Cardinality predicates execute against runtime engine output. | cardinality (output-set size predicate per engine) |
| **G-DS9** | DSA9 | Static analysis: enumerate files under `features/F-design-system/` matching `*.ts`, `*.tsx`; for each file, scan for occurrences of `document.`, `window.`, `style.setProperty`, `classList.`, `querySelector`, `getElementById`; verify the set of files containing **any design-token-write** (`document.documentElement.style.setProperty` for keys matching the engine output namespaces `--bg`, `--surface`, `--text*`, `--ink-*`, `--glow-*`, `--shadow-*`, `--density-*`, `--type-*`, `--font-*`, `--u*`, `--radius-*`, `--col-width*`, `--login-width`, `--dot-size`, `--spinner-size*`, `--dash-min-h`, `--panel-width`, `--header-h`, `--input-h*`, `--S`, `--E`, `--T`, `--B`, `--G`, `--dur-*`, `--cycle-stream`, `--halo-bias`, `--scale-floor`, `--overlay-bg`, `--identity-density`, `--canyon`, `--blue`, `--red`, `--amber`) === `{features/F-design-system/exec/design-system-provider.tsx}` (singleton). | structural property (file-set predicate; design-token-write site = singleton) |
| **G-DS10** | DSA10 | For each authored atom name `a` in the §3.4 authored-atom enumeration (FONT_UI, FONT_MONO, FONT_BRAND, WEIGHT, LINE_HEIGHT, LETTER_SPACING, RADIUS_BUBBLE, COL_WIDTH, COL_WIDTH_LG, LOGIN_WIDTH, BREAKPOINT_SM, BREAKPOINT_MD, BREAKPOINT_LG, DOT_SIZE, SPINNER_SIZE, SPINNER_SIZE_SM, DASH_MIN_H, PANEL_WIDTH, Z): verify (a) declared as a top-level `const` in board.ts; (b) for object-typed authored atoms (WEIGHT, LINE_HEIGHT, LETTER_SPACING, Z), `as const` assertion present; (c) no engine function body contains an assignment expression that produces `a` from any other identifier (regex/AST scan over engine bodies for `a = <expr>` pattern with `<expr>` containing master identifiers — zero matches required). | type-check (`as const` presence) + structural property (no derivation-into-authored predicate) |
| **G-DS11** | DSA11 | Invoke `deriveLight(I_LIGHT)` and `deriveMotion()`; for the key set `K = {'--S', '--E', '--T', '--B', '--G', '--dur-attack', '--dur-release'}`: verify `K ⊆ Object.keys(deriveLight(I_LIGHT))` AND `K ⊆ Object.keys(deriveMotion())`; for every `k ∈ K`, verify `deriveLight(I_LIGHT)[k] === deriveMotion()[k]`; repeat with `I_DARK` to confirm theme-invariance of overlap. | reference resolution (key-set inclusion + value identity over overlap) |

**G-M1 self-check:** 11 axioms → 11 primary gates. Every axiom has exactly one primary gate. Pass.
**MA-V1 self-check:** every axiom reaches a gate. Pass.
**MA-V2 (per axis gate coverage):** Light has 7 primary gates (G-DS1, G-DS2, G-DS4, G-DS5, G-DS6, G-DS7, G-DS8 — DSA1, DSA2, DSA8, DSA9 attach at Light cross-axis); Type has 2 (G-DS3, G-DS10); Space has 0 primary attachment but inherits cross-axis from DSA1 (G-DS1), DSA2 (G-DS2), DSA8 (G-DS8), DSA10 (G-DS10) — Space-axis gates derive from cross-axis-invariant declarations per substrate §9; Motion has 1 primary (G-DS11) plus cross-axis from DSA1, DSA2, DSA8. Every Design-local axis has ≥1 bound gate (counting cross-axis attachments). Pass.

### §4.3 Inherited gate execution at audit time

When framework-audit runs Design Standard against metaframework gate-bundle (per HR3):

- **E1 Identity (PG1 + G-I1..G-I7):** tests Design Standard's §1 Identity conformance to MA-I1..MA-I7. MA-I1 satisfied per Mode = `generative` declared at §1 + §1.2 row.
- **E2 Schema (PG2 + G-S1..G-S8):** tests Design Standard's §2 Schema conformance to MA-S1..MA-S8. **G-S8 substantive** — evaluates structural conformance of all 29 §2.10 ReferentCitation rows against substrate §4 A-18 typed shape (citationId populated, citingFrameworkRef populated, atomName populated, referentKind ∈ {'code', 'data', 'spec'}, path populated, expectedShape conforms to one of four ExpectedShape kinds with kind-required fields populated).
- **E3 Structure (PG3 + G-St1..G-St16):** tests Design Standard's §3 Structure conformance to MA-St1..MA-St16. Cross-axis-invariant declarations (DSA1, DSA2, DSA8, DSA9, DSA10, DSA11) tested under MA-St11 cross-axis-invariant rule.
- **E4 Validity (PG4 + G-V1..G-V11):** tests Design Standard's §4 Validity conformance to MA-V1..MA-V11. **G-V10 substantive** — for every ReferentCitation in §2.10, ReferentResolver resolves the cited path under the audit's ReferentSnapshot (e.g., git-commit `9862092`); resolved code parses; resolved declaration structurally matches `expectedShape` per substrate §4 A-18 ExpectedShape kind comparison rules. **G-V11** evaluates applicability-basis required for any DimensionResult with `applicability='n/a'`.
- **E5 Lifecycle (PG5 + G-L1..G-L11):** tests Design Standard's §5 Lifecycle conformance to MA-L1..MA-L11. **G-L11 substantive** — every audit run against Design Standard produces an AuditRunRecord with `referentSnapshotRef` populated (resolves to ReferentSnapshot of the audited code state); zero-citation vacuous-pass clause does NOT apply (Design Standard has 29 citations).
- **E6 Coupling (PG6 + G-C1..G-C10):** tests Design Standard's §6 Coupling conformance to MA-C1..MA-C10. Carrier=self declaration tested per MA-C1; custody table tested per MA-C2; provenance per MA-C4; HR captureShape per MA-C3 + MA-C7.
- **E7 Judgment (PG7 + G-J1..G-J5):** tests Design Standard's §7 Judgment conformance to MA-J1..MA-J5 (P7=0 empty-declared per §3.2 + §7.1).
- **E8 Universal + Meta (G-G13, G-U1..G-U5, G-M1..G-M4):** tests Design Standard's conformance to MA-G13 + F-69 + meta-gate axioms.

Plus Design Standard's own 11 G-DS* gates execute substantively against the F-design-system slice at the audit-pinned ReferentSnapshot. Total per-audit framework-tier gates when Design Standard is target: 96 (85 + 11).

**Disambiguation note on gate execution scope:**
The 85 inherited gates test Design Standard's **framework declaration conformance** (does §1–§7 structure match metaframework's axioms?). The 11 G-DS* gates test **runtime referent conformance** (does the F-design-system slice at the audit snapshot satisfy DSA1..DSA11?). Different scopes, different execution sites — the 85 run at framework-audit time against this file; the 11 run at framework-audit time against the runtime referent code. The bootstrap case differs from VS/RS/Cognitive vacuous-pass: G-DS* are non-vacuous because the runtime referent exists at v1.0.

### §4.4 Dimension–gate mapping (per MA-V5)

Framework-audit X1–X10 dimensions cover Design Standard's validity surfaces:

| Dimension | Design Standard gates consuming |
|---|---|
| X1 (Temporal / lifecycle self-consistency) | E1 bundle + §5 Lifecycle |
| X2 (Determinism / reproducibility) | E2 + E7 (P7=0 empty-declared mechanical); §3.6 axiom mechanical-criterion ground per substrate §6.3; G-DS2 (purity); G-DS4, G-DS6, G-DS7 (deterministic formulas); G-DS8 (cardinality); G-DS11 (overlap identity) |
| X3 (Observability / introspection) | E6 bundle (HRs); G-C5 (captureShape per §6.3) |
| X4 (Negative space / scopeOut) | §1 scopeOut (8 entries); audited by E2 schema check |
| X5 (Scale / compositional behavior) | §5.7 scale bounds declared; G-DS8 (output cardinality stable across input range) |
| X6 (Operator / human interface) | §6.8 OperatorInterface declaration |
| X7 (Lifecycle) | E5 bundle |
| X8 (Genesis) | E1 (MA-I5); §1.1 GenesisDeclaration populated; **`bootstrapped: true` triggers MA-L7 bootstrap non-re-entrancy check** |
| X9 (Integration point) | E6 coupling gates + HR-DS1 + HR-DS2 + forward-declared HR-DS3 + HR-DS4 |
| X10 (Stage-declaration extended predicate) | §3.7 P8 declaration (seven steps S1–S7 across stages 2/3/5: five stage-2 mechanical + one stage-3 gate-execution + one stage-5 mechanical-handoff with PR4 monotonicity + PR5 stage↔kind alignment + PG6 amended self-checks) |

Coverage: every MA-V5 audit dimension has ≥1 consuming gate. Pass.

### §4.5 Gate execution order

Per substrate §11.5 + metaframework §4.4:

1. **Tier 1 — Substrate gates** (SG1–SG5): run once, not per framework.
2. **Tier 2 — Axiom gates** (per framework): 69 inherited (68 MA-axis-bound + G-G13) + 11 Design-own (G-DS*) = 80.
3. **Tier 3 — Universal gates** (per framework): G-U1–G-U5.
4. **Tier 4 — Meta-gates** (per framework): G-M1–G-M4.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run. Applies unchanged to Design Standard.

### §4.7 Gate rules (GR-series)

Per v3-1-spec §3.4, consumed by reference. Unchanged from metaframework.

### §4.8 Current gate results

**All 96 framework-tier gates (85 inherited + 11 Design-own): state = `not-yet-run` at this delivery.**

First-run pending framework-audit invocation post-v1.0-confirmation (§5.3). Per metaframework §5.X first-run-execution lifecycle event (added cycle-1 v3.2.4 per F-cycle-1-11): when Design Standard's gate set transitions from `not-yet-run` to `executed`, an AmendmentEvent of kind `'first-run'` is logged via standard amendment-propagation flow (AP1–AP7). Design Standard first-run does not amend the framework — it stamps execution per MA-L1 zero-shape-change discipline.

**Substantive first-run note:** unlike VS/RS/Cognitive v1.2.2 (vacuous-pass at first run because referentCitations was empty), Design Standard's first-run executes G-V10/G-S8/G-L11 substantively against the 29-row §2.10 citation set. If any citation fails resolution or shape conformance, the audit returns `failed` with the failed citation enumerated; builder records as Decision-D per brief §4 (default disposition: amend spec to match runtime, since Sprint 5.5 is reverse-derivation).

Inherited (85): `PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-I6, G-I7, G-S1, G-S2, G-S3, G-S4, G-S5, G-S6, G-S7, G-S8, G-St1, G-St2, G-St3, G-St4, G-St5, G-St6, G-St7, G-St8, G-St9, G-St10, G-St11, G-St12, G-St13, G-St14, G-St15, G-St16, G-V1, G-V2, G-V3, G-V4, G-V5, G-V6, G-V7, G-V8, G-V9, G-V10, G-V11, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-L8, G-L9, G-L10, G-L11, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-C7, G-C8, G-C9, G-C10, G-J1, G-J2, G-J3, G-J4, G-J5, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4`.

Design-own (11): `G-DS1, G-DS2, G-DS3, G-DS4, G-DS5, G-DS6, G-DS7, G-DS8, G-DS9, G-DS10, G-DS11`.

Substrate-tier gates (SG1–SG5) excluded per tier-1 "run once, not per framework" semantics.

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 (initial). Design Standard is a bootstrap-lifted L3 framework with a v0 runtime referent (F-design-system slice at HEAD `9862092`) but no v0 spec md predecessor (per §1.1 GenesisDeclaration `predecessorVersion: null`, `bootstrapped: true`). Mode = `generative` per §1 (L0 disposition Sprint 5.5 close); stateApplied = `applied` per substrate §9 LifecycleState (transitioned from `declared` at L0 confirmation; runtime application active continuously since pre-Sprint-5.5 deployment via DesignSystemProvider mount-effect pipeline). Future amendments additive per MA-L1 + MA-S7. Scope of v1.0: 11 axioms (DSA1..DSA11) declared; 11 paired gates G-DS1..G-DS11 (1:1 per G-M1); 4 HRs (HR-DS1..HR-DS4); P7=0 (mechanical) positive empty-declaration; P8=7 (S1–S7 across stages 2/3/5: input validation S1 + four engine derivations S2–S5 + gate execution S6 + DOM application via HR-DS2 handoff S7) under Mode = generative + substrate §8.3 binding satisfied + substrate §10.2 PR5 stage↔kind alignment satisfied. Carrier = `self` (LM v2.x is the per-framework precedent for argument shape). 29 ReferentCitations declared at §2.10 covering all masters, derivation rules, and engine outputs of the F-design-system runtime referent. Generation path: GP v1.1.6 with bootstrap modification (S2 mechanical-derivation replaced by reverse-derivation per §10.D3) under metaframework v3.2.7 / substrate v1.6. Future versions (v1.1+) follow forward GP v1.1.6 unmodified — `bootstrapped: false` for v1.1+; the bootstrap is a one-time event per §10.D3.

### §5.2 Amendment trigger

Vision-driven. Trigger: Sprint 5.5 closure of the spec-md gap identified at brief §1 (Manual v10 II.5 lists Design Standard as an L3 framework; F-design-system slice exists at HEAD `9862092` with full implementation; no spec md governing it has ever existed — `git log --all --diff-filter=A -- '**/design-standard.md'` returned empty per brief §1). Driving findings: (i) Manual v10 line 758–760 declaration of Design Standard as L3 must be either honored (this Shot 2) or retracted; (ii) F-design-system slice operates without declared framework template; (iii) cycle-2 referent-infrastructure (substrate v1.6 atoms A-18/A-19/A-20 + MF v3.2.7 axioms MA-V10/MA-S8/MA-L11) is now available — Design Standard authored against it consumes the slot from inception, with the bootstrap (non-empty referentCitations) substantively first-run rather than vacuous-pass.

### §5.3 Confirmation gate

Cleared at L0 disposition Sprint 5.5 close (timestamp `2026-05-02T00:00:00Z` per §1.1 `confirmedAt` field). Monotonic per MA-L3. L0 disposition resolved §10.D1 (Mode = generative), §10.D2 (P8 = 7 instances S1–S7 across stages 2/3/5 post-audit-close item 2 PR5 fix), §10.D3 (bootstrap accepted as documented, provenance shape extension per §6.6 ratified), and §10.D7 (Carrier = self confirmed) in a single gate. Subsequent confirmation gates (post-v1.0 amendments) follow forward GP v1.1.6 unmodified per `bootstrapped: false` discipline for v1.1+.

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery. Prior escalations (§10.D1 Mode declaration; §10.D2 P8 binding; §10.D3 bootstrap discipline; §10.D7 carrier=self confirmation) all resolved at L0 disposition Sprint 5.5 close per §5.3 + §10 status rows.

**Out-of-scope finding logged for forward routing:** F-DS-RUNTIME-01 — pre-existing runtime drift detected during reverse-derivation (specific drift class TBD at finding-record level; manager logs separately). Routed to **Sprint B3 slice consolidation** per L0 disposition. Not a Sprint 5.5 escalation; not blocking v1.0 confirmation; recorded here for cross-sprint traceability per substrate §13 amendment-event flow.

### §5.5 Judgment deprecations

Empty at delivery. Design Standard declares zero J-inputs per §3.2 P7=0 (MA-J4); no deprecations possible.

### §5.6 Failure modes

Per v3-1-spec §3.3 output schema `lifecycle.failureModes`:

| Stage | Failure mode | Recovery path |
|---|---|---|
| Master loading (S1) | Master atom missing or malformed in board.ts | TypeScript compile-time error; F-design-system slice fails to build; Design Standard derivation cannot proceed; surfaces as `DesignDerivationError { code: 'DESIGN_INPUT_INVALID' }` if reached at runtime |
| Engine derivation (S2–S5) | Engine function throws or produces malformed output (DSA8 cardinality violation, DSA4 formula drift, DSA6/DSA7 expression drift) | DesignSystemProvider mount effect catches exception; surfaces as `DesignDerivationError { code: 'DESIGN_DERIVATION_FAILED', failedAxiom: 'DSA<n>' }`; design tokens not written to DOM; UI renders with browser default styles; user-visible degradation |
| DOM application (S6) | `document.documentElement` unavailable (SSR context, document removal mid-effect); `style.setProperty` throws | DesignSystemProvider mount effect catches; surfaces as `DesignDerivationError { code: 'DESIGN_DOM_APPLICATION_FAILED' }`; effect cleanup runs; observer disconnected; subsequent mount retries |
| Theme transition (`_livRecalc` per design-system-provider.tsx:73, 79) | data-theme attribute mutation observed but recalcLight() throws | MutationObserver callback catches; falls back to last successful CSS variable set (browser-cached); next theme transition retries |
| Cross-engine overlap drift (DSA11 violation) | Light's `--S, --E, --T, --B, --G, --dur-attack, --dur-release` diverge from Motion's | G-DS11 fails at framework-audit; flagged as Decision-D for amendment — either reconcile engine code or amend DSA11 to declare divergence as authored |

### §5.7 Scale bounds

Per v3-1-spec §3.3 output schema `lifecycle.scaleBounds`:

- Per-derivation CSS variable count: `LightVarSet = 70`, `TypeVarSet = 8`, `SpaceVarSet = 24`, `MotionVarSet = 8` per DSA8; total per DesignVarBundle = 110 keys (with 7-key Light-Motion intentional overlap per DSA11; deduplicated unique keys = 103). Bounds frozen at v1.0 — additive-only per MA-S7.
- Per-engine derivation complexity: deriveLight is O(1) — fixed-size loop over 3 tiers × 3 levels × 4 colors per light-engine.ts:142–185, no input-size scaling. deriveType, deriveSpace, deriveMotion are O(1) — fixed-size object literal returns. DesignSystemProvider mount: O(1) — four `setVars` calls × per-engine output size.
- Per-theme-transition recalc: O(70) — `_livRecalc` re-derives only Light (per design-system-provider.tsx:47–49, theme change affects only intensity-dependent light derivation; type/space/motion are intensity-invariant).
- DOM write surface: 110 CSS variable assignments per mount; ~70 per theme transition. Browser style-recalc cost is browser-implementation-dependent and not in Design Standard's scope.

### §5.8 Atomicity declarations

Per v3-1-spec §3.3 output schema `lifecycle.atomicityDeclarations`:

- Per-engine derivation (deriveLight / deriveType / deriveSpace / deriveMotion): atomic per-invocation — each engine returns a complete `Record<string, string>`; no partial-output state.
- Mount-effect application (design-system-provider.tsx:54–86): non-atomic across the four setVars calls — type → space → motion → light sequencing per lines 56–63 produces interleaved DOM writes; intermediate states are observable but transient (sub-frame). Browser paint cycle batches the writes per `useEffect` semantics. Last-write-wins on the 7-key Light-Motion overlap (light writes last, dominates) per DSA11 identity invariant; observable order is irrelevant per DSA11 byte-identity guarantee.
- Theme transition (`_livRecalc`): atomic per-call — `setVars(deriveLight(getBaseI()))` is one synchronous statement; all 70 light vars written before yielding.
- Mutation observer registration (design-system-provider.tsx:76–86): atomic per-mount; cleanup atomic per-unmount.

### §5.9 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | 2026-05-02 (Sprint 5.5 Shot 2; L0-confirmed Sprint 5.5 close) | Initial declaration. Bootstrap-lift formalizing F-design-system slice at HEAD `9862092` (15 files, 822 lines deployed pre-spec-md authoring). Mode = `generative` per substrate §2 Mode enum (L0 disposition; per-framework substrate §2.2 binding by argument from §2.1 / §2.2 input-output shape; LM v2.x is the per-framework precedent for argument shape). stateApplied = `applied` per substrate §9 LifecycleState. Four Design-local P1 axes (Light, Type, Space, Motion). Eleven axioms DSA1..DSA11 with cross-axis attachments at DSA1/DSA2/DSA8/DSA9/DSA10/DSA11. Eleven paired gates G-DS1..G-DS11 (1:1 per G-M1). Four HRs HR-DS1..HR-DS4 with HR-DS3 + HR-DS4 forward-declared per §1.21 natural-defer (Sprint 8 RSF v1.0 + Cognitive v1.3+ dispatch). P7=0 (mechanical) positive empty-declaration per A-17. P8=7 (S1 input validation, S2–S5 engine derivations Light/Type/Space/Motion, S6 gate-execution, S7 DOM application via HR-DS2) under Mode = generative + substrate §8.3 binding satisfied; PR4 monotonicity [2,2,2,2,2,3,5] + PR5 stage↔kind alignment + PG6-amended self-checks passed. Carrier = `self` per substrate §9 Carrier enum (per-framework binding argument from §2.2 emission surface; LM v2.x is the per-framework precedent for argument shape). 29 ReferentCitations declared at §2.10 — non-empty bootstrap case per substrate §4 A-14; G-V10 / G-S8 / G-L11 substantive first-run anticipated (not vacuous-pass). `bootstrapped: true` per §10.D3; future versions follow forward GP v1.1.6 unmodified. GenesisDeclaration shape mirrors VS v1.0 §1.1 precedent (six VS-shared fields) extended additively with two A-14 bootstrap-specific fields. Generated under metaframework-v3-1 v3.2.7 / generation-procedure-v1-0 v1.1.6 (with bootstrap S2 modification per §10.D3) / substrate-v1-1 v1.6. F-DS-RUNTIME-01 logged out-of-scope and routed to Sprint B3 slice consolidation per §5.4. | L0 (confirmed Sprint 5.5 close per §5.3 confirmedAt 2026-05-02T00:00:00Z) |

---

## §6 Coupling

### §6.1 Carrier

Design Standard carrier = `self` per substrate §9 Carrier enum (`Carrier = 'self' | 'named' | 'none'`; `'self'` is enumerated). Confirmed at L0 disposition Sprint 5.5 close per §10.D7. Design Standard emits its own outputs (CSS variable maps + JS-resolved constants) directly through the F-design-system R3 contract surface and R4 DOM application boundary; no enclosing carrier wraps Design Standard's output at the emission layer.

**Cross-framework calibration:** Living Memory v2.x is the per-framework precedent for an L3 framework declaring `carrier: self` on the basis that its outputs are framework-owned W-ATOMs emitted directly through its own runtime surface (LM emits living-graph state via `traverse` → `persistMutations` pipeline; Design Standard emits design-token state via engine derivation → setVars pipeline). LM's binding was confirmed in its own L0 gate; Design Standard's binding (independent §2.1 / §2.2 input-output shape, independent emission surface) was confirmed in this sprint's gate per §10.D7. The precedent applies to argument shape, not class-membership. AS v2.2 named-carrier pattern (used by Plan v2.2, VS v1.0, RS v1.0, Cognitive v1.2.2 for typed-work emission) does not apply to Design Standard because Design Standard's outputs are not artifacts and have no AS-companion-node payload semantics.

**Per substrate convention:** when carrier is self, output declaration in §2.2 lists W-ATOMs directly (LightVarSet, TypeVarSet, SpaceVarSet, MotionVarSet, plus TIMING/CURVES/Z) — not AxiomRef[] under AS shell. Pattern parallel to LM §2.2 (multiple distinct output W-ATOMs declared verbatim per MA-S2 carrier=self clause).

**§10.D7 disposition:** confirmed by L0 at Sprint 5.5 close. Carrier declaration is final at v1.0; future amendments do not revisit unless a substrate §9 Carrier enum amendment introduces a new value relevant to Design Standard's emission surface.

### §6.2 Handoff rules

Four framework-local HR instances. All Design-Standard-owned handoffs have declared `captureShape` per substrate §8.2 amended P6 + X3 C5 requirement (except where `diagnosticSignificance = false`).

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-DS1** | F-design-system R0/R1 (board.ts + engines) → F-design-system R3 (contract/index.ts re-export) | `['self']` (Design Standard's own carrier = self) | `false` (compile-time re-export; no runtime diagnostic surface) | n/a |
| **HR-DS2** | F-design-system R3 → F-design-system R4 (DesignSystemProvider applies CSS variables to DOM) | `['self']` | `true` | declared §6.3; cross-referenced by §3.7 S7 (stage-5 mechanical-handoff under substrate §10.2 PR5 binding) |
| **HR-DS3** | Design Standard → RSF v1.0 (Sprint 8 future — semantics layer over mechanics layer) | `['self', 'named']` (depends on RSF v1.0's eventual carrier choice) | `true` (forward-declared) | shape-declared §6.3 (instances deferred per §1.21 natural-defer) |
| **HR-DS4** | Design Standard → Cognitive Standard v1.3+ (Sprint 8 future — visual dispatch carries Design-Standard-rendered output across perimeter) | `['self', 'named']` | `true` (forward-declared) | shape-declared §6.3 (instances deferred per §1.21 natural-defer) |

**Inherited HRs referencing Design Standard:**

| HR | Owning declaration | Design Standard's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → Design Standard type consumption; Design Standard consumes substrate types (Mode, Carrier, ReferentCitation, etc.) by receive pattern |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; Design Standard is the generated L3 template output contract per §1 + bootstrap modification per §10.D3 |
| HR5 | metaframework §6.2 | metaframework → registry; registry records Design Standard's framework declaration per provenance contract (§6.6) |

Per substrate §1.3 S-03: these HRs are referenced, not redeclared, by Design Standard.

**Decision-D anchor §10.D6:** HR-DS3 + HR-DS4 are forward-declared per brief §3.6 + §1.21 natural-defer. Shape is frozen at v1.0; instances deferred until Sprint 8 RSF + Cognitive v1.3+ amendments register against them. **Resolved** at L0 disposition Sprint 5.5 close — direction + carrier-applicability + diagnostic-significance frozen; captureShape declared as forward-compatible shape stub; concrete invariants populated at Sprint 8 by the consuming framework. See §10.D6 for full disposition.

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

**HR-DS2 — F-design-system R3 → R4 (DesignSystemProvider mount + theme recalc):**
```
captureShape = {
  capturedFields: ['mountTimestamp', 'baseI', 'lightVarCount', 'typeVarCount', 'spaceVarCount', 'motionVarCount', 'overlapKeyCount', 'recalcCount', 'lastRecalcTimestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; runtime logs emitted by DesignSystemProvider effect (currently absent — instrumentation deferred to subsequent hygiene sprint per §10.D8)'
}
```
Note: at v1.0 the F-design-system slice does not emit instrumentation logs satisfying this captureShape. The captureShape is **declared** per X3 C5; **runtime emission** is deferred to a subsequent hygiene sprint. This is a structural gap, not a scope violation — declaration is current, instrumentation amendment is forward-compatible.

**HR-DS3 — Design Standard → RSF v1.0 (forward-declared, Sprint 8):**
```
captureShape = {
  capturedFields: ['rsfQueryId', 'mechanicsAtomRefs (subset of Design-Standard atoms requested)', 'semanticBindingRef', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'TBD at Sprint 8 RSF v1.0 authoring — RSF declares the consuming side per §1.21 natural-defer'
}
```

**HR-DS4 — Design Standard → Cognitive Standard v1.3+ (forward-declared, Sprint 8):**
```
captureShape = {
  capturedFields: ['cognitiveDispatchId', 'visualOutputRef (Design-Standard-rendered)', 'perimeterCrossing', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'TBD at Sprint 8 Cognitive v1.3+ amendment — Cognitive declares the consuming side per §1.21 natural-defer'
}
```

**HR-DS1:** no captureShape declared (`diagnosticSignificance: false`); compile-time re-export only.

### §6.4 Handoff axioms satisfaction

Per MA-C1..MA-C10 (metaframework §3.2 Coupling axis):

- **MA-C1** (carrier declared per substrate §5): §6.1 declares `carrier = 'self'`.
- **MA-C2** (custody per atom): §6.5 enumerates every Design-local atom with owner + layer + consumers.
- **MA-C3** (handoff-invariant symmetry): HR-DS1..HR-DS4 send/receive shapes matched by construction; HR-DS2 captureShape contract symmetric with consuming F-chat / F-dashboard / F-discover read sites (those consumers read CSS variables via `var(--name)` syntax, no return contract).
- **MA-C4** (provenance per output field): §2.2 every output W-ATOM has declared provenance trace via §2.10 referentCitations; §6.5 custody; §6.6 top-level provenance.
- **MA-C5** (carrier-consistent emission): `carrier = 'self'` → outputs are W-ATOMs per MA-S2 carrier=self clause; §2.2 LightVarSet/TypeVarSet/SpaceVarSet/MotionVarSet/TIMING/CURVES/Z declared as Design-Standard-owned W-ATOMs (not AxiomRef[]).
- **MA-C6** (no re-ownership): custody table §6.5 declares single owner per atom; substrate / primitives.ts / metaframework atoms referenced at §2.3, §2.4, §2.6 not re-owned.
- **MA-C7..MA-C10** (cycle-2 + earlier extensions): cross-framework ID coherence + substrate-version-pin uniformity + diagnostic-significance per HR + capture-target completeness — satisfied per §6.2 + §6.3 declarations (with HR-DS3/HR-DS4 captureShape declared as forward-compatible stubs per §10.D6).

### §6.5 Custody table

Every atom consumed or declared, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `Semver` | primitives.ts | core/R5 | design-standard (§1 version), every versioned framework |
| `Result<T, E>` | primitives.ts | core/R5 | design-standard (§2.5 DesignDerivationResult), every fallible-operation framework |
| `AppError` | primitives.ts | core/R5 | design-standard (§2.5 DesignDerivationError extends), every error-carrying framework |
| `Mode` | substrate | L1 (substrate §2) | design-standard (§1 Identity Mode row — `generative` per L0 disposition Sprint 5.5 close per §10.D1) |
| `AuthorityLevel` | substrate | L1 (substrate §5) | design-standard (§1 Identity Level=L3) |
| `WAtom` | substrate | L1 (substrate §4 A-01) | design-standard (§2.1 input W-ATOM, §2.2 output W-ATOMs) |
| `FrameworkRef` | substrate | L1 (substrate §4 A-09) | design-standard (HR direction endpoints §6.2, carrier ref §6.1, provenance §6.6, citingFrameworkRef in every §2.10 row) |
| `Kind` | substrate | L1 (substrate §4 A-10; string-typed) | design-standard (§1 Identity Kind=Framework) |
| `Ownership` | substrate | L1 (substrate §4 A-11) | design-standard (§1 Identity ownershipTemplate + ownershipApplied) |
| `OperatorInterface` | substrate | L1 (substrate §4 A-13) | design-standard (§6.8) |
| `GenesisDeclaration` | substrate | L1 (substrate §4 A-14) | design-standard (§1.1 — `bootstrapped: true`) |
| `LifecycleState` | substrate | L1 (substrate §9) | design-standard (§1 Identity stateTemplate + stateApplied; §5 Lifecycle) |
| `Carrier` | substrate | L1 (substrate §9; string-typed) | design-standard (§6.1 carrier='self' declaration) |
| `EmptyPrimitiveDeclaration` | substrate | L1 (substrate §4 A-17) | design-standard (§3.2 P7 + conditionally P8 empty markers) |
| `ReferentCitation` | substrate | L1 (substrate §4 A-18) | design-standard (§2.10 — 29 instances declared) |
| `ReferentAlignmentState` | substrate | L1 (substrate §4 A-19) | design-standard (consumed at G-V10 audit time — produces 29 entries per audit run) |
| `ReferentSnapshot` | substrate | L1 (substrate §4 A-20) | design-standard (consumed at G-L11 audit time — referentSnapshotRef populated per audit) |
| `GeneratedFrameworkTemplate` | metaframework | L2 | design-standard (this file is an instance) |
| `LightMasters` | design-standard | L3 (this file §2.1 + features/F-design-system/config/board.ts:19–23) | design-standard (internal §2.1, §3.6 DSA1/DSA4); F-design-system/domain/light-engine.ts (consumer per import) |
| `RussellScale` | design-standard | L3 (this file §2.1 + board.ts:27–30) | design-standard (internal); F-design-system/domain/{light,type,motion}-engine consumers; space-engine declared exception per DSA3 |
| `LightConstants` | design-standard | L3 (this file §2.1 + board.ts:34–40) | design-standard (internal); F-design-system/domain/light-engine.ts (consumer) |
| `PinnedMaterial` / `PinnedMaterials` | design-standard | L3 (this file §2.1 + board.ts:44–46) | design-standard (internal); F-design-system/domain/light-engine.ts (BLUE.hue/sat/L access pattern per DSA5) |
| `DensityScale` | design-standard | L3 (this file §2.1 + board.ts:50–53) | design-standard (internal); F-design-system/domain/light-engine.ts |
| `HCompressionTiers` | design-standard | L3 (this file §2.1 + board.ts:57–59) | design-standard (internal); F-design-system/domain/light-engine.ts |
| `TypeMasters` | design-standard | L3 (this file §2.1 + board.ts:63–64) | design-standard (internal); F-design-system/domain/type-engine.ts |
| `TypeAuthored` | design-standard | L3 (this file §2.1 + board.ts:68–90) | design-standard (internal); F-design-system/domain/type-engine.ts (FONT_*); F-design-system contract consumers (WEIGHT, LINE_HEIGHT, LETTER_SPACING via class names in styled components) |
| `SpaceMasters` | design-standard | L3 (this file §2.1 + board.ts:94) | design-standard (internal); F-design-system/domain/space-engine.ts |
| `SpaceAuthored` | design-standard | L3 (this file §2.1 + board.ts:98–112) | design-standard (internal); F-design-system/domain/space-engine.ts; wearer-facing consumers reading breakpoints via media-query hooks |
| `MotionMasters` | design-standard | L3 (this file §2.1 + board.ts:116–141) | design-standard (internal); F-design-system/domain/{light-engine, motion}.ts; F-design-system/exec/{use-planet, use-page-transition} via TIMING/CURVES re-export |
| `CompositionContext` | design-standard | L3 (this file §2.1) | design-standard (internal); F-design-system/exec/design-system-provider.tsx (getBaseI per lines 34–38) |
| `DesignInput` | design-standard | L3 (this file §2.1) | design-standard (internal — composite input shape) |
| `LightVarSet` | design-standard | L3 (this file §2.2 + light-engine.ts:85 deriveLight return) | design-standard (internal); F-design-system/exec/design-system-provider.tsx (setVars consumer); CSS-class consumers in all wearer-facing surfaces (F-chat, F-dashboard, F-discover, F-identity, F-codec) via `var(--name)` syntax |
| `TypeVarSet` | design-standard | L3 (this file §2.2 + type-engine.ts:22 deriveType return) | design-standard (internal); F-design-system/exec/design-system-provider.tsx; CSS-class consumers |
| `SpaceVarSet` | design-standard | L3 (this file §2.2 + space-engine.ts:24 deriveSpace return) | design-standard (internal); F-design-system/exec/design-system-provider.tsx; CSS-class consumers |
| `MotionVarSet` | design-standard | L3 (this file §2.2 + motion.ts:28 deriveMotion return) | design-standard (internal); F-design-system/exec/design-system-provider.tsx; CSS-class consumers |
| `TIMING` | design-standard | L3 (this file §2.2 + motion.ts:41) | design-standard (internal); F-design-system/exec/{use-planet, use-page-transition} via window._livTiming exposure per design-system-provider.tsx:66–70 |
| `CURVES` | design-standard | L3 (this file §2.2 + motion.ts:42) | design-standard (internal); F-design-system/exec consumers |
| `Z` | design-standard (re-exported via motion.ts:43; original board.ts:131–141) | L3 (this file §2.2 — custody owned by design-standard's domain via re-export contract) | design-standard (internal); F-design-system contract + exec consumers; wearer-facing components via class names |
| `DesignVarBundle` | design-standard | L3 (this file §2.5) | design-standard (internal — composite output shape; not yet emitted as a single bundle in current runtime — DesignSystemProvider applies engines individually per design-system-provider.tsx:56–63) |
| `DesignDerivationResult` / `DesignDerivationError` | design-standard | L3 (this file §2.5) | design-standard (internal — error contract; runtime not yet wrapping engine invocations in Result; deferred to subsequent hygiene sprint) |
| `DesignAxisPositional` | design-standard | L3 (this file §3.8 + §3.9) | design-standard (internal §3.8 universal-variables Positional column); framework-audit (X9 lifecycle position consumption) |

**Custody completeness note:** every atom referenced in §1–§5 has a row above. Cross-check: §2.7 Design-local atoms list (24 atoms) maps 1:1 to rows below substrate-tier atoms. Pass.

### §6.6 Provenance contract

Per MA-C4 + A-20 reference-default declaration: this file's `provenance` field (GeneratedFrameworkTemplate top-level) populates:

```
provenance = {
  generatedByMetaframework: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef:   { id: 'generation-procedure', version: '1.1.6' },
  generationTimestamp:      '2026-05-02T00:00:00Z',
  sourceInputRef:           'reference-default per A-20',  // registry-archived MetaframeworkInput for sprint-5.5-design-standard-v1-0-genesis cycle
  sourceInputValue:         undefined,                      // by-value retention not opted in
  bootstrap: {                                              // bootstrap-specific provenance per §10.D3
    runtimeReferentCommit: '9862092',
    runtimeReferentScope:  'features/F-design-system (15 files; 822 lines)',
    reverseDerivationOf:   'S2 mechanical-derivation step in GP v1.1.6 — replaced by reverse-derivation against runtime referent per substrate §4 A-14 bootstrapped=true clause'
  }
}
```

Per A-20 reference-default: provenance stores reference to registry-archived input; by-value retention is opt-in. Not opted in at this cycle. Bootstrap-specific provenance fields (runtimeReferentCommit, runtimeReferentScope, reverseDerivationOf) are Design-Standard-local additions consistent with substrate §4 A-14 — they document the v0 lift path. **Decision-D anchor §10.D3:** **resolved** at L0 disposition Sprint 5.5 close — provenance shape extension accepted as documented; bootstrap-specific fields ratified; no GP amendment required. See §10.D3 for full disposition.

### §6.7 Carrier-applicability enforcement

Per substrate §9 (A-13) + v3-1-spec §3.5:

Design Standard carrier = `self`. Applicability enforcement at handoff time:

- HR-DS1 carrier applicability `['self']`: Design Standard's own carrier is self; applies exactly. Compile-time re-export through F-design-system R3.
- HR-DS2 carrier applicability `['self']`: Design Standard's own carrier is self; applies exactly. R4 boundary DOM application.
- HR-DS3 carrier applicability `['self', 'named']`: forward-declared; depends on RSF v1.0's eventual carrier choice at Sprint 8. Both values supported.
- HR-DS4 carrier applicability `['self', 'named']`: forward-declared; depends on Cognitive Standard v1.3+ amendment carrier semantics at Sprint 8.

### §6.8 OperatorInterface (per substrate §4 A-13 + V5 verification)

Design Standard's operator-facing surface:

```
operatorInterface = {
  invocationEntrypoint: 'F-design-system R4 layer mounts DesignSystemProvider at app root (layout.tsx). On mount, four engine functions invoked in sequence (deriveType, deriveSpace, deriveMotion, deriveLight per design-system-provider.tsx:56–63) and outputs written to document.documentElement.style via setVars helper. Theme transitions trigger _livRecalc which re-derives Light only.',
  configurationInputs:  ['data-theme attribute on document.documentElement (controls baseI via getBaseI per design-system-provider.tsx:34–38)', 'all masters via board.ts module imports (compile-time configuration; no runtime tuning)'],
  observableOutputs:    ['110 CSS variables on document.documentElement.style (with 7-key Light-Motion overlap; deduplicated unique = 103)', 'window._livTiming object exposing TIMING constants per design-system-provider.tsx:66–70', 'window._livRecalc function exposing recalcLight per design-system-provider.tsx:73'],
  errorContract:        'Engine functions are pure and do not throw under valid input (DSA2). DOM application errors at R4 surface as DesignDerivationError codes: DESIGN_INPUT_INVALID | DESIGN_DERIVATION_FAILED | DESIGN_DOM_APPLICATION_FAILED. Runtime not yet wrapping engine invocations in Result type — deferred to subsequent hygiene sprint per §10.D8.',
  extensibility:        'Master atoms additive at board.ts (new mastered atom requires Design Standard amendment per MA-S7 + corresponding ReferentCitation row in §2.10). New engine = new axis = framework amendment. Cross-axis invariants (DSA11) are declarative — engines opt in to overlap by reading shared MotionMasters constants, no further mechanism.'
}
```

V5 verification: this operator interface is declaratively complete at v1.0 (every invocation path + configuration input + observable + error listed).

### §6.9 Handoff contracts (adjacent-framework call patterns)

Per metaframework-v3-1 §3.1 A6 Coupling axis: cross-framework handoff content resides here.

| Adjacent | Design Standard consumes | Design Standard emits | HR binding |
|---|---|---|---|
| F-design-system slice (sole runtime tenant) | masters via board.ts module imports + DOM via document.documentElement | LightVarSet + TypeVarSet + SpaceVarSet + MotionVarSet → CSS variables on root; TIMING + CURVES via window globals | HR-DS1 (R3 re-export); HR-DS2 (R4 DOM application) |
| RSF v1.0 (Sprint 8 future) | (forward-declared — RSF will read Design Standard atom refs as mechanics input to its semantic-binding declarations) | (forward-declared — Design Standard exposes mechanics atom refs via §2.7 + §6.5; RSF authors declare which atoms its semantics consume) | HR-DS3 (forward-declared; instances at Sprint 8) |
| Cognitive Standard v1.3+ (Sprint 8 future — visual dispatch amendment) | (forward-declared — Cognitive will reference Design-Standard-rendered output when dispatching visual artifacts across perimeter) | (forward-declared — visual-output references) | HR-DS4 (forward-declared; instances at Sprint 8) |
| F-chat, F-dashboard, F-discover, F-identity, F-codec, F-event-system (wearer-facing surfaces) | — | CSS variables + class names readable via standard CSS `var()` syntax + WEIGHT/LINE_HEIGHT/LETTER_SPACING constants importable via F-design-system/contract barrel | (consumer-mediated; no HR — consumers read the runtime state, no Design Standard handoff invocation) |
| Living Memory | (no direct handoff — Design Standard does not write to graph) | — | (no HR; non-overlapping scopes) |
| Artifact Standard v2.2 | (no direct handoff — Design Standard outputs are not artifacts) | — | (no HR; non-overlapping scopes) |

### §6.10 Cross-framework atom flow

| Atom | Flow |
|---|---|
| Master atoms (board.ts exports) | Compile-time import → engine consumer modules → engine derivation produces output |
| `LightVarSet`, `TypeVarSet`, `SpaceVarSet`, `MotionVarSet` | Engine return → DesignSystemProvider mount effect → setVars → document.documentElement.style → wearer-facing CSS class consumers via `var(--name)` |
| `TIMING`, `CURVES` | motion.ts re-export → contract/index.ts barrel → use-planet / use-page-transition consumer modules; TIMING also exposed via window._livTiming for non-React JS contexts per design-system-provider.tsx:66–70 |
| `Z` | board.ts → motion.ts re-export → contract barrel → wearer-facing component class consumers |
| `_livRecalc` | DesignSystemProvider mount → window._livRecalc exposure → MutationObserver invokes on data-theme transition → recalcLight derives Light only |

### §6.11 Carrier relation and boundary notes

Design Standard `carrier = self`. Design Standard declares **outputs only** (LightVarSet, TypeVarSet, SpaceVarSet, MotionVarSet, TIMING, CURVES, Z). Design Standard does **not** declare carrier mechanics — the engines + DesignSystemProvider in F-design-system R3+R4 implement the mechanics; Design Standard formalizes their typed shapes and invariants.

**Cross-framework calibration points (carrier-self pattern parallel to LM v2.x §6.11):**

| Design Standard reference site | Adjacent framework atom | Cycle-cross notes |
|---|---|---|
| §2.2 outputs | (none — carrier=self emits Design-Standard-owned W-ATOMs) | No AS payload ride-along; no AS-companion node |
| §6.5 custody for `LightVarSet` etc. | (none — wearer-facing consumers read CSS variables directly via browser CSS engine) | Browser CSS engine is the consumption surface, not a framework |
| §6.5 custody for `TIMING` | F-design-system/exec/use-planet, use-page-transition modules | Consumed via direct import of contract/index.ts barrel |

**Boundary notes:**

- **Mechanics-vs-semantics boundary (forward, Sprint 8 RSF):** RSF v1.0 will own view-kind semantics (what kind of view renders for what typed work). Design Standard owns the mechanics under those views. Boundary: RSF declares "view-kind X uses mechanics-atom-set Y"; Design Standard declares the atom set Y is mechanically derivable from masters. RSF amendments do not cascade into Design Standard unless a new mechanics atom is required; Design Standard amendments do not cascade into RSF unless an existing mechanics atom shape changes.

- **Visual dispatch boundary (forward, Sprint 8 Cognitive v1.3+):** Cognitive Standard v1.3+ will own visual dispatch governance — how Design-Standard-rendered output crosses the perimeter (e.g., screenshot of UI state attached to LLM context for visual reasoning). Boundary: Cognitive declares the dispatch operation; Design Standard's output is the input data. No mutation of Design Standard's atoms by Cognitive.

- **L4 program boundary:** each L4 program (F-dashboard, F-chat, etc.) renders its own UI by consuming Design-Standard-emitted CSS variables and exported constants. Programs do not extend Design Standard — they consume it. Program-specific styling lives in the program's contract/primitives, not in Design Standard.

- **DOM boundary (DSA9):** the only DOM-token-write site in F-design-system is `exec/design-system-provider.tsx`. `use-planet.ts` and `use-page-transition.ts` perform DOM manipulation but for animation choreography (not design-token writes). Boundary enforced by R4 layer assignment per slice doc.

- **Light-Motion overlap boundary (DSA11):** the 7-key value overlap is declared at the framework level; both engines compute the same string from the same MotionMasters constants. No coordination protocol between engines; identity is enforced by shared input. If a future amendment changes any of {CURVE_S..CURVE_G, ATTACK, RELEASE}, both engines re-derive consistently — no drift surface.

- **Bootstrap boundary (§10.D3):** Design Standard v1.0 is reverse-derived. Future versions (v1.1+) follow forward GP v1.1.6 unmodified — `bootstrapped: false` for v1.1+. The bootstrap is a one-time event, not a recurring discipline.

---

## §7 Judgment

### §7.1 Declared J-inputs

**Zero instances.** Positive empty-declaration per substrate §8.6 + MA-J4:

```
{
  primitiveKind: 'P7',
  instanceCount: 0,
  basis: "Design Standard's derivations are fully mechanical: every output is a pure function of declared inputs (masters + composition context); no judgment inputs consumed at derivation time. Every DSA1..DSA11 condition reduces to substrate §6.3 mechanical-criterion ground — type-check (DSA1, DSA10), structural property (DSA2, DSA3, DSA9), reference resolution (DSA4, DSA11), cardinality (DSA8), deterministic-function-result (DSA5, DSA6, DSA7). Theme dispatch (light vs dark via I_LIGHT/I_DARK) is mechanical attribute observation per design-system-provider.tsx:34–38 (reads data-theme attribute, no judgment). The space-linear-grid exception declared at DSA3 basis is a vocabulary-tier declaration (k ∈ {0.5..6} verbatim authored), not a judgment input — it does not invoke a judgment surface, it declares an exception to a Russell-totality rule with mechanical predicate. No judgment inputs consumed. MA-J4 emptyDeclared satisfied with positive basis."
}
```

### §7.2 Axis status

`A7 Judgment` axis status: `emptyDeclared: true` with positive basis above. Gate coverage:

- **G-J1** (J-input-typing): vacuous per §7.1 empty set; passes as empty-set universal.
- **G-J2** (mechanical-criterion ground): vacuous per §7.1 empty set; passes as empty-set universal.
- **G-J3** (provenance for J-input): vacuous per §7.1 empty set.
- **G-J4** (J-axis emptyDeclared or non-empty): passes via `emptyDeclared: true` with declared basis.
- **G-J5** (mechanicalGround field resolution): vacuous per §7.1 empty set.

### §7.3 Judgment provenance

Per metaframework §7.4: empty-declared A7 has no J-inputs to carry provenance for. Declared empty stands as provenance-complete per MA-J4.

---

## §8 Self-audit results

### §8.1 Gate results

All 96 framework-tier gates (85 inherited + 11 Design-own): state = `not-yet-run` at this delivery.

First-run pending framework-audit invocation at first system-wide audit cycle post-Sprint-5.5 close (L0 confirmation gate cleared per §5.3 — confirmedAt 2026-05-02T00:00:00Z). Per metaframework §5.X first-run-execution lifecycle event: when Design Standard's gate set transitions from `not-yet-run` to `executed`, an AmendmentEvent of kind `'first-run'` is logged via standard amendment-propagation flow (AP1–AP7). Design Standard first-run does not amend the framework — it stamps execution per MA-L1 zero-shape-change discipline.

**Substantive first-run anticipated for G-V10 / G-S8 / G-L11:** unlike VS / RS / Cognitive v1.2.2 vacuous-pass, Design Standard's 29 ReferentCitations declared at §2.10 produce 29 ReferentAlignmentState entries at first audit run, with `truthValue ∈ {'aligned', 'drifted'}` populated mechanically against the F-design-system runtime referent under audit's ReferentSnapshot. Audit ReferentSnapshot at v1.0 first-run will be `{snapshotKind: 'git-commit', identifier: '9862092', timestamp: '<audit-run timestamp>'}` per substrate §4 A-20.

### §8.2 Dimension audit results

| Dimension | Status at delivery | Basis |
|---|---|---|
| X1 Temporal / lifecycle self-consistency | declared-complete | §1 populated; §5 lifecycle section declares state transitions; §5.9 version history present |
| X2 Determinism / reproducibility | declared-complete | §3.6 axiom mechanical-criterion ground per substrate §6.3 (every DSA reducible to one of six classes); §3.7 P8 = 7 steps S1–S7 across stages 2/3/5 (five mechanical derivations + one gate-execution + one mechanical-handoff) with PR4 monotonicity + PR5 stage↔kind alignment + PG6-amended self-checks; §7.1 P7=0 mechanical empty-declaration |
| X3 Observability / introspection | declared-incomplete-runtime | §6.2 HRs with captureShape per MA-C3; §6.3 captureShape table populated for HR-DS2 + forward-declared HR-DS3/HR-DS4 (HR-DS1 explicitly null per diagnosticSignificance: false). **Runtime instrumentation gap:** F-design-system slice does not currently emit logs satisfying HR-DS2 captureShape — declaration is current, instrumentation deferred per §10.D8 |
| X4 Negative space / scopeOut | declared-complete | §1 Identity scopeOut row with 8 entries (RSF semantics, visual dispatch, L4 program rendering, CSS-to-DOM apply mechanism, theme/dark/accessibility post-beta, animation choreography, authored-constants-outside-axes, B-direction post-beta) |
| X5 Scale / compositional behavior | declared-complete | §5.7 scale bounds declared (per-derivation cardinality, engine complexity O(1), theme-transition O(70), DOM write surface) |
| X6 Operator / human interface | declared-complete | §6.8 OperatorInterface declared with all required fields |
| X7 Lifecycle | declared-complete | §5 full lifecycle section |
| X8 Genesis | declared-complete-with-bootstrap | §1.1 GenesisDeclaration populated with `bootstrapped: true` per §10.D3; bootstrap basis text declared |
| X9 Integration point | declared-complete | §6 cross-framework + HR-DS1/HR-DS2 active + HR-DS3/HR-DS4 forward-declared per natural-defer §1.21; §6.9 adjacent-framework call patterns |
| X10 Stage-declaration extended predicate | declared-complete | §3.7 P8=7 declared (S1 input validation, S2 light, S3 type, S4 space, S5 motion, S6 gate execution, S7 DOM application via HR-DS2 handoff) under Mode = generative + substrate §8.3 binding satisfied; PR4 stage monotonicity [2,2,2,2,2,3,5] + PR5 stage↔kind alignment (stage 2 ↔ mechanical for S1–S5; stage 3 ↔ gate-execution for S6; stage 5 ↔ mechanical-handoff for S7) + PG6 amended self-checks all pass |

Nine of ten audit dimensions declaratively complete at delivery. X3 carries a declared runtime instrumentation gap (forward-compatible per §10.D8). X10 declared-complete post-L0-confirmation per §10.D2. Framework-audit first-run ratifies post-Sprint-5.5-close per §5.3.

### §8.3 Last audit event

Not yet run. v1.0 delivery is the first compilation of Design Standard; L0 confirmation gate cleared at Sprint 5.5 close per §5.3 + §10.D1/D2/D3/D7 disposition. Framework-audit X1..X10 first-run scheduled at first system-wide audit cycle post-Sprint-5.5 close per metaframework §5 first-run-execution lifecycle event.

### §8.4 MA-G13 four-property test

Per metaframework §3.2.1 MA-G13: every framework declared at L2/L3 satisfies four properties — own state, own I/O, own invariants, own discipline. Hidden-sibling check: no candidate framework-internal element satisfies all four properties without being declared as a framework.

| Element | own state | own I/O | own invariants | own discipline | classification |
|---|---|---|---|---|---|
| Design Standard (this file) | the 110-key CSS variable space + 3 JS-resolved constant sets emitted at every DesignSystemProvider mount + per-tier per-state derivation cache (transient, in-engine) | DesignInput (master atoms + CompositionContext) → DesignVarBundle (four output W-ATOMs + TIMING/CURVES/Z) per §2 | 11 DSA invariants per §3.6 | engine derivation pipeline + DOM application via DesignSystemProvider mount sequence per §3.7 | **L3 Framework** ✓ |
| Single engine module (e.g., light-engine) | own state ✗ (transient computation, no persistence) / own I/O ✗ (one return shape per call) / own invariants ✗ (DSA invariants are Design-Standard-owned, light-engine inherits) / own discipline ✗ (engine ordering owned by DesignSystemProvider) | not a framework — procedure step under Design Standard |
| `recalcLight` invocation | own state ✗ / own I/O ✗ / own invariants ✗ / own discipline ✗ | not a framework — handler step under Design Standard's mount-effect pipeline |
| Per-axis P1 (Light/Type/Space/Motion) | own state ✗ (axis is decomposition aspect, no axis-private state) / own I/O ✗ / own invariants ✗ (axis-bound DSAs are Design-Standard's) / own discipline ✗ | not a framework — structural axis under Design Standard |
| Pinned material instance (BLUE/RED/AMBER) | own state ✗ (frozen literal) / own I/O ✗ / own invariants ✗ / own discipline ✗ | not a framework — leaf data atom under Design Standard |
| `useEffect` cleanup observer | own state ✓ (MutationObserver state) / own I/O ✓ (DOM mutation events in / setVars calls out) / own invariants ✗ (no axiom layer) / own discipline ✗ (lifecycle owned by React + DesignSystemProvider) | not a framework — DOM-API consumption surface under R4 |

Hidden-sibling check passes: no Design-Standard-internal element satisfies all four MA-G13 properties without being Design Standard itself. Pass.

### §8.5 Self-application basis

Design Standard does **not** self-apply at the runtime-artifact tier. Unlike VS (verification-of-verification per VA9), Design Standard's outputs are CSS variables and JS constants — not invocable as Design Standard inputs. The framework-tier G-U1 self-application (gate suite running against the framework declaration file) is inherited from metaframework §11.3 and applies at framework-audit time per the standard pattern. No runtime-tier self-application axiom declared.

### §8.6 Cross-framework consistency check

Per-framework binding consistency check: Design Standard's `mode = generative` declaration rests on its own §2.1 / §2.2 input-output shape (master atoms → derived design tokens via four engines + DOM application). Living Memory v2.x is the per-framework precedent for the same form of substrate §2.2 binding argument under L3 framework + carrier=self emission; LM was confirmed in its own L0 gate by argument from its §2.2 shape. Each L3 framework declares its Mode by argument from its own input-output transformation shape; substrate §2 admits no shared-class declaration between frameworks beyond the Mode value itself. Design Standard's declaration does not assert co-membership in any class with LM, Cognitive Standard, or Artifact Standard. **Pass.**

Mode-domain-distinction check: Design Standard and the future builder framework (Sprint TBD) will both declare `mode: generative` per substrate §2; the Mode value is shared, the input-output domain is not (Design Standard transforms master atoms into rendering tokens; the future builder framework will transform planning inputs into typed-work artifacts). Substrate §2 classifies frameworks by Mode only; input-output domain is documented at the per-framework level via each framework's §2.1 / §2.2 declarations. No substrate-level conflict. **Pass** post-L0-confirmation Sprint 5.5 close.

---

## §9 Change log

| Version | Date | Change | Source |
|---|---|---|---|
| v1.0 | 2026-05-02 (L0-confirmed Sprint 5.5 close) | Initial declaration. Bootstrap-lifted formalization of F-design-system slice at HEAD `9862092` (15 files; 822 lines deployed pre-spec-md authoring per Sprint 5.5 Shot 2 dispatch brief §1). Generated against metaframework-v3-1 v3.2.7 via generation-procedure-v1-0 v1.1.6 (with bootstrap S2 modification per §10.D3) under substrate-v1-1 v1.6. Mode = `generative` per substrate §2 Mode enum (L0 disposition Sprint 5.5 close per §10.D1; per-framework substrate §2.2 binding argument from Design Standard's §2.1 / §2.2 input-output shape; Living Memory v2.x is the per-framework precedent for argument shape, not class-membership). stateApplied = `applied` per substrate §9 LifecycleState (transitioned at L0 confirmation; runtime application active continuously since pre-Sprint-5.5 deployment). Carrier = `self` per substrate §9 Carrier enum (L0 confirmation per §10.D7; per-framework binding argument from §2.2 emission surface; LM v2.x is the per-framework precedent for argument shape). Four Design-local P1 axes (Light, Type, Space, Motion) derived from F-design-system's four-engine architecture per SLICE.md lines 12–15; 14 P2 sub-axes (Space split into engine-consumed and consumer-direct sub-axes per audit-close item 1 BREAKPOINT MECE fix). Eleven axioms DSA1..DSA11 with cross-axis attachments at DSA1/DSA2/DSA8/DSA9/DSA10/DSA11 (substrate §9 cross-axis-invariant). Eleven paired gates G-DS1..G-DS11 (1:1 per G-M1). Four HRs HR-DS1..HR-DS4 with HR-DS2 captureShape declared (runtime instrumentation deferred per §10.D8); HR-DS3 + HR-DS4 forward-declared per §1.21 natural-defer (Sprint 8 RSF v1.0 + Cognitive v1.3+ dispatch). P7=0 (mechanical) positive empty-declaration per A-17. P8=7 (S1 input validation, S2–S5 engine derivations Light/Type/Space/Motion, S6 gate-execution, S7 DOM application via HR-DS2) under Mode = generative + substrate §8.3 binding satisfied; PR4 stage monotonicity [2,2,2,2,2,3,5] + PR5 stage↔kind alignment + PG6-amended self-checks all passing per §10.D2 disposition (audit-close item 2 closes the substrate §10.2 PR5 violation introduced by the Sprint-5.5-close 6-instance amendment). 29 ReferentCitations declared at §2.10 — non-empty bootstrap case per substrate §4 A-14; G-V10 / G-S8 / G-L11 substantive first-run anticipated (not vacuous-pass like VS/RS/Cognitive v1.2.2). `bootstrapped: true` declared per §1.1 + §10.D3; future versions (v1.1+) follow forward GP v1.1.6 unmodified. GenesisDeclaration shape mirrors VS v1.0 §1.1 precedent (six VS-shared fields) extended additively with two A-14 bootstrap-specific fields (`bootstrapped`, `bootstrapBasis`) per substrate §4 A-14 typed shape. Eight Decision-D anchors recorded at §10 (D1 mode declaration RESOLVED → generative; D2 P8 binding RESOLVED → seven steps S1–S7 across stages 2/3/5; D3 bootstrap discipline + provenance shape RESOLVED → accepted as documented; D4 axiom enumeration completeness RESOLVED → 11 sufficient; D5 referentCitation completeness RESOLVED → 29 sufficient; D6 forward-declared HR shape RESOLVED → three fields frozen; D7 carrier=self confirmation RESOLVED → confirmed; D8 runtime instrumentation deferral RESOLVED → forward-compatible). F-DS-RUNTIME-01 logged out-of-scope and routed to Sprint B3 slice consolidation per §5.4. Audit-close (Sprint 5.5 close) folded three derivations: item 1 Space sub-axis MECE split (BREAKPOINT_* moved to consumer-direct sub-axis); item 2 P8 7-instance restructure closing PR5 violation (S6 stage-3 gate-execution + S7 stage-5 mechanical-handoff); item 3 drop of `mechanics-domain framework` term (substrate §2 admits no shared-class declaration; per-framework precedent voice replaces class-precedent voice throughout). | Sprint 5.5 Shot 2 dispatch brief 2026-05-02; L0 disposition Sprint 5.5 close per §5.3 confirmedAt 2026-05-02T00:00:00Z; audit-close amendment Sprint 5.5 close |

---

## §10 Decision-D table (Playbook §1.8 anchors)

Per Manager Playbook §1.8: builder records D-rows when the brief explicitly anchors decision points OR when the framework's structural classification cannot be resolved without L0 input. Eight D-rows recorded (six per brief §8 + two surfaced during build).

### §10.D1 — Mode declaration

**Question:** what value populates §1 Identity `mode` row?

**Background:** substrate §2.3 declares `Mode = 'epistemic' | 'structural' | 'generative' | 'verificative'` — closed enum, no `null`. MA-I1 requires every framework to declare exactly one Mode in its Identity axis. Design Standard governs physics-mechanics-of-rendering — not typed-work transformation; no value in the closed enum cleanly applies.

**Three resolution paths (per brief §4):**
- **(a) Substrate amendment.** Extend Mode enum with `'mechanics'` (or admit `null` with carrier-style escalation declaration). Adds a new declared convention; substrate amendment is L0 work; cascades through metaframework + framework-audit.
- **(b) Declare `mode: null` with explicit basis.** Mechanical-derivation path per Manager Playbook §1.19. **Violates substrate §2.3 enum closure as written.** Requires substrate amendment to admit `null` OR L0 acceptance of MA-I1 violation as documented exception.
- **(c) Force-classify under transformation enum.** LM v2 precedent: declares `mode: 'generative'` despite being graph-physics. Builder rejects this as drift per brief §4 path (c) rejection — but precedent exists, and L0 may direct.

**Builder default:** path (b) per brief §4. Records `mode: null` provisionally. Framework not valid until L0 resolves.

**Status:** **RESOLVED** at L0 disposition Sprint 5.5 close → **path (c) — `mode: generative`** by per-framework substrate §2.2 binding argument. Substrate §2.3 enum value `'generative'` (`structured → produced`) applies: Design Standard's engine pipeline transforms structured master inputs (DesignInput) into produced design tokens (DesignVarBundle + JS-resolved constants). Living Memory v2.x is the per-framework precedent for the same form of binding argument (L0 confirmed LM's `mode: generative` declaration by argument from its own §2.2 shape, not by class-membership); precedent applies to argument shape, not class. Cascades: §1 row, §1.2 MA-I1 + MA-I7, §3.2 P8 row, §3.7 P8 declaration, §4.3 E1 note, §5.1, §5.4 escalation cleared, §5.9 + §9 history. Builder's pre-resolution rejection of path (c) (per brief §4) was over-conservative; substrate §2.2 admits per-framework binding, and the LM precedent supplies the form.

### §10.D2 — P8 binding

**Question:** does Design Standard declare P8 procedure steps (Case B) or empty-declare per substrate §8.3 generative-only binding (Case A)?

**Background:** substrate §8.3 binds P8 to Mode = generative only. Resolution depends on §10.D1.

**Two cases (declared in §3.7):**
- **Case A — non-generative resolution at §10.D1.** P8 = 0; positive empty-declaration per substrate §8.6 + A-17 with basis text declared §3.7.
- **Case B — generative resolution at §10.D1 (LM precedent).** P8 = 6 (S1 input validation, S2 light derivation, S3 type derivation, S4 space derivation, S5 motion derivation, S6 DOM application); each step declared per substrate §8.3 amended P8 shape with `kind = mechanical` and `derivation` field populated; PR4 monotonicity + PR5 stage-content-kind alignment self-checked.

**Builder default:** Case A. Path (b) in §10.D1 produces non-generative classification → P8=0.

**Status:** **RESOLVED** at L0 disposition Sprint 5.5 close → **P8 = 7 instances S1–S7 across stages 2/3/5**. Mode = `generative` per §10.D1 → substrate §8.3 P8-binding satisfied directly. Seven derivation steps declared at §3.7: S1 input validation (stage 2, mechanical), S2–S5 four engine derivations (stage 2, mechanical), S6 gate execution running G-DS1..G-DS11 against DesignVarBundle + file set (stage 3, gate-execution), S7 DOM application via setVars governed by HR-DS2 R3→R4 handoff (stage 5, mechanical-handoff). PR4 stage monotonicity [2,2,2,2,2,3,5] non-decreasing + PR5 stage↔kind alignment (stage 2 ↔ mechanical for S1–S5; stage 3 ↔ gate-execution for S6; stage 5 ↔ mechanical-handoff for S7) + PG6 amended self-checks all passing. **Audit-close item 2** closes the substrate §10.2 PR5 violation introduced by the Sprint-5.5-close 6-instance amendment (S6 incorrectly declared as stage-3 mechanical; substrate §10.2 binds stage 3 ↔ gate-execution exclusively); correction: explicit gate-execution step inserted at S6, DOM application relocated to new stage-5 mechanical-handoff step S7. HR-DS2 (R3→R4 handoff) is now cross-referenced by S7 as its governing handoff perimeter. P7=0 → no stage-1 steps exist; the prior amendment's S1 was incorrectly stage-1, corrected to stage-2 (mechanical input validation, not judgment-input sourcing).

### §10.D3 — Bootstrap discipline + provenance shape extension

**Question:** does GP v1.1.6 admit a bootstrap path (reverse-derivation replacing S2 mechanical-derivation), and is the bootstrap-specific provenance shape extension at §6.6 acceptable?

**Background:** GP v1.1.6 §3.3 declares twelve forward-generation steps (S1–S12); S2 is the mechanical-derivation step that produces the draft `GeneratedFrameworkTemplate` from `MetaframeworkInput` + substrate + metaframework schema. For Design Standard, the runtime referent (F-design-system slice at HEAD `9862092`) pre-dates this spec md; the spec md is reverse-derived from runtime, not forward-generated from input.

**Resolution paths:**
- **(a) Accept bootstrap path as documented.** §1.1 GenesisDeclaration declares `bootstrapped: true` per substrate §4 A-14; §6.6 provenance includes bootstrap-specific fields (runtimeReferentCommit, runtimeReferentScope, reverseDerivationOf). Treat as acceptable v0-lift convention; no GP amendment required.
- **(b) Require GP amendment.** L0 directs amendment of GP v1.1.6 to formally admit a bootstrap S2-prime step (reverse-derivation) as alternative to forward S2. New generation-procedure version (v1.2.0+).
- **(c) Reject bootstrap, require fresh forward-generation.** L0 directs builder to ignore F-design-system runtime referent and forward-generate spec md from MetaframeworkInput; runtime referent is then audited for drift vs spec md by framework-audit. Inverts the substantive-first-run advantage; spec md becomes the source of truth.

**Builder default:** path (a). substrate §4 A-14 explicitly admits `bootstrapped: true`; this is its declared use case. Brief §1 + §4 + §10 confirmation criteria assume path (a). Provenance extension per §6.6 is forward-compatible with substrate §4 A-14.

**Status:** **RESOLVED** at L0 disposition Sprint 5.5 close → **path (a) accepted as documented**. GenesisDeclaration extended shape per VS v1.0 §1.1 precedent confirmed (manager amendment 3): six VS-shared fields + two A-14 bootstrap-specific fields (`bootstrapped`, `bootstrapBasis`). §6.6 provenance extension with `bootstrap` sub-field block ratified. No GP amendment required; GP v1.1.6 stands. Future versions (v1.1+) follow forward GP v1.1.6 unmodified — `bootstrapped: false` for v1.1+; bootstrap is a one-time event for Design Standard v1.0 only.

### §10.D4 — Axiom enumeration completeness

**Question:** is the DSA1..DSA11 enumeration exhaustive against the F-design-system runtime referent?

**Background:** brief §8 + §10 confirmation criteria require axiom enumeration to be exhaustive against the engine code. Builder enumerated 11 axioms by inspection of board.ts (141 lines), light-engine.ts (188 lines), type-engine.ts (33 lines), space-engine.ts (66 lines), motion.ts (43 lines), and design-system-provider.tsx (94 lines).

**Resolution paths:**
- **(a) Accept enumeration as exhaustive.** L0 reviews and confirms the 11 axioms cover all structural invariants encoded in the runtime; any further runtime-encoded behavior is judged implementation detail (not axiom-class).
- **(b) Direct expansion.** L0 identifies invariant(s) not captured. Examples of candidates not promoted to axioms: the specific 3-tier × 3-level × 4-color glow grid in light-engine.ts:142–185 (treated as cardinality consequence of DSA8 rather than a separate structural axiom); the `data-theme` attribute observation pattern in design-system-provider.tsx:76–86 (treated as R4 implementation, not framework axiom — DSA9 covers DOM-application isolation but not the specific MutationObserver pattern); the `_livTiming` window-global exposure (treated as R4 implementation per slice doc, not an invariant of the design system).
- **(c) Direct contraction.** L0 identifies axiom(s) that should be implementation detail. Candidate: DSA11 cross-engine-overlap-identity (currently declared as a structural invariant; could be re-classified as an implementation note about engine-shared imports).

**Builder default:** path (a). 11 axioms covers all DSA classes (master immutability, derivation purity, Russell totality, light physics, pinned stability, density derivation, H-compression derivation, cardinality, DOM-application isolation, authored-atom discipline, cross-engine overlap identity). Each maps to a distinct mechanical predicate per substrate §6.3 six-class taxonomy.

**Status:** **RESOLVED** at L0 disposition Sprint 5.5 close → **path (a) accepted**. 11 axioms confirmed exhaustive against the F-design-system runtime referent at HEAD `9862092`. Future amendments additive per MA-S7 if subsequent runtime evolution introduces new structural invariants.

### §10.D5 — referentCitation completeness

**Question:** is the 29-row §2.10 referentCitations table exhaustive against the F-design-system runtime referent?

**Background:** brief §4 + §10 confirmation criteria require referentCitations to be complete and mechanically verifiable. The 29 rows cover: 12 master-set citations (LightMasters, RussellScale, LightConstants, PinnedMaterials, PinnedMaterial shape, DensityScale, HCompressionTiers, TypeMasters, SpaceMasters, MotionMasters timing, MotionMasters curves, Z); 4 engine-function citations (deriveLight, deriveType, deriveSpace, deriveMotion); 4 cardinality citations (light, type, space, motion); 1 DOM-only citation (DesignSystemProvider); 1 frozen-literal citation (PinnedMaterials as const); 4 derivation-formula citations (H_PRESS, H_HOVER, density, type, space); 1 motion-Russell-2-power citation; 1 motion-light-overlap citation; 1 type-derivation citation = total 29. (Recount from §2.10 table.)

**Resolution paths:**
- **(a) Accept table as exhaustive.** L0 confirms all material runtime invariants are cited.
- **(b) Direct expansion.** L0 identifies un-cited runtime structure (e.g., specific helper functions like `hslRgb`, `concentration`, `absorption`; specific use-page-transition / use-planet patterns).
- **(c) Direct contraction.** L0 identifies citations that should be removed (e.g., overly-fine-grained citations).

**Builder default:** path (a). Each citation conforms to substrate §4 A-18 ExpectedShape and is mechanically resolvable. Helper functions in light-engine.ts (hslRgb, concentration, absorption, darkBlend, shiftedHue, shiftedSat) are covered by DSA2 (purity predicate over engine bodies including helpers) and DSA4 (formula identity for concentration/absorption/darkBlend); separate citations would be redundant. use-planet / use-page-transition are R4 animation choreography per §1 scopeOut.

**Status:** **RESOLVED** at L0 disposition Sprint 5.5 close → **path (a) accepted**. 29 ReferentCitations confirmed exhaustive. G-V10 / G-S8 / G-L11 substantive first-run scheduled at first system-wide audit cycle post-Sprint-5.5 close per metaframework §5 first-run-execution lifecycle event.

### §10.D6 — Forward-declared HR-DS3 + HR-DS4 shape

**Question:** which fields of HR-DS3 (RSF v1.0 future) and HR-DS4 (Cognitive v1.3+ future) are frozen at v1.0 vs deferred to Sprint 8?

**Background:** brief §3.6 + §1.21 natural-defer admits forward-declared HRs whose shape is frozen but instances are deferred. Builder default freezes: direction, carrier-applicability, diagnosticSignificance. Builder defaults defer: concrete invariant text, captureShape concrete fields (declared as forward-compatible stubs in §6.3).

**Resolution paths:**
- **(a) Accept current freeze/defer split.** L0 confirms direction + carrier-applicability + diagnosticSignificance are sufficient at v1.0; remaining fields land at Sprint 8.
- **(b) Tighter freeze.** L0 directs concrete captureShape fields at v1.0 (requires anticipating Sprint 8 RSF + Cognitive v1.3+ amendments).
- **(c) Looser freeze.** L0 directs everything-deferred — only HR existence frozen.

**Builder default:** path (a). Three fields frozen, three deferred. Forward-compatible per substrate §1.21.

**Status:** **RESOLVED** at L0 disposition Sprint 5.5 close → **path (a) accepted**. HR-DS3 + HR-DS4: direction + carrier-applicability + diagnosticSignificance frozen at v1.0; concrete invariant text + concrete captureShape fields deferred to Sprint 8 (RSF v1.0 + Cognitive v1.3+ register against the frozen contract).

### §10.D7 — Carrier = self confirmation

**Question:** is `carrier: self` the correct declaration for Design Standard at v1.0?

**Background:** Design Standard does not emit typed-work artifacts; its outputs are CSS variables and JS constants applied directly to DOM. Brief §4 explicitly declares carrier=self valid; LM v2.x is the per-framework precedent for an L3 framework declaring carrier=self by argument from its own §2.2 emission surface (L0 confirmed LM's binding in its own gate); substrate §9 Carrier enum admits `'self'`.

**Resolution paths:**
- **(a) Accept carrier=self.** L0 confirms; routine.
- **(b) Direct carrier=named (AS-routed).** L0 directs Design Standard to wrap outputs in AS v2.2 emission. Rejected by builder as scope drift — Design Standard outputs are not artifacts.
- **(c) Direct carrier=none.** L0 directs Design Standard to declare AxiomRef[] only (no W-ATOM emission). Rejected as drift — Design Standard does emit substantial output (110 CSS variables + JS constants).

**Builder default:** path (a). LM precedent + brief §4 endorsement + substrate §9 enum membership all support.

**Status:** **RESOLVED** at L0 disposition Sprint 5.5 close → **path (a) — `carrier: self`** confirmed (manager amendment 4). §6.1 basis text cites LM v2.x precedent + substrate §9 Carrier enum (`Carrier = 'self' | 'named' | 'none'`; `'self'` enumerated). Carrier declaration final at v1.0; future amendments do not revisit unless substrate §9 Carrier enum amends.

### §10.D8 — Runtime instrumentation deferral (HR-DS2 captureShape)

**Question:** is the runtime instrumentation gap at HR-DS2 captureShape acceptable at v1.0?

**Background:** §6.3 declares HR-DS2 captureShape with capturedFields enumerated. F-design-system slice at HEAD `9862092` does not currently emit logs satisfying this captureShape — DesignSystemProvider mount effect lacks an instrumentation hook. X3 (Observability) audit dimension carries this as `declared-incomplete-runtime` per §8.2.

**Resolution paths:**
- **(a) Accept gap as forward-compatible deferral.** Declaration is current per X3 C5; instrumentation amendment lands in subsequent hygiene sprint per brief §10 confirmation criteria pattern (subsequent sprint adds canonical-spec markers per brief §7; same hygiene pattern accommodates instrumentation).
- **(b) Direct instrumentation in this sprint.** L0 directs F-design-system code amendment in Sprint 5.5 — out of brief scope (brief §12 declares "no code changes").
- **(c) Drop the captureShape declaration.** Rejected — declaring HR-DS2 with `diagnosticSignificance: true` requires captureShape per X3 C5; dropping the captureShape forces dropping diagnosticSignificance to false, which contradicts the mount-effect's actual operational significance.

**Builder default:** path (a). Forward-compatible; consistent with brief §7 marker-deferral pattern.

**Status:** **RESOLVED** at L0 disposition Sprint 5.5 close → **path (a) accepted**. Runtime instrumentation amendment lands in subsequent hygiene sprint per X3 forward-compatible deferral pattern. HR-DS2 captureShape declaration stands at v1.0; runtime emission deferred.

---

**End of design-standard-v1-0. L0-confirmed at Sprint 5.5 close per §5.3 (confirmedAt 2026-05-02T00:00:00Z); all eight Decision-D anchors at §10 RESOLVED.**
