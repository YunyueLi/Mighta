import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { getProvider, type Provider } from "./providers"

export interface CallOpts {
  provider: string
  model: string
  apiKey: string
  system: string
  user: string
  maxTokens?: number
  temperature?: number
}

export async function callLLM(opts: CallOpts): Promise<string> {
  const provider = getProvider(opts.provider)
  if (!opts.apiKey) throw new Error("missing_api_key")

  if (provider.type === "anthropic") {
    return callAnthropic(provider, opts)
  }
  return callOpenAICompat(provider, opts)
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
