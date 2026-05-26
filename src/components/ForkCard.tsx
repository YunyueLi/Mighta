/**
 * ForkCard — a single chapter in the cards/long-read view.
 *
 * Each card is a self-contained literary chapter: a quiet chapter mark, the
 * forking moment, the alternative as display-weight head, then the trajectory
 * as a stack of *paragraphs* (not bullets, not bullets, never bullets) with
 * delicate inline date markers. Outcome lands as the closing graf under a
 * vibe-colored hairline.
 *
 * Designed for the new prompt schema where each trajectory step carries a
 * 3-5 sentence paragraph in `state`. The shape is: read it, don't scan it.
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
      className="card relative px-7 py-12 md:px-14 md:py-16 scroll-mt-24"
    >
      {/* ── Chapter mark — restrained: small caps in a single line ───── */}
      <header className="mb-12">
        <div className="flex items-center gap-4">
          <span
            className="folio text-[10px] tracking-[0.32em]"
            style={{ color }}
          >
            {t("spawn.cards_chapter", { defaultValue: "chapter" })}{" "}
            <span className="text-fg-faint mx-0.5">·</span> {numeral}
          </span>
          <hr
            className="flex-1 border-0 h-px"
            style={{ background: color, opacity: 0.32 }}
          />
          <span
            className="folio text-[10px] tracking-[0.28em]"
            style={{ color }}
          >
            {t(`vibe.${fork.vibe}`)}
          </span>
        </div>
      </header>

      {/* ── Opening: the moment + alternative ─────────────────────────── */}
      <section className="mb-14">
        <p className="small-caps text-[9.5px] text-fg-faint mb-3 tracking-[0.26em]">
          {t("spawn.card_instead_of")}
          <span className="text-fg-faint/60 mx-2">·</span>
          {t("spawn.card_age", { age: fork.divergence.age })}
        </p>
        <p className="serif-italic text-fg-soft text-[15px] md:text-[16px] leading-[1.62] text-balance mb-9">
          &ldquo;{fork.divergence.event}&rdquo;
        </p>

        <p
          className="small-caps text-[9.5px] mb-4 tracking-[0.26em]"
          style={{ color }}
        >
          {t("spawn.card_you")}
        </p>
        <h2
          className="text-fg leading-[1.12] text-balance"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.7rem, 2.6vw, 2.4rem)",
            fontWeight: 470,
            letterSpacing: "-0.022em",
          }}
        >
          {fork.divergence.alternative}
        </h2>
      </section>

      {/* ── The road — trajectory as paragraphs, not bullets ──────────── */}
      <section className="mb-14">
        <p className="small-caps text-[9.5px] text-fg-faint mb-10 tracking-[0.26em]">
          {t("spawn.cards_section_road", { defaultValue: "the road there" })}
        </p>

        <div className="space-y-12 md:space-y-14">
          {fork.trajectory.map((step, i) => (
            <article key={i} className="beat">
              {/* Beat header: moment + age + thin vibe rule extends right */}
              <header className="flex items-baseline gap-3 mb-4 flex-wrap">
                {step.moment ? (
                  <span className="script text-fg text-[19px] md:text-[20px] leading-tight">
                    {step.moment}
                  </span>
                ) : (
                  <span className="folio text-[10.5px] tracking-[0.2em]" style={{ color }}>
                    {t("spawn.card_age", { age: step.age })}
                  </span>
                )}
                {step.moment && (
                  <span className="folio text-[10.5px] tracking-[0.2em] text-fg-faint">
                    ~{step.age}
                  </span>
                )}
                <span
                  aria-hidden
                  className="flex-1 h-px min-w-[40px]"
                  style={{ background: color, opacity: 0.18 }}
                />
              </header>

              {/* The paragraph — generous leading, balanced wrap */}
              <p
                className="text-fg-soft text-[15.5px] md:text-[16.5px] leading-[1.86] text-balance"
                style={{ fontWeight: 410 }}
              >
                {step.state}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Outcome — closing graf under a vibe hairline ──────────────── */}
      <section
        className="pt-9 mb-2"
        style={{ borderTop: `1px solid ${color}` }}
      >
        <p
          className="small-caps text-[9.5px] mb-4 tracking-[0.26em]"
          style={{ color }}
        >
          {t("spawn.timeline_legend_now")}
        </p>
        <p
          className="text-fg text-[16px] md:text-[17px] leading-[1.78] text-balance"
          style={{ fontWeight: 445 }}
        >
          {fork.outcome}
        </p>
      </section>

      {/* ── Footer: re-fork CTA ───────────────────────────────────────── */}
      {onReFork && (
        <footer className="mt-14 flex justify-end">
          <button
            onClick={onReFork}
            className="folio inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all hover:bg-bg-soft/40"
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
