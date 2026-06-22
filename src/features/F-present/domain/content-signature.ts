// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-finalization)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/content-signature.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    Wing-B B1 (syntax-signature witness table + content-class routing — NET-NEW).
//             A channel-blind classifier over RAW TEXT: it reads only the text's own bytes,
//             never the channel and never a platform. It names a span's RENDERING CLASS —
//             prose vs. a block (code/data/scaffold/payload) — by the syntax signatures the
//             renderers leave behind (md fences/pipes/quotes; terminal box/ANSI), named by
//             rendering class, NEVER by platform.
//             E3 REWORK (block + payload are first-class CELLS, not marks on a leading word):
//             this file is now the home of THREE engine-side helpers the cut+gate consult —
//               · shapeAwareCut(text)   — the engine's shape-aware step: run F-memory's dumb
//                 cutCells, then COALESCE each block/payload REGION into ONE RawWord cell whose
//                 `word` is the region's verbatim text (a payload-cell's word IS the livbyte://
//                 handle). Positions re-number contiguous 1..N; joinCells∘shapeAwareCut === text
//                 still holds (the coalesced word is a byte-exact slice of the original).
//               · classOfCell(cell)     — re-derive a cell's RenderClass from its OWN content
//                 (E2, never a field on RawWord). A multi-line/single-line region collapses to one
//                 cell; this reads that cell back to its class.
//               · isHomeCapableCell(cell) — the WIDENED home-gate: a word-cell OR a block/payload
//                 cell is home-capable. Determined by classOfCell (E2), NO atom field. Pure
//                 chrome (a block-cell with no inner word, e.g. a box rule) is not home-capable.
//             A block/payload-cell homes at its OWN coordinate (the cell's pos), NOT a leading
//             word — that collision (the old routeBlockIdentities `{surface: lead.word}`) welded a
//             block into a word and broke object-identity; it is REMOVED. The frozen S1 contract is
//             UNTOUCHED: SpanMark/Ref/the mark set are unchanged. No new atom kind, no new Ref form.
// slice:      F-present
// layer:      R1
// wires-in:
//   W-ATOM  RawWord                          @/core/types/substrate-raw.types  (type-only — the cut stream)
//   W-FN    cutCells / isWordCell            @/features/F-memory/contract/substrate-contract  (the dumb cut + cell-class predicate)
// wires-out:
//   W-FN    classifyLine / classifyBlocks    →  ../app/scored-turn-recorder (R2 — routing intake), tests
//   W-FN    shapeAwareCut / classOfCell / isHomeCapableCell  →  ../domain/coin-score (R1), ../app/scored-turn-recorder (R2), tests
//   W-ATOM  RenderClass / SignatureWitness   →  ../app/scored-turn-recorder (R2), ../domain/coin-score (routing peer)
//   W-FN    SIGNATURE_TABLE                  →  tests (the witness table, surfaced for the corpus)
// deps:
//   R0  @/core/types/substrate-raw.types
//   R3  @/features/F-memory/contract/substrate-contract
//
// ─────────────────────────────────────────────────────────────────────────────
// THE SYNTAX-SIGNATURE WITNESS TABLE (M5 — two arms; detection is CHANNEL-BLIND).
//
// A renderer (markdown processor, terminal) leaves a SIGNATURE in the text: a fence
// row, a pipe-table row, a blockquote, a terminal box rule or an ANSI escape. The
// classifier reads ONLY those signatures off the raw text — it never asks where the
// text came from (no channel, no platform). Each witness is named by its RENDERING
// CLASS ('md-fence', 'box-rule'), never by platform ('github', 'iterm') — the same
// fence row reads the same whether it came from a chat client or a terminal.
//
// THE CONTRACT IT FEEDS (M4 — the route): a line that carries a block signature is a
// BLOCK line; a run of block lines (a fenced region, a contiguous table, a quote run)
// is ONE block — it routes to a single block object-identity (S1: named span marked
// `identity`, homed at the block's appearance coordinate). Prose lines route to the
// existing word-identity path (named spans on words). This file is a PURE classifier
// and a PURE router-helper; it writes nothing and resolves no coordinate (the home
// resolution stays in coin-score's locate-by-name and the recorder).
//
// Regexes are built with new RegExp(...) from plain strings, by code point where the
// pattern needs a non-ASCII range — so no regex-literal escaping can inject a control
// byte into the source. Each pattern is named and tested in content-signature.test.ts.
// ─────────────────────────────────────────────────────────────────────────────

import type { RawWord } from '@/core/types/substrate-raw.types'
import { cutCells, isWordCell } from '@/features/F-memory/contract/substrate-contract'

// The rendering class a line/region carries. 'prose' routes word-by-word (the existing
// named-span contract); the four block classes route to ONE block object-identity.
//   code     — a fenced code region, an indented code block
//   data     — a pipe table row, a quoted (blockquote) region, a structured row
//   scaffold — a terminal box rule / ANSI-framed region (rendering chrome)
//   payload  — a bare reference to a byte-store object (image/video/audio/file) — the
//              B2 hand-off; detected here so the router sends it down the payload arm.
// 'prose' is the default — text that carries NO block signature.
export type RenderClass = 'prose' | 'code' | 'data' | 'scaffold' | 'payload'

// Is this a BLOCK class (routes to ONE block object-identity) rather than prose?
export function isBlockClass(c: RenderClass): boolean {
  return c !== 'prose'
}

// One witness: a named syntax signature, its rendering class, and the test that
// recognizes it on a single line of raw text. `name` is the RENDERING CLASS noun
// (never a platform). `fenced` marks a witness that OPENS/CLOSES a multi-line region
// (a fence toggles a region on/off); non-fenced witnesses classify their own line only.
export type SignatureWitness = {
  name:   string         // rendering-class noun: 'md-fence', 'pipe-table', 'blockquote', 'box-rule', 'ansi', 'payload-ref'
  class:  RenderClass
  fenced: boolean        // true → this line toggles a fenced region (the region's lines are all this class)
  test:   (line: string) => boolean
}

// ── THE WITNESS PATTERNS — built from strings via RegExp (control-char-clean) ──
const RE_FENCE     = new RegExp('^\\s*(```|~~~)')                          // md fenced code (toggles a region)
const RE_BOX_DRAW  = new RegExp('[\\u2500-\\u257F\\u2580-\\u259F]')        // box-drawing + block-element chars (terminal chrome)
const RE_ANSI      = new RegExp('\\u001b\\[[0-9;]*[A-Za-z]|\\[[0-9;]+m')   // CSI/SGR escape — with the ESC byte, or a bare `[..m` code
const RE_PIPE_ROW  = new RegExp('^\\s*\\|.*\\|\\s*$')                      // md pipe-table row (bounded by |)
const RE_PIPE_CNT  = new RegExp('\\|', 'g')                                // count the pipes (≥2 segments)
const RE_QUOTE     = new RegExp('^\\s*>+\\s?')                             // md blockquote
const RE_MD_IMAGE  = new RegExp('!\\[[^\\]]*\\]\\([^)]+\\)')               // md image/embed ![alt](ref)
const RE_HANDLE    = new RegExp('\\blivbyte://\\S+')                       // bare store handle (B2 hand-off)

// ── THE WITNESS TABLE — channel-blind, rendering-class names only ──────────────
// Order matters only for reporting which witness fired first; classification is a
// first-match scan. Every test reads the raw LINE; none reads a channel or platform.
export const SIGNATURE_TABLE: readonly SignatureWitness[] = [
  // md fenced code — ``` or ~~~ (optionally with an info string). Toggles a region.
  { name: 'md-fence', class: 'code', fenced: true, test: (l) => RE_FENCE.test(l) },
  // terminal box rule — corner/edge box-drawing run. Scaffold = rendering chrome.
  { name: 'box-rule', class: 'scaffold', fenced: false, test: (l) => RE_BOX_DRAW.test(l) },
  // ANSI escape (CSI / SGR) — terminal styling chrome. Scaffold, channel-blind.
  { name: 'ansi', class: 'scaffold', fenced: false, test: (l) => RE_ANSI.test(l) },
  // md pipe table row — a line bounded by | with >=2 segments (| a | b |). Data.
  { name: 'pipe-table', class: 'data', fenced: false, test: (l) => RE_PIPE_ROW.test(l) && (l.match(RE_PIPE_CNT)?.length ?? 0) >= 2 },
  // md blockquote — a leading > (one or more). A quoted block, lifted verbatim. Data.
  { name: 'blockquote', class: 'data', fenced: false, test: (l) => RE_QUOTE.test(l) },
  // payload reference (B2 hand-off) — a md image/embed or a bare livbyte:// handle.
  // Routes down the payload arm; handle resolution is B2 (F-payload-store). Channel-blind.
  { name: 'payload-ref', class: 'payload', fenced: false, test: (l) => RE_MD_IMAGE.test(l) || RE_HANDLE.test(l) },
] as const

// Classify ONE line by the first witness that fires; 'prose' if none does. The
// returned witness `name` is the rendering class that fired (for reporting/tests).
export function classifyLine(line: string): { class: RenderClass; witness: string | null } {
  for (const w of SIGNATURE_TABLE) {
    if (w.test(line)) return { class: w.class, witness: w.name }
  }
  return { class: 'prose', witness: null }
}

// A classified region of the original text: a contiguous run of lines sharing a
// rendering class. `startLine`/`endLine` are 0-based indices into the source line array
// (inclusive range). A 'prose' region routes word-by-word; a block region routes to ONE
// block object-identity homed at the region's first line.
export type ClassifiedRegion = { class: RenderClass; witness: string | null; startLine: number; endLine: number }

// ── classifyBlocks — the routing pass (M4) over a whole text ──────────────────
// Split text into lines, classify each, and COALESCE: a fenced witness opens a region
// whose every line is the fence's class until the closing fence; outside a fence,
// contiguous same-class lines coalesce into one region. The result is the route: each
// block region → one block object-identity; each prose region → the word path.
//
// Channel-blind throughout — only line text is read. Fenced regions take precedence (a
// pipe inside a code fence is code, not data) because the fence toggle is checked first
// and suppresses per-line classification while the fence is open.
export function classifyBlocks(text: string): ClassifiedRegion[] {
  const lines = text.split('\n')
  const regions: ClassifiedRegion[] = []
  let inFence = false
  let fenceClass: RenderClass = 'code'
  let fenceWitness: string | null = null

  const push = (cls: RenderClass, wit: string | null, i: number) => {
    const last = regions[regions.length - 1]
    if (last && last.class === cls && last.endLine === i - 1 && last.witness === wit) {
      last.endLine = i   // extend the open run
    } else {
      regions.push({ class: cls, witness: wit, startLine: i, endLine: i })
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fenceFired = SIGNATURE_TABLE.find(w => w.fenced && w.test(line))
    if (fenceFired) {
      if (!inFence) {
        inFence = true; fenceClass = fenceFired.class; fenceWitness = fenceFired.name
        push(fenceClass, fenceWitness, i)            // the opening fence line is part of the region
      } else {
        push(fenceClass, fenceWitness, i)            // the closing fence line closes the region
        inFence = false
      }
      continue
    }
    if (inFence) { push(fenceClass, fenceWitness, i); continue }
    const { class: cls, witness } = classifyLine(line)
    push(cls, witness, i)
  }
  return regions
}

// ─────────────────────────────────────────────────────────────────────────────
// THE SHAPE-AWARE CUT (E3 — the engine's shape step on top of F-memory's dumb cut).
//
// F-memory's cutCells stays deliberately DUMB (word/space/punct) — it never learns
// shape. The SHAPE awareness lives HERE, in the engine: after the dumb cut, COALESCE
// each block/payload REGION into ONE cell whose `word` is the region's verbatim text,
// then re-number 1..N contiguous. A block-cell and a payload-cell are then the SAME
// citizen as a word-cell, larger — a RawWord at its own {pos} (who+sc are added at
// write time), home-capable, read through the same cell-agnostic path.
//
// ROUND-TRIP: the coalesced cell's `word` is a BYTE-EXACT slice of the original text
// (computed from line offsets, newlines included between coalesced lines), and prose
// regions are cut by the same dumb cutter over their own slice — so
//   joinCells(shapeAwareCut(t)) === t   for all t   (verifyGrid holds: 1..N, no gap/dup).
// ─────────────────────────────────────────────────────────────────────────────

// The [start,end) character offset of each line in `text` (lines split on '\n'); the
// trailing '\n' after a line (if any) is the single byte BETWEEN this line's end and the
// next line's start, so a region slice [firstLineStart, lastLineEnd) carries every inner
// newline verbatim. Pure arithmetic over the same split classifyBlocks uses.
function lineOffsets(text: string): { start: number; end: number }[] {
  const lines = text.split('\n')
  const offs: { start: number; end: number }[] = []
  let cursor = 0
  for (let i = 0; i < lines.length; i++) {
    const start = cursor
    const end = start + lines[i].length
    offs.push({ start, end })
    cursor = end + 1   // skip the '\n' that split removed
  }
  return offs
}

// shapeAwareCut — the engine's cut. Dumb cut first (so the cutter owns the cell↔text
// boundary), then coalesce each BLOCK/PAYLOAD region into ONE cell of verbatim region
// text; prose regions keep their dumb word/space/punct cells. The '\n' separators that
// sit BETWEEN a coalesced region and the next region are emitted as their own whitespace
// cells (verbatim), so concatenation reproduces the original byte-for-byte. Positions are
// renumbered 1..N at the end. Reads only the text; resolves no substrate coordinate.
export function shapeAwareCut(text: string): RawWord[] {
  if (text.length === 0) return []
  const offs = lineOffsets(text)
  const regions = classifyBlocks(text)
  const out: RawWord[] = []
  let prev = 0   // char offset of the next not-yet-emitted byte

  for (const region of regions) {
    const regStart = offs[region.startLine].start
    const regEnd = offs[region.endLine].end
    // Emit the verbatim separator (newline(s)) between the previous region and this one as
    // a lone whitespace cell, so no byte is dropped (the dumb cut would have made these too).
    if (regStart > prev) out.push({ pos: 0, word: text.slice(prev, regStart) })
    const regionText = text.slice(regStart, regEnd)
    if (isBlockClass(region.class)) {
      out.push({ pos: 0, word: regionText })   // ONE block/payload cell — verbatim region text
    } else {
      for (const c of cutCells(regionText)) out.push({ pos: 0, word: c.word })   // prose: dumb cells
    }
    prev = regEnd
  }
  // Any trailing bytes (a final '\n' after the last region) — verbatim whitespace cell.
  if (prev < text.length) out.push({ pos: 0, word: text.slice(prev) })

  return out.map((c, i) => ({ pos: i + 1, word: c.word }))   // renumber 1..N contiguous
}

// ── classOfCell — re-derive a cell's RenderClass from its OWN content (E2, no field) ──
// A coalesced cell collapses a whole region to one `word`; this reads it back to its class
// by classifying over the cell's own text (the same witness table). A single-line cell
// classifies by classifyLine; a multi-line cell (a fenced/contiguous region) classifies by
// classifyBlocks and takes its first non-prose region's class (the shape that coalesced it).
// NEVER a field on RawWord — the class is always re-derivable from content. Channel-blind.
export function classOfCell(cell: RawWord): RenderClass {
  if (cell.word.indexOf('\n') === -1) return classifyLine(cell.word).class
  for (const r of classifyBlocks(cell.word)) if (isBlockClass(r.class)) return r.class
  return 'prose'
}

// ── isHomeCapableCell — THE WIDENED HOME-GATE (E3) ─────────────────────────────
// Today's gate is isWordCell (per-cell first char). The gate WIDENS: a block/payload cell
// is home-capable too — an object-identity sits on it at its own coordinate. Capability is
// determined by classOfCell (E2, re-derivable from content), NOT a field on the atom:
//   · a word-cell (prose)                         → home-capable (the existing path)
//   · a block/payload cell with an inner word     → home-capable (a first-class object)
//   · pure chrome (a block-cell with NO word at all, e.g. a bare box rule) → NOT home-capable
//     (nothing to name; it renders as structure — the render flag is Present-Standard debt ★)
// Pure: reads only the cell's own content. NO atom field is added or read.
export function isHomeCapableCell(cell: RawWord): boolean {
  if (isWordCell(cell.word)) return true                       // a plain word-cell
  const cls = classOfCell(cell)
  if (!isBlockClass(cls)) return false                         // inert whitespace/punct prose cell
  return cutCells(cell.word).some(c => isWordCell(c.word))     // a block/payload cell with an inner word
}
