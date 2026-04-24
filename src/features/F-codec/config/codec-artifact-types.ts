// @liv-standard v1.5.1
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.7-artifact-types
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  ArtifactSchema, FrameworkMode  F-codec/R0
// wires-out:
//   W-ATOM  ArtifactData         → F-codec/*
//   W-ATOM  ARTIFACT_PREFIX      → F-codec/*
//   W-ATOM  ARTIFACT_DATA_PREFIX → F-codec/*
// deps:
//   R0  ./codec-module-types
// validated:  pending

// Phase 6.7 — artifact type declarations.
// R0: types + config. Zero I/O.
// An artifact is the output of a completed module execution.
// Enters the graph as a node — consistent with MA5 (no NodeType).

import type { ArtifactSchema, FrameworkMode } from './codec-module-types'

// ─── Artifact Data ──────────────────────────────────────────────────────────
// The completed output of a module execution.
// Fields match the module's ArtifactSchema. Values are strings (natural language).
// Validation is at creation time (codec-artifact.ts), not here.

export type ArtifactData = {
  moduleId:    string                      // which module produced this
  mode:        FrameworkMode               // which mode it was produced in
  schema:      ArtifactSchema              // the schema it conforms to
  fields:      Record<string, string>      // key → value, keys from schema.fields
  title:       string                      // human-readable artifact title
  version:     number                      // monotonic version counter
  createdAt:   number                      // unix ms
}

// ─── Artifact Node Marker ───────────────────────────────────────────────────
// Convention: artifact nodes in the graph use a content prefix to distinguish
// them from regular knowledge nodes. The prefix is stripped during decode rendering.
//
// Format: "[artifact:{moduleId}:{version}] {title}"
// Example: "[artifact:discovery:1] Research findings on auth patterns"
//
// This is a content convention, not a type tag — consistent with MA5 (no NodeType).
// Detection is string-based in the decode pass.

export const ARTIFACT_PREFIX = '[artifact:'

// ─── Artifact Data Node Marker ───────────────────────────────────────────────
// Companion data node stores structured field values as JSON.
// Linked to the primary artifact node via anchor edge.
//
// Format: "[artifact-data:{moduleId}:{version}] {JSON}"
// Example: "[artifact-data:discovery:1] {"summary":"...","openQuestions":"..."}"

export const ARTIFACT_DATA_PREFIX = '[artifact-data:'

// ─── Artifact Edge Conventions ──────────────────────────────────────────────
// Universal variables expressed as graph topology (not node fields):
//
// Temporal (version):
//   New version node → previous version node, primitiveType: 'restructure'
//   Establishes version chain. Traversal of new version reinforces it over old.
//
// Categorical (kind):
//   Artifact node → mode node in global graph, primitiveType: 'relate'
//   Node ID convention: global graph mode nodes are 'global-seed-mode-{mode}'
//
// Relational (dependencies):
//   Artifact node → dependency artifact nodes, primitiveType: 'relate'
//   Research feeds plan, plan feeds build. Declared by caller at creation time.
//
// Positional (status):
//   Not an explicit edge — expressed through traversal recency.
//   Active artifact: recent traversals. Completed: reinforce edges from outputs.
//   Archived: no recent traversals — recency decay handles it.
