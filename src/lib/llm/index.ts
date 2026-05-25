import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { getProvider, type Provider } from "./providers"
import { buildSpawnFixture, extractFixture } from "./mockFixtures"

export interface CallOpts {
  provider: string
  model: string
  apiKey: string
  system: string
  user: string
  maxTokens?: number
  temperature?: number
  // mock-only: original input so fixtures can be personalized
  mockInput?: {
    kind: "spawn" | "extract"
    seed?: { name: string; age: number; bio: string; nodes: Array<{ age: number; moment?: string; event: string }> }
    locale?: string
    // re-fork chain — mock returns deeper, weirder forks at depth > 0
    chain?: Array<{ vibe: string; alternative: string; outcome: string; divergence: { age: number; moment?: string; event: string } }>
  }
}

export async function callLLM(opts: CallOpts): Promise<string> {
  const provider = getProvider(opts.provider)

  if (provider.type === "mock") return callMock(opts)

  if (!opts.apiKey) throw new Error("missing_api_key")

  if (provider.type === "anthropic") {
    return callAnthropic(provider, opts)
  }
  return callOpenAICompat(provider, opts)
}

async function callMock(opts: CallOpts): Promise<string> {
  // Simulate latency — 2-3s, matches a real spawn call
  await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000))

  const kind = opts.mockInput?.kind ?? "spawn"
  const locale = opts.mockInput?.locale ?? "en"

  if (kind === "extract") {
    return JSON.stringify(extractFixture(locale))
  }
  // spawn
  const seed = opts.mockInput?.seed ?? {
    name: "",
    age: 30,
    bio: "",
    nodes: [],
  }
  const chain = opts.mockInput?.chain ?? []
  return JSON.stringify(buildSpawnFixture(seed, locale, chain))
}

async function callAnthropic(_provider: Provider, opts: CallOpts): Promise<string> {
  const client = new Anthropic({ apiKey: opts.apiKey, dangerouslyAllowBrowser: true })
  const res = await client.messages.create({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
  })
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
}

async function callOpenAICompat(provider: Provider, opts: CallOpts): Promise<string> {
  const client = new OpenAI({
    apiKey: opts.apiKey,
    baseURL: provider.baseURL,
    dangerouslyAllowBrowser: true,
  })
  const res = await client.chat.completions.create({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature,
    messages: [
      { role: "system", content: opts.system },
      { role: "user", content: opts.user },
    ],
  })
  return res.choices[0]?.message?.content ?? ""
}
