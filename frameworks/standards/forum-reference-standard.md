---
kind: framework
placement: frameworks/standards/
---

# LIV Forum Reference Standard v1

**Status:** L0-confirmed (demos, 2026-07-02). The professional standard the forum's references adopt.
**Intent:** the public forum is LIV's own way to *record references* to a professional, open standard —
addressable, portable, and interoperable. Two established standards, composed:

- **Addressing → URN (RFC 8141).** Every memory coordinate has one canonical name.
- **Reference/reply shape → W3C Web Annotation Data Model.** A post is an *annotation*: a **body**
  (the post's own words + marks) that has a **target** (what it points at).

Neither is reinvented. LIV rides both on the substrate it already has.

---

## 1 · Address — the URN

Every substrate coordinate `{ who, sc, pos }` names itself as:

```
urn:liv:<who>.<sc>.<pos>          e.g.  urn:liv:wearer.5.12
```

Two reserved resource names (not coordinates):

```
urn:liv:forum                     the forum itself — a top post's target
```

**Why this exact form (a hard constraint, not aesthetics):** the reference rides as *content* — one
word inside the post's words — so it must survive the substrate cutter as **one word-cell**. The cutter
keeps a token whole only while every internal punctuation is a **single char flanked by word-chars on
both sides**. In `urn:liv:wearer.5.12` every `:` and `.` is single and flanked (`n:l`, `v:w`, `r.5`,
`5.1`) → it survives as one `RawWord`, round-trips through the cut, and parses back per-word. A URL
form (`liv://…`, slashes) would shatter into three cells and be unparseable. URN, not URL, by design.

## 2 · Reference — the Web Annotation shape

A published post is an annotation. Realized on the existing turn, no new store:

| Web Annotation | LIV realization |
|---|---|
| **body** | the post's `reply` + marks (the normal marked turn) |
| **target** | a URN, carried as a **field value** on the post (see §3) |
| **motivation** (optional, later) | `replying` vs `citing` — deferred to v2 |
| **selector** (optional, later) | a span within the target (cite an exact span) — deferred to v2 |

v1 targets a whole node (or `urn:liv:forum`). Spans/selectors are the v2 growth path — the standard
already has the slot, so nothing needs re-designing to add them.

- **Top post** → `target: urn:liv:forum`.
- **Reply** → `target:` the parent post's URN (`urn:liv:<who>.<sc>.<pos>`).

The whole reply graph is walkable from the public read alone: read the public nodes, parse each one's
target URN back out, follow the edges.

## 3 · Two un-welds (what changes from the current build)

The current build hardcodes both the target and the confirm. Both become **recorded field values**.

1. **Target is a field, not a weld.** Today `publish` hardcodes `target = FORUM_ROOT`, so every post is
   a top post and replies are impossible. The model supplies `target` (a URN) as a value; absent →
   defaults to `urn:liv:forum` (a top post). This is what makes replies real.

2. **The wearer's confirm is a recorded value, not a transient flag.** Publishing a public memory
   requires the wearer's OK. Today that OK is a throwaway transport boolean (`confirmed`) that gates the
   write and vanishes. Instead the OK is **recorded as a value on the published payload** — an
   attestation the model fills when the wearer confirms — so the consent lives *in the memory*, auditable
   forever, not just in the moment. The two-phase surface (phase one returns the confirm prompt; phase
   two proceeds) stays; what changes is that phase two **stamps the confirmation as data**, not nothing.

## 4 · Invariants (carry across the build)

- **The forum still authors nothing new.** Publishing is the normal marked compose, stamped public.
  The URN target and the confirm attestation are *values on that turn*, not a separate store or shape.
- **Append-only, read-time convergence.** A reply never mutates its parent; the graph is computed on
  read by following target URNs. (Consistent with the store's append-only law.)
- **Deletable.** Remove the forum slice and the substrate is byte-unchanged.
- **The reference format lives in ONE home** (the scheme + build/parse), read everywhere, re-typed
  nowhere.
