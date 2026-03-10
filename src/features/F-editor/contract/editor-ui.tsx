// [F-editor/contract/editor-ui.tsx]
// R3 — Editor UI stub. 'use client'.
// Phase B: full code editor with LA-aware tab management.

'use client'

import { useEditor } from './editor-hook'

export function EditorUI({ projectId }: { projectId: string }) {
  const { tabs } = useEditor(projectId)

  return (
    <div style={{ padding: 24, color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
      <span style={{ color: 'var(--text-dis)' }}>
        editor — {projectId} — {tabs.length} tabs
      </span>
    </div>
  )
}
