export type ProviderType = "openai-compat" | "anthropic" | "mock"
export type Speed = "fast" | "balanced" | "deep"

export interface ModelDef {
  id: string
  label: string
  speed?: Speed
}

export interface Provider {
  id: string
  name: string
  type: ProviderType
  baseURL?: string
  defaultModel: string
  models: ModelDef[]
  keyDocsUrl: string
  keyHint: string
  region?: "global" | "cn"
  // 是否需要额外配置 (e.g., 火山引擎需要 endpoint id)
  extraConfig?: "endpoint-id"
}

export const PROVIDERS: Provider[] = [
  {
    id: "mock",
    name: "Demo (no key)",
    type: "mock",
    defaultModel: "mock-fixture",
    models: [
      { id: "mock-fixture", label: "Fixture data — no API call", speed: "fast" },
    ],
    keyDocsUrl: "",
    keyHint: "no key needed — uses local fixture data",
    region: "global",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    type: "anthropic",
    defaultModel: "claude-haiku-4-5-20251001",
    models: [
      { id: "claude-opus-4-7", label: "Claude Opus 4.7", speed: "deep" },
      { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", speed: "balanced" },
      { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5", speed: "fast" },
    ],
    keyDocsUrl: "https://console.anthropic.com/settings/keys",
    keyHint: "sk-ant-...",
    region: "global",
  },
  {
    id: "openai",
    name: "OpenAI",
    type: "openai-compat",
    baseURL: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    models: [
      { id: "gpt-4o", label: "GPT-4o", speed: "deep" },
      { id: "gpt-4o-mini", label: "GPT-4o mini", speed: "fast" },
      { id: "gpt-4.1", label: "GPT-4.1", speed: "balanced" },
      { id: "gpt-5", label: "GPT-5", speed: "deep" },
    ],
    keyDocsUrl: "https://platform.openai.com/api-keys",
    keyHint: "sk-...",
    region: "global",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    type: "openai-compat",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.5-flash",
    models: [
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", speed: "deep" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", speed: "fast" },
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", speed: "fast" },
    ],
    keyDocsUrl: "https://aistudio.google.com/apikey",
    keyHint: "AIza...",
    region: "global",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    type: "openai-compat",
    baseURL: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
    models: [
      { id: "deepseek-chat", label: "DeepSeek V3 (chat)", speed: "balanced" },
      { id: "deepseek-reasoner", label: "DeepSeek R1 (reasoner)", speed: "deep" },
    ],
    keyDocsUrl: "https://platform.deepseek.com/api_keys",
    keyHint: "sk-...",
    region: "cn",
  },
  {
    id: "qwen",
    name: "通义千问 (Qwen)",
    type: "openai-compat",
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    defaultModel: "qwen-plus",
    models: [
      { id: "qwen-max", label: "Qwen Max", speed: "deep" },
      { id: "qwen-plus", label: "Qwen Plus", speed: "balanced" },
      { id: "qwen-turbo", label: "Qwen Turbo", speed: "fast" },
      { id: "qwen3-max", label: "Qwen3 Max", speed: "deep" },
    ],
    keyDocsUrl: "https://bailian.console.aliyun.com/?apiKey=1",
    keyHint: "sk-...",
    region: "cn",
  },
  {
    id: "moonshot",
    name: "Moonshot Kimi",
    type: "openai-compat",
    baseURL: "https://api.moonshot.cn/v1",
    defaultModel: "kimi-k2-0905-preview",
    models: [
      { id: "kimi-k2-0905-preview", label: "Kimi K2", speed: "deep" },
      { id: "moonshot-v1-128k", label: "Moonshot v1 128k", speed: "balanced" },
      { id: "moonshot-v1-32k", label: "Moonshot v1 32k", speed: "fast" },
    ],
    keyDocsUrl: "https://platform.moonshot.cn/console/api-keys",
    keyHint: "sk-...",
    region: "cn",
  },
  {
    id: "zhipu",
    name: "智谱 GLM",
    type: "openai-compat",
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    defaultModel: "glm-4-plus",
    models: [
      { id: "glm-4.5", label: "GLM-4.5", speed: "deep" },
      { id: "glm-4-plus", label: "GLM-4-Plus", speed: "balanced" },
      { id: "glm-4-flash", label: "GLM-4-Flash", speed: "fast" },
    ],
    keyDocsUrl: "https://bigmodel.cn/usercenter/proj-mgmt/apikeys",
    keyHint: "...",
    region: "cn",
  },
  {
    id: "doubao",
    name: "豆包 (Doubao)",
    type: "openai-compat",
    baseURL: "https://ark.cn-beijing.volces.com/api/v3",
    defaultModel: "doubao-1-5-pro-32k-250115",
    models: [
      { id: "doubao-1-5-pro-32k-250115", label: "Doubao 1.5 Pro", speed: "deep" },
      { id: "doubao-1-5-lite-32k-250115", label: "Doubao 1.5 Lite", speed: "fast" },
    ],
    keyDocsUrl: "https://www.volcengine.com/docs/82379/1399008",
    keyHint: "...",
    region: "cn",
  },
]

export function getProvider(id: string): Provider {
  const p = PROVIDERS.find((p) => p.id === id)
  if (!p) throw new Error(`Unknown provider: ${id}`)
  return p
}
