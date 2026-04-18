// @liv-standard v1.5
// [F-codec/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    none
// slice:      F-codec
// layer:      R3
// wires-in:
//   W-ATOM  FrameworkModule, ModuleArtifactSummary  F-codec/R0
//   W-ATOM  ArtifactSchema                          F-codec/R0
// wires-out:  none (leaf UI component)
// deps:
//   R0  ../config/codec-module-types
//   R3  ./framework-artifact-detail
// validated:  pending

// Generic framework program — parameterized by FrameworkModule.
// Renders a list of artifacts for that module's mode.
// One component handles all modules — no per-module component code for beta.

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { FrameworkModule, ModuleArtifactSummary } from '../config/codec-module-types'
import { FrameworkArtifactDetail } from './framework-artifact-detail'

type FrameworkProgramProps = {
  module: FrameworkModule
}

const STATUS_INDICATORS: Record<string, { symbol: string; color: string }> = {
  active:    { symbol: '●', color: 'var(--color-success, #6ec96e)' },
  completed: { symbol: '◆', color: 'var(--color-accent, #6ea8fe)' },
  archived:  { symbol: '○', color: 'var(--color-text-muted, #888)' },
}

const REFRESH_INTERVAL_MS = 30_000

export function FrameworkProgram({ module }: FrameworkProgramProps) {
  const [artifacts, setArtifacts] = useState<ModuleArtifactSummary[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const fetchArtifacts = useCallback(async () => {
    try {
      setStatus('loading')
      const res = await fetch(`/api/modules/${module.mode}/artifacts`)
      const data = await res.json()
      if (data.ok && Array.isArray(data.data)) {
        setArtifacts(data.data)
      }
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }, [module.mode])

  // Initial fetch + refresh interval
  useEffect(() => {
    fetchArtifacts()
    const interval = setInterval(fetchArtifacts, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchArtifacts])

  const selected = selectedId ? artifacts.find(a => a.nodeId === selectedId) : null

  return (
    <div style={{
      fontFamily: 'var(--type-family, inherit)',
      fontSize: 'var(--type-size-sm, 13px)',
      color: 'var(--color-text, #e0e0e0)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-2, 8px) var(--space-3, 12px)',
        borderBottom: '1px solid var(--color-border, #2a2a3a)',
      }}>
        <span style={{ fontSize: 'var(--type-size-base, 14px)', fontWeight: 500 }}>
          {module.label}
        </span>
        <span style={{ fontSize: 'var(--type-size-xs, 11px)', color: 'var(--color-text-muted, #888)' }}>
          {artifacts.length} {artifacts.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Artifact List */}
      {artifacts.length === 0 && status !== 'loading' && (
        <div style={{
          padding: 'var(--space-4, 16px) var(--space-3, 12px)',
          color: 'var(--color-text-muted, #888)',
          fontSize: 'var(--type-size-xs, 11px)',
          textAlign: 'center' as const,
        }}>
          No artifacts yet. Start a conversation to create one.
        </div>
      )}

      {artifacts.map(artifact => {
        const indicator = STATUS_INDICATORS[artifact.status] ?? STATUS_INDICATORS.archived
        const isSelected = artifact.nodeId === selectedId

        return (
          <div key={artifact.nodeId}>
            <button
              onClick={() => setSelectedId(isSelected ? null : artifact.nodeId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2, 8px)',
                width: '100%',
                padding: 'var(--space-2, 8px) var(--space-3, 12px)',
                borderBottom: '1px solid var(--color-border, #2a2a3a)',
                background: isSelected
                  ? 'var(--color-accent-subtle, #2a3a4a)'
                  : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left' as const,
                fontFamily: 'inherit',
                fontSize: 'inherit',
                color: 'inherit',
                transition: `background var(--motion-attack, 80ms) ease`,
              }}
            >
              <span style={{ color: indicator.color, fontSize: '10px', flexShrink: 0 }}>
                {indicator.symbol}
              </span>
              <span style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap' as const,
              }}>
                {artifact.name}
              </span>
              <span style={{
                fontSize: 'var(--type-size-xs, 11px)',
                color: 'var(--color-text-muted, #888)',
                flexShrink: 0,
              }}>
                {new Date(artifact.createdAt).toLocaleDateString()}
              </span>
            </button>

            {/* Expanded detail */}
            {isSelected && selected && (
              <div style={{
                borderBottom: '1px solid var(--color-border, #2a2a3a)',
                background: 'var(--color-bg-muted, #1e1e2e)',
              }}>
                <FrameworkArtifactDetail artifact={selected} module={module} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
