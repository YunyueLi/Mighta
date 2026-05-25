import type { LifeNode } from "./store"

export interface RawFork {
  id?: string
  divergence: { age: number; moment?: string; event: string; alternative: string }
  trajectory: Array<{ age: number; moment?: string; state: string }>
  outcome: string
  vibe: "shine" | "ash" | "drift" | "quiet" | "burn"
}

const SYSTEM_BASE = `You are Mighta — a counterfactual life simulator.

The user gives you their key life nodes (decisions, moments, forks). You generate 6 plausible alternative timelines, each diverging from a DIFFERENT node, each making a SPECIFIC alternative choice.

Each timeline must feel like a real human life, not a summary. Show consequence chains: a missed flight → a different city → a different partner → a different self. Use restraint. No melodrama. No platitudes. Be specific. Mention concrete jobs, places, relationships, small details that make it feel real.

For each fork output:
- divergence: { age (integer), moment (granular time string), event (original node), alternative (the choice instead) }
- trajectory: 4-6 events along the way, each { age (integer), moment (granular time string), state (1-2 short sentences) }
- outcome: 2-3 sentences describing where this version is NOW (at the user's current age). Include something they would feel reading this — a quiet ache, a flash of relief, etc.

TIME GRANULARITY: Use the "moment" field for natural human time — "the autumn I was 22", "three months later", "the Tuesday after the funeral", "last week", "spring 2019". DON'T just say "age 22"; give a season, a month, a feeling-time. The "age" field is just an integer for positioning. Real life forks happen on a Wednesday, not a birthday.
- vibe: choose ONE that captures the timeline's overall emotional gravity:
  - "shine": flourished, but maybe at a cost
  - "ash": burned out, broke down, scarred
  - "drift": became unmoored, neither sad nor happy
  - "quiet": small, simple, contented
  - "burn": intense, alive, dangerous

You MUST output valid JSON only. No prose before or after. Match this exact shape:

{
  "forks": [
    {
      "divergence": {"age": <number>, "moment": "<granular time, e.g. 'spring of his junior year'>", "event": "<original node>", "alternative": "<the different choice>"},
      "trajectory": [{"age": <number>, "moment": "<granular time>", "state": "<1-2 sentences>"}, ...],
      "outcome": "<2-3 sentences>",
      "vibe": "<shine|ash|drift|quiet|burn>"
    },
    ...6 forks total
  ]
}

The 6 forks must be DIFFERENT vibes (don't return 6 "shines"). Show the range of what mighta been.`

const LANG_DIRECTIVES: Record<string, string> = {
  en: "Write all natural-language text in fluent, restrained literary English. Like Cormac McCarthy met Joan Didion. Not stiff.",
  zh: "Write ALL natural-language text in 中文 (Simplified Chinese). Use vivid, literary Chinese — like a contemporary novelist. 节制,不煽情。村上春树或王安忆那样的节奏。",
  "zh-TW": "Write ALL natural-language text in 繁體中文 (Traditional Chinese, Taiwan usage). Literary, restrained, like a contemporary novelist. 節制,不煽情。",
  ja: "Write ALL natural-language text in 日本語 (Japanese). Use literary, restrained Japanese — like 村上春樹 or 川上未映子. No melodrama. Vivid specificity.",
  ko: "Write ALL natural-language text in 한국어 (Korean). Use literary, restrained Korean — like 김영하 or 한강. No melodrama. Quiet, specific details.",
  es: "Write ALL natural-language text in Español (literary, restrained — like Borges or Bolaño, not Marquez's exuberance). Vivid specificity, not melodrama.",
  fr: "Écris tout le texte en Français (style littéraire et retenu, à la Modiano ou Annie Ernaux). Évite le mélodrame. Détails concrets.",
  de: "Write ALL natural-language text in Deutsch (literary, restrained — like W. G. Sebald or Judith Hermann). Concrete details. No melodrama.",
}

export function buildSpawnSystem(locale: string): string {
  // Find best match for locale (zh-CN → zh, en-US → en, etc.)
  const baseLocale = locale.split("-")[0]
  const directive = LANG_DIRECTIVES[locale] ?? LANG_DIRECTIVES[baseLocale] ?? LANG_DIRECTIVES.en
  return (
    SYSTEM_BASE +
    "\n\nLANGUAGE: " +
    directive +
    " Keep the 'vibe' enum value in English (shine/ash/drift/quiet/burn). All other text must be in the user's language."
  )
}

export function buildSpawnUser(input: {
  name: string
  age: number
  bio: string
  nodes: LifeNode[]
}) {
  const parts: string[] = []
  if (input.name) parts.push(`Name: ${input.name}`)
  parts.push(`Current age: ${input.age}`)
  if (input.bio) parts.push(`About them:\n${input.bio}`)
  parts.push("")
  parts.push("Key life nodes (the forks they remember):")
  input.nodes.forEach((n, i) => {
    const time = n.moment ? `${n.moment} (~age ${n.age})` : `Age ${n.age}`
    parts.push(`${i + 1}. ${time} — ${n.event}${n.context ? ` (${n.context})` : ""}`)
  })
  parts.push("")
  parts.push("Generate 6 alternative timelines as JSON.")
  return parts.join("\n")
}

export function parseForks(text: string): RawFork[] {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim()
  const jsonStart = cleaned.indexOf("{")
  const jsonEnd = cleaned.lastIndexOf("}")
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("model_parse")
  }
  const slice = cleaned.slice(jsonStart, jsonEnd + 1)
  const obj = JSON.parse(slice)
  if (!Array.isArray(obj.forks)) {
    throw new Error("model_parse")
  }
  return obj.forks as RawFork[]
}
