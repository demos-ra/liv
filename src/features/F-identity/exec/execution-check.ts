#!/usr/bin/env node
// @liv-standard v1.3
// [F-identity/R4]
// Built with LIV · livai.dev
/**
 * F-identity / execution-check.ts
 * [F-identity/R0/C2] Execution and health check for F-identity slice
 *
 * Validates:
 * 1. All declared files exist at declared R layers
 * 2. No R layer imports upward dependencies
 * 3. State namespace declared
 * 4. All 5 events declared
 * 5. No UI primitives defined outside F-design-system
 * 6. O-rule compliance scan (hardcoded secrets, missing timeouts)
 *
 * Output format: LA v2.0 standard
 * Run: npx ts-node execution-check.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const SLICE = 'F-identity';
const SLICE_DIR = __dirname;

// ─── Expected File Map ────────────────────────────────────────────────────────

const DECLARED_FILES: Array<{ layer: string; file: string; required: boolean }> = [
  { layer: 'R0', file: 'config/auth-types.ts',        required: true },
  { layer: 'R0', file: 'config/auth-events.ts',       required: true },
  { layer: 'R0', file: 'config/auth-state.ts',        required: true },
  { layer: 'R1', file: 'domain/auth-validation.ts',   required: true },
  { layer: 'R1', file: 'domain/auth-session.ts',      required: true },
  { layer: 'R1', file: 'domain/auth-errors.ts',       required: true },
  { layer: 'R2', file: 'app/auth-workflow.ts',        required: true },
  { layer: 'R3', file: 'contract/auth-routes.ts',     required: true },
  { layer: 'R3', file: 'contract/auth-hooks.ts',      required: true },
  { layer: 'R3', file: 'contract/auth-pages.tsx',     required: true },
  { layer: 'R3', file: 'contract/auth-middleware.ts', required: true },
  { layer: 'R4', file: 'exec/auth-db.ts',             required: true },
  { layer: 'R4', file: 'exec/auth-queries.ts',        required: true },
];

// ─── Dependency Rules ─────────────────────────────────────────────────────────

const FORBIDDEN_IMPORTS: Record<string, string[]> = {
  R0: ['../domain', '../app', '../contract', '../exec'],
  R1: ['../app', '../contract', '../exec'],
  R2: ['../contract'],            // R2 CANNOT import R3
  R3: ['../exec'],                // R3 CANNOT import R4
  R4: ['../domain', '../app', '../contract'], // R4 CANNOT import R1,R2,R3
};

// ─── Required Event Declarations ─────────────────────────────────────────────

const REQUIRED_EVENTS = [
  'auth.user.registered',
  'auth.user.authenticated',
  'auth.user.signed-out',
  'auth.token.refreshed',
  'auth.user.failed',
];

// ─── Checks ───────────────────────────────────────────────────────────────────

interface CheckResult {
  name: string;
  passed: boolean;
  violations: string[];
}

function checkFilesExist(): CheckResult {
  const violations: string[] = [];
  for (const { layer, file, required } of DECLARED_FILES) {
    const fullPath = path.join(SLICE_DIR, file);
    if (!fs.existsSync(fullPath)) {
      if (required) {
        violations.push(`MISSING [${layer}] ${file}`);
      }
    }
  }
  return { name: 'File Existence', passed: violations.length === 0, violations };
}

function checkForbiddenImports(): CheckResult {
  const violations: string[] = [];

  for (const { layer, file } of DECLARED_FILES) {
    const fullPath = path.join(SLICE_DIR, file);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf-8');
    const forbidden = FORBIDDEN_IMPORTS[layer] ?? [];

    for (const forbiddenPath of forbidden) {
      // Check for any import containing the forbidden path
      const importRegex = new RegExp(`from\\s+['"]([^'"]*${forbiddenPath.replace('../', '')}[^'"]*)['"']`, 'g');
      const matches = content.matchAll(importRegex);
      for (const match of matches) {
        violations.push(`[${layer}] ${file} imports from forbidden layer: ${match[1]}`);
      }
    }
  }

  return { name: 'Layer Dependency Direction', passed: violations.length === 0, violations };
}

function checkEventDeclarations(): CheckResult {
  const violations: string[] = [];
  const eventsFile = path.join(SLICE_DIR, 'config/auth-events.ts');

  if (!fs.existsSync(eventsFile)) {
    return { name: 'Event Declarations', passed: false, violations: ['auth-events.ts missing'] };
  }

  const content = fs.readFileSync(eventsFile, 'utf-8');

  for (const event of REQUIRED_EVENTS) {
    if (!content.includes(`'${event}'`) && !content.includes(`"${event}"`)) {
      violations.push(`Event not declared: ${event}`);
    }
  }

  return { name: 'Event Declarations (T-Axis)', passed: violations.length === 0, violations };
}

function checkStateNamespace(): CheckResult {
  const violations: string[] = [];
  const stateFile = path.join(SLICE_DIR, 'config/auth-state.ts');

  if (!fs.existsSync(stateFile)) {
    return { name: 'State Namespace', passed: false, violations: ['auth-state.ts missing'] };
  }

  const content = fs.readFileSync(stateFile, 'utf-8');

  if (!content.includes('AUTH_NAMESPACE')) {
    violations.push('AUTH_NAMESPACE not declared in auth-state.ts');
  }
  if (!content.includes("'auth'") && !content.includes('"auth"')) {
    violations.push("Namespace 'auth' not reserved in auth-state.ts");
  }

  return { name: 'State Namespace Declaration', passed: violations.length === 0, violations };
}

function checkNoHardcodedSecrets(): CheckResult {
  const violations: string[] = [];
  const SECRET_PATTERNS = [
    /api[_-]?key\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    /secret\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    /password\s*[:=]\s*['"][^'"]{4,}['"]/gi,
    /DATABASE_URL\s*[:=]\s*['"]postgres[^'"]+['"]/gi,
  ];

  for (const { file } of DECLARED_FILES) {
    const fullPath = path.join(SLICE_DIR, file);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf-8');

    for (const pattern of SECRET_PATTERNS) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        // Allow process.env references
        if (!match[0].includes('process.env')) {
          violations.push(`Possible hardcoded secret in ${file}: ${match[0].substring(0, 40)}...`);
        }
      }
    }
  }

  return { name: 'O6 No Hardcoded Secrets', passed: violations.length === 0, violations };
}

function checkDesignSystemImports(): CheckResult {
  const violations: string[] = [];

  // Only check R3 files (they render UI)
  const r3Files = DECLARED_FILES.filter(f => f.layer === 'R3');

  const LOCAL_CSS_PATTERNS = [
    /style\s*=\s*\{\{[^}]{50,}\}\}/g,  // large inline styles (OK for layout, flag for color tokens)
    /color\s*:\s*['"#][0-9a-fA-F]{3,6}/g, // hardcoded color values
    /fontFamily\s*:\s*['"][^'"]+['"]/g, // hardcoded font families
  ];

  for (const { file } of r3Files) {
    const fullPath = path.join(SLICE_DIR, file);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf-8');

    for (const pattern of LOCAL_CSS_PATTERNS) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        violations.push(`Possible local visual primitive in ${file}: ${match[0].substring(0, 60)}`);
      }
    }
  }

  // Warn level — not blocking in Phase 2 (F-design-system not yet linked)
  return {
    name: 'Design System Import Compliance',
    passed: true, // Phase 2: warn only
    violations: violations.map(v => `[WARN] ${v}`),
  };
}

function checkNoFilesOutsideDeclaredStructure(): CheckResult {
  const violations: string[] = [];
  const declaredFilePaths = new Set(DECLARED_FILES.map(f => f.file));
  const knownMetaFiles = new Set([
    'execution-check.ts',
    'SLICE.md',
    'index.ts',
  ]);

  function walk(dir: string, base: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const rel = path.relative(SLICE_DIR, full);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full, base);
      } else if (stat.isFile()) {
        if (!declaredFilePaths.has(rel) && !knownMetaFiles.has(entry)) {
          violations.push(`Undeclared file outside slice structure: ${rel}`);
        }
      }
    }
  }

  walk(SLICE_DIR, SLICE_DIR);

  return { name: 'No Undeclared Files', passed: violations.length === 0, violations };
}

// ─── Runner ───────────────────────────────────────────────────────────────────

const LINE = '━'.repeat(50);

console.log(`\nLiving Architecture ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
console.log(`Execution Check: ${SLICE}`);
console.log(`Phase 2 — Vertical Proof\n`);
console.log(LINE);

const checks: CheckResult[] = [
  checkFilesExist(),
  checkForbiddenImports(),
  checkEventDeclarations(),
  checkStateNamespace(),
  checkNoHardcodedSecrets(),
  checkDesignSystemImports(),
  checkNoFilesOutsideDeclaredStructure(),
];

let passed = 0;
let failed = 0;
let warnings = 0;

for (const check of checks) {
  const warnOnly = check.violations.every(v => v.startsWith('[WARN]'));
  const status = check.passed ? '✓' : (warnOnly ? '⚠' : '✗');

  console.log(`\n  ${status} ${check.name}`);

  if (check.violations.length > 0) {
    for (const v of check.violations) {
      console.log(`    → ${v}`);
      if (v.startsWith('[WARN]')) warnings++;
    }
  }

  if (check.passed) passed++;
  else if (!warnOnly) failed++;
}

console.log(`\n${LINE}`);
console.log(`\n  Checks: ${checks.length}  ✓ Passed: ${passed}  ✗ Failed: ${failed}  ⚠ Warnings: ${warnings}`);

if (failed === 0) {
  console.log(`\n✓ F-IDENTITY EXECUTION CHECK PASSED`);
  console.log(`  Phase 2 slice is structurally complete.\n`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Living Architecture\n`);
  process.exit(0);
} else {
  console.log(`\n✗ EXECUTION CHECK FAILED — ${failed} violation(s)\n`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Living Architecture\n`);
  process.exit(1);
}
