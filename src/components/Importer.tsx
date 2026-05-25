import { useRef, useState, type DragEvent } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { Spinner, X, Check, ArrowLeft } from "./Icons"
import { callLLM } from "../lib/llm"
import { useSpawn, useActiveCreds } from "../lib/store"
import { buildExtractSystem, buildExtractUser, parseExtracted, type ExtractedSeed } from "../lib/extractPrompt"

const MAX_BYTES = 200_000

function newNodeId() {
  return Math.random().toString(36).slice(2, 9)
}

type Stage = "input" | "parsing" | "preview"

export default function Importer() {
  const { t, i18n } = useTranslation()
  const { setSeed } = useSpawn()
  const creds = useActiveCreds()
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<Stage>("input")
  const [text, setText] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [extracted, setExtracted] = useState<ExtractedSeed | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function reset() {
    setStage("input")
    setText("")
    setFileName(null)
    setError(null)
    setExtracted(null)
  }

  function close() {
    setOpen(false)
    setTimeout(reset, 200)
  }

  async function handleFile(file: File) {
    setError(null)
    if (file.size > MAX_BYTES) {
      setError(t("import.error_too_large"))
      return
    }
    const txt = await file.text()
    setText(txt)
    setFileName(file.name)
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await handleFile(file)
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  async function parse() {
    if (!creds) {
      setError(t("errors.missing_api_key"))
      return
    }
    if (!text.trim()) return
    setStage("parsing")
    setError(null)
    try {
      const out = await callLLM({
        provider: creds.providerId,
        model: creds.model,
        apiKey: creds.apiKey,
        system: buildExtractSystem(i18n.language),
        user: buildExtractUser(text),
        maxTokens: 1500,
        temperature: 0.2,
        mockInput: { kind: "extract", locale: i18n.language },
      })
      const seed = parseExtracted(out)
      setExtracted(seed)
      setStage("preview")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg === "model_parse" ? t("errors.model_parse") : msg)
      setStage("input")
    }
  }

  function apply() {
    if (!extracted) return
    setSeed({
      name: extracted.name,
      age: extracted.age,
      bio: extracted.bio,
      nodes: extracted.nodes.map((n) => ({ ...n, id: newNodeId() })),
    })
    close()
  }

  function updateExtractedNode(idx: number, patch: { age?: number; event?: string }) {
    if (!extracted) return
    const nodes = extracted.nodes.map((n, i) => (i === idx ? { ...n, ...patch } : n))
    setExtracted({ ...extracted, nodes })
  }

  function removeExtractedNode(idx: number) {
    if (!extracted) return
    setExtracted({ ...extracted, nodes: extracted.nodes.filter((_, i) => i !== idx) })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[12px] text-fg-dim hover:text-accent inline-flex items-center gap-1.5 transition-colors duration-300"
      >
        <span className="font-mono">↑</span> {t("import.trigger")}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-bg-elevated border border-line-bright rounded-lg overflow-hidden"
              style={{
                boxShadow:
                  "0 24px 60px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Header */}
              <div className="px-6 pt-5 pb-4 border-b border-line flex items-baseline justify-between gap-4">
                <div className="flex-1">
                  <p className="folio">{t("import.kicker")}</p>
                  <h2
                    className="mt-1 text-fg leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.4rem",
                      fontWeight: 460,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {stage === "preview" ? t("import.preview_title") : t("import.title")}
                  </h2>
                </div>
                {/* Stepper */}
                <div className="flex items-center gap-1.5 folio text-fg-faint">
                  <span className={stage === "input" ? "text-accent" : ""}>1</span>
                  <span>—</span>
                  <span className={stage === "parsing" ? "text-accent" : ""}>2</span>
                  <span>—</span>
                  <span className={stage === "preview" ? "text-accent" : ""}>3</span>
                </div>
                <button
                  onClick={close}
                  className="p-1.5 text-fg-dim hover:text-fg transition-colors"
                  aria-label="close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {/* Stage: input */}
                {stage === "input" && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-6"
                  >
                    <p className="text-fg-soft text-[13.5px] leading-relaxed mb-4 text-balance">
                      {t("import.description")}
                    </p>

                    {/* Drop zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragOver(true)
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative cursor-pointer border-2 border-dashed rounded-md p-5 mb-3 text-center transition-colors duration-300 ${
                        dragOver
                          ? "border-accent bg-accent/[0.05]"
                          : fileName
                          ? "border-line-bright bg-bg-soft/40"
                          : "border-line hover:border-line-bright hover:bg-bg-soft/40"
                      }`}
                    >
                      {fileName ? (
                        <div className="flex items-center justify-center gap-2">
                          <Check className="w-3.5 h-3.5 text-accent" />
                          <span className="text-fg text-[13px] font-mono">{fileName}</span>
                          <span className="folio text-fg-faint">
                            · {(text.length / 1000).toFixed(1)}k chars
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setFileName(null)
                              setText("")
                            }}
                            className="ml-2 text-fg-dim hover:text-accent transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-fg-soft text-[13px]">
                            <span className="script text-fg text-[17px] mr-1.5">
                              {t("import.drop_main")}
                            </span>
                            {t("import.drop_sub")}
                          </p>
                          <p className="folio mt-2 text-fg-faint">.txt · .md</p>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.md,text/plain,text/markdown"
                        onChange={onPick}
                        className="hidden"
                      />
                    </div>

                    <div className="text-center folio mb-3 text-fg-faint">{t("import.or")}</div>

                    <textarea
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value)
                        if (fileName) setFileName(null)
                      }}
                      placeholder={t("import.textarea_placeholder")}
                      rows={6}
                      className="w-full bg-bg border border-line rounded p-4 text-[14px] text-fg placeholder:text-fg-faint focus:outline-none focus:border-line-bright transition-colors resize-none leading-[1.7]"
                    />

                    {error && (
                      <p className="mt-3 text-[13px] text-[var(--color-rust)] leading-relaxed">
                        {error}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-5">
                      <p className="folio text-fg-faint flex-1">{t("import.note")}</p>
                      <button
                        onClick={parse}
                        disabled={!text.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-fg text-bg rounded-full text-[13px] font-medium hover:bg-accent disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-300"
                      >
                        {t("import.parse")} →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Stage: parsing */}
                {stage === "parsing" && (
                  <motion.div
                    key="parsing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-16 text-center"
                  >
                    <Spinner className="w-7 h-7 text-accent mx-auto mb-6" />
                    <p
                      className="serif-italic text-fg text-balance"
                      style={{ fontSize: "1.25rem" }}
                    >
                      {t("import.parsing_phrase")}
                    </p>
                  </motion.div>
                )}

                {/* Stage: preview */}
                {stage === "preview" && extracted && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-6"
                  >
                    <p className="folio text-fg-faint mb-5">{t("import.preview_review")}</p>

                    <div className="space-y-4">
                      <div className="flex items-baseline gap-4">
                        <span className="folio w-16 shrink-0">name</span>
                        <input
                          type="text"
                          value={extracted.name}
                          onChange={(e) =>
                            setExtracted({ ...extracted, name: e.target.value })
                          }
                          className="flex-1 bg-transparent border-b border-line py-1.5 text-[14px] text-fg focus:outline-none focus:border-accent transition-colors"
                        />
                        <input
                          type="number"
                          value={extracted.age}
                          onChange={(e) =>
                            setExtracted({ ...extracted, age: parseInt(e.target.value) || 0 })
                          }
                          className="w-16 bg-transparent border-b border-line py-1.5 text-[14px] text-fg focus:outline-none focus:border-accent transition-colors font-mono tabular text-center"
                        />
                      </div>

                      <div className="flex items-start gap-4">
                        <span className="folio w-16 shrink-0 pt-2">bio</span>
                        <textarea
                          value={extracted.bio}
                          onChange={(e) =>
                            setExtracted({ ...extracted, bio: e.target.value })
                          }
                          rows={2}
                          className="flex-1 bg-transparent border-b border-line py-1.5 text-[14px] text-fg focus:outline-none focus:border-accent transition-colors resize-none leading-[1.7]"
                        />
                      </div>

                      <div>
                        <p className="folio text-fg-faint mb-2">
                          {extracted.nodes.length} forks
                        </p>
                        <ul className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                          {extracted.nodes.map((n, i) => (
                            <li
                              key={i}
                              className="group flex items-baseline gap-3 py-2 border-b border-line"
                            >
                              <input
                                type="number"
                                value={n.age}
                                onChange={(e) =>
                                  updateExtractedNode(i, {
                                    age: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-12 bg-transparent border-b border-line py-1 text-[13px] text-fg focus:outline-none focus:border-accent transition-colors font-mono tabular text-center"
                              />
                              <input
                                type="text"
                                value={n.event}
                                onChange={(e) =>
                                  updateExtractedNode(i, { event: e.target.value })
                                }
                                className="flex-1 bg-transparent border-b border-line py-1 text-[13.5px] text-fg focus:outline-none focus:border-accent transition-colors"
                              />
                              <button
                                onClick={() => removeExtractedNode(i)}
                                className="text-fg-faint hover:text-[var(--color-rust)] transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-line">
                      <button
                        onClick={() => setStage("input")}
                        className="folio inline-flex items-center gap-2 hover:text-fg transition-colors duration-300"
                      >
                        <ArrowLeft className="w-3 h-3" /> {t("import.preview_back")}
                      </button>
                      <button
                        onClick={apply}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-fg text-bg rounded-full text-[13px] font-medium hover:bg-accent transition-colors duration-300"
                      >
                        <Check className="w-3.5 h-3.5" /> {t("import.preview_apply")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
