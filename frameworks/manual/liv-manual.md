---
kind: framework
placement: frameworks/manual/
---

# LIV MANUAL

SPEC-v13.1 · 2026-05-13

Supersedes SPEC-v13.0. Patch-level governance-text amendment. Part IV authority chain reconciled to ratified chain per substrate v1.8.1 §5.2: L0 = Intent, L1 = Metaframework, L2 = Standards, L3 = Programs. Labels stable; role names attached. Prior "L4 = Programs" and "L1 = Protocol slot" framings superseded. Operations table swept to Sprint B1 sibling-version state: PS v1.0.1 → v1.1, Metaframework v3.2.7 → v3.3.1, LIV-Standard v1.5.1 → v1.5.2. No vision change.

```
Root claim
The three loops in relation
Canonical naming
Part I    — Substrate
Part II   — Memory Loop
Part III  — Domain Loop
Part IV   — Governance Loop
Operations
Drift checks
```

---

## Root claim

LIV extends a wearer's cognition across time.

A wearer thinks, decides, observes, and acts in a continuous present. Each moment produces signal — utterances, decisions, observations, intentions — which would otherwise dissipate as the moment passes. Cognition that does not persist cannot compound. Cognition that does not compound cannot extend.

LIV extends what becomes typed signal across time. Every input modality — voice, image, document, structured event, sensor reading — flattens to typed at the boundary. What does not cross into typed jurisdiction is not extended by LIV.

Extension across time requires that what enters typed jurisdiction becomes durable structure that subsequent moments read against — faithfully reconstructible, without rewriting, without lossy summarization, without forced interpretation.

**What LIV is not.**

*Not a chatbot.* A chatbot produces responses without persisting faithful structure. Extension requires persistence.

*Not a personal database.* A database stores records under explicit schemas. It does not type signal at a boundary, does not aggregate state across kinds of operations, and has no commitment to the wearer's authority over content.

*Not a cognitive prosthesis substitute.* LIV extends the wearer's cognition. It does not replace it. The wearer remains the cognitive subject.

*Not a fixed-modality system.* What enters LIV is whatever can be typed at the boundary. Future modalities are absorbed without amending the root claim.

*Not infrastructure-defined.* LIV is defined by what it does and what it requires structurally. The infrastructure that runs it is replaceable. LIV's identity does not change when its infrastructure changes.

---

## The three loops in relation

The memory loop is linear and foundational. It runs whenever signal arrives or leaves — wearer-facing channel, then the typed/untyped crossing, then transit work, then accumulation in substrate. Without this loop having run, no other loop has anything to act on.

The domain loop is perpendicular to the memory loop. It cuts across accumulated substrate at a point in time, transforms a slice in a wearer-declared domain, and writes the result back. The written result re-enters the memory loop and accumulates. Subsequent cuts read richer state. The loop compounds within itself.

The governance loop is perpendicular to both. It runs through the system governing itself: aggregate substrate signal surfaces gaps, Derivation produces standards, standards govern programs more precisely, programs produce richer signal. The loop compounds at slow timescale and refines what makes the other two loops faithful.

Three loops, three structural shapes. Memory loop linear and continuous. Domain loop perpendicular and compounding within. Governance loop perpendicular to both and meta-compounding.

---

## Canonical naming

These names are fixed. Used exactly as written throughout this manual. A term not in this table that names a structural concept is a gap — escalate before proceeding.

| Name | What it refers to |
|---|---|
| **Substrate** | The single persistent typed state of a LIV instance |
| **Store** | The program that governs the substrate's operational mechanics; terminal node of the memory loop |
| **Boundary** | The program that governs typed/untyped crossing |
| **Modality** | Programs that govern wearer-facing channels and surfaces — the entry and exit points of the memory loop |
| **Mediator** | Programs that govern transit work through the memory loop between Boundary and Store |
| **Generator** | The four programs that perform Cycle work on a target |
| **Cycle** | The work shape that Generators perform — the five-state ordering's four adjacent transitions |
| **Domain** | Programs that perform work in a wearer-declared domain — produced by Generators, run when invoked |
| **Tool** | Programs that provide governed capability other programs reach for |
| **Derivation** | The metaframework and its generation procedure |
| **Standards** | The output of Derivation — one governing standard per program |
| **Wearer-L0** | Declarative authority over substrate content |
| **System-L0** | Declarative authority over structural shape — standards, templates, invariants |
| **Protocol** | The invariant ground all loops must honor |
| **Invocation** | How a program's execution is triggered |
| **Artifact** | Typed output produced by a program, carried by the artifact carrier |

---

## Part I — Substrate

*What this part introduces:* the foundation that all three loops share. Introduced first because nothing else can be precisely stated without it.

### The substrate

The substrate is the single persistent typed state of a LIV instance.

Every signal that enters typed jurisdiction lands here. Every program reads from here and writes back here. It does not initiate — it is acted upon. One substrate per LIV instance, not distributed.

The substrate does not distinguish between kinds of signal. It stores what arrives honestly. Governance over what arrives is enforced before arrival, at the Boundary. The substrate's work is faithful accumulation.

Two structural units make extension across time possible:

**Arrival operations** — crossings between untyped reality and typed jurisdiction. Every signal entering LIV crosses into typed form at the Boundary. Every signal leaving crosses back out. Arrivals are bidirectional: typing on the way in, untyping on the way out.

**Internal operations** — typed-to-typed work within typed jurisdiction. Reading what has accumulated, transforming what has been read, producing further typed structure that itself accumulates. Internal operations do not cross the typed/untyped frontier.

Both units are first-class. Arrivals without internal operations accumulate signal that is never acted upon. Internal operations without arrivals have no signal to act upon. Extension across time requires both.

### Wearer-L0

Wearer-L0 is the declarative authority over substrate content.

The wearer's cognition is theirs. What enters typed jurisdiction as the wearer's cognition is confirmed by Wearer-L0 alone. No program, standard, or system process may modify substrate content under the wearer's scope except by Wearer-L0 confirmation or a Wearer-L0-confirmed operation.

**Substrate authority unconditional.** The wearer's substrate content is theirs to write, theirs to revoke, theirs to migrate. This is absolute and survives every other structural change.

**Substrate portability.** The wearer's substrate content is portable across substrate framework versions and across LIV deployments. Portability is mechanical, not aspirational: any future substrate framework must support migration of prior substrate content under wearer authorization. If the wearer's content is theirs unconditionally, substrate framework succession cannot strand it.

**Wearer-bypass cases.** Most wearer interaction is mediated by programs. Some wearer interactions reach the substrate directly through the Boundary without any program in the path. These are structurally justified exceptions, not violations:

- *Revocation* — the wearer exercises unconditional authority over substrate content directly. No program mediates revocation. The wearer's revocation arrival is typed at the Boundary, recognized under Wearer-L0 authority, and applied to the substrate.
- *Identity curation through utterance* — when the wearer says "X means Y," the resulting state-change writes the disambiguation as ordinary content. No domain program mediates this.
- *L0 confirmations* — Wearer-L0 confirmations cross the Boundary as arrivals like any other, typed with their authority origin preserved as metadata.

These bypasses honor the cascade. Each uses the Boundary, writes to the substrate, and is governed by the same authority shape as program-mediated interactions.

### System-L0

System-L0 is the declarative authority over the structural shape of LIV — standards, templates, and invariants. Program templates, framework templates, Protocol content, the kind structure of LIV itself — all confirmed at System-L0.

System-L0 does not bypass the Boundary. System-L0 confirmations cross as arrivals like any other, typed with their authority origin preserved.

**The two authorities do not overlap.** Wearer-L0 governs substrate content. System-L0 governs structural shape. The wearer's content is theirs; the system's structure is the system's. Substrate framework succession is a System-L0 decision; the wearer's content survives it through portability.

**Scope.** The substrate is single-store. Scope is an attribute on every persisted state. Per-wearer and shared content live in the same store, distinguished by the scope attribute. Scope access enforcement is a Boundary responsibility, not a substrate responsibility. New scope kinds are new attribute values — no structural change required.

---

## Part II — Memory Loop

*What this part introduces:* the foundational operational process that keeps the substrate populated. Introduced second because domain programs (Part III) read from a substrate the memory loop populates.

### The loop

Wearer signal arrives at a Modality channel → Modality presents it to the Boundary → Boundary types it → Mediator carries it → Store accumulates it → Store is read → Mediator carries the response → Boundary untypes it → Modality emits it to the wearer.

The memory loop is arrival-triggered. It runs when signal arrives. It does not spin independently. Every other loop depends on this loop having run — domain programs read from the substrate this loop populates.

Signal that domain programs write back re-enters this loop as new typed signal, is typed at the Boundary, and accumulates in Store. This is what makes the domain loop compound over time: each program's output becomes substrate signal that subsequent programs read.

The memory loop runs through four kinds of program. Each is named below in signal-flow order: Modality where signal enters and exits, Boundary where typed jurisdiction begins and ends, Mediator where typed signal moves, Store where it accumulates.

### Modality

Modality programs govern wearer-facing channels and surfaces. They are the entry and exit points of the memory loop. Each Modality program handles one channel of wearer-system interaction — a conversational channel, an output emission channel, a configuration surface, a render surface — and does not transform domain content.

Modality programs are plural by construction. One channel per program. New channels enter the system as new Modality programs without restructuring the loop.

Modality work is signal-shaping at the wearer/Boundary frontier. Intake direction: Modality receives wearer input in its channel's medium and presents it to the Boundary for typing. Emission direction: Modality receives typed output from the Boundary and renders it in its channel's medium for the wearer. The conversion is the structural work.

Modality programs do not write to substrate directly and do not act on accumulated state. They have no exec layer for substrate operations — their work is transit-only on the wearer side of the Boundary.

Modality programs are arrival-triggered (intake direction) or emission-triggered (output direction). Each is governed by a standard generated by Derivation when one exists. Current inhabitants:

- *F-chat* — conversational channel
- *F-output* — output emission channel (build deliveries, downloads, push)
- *F-admin* — L0 console surface
- *F-dashboard* — wearer-facing render surface and program registry

The Modality Standard slot is acknowledged vacant — derivation pending if drift surfaces. Modality programs operate under Perimeter Standard v1.1 rules as interim fallback for crossing-adjacent concerns.

### Boundary

Boundary is the program that governs typed/untyped crossing.

Every signal entering typed jurisdiction crosses here. Every signal leaving crosses here. One Boundary per LIV instance — unitary by structural necessity. A distributed boundary cannot be checked; a unitary boundary can.

Boundary acts on every crossing. It does not accumulate — it transforms. It types signal on the way in, untypes on the way out, and passes the result downstream to Mediator toward Store.

**Authority enforcement.** Boundary enforces authority at the crossing. Scope access is checked here. System-L0 and Wearer-L0 confirmations are recognized here. No unauthorized signal reaches Store.

**Signal properties stamped here.** Every typed signal carries four properties stamped at the Boundary and preserved by Store:

- *Source authority* — who sent it: Wearer-L0, System-L0, AI response, scheduled trigger, integration event, internal derivation. Each channel has different authority semantics; per-channel governance is enforced at the Boundary.
- *Time of crossing* — when it entered typed jurisdiction. The temporal anchor for all accumulation. Stamped at the Boundary, preserved by Store, never modified after stamping.
- *Act or reference* — whether it produces world effect. Acts mutate substrate or act on the world. References read or query without effect. This determines governance level:

| | Intake | Dispatch |
|---|---|---|
| **Reference** | Lightweight — provenance preserved, no confirmation required | Lightweight — rendering accumulated content to wearer |
| **Act** | Confirmation, audit, reversibility — substrate is being mutated | Strongest — world-effect external to LIV requires confirmation, audit, reversibility where possible |

- *Scope* — whose jurisdiction it belongs to.

**Boundary mechanics.** The Boundary owns the following as program-internal concerns, not cross-loop concerns:

- *Correlation* — linking arrivals from one originating interaction
- *Surface-form-to-reference matching* — resolving wearer-stated identifiers to substrate identity references at intake
- *Channel classification* — assigning source authority per channel
- *Scope access enforcement* — gating arrivals against authority and scope

Boundary is governed by a standard generated by Derivation. F-identity and proxy.ts are the current inhabitants, governed by Perimeter Standard v1.1.

### Mediator

Mediator programs govern transit work through the memory loop after signal has crossed the Boundary and before it reaches Store, and the reverse on the way out. They route, deliver, shape, and channel typed signal. They do not transform domain content — movement is their work, and the movement is internal to typed jurisdiction.

Mediator programs are arrival-triggered. Each is governed by a standard generated by Derivation when one exists. Current inhabitants:

- *F-router* — routing decisions: which program handles this typed signal
- *F-intake* — arrival shaping: structuring arriving typed signal before it reaches downstream programs

The Mediator Standard slot is acknowledged vacant — derivation pending. Mediator programs operate under LIV-Standard code-structure governance until dedicated derivation is performed.

### Store

Store is the program that governs the substrate's operational mechanics — write, accumulate, read — and the terminal node of the memory loop on the intake direction, the source node on the emission direction.

Store is in the loop. The memory loop flows into Store on intake (where typed signal accumulates) and out of Store on emission (where accumulated state is read for response). Mediator delivers to Store; Mediator reads from Store. Boundary's typed signal terminates here.

Store does not initiate. It is acted upon. Mediator writes to it; programs from any loop read it and write to it. Store's work is to maintain faithful accumulation under that activity.

Store is governed by a standard generated by Derivation. One Store per LIV instance. F-memory is the current inhabitant, governed by Living Memory v3.2.

---

## Part III — Domain Loop

*What this part introduces:* where value is produced. Introduced third because domain programs read from the substrate the memory loop populates.

### The loop

A program reads accumulated substrate state → transforms it in a domain → writes the transformation back to the substrate.

Domain programs cut perpendicularly across the memory loop. They do not run along the signal flow direction — they cut across accumulated state at a point in time, read a slice, transform it in their domain, and write the result back. That result re-enters the memory loop as new typed signal and accumulates. Subsequent cuts read richer state. This is how the domain loop compounds within itself: each cut enriches what subsequent cuts read.

Programs hand off through the substrate — not directly to each other. The substrate is what makes arbitrary program compositions coherent without explicit coordination.

The domain loop runs through three kinds of program. Generators perform cycle work on a target — they activate when a fidelity gap surfaces in the target. Domain programs are what Generators produce — they perform wearer-domain work and run when invoked. Tools are reached for by programs in either category when their work needs injected capability — Tools do not initiate, they are injected utility.

### Generator

Generator is the category of four programs that perform Cycle work on a target.

The work cycle derives from the five-state ordering: **unknown → known → structured → produced → verified**. The four adjacent-state transitions are the four shapes:

- **Epistemic** — unknown → known. Establishing what is the case.
- **Structural** — known → structured. Organizing known content into declared form.
- **Generative** — structured → produced. Producing artifacts from structured input.
- **Verificative** — produced → verified. Checking produced output against declared shape.

The four Generators are those shapes made operational:

| Program | Shape | Work |
|---|---|---|
| F-discover | Epistemic | Establishes what is the case |
| F-plan | Structural | Organizes known content into declared plan structure |
| F-builder | Generative | Produces artifacts from structured input |
| F-verify | Verificative | Checks produced output against declared shape |

**The Generator category is closed at four.** Four adjacent-state transitions in a five-state ordering — exactly four, by construction. No fifth Generator is possible without introducing a sixth state in the ordering.

**Generators are primitives, not a pipeline.** They compose freely. Any composition is valid: partial traversal, loop, branch, repeated entry, single primitive. A code review invokes F-verify alone. An investigation invokes F-discover alone. A full sprint traverses all four. Programs hand off through the substrate — not directly — which makes arbitrary compositions coherent without declaring the composition in advance.

**Activation.** Generators do not run continuously. They activate when a gap surfaces in their input state and their output state is needed. Once active, they cycle their target through the relevant transition and return.

**Target.** A Generator's target is whatever is being cycled. Targets are typically wearer-declared domain content. When the governance loop activates, Generators cycle against framework targets instead. The Generators are the same programs; only the target differs. This is what makes the governance loop possible without duplicating Cycle infrastructure.

Each Generator is governed by a standard generated by Derivation.

### Domain

Domain is the open set of programs that perform work in a wearer-declared domain — programs that Generators produce, that then run when their work is invoked.

Tasks, calendar, health, communications, finance — whatever surfaces through gap-driven derivation from the governance loop. The set grows without bound. The loop structure never changes to accommodate it.

Each Domain program declares: a domain, a primary shape (one of the four), and receives a governing standard from Derivation. Domain programs use Generators when their work involves cycle operations on their domain content. Not all Domain programs do — some perform narrow operations that do not require the full cycle.

The Domain program set is currently empty. Future arrivals are programs the wearer commissions LIV to build for their declared domains.

### Tool

Tool is the set of programs that provide governed capability other programs reach for. Tools do not initiate — they are reached for by any program in any loop.

Tools have clear domain boundaries, governing standards derived by Derivation, and defined output shapes. Their interaction pattern — synchronous call, pub/sub, event-trigger, autonomous run — is orthogonal to category membership. A Tool reached via pub/sub is the same kind of program as a Tool reached via direct call.

Current inhabitants:

| Program | Domain |
|---|---|
| F-artifact | Artifact lifecycle and emission |
| F-event-system | Event bus — inter-program event delivery |
| F-executor | Code execution |
| F-multi-instance | Multi-instance AI orchestration |
| F-permissions | Authority enforcement |
| F-ai-adapter | LLM call surface |
| F-design-system | Visual construction primitives |
| F-project | Project scope management |
| F-user-profile | Identity data |

### Invocation

Every program in every loop is triggered by one of four invocation patterns. Declared here because invocation is first meaningfully variable at this level — Boundary, Modality, and Mediator have fixed arrival-triggered invocation; Generators, Domain programs, and Tools select among these four.

- **Wearer-invoked** — the wearer triggers the program directly. The typical pattern for programs whose output the wearer reads as a discrete result.
- **Continuous** — the program runs whenever its output is needed for projection. No discrete invocation; runs by default when its output is required.
- **Event-triggered** — an external event arriving at the Boundary triggers the program. The trigger is an arrival; the Boundary types it and routes it to the appropriate program.
- **System-triggered** — an internal operation surfacing a condition triggers the program. Carries System-L0 authority for the triggering operation.

Invocation is a property of individual programs. Any program in any loop can have any invocation pattern.

### Artifacts

Artifacts are the typed output produced by programs that perform domain work.

**Carrier shape.** Every artifact has the same structural envelope regardless of domain. The carrier shape is universal across programs, declared by the artifact standard (currently AS v2.2).

**Domain content.** What the artifact actually contains is shaped by the program's governing standard. The plan standard declares what counts as plan content; the verification standard declares what counts as a verification result.

**Artifacts are substrate signal.** Every artifact re-enters the memory loop as new typed signal, crosses the Boundary, and accumulates in Store. Subsequent domain programs read it as part of accumulated state. This is the mechanism by which each domain program's output becomes the richer substrate the next program reads.

---

## Part IV — Governance Loop

*What this part introduces:* how programs in all loops are governed and how the governance chain terminates. Introduced fourth because the governance loop governs the programs all prior parts introduce.

### The loop

Substrate accumulates signal across all programs → Derivation reads aggregate signal → gap identified → standard derived → standard governs programs → programs produce richer signal → loop continues.

This loop runs at slow timescale. It is perpendicular to both other loops — it does not run through the wearer's experience, it runs through the system governing itself. This is what makes LIV self-improving rather than merely self-consistent: the operational loops feed richer signal into the governance loop, which produces tighter standards, which govern more precise programs, which produce richer signal.

The governance loop reuses the Generator category. When governance activates, Generators cycle against framework targets — F-discover identifies framework gaps from aggregate signal, F-plan structures the derivation, F-builder produces the standard, F-verify checks the standard against Protocol. The programs are the same as in the domain loop; the target is a framework rather than wearer-domain content.

Derivation reads aggregate signal only — counts, frequencies, gap markers across all scopes. It never reads individual wearer content. This preserves substrate authority unconditional while allowing system-level gap identification.

### The governance chain

Every program traces to a standard. Every standard traces to Derivation. Derivation traces to Protocol.

The chain is acyclic and terminates. A program without a governing standard is structurally undefined. A framework without governance termination is recursively open.

**Stack positions** derive from the governance hierarchy:

- **L0 — Intent.** Root declarative authority (Wearer-L0 over substrate content; System-L0 over structural shape — see Part I). All declarations originate here. L0 ratifies amendments at every downstream tier. Protocol — the invariant ground all loops honor — is L0 intent expressed: substrate authority unconditional, governance chain termination, cascade discipline. Protocol does not occupy a separate tier; it is L0's invariant declarations.
- **L1 — Metaframework (Derivation).** L0 automating L0 work. The metaframework and its generation procedure, substrate, framework-audit, amendment-propagation, framework-registry. L0 declares the apparatus; L1 mechanically executes it to produce L2.
- **L2 — Standards.** L1 output. Domain-specific frameworks (LM, PS, LIV-Standard, Plan, Verify, Research, Builder, Render, Chat, Multi-Instance, Placement, Design, Artifact). Each generated by L1, ratified at L0, governs L3.
- **L3 — Programs.** Governed by L2 standards. Each provides capability in a domain. Programs do not occupy a governance-chain authority position; they are what governance applies to.

The chain terminates at L3 because authority terminates where confirmation terminates. L0 confirms. L1 mechanically executes L0's apparatus. L2 is what L1 produces (ratified back at L0). L3 is what L2 governs — programs do not themselves confirm, they execute under standards. Source code reflects this chain at the `AuthorityLevel` typed union (`'L0' | 'L1' | 'L2' | 'L3'`).

Stack positions are derived from the hierarchy, not assigned by convention.

**Protocol** is the invariant ground all three loops must honor — substrate authority unconditional, governance chain termination, cascade discipline. Protocol does not run, and does not occupy a separate governance tier — it is L0 intent expressed as invariant declarations, consulted at every level of the governance chain as the ground frameworks must honor. Protocol is governed directly by System-L0 because it is System-L0's declared invariants. It is not part of the governance loop — it is the ground the loop terminates on.

### Derivation

Derivation is the metaframework and its generation procedure — the engine of the governance loop.

Derivation reads aggregate substrate signal across all wearer scopes, identifies domain gaps, and produces standards through the four-shape procedure applied to framework authoring. Every standard LIV has was produced by Derivation. System-L0 confirms every derivation before a standard takes effect.

**The four shapes as metaframework primitives.** The four shapes (epistemic, structural, generative, verificative) are Derivation's composition primitives — not only how programs classify their work, but how Derivation composes new standards. When Derivation derives a standard for a new domain, the standard's procedure is composed from these shapes. Programs map to shapes because programs are built under standards composed from those shapes. The same four shapes that Generators make operational at the program level are what Derivation composes from at the framework level — the structure is shared across levels.

**Gap-driven derivation.** Two paths:

- *Bootstrap (current phase)* — System-L0 identifies the domain, authors the standard, confirms. Derivation operates as L0-orchestrated procedure.
- *Steady-state (post-beta)* — substrate aggregate signal surfaces gap candidates to System-L0. System-L0 confirms. Derivation runs the generation procedure, produces the standard, System-L0 confirms. Standard enters operation.

No standard is created outside this path. System-L0 confirmation is required at every generation regardless of path.

**Framework-on-framework recursion.** Standards are governed by standards. The governance chain has direction: L3 programs governed by L2 standards, L2 standards governed by L1 Metaframework (Derivation), L1 Metaframework governed by L0 Intent (Protocol as L0's invariant declarations). The recursion terminates at L0. The recursion is acyclic — self-application is allowed, self-governance is not.

### Standards

Standards are the output of Derivation. One governing standard per program or program category.

Every program in every loop — Store, Boundary, Modality, Mediator, Generator, Domain, Tool — has exactly one governing standard. The standard declares what the program's work means in its domain: axioms, invariants, gates, procedures the program must satisfy. Standards do not run — they are consulted by programs during their work.

**Framework-slot structure.** Every program has a slot for its governing standard. Slots are forced by the program's existence. Inhabitants are selected by Derivation and confirmed by System-L0. A vacant slot is an acknowledged gap — not a structural defect. Current slot inhabitants and acknowledged vacant slots are tracked in Operations.

**Wearer-bypass cases and governance.** The bypass cases declared in Part I (revocation, identity curation, L0 confirmations) do not require domain program standards — they operate under Wearer-L0 authority directly. The governance chain applies to programs; bypass cases are authority-direct operations.

---

## Operations

Process-level reference. Not vision. Does not cascade from the root claim. Amendments here do not require tracing to the root.

### Current slot status

**Filled slots:**

| Program / category | Standard |
|---|---|
| Store | Living Memory v3.2 |
| Boundary | Perimeter Standard v1.1 |
| F-plan | Plan Standard v2.2 |
| F-verify | Verification Standard v1.0 |
| F-discover | Research Standard v1.0 |
| F-builder | Builder Standard v1.0 |
| F-artifact | Artifact Standard v2.2 |
| F-multi-instance | Multi-Instance Standard v2.3 |
| F-design-system | Design Standard v1.0 |
| Code structure (cross-slice) | LIV-Standard v1.5.2 |
| Cross-tree placement | Placement Standard v1.0 |
| Slice category vocabulary | SliceCategory (codified at core/types/slice-category.types.ts; closed-by-derivation, seven values) |
| Derivation (L1) | Metaframework v3.3.1 |

**Acknowledged vacant slots:**

| Program / category | Status |
|---|---|
| Modality (category) | No category-wide standard. Modality programs operate under Perimeter Standard v1.1 rules as interim fallback. Dedicated derivation pending if drift surfaces. |
| Mediator (category) | No category-wide standard. Mediator programs operate under LIV-Standard code-structure governance pending dedicated derivation. |
| F-router | No program-specific standard. Operates under Mediator category fallback. |
| F-intake | No program-specific standard. Operates under Mediator category fallback. |
| F-chat | No program-specific standard. Operates under Modality category fallback. |
| F-output | No program-specific standard. Operates under Modality category fallback. |
| F-admin | No program-specific standard. Operates under Modality category fallback. |
| F-dashboard | No program-specific standard. Operates under Modality category fallback. |
| F-event-system | No governing standard. Pending derivation. |
| F-executor | No governing standard. Pending derivation. |
| F-permissions | No governing standard. Pending derivation. |
| F-ai-adapter | No governing standard. Pending derivation. |
| F-project | No governing standard. Pending derivation. |
| F-user-profile | No governing standard. Pending derivation. |

### Bootstrap mode

The governance loop's steady-state operation — Derivation reading aggregate substrate signal to surface gap candidates — is a structural commitment not yet mechanically implemented. Aggregate-signal-read primitives are post-beta. During bootstrap, System-L0 supplies gap signal directly and orchestrates Derivation manually. The structural commitments of the governance loop hold. The operational path is staged.

### Deployment

**Local:**

1. Receive delivery: `cp ~/Downloads/{delivery}.tar.gz ~/liv-app-v2/`
2. Verify md5 against builder report
3. Apply: `tar xf {delivery}.tar.gz` (overlay) and/or `xargs git rm < DELETE_MANIFEST.txt` (deletions); see dissolution sprint protocol below
4. Build: `npm install && npm run build` — zero errors required
5. Verify expected diffs: `git status` shows the intended set
6. Commit: `git add -A && git commit -m "{sprint-id}: {summary}"`
7. Push: `git push`

**Server:**

1. `ssh root@45.76.29.179`
2. `cd /root/liv-app-v2`
3. `git status` — check drift; discard `peer: true` package-lock.json noise with `git checkout -- package-lock.json` if present
4. `git pull`
5. Apply migrations BEFORE build if present: `sudo -u postgres psql -d liv -f migrations/{NNN}_*.sql`
6. `npm install && npm run build` — zero errors required
7. `pm2 restart liv --update-env` (the `--update-env` flag is mandatory; without it env vars don't refresh)
8. `pm2 logs liv --lines 50 --nostream` (the `--nostream` is mandatory; without it the command tails forever)
9. Verify boot markers per the active build's expected set

**Discipline.** Server commands run one at a time. Output verified before the next command. Chaining commands with `&&` masks failures — a failed `git pull` followed by successful `npm install && npm run build && pm2 restart` produces an old build that pm2 happily restarts. Run, verify, advance.

### Dissolution sprint protocol

Tar overlays structurally cannot carry deletions. Any sprint that dissolves a slice, removes residue, or otherwise deletes existing files requires an explicit DELETE_MANIFEST.txt as a first-class deliverable alongside the tar.

Two-phase deletion:

1. *Git-tracked file deletions* — applied via `xargs git rm < DELETE_MANIFEST.txt`. macOS BSD xargs lacks the `-a` flag; portable form is `xargs CMD < file`.
2. *Empty directories* — git does not track empty directories; `git rm -r` cannot remove them. Apply via `rmdir 'literal-name'` directly at the filesystem level, with single quotes if the directory name contains shell-meaningful characters.

Filesystem-state verification: before applying any directory-shaped manifest entry, run `ls` on the literal path to confirm contents. Brace-literal directory names from prior tar-extraction artifacts read like shell expansion notation but are literal filesystem entries.

### Server rules

Server: `45.76.29.179`. Domain: `livai.dev`. `ALLOWED_EMAILS=demos_ra@hotmail.com`.

Separate server: `144.202.60.185` (ASO-3.0). Out of scope for LIV operations. Do not modify.

### Instance roles

Three Claude instance roles operate the build-and-deploy pipeline:

- **Manager** — reads context, decomposes briefs into items, dispatches to Builder and Auditor. Reviews audit results. Surfaces L0 checkpoints. All L0-interface work is with Manager, not Builder.
- **Builder** — receives a brief, produces a tarball delivery. No manual code changes by Demos; all code arrives as Builder output. Builder produces deliverable plus factual notes only — no audit-claim sections.
- **Auditor** — receives a tarball, audits against brief, vision, and current spec. Produces audit report; does not produce code.

System-L0 (Demos) confirms all framework generation, ratifies all standards, and is the only L0 confirmation point in the loop.

### Audit discipline

Five-check sweep before any "clean" verdict on a delivery:

1. *Type-file delta check* — for every type referenced via `input.X` or `deps.X`, verify the type file declaring it is either in the tar or unchanged at HEAD.
2. *Duplicate identifier sweep* — for every imported identifier across all import blocks in a file, count occurrences. Any duplicate is substitution-not-removal.
3. *Cross-slice violation sweep* — for every `@/features/F-X/...` import outside the slice's own files, verify the import targets `contract/`, `types/`, or `config/` only. Anything pointing to `app/`, `domain/`, or `exec/` is a cross-slice violation.
4. *Dissolved-symbol reference sweep* — `grep -rn` for every dissolved name; expect zero live (non-comment) references.
5. *Filesystem state verification* — for any directory-shaped manifest entry or directory-level operation, run `ls` on the literal path before action. Catches brace-literal-name traps and similar filesystem artifacts.

### Database operations

Database client: `src/core/db/client.ts`. Migrations live alongside the substrate framework. All schema changes route through Living Memory's migration discipline.

### Update protocol

**Amendment constraint.** Any amendment to Parts I–IV must be traceable to the root claim. If an amendment cannot be traced, it is not a Manual amendment — it is a standards amendment, a new standard, or an operational note.

**Five triggers:**

| Trigger | SPEC bump | Scope |
|---|---|---|
| Deploy | Yes | Operations slot status updates; changelog entry |
| Language-only | Yes | Affected sections only; no structural change |
| Vision revision | Yes (major) | Affected parts re-derived; audit required before propagation |
| Backlog-only | No | Backlog artifact only |
| Removal | Yes | Target section removed; redirect note retained |

**Rules:**

*Rule 1 — Cascade discipline.* Every section introduces only what its subject forces. An amendment that introduces a concept in a section other than where it is forced violates cascade discipline.

*Rule 2 — Canonicality follows unique ownership.* A concept has exactly one canonical home. A second declaration of the same concept is drift — remove it and cross-reference the canonical site.

*Rule 3 — Mechanics stay with their concern.* A mechanism belongs in the section that owns its governing concern, not in cross-cutting unless it governs across loops as load-bearing.

*Rule 4 — No historical record in Parts I–IV.* No sprint references, no version history, no "as of Sprint N" qualifications. Parts I–IV state what is structurally true. History belongs in the substrate.

*Rule 5 — Framework templates enter through the backlog.* No standard is created at runtime or by user action outside the backlog. System-L0 confirmation required at every generation.

*Rule 6 — Backlog item structure.* Each backlog item carries: principle (which Manual claim it serves), kind it operates on, dependencies, and state. Items without a principle reference return to idea state.

### Lifecycle sequence

For a standard derivation:

1. Gap identified — System-L0 confirms or surfaces from aggregate signal
2. Backlog item created with principle reference — state: idea
3. Decomposition — brief written, four shapes mapped to delivery steps — state: scoped
4. System-L0 confirmation — state: ready
5. Builder dispatched — state: active
6. Delivery — tarball produced; Auditor reviews against brief and Protocol invariants (L0 intent)
7. Ship — deployed; slot status updated; changelog entry; SPEC bumped — state: shipped

### Migration notes

| v12.x term | v13.0 term | Notes |
|---|---|---|
| Flow (category) | Dissolved | Empirical bucket conflating three structural roles. Inhabitants redistributed: F-router → Mediator, F-intake → Mediator, F-event-system → Tool (event bus utility), F-chat → Modality, F-dashboard → Modality. |
| Cycle (program category) | Generator (program category) | Generator is the category name for the four programs that perform Cycle work. Cycle is the work shape; Generator is the program category. Distinction made explicit so Domain programs that Generators produce do not conflate with the Generators themselves. |
| F-planner | Removed | Three remnant files deleted at sprint-b1-6. |
| F-la-config | Removed | Sixteen files deleted at sprint-b1-6. Migration to F-verify (la-validator destination) was previously complete. |
| Memory loop "flows through" Store | Store as terminal node of memory loop | Store is in the loop, not outside it. Mediator delivers to Store; Mediator reads from Store. |
| F-chat under Perimeter Standard | F-chat is Modality; Modality Standard slot acknowledged vacant; PS as interim fallback | Category governance distinguished from interim governance. PS governs typed/untyped crossing; F-chat governs a wearer-facing channel. Different concerns. |
| Perimeter (kind) | Boundary (program) | Carried from v12.0. Perimeter as a separate element kind dissolved at v12.0. Boundary is a memory loop program whose domain is typed/untyped crossing. |
| Infrastructure | Dissolved | Carried from v12.0. Modality, Mediator, and Tool absorb what was called infrastructure. |
| Cognitive Standard | Dissolved Sprint 8 | Carried from v12.0. Slot vacant; succeeded by Perimeter Standard v1.0.1 governing Boundary. |

---

## Drift checks

Seven diagnostics. Any fires — stop and escalate to System-L0 with: diagnostic triggered + structural claim at issue.

**D1 — Part boundary violation.** A concept introduced in a part other than where it is forced. Examples: artifacts appearing in Part I; Protocol appearing in Part I; invocation appearing in Part II; slot inhabitants appearing in Parts I–IV body text.

**D2 — Store/substrate conflation.** Treating Store and Substrate as the same thing. Store is the program that governs the substrate's mechanics and the terminal node of the memory loop. The substrate is what Store governs and what the memory loop accumulates into. Store is a program; substrate is the foundation. Related but not identical.

**D3 — Generator closure violation.** Claiming a fifth Generator or that one of the four is not fundamental. The four are closed by the five-state ordering's four adjacent transitions. A counterexample requires demonstrating a sixth state in that ordering.

**D4 — Domain enumeration.** Treating the Domain program set as closed. It is open by derivation. Any listed set of Domain programs is a current snapshot, not a structural commitment. The set is currently empty; future arrivals are the wearer's commissioned programs.

**D5 — Vision drift.** Describing LIV as its current implementation rather than what the implementation serves. The root claim is fixed: LIV extends a wearer's cognition across time. Describing LIV as a build tool, chatbot, or task manager is D5.

**D6 — Governance gap.** Any program without a governing standard and without an acknowledged vacant declaration in Operations. Any standard without a traceable derivation path through Derivation. Any slot in an ambiguous state — neither filled nor formally acknowledged vacant.

**D7 — Category conflation.** Treating two distinct program categories as one. Examples: calling Modality and Mediator both "Flow"; calling Generator and Domain the same category; treating Tool as a structural participant in the memory loop rather than as injected utility. Categories are forced by what work each kind of program does; conflation papers over the structural commitments the categories name.

---

## Change log

| Version | Date | Scope |
|---|---|---|
| v11.0 | 2026-05-06 | Prior cascade structure |
| v11.1 | 2026-05-06 | Bootstrap mode acknowledgment; Perimeter Standard v1.0.1 slot filled |
| v11.2 | 2026-05-07 | Placement Standard v1.0 slot created and filled |
| v12.0 | 2026-05-10 | Full rewrite. Vision re-derived from first principles. Three loops. Perimeter dissolved into Boundary (memory loop program). Infrastructure dissolved into Flow and Tool. Five kinds reduced to derivation-order structure. Historical record removed from vision sections. |
| v13.0 | 2026-05-12 | Vision revision. Flow category dissolved (empirical bucket); inhabitants redistributed to Modality (F-chat, F-output, F-admin, F-dashboard), Mediator (F-router, F-intake), and Tool (F-event-system). Cycle programs named Generator as a category, distinct from the Cycle work shape they perform and from Domain programs they produce. Store rewritten as terminal node of memory loop (resolving prior contradiction). Three-loops framing retained; perpendicularity of domain and governance loops named in body and in new top-section framing. Operations expanded: dissolution sprint protocol, 5-check audit sweep, builder/auditor/manager workflow discipline, deploy path corrections, command-chaining discipline. D7 added (category conflation). Slice category vocabulary slot filled (SliceCategory in source). |
| v13.1 | 2026-05-13 | Sprint B1 Shot 6 closure. Part IV authority chain reconciled to ratified chain per substrate v1.8.1 §5.2: L0 Intent, L1 Metaframework (L0 automating L0 work), L2 Standards, L3 Programs. Labels stable (L0/L1/L2/L3 numerics retained); role names attached. Prior "L4 = Programs" framing superseded; programs are L3 governed by L2 standards. Prior "L1 = Protocol slot" framing superseded; Protocol is L0 intent expressed as invariant declarations, not a separate governance tier. Recursion-direction prose at Part IV amended to ratified chain. Operations table swept to Sprint B1 sibling-version state: PS v1.0.1 → v1.1, Metaframework v3.2.7 → v3.3.1, LIV-Standard v1.5.1 → v1.5.2. Operations Derivation row labeled (L1) per amended chain. Deployment section "L1 invariants" reference amended to "Protocol invariants (L0 intent)". Historical succession references at v11.1 Change-log row and Cognitive-Standard migration-notes row retained verbatim (succession-point context preserves PS v1.0.1 as the version at slot-fill / dissolution time). Patch-level governance text amendment per MA-L1. No vision change, no atoms, no schema, no rules, no gates amended. |

---

End of Manual SPEC-v13.1.
