// @liv-standard v1.5.1
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.7-artifact-creation
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  ArtifactData, ARTIFACT_PREFIX, ARTIFACT_DATA_PREFIX  F-codec/R0
//   W-ATOM  Result                                               core/R0
// wires-out:
//   W-INJECT  createArtifact  → F-codec/R2 (future module execution)
// deps:
//   R0  ../config/codec-artifact-types
//   R0  ../config/codec-module-types
//   R3  @/features/F-memory/contract/memory-contract
//   R5  @/core/types/primitives
// validated:  pending

// Phase 6.7 — artifact creation.
// R2: orchestration. Takes module schema + completed data → traverse calls
// + relational edges. Artifacts enter via traverse() (not seedGlobalNode)
// so they participate in normal physics.

import type { Result } from '@/core/types/primitives'
import type { ArtifactData } from '../config/codec-artifact-types'
import { ARTIFACT_PREFIX, ARTIFACT_DATA_PREFIX } from '../config/codec-artifact-types'
import { traverse } from '@/features/F-memory/contract/memory-contract'

// ─── createArtifact ──────────────────────────────────────────────────────────
// Creates an artifact in the graph:
// 1. Primary node with semantic content (participates in physics)
// 2. Companion data node with JSON fields (linked via anchor)
// 3. Categorical edge to mode node in global graph
// 4. Dependency edges to related artifacts
// 5. Version edge to previous version (if version > 1)

export async function createArtifact(
  data: ArtifactData,
  userId: string,
  dependsOn?: string[],
): Promise<Result<{ nodeId: string }>> {
  try {
    // 1. Build artifact content string
    const content = `${ARTIFACT_PREFIX}${data.moduleId}:${data.version}] ${data.title}`

    // 2. Build field summary for traversable text
    const fieldText = data.schema.fields
      .filter(f => data.fields[f.key])
      .map(f => `${f.label}: ${data.fields[f.key]}`)
      .join('. ')
    const traversalContent = fieldText
      ? `${content}. ${fieldText}`
      : content

    // 3. Traverse into graph — earn placement through physics
    const result = await traverse(traversalContent, userId, {
      primitiveType: 'anchor',
      returnActivation: true,
    })

    if (!result.ok || result.data === null) {
      return {
        ok: false,
        error: {
          code: 'ARTIFACT_CREATION_FAILED',
          message: result.ok ? 'Traversal returned null' : result.error.message,
        },
      }
    }

    // 4. Extract created node ID — highest-activation node matching artifact content
    const topNodes = result.data.topNodes
    const artifactNode = topNodes.length > 0 ? topNodes[0] : null
    if (!artifactNode) {
      return {
        ok: false,
        error: { code: 'ARTIFACT_NODE_NOT_FOUND', message: 'No top node after traversal' },
      }
    }
    const nodeId = artifactNode.nodeId

    // 5. Store artifact field data as companion node
    const dataContent = `${ARTIFACT_DATA_PREFIX}${data.moduleId}:${data.version}] ${JSON.stringify(data.fields)}`
    await traverse(dataContent, userId, { primitiveType: 'anchor' })

    // 6. Categorical edge — connect artifact to its mode node in global graph
    await traverse(
      `${content} operates in ${data.mode} mode`,
      userId,
      { primitiveType: 'relate' },
    )

    // 7. Dependency edges — relational connections to dependency artifacts
    if (dependsOn) {
      for (const depNodeId of dependsOn) {
        await traverse(
          `${data.title} depends on ${depNodeId}`,
          userId,
          { primitiveType: 'relate' },
        )
      }
    }

    // 8. Version edge — temporal connection to previous version
    if (data.version > 1) {
      await traverse(
        `${content} supersedes version ${data.version - 1}`,
        userId,
        { primitiveType: 'restructure' },
      )
    }

    return { ok: true, data: { nodeId } }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[F-codec] createArtifact error:', message)
    return { ok: false, error: { code: 'ARTIFACT_CREATION_FAILED', message } }
  }
}
