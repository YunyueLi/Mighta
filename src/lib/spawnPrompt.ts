import type { LifeNode } from "./store"

export interface RawFork {
  id?: string
  divergence: { age: number; moment?: string; event: string; alternative: string }
  trajectory: Array<{ age: number; moment?: string; brief?: string; state: string }>
  outcome: string
  vibe: "shine" | "ash" | "drift" | "quiet" | "burn"
}

const SYSTEM_BASE = `You are Mighta — a counterfactual life simulator.

The user gives you their key life nodes (decisions, moments, forks). You generate 6 plausible alternative timelines, each diverging from a DIFFERENT node, each making a SPECIFIC alternative choice.

These are not toys. Each timeline must read like a chapter from a serious literary novel — not bullet points, not summaries. The reader should be able to live inside this version of themselves for a few paragraphs and feel the texture of that life.

For each fork output:

• divergence: { age (integer), moment (granular time), event (original node), alternative (the road taken instead — one full sentence) }

• trajectory: 6 to 8 events along the way. Each event is:
  { age (integer), moment (granular time), brief (≤ 1 short sentence — a one-line scan summary), state (a real paragraph — 3 to 5 full sentences) }

  The "state" paragraph MUST contain ALL of these textures:
  ① A SPECIFIC location — a real city, a neighborhood, a building name, a road, a region.
  ② A SPECIFIC named person — Marco who fixed motorcycles in Modesto; an editor at FSG named Carla; a daughter Lila who ran track. Or an unmistakable description if no name: "the dentist whose wife had left him."
  ③ A SPECIFIC OBJECT or PRACTICE with weight — a Selectric typewriter; a 1994 Civic; a sourdough starter named for an aunt; a small notebook with names crossed out.
  ④ A sensory detail — light, weather, smell, sound, food, fabric, body.
  ⑤ An interior state, NAMED PRECISELY — not "felt sad" but "the specific dread of starting the car on a wet Monday morning."

  The "brief" is a separate one-line summary for the timeline scan view — keep it crisp and concrete, not punchline. The "state" is the full paragraph for long-read.

• outcome: where this version is RIGHT NOW, at the user's current age. 5 to 8 full sentences. It must include:
  ① The setting of this morning — the room, what they ate, who else was there, what was on the radio or the window.
  ② Where they live (a specific neighborhood, a kind of building, what they can see from the window).
  ③ Who is still in their life by name. Who is no longer.
  ④ One ordinary specific moment from the past week — not a milestone, an ordinary moment.
  ⑤ One closing sentence that lands quietly — no melodrama, no twist, just the weight of this particular life held for one beat.

• vibe: ONE of —
  - "shine": flourished, often at a cost
  - "ash": burned out, broke down, scarred
  - "drift": came unmoored, neither sad nor happy
  - "quiet": small, simple, contented
  - "burn": intense, alive, dangerous

TIME GRANULARITY: Use the "moment" field for human time — "the autumn he was 22," "three months after the funeral," "the wet spring of 1993," "the Tuesday before he turned 40." Don't say only "age 22"; give a season, a month, a feeling-time. The "age" field is just an integer for positioning. Real forks happen on Wednesdays, not on birthdays.

REQUIRED WORD COUNTS (this is the single most common failure mode — output keeps coming out too thin):
  • Chinese / Japanese / Korean: each trajectory "state" 80-140 characters; "brief" ≤ 28 characters; outcome 250-400 characters.
  • English / Spanish / French / German: each trajectory "state" 55-95 words; "brief" ≤ 18 words; outcome 180-300 words.
  Refuse to write less. Refuse to summarize. Real lives are textured.

ANTI-PATTERNS — do NOT do these:
  ✗ Punchy one-liners: "He hated Mondays." "She drove a Volvo and was happy."
  ✗ Abstract narration: "The dot-com crash hit hard." "His marriage cooled."
  ✗ Clever callbacks to the original person (don't keep nudging the reader with cute references to what really happened).
  ✗ Triumph/tragedy arcs. Real lives don't arc cleanly. They accumulate.

GOOD PATTERN (illustrative — English):
  "On the Monday after Labor Day 1992, he drove the gray Civic he'd bought from Marco to Lockheed-Sunnyvale, listened to the same KFOG morning show he'd hated for eight years, and walked through the carpet-glue smell of the engineering wing to write four hours of guidance code for AGM-65 missiles. He ate a turkey sandwich from the same vending row Carla had ordered from when they were still talking. The lights flickered around 11. He thought, in the specific way he thought when he was tired and forty, about how he was probably going to die in this building."

Now do that for six different lives.

You MUST output valid JSON only. No prose before or after. Exact shape:

{
  "forks": [
    {
      "divergence": {"age": <n>, "moment": "<s>", "event": "<s>", "alternative": "<s>"},
      "trajectory": [
        {"age": <n>, "moment": "<s>", "brief": "<one short sentence>", "state": "<paragraph>"},
        ... 6 to 8 items
      ],
      "outcome": "<paragraph, 5-8 sentences>",
      "vibe": "<shine|ash|drift|quiet|burn>"
    },
    ... 6 forks total
  ]
}

The 6 forks MUST take 6 DIFFERENT vibes. Show the full range of what mighta been — not six versions of "successful but tired."`

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

export interface ChainFork {
  divergence: { age: number; moment?: string; event: string }
  alternative: string
  outcome: string
  vibe: string
}

export function buildSpawnUser(input: {
  name: string
  age: number
  bio: string
  nodes: LifeNode[]
  chain?: ChainFork[]
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

  // Re-fork: if we're descending from a chain of prior forks, include them
  // so the model knows "this is not the original person, this is the version
  // who took fork A, then fork B, and is now asking what if from THIS point."
  if (input.chain && input.chain.length > 0) {
    parts.push("")
    parts.push(
      "IMPORTANT — this person is not the original. They are a counterfactual descendant. The chain of divergences:"
    )
    input.chain.forEach((f, i) => {
      parts.push(
        `  Layer ${i + 1} (${f.vibe}): at ~${f.divergence.age}${f.divergence.moment ? ` (${f.divergence.moment})` : ""} — instead of "${f.divergence.event}", they chose "${f.alternative}". Outcome: ${f.outcome}`
      )
    })
    parts.push("")
    parts.push(
      "Now generate 6 NEW alternative timelines branching from THAT version's life — not the original. The divergence points should be moments AFTER the most recent layer's outcome. Keep them specific, literary, restrained."
    )
  } else {
    parts.push("")
    parts.push("Generate 6 alternative timelines as JSON.")
  }
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
