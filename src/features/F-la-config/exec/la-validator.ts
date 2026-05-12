// @liv-standard v1.5.1
// [F-la-config/R4]
// Built with LIV · livai.dev
// [F-la-config/exec/la-validator.ts]
// R4 — LA integrity validator. CLI tool only.
// Run manually: npx tsx src/features/F-la-config/exec/la-validator.ts
// Or in CI. Never imported at runtime.
//
// Sprint 9 Shot 1 — Placement Standard inversion (Stream A):
//   Check #6 rewritten from registry-lookup to walk-tree-and-join (PL-A1..PL-A6 inverted).
//   Registry constant (PLACEMENT_REGISTRY) dissolved; validator now walks the tree,
//   reads self-declared kind+placement from each file, and reports drift.
//   Undeclared items are reported as notes (not hard-fail) per brief §A.2.
//
// w5-item-6.7 (A2, A3, A7):
//   Check #5: CC.18 — cross-slice imports via @/features/ must target
//   R0 (types/) or R3 (contract/) only. Codifies A2/A3 mechanically.
//   One function — remove it and validator runs without it (A7).

import * as fs from 'fs'
import * as path from 'path'

const ROOT = path.join(__dirname, '../../../../')
const FEATURES = path.join(ROOT, 'src/features')
const F_TAGS = path.join(__dirname, '../config/f-tags.json')

type CheckResult = { name: string; passed: boolean; violations: string[]; notes?: string[] }
const results: CheckResult[] = []

function check(name: string, fn: () => { violations: string[]; notes?: string[] }): void {
  const { violations, notes } = fn()
  results.push({ name, passed: violations.length === 0, violations, notes })
}

// 1. All declared slices exist in features/
check('All declared slices present in features/', () => {
  const { declared_slices } = JSON.parse(fs.readFileSync(F_TAGS, 'utf8'))
  const violations = declared_slices.filter((slice: string) =>
    !fs.existsSync(path.join(FEATURES, slice))
  ).map((s: string) => `Missing: ${s}`)
  return { violations }
})

// 2. No R4 cross-slice imports
check('No R4 cross-slice imports', () => {
  const violations: string[] = []
  walkTs(FEATURES, (filePath, content) => {
    if (!filePath.includes('/contract/') && !filePath.includes('/app/')) return
    const matches = content.matchAll(/from '@\/features\/(F-[^']+)\/exec\//g)
    for (const m of matches) {
      const importingSlice = filePath.split('/features/')[1]?.split('/')[0]
      if (importingSlice && !filePath.includes(`/features/${m[1]}/`)) {
        violations.push(`${shortPath(filePath)} imports cross-slice exec from ${m[1]}`)
      }
    }
  })
  return { violations }
})

// 3. No stale flat imports
check('No stale flat imports (@/config, @/domain, @/exec, @/lib)', () => {
  const violations: string[] = []
  const stale = ["from '@/config/", "from '@/domain/", "from '@/exec/", "from '@/lib/", "from '@/shared/"]
  const SELF = path.join(ROOT, 'src/features/F-la-config/exec/la-validator.ts')
  walkTs(path.join(ROOT, 'src'), (filePath, content) => {
    if (filePath === SELF) return
    for (const pattern of stale) {
      if (content.includes(pattern)) {
        violations.push(`${shortPath(filePath)}: stale import '${pattern}'`)
      }
    }
  })
  return { violations }
})

// 4. All declared slices have required layers
check('All slices have domain/, contract/, exec/', () => {
  const { declared_slices, completeness } = JSON.parse(fs.readFileSync(F_TAGS, 'utf8'))
  const exceptions = Object.keys(completeness.exceptions || {})
  const violations: string[] = []
  for (const slice of declared_slices) {
    if (exceptions.includes(slice)) continue
    for (const layer of ['domain', 'contract', 'exec']) {
      if (!fs.existsSync(path.join(FEATURES, slice, layer))) {
        violations.push(`${slice} missing ${layer}/`)
      }
    }
  }
  return { violations }
})

// 5. CC.18: Cross-slice imports target R0 or R3 only
check('CC.18: Cross-slice imports target R0 or R3 only', () => {
  const violations: string[] = []
  walkTs(FEATURES, (filePath, content) => {
    const importingSlice = filePath.split('/features/')[1]?.split('/')[0]
    if (!importingSlice) return

    const matches = content.matchAll(
      /from '@\/features\/(F-[^']+)\/(types|domain|app|exec|config|contract)\/[^']*'/g
    )

    for (const m of matches) {
      const targetSlice = m[1]
      const targetLayer = m[2]

      if (targetSlice === importingSlice) continue  // intra-slice OK
      if (targetLayer === 'types') continue          // R0 OK
      if (targetLayer === 'contract') continue       // R3 OK

      violations.push(
        `${shortPath(filePath)} imports cross-slice ${targetLayer}/ from ${targetSlice}`
      )
    }
  })
  return { violations }
})

// 6. Placement Standard inversion — walk-tree-and-join (Sprint 9 Shot 1)
//    Replaces §1.20.1 strict-registry-consultation check.
//    PL-A1 (inverted): each LIV-shaped artifact declares its own kind + placement inline.
//    PL-A2 (inverted): filesystem is authoritative for position; declared placement
//      must match actual filesystem location.
//    PL-A3: PlacementItemKind enum membership enforced at declaration site.
//
//    Walk src/, frameworks/, sprint-records/. For each file:
//      - Read self-declared @kind and @placement (TS/MJS/SH: comment fields; MD: YAML frontmatter)
//      - Verify declared kind is in PlacementItemKind enum
//      - Verify declared placement matches actual filesystem location
//    Undeclared items → reported as notes (not hard-fail) per brief §A.2.
//    Drift = mismatch between declared and observed.
check('Placement Standard: self-declared kind+placement matches filesystem (inverted PL-A1..PL-A3)', () => {
  const violations: string[] = []
  const notes: string[] = []

  const VALID_KINDS = new Set([
    'framework',
    'cycle-record',
    'typed-runtime-projectroot',
    'build-config',
    'platform-tooling',
  ])

  const WALK_ROOTS = [
    path.join(ROOT, 'src'),
    path.join(ROOT, 'frameworks'),
    path.join(ROOT, 'sprint-records'),
  ]

  const SKIP_DIRS = new Set(['node_modules', '.git', '.next', '__pycache__'])
  const SKIP_FILES = new Set([
    'package.json',        // Decision-D-JSON: no comment mechanism in JSON
    'package-lock.json',   // Decision-D-JSON
    'tsconfig.json',       // Decision-D-JSON
  ])

  function walkAll(dir: string, fn: (filePath: string) => void): void {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SKIP_DIRS.has(entry.name)) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walkAll(full, fn)
      } else if (entry.isFile()) {
        fn(full)
      }
    }
  }

  const ROOT_FILES = [
    path.join(ROOT, 'proxy.ts'),
    path.join(ROOT, '.gitignore'),
    path.join(ROOT, 'README.md'),
    path.join(ROOT, 'eslint.config.mjs'),
    path.join(ROOT, 'next.config.ts'),
    path.join(ROOT, 'postcss.config.mjs'),
  ]

  function readDeclaration(filePath: string): { kind: string | null; placement: string | null } {
    const ext = path.extname(filePath)
    const basename = path.basename(filePath)

    if (SKIP_FILES.has(basename)) return { kind: null, placement: null }

    try {
      const content = fs.readFileSync(filePath, 'utf8')

      if (ext === '.md') {
        const fm = content.match(/^---\n([\s\S]*?)\n---/)
        if (!fm) return { kind: null, placement: null }
        const kindMatch = fm[1].match(/^kind:\s*(.+)$/m)
        const placementMatch = fm[1].match(/^placement:\s*(.+)$/m)
        return {
          kind: kindMatch ? kindMatch[1].trim() : null,
          placement: placementMatch ? placementMatch[1].trim() : null,
        }
      } else if (ext === '.ts' || ext === '.tsx' || ext === '.mjs') {
        const kindMatch = content.match(/^\/\/ @kind (.+)$/m)
        const placementMatch = content.match(/^\/\/ @placement (.+)$/m)
        return {
          kind: kindMatch ? kindMatch[1].trim() : null,
          placement: placementMatch ? placementMatch[1].trim() : null,
        }
      } else if (ext === '.sh' || basename === '.gitignore') {
        const kindMatch = content.match(/^# @kind (.+)$/m)
        const placementMatch = content.match(/^# @placement (.+)$/m)
        return {
          kind: kindMatch ? kindMatch[1].trim() : null,
          placement: placementMatch ? placementMatch[1].trim() : null,
        }
      }
    } catch {
      // unreadable — treat as undeclared
    }
    return { kind: null, placement: null }
  }

  function checkFile(filePath: string): void {
    const rel = path.relative(ROOT, filePath)
    const { kind, placement } = readDeclaration(filePath)

    if (kind === null && placement === null) {
      notes.push(`undeclared: ${rel}`)
      return
    }

    if (kind !== null && !VALID_KINDS.has(kind)) {
      violations.push(`${rel}: declared kind '${kind}' not in PlacementItemKind enum`)
    }

    if (placement !== null) {
      const actualDir = path.relative(ROOT, path.dirname(filePath))
      const normalizedDeclared = placement.replace(/\/$/, '').replace(/\\/g, '/')
      const normalizedActual = actualDir.replace(/\\/g, '/') || '.'

      if (normalizedDeclared !== normalizedActual) {
        const declaredIsRoot = normalizedDeclared === '.' || normalizedDeclared === ''
        const actualIsRoot = normalizedActual === '.' || normalizedActual === ''
        if (!(declaredIsRoot && actualIsRoot)) {
          violations.push(
            `${rel}: declared placement '${normalizedDeclared}' != actual '${normalizedActual}'`
          )
        }
      }
    }
  }

  for (const root of WALK_ROOTS) {
    walkAll(root, checkFile)
  }
  for (const f of ROOT_FILES) {
    if (fs.existsSync(f)) checkFile(f)
  }

  return { violations, notes }
})

// ─── Output ───────────────────────────────────────────────────────────────────

console.log('\nLIV — Living Architecture Validator')
console.log('════════════════════════════════════\n')

let passed = 0, failed = 0
for (const r of results) {
  if (r.passed) {
    console.log(`  ✓ ${r.name}`)
    if (r.notes && r.notes.length > 0) {
      console.log(`    (${r.notes.length} undeclared items — notes only, not violations)`)
    }
    passed++
  } else {
    console.log(`  ✗ ${r.name}`)
    r.violations.forEach(v => console.log(`      — ${v}`))
    if (r.notes && r.notes.length > 0) {
      console.log(`    (${r.notes.length} undeclared items — notes only)`)
    }
    failed++
  }
}

console.log(`\n  ${passed} passed, ${failed} failed`)
console.log(failed === 0 ? '\n  ✓ ALL CHECKS PASSED\n' : '\n  ✗ FIX VIOLATIONS BEFORE SHIPPING\n')
if (failed > 0) process.exit(1)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function walkTs(dir: string, fn: (filePath: string, content: string) => void): void {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && !['node_modules', '.git', '.next'].includes(entry.name)) {
      walkTs(full, fn)
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      fn(full, fs.readFileSync(full, 'utf8'))
    }
  }
}

function shortPath(p: string): string {
  return p.split('/src/')[1] ?? p
}
