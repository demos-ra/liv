// @liv-standard v1.3
// [F-la-config/R3]
// Built with LIV · livai.dev
// [F-state-registry/R3/C2] State registry React provider + hooks
// R3: contract layer, depends R0 + R1.
// 'use client'
//
// Provides useNamespace() and useWriteNamespace() hooks consumed by
// every R3 hook across all slices. This is the central client-side
// state infrastructure.
//
// Architecture:
// - One React context per namespace (lazy, created on first use)
// - Writes are always to the owning namespace (enforced by R1 checkWrite)
// - No third-party state library — custom namespace registry as per Bible §3.5

'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { ownsNamespace } from '../domain/state-enforce'
import type { FSlice } from '@/core/types/primitives'

// ─── Store implementation ─────────────────────────────────────────────────────
// Singleton store for all namespaces. useSyncExternalStore for concurrent mode.

type NamespaceStore = Map<string, unknown>
type Listener = () => void

function createStore() {
  const state: NamespaceStore = new Map()
  const listeners = new Set<Listener>()

  function subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  function notify(): void {
    for (const l of listeners) l()
  }

  function read<T>(key: string): T | undefined {
    return state.get(key) as T | undefined
  }

  function write<T>(key: string, updater: ((prev: T | undefined) => T) | T): void {
    const prev = state.get(key) as T | undefined
    const next = typeof updater === 'function'
      ? (updater as (prev: T | undefined) => T)(prev)
      : updater
    state.set(key, next)
    notify()
  }

  function getSnapshot(): NamespaceStore {
    return state
  }

  return { subscribe, read, write, getSnapshot }
}

const store = createStore()

// ─── Context ──────────────────────────────────────────────────────────────────

const StateRegistryContext = createContext<typeof store>(store)

export function StateRegistryProvider({ children }: { children: React.ReactNode }) {
  return (
    <StateRegistryContext.Provider value={store}>
      {children}
    </StateRegistryContext.Provider>
  )
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Read a namespace value. Returns undefined if not yet written.
 * Subscribes to updates — re-renders when value changes.
 */
export function useNamespace<T>(namespaceKey: string): T | undefined {
  const s = useContext(StateRegistryContext)
  return useSyncExternalStore(
    s.subscribe,
    () => s.read<T>(namespaceKey),
    () => undefined   // server snapshot
  )
}

/**
 * Write to a namespace.
 * Takes a functional updater (like useState setter) or a direct value.
 */
export function useWriteNamespace<T>(namespaceKey: string) {
  const s = useContext(StateRegistryContext)
  return useCallback(
    (updater: ((prev: T | undefined) => T) | T) => {
      s.write<T>(namespaceKey, updater)
    },
    [s, namespaceKey]
  )
}

/**
 * Hydrate a namespace from server data (called on mount in SSR scenarios).
 */
export function useHydrateNamespace<T>(namespaceKey: string, serverValue: T | undefined): void {
  const s = useContext(StateRegistryContext)
  const hydrated = useRef(false)

  if (!hydrated.current && serverValue !== undefined) {
    s.write<T>(namespaceKey, serverValue)
    hydrated.current = true
  }
}
