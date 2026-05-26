import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Sun, Moon, Monitor } from "./Icons"
import { useSettings, type ThemeMode } from "../lib/store"

const THEMES: Array<{ code: ThemeMode; label: string; short: string; Icon: typeof Sun }> = [
  { code: "auto", label: "Auto", short: "AUTO", Icon: Monitor },
  { code: "light", label: "Light", short: "LT", Icon: Sun },
  { code: "dark", label: "Dark", short: "DK", Icon: Moon },
]

export default function ThemeSwitch({ compact = false }: { compact?: boolean }) {
  useTranslation() // ensure re-render on language change
  const { theme, setTheme } = useSettings()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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

  const ActiveIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor

  if (compact) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={`p-2 transition-colors duration-300 rounded ${
            open ? "text-fg bg-bg-elevated" : "text-fg-dim hover:text-fg"
          }`}
          aria-label="theme"
          aria-expanded={open}
        >
          <ActiveIcon className="w-[15px] h-[15px]" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top right" }}
              className="absolute right-0 top-full mt-3 z-50 min-w-[200px]"
            >
              {/* Caret */}
              <div className="absolute -top-[5px] right-3.5 w-2.5 h-2.5 rotate-45 bg-bg-elevated border-l border-t border-line-bright" />

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
                  <span className="folio">theme</span>
                  <span className="script text-fg-dim text-[13px]">choose</span>
                </div>

                {/* Items */}
                <div className="py-1.5">
                  {THEMES.map((th, i) => {
                    const active = theme === th.code
                    const Icon = th.Icon
                    return (
                      <motion.button
                        key={th.code}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.18,
                          delay: 0.02 + i * 0.025,
                          ease: "easeOut",
                        }}
                        onClick={() => {
                          setTheme(th.code)
                          setOpen(false)
                        }}
                        className={`group w-full flex items-center justify-between gap-3 px-4 py-2 text-[13px] transition-colors duration-200 ${
                          active
                            ? "text-fg bg-bg-soft/60"
                            : "text-fg-soft hover:text-fg hover:bg-bg-soft/40"
                        }`}
                      >
                        <span className="flex items-center gap-3.5">
                          <Icon
                            className={`w-3.5 h-3.5 ${active ? "text-accent" : "text-fg-dim"}`}
                          />
                          <span>{th.label}</span>
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

                {/* Footer */}
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

  // Full mode (Settings page) — pill style, matches LanguageSwitch full
  return (
    <div className="flex flex-wrap gap-1.5">
      {THEMES.map((th) => {
        const active = theme === th.code
        const Icon = th.Icon
        return (
          <button
            key={th.code}
            onClick={() => setTheme(th.code)}
            className={`group px-3.5 py-1.5 rounded-full border text-[13px] transition-all duration-300 inline-flex items-center gap-2.5 ${
              active
                ? "border-line-bright bg-bg-elevated text-fg"
                : "border-line text-fg-dim hover:text-fg hover:border-line-bright"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${active ? "text-accent" : "text-fg-faint"}`} />
            {th.label}
            {active && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
          </button>
        )
      })}
    </div>
  )
}
