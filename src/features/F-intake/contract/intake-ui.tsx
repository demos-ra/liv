// @liv-standard v1.3
// [F-intake/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-intake
// layer:      R3
// wires-in:
//   W-HOOK  useIntake   ./intake-hook
//   W-ATOM  IntakeMode  ../types/intake-types
// wires-out:  none  (leaf UI component — no cross-slice consumers)
// deps:
//   R0  ../types/intake-types
//   R3  ./intake-hook
//   R5  react
// validated:  2026-03-12

'use client'

import { useRef, type DragEvent, type ChangeEvent } from 'react'
import { useIntake }                                 from './intake-hook'
import type { IntakeMode }                           from '../types/intake-types'

// ── Pipeline stage indicator ──────────────────────────────────────────────────

const STAGES = ['IN_MAIN', 'IN_BUILD', 'IN_RESOLVE', 'IN_AUDIT', 'IN_COMPILE', 'IN_QA'] as const

function PipelineProgress({ currentStage }: { currentStage: string | null }) {
  if (!currentStage) return null
  const idx = STAGES.indexOf(currentStage as typeof STAGES[number])
  return (
    <div style={{ display: 'flex', gap: 'var(--u1)', alignItems: 'center', marginTop: 'var(--u3)' }}>
      {STAGES.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--u1)', flex: i < STAGES.length - 1 ? 1 : 'none' }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background:   i < idx  ? 'rgba(var(--blue), var(--density-full))'
                        : i === idx ? 'rgba(var(--amber), var(--density-full))'
                        : 'var(--surface)',
            border:      `1px solid ${i <= idx ? 'transparent' : 'var(--text-dis)'}`,
            display:     'flex', alignItems: 'center', justifyContent: 'center',
            fontSize:    10, color: i <= idx ? 'var(--bg)' : 'var(--text-dis)',
            fontFamily:  'var(--font-mono)',
            flexShrink:  0,
            transition:  'background 0.2s ease',
          }}>
            {i < idx ? '✓' : i + 1}
          </div>
          {i < STAGES.length - 1 && (
            <div style={{
              flex: 1, height: 1,
              background: i < idx ? 'rgba(var(--blue), var(--density-full))' : 'var(--text-dis)',
              transition: 'background 0.2s ease',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Mode tab ──────────────────────────────────────────────────────────────────

function ModeTab({ mode, active, onClick, label }: {
  mode: IntakeMode; active: boolean; onClick: () => void; label: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:      'var(--u1) var(--u2)',
        background:   active ? 'var(--surface)' : 'transparent',
        border:       `1px solid ${active ? 'var(--text-dis)' : 'transparent'}`,
        borderRadius: 'var(--radius-surface)',
        color:        active ? 'var(--text)' : 'var(--text-sec)',
        fontSize:     13,
        fontFamily:   'var(--font-ui)',
        cursor:       'pointer',
        transition:   'all 0.1s ease',
      }}
    >
      {label}
    </button>
  )
}

// ── Validation errors ─────────────────────────────────────────────────────────

function ValidationErrors({ errors }: { errors: Array<{ field: string; message: string }> }) {
  if (errors.length === 0) return null
  return (
    <div style={{
      marginTop:    'var(--u2)',
      padding:      'var(--u15) var(--u2)',
      background:   'rgba(var(--red), 0.10)',
      border:       '1px solid rgba(var(--red), 0.30)',
      borderRadius: 'var(--radius-surface)',
      display:      'flex',
      flexDirection: 'column',
      gap:          'var(--u05)',
      animation:    'fadeUp 0.1s ease forwards',
    }}>
      {errors.map((e, i) => (
        <span key={i} style={{ fontSize: 13, color: 'rgba(var(--red), var(--density-full))', fontFamily: 'var(--font-ui)' }}>
          {e.message}
        </span>
      ))}
    </div>
  )
}

// ── Text mode ─────────────────────────────────────────────────────────────────

function TextInput({ text, onChange }: { text: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={text}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      placeholder="Describe what you want to build. Be specific — name the entities, flows, and constraints. The more detail you provide, the better the pipeline can decompose the work."
      style={{
        width:        '100%',
        minHeight:    180,
        padding:      'var(--u2)',
        background:   'var(--surface)',
        border:       '1px solid var(--text-dis)',
        borderRadius: 'var(--radius-surface)',
        color:        'var(--text)',
        fontSize:     14,
        fontFamily:   'var(--font-ui)',
        lineHeight:   1.6,
        resize:       'vertical',
        outline:      'none',
        transition:   'border-color 0.1s ease',
      }}
      onFocus={e => { e.target.style.borderColor = 'rgba(var(--blue), var(--density-full))' }}
      onBlur={e  => { e.target.style.borderColor = 'var(--text-dis)' }}
    />
  )
}

// ── Zip mode ──────────────────────────────────────────────────────────────────

function ZipInput({
  fileName,
  fileSize,
  onLoad,
  onClear,
}: {
  fileName: string | null
  fileSize: number | null
  onLoad:   (f: File) => void
  onClear:  () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onLoad(file)
  }

  if (fileName) {
    return (
      <div style={{
        padding:      'var(--u2)',
        background:   'var(--surface)',
        border:       '1px solid var(--text-dis)',
        borderRadius: 'var(--radius-surface)',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'space-between',
        animation:    'fadeUp 0.1s ease forwards',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>
            {fileName}
          </span>
          {fileSize !== null && (
            <span style={{ fontSize: 12, color: 'var(--text-sec)', fontFamily: 'var(--font-mono)' }}>
              {(fileSize / 1024).toFixed(1)} KB
            </span>
          )}
        </div>
        <button
          onClick={onClear}
          style={{
            padding:      'var(--u05) var(--u15)',
            background:   'transparent',
            border:       '1px solid var(--text-dis)',
            borderRadius: 'var(--radius-surface)',
            color:        'var(--text-sec)',
            fontSize:     12,
            fontFamily:   'var(--font-ui)',
            cursor:       'pointer',
          }}
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        minHeight:    120,
        padding:      'var(--u3)',
        background:   'var(--surface)',
        border:       '1px dashed var(--text-dis)',
        borderRadius: 'var(--radius-surface)',
        display:      'flex',
        flexDirection: 'column',
        alignItems:   'center',
        justifyContent: 'center',
        gap:          'var(--u1)',
        cursor:       'pointer',
        transition:   'border-color 0.1s ease, background 0.1s ease',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(var(--blue), var(--density-full))'
        ;(e.currentTarget as HTMLDivElement).style.background  = 'var(--surface)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--text-dis)'
        ;(e.currentTarget as HTMLDivElement).style.background  = 'var(--surface)'
      }}
    >
      <span style={{ fontSize: 22 }}>⊕</span>
      <span style={{ fontSize: 13, color: 'var(--text-sec)', fontFamily: 'var(--font-ui)' }}>
        Drop a .zip archive or click to browse
      </span>
      <span style={{ fontSize: 11, color: 'var(--text-dis)', fontFamily: 'var(--font-mono)' }}>
        max 50 MB
      </span>
      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onLoad(f) }}
      />
    </div>
  )
}

// ── Git mode ──────────────────────────────────────────────────────────────────

function GitInput({
  gitUrl, gitBranch,
  onUrlChange, onBranchChange,
}: {
  gitUrl:         string
  gitBranch:      string
  onUrlChange:    (v: string) => void
  onBranchChange: (v: string) => void
}) {
  const inputStyle = {
    width:        '100%',
    padding:      'var(--u15) var(--u2)',
    background:   'var(--surface)',
    border:       '1px solid var(--text-dis)',
    borderRadius: 'var(--radius-surface)',
    color:        'var(--text)',
    fontSize:     14,
    fontFamily:   'var(--font-mono)',
    outline:      'none',
    transition:   'border-color 0.1s ease',
  }
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(var(--blue), var(--density-full))'
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--text-dis)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u15)' }}>
      <input
        type="text"
        value={gitUrl}
        onChange={e => onUrlChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="https://github.com/org/repo  or  git@github.com:org/repo"
        style={inputStyle}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u15)' }}>
        <span style={{
          fontSize: 12, color: 'var(--text-sec)',
          fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
        }}>
          branch
        </span>
        <input
          type="text"
          value={gitBranch}
          onChange={e => onBranchChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="main"
          style={{ ...inputStyle, flex: 1 }}
        />
      </div>
    </div>
  )
}

// ── Root component ────────────────────────────────────────────────────────────

export function IntakePanel() {
  const {
    state, setMode, setText, setGitUrl, setGitBranch,
    loadZip, clearZip, submit, canSubmit,
    pipelineStatus, pipelineError,
  } = useIntake()

  const isRunning = pipelineStatus === 'loading'
  const job       = null  // placeholder — planner hook exposes .job once submitted

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      gap:           'var(--u25)',
      padding:       'var(--u4)',
      maxWidth:      640,
      width:         '100%',
      animation:     'fadeUp 0.15s ease forwards',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u05)' }}>
        <h2 style={{
          fontFamily: 'var(--font-brand)',
          fontWeight: 600,
          fontSize:   18,
          color:      'var(--text)',
          letterSpacing: '-0.01em',
        }}>
          New Build
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-sec)', fontFamily: 'var(--font-ui)' }}>
          Describe what to build. LIV will decompose and pipeline it.
        </p>
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 'var(--u1)' }}>
        <ModeTab mode="text" active={state.mode === 'text'} onClick={() => setMode('text')} label="Text" />
        <ModeTab mode="zip"  active={state.mode === 'zip'}  onClick={() => setMode('zip')}  label="Upload" />
        <ModeTab mode="git"  active={state.mode === 'git'}  onClick={() => setMode('git')}  label="Git" />
      </div>

      {/* Input area */}
      <div style={{ animation: 'fadeUp 0.1s ease forwards' }} key={state.mode}>
        {state.mode === 'text' && (
          <TextInput text={state.text} onChange={setText} />
        )}
        {state.mode === 'zip' && (
          <ZipInput
            fileName={state.zipFileName}
            fileSize={state.zipFileSize}
            onLoad={loadZip}
            onClear={clearZip}
          />
        )}
        {state.mode === 'git' && (
          <GitInput
            gitUrl={state.gitUrl}
            gitBranch={state.gitBranch}
            onUrlChange={setGitUrl}
            onBranchChange={setGitBranch}
          />
        )}
      </div>

      {/* Validation errors */}
      <ValidationErrors errors={state.errors} />

      {/* Pipeline error */}
      {pipelineError && (
        <div style={{
          padding:      'var(--u15) var(--u2)',
          background:   'rgba(var(--red), 0.10)',
          border:       '1px solid rgba(var(--red), 0.30)',
          borderRadius: 'var(--radius-surface)',
          fontSize:     13, color: 'rgba(var(--red), var(--density-full))',
          fontFamily:   'var(--font-ui)',
        }}>
          {pipelineError.message}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!canSubmit}
        style={{
          padding:        'var(--u15) var(--u3)',
          background:     canSubmit ? 'rgba(var(--blue), var(--density-full))' : 'var(--surface)',
          border:         `1px solid ${canSubmit ? 'transparent' : 'var(--text-dis)'}`,
          borderRadius:   'var(--radius-surface)',
          color:          canSubmit ? 'var(--bg)' : 'var(--text-dis)',
          fontSize:       14,
          fontFamily:     'var(--font-ui)',
          fontWeight:     500,
          cursor:         canSubmit ? 'pointer' : 'not-allowed',
          transition:     'all 0.1s ease',
          alignSelf:      'flex-start',
          display:        'flex',
          alignItems:     'center',
          gap:            'var(--u1)',
          opacity:        isRunning ? 0.7 : 1,
        }}
      >
        {isRunning ? (
          <>
            <span style={{
              width: 12, height: 12, border: '1.5px solid currentColor',
              borderTopColor: 'transparent', borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.6s linear infinite',
            }} />
            Starting pipeline…
          </>
        ) : (
          'Start build'
        )}
      </button>

      {/* Inline spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
