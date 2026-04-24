// @liv-standard v1.5.1
// [F-codec/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    none
// slice:      F-codec
// layer:      R3
// wires-in:
//   W-ATOM  FrameworkModule, ModuleArtifactSummary, ArtifactSchema, ArtifactField  F-codec/R0
// wires-out:  none (leaf UI component)
// deps:
//   R0  ../config/codec-module-types
// validated:  pending

// Schema-driven artifact detail renderer.
// Iterates module.artifactSchema.fields. No per-module rendering logic.
// Discovery shows: Research question, Axes explored, etc.
// Planning shows: Objectives, Dependencies, etc.
// Builder shows: Feature intent, Pipeline status, Outcome.

'use client'

import type { FrameworkModule, ModuleArtifactSummary } from '../config/codec-module-types'

type FrameworkArtifactDetailProps = {
  artifact: ModuleArtifactSummary
  module:   FrameworkModule
}

export function FrameworkArtifactDetail({ artifact, module }: FrameworkArtifactDetailProps) {
  return (
    <div style={{
      padding: 'var(--space-3, 12px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3, 12px)',
    }}>
      {module.artifactSchema.fields.map(field => {
        const value = artifact.fields[field.key]

        // Optional field with no value — omit entirely
        if (!field.required && (!value || value.trim() === '')) return null

        return (
          <div key={field.key}>
            <div style={{
              fontSize: 'var(--type-size-xs, 11px)',
              color: 'var(--color-text-muted, #888)',
              marginBottom: 'var(--space-1, 4px)',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
            }}>
              {field.label}
            </div>
            <div style={{
              fontSize: 'var(--type-size-sm, 13px)',
              color: 'var(--color-text, #e0e0e0)',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap' as const,
            }}>
              {value && value.trim() !== '' ? value : '(not available)'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
