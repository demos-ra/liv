// @liv-standard v1.3
// [F-design-system/contract/index.ts]
// Built with LIV · livai.dev
// R3 — canonical export path for design system tokens and motion constants.
// All slices import runtime tokens from here.
// CSS variables live in globals.css — imported once in layout.tsx.
// DesignSystemProvider lives in exec/ (R4, DOM access) — layout.tsx imports directly.

export * from '../config'
export { TIMING, CURVES, Z } from '../domain'
