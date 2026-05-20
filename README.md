# Side-Quest: ContentClass apparatus alignment — Deploy bundle

**Side-quest:** ContentClass apparatus alignment (6 shots, 2026-05-19)
**Final MANIFEST:** v3.3.7 — SIDE-QUEST CLOSURE
**Status:** All 8 audit dimensions converge on apparatus-harmony. Ready for L0 ratification and deploy.

---

## Bundle structure

```
deploy-bundle/
├── README.md                              # This file
│
├── frameworks/                            # Apparatus state (ratified)
│   ├── metaframework/
│   │   ├── MANIFEST.md                    # v3.3.7 (7 cycle blocks chronologically)
│   │   └── frameworks/
│   │       └── substrate-v1-1.md          # v1.8.3 (+A-24 ContentClass)
│   ├── standards/
│   │   ├── living-memory.md               # v3.4 (+LMA13 + ThreadQueryInput.contentClass?)
│   │   ├── artifact-standard.md           # v2.5 (Phase D)
│   │   ├── research-standard.md           # v1.1 (Phase D)
│   │   ├── verification-standard.md       # v1.1 (Phase D)
│   │   ├── plan-standard.md               # v2.3 (Phase D — two-kinds-of-record canonical site)
│   │   ├── builder-standard.md            # v1.1 (Phase D)
│   │   └── present-standard.md            # v1.0.1 (NEW — first appearance, Path 3)
│   └── manual/
│       └── liv-manual.md                  # SPEC-v13.4 (+canonical naming + phantom-layer addendum)
│
├── src/                                   # Runtime code (11 callsites ContentClass-stamped)
│   ├── core/types/
│   │   └── substrate.types.ts             # +A-24 ContentClass union, +SubstrateSourceRef.contentClass, +helper, +ThreadQueryInput.contentClass?
│   ├── features/
│   │   ├── F-artifact/app/artifact-emit.ts                # wearer-life
│   │   ├── F-builder/app/builder-workflow.ts              # system-introspection
│   │   ├── F-chat/contract/chat-contract.ts               # helper-derived + static 'ai' → wearer-life
│   │   ├── F-discover/contract/discover-contract.ts       # wearer-life
│   │   ├── F-identity/contract/perimeter-consultation.ts  # helper-derived
│   │   ├── F-memory/config/substrate-config.ts            # config (no emission)
│   │   ├── F-memory/exec/substrate-repository.ts          # read-side (reads DB column)
│   │   ├── F-plan/app/plan-pipeline.ts                    # system-introspection
│   │   ├── F-plan/contract/plan-contract.ts               # wearer-life
│   │   └── F-verify/contract/verify-contract.ts           # wearer-life
│   └── proxy.ts                                           # helper-derived
│
├── migrations/
│   └── 020-content-class.sql              # source_content_class TEXT NOT NULL + index
│
├── derivation-logs/                       # Per-shot derivation records
│   ├── derivation-log-shot-1.md
│   ├── derivation-log-shot-2.md
│   ├── derivation-log-shot-3.md
│   ├── backlog-disposition-note-shot-3.md
│   ├── derivation-log-shot-4.md
│   └── derivation-log-shot-5.md
│
└── audit-reports/                         # Shot 6 terminal-audit outputs
    ├── terminal-audit-report.md           # 8-dimension convergence audit
    └── apparatus-state-summary.md         # Final ratified versions + handoff
```

---

## Audit-ready summary

**8-dimension convergence:** ALL PASS.

| Dimension | Result |
|---|---|
| D1 Cross-shot basis chain integrity | ✓ |
| D2 Anchor-derivation invariant verification | ✓ (1 precision item — Plan §6.12 predicate-prose) |
| D3 Cross-axis projection orthogonality | ✓ |
| D4 ContentClass propagation completeness | ✓ |
| D5 Snowball protection | ✓ |
| D6 Manual drift-check D1–D7 | ✓ |
| D7 Substrate single-store invariant | ✓ |
| D8 Authority chain integrity | ✓ |

**Convergence statement:** *The wearer-life vs system-introspection distinction holds across the entire apparatus.*

**Three precision items surfaced to L0 for next-cycle attention:**
1. Plan §6.12 predicate-prose completeness (cite `'agent' (or role-semantic equivalents: 'author', 'creator')`)
2. RC kind `'discipline-axiom-governance'` name confirmation
3. LM §3.11 `source_content_class → positions` index promotion (defer to F-present build sprint vs theoretical-grounds promotion now)

---

## Deploy procedure (apply this bundle to server)

The standard LIV deploy lifecycle per Manual Operations §Deployment:

```bash
# 1. Overlay onto local working tree (from this bundle's root)
cp -r frameworks/ src/ migrations/ <liv-repo-root>/

# 2. Verify build is clean
cd <liv-repo-root>
npm run build         # expects zero errors

# 3. Apply DB migration
psql <database> -f migrations/020-content-class.sql
#   Migration is idempotent: adds source_content_class column with channel-derived
#   backfill for legacy rows (5/6 channels deterministic; internal-derivation legacy
#   rows stamped 'system-introspection' provisionally per Shot 1 backfill rule).

# 4. Commit + push
git add -A
git commit -m "side-quest: ContentClass apparatus alignment (Shots 1-6 cumulative)"
git push

# 5. On server (45.76.29.178 or current host)
git pull
npm run build
pm2 restart liv --update-env
pm2 logs liv --lines 50    # verify boot markers
```

**Boot markers to expect:**
- Substrate boot: `substrate v1.8.3 with 24 atoms`
- LM boot: `living-memory v3.4 with 13 axioms`
- Migration applied: `020-content-class.sql` records present
- No type errors on startup
- F-present implementation cycle is **post-deploy build sprint** — Present Standard v1.0.1 declares the contract; F-present runtime code is not in this bundle (Shot 5 W-out-of-scope clause)

---

## What changed (cumulative across Shots 1-6)

### Apparatus (frameworks/)
| Component | Pre | Post |
|---|---|---|
| Substrate | v1.8.2 | v1.8.3 (+A-24 ContentClass atom; +SubstrateSourceRef.contentClass required field) |
| Living Memory | v3.3.1 | v3.4 (+LMA13 discipline axiom; +LMA7 candidate-set clause; +LMA9 optional contentClass filter; +ThreadQueryInput.contentClass?; +source_content_class index optional; +ContentClass vocabulary; +typed-shape row; +Structure-axis RC entry block) |
| Manual SPEC | v13.3 | v13.4 (+Canonical naming ContentClass row; +Part I `### The phantom layer` addendum; root claim + three-loops + six-category byte-identical) |
| Artifact Standard | v2.3 (stale-header drift) | v2.5 (§3.7 S3 inline Phase D declaration; drift closed) |
| Research Standard | v1.0 | v1.1 (§6.12 Phase D classification subsection) |
| Verification Standard | v1.0 | v1.1 (§6.12 Phase D classification subsection) |
| Plan Standard | v2.2 | v2.3 (§6.12 — canonical two-kinds-of-record discipline site) |
| Builder Standard | v1.0 | v1.1 (§6.11 Phase D classification subsection) |
| Present Standard | (not in tree) | v1.0.1 (NEW — first appearance, Path 3) |

### Runtime (src/)
**11 active classified emission/read paths:**
- 6 static `'internal-derivation'` callsites with ContentClass literal (F-artifact, F-builder, F-discover, F-plan×2, F-verify)
- 1 static `'ai'` channel → `'wearer-life'` deterministic (F-chat)
- 3 variable-channel sites use `deriveContentClassFromChannel(channel)` helper (F-chat, F-identity, proxy)
- 1 read-side reads `source_content_class` column from DB (F-memory)

### Database (migrations/)
- `020-content-class.sql`: adds `source_content_class TEXT NOT NULL` column to `state_change` table with channel-derived backfill; optional index `state_change_content_class_idx`

---

## Carried backlog (out-of-side-quest)

1. v3.3.1 MANIFEST line listing `substrate-v1-1.md → v1.8.1` (Sprint B2 Shot 5 carry; predates side-quest; mechanically additive)

This is the only carried item. All other backlog items closed at Shot 6.

---

## Authority chain

L0 (Demos) ratified per shot. Each version bump carries `authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Side-Quest-Shot<N>-pending'}` until ratification confirmation. AmendmentProvenance rows present at every version bump across all 6 shots.

---

## End of side-quest

The wearer-life vs system-introspection distinction holds. The phantom layer is named. The single-store invariant is preserved. The root claim is preserved. Snowball protection holds — future Tools inherit LMA13 automatically; no per-Tool exclusion clauses required.

Side-quest closes. F-present implementation cycle begins post-deploy.
