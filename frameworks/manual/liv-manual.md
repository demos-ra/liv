# LIV MANUAL

SPEC-v11.1 · 2026-05-06

Supersedes SPEC-v11.0 (Structure-Tightening Sprint additive amendment per §VII update protocol — III.4 bootstrap-mode acknowledgment + III.8 perimeter row promotion to filled slots; full delta documented at end of file).

**Discipline:** §1.25 compatibility-path. Additive reclassification, no substrate schema change. Existing src remains valid against v11.1 (and against v11.0 — v11.1 is a strict superset of v11.0's structural commitments).

**Structure:** cascading derivation across four loops plus reference catalogue plus operations and update protocol plus a flat element index.

```
Section I    — The Outer Loop
Section II   — The Program Loop
Section III  — The Governance Loop
Section IV   — Cross-cutting
Section V    — Kinds catalogue (reference)
Section VI   — Operations
Section VII  — Update protocol & vocabulary
Appendix A   — Core element index
```

Each section introduces only what its loop closes. Subsequent sections introduce additional kinds and concerns as they are forced by the next derivation step. No section duplicates another's canonicality. Cross-cutting (IV) absorbs only what governs multiple loops as load-bearing.

---

## Section I — The Outer Loop

**Abstraction:** vision level. **Voice:** declarative.

### I.1 Why LIV exists

LIV exists to extend a wearer's cognition across time.

A wearer thinks, decides, observes, and acts in a continuous present. Each moment produces signal — utterances, decisions, observations, intentions, perceptions — which would otherwise dissipate as the moment passes. Cognition that does not persist cannot compound; cognition that does not compound cannot extend.

LIV extends what becomes typed signal across time — including everything convertible to typed signal at the boundary (voice, image, video, sensor reading, document, structured event) and excluding what stays pre-articulate. All input modalities flatten to typed at the boundary; the substrate's role is the same regardless of input shape. What does not cross into typed jurisdiction is not extended by LIV.

Extension across time requires that what enters typed jurisdiction becomes durable structure that subsequent moments read against. The substance of "across time" is that signal from earlier moments remains available, structured, and faithfully reconstructible at later moments — without rewriting, without lossy summarization, without forced interpretation by the apparatus.

LIV is what makes this possible.

### I.2 The two structural units

Two structural units make extension across time possible.

**Arrival operations** are crossings between untyped reality and typed jurisdiction. Every signal that enters LIV — a wearer utterance, a tool reply, a scheduled trigger, an integration event, a sensor stream resolved into a typed reading — crosses into typed form at the boundary. Every signal that leaves LIV — a dispatched response, an action taken on the world — crosses out. Arrivals are bidirectional: typing on the way in, untyping on the way out.

**Internal operations** are typed-to-typed work between elements within typed jurisdiction. Reading what has accumulated, transforming what has been read, producing further typed structure that itself accumulates. Internal operations do not cross the typed/untyped frontier; they are work that runs entirely within it.

Both units are first-class. Neither is exception-handled by the other. Arrivals without internal operations would accumulate signal that is never acted upon. Internal operations without arrivals would have no signal to act upon. Extension across time requires both.

**Sufficiency.** Two structural units are sufficient against current derivation: every operation in LIV is either an arrival or an internal operation, and no third class surfaces. Revision protocol per Section VII applies if a counterexample is identified.

**Cascade discipline.** Section I commits only to what the outer loop closes. Domain capability extends Section II. Governance extends Section III. Cross-cutting concerns extend Section IV. Nothing absorbed by II, III, or IV requires amending I.

### I.3 What the outer loop requires

The two structural units force two roles that the outer loop must fill.

**Boundary transformation** is required because arrival operations cross between untyped reality and typed jurisdiction. Without something performing the typed/untyped transformation in both directions, untyped reality cannot enter typed jurisdiction and typed signal cannot dispatch to untyped reality. The transformation must run at the boundary, and it must run in both directions; an asymmetric mechanism handling only intake or only dispatch leaves half the boundary open.

**Typed-signal persistence** is required because internal operations are typed-to-typed work that depends on prior typed structure being available. Without something holding typed signal across moments, each arrival stands alone — there is no accumulation, no compounding, no extension across time. The persistence must be faithful to what was typed, durable across moments, and readable by subsequent operations.

These are the two roles the outer loop forces. Each is filled by a single structural element. Other roles surface when the loop is extended (capability, governance, invariant declaration), but the outer loop itself requires only these two.

### I.4 Perimeter

The element that fills the boundary-transformation role is the **Perimeter**.

**Distinguishing property.** The perimeter is the only structural element that operates across the typed/untyped frontier. Every arrival crosses it on the way in; every dispatch crosses it on the way out. No other element of LIV performs typed/untyped transformation; no other element has runtime work at the boundary.

**One operation site.** There is one perimeter per LIV instance. The boundary is unitary; it is not distributed across multiple sites. Every arrival passes through the same boundary; every dispatch leaves through the same boundary. This is what makes the boundary checkable — a wearer or auditor can verify that all crossings are governed because there is only one place where crossings happen.

**No template/applied distinction.** The perimeter does not have a template state and an applied state. It is one operation site, not a class of operations.

**Acts.** The perimeter is an acting element, not an acted-upon element or a consulted-only element. It runs at every crossing.

Mechanics of how the perimeter performs typing — what counts as a typed signal, how identities are resolved at the boundary, what classification rules apply — are declared by the perimeter's governing framework. The kind shape is fixed by Section I; the inhabitant is L3 selection.

### I.5 Substrate

The element that fills the typed-signal-persistence role is the **Substrate**.

**Distinguishing property.** The substrate aggregates state across operations. Every other structural element of LIV has its own state for its own work; the substrate's content is the union of typed signal deposited from every operation that has produced typed signal. It is the place where extension across time happens, because it is the place where typed signal is held across moments.

**One persistent state.** There is one substrate per LIV instance. The substrate is not distributed; it is a single persistent state that every other element reads from and writes to under authority. This unitary shape is what makes substrate authority checkable and substrate portability mechanical (I.6).

**No template/applied distinction.** The substrate does not have a template state and an applied state. It is one persistent state, not a class of stores.

**Acted upon.** The substrate is acted upon, not acting. Reads and writes are operations performed *on* the substrate by other elements. The substrate does not initiate work. This is what allows the substrate to be authoritative without being agentive — it stores honestly what is deposited, and other elements decide what to deposit.

The substrate's shape — what a typed signal looks like when it lands, what queries are valid, what coherence the persistence layer preserves — is declared by the substrate's governing framework. The kind shape is fixed by Section I; the inhabitant is L3 selection. Cross-cutting concerns about substrate coherence (what every accumulation must preserve, how layers of coherence partition) extend Section IV.

### I.6 Authority

Authority answers two questions: *who confirms what* and *where is enforcement performed*.

**Wearer-L0** is the declarative authority over substrate content. The wearer's cognition is theirs; what enters typed jurisdiction as the wearer's cognition is confirmed by Wearer-L0 alone. No element of LIV — no framework, no program, no system process — may modify substrate content under the wearer's scope except by Wearer-L0 confirmation or by Wearer-confirmed operation. This is the **substrate authority unconditional** principle: the wearer's substrate content is theirs to write, theirs to revoke, theirs to migrate.

Other authorities exist within LIV (notably System-L0, which governs templates and invariants). They are introduced in their respective sections at the points where they first become load-bearing — System-L0 surfaces in Section II when programs and templates are introduced, and is consulted in Section III for governance recursion. Section I introduces only the authority required for the outer loop to close, which is Wearer-L0 over substrate content.

**Authority enforcement at the perimeter.** The substrate stores honestly — it does not enforce authority on writes. The perimeter is the gate: every arrival is checked against the appropriate authority before crossing into typed jurisdiction. Authority enforcement is a perimeter responsibility because the perimeter is the only element that operates at the boundary; placing authority enforcement anywhere else would either leak unauthorized content into the substrate or distribute the boundary across multiple sites, breaking the perimeter's distinguishing property.

**L0 boundary protocol.** Authority confirmations from L0 authorities cross the perimeter as arrivals like any other. There is no privileged path that bypasses the perimeter; confirmations are typed at the boundary with their authority origin preserved as metadata on the resulting typed signal. The boundary protocol is shape-generic over authority kind: a single mechanism handles confirmations from any L0 authority. Initially the only L0 authority crossing is Wearer-L0; the protocol accommodates additional L0 authorities (System-L0 instantiates when programs and templates are introduced) without structural change to the boundary.

**Substrate portability.** The wearer's substrate content is portable across substrate framework versions and across LIV deployments. Portability is mechanical, not aspirational: any future substrate framework must support migration of prior substrate content under wearer authorization. This derives from substrate authority unconditional — if the wearer's substrate content is theirs unconditionally, then substrate framework succession cannot strand it. Portability is the wearer-L0 right extended across substrate framework versions.

**Scoping.** The substrate is single-store; scope is carried as an attribute on every persisted state. Per-wearer content and shared content live in the same store, distinguished by the scope attribute. Scope-based access enforcement is a perimeter concern (authority at the gate), not a substrate concern. Scoping is open-vocabulary: new scope kinds (additional wearer scopes, group scopes, system scopes) are new attribute values, not new infrastructure.

*Honest acknowledgment.* The single-store-with-scope-as-attribute model is structurally derived but has not yet been stress-tested under multi-wearer concurrent load. The structural commitment holds; the operational characteristics under scale will be observed and may surface refinements that do not amend the structure.

### I.7 What this section commits to

Section I commits to:

- The I.1 claim: LIV extends a wearer's cognition across time, where extension covers what becomes typed signal at the boundary.
- Two structural units: arrival operations and internal operations, both first-class.
- Two roles forced by the outer loop: boundary transformation and typed-signal persistence.
- Two structural elements filling those roles: Perimeter and Substrate.
- Wearer-L0 authority over substrate content, enforced at the perimeter.
- Substrate authority unconditional and substrate portability mechanical.
- Single-store substrate with scope as attribute; scope enforcement at the perimeter.
- L0 boundary protocol shape-generic over authority kind.

Section I does not commit to:

- *How* the substrate persists typed signal — axes, atom shapes, query primitives, indices. These are declared by the substrate's governing framework (currently Living Memory v3.1) and surfaced in Section IV cross-cutting where they govern across loops.
- *How* the perimeter performs typing — classification rules, decomposition mechanics, identity resolution at the boundary. These are declared by the perimeter's governing framework when authored (currently absent — Cognitive Standard dissolved Sprint 8).
- The Framework, Program, and Protocol kinds — these are introduced in Sections II and III as the loops they belong to are introduced.
- System-L0 authority — introduced in Section II at the point templates first become load-bearing.
- Stack positions (L1, L2, L3, L4) — derived in Section III from the governance hierarchy.
- Domain instantiation, framework instantiation, framework-slot status, four-shape life cycle, metaframework — all introduced as their respective loops are introduced.
- Cross-cutting concerns (arrival metadata, substrate coherence by layer, fidelity principles) — extend Section IV.

Section I survives substrate framework succession (LM v3.1 → LM v4 or successor), perimeter framework succession (when authored), addition of new domains, addition of new frameworks, and addition of new L0 authorities. None of these require Section I amendment provided they fill their forced role and honor substrate authority unconditional.

### I.8 What LIV is not

To clarify the I.1 claim by stating what it excludes:

**LIV is not a chatbot.** A chatbot produces responses; it does not persist faithful structure. Extension across time requires persistence; producing responses without persistence does not extend cognition.

**LIV is not a personal database.** A personal database stores records under explicit schemas; it does not type signal at a boundary, it does not aggregate state across kinds of operations, and it has no commitment to the wearer's authority over content beyond access control. Extension across time requires more than storage.

**LIV is not a cognitive prosthesis substitute.** LIV does not replace the wearer's cognition; it extends it. The wearer remains the cognitive subject. The apparatus exists to make the wearer's cognition durable across moments, not to perform cognition on the wearer's behalf.

**LIV is not a fixed-modality system.** What enters LIV is whatever can be typed at the boundary — voice, image, video, sensor, document, structured event. Future modalities that become typeable are absorbed without amendment to Section I; the substrate's role is the same regardless of input shape.

**LIV is not infrastructure-defined.** LIV is defined by what it does (extend cognition across time) and what it requires structurally (two structural units, the outer loop, declared authorities). The infrastructure that runs it — programming languages, databases, deployment shape — is replaceable. LIV's identity does not change when its infrastructure changes.

What is excluded here is excluded structurally, not by preference. A future evolution that violates one of these exclusions is not an extension of LIV; it is a different system.

---

## Section II — The Program Loop

**Abstraction:** vision level. **Voice:** declarative.

### II.1 The program loop

The outer loop (Section I) closes the cognition-extension claim through perimeter and substrate alone: arrivals cross into typed signal, accumulate, and are read by subsequent arrivals. With perimeter, substrate, and Wearer-L0 over substrate content, the I.1 claim is structurally complete.

The outer loop does not give the wearer a way to *do* anything with what has accumulated. Reading accumulated typed signal as structured output in a domain — drafting a plan from prior decisions, verifying a result against prior commitments, surfacing what has changed — requires capability. Capability is what the program loop adds.

The program loop is **Wearer ↔ Program ↔ Substrate, mediated by Perimeter**:

- The wearer invokes a program (or the program runs continuously, or it is triggered by an event or system process — see II.6).
- The program reads accumulated typed signal from the substrate via the substrate's governing framework — currently Living Memory v3.1, declared canonically in Section IV — and through whatever read primitives that framework declares.
- The program transforms what it reads into structured output in its domain.
- The program emits an artifact carrying that output, governed by the artifact framework (currently AS v2.2, declared canonically in IV.3).
- The wearer reads the artifact, or the artifact dispatches through the perimeter to act on the world.

Programs sit *on* the outer loop. Every program read goes through the perimeter as an internal-operation-mediated substrate access; every program write is an arrival the perimeter types and the substrate accumulates. Programs do not bypass the perimeter and do not modify the substrate directly; the outer loop's structural commitments hold under the program loop without modification.

**Cascade discipline.** Section II commits only to what the program loop closes — capability above the outer loop. Governance of programs (frameworks consulted, metaframework derived) extends Section III. Cross-cutting concerns governing both loops extend Section IV.

### II.2 Program

The structural element that fills the capability role is the **Program**.

**Distinguishing property.** A program declares wearer-facing capability in a domain. Programs are *invoked*, not consulted. Code in a program produces wearer-facing output and acts on substrate; this distinguishes programs from frameworks (which declare rules and are consulted) and from the perimeter (which performs typed/untyped transformation at the boundary, not domain work).

**One per domain instantiation.** A program is instantiated for a specific domain. Multiple programs may exist in one LIV instance; each occupies its own domain or domain-shape position. Program instantiation is open: new domains produce new programs.

**Template/applied distinction.** A program has a template state (the domain capability declared) and an applied state (the program running for a specific wearer or scope). The template is owned by System-L0; the applied instance is activated under wearer authority.

**Acts.** Programs are acting elements. They run when invoked, produce output, and dispatch.

The mechanics of how a program performs its work — what it reads from substrate, how it transforms what it reads, what it emits as output — are declared by the program's governing framework. Each program has a domain framework that governs what its work means in its domain (e.g., Plan Standard governs the plan program). The program kind shape is fixed by Section II; the inhabitant frameworks are L3 selection (Section III).

### II.3 The four-shape life cycle

Programs perform domain work, and the work has structure. Across all domains, work moves through a five-state ordering: **unknown → known → structured → produced → verified**. Each span-one transition between adjacent states is a transformation shape. The four shapes — derived in III.5 — classify program work as **epistemic / structural / generative / verificative**:

- **Epistemic** — unknown → known. The work of inquiry: establishing what is the case.
- **Structural** — known → structured. The work of organization: arranging known content into a structured form.
- **Generative** — structured → produced. The work of construction: producing an artifact from structured input.
- **Verificative** — produced → verified. The work of checking: validating that what was produced meets its declared shape.

A program's primary shape is the shape that characterizes its central work. The plan program is structural-primary (organizing known content into a plan structure). The verify program is verificative-primary. The discover program is epistemic-primary. The build program is generative-primary. A program may perform multiple shapes within a single invocation (a structural program may verify its own output before emission), but its primary shape is what classifies it.

The structural origin of these shapes — their derivation as metaframework primitives from the five-state ordering — is canonical at III.5.

### II.4 Domains

A domain is the bounded subject matter a program performs work within. Planning is a domain; verification is a domain; research is a domain; build is a domain; visual construction is a domain; presenting accumulated signal as legible structure for the wearer is a domain.

**Open vocabulary.** Domains are not enumerated by Section II. New domains are added when the wearer's needs surface them and when the metaframework derives a domain framework to govern work within that domain (Section III). The set of domains LIV supports at a given moment is contingent; the structural shape of how a domain is instantiated as a program is fixed.

**Domain instantiation.** A new domain becomes load-bearing in LIV through a sequence: substrate signal accumulates indicating that a domain of work is recurrent and currently uncovered; the metaframework reads aggregate signal across the substrate (Section III) and derives a domain framework for that domain; the framework is confirmed at System-L0; a program is instantiated under that framework, providing wearer-facing capability in the domain. The program loop accommodates the new domain without amendment to the loop's structural shape.

**Acknowledgment.** The current set of LIV domains (planning, verification, research, building, visual construction, present-layer projection, dashboard projection) is the set surfaced through current wearer engagement. Coverage is not closed; gap-driven framework derivation (Section III) is the mechanism by which coverage extends.

### II.5 Artifacts

Programs produce **artifacts**. An artifact is the structured output of a program's work in its domain — the plan a planning program produces, the verification report a verify program produces, the discovery brief a research program produces, the projection a present-layer program produces.

**Carrier shape.** Artifacts are carried by a structural shape declared by the artifact framework (currently AS v2.2, declared canonically in IV.3). The carrier shape is universal across programs: every artifact has the same structural envelope, regardless of domain. What differs between artifacts is the domain content the carrier holds.

**Domain content.** The content of an artifact — what the artifact actually says or contains — is shaped by the program's domain framework. The plan framework declares what counts as plan content; the verification framework declares what counts as a verification result; and so on. Programs assemble domain content against their domain framework's rules and emit it through the artifact carrier.

**Two governance dependencies.** Every program emission depends on two frameworks: the artifact framework (carrier shape, universal across programs) and the program's own domain framework (content shape, specific to the domain). This is one of the framework-dependency patterns that programs participate in — the others are reading via the substrate framework (II.1) and being governed by the domain framework as such (II.2).

### II.6 Invocation patterns

Programs run under one of four invocation patterns. Each pattern has a different trigger source and a different relationship to the program loop.

**Wearer-invoked.** The wearer invokes the program directly. The wearer asks for a plan; the planning program runs. The wearer asks for verification; the verify program runs. This is the typical pattern for programs whose output the wearer reads as a discrete result. Plan, Verify, Discover, Builder are wearer-invoked programs.

**Continuous-projection.** The program runs whenever the substrate is read for projection to the wearer. The Present layer is the canonical continuous-projection program: every time the wearer's surface needs to render accumulated signal as legible structure, the Present layer runs to derive that projection. There is no discrete invocation; the program runs by default whenever its output is needed.

**Event-triggered.** The program runs when an external event arrives at the perimeter. A scheduled trigger (cron) at a specified time invokes a daily-summary program; an integration event from an external system invokes a program that processes that integration. The trigger is an arrival operation at the perimeter; the perimeter routes the typed event to the appropriate program.

**System-triggered.** The program runs when an internal operation surfaces a condition that requires program action. The metaframework derives a new framework (Section III) and the system triggers a program to instantiate it. A drift-detection process detects a gap and triggers an audit program. The trigger is internal — typed-to-typed within LIV.

**Sufficiency.** Four invocation patterns are sufficient against current derivation: every program invocation in LIV is one of these four, distinguished by trigger source (wearer / continuous / external event / internal operation). Revision protocol per Section VII applies if a counterexample is identified.

Each pattern has different authority and governance characteristics. Wearer-invoked is straightforwardly under Wearer-L0 invocation authority. Continuous-projection runs without per-invocation authority because it is a default of substrate read. Event-triggered carries the authority of the originating arrival (which the perimeter typed). System-triggered carries System-L0 authority for the triggering internal operation.

### II.7 Builder asymmetry

Three of the four-shape primary programs are governed by their own domain framework: Plan by Plan Standard, Verify by Verification Standard, Discover by Research Standard. The fourth — Builder, the generative-primary program — is governed by LIV-Standard, the same framework that governs code structure across all of LIV.

This is an asymmetry, named honestly here so it is not hidden:

LIV-Standard plays a dual role for Builder. It governs code structure (universal across LIV slices) and it serves as Builder's domain framework (specific to the build domain). The other three programs do not have this dual role — their domain frameworks are independent of code-structure governance.

The asymmetry is acceptable at current versioning: Builder's domain work and LIV's code structure are sufficiently aligned that LIV-Standard's rules apply meaningfully to both concerns. The asymmetry may produce drift if Builder's domain work diverges from code-structure concerns; if drift surfaces, a dedicated Builder Standard would be authored under gap-driven framework derivation (Section III) and would relieve LIV-Standard of the dual role.

Until such drift surfaces, LIV-Standard is the canonical inhabitant of Builder's framework slot. The slot is forced by the program kind shape; the inhabitant is L3 selection.

### II.8 System-L0

Programs have templates. A program template declares the capability of a program in a domain — what the program does, what it emits, what frameworks it consults. Templates are not per-wearer; they are properties of LIV as a system. When a program is instantiated for a wearer (the applied state, II.2), the wearer activates the template under their authority, but the template itself is owned at the system level.

**System-L0** is the declarative authority over templates and invariants. Program templates, framework templates, Protocol content (Section III), the kind structure of LIV itself — all are confirmed at System-L0. System-L0 is not a wearer concern; it is the authority that governs LIV's structural composition.

The two declarative authorities are sufficient: every authority decision in LIV is either over content (Wearer-L0, introduced canonically in I.6) or over templates and invariants (System-L0). Revision protocol per Section VII applies if a counterexample is identified.

System-L0 does not bypass the perimeter. System-L0 confirmations cross the perimeter as arrivals like any other, typed at the boundary with their authority origin preserved as metadata. The L0 boundary protocol (declared shape-generic in I.6) accommodates System-L0 alongside Wearer-L0 without structural change to the boundary.

The relationship between the two authorities at the substrate is structural: Wearer-L0 has unconditional authority over substrate content under wearer scope (substrate authority unconditional, I.6). System-L0 has authority over the templates and invariants under which substrate operations are performed. The substrate's content is the wearer's; the structural shape of the substrate is the system's. Substrate framework succession (LM v3.1 → successor) is a System-L0 decision; the wearer's substrate content survives the succession through portability (I.6).

### II.9 What this section commits to

Section II commits to:

- The program loop: Wearer ↔ Program ↔ Substrate, mediated by Perimeter.
- The Program kind, with distinguishing property, instantiation pattern, template/applied distinction, and operation kind.
- The four-shape life cycle as program-work classification (canonical structural site III.5).
- Domain as the bounded subject matter of program work; open-vocabulary instantiation; gap-driven extension.
- Artifacts as program output; universal carrier shape; domain-specific content; two governance dependencies (artifact framework + domain framework).
- Four invocation patterns: wearer-invoked, continuous-projection, event-triggered, system-triggered.
- Builder asymmetry named honestly; LIV-Standard as Builder's current domain-framework inhabitant.
- System-L0 as the second declarative authority, governing templates and invariants; bi-authority structure complete.

Section II does not commit to:

- Framework, Metaframework, or Protocol kinds — these are introduced canonically in Section III.
- Stack positions — derived in Section III from the governance hierarchy.
- Specific framework inhabitants of program slots — current inhabitants tracked in Section III.8.
- Substrate coherence layers, arrival metadata, fidelity principles — extend Section IV.
- The mechanics of how programs read substrate (substrate's governing framework) or how artifacts are structured (artifact framework) — these are declared by their respective frameworks, with cross-cutting governance surfaced in Section IV.

Section II survives addition of new programs, addition of new domains, addition of new invocation patterns within the four declared, and replacement of Builder's domain framework if drift surfaces. None of these require Section II amendment provided they fill a forced role and honor the program loop's structural shape.

---

## Section III — The Governance Loop

**Abstraction:** vision level. **Voice:** declarative.

### III.1 The inversion

The outer loop (I) closes cognition extension. The program loop (II) closes capability. Both loops are about what the wearer experiences and acts on. Both run *forward* through the wearer's experience: wearer encounters program; program reads substrate; substrate accumulates; subsequent program reads richer substrate.

The governance loop runs in the opposite direction.

**Governance runs in the opposite direction from experience.** Programs are above frameworks experientially — the wearer touches programs, never frameworks. Frameworks are above programs structurally — frameworks declare what programs may do, programs operate under framework rules. Same five kinds when the cascade is complete; two directions.

**Authority direction is invariant.** Every program must trace upward to a framework. Every framework must trace upward to the metaframework or directly to System-L0. Every framework chain must terminate at Protocol. There are no exceptions to this chain. A program without a governing framework is structurally undefined; a framework without governance termination is recursively open.

**Experience direction is typical, not invariant.** The wearer touches programs most of the time, but the wearer also acts directly on the substrate. Revocation is a wearer-invoked action that hits the substrate directly through the perimeter without any program mediating. Identity curation through utterance — the wearer saying "X means Y" — is a substrate write that may not be mediated by a domain program. These are wearer-bypass cases, declared in III.9. Authority is the strict direction; experience is the typical direction with declared bypasses.

The inversion is the most common misread of LIV. Readers who hold only the experience direction inflate frameworks (treating them as the system's "real" structure that programs are surface for); readers who hold only the structural direction dismiss frameworks (treating them as documentation that runtime ignores). Both misreads are corrected by holding both directions simultaneously: programs are above frameworks experientially *and* below them structurally, in the same way and at the same time.

**Cascade discipline.** Section III commits only to what the governance loop closes — the rule chain and its termination. Domain capability extends Section II. Cross-cutting concerns extend Section IV.

### III.2 Framework

The structural element that fills the rules-for-domain role is the **Framework**.

**Distinguishing property.** A framework declares the rules under which other elements operate within a domain. Frameworks are *consulted*, not invoked. Code in a framework declares structure — axioms, invariants, gates, procedures — that other elements consult during their work. This distinguishes frameworks from programs (which are invoked and produce output) and from the perimeter (which performs transformation, not declaration).

**Template/applied distinction.** A framework has a template state (the rules declared) and an applied state (the rules being consulted by another element during a specific operation). The template is owned by System-L0; the applied state is the runtime instance of consultation, which has no separate ownership — it is the consultation itself.

**Conditional operation.** Frameworks are conditional-operation elements: they are declarative as templates and operational when applied. Unlike programs, which run when invoked, frameworks do not run; they are referenced. The application of a framework is the act of another element consulting it.

**Stack position.** Frameworks occupy a stack position within the governance hierarchy. Most frameworks are L3 — they declare rules for a specific domain (substrate, perimeter, planning, verification, etc.). Some frameworks are L2 — they declare rules for framework structure itself (the metaframework, III.4). Stack positions are introduced canonically in III.7.

The mechanics of how a framework's rules are structured — what counts as an axiom, what gates declare, what procedures specify — are themselves declared by a framework one level up. This is the governance recursion (III.3).

### III.3 Framework-on-framework recursion

Frameworks are governed by frameworks. The plan framework's rules are declared, but the *shape* of the plan framework's rules — what it means for the framework to be well-formed, what counts as a valid axiom in the framework — is declared by another framework. This recursion is what allows LIV to grow new domains: a new framework can be authored because there is a framework declaring how to author frameworks.

The recursion has direction: each framework is governed by a framework one level up the governance hierarchy. L4 programs are governed by L3 frameworks (their domain frameworks). L3 frameworks are governed by an L2 framework (the metaframework, III.4). The metaframework, an L2 framework, is governed by L1 (Protocol, III.6).

**The recursion must terminate.** Without termination, every framework would require a framework above it, with no bottom. Termination is the role of Protocol: an L1 invariant declaration that is consulted but not itself governed by a higher framework. Protocol is governed directly by System-L0, the framework-of-last-resort being a declarative authority rather than a governing framework.

**The recursion is acyclic.** A framework may consult its own template (e.g., a verification framework verifies its own structural shape against its own rules), but it does not govern itself. Self-application is allowed; self-governance is not. Self-governance would re-introduce the recursion-termination problem — a self-governing framework could not be checked against anything outside itself.

### III.4 Metaframework

The framework whose domain is the structure of frameworks themselves is the **metaframework**. The metaframework is a Framework at L2 — a framework one level above L3 domain frameworks, governing their generation, structure, and audit.

**Distinguishing property.** The metaframework is the framework whose rules apply to other frameworks. Other frameworks declare rules for a substantive domain (substrate, planning, verification); the metaframework declares rules for what counts as a well-formed framework in any domain.

**Generation and audit.** The metaframework's primary work is two-fold. *Generation*: when substrate signal indicates that a domain is recurrent and uncovered (II.4, gap-driven), the metaframework derives a new framework for that domain through a declared generation procedure. *Audit*: existing frameworks are audited against the metaframework's structural rules to detect drift between framework template and framework operation.

**Aggregate signal access.** The metaframework reads aggregate signal from the substrate across all wearer scopes — counts, frequencies, gap markers, classification confidence distributions. The metaframework never reads substrate content under any individual wearer's scope; it reads only the aggregate shape of accumulated signal across scopes. This is what allows the metaframework to operate at System-L0 (the templates it derives are system-level) while honoring substrate authority unconditional (Wearer-L0 over content remains intact).

**Governance termination.** The metaframework is governed directly by Protocol. Protocol declares the invariants the metaframework must honor (the recursion-termination requirement, the substrate-authority-unconditional requirement, others); the metaframework operates within those invariants when generating new frameworks.

The metaframework is canonical at this section. It is referenced in II.4 (domain instantiation surfaces through metaframework gap-driven derivation) but not introduced there.

*Honest acknowledgment — operating mode during bootstrap.* The metaframework's aggregate-signal access (above) is a structural commitment over how the metaframework reads from substrate. During the current bootstrap phase, the metaframework operates as **L0-orchestrated procedure**: framework derivation cycles are conducted by L0 directing a builder through the generation procedure, with L0 supplying the gap signal that would, in steady-state operation, surface from aggregate substrate reads. The aggregate-signal-read primitives that mechanize this access are scheduled for **LM v3.2 / post-beta delivery**. The structural commitments of §III.4 hold — the metaframework's domain, its generation/audit work, its substrate-authority-honoring read shape, its governance termination through Protocol — and their runtime implementation path is staged. No structural amendment; the operational primitive set is queued.

### III.5 The four transformation shapes

The four transformation shapes (epistemic, structural, generative, verificative) are introduced operationally in II.3 as primitives for classifying program work. Their canonical structural site is here, because they are metaframework primitives — the four shapes are what the metaframework uses to derive new frameworks for new domains.

When the metaframework derives a framework for a new domain, the framework's procedure is composed from these four shapes. A planning domain's framework declares structural-primary procedures; a verification domain's framework declares verificative-primary procedures; and so on. The five-state ordering (unknown → known → structured → produced → verified) is the metaframework's structural commitment to how typed work moves; the four shapes are the span-one transitions that the metaframework composes into framework procedures.

This is why programs map cleanly to shapes (II.3) — the mapping is not coincidental; it is a consequence of the metaframework's composition primitives being exactly the shapes from which framework procedures (and thus program operations) are built.

### III.6 Protocol

The element that fills the invariant-declaration role is **Protocol**.

**Distinguishing property.** Protocol declares the invariants under which all kinds operate. Protocol is *consulted*, never *invoked*. Other elements may not modify Protocol during their work; Protocol is referenced as the invariant ground that all operations must honor.

**Recursion terminator.** Protocol terminates the framework-on-framework recursion (III.3). Frameworks are governed by frameworks; the chain terminates at Protocol. Protocol is not governed by a higher framework — it is governed directly by System-L0 as the framework-of-last-resort. This is what allows the recursion to have a bottom.

**No operation.** Protocol has no runtime operation. It does not act, is not invoked, is not applied. It is consulted at every level of the governance recursion as the invariant ground that frameworks must honor in their declarations.

**Stack position.** Protocol sits at L1, below the metaframework at L2. Stack positions are derived canonically in III.7.

**Content shape.** Protocol's content is the set of invariants that govern LIV as a whole — the structural commitments of Section I (kinds, structural units, authority shape), the recursion-termination requirement, the substrate-authority-unconditional requirement, the cascade discipline of the Manual itself. Protocol is what makes LIV self-consistent across time as the apparatus evolves.

### III.7 Stack positions

The governance recursion produces a stack: programs at the bottom, frameworks above them, the metaframework above frameworks, Protocol above the metaframework. The stack has four positions:

- **L1** — Protocol. Consulted only. Recursion terminator. Governed directly by System-L0.
- **L2** — Metaframework. The framework whose domain is framework structure itself. Governs L3 frameworks.
- **L3** — Domain frameworks. Each governs a specific domain (substrate, perimeter, planning, verification, research, build, design, present-layer projection). Most frameworks in LIV are L3.
- **L4** — Programs. Each provides wearer-facing capability in a domain, governed by the L3 framework for that domain.

Stack positions are derived from the governance hierarchy, not assigned by convention. A framework's level is determined by what it governs: L1 governs nothing higher (recursion terminator); L2 governs L3 frameworks; L3 governs L4 programs. The level numbers are conventional — what is structural is the hierarchy, not the numbering.

Two structural elements introduced in Section I (Perimeter, Substrate) do not occupy a stack position. They are cross-position: governed by L3 frameworks (the perimeter's governing framework, the substrate's governing framework) but operating at the boundary and across all kinds, respectively. Their position in LIV is structural, not hierarchical.

### III.8 Framework-slot status

A framework slot is the position in LIV's structural shape that a governing framework occupies. Each kind that is governed by a framework has at least one slot. Slots are forced by the kind structure (Sections I and II); inhabitants are L3 selection (occasionally L2 for the metaframework slot).

Slots are tracked here because they are the canonical site for governance status: which slots are filled, which inhabitants currently occupy them, which slots are open (acknowledged gaps).

**Currently filled slots:**

| Slot | Current inhabitant |
|---|---|
| Substrate's governing framework | Living Memory v3.1 |
| Artifact framework | Artifact Standard v2.2 |
| Plan domain framework | Plan Standard v2.2 |
| Verification domain framework | Verification Standard v1.0 |
| Research domain framework | Research Standard v1.0 |
| Build domain framework | LIV-Standard v1.5.1 (dual role per II.7) |
| Visual construction domain framework | Design Standard v1.0 |
| Multi-instance dispatch framework | Multi-Instance Standard v2.3 |
| Code structure framework | LIV-Standard v1.5.1 |
| Metaframework slot (L2) | Metaframework v3.2.7 |
| Perimeter's governing framework | Perimeter Standard v1.0.1 (`core/standards/perimeter-standard.md`). Filled by Structure-Tightening Sprint, Shot 2; v1.0.1 prose-realignment amendment at audit-cycle-A close. Aggregate signal read primitives staged per III.4 acknowledgment. |

**Currently open slots:**

| Slot | Status |
|---|---|
| F-chat governing framework | Vacant. F-chat currently operates at perimeter-baseline + Perimeter Standard v1.0.1's rules. Will resolve with a dedicated F-chat domain framework if drift surfaces against the perimeter rules. |
| Dashboard rendering domain framework | Vacant. Acknowledged gap — dashboard programs currently operate without a dedicated domain framework. |
| Present-layer domain framework | Vacant. The Present layer (II.6, continuous-projection program) currently operates at perimeter-baseline + LIV-Standard code-structure governance, awaiting a dedicated domain framework. Present-layer projection is a genuine domain (deriving readable structure from accumulated geometry); a domain framework for it would surface the rules under which projection is performed. |

*Honest acknowledgment — operating mode at Structure-Tightening Sprint close.* The passive-substrate principle (substrate is acted upon, does not initiate work) is now governed by Perimeter Standard v1.0.1 — its PA-A1..PA-A6 axiom set declares the boundary checks, and its G-PS-A1..G-PS-A6 gate set verifies them per crossing. The framework declaration is complete; the **runtime enforcement at one site** is wired this sprint (F-identity middleware now lives at `src/middleware.ts` as the unitary perimeter site; the distributed `validateSession` pattern across ten violation sites — seven contracts, two route handlers, one dormant route — has been removed per F-005 closure). At this sprint close perimeter validation operates through the unitary site enforcing PA-A1 + PA-A6 + PA-I; the remaining 19 PS-own axioms (PA1, PA2, PA-T1..PA-T4, PA-Cn1..PA-Cn4, PA-IR1..PA-IR4, PA-Co1..PA-Co3, PA2..PA-A5) require BoundaryCrossingRecord emission machinery, which wires at Sprint 9 alongside substrate-write callers and the F-router registration. PS v1.0.1 §4.8 declares the Sprint 9 promotion path for these gates; until then they vacuous-pass per substrate §6.3 cardinality semantics with explicit basis.

**Slot status discipline.** Slots are forced by structure and survive framework succession. A vacant slot is not a structural defect; it is an acknowledged gap awaiting derivation. Filling a slot does not modify the structural shape; it instantiates the inhabitant.

### III.9 Wearer-bypass cases

Most wearer interaction with LIV is mediated by programs (II.6). Some wearer interactions hit the substrate directly through the perimeter without any program in the path. These are wearer-bypass cases, declared here for honesty about the experience direction (III.1).

**Revocation.** The wearer has unconditional authority over substrate content (I.6). Exercising that authority — revoking a state-change, removing accumulated signal from the wearer's substrate — is a direct wearer-to-substrate action through the perimeter. No program mediates revocation; the wearer's revocation arrival is typed at the perimeter, recognized as a revocation under Wearer-L0 authority, and applied to the substrate.

**Identity curation through utterance.** When the wearer says "X means Y" or otherwise disambiguates an identity directly, the resulting state-change writes the disambiguation as ordinary content. The substrate's governing framework (currently LM v3.1) treats this as a state-change like any other; identity coherence is geometric (a cluster property in the substrate description lifted into IV.3), and the wearer's curation contributes to the geometry. No domain program mediates this; the wearer's utterance passes through the perimeter and lands as substrate content.

**L0 confirmations.** Wearer-L0 confirmations themselves cross the perimeter as arrivals (I.6, L0 boundary protocol). The wearer confirming a system change (activating a program, accepting a framework template at applied state) is a direct wearer-to-substrate action with the confirmation typed and persisted as authority metadata.

These bypasses do not violate the cascade. The wearer's experience runs through programs typically; bypass cases are declared exceptions, each of which has structural justification (substrate authority unconditional, identity emergence through ordinary writes, authority typing at the boundary). The structural commitments of Sections I and II hold under bypass: bypass cases use the perimeter, write to the substrate, and are governed by the same authority shape as program-mediated interactions.

### III.10 What this section commits to

Section III commits to:

- The experiential-vs-structural inversion as a load-bearing structural fact about LIV.
- The Framework kind, with distinguishing property, template/applied distinction, conditional-operation kind.
- Framework-on-framework recursion: governance proceeds upward, must terminate, is acyclic.
- The Metaframework as a Framework at L2 governing framework structure itself; aggregate-signal-only substrate access; gap-driven framework derivation.
- The four transformation shapes as metaframework primitives, canonical here.
- Protocol as the recursion terminator; consulted-only; governed directly by System-L0.
- Stack positions L1/L2/L3/L4 derived from the governance hierarchy.
- Framework slot status canonical at III.8 (filled and open slots tracked).
- Wearer-bypass cases declared (revocation, identity curation, L0 confirmations).

Section III does not commit to:

- Domain capability or program work — extends Section II.
- Substrate persistence mechanics, arrival metadata, fidelity principles — extend Section IV.
- Specific axioms or procedures of any framework — those are declared in the framework's own standard.

Section III survives addition of new frameworks (new L3 inhabitants), framework succession (LM v3.1 → successor, perimeter framework authoring, dashboard framework authoring, present-layer framework authoring), and addition of new wearer-bypass cases if surfaced. None of these require Section III amendment provided they honor the governance recursion and its termination at Protocol.

---

## Section IV — Cross-cutting

**Abstraction:** vision level. **Voice:** declarative.

### IV.1 What sits cross-cutting

Some concerns govern *one* loop. Wearer-L0 over substrate content governs the outer loop; the four invocation patterns govern the program loop; framework-on-framework recursion governs the governance loop. Each lives in its loop's section as canonical site.

Other concerns govern *multiple* loops as load-bearing. They are not properties of any single loop but properties of typed signal itself, and every loop must obey them. These are the cross-cutting concerns.

**Cross-cutting placement requires the concern to be the governance source for something that each loop must obey, not merely a concern that touches multiple loops.** A concern that surfaces in multiple loops as a side effect lives with its primary loop with cross-references; a concern that *must* be honored across loops to keep LIV coherent lives in cross-cutting.

Three concerns meet this bar:

- **Arrival metadata** (IV.2) — what every typed signal carries, whether it lands in the outer loop or is read by a program in the program loop or is composed into a framework derivation in the governance loop.
- **Substrate coherence by layer** (IV.3) — what every accumulation must preserve, whether the accumulator is the outer loop's substrate write, a program's emission writing back through the perimeter, or a metaframework derivation reading aggregate signal.
- **Fidelity principles** (IV.4) — what every operation must honor across the typed/untyped boundary, regardless of which loop performs the operation.

**Cascade discipline.** Section IV commits only to concerns that are governance sources for multiple loops. Single-loop concerns live with their loop. New cross-cutting concerns require demonstration that they govern across loops — otherwise they are not cross-cutting.

### IV.2 Arrival metadata

Every arrival into typed jurisdiction carries metadata about the crossing itself. This metadata is not domain content; it is structural information about the arrival's origin, timing, and disposition. Three properties are cross-cutting because every loop must obey them: a program reading substrate content needs to know the source authority of each state-change (Wearer-L0 or System-L0; user scope or system scope); a framework consulted by another framework needs to know the time of crossing for ordered consultation; the perimeter and substrate together need to honor the act-vs-reference distinction to govern world-effect dispatches differently from non-world-effect ones.

**Source authority.** Every typed signal carries the authority origin of its arrival. The carrier is `SourceRef.channel` plus `SourceRef.scope` (introduced in I.6 as scoping mechanism). Source authority distinguishes wearer arrivals (Wearer-L0), system arrivals (System-L0), AI replies, scheduled triggers, integration events, and internal derivations. Per-channel governance is required because each channel has different authority semantics; the perimeter enforces channel-appropriate authority at intake. Source authority survives substrate framework succession because it is a property of the typed signal itself, not of how the signal is persisted.

**Time of crossing.** Every typed signal carries the time it crossed the perimeter. Time of crossing is the temporal anchor for all typed signal — without it, accumulation has no order and "across time" has no operational meaning. The carrier is `metadata.time` in the substrate framework's atom shape (currently `StateChangeRecord.metadata.time` in LM v3.1). Time is stamped at the perimeter and preserved by the substrate; no element of LIV may modify time-of-crossing after it is stamped.

**Act vs reference.** Every arrival is either an *act* or a *reference*. References read or query without world effect (a wearer query, a tool reply that does not mutate substrate, a rendering of substrate state to wearer). Acts produce effect — either on substrate (a wearer assertion mutating substrate, an integration event with substrate consequence) or on the world (a dispatch sending email on wearer's behalf, creating a calendar event, writing a file). Combined with intake/dispatch direction, this gives four cells of governance:

| | Intake | Dispatch |
|---|---|---|
| **Reference** | Lightweight governance: provenance preserved, no confirmation required | Lightweight governance: rendering accumulated content to wearer surface |
| **Act** | Confirmation, audit, reversibility — substrate is being mutated | Strongest governance: world-effect external to LIV requires confirmation, audit, and where possible reversibility |

The four-cell shape is what makes act-vs-reference cross-cutting: every loop has both intake and dispatch, and every loop has both acts and references. The perimeter governs the cells; programs must distinguish their reads from their writes; the substrate is mutated only by acts. Without this distinction, world-effect dispatches and lightweight reads would be governed identically, which would either over-govern reads or under-govern world effects.

**Correlation is not cross-cutting.** Correlation IDs (linking arrivals from a single wearer interaction or a single tool conversation) are useful at the perimeter for relating arrivals that originate together. Correlation is a perimeter concern, not a cross-cutting concern: it does not govern the program loop or the governance loop independently of the perimeter's typing work. Correlation lives in Section V's perimeter properties as perimeter mechanics, not in IV.

### IV.3 Substrate coherence by layer

Every accumulation must preserve coherence — the typed signal that lands must be readable, the accumulated geometry must be self-consistent, and the substrate's content must support extension across time without internal contradiction. Coherence is cross-cutting because every loop accumulates: the outer loop accumulates wearer arrivals, the program loop accumulates program emissions, the governance loop reads accumulated signal to derive new frameworks.

Coherence is not one concern at one layer. It partitions into four layers, each with different concerns and different governance:

| Layer | Concerns | Where governed |
|---|---|---|
| **Substrate-mechanical** | Forward-additive writes; revocation as sole destructive exception; atomic commit; identity-by-reference (no separate identity atom) | Substrate's governing framework axioms (currently LM v3.1 LMA1, LMA2, LMA4, LMA5) |
| **Substrate-stored** | Modal typing (relations carry modality as recorded metadata) | Substrate's governing framework axioms (LMA3 declares storage; LMA11 declares re-derivation discipline) |
| **Substrate-emergent** | Anchors, clusters, identity coherence as cluster property, geometry, temporal arc, source asymmetry, conflict surfacing — all read-time emergent, never stored | Substrate's governing framework structural commitments (LMA5, LMA7, LMA8); read by programs; storing derived geometry is a violation |
| **Program-layer** | Confidence on bind, supersession, decay as read-time mass differential, trust-weighted accumulation, conflict-resolution policy | Programs operating at the program layer (Present layer for projection concerns; specific domain programs for domain concerns) |

Each concern is named at exactly one layer. The layer determines what is governing the concern, not where the concern surfaces in user experience.

**Why layered, not tiered.** "Tier" terminology is reserved for the operational system split (outer-loop core capability vs. extended capability, declared in operational doctrine outside the Manual). Coherence concerns are *layered*, not tiered: each layer has different governance — substrate-mechanical layer is governed by substrate axioms, substrate-emergent layer is governed by structural commitment plus read-time geometric query, program-layer is governed by programs. Conflating these into tiers would suggest a single governance source, which is structurally wrong.

**The substrate at a glance.** What follows derives from the substrate spec final and survives substrate framework succession; substrate framework specifics (axiom numbers, exact procedure names, indices) live in the substrate's governing framework standard, not here.

The substrate stores typed signal as a sequence of state-changes in order of appearance. Each state-change has content (a structured payload of identities and the relations connecting them) and metadata (time of crossing, source authority and scope, position in the sequence). State-changes accumulate forward-additively; the only destructive operation is revocation, which is wearer-exclusive and in-band as a state-change of revocation type.

The substrate has two axes. **Axis 1** is the stored axis — the linear sequence of state-changes in position order, written and read directly. **Axis 2** is the emergent axis — the discontinuous trajectory of any single identity through positions where it appears, derived at read time by querying for identity recurrence. Identity coherence is geometric: identities exist by reference (an identity is realized whenever its reference appears in a state-change), and identities that walk the same geometric path through the substrate converge to a cluster. Cluster membership is read-time geometry, not stored mapping. There is no substrate-level disambiguation engine; disambiguation is a wearer or program concern, expressed through ordinary state-change writes.

Anchors, clusters, geometry, temporal arc, source asymmetry, conflict surfacing — all emerge at read time from accumulated state-changes plus the substrate's structural commitments. None are stored; storing them would duplicate the accumulation and create the possibility of derived state contradicting accumulated state.

**Three honest acknowledgments at this section:**

*Forward-additive depends on wearer engagement.* Forward-additive accumulation is a substrate-mechanical axiom — the substrate honors it unconditionally. The *value* of forward-additive accumulation depends on the wearer engaging: without state-changes being deposited, the accumulation contains nothing to compound. The structural commitment holds independently of engagement; the operational benefit scales with it.

*Identity coherence is geometric in the typical case, with known coincidence limitation.* Identities resolve through cluster geometry — references that walk the same path converge. In the typical case (distinct identities have distinguishable geometry), coherence is reliable. There is a known limitation: when two genuinely distinct identities happen to walk identical or near-identical geometric paths in early substrate history, they may be incorrectly clustered. The limitation is structural (it follows from coherence being geometric rather than declared) and is remediable through wearer disambiguation as ordinary state-change writes; it is not a defect to be patched but a known characteristic of geometric identity coherence.

*Passive substrate depends on active perimeter validation.* The substrate is acted upon, not acting (I.5). It honors writes that reach it. The structural guarantee that no unauthorized writes reach the substrate depends on active perimeter validation at the boundary. While the perimeter framework slot is vacant (III.8), perimeter validation operates informally — there is no framework declaring exactly what the perimeter must check before submitting a write to the substrate. The structural commitment (substrate is passive) holds; the operational guarantee (all unauthorized writes caught at boundary) is dependent on perimeter framework derivation.

### IV.4 Fidelity principles

Two principles must be honored across every operation in LIV. They are cross-cutting because they constrain every loop's operation, not because they are mechanisms of any single loop.

**Signal reuse.** Every signal LIV produces feeds back into LIV. Act-dispatches that cross the perimeter to act on the world don't return as signal, but the act itself is recorded as a state-change at dispatch, preserving the wearer's action in the substrate.

Signal reuse is what makes LIV compounding rather than merely retentive. Without it, programs would emit and accumulate, but emissions would not feed back into the substrate available to subsequent programs, and compounding would be impossible.

The principle constrains every loop: the outer loop must accumulate program emissions as substrate content (not as separate program-only state); the program loop must read prior emissions through the substrate, not through program-private channels; the governance loop's metaframework reads aggregate signal that includes program emissions, not only original wearer arrivals.

**Directional symmetry on operation governance.** Every operation that has an intake direction must have a correspondingly governed dispatch direction, and vice versa. The perimeter is one kind with two operations (intake and dispatch); both are governed by the perimeter's governing framework. Programs that read substrate (intake-shaped operation) must also dispatch their output (dispatch-shaped operation), governed symmetrically. Frameworks consulted at intake must be consulted at dispatch.

Directional symmetry prevents asymmetric governance gaps: an operation whose intake is governed but whose dispatch is not (or vice versa) leaves half the operation ungoverned. The principle constrains every loop because every loop has bidirectional operations.

The principle does not require intake and dispatch to use the same mechanism — they may differ. It requires both directions to be governed, with the governance derivable from the same framework that governs the operation.

### IV.5 What this section commits to

Section IV commits to:

- The cross-cutting placement criterion: a concern is cross-cutting only if it governs across loops as load-bearing.
- Three cross-cutting concerns: arrival metadata, substrate coherence by layer, fidelity principles.
- Arrival metadata: source authority, time of crossing, act vs reference. Correlation excluded (perimeter mechanics, lives in Section V).
- Substrate coherence by layer: substrate-mechanical, substrate-stored, substrate-emergent, program-layer. Each concern named at exactly one layer.
- The substrate spec content lifted into IV.3 at vision-level: two axes, identities by reference, cluster geometry, forward-additive plus revocation, source asymmetry, emergent geometry. Substrate framework specifics stay in the substrate's governing framework standard.
- Fidelity principles: signal reuse and directional symmetry.

Section IV does not commit to:

- New kinds, new authorities, new stack positions — those are Sections I, II, III.
- Substrate framework axiom enumeration, specific procedure names, indices, schema details — those are in the substrate's governing framework standard (currently LM v3.1).
- Specific perimeter framework rules — those will be in the perimeter's governing framework when authored.
- Specific program domain framework rules — those are in each program's domain framework standard.
- Slice-level operational categories (Loop / Programs / Tools / Infrastructure) — those are operational doctrine, not vision.
- Tier 1 vs Tier 2 system split — that is operational doctrine, not vision.

Section IV survives substrate framework succession (LM v3.1 → successor). The two axes, identities by reference, cluster geometry, forward-additive, revocation, and source asymmetry are vision-level commitments that any substrate framework must honor. Layer partitioning of coherence concerns survives because the layers are about *where governance lives*, not about which framework currently governs.

---

## Section V — Kinds catalogue

**Abstraction:** reference. **Voice:** descriptive.

### V.1 Catalogue conventions

This section is reference. Each kind's canonical introduction is in Sections I, II, or III. V references those canonical sites and tabulates properties for rapid lookup. No claim originates here — claims that originate here are drift and must be moved to their canonical site.

### V.2 Perimeter

**Canonical site:** I.4.

**Properties:**

| Property | Value |
|---|---|
| Kind property | Cross-position |
| Operation | Acts |
| Template/applied | No |
| Stack position | None (cross-position) |
| Governing framework | Currently vacant (III.8 — successor to dissolved Cognitive Standard pending) |
| Authority enforcement | Yes (I.6) |

**Mechanics owned by perimeter (not cross-cutting):**

- **Correlation** — linking arrivals from one originating interaction. Governed by perimeter framework when authored.
- **Surface-form-to-Ref matching** — resolving wearer-stated identifiers to substrate identity references at intake.
- **Channel classification** — assigning `SourceRef.channel` on intake; per-channel governance.
- **Scope access enforcement** — gating arrivals against authority + scope per I.6.

These are perimeter mechanics. They are not cross-cutting (failed cross-cutting placement criterion). They live with the perimeter as kind properties.

**Coordinate example (perimeter intake):**

Address: `Kind=Perimeter, Position=cross-position, Operation=intake, Authority=Wearer-L0 (or System-L0 for system arrivals)`.

### V.3 Substrate

**Canonical site:** I.5.

**Properties:**

| Property | Value |
|---|---|
| Kind property | Cross-position |
| Operation | Acted upon |
| Template/applied | No |
| Stack position | None (cross-position) |
| Governing framework | Living Memory v3.1 (III.8) |
| Authority | Substrate authority unconditional under Wearer-L0 over wearer-scope content (I.6) |

**Coordinate example (substrate state):**

Address: `Kind=Substrate, Position=cross-position, Operation=acted upon, State=persistent`.

### V.4 Framework

**Canonical site:** III.2.

**Properties:**

| Property | Value |
|---|---|
| Kind property | Stack-positioned |
| Operation | Conditional (declarative as template; operational when applied) |
| Template/applied | Yes |
| Stack positions | L1 (Protocol — only inhabitant), L2 (Metaframework — only inhabitant currently), L3 (domain frameworks) |
| Governing framework | Per stack position — L3 governed by L2 metaframework, L2 governed by L1 Protocol, L1 governed directly by System-L0 |
| Authority over template | System-L0 |

**Coordinate examples:**

- Plan Standard template: `Kind=Framework, Position=L3, Domain=plan, State=template, Owner=System-L0`.
- Plan Standard applied to a specific plan operation: `Kind=Framework, Position=L3, Domain=plan, State=applied, Application-context=<operation-id>`.

### V.5 Program

**Canonical site:** II.2.

**Properties:**

| Property | Value |
|---|---|
| Kind property | Stack-positioned |
| Operation | Acts |
| Template/applied | Yes |
| Stack position | L4 |
| Governing framework | Domain framework + artifact framework (AS v2.2) + substrate's governing framework (LM v3.1) |
| Authority over template | System-L0 |
| Authority over activation | Wearer-L0 |

**Invocation patterns** (II.6): wearer-invoked, continuous-projection, event-triggered, system-triggered.

**Coordinate example:**

Plan program activated for Wearer-A: `Kind=Program, Position=L4, Domain=plan, State=applied, Owner=Wearer-A (activation), System-L0 (template)`.

### V.6 Protocol

**Canonical site:** III.6.

**Properties:**

| Property | Value |
|---|---|
| Kind property | Stack-positioned (recursion terminator) |
| Operation | None (consulted only) |
| Template/applied | No |
| Stack position | L1 |
| Governing framework | None (governed directly by System-L0 as framework-of-last-resort) |
| Authority | System-L0 |

**Coordinate example:**

Protocol content (Section I commitments + recursion-termination requirement + substrate-authority-unconditional + cascade discipline): `Kind=Protocol, Position=L1, State=declared, Owner=System-L0`.

### V.7 Cross-kind structural relationships

How kinds interact across the structural shape:

**Perimeter-to-Substrate.** The perimeter writes typed signal to the substrate at intake. The substrate stores honestly; the perimeter is the gate. There is no other path for typed signal to reach the substrate.

**Substrate-to-Program.** Programs read substrate content via the substrate's governing framework's read primitives. Programs do not modify substrate directly; modifications go through the perimeter as program emissions.

**Framework-to-Perimeter.** A perimeter-governing Framework declares the rules under which Perimeter performs intake and dispatch. Perimeter operates under its governing framework. Currently slot vacant per III.8 — Cognitive Standard dissolved Sprint 8. Perimeter operating at perimeter-baseline (direct substrate write) until a successor framework is authored and confirmed at System-L0.

**Framework-to-Substrate.** The substrate's governing framework declares the substrate's atom shape, axioms, and procedures. The substrate operates under its governing framework. The framework reads/writes its own templates through programs and the metaframework, not directly.

**Framework-to-Program.** Domain frameworks declare program work. Programs consult their domain framework during operation. The artifact framework declares emission carrier shape; programs consult it at every emission.

**Metaframework-to-Framework.** The metaframework reads aggregate substrate signal across wearers, identifies domain gaps, and derives new L3 frameworks. The metaframework audits existing frameworks against its structural rules.

**Protocol-to-everything.** Protocol declares invariants every kind must honor. Protocol is consulted by frameworks in their declarations and by the metaframework in its derivations. Protocol does not act; it grounds the recursion.

### V.8 Vocabulary

Every term resolves to its canonical declaration site. Vocabulary entries reference; they do not restate.

**Kinds**

| Label | Tier | What it names |
|---|---|---|
| Protocol | Kind | Declared invariants under which all other kinds operate. Inhabits L1. Canonical: III.6. |
| Perimeter | Kind | The typed/untyped boundary transformation site. Operates intake and dispatch. Cross-position. Canonical: I.4. |
| Substrate | Kind | Cumulative typed state of every arrival and operation. Aggregates state across kinds. Cross-position. Canonical: I.5. |
| Framework | Kind | Typing rules and structural schema for a domain. Consulted, not invoked. Inhabits L2 or L3. Has template/applied state. Canonical: III.2. |
| Metaframework | Kind (Framework at L2) | Framework whose domain is the structure of frameworks. Self-applying. Canonical: III.4. |
| Program | Kind | Wearer-facing capability in a domain. Invoked, not consulted. Inhabits L4. Has template/applied state. Canonical: II.2. |

**Implementation terms**

| Label | Tier | What it names |
|---|---|---|
| System-L0 | Authority | Authority over LIV-the-system. One position per deployment. Authors Protocol, confirms framework templates, governs metaframework. Canonical: II.8. |
| Wearer-L0 | Authority | Authority over a wearer's LIV instance. Universal per wearer. Authority over substrate contents and template activation. Canonical: I.6. |
| Position / Level | Property | Where a kind sits in the governance stack. Values: L1, L2, L3, L4. Substrate and Perimeter are cross-position. Canonical: III.7. |
| Cluster | Backlog | Capability-based grouping of backlog items. Operational, not vision-level. |
| Observability signal | Implementation | Any signal LIV produces about its own operation. Inputs to gap-driven framework derivation. |
| Gap-driven framework derivation | Implementation | The mechanism by which LIV extends domain coverage. Substrate signals surface gaps; metaframework produces a new L3 framework template under System-L0 confirmation. Canonical: III.4. |
| Beta gate | Milestone | Operational milestone, declared in operational doctrine outside the Manual. |
| Construction | Sub-state of Framework-applied | Bringing a framework into existence using the four transformation shapes in sequence. |
| Runtime | Sub-state of Framework-applied | Operating once in existence. Uses zero, one, or more transformation shapes. |
| Friction | Implementation | Gap between wearer intention and machine execution. Approaches zero in a domain as the domain's framework matures and substrate density grows. |
| Conversation encode | Implementation (legacy) | LLM-classified intake path. Was owned by F-codec (dissolved Sprint 8). Currently routes to substrate write at perimeter-baseline pending successor perimeter framework. |
| Mechanical encode | Implementation (legacy) | Event-triggered intake path. Was owned by F-codec (dissolved Sprint 8). Currently routes to substrate write at perimeter-baseline pending successor perimeter framework. |
| Artifact | Implementation | Output of a program emission, carried by AS v2.2's structural shape. Canonical: II.5, IV.3. |
| Cognitive Standard | Term (L3 framework name) | **Dissolved Sprint 8.** Previously inhabited the governing-fwk slot for Perimeter. F-codec encode/decode/orchestrate machinery dissolved. Perimeter slot currently vacant per III.8. Retained as vocabulary entry for historical traceability; successor perimeter framework will replace this entry when authored. |
| Living Memory | Term (L3 framework name) | Currently inhabits the governing-fwk slot for Substrate. Canonical declaration in its own standard. |
| LIV-Standard | Term (L3 framework name) | Currently inhabits the governing-fwk slot for the code-structure domain and (dual role) the build domain. Canonical declaration in its own standard. |
| Plan Standard | Term (L3 framework name) | Currently inhabits the governing-fwk slot for the planning domain. Canonical declaration in its own standard. |
| Verification Standard | Term (L3 framework name) | Currently inhabits the governing-fwk slot for the verification domain. Canonical declaration in its own standard. |
| Research Standard | Term (L3 framework name) | Currently inhabits the governing-fwk slot for the research domain. Canonical declaration in its own standard. |
| Artifact Standard | Term (L3 framework name) | Currently inhabits the governing-fwk slot for the artifact-lifecycle domain. Canonical declaration in its own standard. |
| Multi-Instance Standard | Term (L3 framework name) | Currently inhabits the governing-fwk slot for the multi-instance pipeline domain. Canonical declaration in its own standard. |
| Design Standard | Term (L3 framework name) | Currently inhabits the governing-fwk slot for the visual-construction domain. Canonical declaration in its own standard. |
| Source authority | Arrival metadata | Property of an arrival; per-channel governance. Canonical: IV.2. |
| Correlation | Perimeter mechanics | Property of an arrival; relates same-operation arrivals. Perimeter concern, not cross-cutting. Canonical: V.2. |
| Act vs reference | Arrival metadata | Property of an arrival; determines governance level (intake/dispatch × act/reference cells). Canonical: IV.2. |
| Time of crossing | Arrival metadata | Property of an arrival; temporal anchor preserved by Substrate. Substrate-mechanical metadata preserved across all program-layer concerns that depend on time order. Canonical: IV.2. |
| Layer-naming | Vocabulary | Substrate-mechanical / substrate-stored / substrate-emergent / program-layer. Used in IV.3 to partition substrate coherence concerns by governance source. Reserved for this purpose; not interchangeable with operational tier vocabulary. |
| Continuous-projection program | Invocation pattern | Program that runs whenever the substrate is read for projection. Canonical: II.6. |
| Wearer-invoked program | Invocation pattern | Program that runs on wearer demand. Canonical: II.6. |
| Event-triggered program | Invocation pattern | Program that runs on perimeter arrival of external event. Canonical: II.6. |
| System-triggered program | Invocation pattern | Program that runs on internal operation surfacing a condition. Canonical: II.6. |
| Trust-weighted accumulation | Program-layer concern | Read-time policy at the program layer. Not a substrate-mechanical concept. Canonical: IV.3 program-layer. |
| Decay | Program-layer concern | Read-time mass differential. Not an active substrate mechanism. Canonical: IV.3 program-layer. |
| Supersession | Program-layer concern | Read-time pattern recognition. Not a substrate operation. Canonical: IV.3 program-layer. |
| Confidence on bind | Program-layer concern | Read-time policy at the program layer. Not a substrate-framework field. Canonical: IV.3 program-layer. |
| Conflict surfacing | Substrate-emergent concern | Substrate exposes contradiction at read; structural emergence. Distinct from conflict resolution (program-layer). Canonical: IV.3 substrate-emergent. |
| Conflict resolution | Program-layer concern | Programs interpret surfaced conflicts under their domain rules. Canonical: IV.3 program-layer. |

---

## Section VI — Operations

**Abstraction:** process level. **Voice:** prescriptive.

Operational reference. Examples included where they aid reference.

### VI.1 Local setup

Repo: `~/liv-app-v2`. Tars and deliveries go to `~/Downloads`.

### VI.2 Deploy sequence

**Local (9 steps):**

- Extract: `cd ~/Downloads && mkdir {delivery} && tar xf {delivery}.tar.gz -C {delivery}`
- Stage: copy delivery contents into the repo working tree.
- Build: `npm install && npm run build` until zero errors.
- Verify boot markers locally.
- Commit on branch.
- Open PR; squash-merge to main once CI passes.
- Tag release if SPEC bumped.
- Push tar to delivery archive.
- Notify (manual log entry).

**Server (4 steps):**

- `ssh root@45.76.29.179`
- `cd /opt/liv-app && git pull`
- `npm install && npm run build` until zero errors.
- `pm2 restart liv --update-env` and verify boot markers.

### VI.3 Server rules

Server: `45.76.29.179`. Domain: `livai.dev`. ALLOWED_EMAILS: `demos_ra@hotmail.com`.

Separate server: `144.202.60.195` (ASO-3.0). Out of scope for LIV operations. Do not modify.

### VI.4 Database operations

Database client: `core/db/client.ts`. Migrations live alongside the substrate framework. All schema changes route through Living Memory's migration discipline.

### VI.5 Instance roles

The build-and-deploy pipeline operates with three Claude instance roles:

- **Manager.** Reads context, decomposes briefs into items, dispatches to Builder and Auditor.
- **Builder.** Receives a brief and produces a tarball delivery. No manual code changes by Demos; all code arrives as Builder output.
- **Auditor.** Receives a tarball and audits against brief, vision, and current spec. Produces audit report; does not produce code.

System-L0 (Demos) confirms framework generation, ratifies all standards, and is the only L0 confirmation point in the loop.

### VI.6 Key rules

- Framework templates enter through the backlog per Section VII Rule 6.
- No framework module is created at runtime.
- No framework module is created by user action outside the backlog.
- L0 confirmation required at every framework generation.

---

## Section VII — Update protocol & vocabulary additions

**Abstraction:** process level (rules) + vocabulary level (additions). **Voice:** prescriptive for rules; declarative for additions.

### VII.1 Update triggers

Five triggers, each with its own protocol:

| Trigger | What changed | SPEC bump | Artifact(s) affected |
|---|---|---|---|
| Deploy | Code shipped, HEAD advanced | Yes | Deploy State artifact (III updates; VI appends); Backlog & Active artifact updates per completed items |
| Language-only | Sections tightened with no code change | Yes | This manual (per change); Deploy State changelog appends |
| Vision revision | Section I rewritten | Yes (major) | This manual (I first; II/III/IV must re-derive; audit required before population); downstream artifacts re-cross-reference |
| Backlog-only | Backlog & Active artifact updated (planned work change) | No | Backlog & Active artifact only |
| Removal | Section removed under obsolescence/consolidation | Yes | This manual (target section removed; references redirect; redirect note retained) |

### VII.2 Rules

**Rule 1 — Cascade discipline.** Manual amendments must verify cascade self-test sentences hold for the amended section. Section I amendments must pass the "no domain or framework specifics" test; Section II/III amendments must not duplicate canonicality; Section IV amendments must satisfy the cross-cutting placement criterion (governance source for concern in multiple loops, not just touching multiple loops).

**Rule 2 — Canonicality follows unique ownership.** Two artifacts share canonicality only if they own non-overlapping content. When an artifact's content is duplicated by another, the duplicate is reference, not canonical. Layer-distinct artifacts (vision vs standards vs operational) can each be canonical at their layer for non-overlapping content.

**Rule 3 — Mechanics stay with their concern.** When a question arises about whether a mechanism belongs in Section X or Section Y, the test is: what concern does the mechanism govern? Mechanics live with the concern they govern, not in cross-cutting unless they are the governance source for the concern across multiple loops.

**Rule 4 — Drift-sweep cycle.** Manual major versions must perform a drift sweep for substrate-framework-specific terms (decay, supersession, trust-weighted, confidence-on-bind, promotion) to verify they are reclassified to the correct layer (typically program-layer in IV.3) and that no substrate-framework legacy terms remain in vision-level prose outside Appendix A historical references.

**Rule 5 — Post-substrate program-purity.** Each program in Section II is verified against the post-substrate program-purity test: does this program operate cleanly on raw substrate I/O for any wearer, or does it carry forced adaptations from prior substrate versions? Forced adaptations are legacy debt; named in Section II.x and queued for removal under §1.25 cycle.

**Rule 6 — Framework templates enter through the backlog.** New framework templates are backlog items. Each follows the metaframework's four transformation shapes (epistemic identification of the domain, structural decomposition into axes, generative production of the framework template, verificative audit against L1 validity rules), confirmed by System-L0, deployed as code.

Two paths apply:

- **Bootstrap path (current phase):** System-L0 identifies the domain, authors the framework template, submits as backlog item, confirms during build. Deployed as code per backlog mechanism. LIV-Standard, Living Memory, Plan Standard, Verification Standard, Research Standard, Multi-Instance Standard, Artifact Standard, and Design Standard followed this path.
- **Steady-state path (post-beta):** Substrate signals aggregate into gap candidates surfaced to System-L0. System-L0 confirms candidate. Metaframework invoked per III.5 procedure, produces framework template, audits against L1 validity rules. System-L0 confirms template. Template enters backlog, deployed through same mechanism as bootstrap path.

No framework template is created at runtime without this full path. No framework template is created by user action outside the backlog. System-L0 confirmation is required at every generation regardless of path.

**Rule 7 — Labeling rule applies to all framework declarations.** Every framework declared in the system carries a label. Default-level frameworks (L3) use a domain noun (e.g., Plan Standard, Living Memory). Non-default-level frameworks use a semantic prefix that names what the framework's domain is (e.g., Metaframework — framework whose domain is the structure of frameworks).

**Rule 8 — Every wearer is L0 of their own instance.** Wearer-L0 is universal per I.6. Each wearer holds declarative authority over their own substrate and over which framework templates and program templates are active for their instance. Wearer-L0 does not author Protocol or system-wide framework templates; that authority belongs to System-L0.

System-L0 cannot override Wearer-L0's substrate authority per I.6 (substrate authority unconditional). The two L0 positions interact only through the channels declared in I.6.

**Rule 9 — Backlog item structure.** Each backlog item carries: principle (which Manual claim it serves), kind it operates on, dependencies, cluster, and state. Items without a principle reference fail Rule 9 and return to idea state.

### VII.3 Lifecycle sequence

For a typical framework template:

1. Gap identified. System-L0 either authors the gap directly (bootstrap) or confirms a surfaced gap candidate (steady-state).
2. Backlog item created with principle reference, state = idea.
3. Decomposition. Item is scoped: brief written, dependencies named, four transformation shapes mapped to delivery steps. State = scoped.
4. System-L0 confirmation. State = ready.
5. Active. Item dispatched to Builder. State = active.
6. Delivery. Builder produces tarball. Auditor reviews against brief and L1 invariants.
7. Ship. Tarball deployed. Deploy State updates. Changelog entry. SPEC bumps. State = shipped.

### VII.4 Escalation protocol

When an instance encounters a scenario the active framework does not cover, the instance stops and escalates to System-L0 with: gap identified + required transformation shape (epistemic, structural, generative, verificative).

System-L0 either:

- Confirms an existing framework covers the case (instance proceeds),
- Authors a new framework template (Rule 6 lifecycle begins), or
- Defers to perimeter-baseline operation in the unaddressed domain (instance proceeds with reduced fidelity).

### VII.5 Migration from SPEC-v10.x

This section is transitional. It will be removed at the next vision-revision cycle once pre-v11 backlog items have been re-mapped to v11 cascade language. Until then, retained as migration aid.

| v10.x term | v11.0 term | Notes |
|---|---|---|
| I.13 Core map | Appendix A | Flat lookup over the cascade. Canonical sites distributed across I/II/III. |
| I.7 Substrate coherence | IV.3 (layer-named) | Coherence concerns reclassified by layer (substrate-mechanical / stored / emergent / program-layer). |
| Tier 1 / Tier 2 | Operational doctrine outside Manual | Tier vocabulary reserved for operational system split (core capability vs extended capability), not vision-level. |
| Trust-weighted / decay / supersession (substrate concerns) | Program-layer concerns (IV.3) | Reclassified per drift sweep. |
| Cognitive Standard | Slot vacant | Dissolved Sprint 8. Slot at III.8 vacant. Successor framework pending derivation. |

References to the canonical I.13 map remain valid where they address core elements; lookups now target Appendix A pointing to canonical sites in the cascade.

### VII.6 Drift checks

Five diagnostics for vision-level coherence loss. Any of these signals a need to escalate.

**D1 — Kind collapse.** Treating two kinds as the same. Examples: programs treated as frameworks, perimeter operations treated as program executions, substrate treated as persistence implementation only, framework templates treated as their applied form.

**D2 — Position collapse.** Two failure modes:

- *(a) Position-value conflation:* treating two positions as the same. Disambiguator examples: metaframework (L2) versus framework (L3); System-L0 versus L1 (Protocol as declared invariants); L0 declares L1's content but is not L1.
- *(b) Terminology drift:* using "Layer" where "Position" or "Level" is the unified term.

**D3 — State drift.** Treating template and applied as the same. Drives ownership confusion between System-L0 declarer and Wearer-L0 activator.

**D4 — Vision integrity loss.** Describing LIV as its architecture instead of as what the architecture is for. Describing LIV as its currently-addressed domain coverage instead of as cognitive extension unbounded over arbitrary domains per I.1 and III.4. Describing the arrival operation as a pipeline. The map is the description. LIV is what the description points to.

**D5 — Authority confusion.** Treating System-L0 and Wearer-L0 as the same position. Routing wearer-substrate decisions through System-L0, or routing template authoring through Wearer-L0. The two positions are differentiated by jurisdiction per I.6 and II.8; conflating them violates substrate authority unconditional.

**D6 — Cascade discipline violation.** Introducing a kind, a concern, or a property at a cascade section other than its canonical site. Section I drift includes Framework/Program/Protocol bleed; Section II drift includes governance-recursion bleed; Section IV drift includes single-loop concerns claiming cross-cutting status.

**D7 — Layer collapse (substrate coherence).** Treating substrate-mechanical, substrate-stored, substrate-emergent, and program-layer concerns as a single layer. Each has a different governance source; conflating them re-introduces graph-mechanic legacy vocabulary as substrate-mechanical when it is program-layer.

---

## Appendix A — Core element index

Flat lookup over the cascade. Each row tabulates element properties and points to the canonical section in Sections I/II/III/IV.

| # | Element | Position | Owner | Delivers | Depends on | Depended on by | Canonical site |
|---|---|---|---|---|---|---|---|
| 1 | Wearer-L0 | declarative authority | self | unconditional content authority over wearer's substrate | nothing higher | substrate authority unconditional, perimeter authority enforcement | **I.6** |
| 2 | System-L0 | declarative authority | self | template/invariant authority | nothing higher | Protocol, framework templates, kind structure | **II.8** |
| 3 | Protocol | L1 kind | System-L0 | invariant declaration | System-L0 | metaframework, all framework-on-framework recursion | **III.6** |
| 4 | Perimeter | cross-position kind | governing framework (currently absent — III.8) | typed/untyped boundary | governing framework, arrival operation | substrate (writes), programs (routing target) | **I.4** |
| 5 | Substrate | cross-position kind | Living Memory v3.1 | typed-signal persistence | governing framework, internal operations | every kind reading typed signal | **I.5** |
| 6 | Framework | L2/L3 kind | metaframework (L3) / Protocol (L2) | rules-for-domain | metaframework or Protocol per stack position | programs (L4), perimeter, substrate | **III.2** |
| 7 | Program | L4 kind | System-L0 (template) / Wearer-L0 (activation) | wearer-facing capability in domain | domain framework, artifact framework, substrate framework | wearer surface | **II.2** |
| 8 | Metaframework | L2 framework | System-L0 | framework-on-framework derivation, audit, gap closure | Protocol | L3 framework generation | **III.4** |
| 9 | Arrival operation | structural unit | perimeter | typed/untyped crossings | perimeter, substrate | every external↔typed transition | **I.2** |
| 10 | Internal operation | structural unit | (each kind in its work) | typed-to-typed work | kinds and their interactions | every typed-to-typed transition | **I.2** |
| 11 | ~~Confidence on bind~~ | ~~substrate coherence~~ | — | — | — | — | **DRIFT-SWEPT — moved to IV.3 program-layer** |
| 12 | Conflict surfacing | substrate coherence concern (substrate-emergent layer) | substrate framework | conflict exposure at read | substrate-emergent geometry | program-layer conflict resolution | **IV.3** |
| 13 | Modal typing | substrate coherence concern (substrate-stored layer) | governing fwk of Substrate (LMA3, LMA11) | modality preserved as recorded metadata | substrate framework axioms | re-derivation at execution | **IV.3** |
| 14 | ~~Supersession~~ | ~~substrate coherence~~ | — | — | — | — | **DRIFT-SWEPT — moved to IV.3 program-layer** |
| 15 | ~~Trust-weighted accumulation~~ | ~~substrate coherence~~ | — | — | — | — | **DRIFT-SWEPT — moved to IV.3 program-layer** |
| 16 | ~~Decay~~ | ~~substrate coherence~~ | — | — | — | — | **DRIFT-SWEPT — moved to IV.3 program-layer (read-time mass differential)** |
| 17 | Source authority | arrival metadata | governing fwk of Perimeter (when authored) | per-channel governance | arrival channel | per-channel governance enforcement | **IV.2** |
| 18 | Correlation | perimeter mechanics | governing fwk of Perimeter | linking arrivals from same originating interaction | perimeter mechanics | perimeter operations | **MOVED to V.2 perimeter mechanics — failed cross-cutting criterion** |
| 19 | Act vs reference | arrival metadata + governance differentiation | governing fwk of Perimeter (when authored) | world-effect distinction | arrival classification | act-dispatch governance vs reference-dispatch governance | **IV.2** |
| 20 | Time of crossing | arrival metadata | governing fwk of Perimeter (stamps) + governing fwk of Substrate (preserves) | temporal anchor for typed signal | perimeter clock at crossing | program-layer concerns that depend on time order | **IV.2** |
| 21 | Signal reuse | fidelity principle | structural commitment | every signal LIV produces feeds back into LIV | substrate accumulating program emissions, programs reading prior emissions, metaframework reading aggregate | compounding extension across time | **IV.4** |
| 22 | Directional symmetry | fidelity principle | structural commitment | bidirectional governance on every operation | perimeter intake/dispatch governance, program read/dispatch governance | governance gap prevention | **IV.4** |
| 23 | Substrate authority unconditional | substrate authority commitment | Wearer-L0 + structural | wearer's substrate content is theirs unconditionally | Wearer-L0, perimeter enforcement | substrate portability, wearer-bypass cases | **I.6** |
| 24 | Substrate portability | substrate authority commitment | Wearer-L0 + structural | wearer content survives substrate framework succession | substrate authority unconditional | substrate framework versioning | **I.6** |
| 25 | Five-state ordering | metaframework primitive | metaframework | sequence (unknown → known → structured → produced → verified) | metaframework's structural commitment | four shapes derivation | **III.5** |
| 26 | Four shapes | metaframework primitive | metaframework | epistemic / structural / generative / verificative | five-state ordering | program work classification, framework procedure composition | **III.5** |
| 27 | Stack positions | governance derivation | III.7 | L1/L2/L3/L4 hierarchy | governance recursion shape | framework slot tracking | **III.7** |
| 28 | Framework-slot status | governance state | System-L0 (slot structure) / L3 selection (inhabitants) | current inhabitants and acknowledged gaps | governance recursion | sprint planning, audit cycles | **III.8** |
| 29 | Wearer-bypass cases | experience-direction exception | Wearer-L0 | direct wearer→substrate paths | substrate authority unconditional, perimeter | revocation, identity curation through utterance, L0 confirmations | **III.9** |
| 30 | Inversion (experiential vs structural) | structural fact | III.1 | governance runs opposite to experience | five kinds, both directions | reader misread prevention | **III.1** |
| 31 | Layered substrate coherence | cross-cutting | IV.3 | partition of coherence concerns by governance source | substrate framework + program-layer | layer-specific governance | **IV.3** |
| 32 | Invocation patterns | program loop property | II.6 | four patterns: wearer / continuous / event / system | program loop, perimeter typing | program runtime governance | **II.6** |

**Operational uses:**

- Drift-walk target for tight-ship audits: walk Appendix A row by row against src, confirm canonical site claim holds.
- Rapid lookup for cross-reference work.
- Dependency tabulation for sprint scoping.

**Appendix A discipline:** This is a flat index over the cascade. No claim in Appendix A originates here. Every claim references its canonical section. Updates to canonical content propagate to Appendix A by re-derivation, not by independent editing.

---

## Manual change log

| Version | Cycle | Scope | Authority |
|---|---|---|---|
| v10.x | (pre-v11.0 lineage) | Pre-v11 cascade structure (see SPEC-v10.2 archive) | L0 |
| v11.0 | (2026-05-06 prior) | Full cascade restructure (see VII.5 migration notes) | L0 |
| v11.1 | Structure-Tightening Sprint close (2026-05-06) | Two additive amendments per §VII update protocol: (1) §III.4 bootstrap-mode acknowledgment — declares metaframework currently operates as L0-orchestrated procedure during bootstrap phase; aggregate-signal-read primitives staged for LM v3.2 / post-beta delivery; structural commitments of §III.4 preserved verbatim. (2) §III.8 perimeter-row promotion — perimeter governing-framework slot filled by Perimeter Standard v1.0.1 (`core/standards/perimeter-standard.md`); perimeter row removed from Currently open slots, added to Currently filled slots; F-chat row companion edit (references Perimeter Standard v1.0.1 rules instead of "vacant" status); honest-acknowledgment paragraph refreshed to reflect Shot 3 unitary-site wiring at `src/middleware.ts` and Sprint 9 promotion path for remaining BCR-emission gates. **Discipline:** additive per §VII.2 — zero structural commitments altered; only acknowledgment text inserted at III.4 + slot-status table updates at III.8 + acknowledgment refresh at III.8. v11.0 text preserved verbatim wherever not directly amended. | L0 (pending confirmation) |

---

End of Manual SPEC-v11.1.
