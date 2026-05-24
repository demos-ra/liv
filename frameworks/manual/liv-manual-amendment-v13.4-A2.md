---
kind: manual-amendment
placement: frameworks/manual/
applies-to: liv-manual.md SPEC-v13.4
amendment-id: v13.4-A2
sprint: B3 — present v4.0 → v5.0 (sprint-b3-present-v5, the present-structure re-derivation)
status: build artifact — pending L0 ratification (occurs after build-tier audit)
---

# LIV Manual — Amendment v13.4-A2

## The F-present per-user snapshot-archive store

This is a **scoped amendment** to the resident `liv-manual.md` at SPEC-v13.4. It
amends two loci — the SPEC header note (line 10) and the `### The phantom layer`
subsection in Part I — Substrate — and adds one change-log row. It is not a
re-issue of the Manual; it is the patch the present v5.0 build requires,
presented for L0 ratification before it is folded into the Manual file.

The amendment is forced by Present Standard v5.0 §16.5 and the §16-REF reference
layer ([R12]/[R13]) of the L0-confirmed working record
`substrate-present-rederivation-working-record.md`. Mode: structural — naming a
new store F-present owns, and confirming it does not disturb the single-store
property of the **substrate**.

It follows Amendment v13.4-A1 (present v4.0 — F-present scoped out of the
emitting-apparatus set as a non-emitter). A2 does not revisit A1; A1 stands. A2
addresses one new fact A1's model did not carry: at v5.0, F-present **archives**
every snapshot it resolves.

---

## 1. The one fact this amendment carries

At Present Standard v5.0 (sprint-b3-present-v5, the present-structure
re-derivation) F-present is re-derived so that it **holds the live snapshot AND
archives every resolved snapshot** to a **new per-user store in the LIV
database** — F-present's own store ([R12]/[R13]). A scrub-back ("show me
Tuesday") becomes an archive lookup: the past snapshot is retrieved, not
recomputed ([R14]).

This raises exactly one question at Manual tier: the Manual's Part I — Substrate
states the substrate is **single-store** — "no parallel store, no second
substrate, no fork." Does a new per-user archive store violate that?

**It does not.** The single-store property is a property of the **substrate**.
The archive store is **not the substrate** — it is F-present's own store, a
read-side layer above the substrate, exactly as the held live snapshot is
F-present's own state. The substrate remains one store; F-present, a separable
read-side layer, keeps its own held snapshot and its own archive of snapshots.
"Delete F-present and the substrate stands" — established at A1 for the held
snapshot — holds identically for the archive: both die with the read-side layer;
the substrate is untouched.

This amendment makes that legible. It does not change the substrate, the
single-store property, or any substrate axiom (MA1–MA6 frozen).

---

## 2. What v13.4 and A1 got right, and what A2 adds

The v13.4 phantom-layer addendum and Amendment A1 stand **unchanged**. Their
structural claims hold:

1. **Single-store preserved** — the substrate is one store; ContentClass and
   scope are attributes on content within it, not partitions into separate
   stores. **Unchanged.** A2 confirms: the archive store is not a substrate
   partition and not a second substrate — it is a separate, read-side,
   F-present-owned store, the same category of thing as F-present's held live
   snapshot.
2. **Root claim mechanically preserved** — LMA7 anchor-derivation reads
   `wearer-life` only. **Unchanged.** The archive holds resolved snapshots, not
   substrate state-changes; it is not in any anchor-candidate set.
3. **The phantom layer is real** for emitting programs; **F-present is a
   non-emitter** (A1) and contributes no phantom-layer content. **Unchanged.**
   A2 confirms the non-emitter property is **not broken** by the archive: an
   *emitter* is a program that writes to the **substrate**; F-present writes to
   its **own** store, never the substrate, so it remains a non-emitter.

**What A2 adds.** One fact: F-present, the read-side layer, now has **two of its
own stores** — the held live snapshot (A1 named the first) and the per-user
snapshot archive (A2 names the second). Both are F-present's own; neither is the
substrate. The substrate is read-only to F-present and untouched by either.

---

## 3. The amendments

### A2.1 — SPEC header note (line 10)

**Locus:** `liv-manual.md` line 10 — the SPEC-v13.4 header paragraph.

**Append** one clause to the existing header note (the note already carries the
A1 clause about non-emitters; A2 appends after it):

> *(Amendment v13.4-A2 — present v5.0.)* F-present, the read-side layer, keeps
> its own stores above the substrate: the held live snapshot and, at Present
> Standard v5.0, a per-user snapshot archive. Both are F-present's own; neither
> is the substrate. The substrate's single-store property is unchanged — it is a
> property of the substrate, and a read-side layer's own stores are not the
> substrate.

Rationale: the header note is the Manual's running record of what each amendment
within v13.4 establishes. A2 adds the archive-store fact at the same register A1
used for the held snapshot.

### A2.2 — Part I — Substrate, `### The phantom layer` subsection

The phantom-layer subsection (Part I) is where A1 placed its closing paragraph on
non-emitters and F-present as the worked example. A2 appends **one paragraph**
immediately after A1's closing paragraph. The three bolded structural claims and
the four-bullet `system-introspection` block are **retained verbatim** — A2 edits
nothing already there.

**Append** after A1's closing paragraph (the one ending "...the read-side lens is
a separable layer above it."):

> **A read-side layer keeps its own stores (Amendment v13.4-A2).** A non-emitter
> writes nothing to the substrate — but it may keep stores of its **own**, above
> the substrate, that are not the substrate. F-present is again the worked
> example. At Present Standard v5.0 F-present resolves the flat substrate ledger
> into the snapshot — a weighted rooted tree — and keeps two of its own stores:
> the **held live snapshot** (the working present, one per wearer-and-scope) and
> a **per-user snapshot archive** (every resolved snapshot, retained, so a
> scrub-back to a past present is a lookup rather than a recompute). Neither
> store is the substrate. The substrate stays one store, single-axis, MA1–MA6
> frozen; F-present's stores are a separable read-side layer above it. The
> single-store property names the substrate, and the substrate is untouched —
> "delete F-present, the substrate stands" holds for the held snapshot and the
> archive alike. A non-emitter is defined by what it does **not** write to the
> substrate, not by whether it keeps state of its own; F-present keeps a held
> snapshot and an archive and remains, exactly, a non-emitter.

Rationale: the paragraph names the new store, places it in the same category as
the held snapshot A1 already established, and forecloses the one misreading the
addition could invite — that an archive is a "second store" violating
single-store. It is a second store *of F-present's*; it is not a second
*substrate*.

---

## 4. Amendment A2.3 — change-log row

**Locus:** `liv-manual.md` change-log table, a new row immediately below the
`v13.4-A1` row (the addendum amends within v13.4; no SPEC bump).

**Add row:**

| Amendment | Date | Change | Source |
|---|---|---|---|
| v13.4-A2 | 2026-05-23 | **Sprint B3 — present v5.0. The F-present per-user snapshot-archive store.** Predecessor: SPEC-v13.4 + Amendment v13.4-A1. Derived from Present Standard v5.0 §16.5 and the L0-confirmed working-record §16-REF [R12]/[R13]. **Δ-HEADER.** SPEC header note (line 10) gains one appended clause: F-present, the read-side layer, keeps its own stores above the substrate — the held live snapshot and, at v5.0, a per-user snapshot archive; neither is the substrate; the substrate's single-store property is unchanged. **Δ-PART-I.** The `### The phantom layer` subsection gains one appended paragraph after A1's closing paragraph, naming F-present's per-user snapshot archive, placing it in the same category as the held live snapshot (a read-side layer's own store, not the substrate), and confirming the non-emitter property is unbroken — an emitter is defined by writing to the *substrate*, and F-present writes to its own store, never the substrate. The three bolded structural claims (single-store preserved / root claim mechanically preserved / the phantom layer) and the four-bullet `system-introspection` block are RETAINED verbatim. **Single-store NOT amended.** The substrate stays one store, single-axis, MA1–MA6 frozen. The archive is F-present's own store, not a substrate partition and not a second substrate. **Vision NOT amended.** Root claim text byte-identical. Three-loops, six-category program model, Path A / Path B framing all byte-identical. The amendment names a new read-side store; it does not revise vision. **No SPEC bump.** A2 rides as a discrete amendment file pending L0 ratification; it folds into the Manual at the next minor bump alongside A1. **No atom shapes amended at Manual tier.** `SnapshotArchiveEntry` / `SnapshotArchiveKey` / `GranularityDial` are declared at Present Standard v5.0 §2.1; no schema, rule, or gate is amended at Manual tier. **Drift-check sweep D1–D7:** PASS — D1 part-boundary integrity preserved (both edits at their structurally-correct loci, continuous with A1); D2 store/substrate distinction preserved and *reinforced* (A2's whole subject is keeping the archive store distinct from the substrate); D3 generator closure unchanged; D4 domain enumeration unchanged; D5 vision drift NOT triggered (root claim preserved; the amendment names a read-side store, it does not redefine LIV); D6 governance gap unchanged (the amendment traces to Present Standard v5.0 §16.5 + working-record §16-REF); D7 category conflation NOT triggered (the archive is named at its correct tier — a read-side layer's own store, explicitly not the substrate). authorityClaim: {level:'L0', confirmedBy:'pending — ratification follows build-tier audit', timestamp:'sprint-b3-present-v5-build-close-pending'} | L0 pending — ratification occurs after build-tier audit |

---

## 5. What this amendment does NOT touch

- **The substrate.** One store, single-axis, MA1–MA6 frozen. The archive store
  is **not** the substrate — it is F-present's own store in the LIV database.
  **Unchanged.**
- **Single-store.** The single-store property is a property of the substrate.
  A read-side layer keeping its own stores does not touch it. No parallel
  substrate, no fork. **Unchanged — and reinforced.**
- **The non-emitter property (A1).** F-present writes nothing to the substrate.
  Writing to its own store is not a substrate write; F-present remains a
  non-emitter. **A1 stands; A2 confirms it under the new store.**
- **LMA7 / LMA13 / the phantom layer.** Anchor-derivation reads `wearer-life`
  only; the phantom layer is real for emitting programs. The archive holds
  resolved snapshots, not substrate state-changes — it is in no anchor-candidate
  set and is not phantom-layer content. **Unchanged.**
- **ContentClass.** `wearer-life` / `system-introspection`, the canonical-naming
  row, the emitter-side scoping from A1 — all unchanged. The archive carries no
  ContentClass (it holds snapshots, not emitted state-changes).
- **The Operations Tool slot for F-present.** F-present remains a Tool slice in
  the Operations enumeration. The new store is internal to F-present's execution
  tier; it adds no slice and no category.

The amendment is bounded: it names one new store F-present owns and confirms it
sits cleanly outside the substrate, so the Manual's single-store property is
preserved — and made more legible — rather than disturbed.

---

**End of Manual Amendment v13.4-A2. Pending build-tier audit and L0 ratification;
folds into `liv-manual.md` at the next Manual minor bump alongside v13.4-A1.**
