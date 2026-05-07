# ERRATA — sprint-6-structure-tightening

**Issued:** Sprint Placement Framework Shot 4
**Reference commit (pre-Shot-4):** `daccc54`
**Genesis report:** `frameworks/metaframework/reports/placement-standard-v1-0-genesis-report.md`

---

The Sprint 6 deploy bundle declared the unitary perimeter site at
`src/middleware.ts`. During Sprint Placement Framework Shot 3 the perimeter
site was relocated to `middleware.ts` at project root, which is the
location declared by `PLACEMENT_REGISTRY.perimeter_site` (item kind
`typed-runtime-projectroot`). The relocation was forced by Next.js's
expectation that `middleware.ts` resolve at project root for static AST
extraction by Turbopack; `src/middleware.ts` did not satisfy that
constraint at composed-reality build time.

The Sprint 6 cycle records remain frozen as historical accuracy per
Manager Playbook §1.17. They correctly describe the Sprint 6 author-time
intent and the deploy bundle as it shipped from that sprint. This errata
exists to surface that the placement they assert (`src/middleware.ts`)
has been corrected — current truth resolves via `PLACEMENT_REGISTRY`
consultation, not via these records.

For full disposition of the relocation and its registry-consultation
discipline, see the Placement Standard genesis report cited above.
