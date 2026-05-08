#!/bin/bash
# @kind cycle-record
# @placement sprint-records/sprint-8-substrate-cutover/
# Run from ~/liv-app-v2
# Deletes all dissolved files per Sprint 8 shots 3a + 3b
FILES=(
  "src/core/standards/cognitive-standard.md"
  "src/features/F-codec/SLICE.md"
  "src/features/F-codec/app/codec-admin-actions.ts"
  "src/features/F-codec/app/codec-artifact.ts"
  "src/features/F-codec/app/codec-audit.ts"
  "src/features/F-codec/app/codec-discovery.ts"
  "src/features/F-codec/app/codec-encode.ts"
  "src/features/F-codec/app/codec-memory-actions.ts"
  "src/features/F-codec/app/codec-mi-adapter.ts"
  "src/features/F-codec/app/codec-orchestrate.ts"
  "src/features/F-codec/app/codec-read.ts"
  "src/features/F-codec/app/codec-registry.ts"
  "src/features/F-codec/app/codec-subscribe.ts"
  "src/features/F-codec/app/codec-verify.ts"
  "src/features/F-codec/config/codec-admin-types.ts"
  "src/features/F-codec/config/codec-artifact-types.ts"
  "src/features/F-codec/config/codec-audit-types.ts"
  "src/features/F-codec/config/codec-decode-types.ts"
  "src/features/F-codec/config/codec-events.ts"
  "src/features/F-codec/config/codec-memory-types.ts"
  "src/features/F-codec/config/codec-module-types.ts"
  "src/features/F-codec/config/codec-routing-types.ts"
  "src/features/F-codec/config/codec-types.ts"
  "src/features/F-codec/config/codec-wires.ts"
  "src/features/F-codec/contract/codec-contract.ts"
  "src/features/F-codec/contract/codec-inject.ts"
  "src/features/F-codec/contract/framework-artifact-detail.tsx"
  "src/features/F-codec/contract/framework-program-register.tsx"
  "src/features/F-codec/contract/framework-program.tsx"
  "src/features/F-codec/contract/global-graph-admin.tsx"
  "src/features/F-codec/contract/memory-program.tsx"
  "src/features/F-codec/contract/memory-register.tsx"
  "src/features/F-codec/domain/codec-classify.ts"
  "src/features/F-codec/domain/codec-decode-render.ts"
  "src/features/F-codec/domain/codec-decode.ts"
  "src/features/F-codec/domain/codec-label.ts"
  "src/features/F-codec/domain/codec-mode-classify.ts"
  "src/features/F-codec/domain/codec-routing.ts"
  "src/features/F-codec/exec/codec-ai-io.ts"
  "src/features/F-plan/contract/plan-module.ts"
  "src/core/constants/living-memory.ts"
  "src/core/standards/living-memory-standard.md"
  "src/core/types/living-memory.types.ts"
  "src/features/F-chat/exec/lm-io.ts"
  "src/features/F-memory/app/memory-admin-service.ts"
  "src/features/F-memory/app/memory-artifact-store.ts"
  "src/features/F-memory/app/memory-background.ts"
  "src/features/F-memory/app/memory-service.ts"
  "src/features/F-memory/config/memory-events.ts"
  "src/features/F-memory/config/memory-seed-data.ts"
  "src/features/F-memory/config/memory-types.ts"
  "src/features/F-memory/config/memory-wires.ts"
  "src/features/F-memory/contract/memory-contract.ts"
  "src/features/F-memory/contract/memory-graph-contract.ts"
  "src/features/F-memory/contract/memory-hook.ts"
  "src/features/F-memory/domain/memory-arm.ts"
  "src/features/F-memory/domain/memory-axes.ts"
  "src/features/F-memory/domain/memory-bind.ts"
  "src/features/F-memory/domain/memory-label.ts"
  "src/features/F-memory/domain/memory-layer.ts"
  "src/features/F-memory/domain/memory-present.ts"
  "src/features/F-memory/domain/memory-sparsify.ts"
  "src/features/F-memory/domain/memory-traverse.ts"
  "src/features/F-memory/exec/embedding-service.ts"
  "src/features/F-memory/exec/memory-graph-io.ts"
  "src/features/F-memory/exec/memory-repository.ts"
  "src/features/F-plan/smoke/plan-smoke.ts"
)

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    rm "$f"
    echo "deleted: $f"
  else
    echo "already absent: $f"
  fi
done

# Remove F-codec directory if empty
rmdir src/features/F-codec/app src/features/F-codec/config src/features/F-codec/contract src/features/F-codec/domain src/features/F-codec/exec src/features/F-codec 2>/dev/null && echo "removed: src/features/F-codec/" || true

echo "Deletions complete."
