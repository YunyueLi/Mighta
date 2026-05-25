/**
 * Take 8 screenshots for docs/ using a real Chrome.
 *
 *   node scripts/screenshot.mjs
 *
 * Requires dev server running at http://localhost:5173
 */

import puppeteer from "puppeteer-core"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const DOCS = path.join(ROOT, "docs")

const CHROME =
  process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "google-chrome"

const BASE = "http://localhost:5173"
const W = 1600
const H = 1000

// Each shot: file, route, theme, lang, optional setup (eval before screenshot)
const SHOTS = [
  { file: "hero-dark.png", route: "/", theme: "dark", lang: "en" },
  { file: "hero-light.png", route: "/", theme: "light", lang: "en" },
  { file: "landing-dark.png", route: "/", theme: "dark", lang: "en", scroll: 720 },
  { file: "landing-light.png", route: "/", theme: "light", lang: "en", scroll: 720 },
  { file: "spawn-dark.png", route: "/spawn", theme: "dark", lang: "en" },
  { file: "spawn-light.png", route: "/spawn", theme: "light", lang: "en" },
  { file: "settings.png", route: "/settings", theme: "dark", lang: "en" },
  {
    file: "importer.png",
    route: "/spawn",
    theme: "dark",
    lang: "en",
    afterLoad: async (page) => {
      // open the import modal
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll("button")).find((b) =>
          b.textContent?.includes("import")
        )
        btn?.click()
      })
      await new Promise((r) => setTimeout(r, 600))
    },
  },
  // ── timeline + cards: inject mock generated forks so the result UI renders without an API call
  {
    file: "timeline.png",
    route: "/spawn",
    theme: "dark",
    lang: "en",
    inject: injectMockResults,
    view: "timeline",
  },
  {
    file: "cards.png",
    route: "/spawn",
    theme: "dark",
    lang: "en",
    inject: injectMockResults,
    view: "cards",
  },
]

function injectMockResults(page) {
  return page.evaluate(() => {
    // Pre-fill the spawn store with a seed + 6 mock forks so the results view renders
    const seed = {
      name: "Steve Jobs",
      age: 56,
      bio: "Co-founded a personal computer company in a garage.",
      nodes: [
        { id: "a", age: 17, event: "Dropped out of Reed College" },
        { id: "b", age: 21, event: "Co-founded Apple with Wozniak" },
        { id: "c", age: 30, event: "Pushed out of Apple" },
        { id: "d", age: 41, event: "Returned via NeXT acquisition" },
      ],
    }
    const trajectoryFor = (a) => [
      { age: a + 1, moment: "the year after", state: "Lost in a new city, taking small contract gigs." },
      { age: a + 5, moment: "five years in", state: "Found something — a partner, a project, a quiet shape." },
      { age: a + 12, moment: "by his thirties", state: "Built a small reputation. The work, not famous." },
      { age: a + 20, moment: "twenty years on", state: "Comfortable. Sometimes wonders, in a clean apartment." },
    ]
    const versions = [
      { id: "1", divergence: { id: "a", age: 17, event: "Dropped out of Reed College" }, alternative: "Stayed at Reed and finished calligraphy with Robert Palladino. Became a typographer in Portland.", trajectory: trajectoryFor(17), outcome: "Settled, slightly bored, exquisite letterforms. Never built a billion-dollar company. Sleeps better.", vibe: "quiet" },
      { id: "2", divergence: { id: "b", age: 21, event: "Co-founded Apple with Wozniak" }, alternative: "Took the Atari engineering job permanently. Never quit.", trajectory: trajectoryFor(21), outcome: "Senior engineer at Atari. Burned out by 35. Late nights and bad coffee. A divorce, a daughter he barely knew.", vibe: "ash" },
      { id: "3", divergence: { id: "c", age: 30, event: "Pushed out of Apple" }, alternative: "Won the board fight and stayed. No NeXT. No exile. No bend.", trajectory: trajectoryFor(30), outcome: "CEO continuous since 24. Tyrannical. Apple is a worse company. He never met Pixar. Lonelier.", vibe: "burn" },
      { id: "4", divergence: { id: "d", age: 41, event: "Returned via NeXT acquisition" }, alternative: "Stayed at NeXT. Apple bought a different OS.", trajectory: trajectoryFor(41), outcome: "NeXT survived as a research lab. He died in 2003 of cancer caught late. The iPhone was made by Sony.", vibe: "drift" },
      { id: "5", divergence: { id: "a", age: 17, event: "Dropped out of Reed College" }, alternative: "Joined an ashram in India and never returned to electronics.", trajectory: trajectoryFor(17), outcome: "A Zen teacher in northern California. Calm. Speaks little. People come to him.", vibe: "shine" },
      { id: "6", divergence: { id: "b", age: 21, event: "Co-founded Apple with Wozniak" }, alternative: "Went solo, no Woz. Built a hobby kit that never scaled.", trajectory: trajectoryFor(21), outcome: "A footnote in early hobbyist computing. Sold the company in 1984 for parts. Real estate broker by 50.", vibe: "ash" },
    ]
    const store = JSON.parse(localStorage.getItem("__mighta-spawn") || "{}")
    // useSpawn store is non-persisted, so we can't preload via localStorage. Instead use window hack.
    // We register a global the page can hydrate from on next render — but a no-op here.
    // Better: dispatch a custom event the React app could listen to. We skip and rely on JSON in window.
    window.__mockVersions = versions
    window.__mockSeed = seed
  })
}

async function setup() {
  fs.mkdirSync(DOCS, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    defaultViewport: { width: W, height: H },
  })
  return browser
}

async function setStorage(page, theme, lang) {
  await page.goto(BASE, { waitUntil: "networkidle2", timeout: 30_000 })
  await page.evaluate(
    (theme, lang) => {
      localStorage.setItem(
        "mighta-settings-v2",
        JSON.stringify({
          state: {
            theme,
            language: lang,
            activeProvider: "anthropic",
            creds: {},
          },
          version: 0,
        })
      )
      localStorage.setItem("mighta-lang", lang)
    },
    theme,
    lang
  )
}

async function main() {
  const browser = await setup()
  const page = await browser.newPage()

  for (const shot of SHOTS) {
    process.stdout.write(`  ${shot.file} ... `)
    await setStorage(page, shot.theme, shot.lang)

    // inject mock data BEFORE navigating to the route, so the store starts hydrated.
    // useSpawn is non-persisted, so we install a hydration hook on window.
    if (shot.inject) {
      await page.evaluateOnNewDocument(`
        (function() {
          const versions = ${JSON.stringify((() => {
            // duplicate of injectMockResults's data, inlined
            const trajectoryFor = (a) => [
              { age: a + 1, moment: "the year after", state: "Lost in a new city, taking small contract gigs." },
              { age: a + 5, moment: "five years in", state: "Found something — a partner, a project, a quiet shape." },
              { age: a + 12, moment: "by his thirties", state: "Built a small reputation. The work, not famous." },
              { age: a + 20, moment: "twenty years on", state: "Comfortable. Sometimes wonders, in a clean apartment." },
            ]
            return [
              { id: "1", divergence: { id: "a", age: 17, event: "Dropped out of Reed College" }, alternative: "Stayed at Reed and finished calligraphy with Robert Palladino. Became a typographer in Portland.", trajectory: trajectoryFor(17), outcome: "Settled, slightly bored, exquisite letterforms. Never built a billion-dollar company. Sleeps better.", vibe: "quiet" },
              { id: "2", divergence: { id: "b", age: 21, event: "Co-founded Apple with Wozniak" }, alternative: "Took the Atari engineering job permanently. Never quit.", trajectory: trajectoryFor(21), outcome: "Senior engineer at Atari. Burned out by 35. Late nights and bad coffee.", vibe: "ash" },
              { id: "3", divergence: { id: "c", age: 30, event: "Pushed out of Apple" }, alternative: "Won the board fight and stayed.", trajectory: trajectoryFor(30), outcome: "CEO continuous since 24. Tyrannical. Apple is a worse company.", vibe: "burn" },
              { id: "4", divergence: { id: "d", age: 41, event: "Returned via NeXT acquisition" }, alternative: "Stayed at NeXT. Apple bought a different OS.", trajectory: trajectoryFor(41), outcome: "NeXT survived as a research lab. He died in 2003.", vibe: "drift" },
              { id: "5", divergence: { id: "a", age: 17, event: "Dropped out of Reed College" }, alternative: "Joined an ashram in India.", trajectory: trajectoryFor(17), outcome: "A Zen teacher in northern California. Calm. Speaks little.", vibe: "shine" },
              { id: "6", divergence: { id: "b", age: 21, event: "Co-founded Apple with Wozniak" }, alternative: "Went solo, no Woz.", trajectory: trajectoryFor(21), outcome: "A footnote in early hobbyist computing.", vibe: "ash" },
            ]
          })())};
          const seed = { name: "Steve Jobs", age: 56, bio: "Co-founded a personal computer company in a garage.", nodes: [
            { id: "a", age: 17, event: "Dropped out of Reed College" },
            { id: "b", age: 21, event: "Co-founded Apple with Wozniak" },
            { id: "c", age: 30, event: "Pushed out of Apple" },
            { id: "d", age: 41, event: "Returned via NeXT acquisition" },
          ]};
          window.__mockVersions = versions;
          window.__mockSeed = seed;
        })()
      `)
    }

    await page.goto(BASE + shot.route, { waitUntil: "networkidle2", timeout: 30_000 })

    // If we need to inject results, hydrate the spawn store directly via window.__useSpawn
    // (exposed by store.ts in DEV mode).
    if (shot.inject) {
      await page.evaluate(
        ({ view }) => {
          const versions = (window).__mockVersions
          const seed = (window).__mockSeed
          const store = (window).__useSpawn
          if (!store) {
            console.warn("__useSpawn not on window — store not exposed in DEV mode?")
            return
          }
          store.setState({ seed, versions, isGenerating: false })
          // Best-effort: store the desired view in sessionStorage for later
          if (view) sessionStorage.setItem("__mighta-view", view)
        },
        { view: shot.view }
      )
      // Wait for results phase to render
      await new Promise((r) => setTimeout(r, 1500))
      // Spawn.tsx reads view from React state. Click the view toggle button if needed.
      if (shot.view === "cards") {
        await page.evaluate(() => {
          // Look for the cards toggle button (text content exactly "cards")
          const btns = Array.from(document.querySelectorAll("button"))
          const cardsBtn = btns.find(
            (b) => b.textContent?.trim().toLowerCase() === "cards" && b.closest(".rounded-full")
          )
          cardsBtn?.click()
        })
        await new Promise((r) => setTimeout(r, 1200))
      }
    }

    await new Promise((r) => setTimeout(r, 1800))

    if (shot.scroll) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), shot.scroll)
      await new Promise((r) => setTimeout(r, 400))
    }
    if (shot.afterLoad) {
      await shot.afterLoad(page)
    }

    await page.screenshot({
      path: path.join(DOCS, shot.file),
      type: "png",
      fullPage: false,
    })
    process.stdout.write("✓\n")
  }

  await browser.close()
  console.log("\n  → done. open docs/ to see the shots.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
