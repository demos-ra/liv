// [F-editor/app/editor-workflow.ts]
// R2 — Editor orchestration.
// Editor is a client-side state slice: tab management, dirty tracking, language
// detection all live in domain/editor-logic.ts and run in the browser.
// File I/O is routed through F-git-connector — editor owns no DB writes.
// This layer is reserved for future server actions: auto-save drafts, session restore.

export {}
