#!/usr/bin/env node
// Generate 4 diagrams x 2 themes = 8 SVGs into docs/.
// Diagrams: architecture, spawn-flow, fork-anatomy, codebase.

import { writeFileSync, mkdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, "../docs")
mkdirSync(OUT, { recursive: true })

// ─────────────── PALETTE ───────────────

const THEMES = {
  light: {
    name: "light",
    bg: "#f5efdf",
    bgSoft: "#ede5cd",
    bgElev: "#fbf6e7",
    fg: "#1d1810",
    fgSoft: "#3d3324",
    fgDim: "#6e6149",
    fgFaint: "#aea283",
    accent: "#936a26",
    accentSoft: "#6e4e1a",
    line: "rgba(29,24,16,0.18)",
    lineBright: "rgba(29,24,16,0.32)",
    shine: "#c9a35a",
    ash: "#908778",
    drift: "#6e7d87",
    quiet: "#6a7d6b",
    burn: "#b66a47",
  },
  dark: {
    name: "dark",
    bg: "#0c0a08",
    bgSoft: "#110e0a",
    bgElev: "#16120d",
    fg: "#f3ede0",
    fgSoft: "#c8c0b0",
    fgDim: "#908778",
    fgFaint: "#4d4639",
    accent: "#c9a35a",
    accentSoft: "#a88846",
    line: "rgba(243,237,224,0.14)",
    lineBright: "rgba(243,237,224,0.28)",
    shine: "#d4af66",
    ash: "#a89d8a",
    drift: "#8295a0",
    quiet: "#86987f",
    burn: "#c87a55",
  },
}

const fontStack = `'Inter','SF Pro Text',system-ui,sans-serif`
const serifStack = `'Fraunces','EB Garamond',Georgia,serif`
const monoStack = `'JetBrains Mono','SF Mono',ui-monospace,monospace`

// ─────────────── HELPERS ───────────────
// Text style helpers — fill is required (first arg) to prevent attribute duplication.
const smallCaps = (fill, size = 11, ls = 2.4) =>
  `font-family="${fontStack}" font-size="${size}" font-weight="600" letter-spacing="${ls}" fill="${fill}"`
const serif = (fill, size = 28) =>
  `font-family="${serifStack}" font-size="${size}" font-weight="500" fill="${fill}"`
const body = (fill, size = 13) =>
  `font-family="${fontStack}" font-size="${size}" fill="${fill}"`
const mono = (fill, size = 11) =>
  `font-family="${monoStack}" font-size="${size}" fill="${fill}"`

function svgShell(w, h, t, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" font-family="${fontStack}" role="img" aria-label="${title}">
  <defs>
    <marker id="arrow-${t.name}" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto-start-reverse">
      <path d="M0,2 L10,6 L0,10 z" fill="${t.fgDim}"/>
    </marker>
    <marker id="arrow-accent-${t.name}" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto-start-reverse">
      <path d="M0,2 L10,6 L0,10 z" fill="${t.accent}"/>
    </marker>
    <pattern id="paper-${t.name}" x="0" y="0" width="220" height="220" patternUnits="userSpaceOnUse">
      <rect width="220" height="220" fill="${t.bg}"/>
      <circle cx="40" cy="60" r="0.6" fill="${t.fgFaint}" opacity="0.18"/>
      <circle cx="160" cy="30" r="0.5" fill="${t.fgFaint}" opacity="0.14"/>
      <circle cx="100" cy="170" r="0.7" fill="${t.fgFaint}" opacity="0.20"/>
      <circle cx="190" cy="120" r="0.4" fill="${t.fgFaint}" opacity="0.10"/>
      <circle cx="20" cy="190" r="0.5" fill="${t.fgFaint}" opacity="0.12"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#paper-${t.name})"/>
  ${body}
</svg>`
}

function box(x, y, w, h, t, opts = {}) {
  const r = opts.r ?? 14
  const fill = opts.fill ?? t.bgElev
  const stroke = opts.stroke ?? t.line
  const sw = opts.strokeWidth ?? 1
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
}

function sectionHeader(x, y, w, label, t) {
  return `
    <text x="${x}" y="${y}" ${smallCaps(t.accent, 10, 2.2)}>${label}</text>
    <line x1="${x + label.length * 7 + 14}" y1="${y - 4}" x2="${x + w}" y2="${y - 4}" stroke="${t.line}" stroke-width="1"/>
  `
}

function curve(x1, y1, x2, y2, t, arrow = true) {
  const dx = (x2 - x1) / 2
  const c1x = x1 + dx, c1y = y1
  const c2x = x2 - dx, c2y = y2
  return `<path d="M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}" stroke="${t.fgDim}" stroke-width="1.4" fill="none" opacity="0.55"${arrow ? ` marker-end="url(#arrow-${t.name})"` : ""}/>`
}

// ─────────────── 1 · ARCHITECTURE ───────────────

function diagramArchitecture(t) {
  const W = 1600, H = 940

  const head = `
    <g>
      <text x="${W / 2}" y="64" text-anchor="middle" ${smallCaps(t.accent, 11, 3.2)}>architecture</text>
      <text x="${W / 2}" y="108" text-anchor="middle" ${serif(t.fg, 30)}>browser-only · bring your own key</text>
      <text x="${W / 2}" y="140" text-anchor="middle" ${body(t.fgDim, 13)}>no server · no telemetry · no account · key stays in localStorage</text>
      <line x1="${W / 2 - 60}" y1="158" x2="${W / 2 + 60}" y2="158" stroke="${t.accent}" stroke-width="1" opacity="0.6"/>
    </g>
  `

  // Left — You
  const ux = 100, uy = 280
  const user = `
    <g>
      ${sectionHeader(ux, uy - 30, 280, "you", t)}
      ${box(ux, uy, 280, 380, t)}
      <circle cx="${ux + 140}" cy="${uy + 100}" r="34" fill="none" stroke="${t.fg}" stroke-width="1.2"/>
      <path d="M${ux + 90} ${uy + 200} Q${ux + 140} ${uy + 150} ${ux + 190} ${uy + 200} L${ux + 190} ${uy + 280} L${ux + 90} ${uy + 280} Z" fill="none" stroke="${t.fg}" stroke-width="1.2"/>
      <text x="${ux + 140}" y="${uy + 320}" text-anchor="middle" ${body(t.fgSoft, 13)}>1 fork from your life</text>
      <text x="${ux + 140}" y="${uy + 343}" text-anchor="middle" ${mono(t.fgDim, 10)}>name · age · divergence</text>
    </g>
  `

  // Center — mighta SPA
  const sx = 510, sy = 220, sw = 580, sh = 540
  const spa = `
    <g>
      ${sectionHeader(sx, sy - 30, sw, "mighta · static spa", t)}
      ${box(sx, sy, sw, sh, t, { fill: t.bgSoft, stroke: t.lineBright, strokeWidth: 1.4 })}

      <text x="${sx + 30}" y="${sy + 50}" ${smallCaps(t.fgDim, 9, 2)}>pages</text>
      ${box(sx + 30, sy + 60, 240, 32, t)}
      <text x="${sx + 44}" y="${sy + 81}" ${mono(t.fg, 12)}>Landing</text>
      ${box(sx + 290, sy + 60, 240, 32, t)}
      <text x="${sx + 304}" y="${sy + 81}" ${mono(t.fg, 12)}>Spawn  <tspan fill="${t.accent}">· what if</tspan></text>
      ${box(sx + 30, sy + 102, 240, 32, t)}
      <text x="${sx + 44}" y="${sy + 123}" ${mono(t.fg, 12)}>Restore  <tspan fill="${t.fgDim}">· coming soon</tspan></text>
      ${box(sx + 290, sy + 102, 240, 32, t)}
      <text x="${sx + 304}" y="${sy + 123}" ${mono(t.fg, 12)}>Settings</text>

      <text x="${sx + 30}" y="${sy + 180}" ${smallCaps(t.fgDim, 9, 2)}>components</text>
      ${box(sx + 30, sy + 192, 500, 64, t, { fill: t.bgElev })}
      <text x="${sx + 46}" y="${sy + 217}" ${mono(t.fgSoft, 11)}>Timeline · ForkCard · Importer · Crowd</text>
      <text x="${sx + 46}" y="${sy + 238}" ${mono(t.fgSoft, 11)}>Akinator · Nav · Themes · Language · Icons</text>

      <text x="${sx + 30}" y="${sy + 300}" ${smallCaps(t.fgDim, 9, 2)}>lib</text>
      ${box(sx + 30, sy + 312, 240, 100, t, { fill: t.bgElev })}
      <text x="${sx + 46}" y="${sy + 337}" ${mono(t.fg, 11)}>llm/</text>
      <text x="${sx + 46}" y="${sy + 357}" ${mono(t.fgDim, 10)}>providers · callLLM</text>
      <text x="${sx + 46}" y="${sy + 377}" ${mono(t.fgDim, 10)}>unified streaming</text>
      <text x="${sx + 46}" y="${sy + 397}" ${mono(t.fgDim, 10)}>retry · error map</text>

      ${box(sx + 290, sy + 312, 240, 100, t, { fill: t.bgElev })}
      <text x="${sx + 306}" y="${sy + 337}" ${mono(t.fg, 11)}>prompts · i18n · store</text>
      <text x="${sx + 306}" y="${sy + 357}" ${mono(t.fgDim, 10)}>spawnPrompt · extractPrompt</text>
      <text x="${sx + 306}" y="${sy + 377}" ${mono(t.fgDim, 10)}>presets · 8 locales</text>
      <text x="${sx + 306}" y="${sy + 397}" ${mono(t.fgDim, 10)}>Zustand store</text>

      <text x="${sx + 30}" y="${sy + 458}" ${smallCaps(t.fgDim, 9, 2)}>localStorage</text>
      ${box(sx + 30, sy + 470, 500, 50, t, { fill: t.bgElev, stroke: t.accent })}
      <text x="${sx + 46}" y="${sy + 502}" ${mono(t.accent, 11)}>▢ apiKey · provider · model · language · theme</text>
    </g>
  `

  // Right — Providers
  const px = 1220, py = 220
  const providers = [
    { name: "Anthropic", note: "Claude" },
    { name: "OpenAI", note: "gpt-4 · o3" },
    { name: "Google", note: "Gemini" },
    { name: "DeepSeek", note: "" },
    { name: "Qwen", note: "通义" },
    { name: "Kimi", note: "Moonshot" },
    { name: "GLM", note: "智谱" },
    { name: "Doubao", note: "豆包" },
  ]
  const prov = `
    <g>
      ${sectionHeader(px, py - 30, 280, "providers · byo key", t)}
      ${box(px, py, 280, 540, t)}
      <text x="${px + 20}" y="${py + 38}" ${smallCaps(t.fgDim, 9, 2)}>global</text>
      ${providers.slice(0, 3).map((p, i) => `
        <g>
          ${box(px + 20, py + 50 + i * 50, 240, 40, t, { fill: t.bg })}
          <circle cx="${px + 38}" cy="${py + 70 + i * 50}" r="4" fill="${t.accent}"/>
          <text x="${px + 54}" y="${py + 75 + i * 50}" ${body(t.fg, 13)}>${p.name}</text>
          <text x="${px + 250}" y="${py + 75 + i * 50}" text-anchor="end" ${mono(t.fgDim, 10)}>${p.note}</text>
        </g>`).join("")}

      <text x="${px + 20}" y="${py + 230}" ${smallCaps(t.fgDim, 9, 2)}>china</text>
      ${providers.slice(3).map((p, i) => `
        <g>
          ${box(px + 20, py + 244 + i * 50, 240, 40, t, { fill: t.bg })}
          <circle cx="${px + 38}" cy="${py + 264 + i * 50}" r="4" fill="${t.burn}"/>
          <text x="${px + 54}" y="${py + 269 + i * 50}" ${body(t.fg, 13)}>${p.name}</text>
          <text x="${px + 250}" y="${py + 269 + i * 50}" text-anchor="end" ${mono(t.fgDim, 10)}>${p.note}</text>
        </g>`).join("")}
    </g>
  `

  const flow = `
    <g>
      ${curve(380, 470, 510, 470, t)}
      <text x="445" y="455" text-anchor="middle" ${smallCaps(t.fgDim, 9, 1.6)}>open</text>
      <path d="M1090,440 C1140,440 1170,460 1220,460" stroke="${t.accent}" stroke-width="1.6" fill="none" marker-end="url(#arrow-accent-${t.name})"/>
      <text x="1155" y="448" text-anchor="middle" ${smallCaps(t.accent, 9, 1.6)}>request · with your key</text>
      <path d="M1220,510 C1170,510 1140,490 1090,490" stroke="${t.fgDim}" stroke-width="1.6" fill="none" marker-end="url(#arrow-${t.name})"/>
      <text x="1155" y="528" text-anchor="middle" ${smallCaps(t.fgDim, 9, 1.6)}>streamed fork text</text>
    </g>
  `

  const foot = `
    <g>
      <line x1="${W / 2 - 280}" y1="858" x2="${W / 2 + 280}" y2="858" stroke="${t.line}" stroke-width="1"/>
      <text x="${W / 2}" y="892" text-anchor="middle" ${body(t.fgDim, 12)}>no proxy · no logging server · the request goes from your browser straight to the model provider you chose.</text>
    </g>
  `

  return svgShell(W, H, t, head + user + spa + prov + flow + foot, "mighta architecture")
}

// ─────────────── 2 · SPAWN FLOW ───────────────

function diagramSpawnFlow(t) {
  const W = 1600, H = 720

  const head = `
    <g>
      <text x="${W / 2}" y="58" text-anchor="middle" ${smallCaps(t.accent, 11, 3.2)}>spawn pipeline</text>
      <text x="${W / 2}" y="102" text-anchor="middle" ${serif(t.fg, 28)}>from one fork to a fan of lives</text>
      <text x="${W / 2}" y="132" text-anchor="middle" ${body(t.fgDim, 13)}>a single click splits into a few thousand prompt tokens and a fan of futures</text>
      <line x1="${W / 2 - 60}" y1="150" x2="${W / 2 + 60}" y2="150" stroke="${t.accent}" stroke-width="1" opacity="0.6"/>
    </g>
  `

  const stages = [
    { label: "01 · seed", title: "your fork", bullets: ["name · age", "the moment it forked", "the road taken"], caption: "what really happened" },
    { label: "02 · prompt", title: "system prompt", bullets: ["localized vibe table", "constraints · distinct lives", "specific, restrained, literary"], caption: "buildSpawnSystem()" },
    { label: "03 · llm", title: "swarm call", bullets: ["one provider · one stream", "any of 8 models", "byo key"], caption: "callLLM()" },
    { label: "04 · parse", title: "raw → fork", bullets: ["RawFork[] → ForkVersion[]", "vibe · trajectory · outcome", "schema-validated"], caption: "parseForks()" },
    { label: "05 · render", title: "two ways to read", bullets: ["timeline · branching SVG", "cards · stacked long-read", "one click between"], caption: "Timeline / ForkCard" },
  ]

  const bw = 270, bh = 360
  const gap = (W - stages.length * bw) / (stages.length + 1)
  const by = 220

  const cards = stages.map((s, i) => {
    const x = gap + i * (bw + gap)
    return `
      <g>
        ${box(x, by, bw, bh, t)}
        <text x="${x + bw / 2}" y="${by + 38}" text-anchor="middle" ${smallCaps(t.accent, 9, 2.2)}>${s.label}</text>
        <text x="${x + bw / 2}" y="${by + 78}" text-anchor="middle" ${serif(t.fg, 22)}>${s.title}</text>
        <line x1="${x + bw / 2 - 30}" y1="${by + 98}" x2="${x + bw / 2 + 30}" y2="${by + 98}" stroke="${t.accent}" stroke-width="1" opacity="0.7"/>
        ${s.bullets.map((b, j) => `
          <g>
            <circle cx="${x + 36}" cy="${by + 142 + j * 36}" r="2.5" fill="${t.accent}"/>
            <text x="${x + 50}" y="${by + 146 + j * 36}" ${body(t.fgSoft, 13)}>${b}</text>
          </g>`).join("")}
        <line x1="${x + 24}" y1="${by + bh - 60}" x2="${x + bw - 24}" y2="${by + bh - 60}" stroke="${t.line}" stroke-width="1"/>
        <text x="${x + bw / 2}" y="${by + bh - 32}" text-anchor="middle" ${mono(t.fgDim, 11)}>${s.caption}</text>
      </g>
    `
  }).join("")

  const arrows = stages.slice(0, -1).map((_, i) => {
    const x1 = gap + (i + 1) * bw + i * gap + 12
    const x2 = gap + (i + 1) * (bw + gap) - 12
    const y = by + bh / 2
    return `<path d="M${x1},${y} L${x2 - 10},${y}" stroke="${t.fgDim}" stroke-width="1.4" fill="none" marker-end="url(#arrow-${t.name})" opacity="0.65"/>`
  }).join("")

  const foot = `
    <g>
      <line x1="${W / 2 - 220}" y1="624" x2="${W / 2 + 220}" y2="624" stroke="${t.line}" stroke-width="1"/>
      <text x="${W / 2}" y="660" text-anchor="middle" ${body(t.fgDim, 13)}>one seed yields a fan of lives · trajectory spans ages 19 → 80 · ≈ 4–8 sec end-to-end on a fast model</text>
    </g>
  `

  return svgShell(W, H, t, head + cards + arrows + foot, "spawn pipeline")
}

// ─────────────── 3 · FORK ANATOMY ───────────────

function diagramForkAnatomy(t) {
  const W = 1600, H = 940

  const head = `
    <g>
      <text x="${W / 2}" y="58" text-anchor="middle" ${smallCaps(t.accent, 11, 3.2)}>fork · anatomy</text>
      <text x="${W / 2}" y="102" text-anchor="middle" ${serif(t.fg, 28)}>what a single life looks like</text>
      <text x="${W / 2}" y="132" text-anchor="middle" ${body(t.fgDim, 13)}>five parts · one vibe · ageable from 19 to 80 in three sentences</text>
      <line x1="${W / 2 - 60}" y1="150" x2="${W / 2 + 60}" y2="150" stroke="${t.accent}" stroke-width="1" opacity="0.6"/>
    </g>
  `

  const schemaX = 110, schemaY = 230, schemaW = 600
  const fields = [
    { key: "divergence", type: "{ age, event }", note: "the moment it forked", color: t.accent },
    { key: "alternative", type: "string", note: "the road not taken", color: t.fg },
    { key: "trajectory", type: "TrajectoryNode[]", note: "3–5 ages along the new road", color: t.fg },
    { key: "outcome", type: "string", note: "where it ended", color: t.fg },
    { key: "vibe", type: "shine | ash | drift | quiet | burn", note: "tints every render", color: t.fgSoft },
  ]
  const schema = `
    <g>
      ${sectionHeader(schemaX, schemaY - 30, schemaW, "schema · ForkVersion", t)}
      ${box(schemaX, schemaY, schemaW, 480, t)}
      ${fields.map((f, i) => `
        <g>
          <text x="${schemaX + 28}" y="${schemaY + 50 + i * 88}" ${smallCaps(t.fgDim, 9, 1.8)}>${String(i + 1).padStart(2, "0")}</text>
          <text x="${schemaX + 70}" y="${schemaY + 50 + i * 88}" ${mono(f.color, 14)}>${f.key}</text>
          <text x="${schemaX + schemaW - 28}" y="${schemaY + 50 + i * 88}" text-anchor="end" ${mono(t.fgDim, 11)}>${f.type}</text>
          <text x="${schemaX + 70}" y="${schemaY + 72 + i * 88}" ${body(t.fgSoft, 12)}>${f.note}</text>
          ${i < fields.length - 1 ? `<line x1="${schemaX + 28}" y1="${schemaY + 96 + i * 88}" x2="${schemaX + schemaW - 28}" y2="${schemaY + 96 + i * 88}" stroke="${t.line}" stroke-width="1"/>` : ""}
        </g>`).join("")}
    </g>
  `

  const sampleX = 800, sampleY = 230, sampleW = 690
  const sample = `
    <g>
      ${sectionHeader(sampleX, sampleY - 30, sampleW, "example · jobs · ash", t)}
      ${box(sampleX, sampleY, sampleW, 480, t)}
      <rect x="${sampleX}" y="${sampleY}" width="6" height="480" fill="${t.ash}"/>
      <text x="${sampleX + 36}" y="${sampleY + 50}" ${smallCaps(t.ash, 10, 2)}>vibe · ash</text>

      <text x="${sampleX + 36}" y="${sampleY + 86}" ${smallCaps(t.fgDim, 9, 1.6)}>the moment</text>
      <text x="${sampleX + 36}" y="${sampleY + 110}" font-family="${serifStack}" font-size="18" font-style="italic" fill="${t.fg}">"dropped out of Reed College after one semester"</text>
      <text x="${sampleX + 36}" y="${sampleY + 134}" ${mono(t.fgDim, 11)}>at age 17</text>

      <line x1="${sampleX + 36}" y1="${sampleY + 156}" x2="${sampleX + sampleW - 36}" y2="${sampleY + 156}" stroke="${t.line}" stroke-width="1"/>

      <text x="${sampleX + 36}" y="${sampleY + 188}" ${smallCaps(t.fgDim, 9, 1.6)}>you mighta</text>
      <text x="${sampleX + 36}" y="${sampleY + 212}" ${body(t.fg, 13)}>took the engineering job at Atari and stayed.</text>

      <text x="${sampleX + 36}" y="${sampleY + 250}" ${smallCaps(t.fgDim, 9, 1.6)}>the road</text>
      ${[
        { age: 25, txt: "you ship the Lynx and become a respected hardware lead." },
        { age: 32, txt: "after the crash, you leave Atari with options worth nothing." },
        { age: 45, txt: "you consult for Sega, divorced, contemplative." },
      ].map((n, i) => `
        <g>
          <circle cx="${sampleX + 50}" cy="${sampleY + 286 + i * 44}" r="3" fill="${t.ash}"/>
          <text x="${sampleX + 66}" y="${sampleY + 274 + i * 44}" ${mono(t.ash, 11)}>age ${n.age}</text>
          <text x="${sampleX + 66}" y="${sampleY + 292 + i * 44}" ${body(t.fgSoft, 12)}>${n.txt}</text>
        </g>`).join("")}

      <line x1="${sampleX + 36}" y1="${sampleY + 408}" x2="${sampleX + sampleW - 36}" y2="${sampleY + 408}" stroke="${t.ash}" stroke-width="1" opacity="0.6"/>

      <text x="${sampleX + 36}" y="${sampleY + 434}" ${smallCaps(t.fgDim, 9, 1.6)}>where it ended</text>
      <text x="${sampleX + 36}" y="${sampleY + 458}" ${body(t.fg, 13)}>you are a comfortable middle-class engineer.</text>
      <text x="${sampleX + 36}" y="${sampleY + 476}" ${body(t.fgSoft, 12)}>Wozniak built Apple alone, and it is good but smaller.</text>
    </g>
  `

  const vibes = [
    { name: "shine", color: t.shine, gloss: "the version that worked" },
    { name: "ash", color: t.ash, gloss: "after the fire is out" },
    { name: "drift", color: t.drift, gloss: "elsewhere, quietly" },
    { name: "quiet", color: t.quiet, gloss: "smaller, gentler" },
    { name: "burn", color: t.burn, gloss: "the version that broke" },
  ]
  const ly = 770
  const lw = 1380
  const lstep = lw / vibes.length
  const legend = `
    <g>
      ${sectionHeader(110, ly - 24, lw, "five vibes · five lives", t)}
      ${box(110, ly, lw, 110, t)}
      ${vibes.map((v, i) => `
        <g>
          <rect x="${110 + 28 + i * lstep}" y="${ly + 30}" width="34" height="6" rx="3" fill="${v.color}"/>
          <text x="${110 + 28 + i * lstep}" y="${ly + 64}" ${mono(v.color, 14)}>${v.name}</text>
          <text x="${110 + 28 + i * lstep}" y="${ly + 86}" ${body(t.fgSoft, 12)}>${v.gloss}</text>
        </g>`).join("")}
    </g>
  `

  return svgShell(W, H, t, head + schema + sample + legend, "fork anatomy")
}

// ─────────────── 4 · CODEBASE ───────────────

function diagramCodebase(t) {
  const W = 1600, H = 1080

  const head = `
    <g>
      <text x="${W / 2}" y="58" text-anchor="middle" ${smallCaps(t.accent, 11, 3.2)}>codebase · src/</text>
      <text x="${W / 2}" y="102" text-anchor="middle" ${serif(t.fg, 28)}>how the code is laid out</text>
      <text x="${W / 2}" y="132" text-anchor="middle" ${body(t.fgDim, 13)}>four lobes · one shared store · eight locales</text>
      <line x1="${W / 2 - 60}" y1="150" x2="${W / 2 + 60}" y2="150" stroke="${t.accent}" stroke-width="1" opacity="0.6"/>
    </g>
  `

  const lobes = [
    { title: "pages", caption: "one file per route", items: [
      { name: "Landing.tsx", note: "hero · two doors · drifting crowd" },
      { name: "Spawn.tsx", note: "seed → spawn → timeline/cards" },
      { name: "Restore.tsx", note: "placeholder · coming soon" },
      { name: "Settings.tsx", note: "provider · model · key · lang" },
    ]},
    { title: "components", caption: "visual primitives", items: [
      { name: "Timeline.tsx", note: "branching SVG · 6 lanes" },
      { name: "ForkCard.tsx", note: "single life as a chapter" },
      { name: "Importer.tsx", note: "drop bio · 3-stage modal" },
      { name: "Akinator.tsx", note: "narrow down a fork via Qs" },
      { name: "Crowd.tsx", note: "12 hand-drawn figures, drift" },
      { name: "Nav · Theme · Lang", note: "caret-anchored dropdowns" },
    ]},
    { title: "lib", caption: "logic and glue", items: [
      { name: "llm/", note: "provider registry · callLLM" },
      { name: "spawnPrompt.ts", note: "localized counterfactual system" },
      { name: "extractPrompt.ts", note: "bio text → structured forks" },
      { name: "presets.ts", note: "4 famous lives · 5 scenarios" },
      { name: "i18n.ts", note: "8 locales · browser auto-detect" },
      { name: "store.ts", note: "Zustand · spawn · settings" },
    ]},
    { title: "locales", caption: "eight languages", items: [
      { name: "en.json", note: "English" },
      { name: "zh.json", note: "简体中文" },
      { name: "zh-TW.json", note: "繁體中文" },
      { name: "ja.json", note: "日本語" },
      { name: "ko.json", note: "한국어" },
      { name: "es · fr · de", note: "Español · Français · Deutsch" },
    ]},
  ]

  const cw = 340
  const cgap = (W - lobes.length * cw) / (lobes.length + 1)
  const cy = 220

  const cols = lobes.map((lobe, i) => {
    const x = cgap + i * (cw + cgap)
    const ch = 100 + lobe.items.length * 70
    return `
      <g>
        ${box(x, cy, cw, ch, t)}
        <text x="${x + 28}" y="${cy + 40}" ${smallCaps(t.accent, 10, 2.2)}>${lobe.title}</text>
        <text x="${x + cw - 28}" y="${cy + 40}" text-anchor="end" ${mono(t.fgDim, 10)}>${lobe.caption}</text>
        <line x1="${x + 28}" y1="${cy + 58}" x2="${x + cw - 28}" y2="${cy + 58}" stroke="${t.accent}" stroke-width="1" opacity="0.6"/>
        ${lobe.items.map((it, j) => `
          <g>
            <circle cx="${x + 36}" cy="${cy + 92 + j * 70}" r="3" fill="${t.fgDim}"/>
            <text x="${x + 50}" y="${cy + 88 + j * 70}" ${mono(t.fg, 13)}>${it.name}</text>
            <text x="${x + 50}" y="${cy + 108 + j * 70}" ${body(t.fgSoft, 12)}>${it.note}</text>
          </g>`).join("")}
      </g>
    `
  }).join("")

  const ly = 880
  const footer = `
    <g>
      ${sectionHeader(110, ly, 1380, "what's shared across all four", t)}
      ${box(110, ly + 18, 1380, 140, t, { fill: t.bgSoft })}

      <text x="160" y="${ly + 60}" ${smallCaps(t.fgDim, 9, 2)}>state</text>
      <text x="160" y="${ly + 82}" ${body(t.fg, 13)}>Zustand store</text>
      <text x="160" y="${ly + 102}" ${mono(t.fgDim, 10)}>seed · versions · isGenerating</text>
      <text x="160" y="${ly + 122}" ${mono(t.fgDim, 10)}>credentials · activeProvider</text>

      <text x="460" y="${ly + 60}" ${smallCaps(t.fgDim, 9, 2)}>styling</text>
      <text x="460" y="${ly + 82}" ${body(t.fg, 13)}>Tailwind 4</text>
      <text x="460" y="${ly + 102}" ${mono(t.fgDim, 10)}>CSS variables · no config.js</text>
      <text x="460" y="${ly + 122}" ${mono(t.fgDim, 10)}>dark · light · auto</text>

      <text x="760" y="${ly + 60}" ${smallCaps(t.fgDim, 9, 2)}>motion</text>
      <text x="760" y="${ly + 82}" ${body(t.fg, 13)}>framer-motion</text>
      <text x="760" y="${ly + 102}" ${mono(t.fgDim, 10)}>entrance · hover · view-toggle</text>
      <text x="760" y="${ly + 122}" ${mono(t.fgDim, 10)}>whileInView for cards</text>

      <text x="1060" y="${ly + 60}" ${smallCaps(t.fgDim, 9, 2)}>type</text>
      <text x="1060" y="${ly + 82}" ${body(t.fg, 13)}>strict TS</text>
      <text x="1060" y="${ly + 102}" ${mono(t.fgDim, 10)}>zero \`any\` in product code</text>
      <text x="1060" y="${ly + 122}" ${mono(t.fgDim, 10)}>shared types in lib/store.ts</text>

      <text x="1340" y="${ly + 60}" ${smallCaps(t.fgDim, 9, 2)}>build</text>
      <text x="1340" y="${ly + 82}" ${body(t.fg, 13)}>Vite 8</text>
      <text x="1340" y="${ly + 102}" ${mono(t.fgDim, 10)}>rolldown · code-split</text>
      <text x="1340" y="${ly + 122}" ${mono(t.fgDim, 10)}>ghp via 404.html copy</text>
    </g>
  `

  return svgShell(W, H, t, head + cols + footer, "codebase layout")
}

// ─────────────── EMIT ───────────────

const DIAGRAMS = {
  "architecture": diagramArchitecture,
  "spawn-flow": diagramSpawnFlow,
  "fork-anatomy": diagramForkAnatomy,
  "codebase": diagramCodebase,
}

let count = 0
for (const [name, fn] of Object.entries(DIAGRAMS)) {
  for (const theme of Object.values(THEMES)) {
    const svg = fn(theme)
    const out = resolve(OUT, `diagram-${name}-${theme.name}.svg`)
    writeFileSync(out, svg)
    count++
    console.log(`  ✓ ${out.split("/").slice(-2).join("/")}  (${(svg.length / 1024).toFixed(1)} kb)`)
  }
}
console.log(`\ngenerated ${count} svg files in ${OUT.split("/").slice(-2).join("/")}/`)
