// [F-la-config/exec/la-validator.ts]
// R4 — LA integrity validator. CLI tool only.
// Run manually: npx ts-node src/features/F-la-config/exec/la-validator.ts
// Or in CI. Never imported at runtime.

import * as fs from 'fs'
import * as path from 'path'

const ROOT = path.join(__dirname, '../../../../')
const FEATURES = path.join(ROOT, 'src/features')
const F_TAGS = path.join(__dirname, '../config/f-tags.json')
const EVENT_SCHEMA = path.join(ROOT, 'src/features/F-event-system/config/event-schema.ts')

type CheckResult = { name: string; passed: boolean; violations: string[] }
const results: CheckResult[] = []

function check(name: string, fn: () => string[]): void {
  const violations = fn()
  results.push({ name, passed: violations.length === 0, violations })
}

// 1. All declared slices exist in features/
check('All declared slices present in features/', () => {
  const { declared_slices } = JSON.parse(fs.readFileSync(F_TAGS, 'utf8'))
  return declared_slices.filter((slice: string) =>
    !fs.existsSync(path.join(FEATURES, slice))
  ).map((s: string) => `Missing: ${s}`)
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
  return violations
})

// 3. No stale flat imports
check('No stale flat imports (@/config, @/domain, @/exec, @/lib)', () => {
  const violations: string[] = []
  const stale = ["from '@/config/", "from '@/domain/", "from '@/exec/", "from '@/lib/", "from '@/shared/"]
  walkTs(path.join(ROOT, 'src'), (filePath, content) => {
    for (const pattern of stale) {
      if (content.includes(pattern)) {
        violations.push(`${shortPath(filePath)}: stale import '${pattern}'`)
      }
    }
  })
  return violations
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
  return violations
})

// ─── Output ───────────────────────────────────────────────────────────────────

console.log('\nLIV — Living Architecture Validator')
console.log('════════════════════════════════════\n')

let passed = 0, failed = 0
for (const r of results) {
  if (r.passed) { console.log(`  ✓ ${r.name}`); passed++ }
  else {
    console.log(`  ✗ ${r.name}`)
    r.violations.forEach(v => console.log(`      — ${v}`))
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
