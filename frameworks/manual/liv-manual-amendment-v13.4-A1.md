---
kind: manual-amendment
placement: frameworks/manual/
applies-to: liv-manual.md SPEC-v13.4
amendment-id: v13.4-A1
sprint: B3 — present v3.0 → v4.0 reconciliation (b3-v4-reconciliation)
status: build artifact — pending L0 ratification (occurs after build-tier audit)
---

# LIV Manual — Amendment v13.4-A1

## Phantom-layer addendum reconciliation for the F-present non-emitter model

This is a **scoped amendment** to the resident `liv-manual.md` at SPEC-v13.4. It
amends two loci — the SPEC header note (line 10) and the `### The phantom layer`
subsection in Part I — Substrate (lines 135–151) — and adds one change-log row.
It is not a re-issue of the Manual; it is the patch the present v4.0 build
requires, presented for L0 ratification before it is folded into the Manual file.

The amendment is forced by Present Standard v4.0 §16.7, derived from the L0-walked
working record `substrate-present-rederivation-working-record.md` §16. Mode:
structural — re-stating an existing addendum so it no longer carries a claim the
v4.0 model voids.

---

## 1. What the v13.4 addendum got right, and the one thing it must correct

The v13.4 phantom-layer addendum stands **almost entirely unchanged**. Its three
structural claims hold:

1. **Single-store preserved** — ContentClass is an attribute on contents within
   the one store, parallel to scope. No parallel store, no fork. **Unchanged.**
2. **Root claim mechanically preserved** — LMA7 anchor-derivation reads
   `wearer-life` only; cognition-extension operates over cognition, not over
   apparatus traces. **Unchanged.**
3. **The phantom layer is real** — `system-introspection` content is structurally
   present, durably persisted, LMA9-queryable, and excluded from LMA7
   anchor-candidacy by LMA13 construction. **Unchanged.**

The phantom layer is correct, load-bearing architecture **for emitting programs**
— it is the wall that keeps a hosted program's internal operation out of the
wearer's cognitive geometry. Working-record §14 Finding B confirms this and §16.7
re-affirms it.

**The one correction.** ContentClass is a **program-side emission-contract
property** — a program declares it *on what it emits to the substrate*. It is an
**emitter's** property. The v13.4 addendum's enumeration of what produces
`system-introspection` content named, among the apparatus's operational records,
**F-present's view-emissions**. Under Present Standard v4.0 (§16.2) **F-present is
a non-emitter**: it writes nothing to the substrate. Its output — the live
`PresentFrame` — is a weighted rooted tree the flat substrate ledger cannot hold;
F-present holds it as its own state. There is no F-present emission, therefore no
F-present `system-introspection` content, therefore F-present carries **no
ContentClass at all**.

The v13.4 addendum does not name F-present explicitly in its prose — but its
illustrative phrase "the apparatus has always emitted operational records" and
the implied membership of F-present in the emitting-apparatus set are now void
for F-present specifically. The phantom layer itself is untouched; what is
corrected is the **membership claim** — F-present is removed from the set of
programs that emit phantom-layer content, because F-present emits nothing.

The substrate stays **single-axis**. The v4.0 model adds no second axis, no second
store, no new ContentClass value. F-present's held frame is not in the substrate
at all (LMA8: the substrate does not store derived geometry; the held frame is
F-present's own, not the substrate's).

---

## 2. Amendment A1.1 — SPEC header note (line 10)

The header note's final sentences describe the phantom layer. They remain
accurate. **One clause is appended** to scope the emitting-program qualification.

**Locus:** `liv-manual.md` line 10, the SPEC-v13.4 supersession note.

**Append**, after the existing sentence ending
"...excluded from LMA7 anchor-candidacy by LMA13 construction (the **phantom
layer**).":

> Amendment v13.4-A1 (Sprint B3, present v4.0 reconciliation) scopes the
> phantom-layer membership: `ContentClass` is a program-side emission-contract
> property, declared by a program on what it emits. A **non-emitter** — a program
> that writes nothing to the substrate — declares no ContentClass and produces no
> phantom-layer content. F-present is re-derived as a non-emitter at Present
> Standard v4.0; it is removed from the emitting-apparatus set. The phantom layer,
> single-store, and the root-claim preservation are otherwise unchanged.

No other change to the header note. The Manual SPEC version does **not** bump for
A1 on its own — A1 is folded at the next Manual minor bump; until folded it rides
as this discrete amendment file (per the working-record §16.7 instruction that
the addendum is "reopened" for reconciliation, not re-issued).

---

## 3. Amendment A1.2 — `### The phantom layer` subsection (Part I — Substrate)

The subsection's three bolded claims (single-store preserved / root claim
mechanically preserved / the phantom layer) are **retained verbatim**. Two prose
adjustments and one new closing paragraph are made.

**Locus:** `liv-manual.md` lines 135–151, the `### The phantom layer` subsection
following `### System-L0`.

### A1.2.a — opening paragraph

The opening paragraph reads (line ~140):
"...records of system-operation (LIV's own operation — apparatus traces,
governance events, system-introspection emissions)."

**Re-state** the parenthetical to make the emitter-side scoping explicit:

> ...records of system-operation (LIV's own operation — apparatus traces and
> governance events that **emitting programs** write to the substrate, each
> declaring `ContentClass` on what it emits).

Rationale: the original parenthetical listed kinds of phantom-layer content
without scoping it to emitters. The re-statement makes the emitter-side property
legible at first mention, which the new closing paragraph (A1.2.c) then completes.

### A1.2.b — "The phantom layer" bullet block

The four-bullet block characterizing `system-introspection` content is **retained
unchanged**. It describes content that genuinely is in the substrate; it does not
name F-present and needs no edit.

### A1.2.c — new closing paragraph (replaces the final paragraph)

The subsection's final paragraph currently reads:
"The phantom-layer property names what was implicit at v13.3 — the substrate has
always accepted any typed signal honestly, and the apparatus has always emitted
operational records alongside wearer-life records. v13.4 makes this property
explicit..."

**Replace** that final paragraph with:

> The phantom-layer property names what was implicit at v13.3 — the substrate has
> always accepted any typed signal honestly, and emitting programs have always
> written operational records alongside wearer-life records. v13.4 makes this
> property explicit by naming the classification, the row-stamping discipline, and
> the anchor-derivation filter that together preserve the root claim across both
> kinds of content within one store.
>
> **ContentClass is an emitter's property (Amendment v13.4-A1).** A program
> declares `ContentClass` *on what it emits to the substrate*. The phantom layer
> is therefore populated only by **emitting programs** — programs that write typed
> state-changes to the store. A program that writes nothing — a **non-emitter** —
> declares no ContentClass and contributes no phantom-layer content. The substrate
> remains single-axis: the phantom layer is not a second axis or a second store,
> it is a classification on content within the one store, and only content that
> is actually written carries it.
>
> F-present is the worked example. At Present Standard v4.0 F-present is the read
> side — it resolves the flat substrate ledger into a weighted rooted tree (the
> live `PresentFrame`) and **holds that frame as its own state**. The frame is a
> shape the flat ledger cannot hold; LMA8 forbids the substrate storing derived
> geometry, so the frame is F-present's own, not the substrate's. F-present writes
> nothing to the substrate — it is a non-emitter — and therefore carries no
> ContentClass and appears nowhere in the phantom layer. "Delete F-present, the
> substrate stands" is literally true: the substrate is the open foundation, the
> read-side lens is a separable layer above it.

---

## 4. Amendment A1.3 — change-log row

**Locus:** `liv-manual.md` change-log table, a new row immediately below the
existing `v13.4` row (the addendum amends within v13.4; no SPEC bump).

**Add row:**

| Amendment | Date | Change | Source |
|---|---|---|---|
| v13.4-A1 | 2026-05-23 | **Sprint B3 — present v4.0 reconciliation. Phantom-layer addendum scoped to emitting programs.** Predecessor: SPEC-v13.4. Derived from Present Standard v4.0 §16.7 and the L0-walked working record §16. **Δ-HEADER.** SPEC header note (line 10) gains one appended clause scoping phantom-layer membership: ContentClass is a program-side emission-contract property; a non-emitter declares none and produces no phantom-layer content; F-present is re-derived as a non-emitter at Present Standard v4.0 and removed from the emitting-apparatus set. **Δ-PART-I.** The `### The phantom layer` subsection is reconciled: opening parenthetical re-stated to scope phantom-layer content to emitting programs; the four-bullet `system-introspection` characterization retained verbatim; the closing paragraph replaced with a paragraph naming ContentClass as an emitter's property and F-present as the worked non-emitter example. The three bolded structural claims (single-store preserved / root claim mechanically preserved / the phantom layer) are RETAINED — single-store, the single-axis substrate, and root-claim preservation are all unchanged. **Vision NOT amended.** Root claim text byte-identical. Three-loops, six-category program model, Path A / Path B framing all byte-identical. The amendment scopes a membership claim within an existing addendum; it does not revise vision. **No SPEC bump.** A1 rides as a discrete amendment file pending L0 ratification; it folds into the Manual at the next minor bump (the working record §16.7 directs the addendum is "reopened" for reconciliation, not re-issued). **No atom shapes amended at Manual tier.** No schemas, rules, or gates amended at Manual tier. **Drift-check sweep D1–D7:** PASS — D1 part-boundary integrity preserved (both edits at their structurally-correct loci); D2 store/substrate distinction unchanged; D3 generator closure unchanged; D4 domain enumeration unchanged; D5 vision drift NOT triggered (root claim preserved; the amendment scopes a membership claim, it does not redefine LIV); D6 governance gap unchanged (the amendment traces to Present Standard v4.0 §16.7 + working record §16); D7 category conflation NOT triggered (ContentClass remains a content-classification attribute at vocabulary tier). authorityClaim: {level:'L0', confirmedBy:'pending — ratification follows build-tier audit', timestamp:'b3-v4-reconciliation-build-close-pending'} | L0 pending — ratification occurs after build-tier audit |

---

## 5. What this amendment does NOT touch

- **Single-store.** ContentClass remains an attribute within the one store. No
  parallel store, no second substrate, no fork. **Unchanged.**
- **The substrate axes.** The substrate stays single-axis (Axis 1 state-change
  sequence; Axis 2 identity threads per LMA10). The held `PresentFrame` is not in
  the substrate — it is F-present's own state. **No new axis.**
- **LMA7 / LMA13.** Anchor-derivation reads `wearer-life` only; cross-class mixing
  forbidden. The phantom layer remains real for genuine emitting programs (plan,
  research, builder, the LLM's own emissions). **Unchanged.**
- **The ContentClass values.** `wearer-life` / `system-introspection` — neither
  renamed nor removed at this amendment. (The Finding-C rename and the ContentClass
  relocation to a program-declared property are named downstream work in the
  working record; they are not this amendment.)
- **The canonical-naming `ContentClass` row.** Unchanged.

The amendment is bounded: it scopes one membership claim inside one addendum so
the Manual no longer implies F-present emits, now that Present Standard v4.0 has
re-derived F-present as a non-emitter. Everything else the v13.4 addendum
established stands.

---

**End of Manual Amendment v13.4-A1. Pending build-tier audit and L0 ratification;
folds into `liv-manual.md` at the next Manual minor bump.**
