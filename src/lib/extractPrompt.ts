export interface ExtractedSeed {
  name: string
  age: number
  bio: string
  nodes: Array<{ age: number; event: string }>
}

const SYSTEM_BASE = `You are a careful biographical parser.

The user gives you raw text — could be a bio, an obituary, a Wikipedia excerpt, a personal essay, a CV, a journal entry, a novel character sketch. Your job: extract structured life data.

Extract:
- "name": the subject's name. If unclear or no name mentioned, use "anon" (do NOT invent a name).
- "age": the subject's CURRENT age, OR the age at the most recent event in the text. Integer. If totally unclear, use 30.
- "bio": ONE OR TWO sentences capturing who this person is. Concrete. No fluff. No "passionate" or "driven" — describe what they DID.
- "nodes": 3 to 7 KEY FORKS in their life — moments where a real decision or event redirected them. Each node has:
  - "age": integer
  - "event": ONE concrete sentence. Specific. Names, places, dates if available. NOT "started a career" — "joined Google in 2014 as the 47th engineer."

You MUST output ONLY valid JSON, no preamble or commentary. Shape:

{
  "name": "...",
  "age": <number>,
  "bio": "...",
  "nodes": [
    {"age": <number>, "event": "..."},
    ...
  ]
}`

const LANG_DIRECTIVES: Record<string, string> = {
  en: "Write all output in English.",
  zh: "Write all output (bio, event text) in 中文 (Simplified Chinese). 简洁,具体。",
  "zh-TW": "Write all output in 繁體中文.",
  ja: "Write all output in 日本語.",
  ko: "Write all output in 한국어.",
  es: "Write all output in Español.",
  fr: "Écris la sortie en Français.",
  de: "Schreibe die Ausgabe auf Deutsch.",
}

export function buildExtractSystem(locale: string): string {
  const base = locale.split("-")[0]
  const langKey = LANG_DIRECTIVES[locale] ? locale : LANG_DIRECTIVES[base] ? base : "en"
  return SYSTEM_BASE + "\n\nLANGUAGE: " + LANG_DIRECTIVES[langKey]
}

export function buildExtractUser(text: string): string {
  const trimmed = text.length > 12000 ? text.slice(0, 12000) + "\n[...truncated]" : text
  return `Here is the text to parse:\n\n${trimmed}\n\nExtract life data as JSON.`
}

export function parseExtracted(text: string): ExtractedSeed {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim()
  const start = cleaned.indexOf("{")
  const end = cleaned.lastIndexOf("}")
  if (start === -1 || end === -1) throw new Error("model_parse")
  const obj = JSON.parse(cleaned.slice(start, end + 1))
  if (!Array.isArray(obj.nodes)) throw new Error("model_parse")
  return {
    name: typeof obj.name === "string" ? obj.name : "anon",
    age: typeof obj.age === "number" ? obj.age : 30,
    bio: typeof obj.bio === "string" ? obj.bio : "",
    nodes: obj.nodes.map((n: { age: number; event: string }) => ({
      age: Number(n.age) || 0,
      event: String(n.event ?? ""),
    })),
  }
}
