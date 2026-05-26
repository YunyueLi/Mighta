/**
 * ForkCard — a single chapter in the cards/long-read view.
 *
 * Unlike Timeline lanes (which are wide-grid quick-scan columns), each card
 * is a self-contained chapter laid out like a magazine short story: section
 * headers in small-caps, a display-weight alternative, an always-expanded
 * trajectory rail with bullet markers, and a vibe-colored capstone for the
 * outcome. Trajectories are no longer hidden behind an expander — long-read
 * means the reader doesn't have to ask for the rest.
 */

import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { GitFork } from "./Icons"
import type { RawFork } from "../lib/spawnPrompt"

const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]

const vibeColor: Record<RawFork["vibe"], string> = {
  shine: "var(--color-accent)",
  ash: "var(--color-fg-dim)",
  drift: "var(--color-fg-soft)",
  quiet: "var(--color-fg)",
  burn: "var(--color-rust)",
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
  const { t } = useTranslation()
  const color = vibeColor[fork.vibe] ?? "var(--color-fg)"
  const numeral = roman[index] ?? `${index + 1}`

  return (
    <motion.article
      id={`chapter-${index + 1}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="card relative px-7 py-10 md:px-12 md:py-14 scroll-mt-24"
    >
      {/* ── Chapter header ─────────────────────────────────────────── */}
      <header className="mb-12">
        <p
          className="small-caps text-[10px] mb-4 tracking-[0.28em]"
          style={{ color }}
        >
          {t("spawn.cards_chapter", { defaultValue: "chapter" })}
        </p>

        <div className="flex items-baseline gap-5 flex-wrap mb-5">
          <span
            className="script"
            style={{
              fontSize: "clamp(3rem, 5.5vw, 4.5rem)",
              lineHeight: 0.85,
              color,
            }}
          >
            {numeral}.
          </span>
          <div className="flex flex-col">
            <span
              className="folio text-[10.5px] tracking-[0.24em]"
              style={{ color }}
            >
              {t(`vibe.${fork.vibe}`)}
            </span>
            <span className="folio text-[10px] text-fg-faint mt-1 tracking-[0.18em]">
              {t("spawn.card_age", { age: fork.divergence.age })}
            </span>
          </div>
        </div>

        <hr
          className="border-0 h-px w-16"
          style={{ background: color, opacity: 0.7 }}
        />
      </header>

      {/* ── Section 1: the moment ──────────────────────────────────── */}
      <section className="mb-10">
        <SectionLabel>{t("spawn.card_instead_of")}</SectionLabel>
        <p className="serif-italic text-fg-soft text-[16px] md:text-[17px] leading-[1.6] text-balance">
          &ldquo;{fork.divergence.event}&rdquo;
        </p>
      </section>

      {/* ── Section 2: you mighta — the alternative, display weight ── */}
      <section className="mb-12">
        <SectionLabel style={{ color }}>{t("spawn.card_you")}</SectionLabel>
        <p
          className="text-fg leading-[1.18] text-balance"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.55rem, 2.4vw, 2.2rem)",
            fontWeight: 460,
            letterSpacing: "-0.02em",
          }}
        >
          {fork.divergence.alternative}
        </p>
      </section>

      {/* ── Section 3: the road — trajectory, expanded by default ──── */}
      <section className="mb-12">
        <SectionLabel>
          {t("spawn.cards_section_road", { defaultValue: "the road there" })}
        </SectionLabel>
        <ol className="relative pl-7 space-y-7">
          {/* vertical rail */}
          <span
            aria-hidden
            className="absolute left-[9px] top-2 bottom-2 w-px"
            style={{
              background: `linear-gradient(to bottom, ${color} 0%, ${color} 70%, transparent 100%)`,
              opacity: 0.4,
            }}
          />
          {fork.trajectory.map((step, i) => (
            <li key={i} className="relative">
              <span
                aria-hidden
                className="absolute -left-[22px] top-[10px] w-2 h-2 rounded-full"
                style={{ background: color }}
              />
              <span
                aria-hidden
                className="absolute -left-[26px] top-[6px] w-3 h-3 rounded-full"
                style={{ background: color, opacity: 0.14 }}
              />
              <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
                {step.moment ? (
                  <span className="script text-fg text-[18px] leading-tight">
                    {step.moment}
                  </span>
                ) : null}
                <span className="folio text-[10px] tracking-[0.18em]">
                  {step.moment
                    ? `~${step.age}`
                    : t("spawn.card_age", { age: step.age })}
                </span>
              </div>
              <p className="text-fg-soft text-[14.5px] md:text-[15px] leading-[1.8] text-balance">
                {step.state}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Section 4: where it ended — outcome, vibe-rule top ─────── */}
      <section
        className="pt-8 mb-2"
        style={{
          borderTop: `1px solid ${color}`,
          borderTopColor: color,
        }}
      >
        <SectionLabel style={{ color }}>
          {t("spawn.timeline_legend_now")}
        </SectionLabel>
        <p
          className="text-fg text-[15.5px] md:text-[16px] leading-[1.75] text-balance"
          style={{ fontWeight: 440 }}
        >
          {fork.outcome}
        </p>
      </section>

      {/* ── Footer: re-fork CTA ─────────────────────────────────────── */}
      {onReFork && (
        <footer className="mt-12 flex justify-end">
          <button
            onClick={onReFork}
            className="folio inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all"
            style={{ borderColor: color, color }}
            title={t("spawn.refork_hint")}
          >
            <GitFork className="w-3 h-3" />
            {t("spawn.refork")}
          </button>
        </footer>
      )}
    </motion.article>
  )
}

/* ── Tiny section label primitive ───────────────────────────────────── */

function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <p
      className="small-caps text-[10px] text-fg-faint mb-3 tracking-[0.26em]"
      style={style}
    >
      {children}
    </p>
  )
}
