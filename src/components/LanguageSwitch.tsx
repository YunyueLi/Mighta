import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion } from "framer-motion"
import { useSettings } from "../lib/store"
import { LANGUAGES, type LangCode } from "../lib/i18n"

function resolveLang(lang: string): string {
  if (lang === "auto") {
    const nav = navigator.language
    if (nav.startsWith("zh-TW") || nav.startsWith("zh-Hant")) return "zh-TW"
    if (nav.startsWith("zh")) return "zh"
    if (nav.startsWith("ja")) return "ja"
    if (nav.startsWith("ko")) return "ko"
    if (nav.startsWith("es")) return "es"
    if (nav.startsWith("fr")) return "fr"
    if (nav.startsWith("de")) return "de"
    return "en"
  }
  return lang
}

export default function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation()
  const { language, setLanguage } = useSettings()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resolved = resolveLang(language)
    if (i18n.language !== resolved) i18n.changeLanguage(resolved)
  }, [language, i18n])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]
  const resolvedShort = LANGUAGES.find((l) => l.code === resolveLang(language))?.short ?? "EN"

  if (compact) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={`px-2.5 py-1 text-[11px] tracking-[0.15em] rounded font-mono uppercase transition-colors duration-300 border ${
            open
              ? "border-line-bright text-fg bg-bg-elevated"
              : "border-line text-fg-dim hover:text-fg hover:border-line-bright"
          }`}
          aria-label="language"
          aria-expanded={open}
        >
          {current.code === "auto" ? `${resolvedShort}*` : current.short}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top right" }}
              className="absolute right-0 top-full mt-3 z-50 min-w-[224px]"
            >
              {/* Caret pointing up to trigger */}
              <div className="absolute -top-[5px] right-4 w-2.5 h-2.5 rotate-45 bg-bg-elevated border-l border-t border-line-bright" />

              <div
                className="relative bg-bg-elevated border border-line-bright rounded-md overflow-hidden"
                style={{
                  boxShadow:
                    "0 12px 40px -4px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.03)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Header */}
                <div className="px-4 pt-3 pb-2.5 border-b border-line flex items-baseline justify-between">
                  <span className="folio">language</span>
                  <span className="script text-fg-dim text-[13px]">choose</span>
                </div>

                {/* Items */}
                <div className="py-1.5">
                  {LANGUAGES.map((l, i) => {
                    const active = language === l.code
                    return (
                      <motion.button
                        key={l.code}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18, delay: 0.02 + i * 0.018, ease: "easeOut" }}
                        onClick={() => {
                          setLanguage(l.code as LangCode)
                          setOpen(false)
                        }}
                        className={`group w-full flex items-center justify-between gap-3 px-4 py-1.5 text-[13px] transition-colors duration-200 ${
                          active
                            ? "text-fg bg-bg-soft/60"
                            : "text-fg-soft hover:text-fg hover:bg-bg-soft/40"
                        }`}
                      >
                        <span className="flex items-baseline gap-3.5">
                          <span
                            className={`font-mono text-[10px] w-5 text-left tracking-wider ${
                              active ? "text-accent" : "text-fg-faint"
                            }`}
                          >
                            {l.short}
                          </span>
                          <span>{l.label}</span>
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            active
                              ? "bg-accent scale-100"
                              : "bg-transparent scale-0 group-hover:bg-fg-faint group-hover:scale-100"
                          }`}
                        />
                      </motion.button>
                    )
                  })}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2 border-t border-line">
                  <p className="folio text-fg-faint text-[9.5px]">esc · close</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Full grid (Settings page) — same visual language
  return (
    <div className="flex flex-wrap gap-1.5">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code as LangCode)}
          className={`group px-3.5 py-1.5 rounded-full border text-[13px] transition-all duration-300 inline-flex items-center gap-2.5 ${
            language === l.code
              ? "border-line-bright bg-bg-elevated text-fg"
              : "border-line text-fg-dim hover:text-fg hover:border-line-bright"
          }`}
        >
          <span
            className={`font-mono text-[10px] tracking-wider ${
              language === l.code ? "text-accent" : "text-fg-faint"
            }`}
          >
            {l.short}
          </span>
          {l.label}
          {language === l.code && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
        </button>
      ))}
    </div>
  )
}
