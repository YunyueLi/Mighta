import { create } from "zustand"
import { persist } from "zustand/middleware"
import { PROVIDERS } from "./llm/providers"

interface ProviderCreds {
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
  getActiveCreds: () => ProviderCreds | null
}

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      activeProvider: "anthropic",
      creds: {},
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
      getActiveCreds: () => {
        const s = get()
        const c = s.creds[s.activeProvider]
        if (!c?.apiKey) return null
        const provider = PROVIDERS.find((p) => p.id === s.activeProvider)
        return {
          providerId: s.activeProvider,
          apiKey: c.apiKey,
          model: c.model || provider?.defaultModel || "",
        }
      },
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
