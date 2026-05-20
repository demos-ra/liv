---
kind: backlog-disposition-note
shot: Side-Quest Shot 3 — Phase C close
date: 2026-05-19
---

# Backlog disposition note — Shot 3 close

Per Side-Quest spec §SHOT 3 §"Out of scope (Phase C)" backlog clause: *"PS PA-IR3 §IV.3 citation; MANIFEST AS v2.4 vs Manual L304/L390 AS v2.3: **opportunistic during this phase if same lines are touched, otherwise carry as backlog.** Manager confirms with L0 if drift items surface organically in the same edit window."*

This note records the disposition of each backlog item after Shot 3 close.

---

## §1 PS PA-IR3 §IV.3 citation

**Origin.** Brief §2 backlog item — Perimeter Standard PA-IR3 leaf-axiom carries a citation to Manual §IV.3 (governance loop subsection); the citation may be stale or off-section after intervening Manual revisions.

**Status after Shot 3.**
- Shot 3 touches Manual top-of-file SPEC line + canonical-naming section + Part I end-of-part addendum + change-log + end-of-Manual footer. **Manual §IV (Part IV — Governance Loop) is not touched.**
- PS PA-IR3's citation target is Part IV. No content under Part IV was amended at Shot 3. The citation, whatever its current accuracy state, is unchanged from v13.3 state.
- **Disposition: CARRIED FORWARD as backlog.** Not a same-line touch in Shot 3.

**Recommendation for Phase D / terminal audit.** Phase D may touch Perimeter Standard if a per-Standard ContentClass declaration is added for F-identity (Boundary) emissions. If PS is touched, the PA-IR3 citation is a same-line-touch candidate for opportunistic verification + correction. Alternatively, terminal audit (Shot 6) D8 (authority chain integrity) per spec §SHOT 6 audit dimensions may surface this citation as needing verification.

---

## §2 MANIFEST AS v2.4 vs Manual references to AS v2.3

**Origin.** Sprint B2 Shot 5 advanced Artifact Standard v2.3 → v2.4 in MANIFEST. Manual references to AS were not updated to v2.4 at B2 Shot 5; carry-forward drift.

**Locations in Manual.** Three sites identified during Shot 3 inspection:
- **Line 304 (Part III §Artifacts):** *"The carrier shape is universal across programs, declared by the artifact standard (currently AS v2.3)."* — pre-existing B2 Shot 5 carry-forward.
- **Line 409 (Operations slot-status table):** *"F-artifact | Artifact Standard v2.3"* — pre-existing B2 Shot 5 carry-forward.
- **Change-log v13.3 row prose:** mentions "L390 F-artifact→AS v2.3" as a v13.3-fix-round sweep target — that fix was applied at v13.3 but did not catch the v2.3→v2.4 bump at B2 Shot 5 because B2 Shot 5 post-dated v13.3.

**Status after Shot 3.**
- Shot 3 does not touch Part III §Artifacts (line 304) — out of scope per spec W1/W2 placement.
- Shot 3 does not touch Operations slot-status table (line 409) — Operations is process-level reference (per Manual §Operations opening prose), not amended in Phase C.
- Shot 3 change-log row v13.3 is left byte-identical (only the new v13.4 row is appended).
- **Disposition: CARRIED FORWARD as backlog.** Not same-line touches in Shot 3.

**Additional related drift surfaced during Shot 3 (NEW):**
- **Line 227 (Part II §Store closing paragraph):** *"governed by Living Memory v3.3."* — became stale at Shot 2 ratification (LM is now v3.4).
- **Line 403 (Operations slot-status table):** *"Store | Living Memory v3.3"* — same staleness.

These two new LM-version drift sites are Shot-2-consequences. Same backlog class as the AS drift.

**Recommendation for Phase D / terminal audit.** Phase D will touch Operations slot-status table (line 403 area) if it amends Store-related declarations or adds rows for newly-ContentClass-declared Standards. Same-line-touch opportunity. Alternatively, a single Phase-F-or-later Manual hygiene pass can sweep all four version-ref sites in one edit.

---

## §3 Backlog ledger summary

| Item | Origin | Pre-Shot-3 | Post-Shot-3 | Suggested fix locus |
|---|---|---|---|---|
| PS PA-IR3 §IV.3 citation | Brief §2 | Carried | Carried | Phase D if PS amended; else terminal audit |
| MANIFEST AS v2.4 vs Manual line 304 | B2 Shot 5 | Carried | Carried | Phase D if AS amended; else Manual hygiene pass |
| MANIFEST AS v2.4 vs Manual line 409 | B2 Shot 5 | Carried | Carried | Phase D if AS amended; else Manual hygiene pass |
| Manual line 227 `LM v3.3` | Shot 2 consequence | (N/A) | New entry | Phase D if Store amended; else Manual hygiene pass |
| Manual line 403 `LM v3.3` | Shot 2 consequence | (N/A) | New entry | Phase D if Store amended; else Manual hygiene pass |

---

## §4 Disposition meta

All backlog items above are **mechanical** (version-ref corrections / citation freshness checks). None implicate vision, axioms, gates, or atom shapes. None block Shot 4 dispatch. Terminal audit (Shot 6) will re-test against the cumulative apparatus state; any backlog items remaining at Shot 6 entry surface there for closure-or-deferral decision.

End of backlog disposition note.
