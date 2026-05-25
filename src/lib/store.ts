import { useMemo } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { PROVIDERS } from "./llm/providers"

export interface ProviderCreds {
  providerId: string
  apiKey: string
  model: string
}

export type ThemeMode = "light" | "dark" | "auto"

interface SettingsState {
  activeProvider: string
  creds: Record<string, { apiKey: string; model: string }>
  language: string
  theme: ThemeMode
  setActiveProvider: (id: string) => void
  setProviderCreds: (id: string, apiKey: string, model: string) => void
  clearProvider: (id: string) => void
  setLanguage: (lang: string) => void
  setTheme: (theme: ThemeMode) => void
}

/**
 * React hook: returns memoized active credentials.
 * Wraps `deriveActiveCreds` with useMemo so the returned object is stable
 * (avoids Zustand's "getSnapshot returns new object" infinite loop warning).
 */
export function useActiveCreds(): ProviderCreds | null {
  const activeProvider = useSettings((s) => s.activeProvider)
  const creds = useSettings((s) => s.creds)
  return useMemo(() => deriveActiveCreds(activeProvider, creds), [activeProvider, creds])
}

/**
 * Derive the active credentials from settings state.
 * Pure function — call from a `useMemo` to avoid the Zustand "new object each render" pitfall.
 */
export function deriveActiveCreds(
  activeProvider: string,
  creds: Record<string, { apiKey: string; model: string }>
): ProviderCreds | null {
  const provider = PROVIDERS.find((p) => p.id === activeProvider)
  if (!provider) return null
  if (provider.type === "mock") {
    return {
      providerId: activeProvider,
      apiKey: "mock",
      model: provider.defaultModel,
    }
  }
  const c = creds[activeProvider]
  if (!c?.apiKey) return null
  return {
    providerId: activeProvider,
    apiKey: c.apiKey,
    model: c.model || provider.defaultModel,
  }
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      activeProvider: "mock",
      creds: { mock: { apiKey: "mock", model: "mock-fixture" } },
      language: "auto",
      theme: "auto",
      setActiveProvider: (id) => set({ activeProvider: id }),
      setProviderCreds: (id, apiKey, model) =>
        set((s) => ({ creds: { ...s.creds, [id]: { apiKey, model } } })),
      clearProvider: (id) =>
        set((s) => {
          const next = { ...s.creds }
          delete next[id]
          return { creds: next }
        }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "mighta-settings-v2" }
  )
)

export interface LifeNode {
  id: string
  age: number          // approximate age, for timeline positioning
  moment?: string      // free-text: "last week" / "Oct 2019" / "the winter I was 17"
  event: string
  context?: string
}

export interface TrajectoryStep {
  age: number
  moment?: string      // free-text granular time (LLM may output this)
  state: string
}

export interface ForkVersion {
  id: string
  divergence: LifeNode
  alternative: string
  trajectory: TrajectoryStep[]
  outcome: string
  vibe: "shine" | "ash" | "drift" | "quiet" | "burn"
}

interface SpawnState {
  seed: {
    name: string
    age: number
    bio: string
    nodes: LifeNode[]
  }
  versions: ForkVersion[]
  isGenerating: boolean
  setSeed: (seed: Partial<SpawnState["seed"]>) => void
  addNode: (node: LifeNode) => void
  removeNode: (id: string) => void
  setVersions: (versions: ForkVersion[]) => void
  setGenerating: (generating: boolean) => void
  reset: () => void
}

const emptySeed = {
  name: "",
  age: 30,
  bio: "",
  nodes: [] as LifeNode[],
}

export const useSpawn = create<SpawnState>()((set) => ({
  seed: emptySeed,
  versions: [],
  isGenerating: false,
  setSeed: (seed) => set((state) => ({ seed: { ...state.seed, ...seed } })),
  addNode: (node) =>
    set((state) => ({ seed: { ...state.seed, nodes: [...state.seed.nodes, node] } })),
  removeNode: (id) =>
    set((state) => ({
      seed: { ...state.seed, nodes: state.seed.nodes.filter((n) => n.id !== id) },
    })),
  setVersions: (versions) => set({ versions }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  reset: () => set({ seed: emptySeed, versions: [], isGenerating: false }),
}))

// Dev-only hook for screenshot tooling — exposes the spawn store on window
// so headless-Chrome scripts can hydrate mock results without an API call.
if (import.meta.env.DEV && typeof window !== "undefined") {
  // @ts-expect-error dev helper
  window.__useSpawn = useSpawn
}
