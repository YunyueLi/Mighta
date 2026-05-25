import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, GitFork } from "./Icons"
import type { RawFork } from "../lib/spawnPrompt"

const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]

const vibeAccent: Record<RawFork["vibe"], string> = {
  shine: "text-accent",
  ash: "text-fg-dim",
  drift: "text-fg-dim",
  quiet: "text-fg-soft",
  burn: "text-accent",
}

export default function ForkCard({
  fork,
  index,
  onReFork,
}: {
  fork: RawFork
  index: number
  onReFork?: () => void
}) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const vibeColor = vibeAccent[fork.vibe] ?? "text-fg-dim"

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="card p-8 md:p-10 group"
    >
      <header className="flex items-baseline justify-between mb-9">
        <span
          className="script text-fg-dim group-hover:text-accent transition-colors duration-500"
          style={{ fontSize: "2.2rem", lineHeight: 1 }}
        >
          {roman[index] ?? `${index + 1}`}.
        </span>
        <div className="flex items-baseline gap-3 folio">
          <span className={vibeColor}>{t(`vibe.${fork.vibe}`)}</span>
          <span className="text-fg-faint">·</span>
          <span>{t("spawn.card_age", { age: fork.divergence.age })}</span>
        </div>
      </header>

      <div className="mb-6">
        <p className="small-caps text-[10.5px] text-fg-dim mb-2">{t("spawn.card_instead_of")}</p>
        <p className="serif-italic text-fg-soft text-[15px] leading-relaxed text-balance">
          &ldquo;{fork.divergence.event}&rdquo;
        </p>
      </div>

      <div className="mb-8">
        <p className="small-caps text-[10.5px] text-accent mb-2">{t("spawn.card_you")}</p>
        <p
          className="text-fg leading-[1.25] text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: "clamp(1.25rem, 1.8vw, 1.6rem)",
            fontWeight: 460,
            letterSpacing: '-0.015em',
          }}
        >
          {fork.divergence.alternative}
        </p>
      </div>

      <p className="text-fg-soft text-[14.5px] leading-[1.75] mb-7 text-balance">{fork.outcome}</p>

      <hr className="rule mb-4" />
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setOpen(!open)}
          className="folio inline-flex items-center gap-2 hover:text-fg transition-colors duration-300"
        >
          <ChevronRight
            className={`w-3 h-3 transition-transform duration-500 ${open ? "rotate-90" : ""}`}
          />
          {open
            ? t("spawn.card_trajectory_close")
            : t("spawn.card_trajectory_open", { count: fork.trajectory.length })}
        </button>
        {onReFork && (
          <button
            onClick={onReFork}
            className="folio inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-line hover:border-accent hover:text-accent hover:bg-accent/[0.04] transition-all duration-300"
            title={t("spawn.refork_hint")}
          >
            <GitFork className="w-3 h-3" />
            {t("spawn.refork")}
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.ol
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-5 border-l border-line pl-5">
              {fork.trajectory.map((step, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[23px] top-2 w-1.5 h-1.5 rounded-full bg-fg-dim" />
                  <div className="folio mb-1.5">{t("spawn.card_age", { age: step.age })}</div>
                  <p className="text-fg-soft text-[14px] leading-[1.7]">{step.state}</p>
                </li>
              ))}
            </div>
          </motion.ol>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
