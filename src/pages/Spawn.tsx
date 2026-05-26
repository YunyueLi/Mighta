import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import Nav from "../components/Nav"
import ForkCard from "../components/ForkCard"
import Timeline from "../components/Timeline"
import Importer from "../components/Importer"
import Akinator, { type AkinatorSeed } from "../components/Akinator"
import { Plus, X, Spinner, ArrowLeft, ArrowRight, Sparkles } from "../components/Icons"
import { useSpawn, useActiveCreds, type ForkVersion } from "../lib/store"
import { callLLM } from "../lib/llm"
import { getProvider } from "../lib/llm/providers"
import { buildSpawnSystem, buildSpawnUser, parseForks, type RawFork } from "../lib/spawnPrompt"
import { getPresets } from "../lib/presets"

type Phase = "seed" | "generating" | "results"
type View = "timeline" | "cards"
type SeedMode = "form" | "akinator"

function newNodeId() {
  return Math.random().toString(36).slice(2, 9)
}

export default function Spawn() {
  const { t, i18n } = useTranslation()
  const {
    seed,
    versions,
    chain,
    isGenerating,
    setSeed,
    addNode,
    removeNode,
    setVersions,
    setGenerating,
    pushChain,
    popChainTo,
    reset,
  } = useSpawn()
  const creds = useActiveCreds()
  const [phase, setPhase] = useState<Phase>(versions.length > 0 ? "results" : "seed")
  const [view, setView] = useState<View>("timeline")
  const [seedMode, setSeedMode] = useState<SeedMode>("form")
  const [error, setError] = useState<string | null>(null)

  // Auto-sync phase when versions are externally hydrated (e.g. screenshot tool, future undo)
  useEffect(() => {
    if (versions.length > 0 && phase === "seed") setPhase("results")
  }, [versions.length, phase])

  const provider = creds ? getProvider(creds.providerId) : null
  const canGenerate = seed.age > 0 && seed.nodes.length > 0 && !!creds

  const presets = useMemo(() => getPresets(t), [t, i18n.language])
  const presetsByCategory = useMemo(
    () => ({
      famous: presets.filter((p) => p.category === "famous"),
      scenario: presets.filter((p) => p.category === "scenario"),
    }),
    [presets]
  )

  async function generate(reForkFrom?: ForkVersion) {
    if (!creds) return
    setError(null)
    setGenerating(true)
    setPhase("generating")

    // If this is a re-fork, push the source onto the chain stack
    const nextChain = reForkFrom ? [...chain, reForkFrom] : chain
    if (reForkFrom) pushChain(reForkFrom)

    try {
      const text = await callLLM({
        provider: creds.providerId,
        model: creds.model,
        apiKey: creds.apiKey,
        system: buildSpawnSystem(i18n.language),
        user: buildSpawnUser({
          ...seed,
          chain: nextChain.map((f) => ({
            divergence: f.divergence,
            alternative: f.alternative,
            outcome: f.outcome,
            vibe: f.vibe,
          })),
        }),
        maxTokens: 4096,
        temperature: 0.85,
        mockInput: { kind: "spawn", seed, locale: i18n.language, chain: nextChain },
      })
      const raw = parseForks(text)
      const forks: RawFork[] = raw.map((f, i) => ({ ...f, id: `${Date.now()}-${i}` }))
      setVersions(
        forks.map((f) => ({
          id: f.id!,
          divergence: { id: f.id!, age: f.divergence.age, event: f.divergence.event },
          alternative: f.divergence.alternative,
          trajectory: f.trajectory,
          outcome: f.outcome,
          vibe: f.vibe,
        }))
      )
      setPhase("results")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg === "missing_api_key" || msg === "model_parse") {
        setError(t(`errors.${msg}`))
      } else {
        setError(msg)
      }
      setPhase("seed")
    } finally {
      setGenerating(false)
    }
  }

  function loadExample(id: string) {
    const ex = presets.find((p) => p.id === id)
    if (!ex) return
    setSeed({
      name: ex.name,
      age: ex.age,
      bio: ex.bio,
      nodes: ex.nodes.map((n) => ({ ...n, id: newNodeId() })),
    })
  }

  return (
    <div className="min-h-screen">
      <Nav />

      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <header className="mb-14 text-center">
          <p className="small-caps text-[10.5px] text-fg-dim mb-5">{t("spawn.kicker")}</p>
          <h1
            className="text-fg leading-[1.05] text-balance"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: "clamp(1.875rem, 4vw, 3.5rem)",
              fontWeight: 460,
              letterSpacing: '-0.022em',
            }}
          >
            {t("spawn.title")}
          </h1>
          <p className="mt-5 text-fg-soft text-[15px] max-w-xl mx-auto leading-[1.7]">
            {t("spawn.subtitle")}
          </p>
        </header>

        <AnimatePresence mode="wait">
          {phase === "seed" && (
            <motion.section
              key="seed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {seedMode === "akinator" ? (
                <Akinator
                  onBack={() => setSeedMode("form")}
                  onComplete={(s: AkinatorSeed) => {
                    setSeed({ name: s.name, age: s.age, bio: s.bio, nodes: [] })
                    // add nodes individually (assign ids)
                    s.nodes.forEach((n) =>
                      addNode({ id: newNodeId(), age: n.age, moment: n.moment, event: n.event })
                    )
                    // auto-generate after a beat
                    setTimeout(() => generate(), 200)
                  }}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSeedMode("akinator")}
                      className="group text-[13px] text-accent hover:text-fg transition-colors duration-300 inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="serif-italic">{t("akinator.trigger")}</span>
                    </button>
                    <Importer />
                  </div>
                  <SeedForm seed={seed} setSeed={setSeed} addNode={addNode} removeNode={removeNode} />

              {/* Presets */}
              <div className="space-y-5">
                <div>
                  <p className="small-caps text-[10.5px] text-fg-dim mb-3">
                    {t("preset.category_famous")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {presetsByCategory.famous.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => loadExample(ex.id)}
                        className="group px-4 py-2 rounded-full border border-line hover:border-line-bright hover:bg-bg-elevated text-[13px] inline-flex items-baseline gap-2 transition-colors duration-300"
                      >
                        <span className="script text-fg text-[15px]">{ex.name}</span>
                        <span className="folio">
                          {ex.age} · {ex.nodes.length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="small-caps text-[10.5px] text-fg-dim mb-3">
                    {t("preset.category_scenario")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {presetsByCategory.scenario.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => loadExample(ex.id)}
                        className="group px-4 py-2 rounded-full border border-line hover:border-line-bright hover:bg-bg-elevated text-[13px] inline-flex items-baseline gap-2 transition-colors duration-300"
                      >
                        <span className="script text-fg text-[15px]">{ex.name}</span>
                        <span className="folio">
                          {ex.age} · {ex.nodes.length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status messages */}
              {!creds && (
                <div className="flex items-center justify-between gap-4 px-4 py-3 rounded border border-line bg-bg-elevated">
                  <span className="text-[14px] text-fg-soft">{t("spawn.no_key")}</span>
                  <Link
                    to="/settings"
                    className="text-[13px] text-accent hover:text-fg transition-colors duration-300 inline-flex items-center gap-1.5"
                  >
                    {t("spawn.set_key")}
                  </Link>
                </div>
              )}

              {error && (
                <div className="px-4 py-3 rounded border border-line bg-bg-elevated text-[14px] text-fg-soft">
                  {error}
                </div>
              )}

              {/* CTA */}
              <div className="pt-2 flex flex-col items-start gap-3">
                <button
                  onClick={() => generate()}
                  disabled={!canGenerate || isGenerating}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-fg text-bg rounded-full text-[14px] font-medium hover:bg-accent disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {t("spawn.generate")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {provider && creds && (
                  <p className="folio">{t("spawn.generate_meta", { model: creds.model })}</p>
                )}
              </div>
                </>
              )}
            </motion.section>
          )}

          {phase === "generating" && <Generating />}

          {phase === "results" && versions.length > 0 && (
            <motion.section
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Re-fork chain breadcrumb */}
              {chain.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2 text-[12px] folio">
                  <button
                    onClick={() => {
                      popChainTo(0)
                      reset()
                      setPhase("seed")
                    }}
                    className="hover:text-fg transition-colors"
                  >
                    {t("spawn.chain_root")}
                  </button>
                  {chain.map((f, i) => {
                    const idx = i
                    return (
                      <span key={i} className="inline-flex items-center gap-2">
                        <span className="text-fg-faint">→</span>
                        <button
                          onClick={() => {
                            popChainTo(idx)
                          }}
                          className="inline-flex items-center gap-1.5 hover:text-fg transition-colors"
                        >
                          <span className="script text-accent text-[14px]">
                            {["I", "II", "III", "IV", "V", "VI"][i] ?? `${i + 1}`}.
                          </span>
                          <span>{t(`vibe.${f.vibe}`)}</span>
                        </button>
                      </span>
                    )
                  })}
                  <span className="text-fg-faint mx-1">↳</span>
                  <span className="text-fg">{t("spawn.chain_here", { depth: chain.length + 1 })}</span>
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-3 mb-12 -mt-4">
                <div className="flex items-center gap-3 small-caps text-[10.5px] text-fg-dim">
                  <hr className="rule w-8" />
                  <span>
                    <span className="script text-accent text-base mr-1.5">{versions.length}</span>
                    {t("spawn.results_count", { count: "" }).replace(/^\d+\s*/, "")}
                  </span>
                  <hr className="rule w-8" />
                </div>

                <div className="flex items-center gap-3">
                  {/* View toggle */}
                  <div className="inline-flex p-0.5 rounded-full border border-line bg-bg-elevated">
                    <button
                      onClick={() => setView("timeline")}
                      className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase transition-colors duration-300 ${
                        view === "timeline"
                          ? "bg-bg-soft text-fg"
                          : "text-fg-dim hover:text-fg"
                      }`}
                    >
                      {t("spawn.view_timeline")}
                    </button>
                    <button
                      onClick={() => setView("cards")}
                      className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase transition-colors duration-300 ${
                        view === "cards"
                          ? "bg-bg-soft text-fg"
                          : "text-fg-dim hover:text-fg"
                      }`}
                    >
                      {t("spawn.view_cards")}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      reset()
                      setPhase("seed")
                    }}
                    className="folio inline-flex items-center gap-2 hover:text-fg transition-colors duration-300"
                  >
                    <ArrowLeft className="w-3 h-3" /> {t("spawn.reseed")}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {view === "timeline" ? (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Timeline
                      versions={versions}
                      onReFork={(v) => generate(v)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="cards"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid md:grid-cols-2 gap-4 md:gap-5"
                  >
                    {versions.map((v, i) => (
                      <ForkCard
                        key={v.id}
                        index={i}
                        onReFork={() => generate(v)}
                        fork={{
                          divergence: {
                            age: v.divergence.age,
                            event: v.divergence.event,
                            alternative: v.alternative,
                          },
                          trajectory: v.trajectory,
                          outcome: v.outcome,
                          vibe: v.vibe,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function SeedForm({
  seed,
  setSeed,
  addNode,
  removeNode,
}: {
  seed: ReturnType<typeof useSpawn.getState>["seed"]
  setSeed: ReturnType<typeof useSpawn.getState>["setSeed"]
  addNode: ReturnType<typeof useSpawn.getState>["addNode"]
  removeNode: ReturnType<typeof useSpawn.getState>["removeNode"]
}) {
  const { t } = useTranslation()
  const [draftMoment, setDraftMoment] = useState("")
  const [draftAge, setDraftAge] = useState<number>(20)
  const [draftEvent, setDraftEvent] = useState("")

  function commitNode() {
    if (!draftEvent.trim()) return
    addNode({
      id: newNodeId(),
      age: draftAge,
      moment: draftMoment.trim() || undefined,
      event: draftEvent.trim(),
    })
    setDraftEvent("")
    setDraftMoment("")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <Field label={t("spawn.field_name")} className="col-span-2">
          <UnderlineInput
            value={seed.name}
            onChange={(v) => setSeed({ name: v })}
            placeholder={t("spawn.field_name_placeholder")}
          />
        </Field>
        <Field label={t("spawn.field_age")}>
          <UnderlineInput
            type="number"
            value={String(seed.age || "")}
            onChange={(v) => setSeed({ age: parseInt(v) || 0 })}
            placeholder="30"
            mono
          />
        </Field>
      </div>

      <Field label={t("spawn.field_bio")}>
        <textarea
          value={seed.bio}
          onChange={(e) => setSeed({ bio: e.target.value })}
          placeholder={t("spawn.field_bio_placeholder")}
          rows={3}
          className="w-full bg-bg-elevated border border-line rounded p-4 text-[14px] text-fg placeholder:text-fg-faint focus:outline-none focus:border-line-bright transition-colors resize-none leading-[1.7]"
        />
      </Field>

      <Field label={t("spawn.field_forks")}>
        {seed.nodes.length > 0 && (
          <ul className="mb-4 divide-y divide-line border-y border-line">
            {seed.nodes.map((n) => (
              <li key={n.id} className="flex items-baseline gap-4 py-3 group">
                <div className="flex flex-col items-start w-36 shrink-0">
                  {n.moment && (
                    <span className="script text-fg text-[15px] leading-tight">{n.moment}</span>
                  )}
                  <span className="folio tabular">
                    {n.moment ? `~${n.age}` : `age ${n.age}`}
                  </span>
                </div>
                <span className="text-[14px] text-fg flex-1 leading-relaxed">{n.event}</span>
                <button
                  onClick={() => removeNode(n.id)}
                  className="text-fg-faint hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <input
              type="text"
              value={draftMoment}
              onChange={(e) => setDraftMoment(e.target.value)}
              placeholder={t("spawn.field_moment_placeholder")}
              className="w-44 bg-transparent border-b border-line py-2 text-[14px] script text-fg placeholder:text-fg-faint placeholder:not-italic focus:outline-none focus:border-accent transition-colors"
              style={{ fontSize: "15px" }}
            />
            <input
              type="number"
              value={draftAge}
              onChange={(e) => setDraftAge(parseInt(e.target.value) || 0)}
              className="w-14 bg-transparent border-b border-line py-2 text-[14px] text-fg focus:outline-none focus:border-accent transition-colors font-mono tabular text-center"
            />
            <input
              type="text"
              value={draftEvent}
              onChange={(e) => setDraftEvent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitNode()}
              placeholder={t("spawn.field_fork_placeholder")}
              className="flex-1 bg-transparent border-b border-line py-2 text-[14px] text-fg placeholder:text-fg-faint focus:outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={commitNode}
              disabled={!draftEvent.trim()}
              className="p-2 text-fg-dim hover:text-fg disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              aria-label="add"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="folio text-fg-faint text-[10px] pl-1">
            {t("spawn.field_forks_hint")}
          </p>
        </div>
      </Field>
    </div>
  )
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block ${className}`}>
      <span className="small-caps block text-[10.5px] text-fg-dim mb-3">{label}</span>
      {children}
    </label>
  )
}

function UnderlineInput({
  value,
  onChange,
  placeholder,
  type = "text",
  mono = false,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  mono?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-transparent border-b border-line py-2 text-[15px] text-fg placeholder:text-fg-faint focus:outline-none focus:border-accent transition-colors ${
        mono ? "font-mono tabular" : ""
      }`}
    />
  )
}

function Generating() {
  const { t } = useTranslation()
  const phrases = t("spawn.generating", { returnObjects: true }) as string[]
  const [phraseIdx, setPhraseIdx] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setPhraseIdx((i) => (i + 1) % phrases.length), 2400)
    return () => clearInterval(iv)
  }, [phrases.length])

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-32 text-center"
    >
      <div className="inline-block mb-10">
        <Spinner className="w-6 h-6 text-accent" />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={phraseIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
          className="serif-italic text-fg text-xl md:text-2xl text-balance max-w-md mx-auto"
        >
          {phrases[phraseIdx]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}
