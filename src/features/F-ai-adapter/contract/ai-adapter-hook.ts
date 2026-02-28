// [F-ai-adapter/R3/C2] useModelSelector + useAvailableModels hooks
// R3: client-side contract

'use client'

import { useState, useCallback } from 'react'
import { ModelConfig, AI_ADAPTER_CONFIG } from '../config/ai-adapter-config'
import { getAvailableModels, resolveModel } from '../domain/ai-adapter-logic'

export function useAvailableModels(): ModelConfig[] {
  return getAvailableModels()
}

export function useModelSelector(initialModelId?: string) {
  const [selectedModelId, setSelectedModelId] = useState(
    initialModelId ?? AI_ADAPTER_CONFIG.defaultModel
  )

  const selectedModel = resolveModel(selectedModelId)

  const selectModel = useCallback((modelId: string) => {
    resolveModel(modelId) // throws if invalid — surfaces early
    setSelectedModelId(modelId)
  }, [])

  return { selectedModelId, selectedModel, selectModel }
}
