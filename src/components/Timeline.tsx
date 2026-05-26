/**
 * Timeline — the "six rivers" view.
 *
 * Six counterfactual lives shown as parallel columns flowing from a single
 * divergence point at the top. Each column carries the full life as readable
 * content (no hover required); a thin SVG curtain of bezier curves visually
 * connects the origin pill to the head of each lane.
 *
 * Interactions:
 *   - hover a lane          → it brightens, others dim, its source curve thickens
 *   - click a lane          → opens a cinematic full-bleed focus reader
 *   - focus reader has a re-fork CTA (passed through from <Spawn>)
 *
 * Replaces the previous git-graph branching SVG.
 */

import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { X, GitFork, ArrowLeft } from "./Icons"
import type { ForkVersion } from "../lib/store"

const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

// First-sentence fallback for scan view when LLM didn't return a `brief`.
// Splits on the first sentence-ending punctuation (latin + CJK) — never mid-clause.
function previewOf(step: { brief?: string; state: string }): string {
  if (step.brief && step.brief.trim()) return step.brief.trim()
  const m = step.state.match(/^([^.。!?！？\n]+[.。!?！？])/u)
  return m ? m[1].trim() : step.state
}

// vibe → CSS color expression
const vibeColor: Record<ForkVersion["vibe"], string> = {
  shine: "var(--color-accent)",
  ash: "var(--color-fg-dim)",
  drift: "var(--color-fg-soft)",
  quiet: "var(--color-fg)",
  burn: "var(--color-rust)",
}

interface TimelineProps {
  versions: ForkVersion[]
  onReFork?: (fork: ForkVersion) => void
}

export default function Timeline({ versions, onReFork }: TimelineProps) {
  const { t } = useTranslation()
  const [focused, setFocused] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  // Earliest divergence age — anchor for the origin pill caption
  const originAge = useMemo(
    () => Math.min(...versions.map((v) => v.divergence.age)),
    [versions]
  )

  // Lock body scroll while focus panel is open
  useEffect(() => {
    if (focused === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [focused])

  return (
    <div
      className="relative"
      style={{
        // Break out of the parent's max-w-3xl so 6 lanes have room to breathe
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
      }}
    >
      {/* Origin pill — centered in viewport, decoupled from lane scroll */}
      <div className="mx-auto max-w-xl px-6 text-center pb-2">
        <p className="small-caps text-[10px] text-fg-faint mb-3 tracking-[0.22em]">
          {t("spawn.timeline_origin_kicker")}
        </p>
        <p
          className="serif-italic text-fg text-balance leading-[1.35] mb-3"
          style={{ fontSize: "clamp(1.05rem, 1.55vw, 1.45rem)" }}
        >
          &ldquo;{versions[0]?.divergence.event ?? ""}&rdquo;
        </p>
        <p className="folio text-[10px] tracking-[0.18em]">
          {t("spawn.card_age", { age: originAge })}{" "}
          <span className="text-fg-faint mx-1">·</span>
          {t("spawn.timeline_split_n", { n: versions.length })}
        </p>
      </div>

      {/* Lanes — horizontal scroll, curves live inside the same scroll wrapper
          so they always align with the lane heads */}
      <div className="overflow-x-auto pb-6 lanes-scroller">
        <div
          className="mx-auto px-6 md:px-10"
          style={{ maxWidth: "1920px" }}
        >
          {/* Bezier curtain — flows from a center origin to each lane head */}
          <BezierCurtain
            versions={versions}
            hovered={hovered}
            focused={focused}
          />

          <div
            className="grid grid-flow-col gap-3 md:gap-4 snap-x snap-mandatory"
            style={{
              gridAutoColumns: "minmax(240px, 320px)",
            }}
          >
          {versions.map((v, i) => (
            <Lane
              key={v.id}
              version={v}
              index={i}
              isHovered={hovered === i}
              isFocused={focused === i}
              isDimmed={
                focused !== null
                  ? focused !== i
                  : hovered !== null && hovered !== i
              }
              onHoverIn={() => setHovered(i)}
              onHoverOut={() => setHovered(null)}
              onOpen={() => setFocused(i)}
            />
          ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {focused !== null && (
          <FocusPanel
            version={versions[focused]}
            index={focused}
            total={versions.length}
            onClose={() => setFocused(null)}
            onPrev={focused > 0 ? () => setFocused(focused - 1) : undefined}
            onNext={
              focused < versions.length - 1
                ? () => setFocused(focused + 1)
                : undefined
            }
            onReFork={
              onReFork
                ? () => {
                    onReFork(versions[focused])
                    setFocused(null)
                  }
                : undefined
            }
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 * BezierCurtain — six soft streams flowing from a single point to each lane.
 *
 * Lives inside the scroll wrapper so the curve endpoints always align with
 * the lane heads, even when the user scrolls horizontally. The viewBox is
 * scaled with `preserveAspectRatio="none"` so it stretches to whatever width
 * the grid below ends up at.
 * ────────────────────────────────────────────────────────────────── */

function BezierCurtain({
  versions,
  hovered,
  focused,
}: {
  versions: ForkVersion[]
  hovered: number | null
  focused: number | null
}) {
  return (
    <svg
      viewBox="0 0 1000 56"
      preserveAspectRatio="none"
      width="100%"
      height="40"
      className="block pointer-events-none mb-1"
      aria-hidden
    >
      {versions.map((v, i) => {
        const x = ((i + 0.5) / versions.length) * 1000
        const isActive = hovered === i || focused === i
        const isDim =
          (focused !== null && focused !== i) ||
          (hovered !== null && hovered !== i)
        return (
          <path
            key={i}
            d={`M 500 0 C 500 28, ${x} 22, ${x} 56`}
            stroke={vibeColor[v.vibe]}
            strokeWidth={isActive ? 2.2 : 1.2}
            opacity={isDim ? 0.18 : isActive ? 0.85 : 0.55}
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        )
      })}
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 * Lane — one fork rendered as a complete readable column
 * ────────────────────────────────────────────────────────────────── */

function Lane({
  version,
  index,
  isHovered,
  isFocused,
  isDimmed,
  onHoverIn,
  onHoverOut,
  onOpen,
}: {
  version: ForkVersion
  index: number
  isHovered: boolean
  isFocused: boolean
  isDimmed: boolean
  onHoverIn: () => void
  onHoverOut: () => void
  onOpen: () => void
}) {
  const { t } = useTranslation()
  const color = vibeColor[version.vibe]
  const accent = isHovered || isFocused

  return (
    <motion.button
      type="button"
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      onFocus={onHoverIn}
      onBlur={onHoverOut}
      onClick={onOpen}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        y: 0,
        scale: accent ? 1.01 : 1,
      }}
      transition={{
        opacity: { duration: 0.3 },
        y: { duration: 0.55, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.25, ease: "easeOut" },
      }}
      className="snap-start text-left relative card flex flex-col px-5 py-6 overflow-hidden group focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/40"
      style={{
        borderColor: accent ? color : undefined,
      }}
    >
      {/* Vibe accent — thin top edge, full width */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px transition-opacity duration-300"
        style={{
          background: color,
          opacity: accent ? 0.9 : 0.35,
        }}
      />

      {/* Header */}
      <header className="mb-5 flex items-baseline justify-between gap-2">
        <span
          className="script transition-colors duration-300"
          style={{
            fontSize: "1.7rem",
            lineHeight: 1,
            color: accent ? color : "var(--color-fg-dim)",
          }}
        >
          {roman[index] ?? `${index + 1}`}.
        </span>
        <span
          className="folio uppercase tracking-[0.2em] text-[9.5px]"
          style={{ color }}
        >
          {t(`vibe.${version.vibe}`)}
        </span>
      </header>

      {/* "instead of" — the original event, italic, faded */}
      <div className="mb-5">
        <p className="small-caps text-[9.5px] text-fg-faint mb-1.5 tracking-[0.2em]">
          {t("spawn.card_instead_of")}
        </p>
        <p className="serif-italic text-fg-soft text-[13px] leading-snug line-clamp-2">
          &ldquo;{version.divergence.event}&rdquo;
        </p>
      </div>

      {/* "you mighta" — the alternative, display-weight */}
      <div className="mb-6">
        <p
          className="small-caps text-[9.5px] mb-1.5 tracking-[0.2em]"
          style={{ color }}
        >
          {t("spawn.card_you")}
        </p>
        <p
          className="text-fg leading-[1.22] text-balance"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.05rem, 1.3vw, 1.2rem)",
            fontWeight: 460,
            letterSpacing: "-0.012em",
          }}
        >
          {version.alternative}
        </p>
      </div>

      {/* Trajectory rail — vertical line + dots, condensed for the column */}
      <div className="relative pl-5 mb-6">
        <span
          aria-hidden
          className="absolute left-[7px] top-1.5 bottom-1.5 w-px"
          style={{
            background: `linear-gradient(to bottom, ${color} 0%, ${color} 70%, transparent 100%)`,
            opacity: 0.4,
          }}
        />
        <ol className="space-y-3.5">
          {version.trajectory.map((step, i) => (
            <li key={i} className="relative">
              <span
                aria-hidden
                className="absolute -left-[14px] top-[6px] w-1.5 h-1.5 rounded-full"
                style={{ background: color, opacity: 0.85 }}
              />
              <div className="flex items-baseline gap-2 mb-0.5">
                {step.moment ? (
                  <span className="script text-fg text-[13.5px] leading-tight">
                    {step.moment}
                  </span>
                ) : null}
                <span className="folio text-[9.5px] tracking-[0.15em]">
                  {step.moment
                    ? `~${step.age}`
                    : t("spawn.card_age", { age: step.age })}
                </span>
              </div>
              <p className="text-fg-soft text-[12.5px] leading-[1.6] text-balance">
                {previewOf(step)}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Outcome capstone */}
      <div className="pt-4 mt-auto border-t" style={{ borderColor: "var(--color-line)" }}>
        <p
          className="small-caps text-[9.5px] mb-2 tracking-[0.2em]"
          style={{ color }}
        >
          {t("spawn.timeline_legend_now")}
        </p>
        <p
          className="text-fg text-[13px] leading-[1.6] text-balance"
          style={{ fontWeight: 440 }}
        >
          {version.outcome}
        </p>
      </div>

      {/* Open hint — shows on hover */}
      <div
        aria-hidden
        className="absolute bottom-3 right-4 text-[10px] folio tracking-[0.18em] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color }}
      >
        {t("spawn.timeline_open_hint", { defaultValue: "open ↗" })}
      </div>
    </motion.button>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 * Focus panel — full-bleed cinematic reader for one lane
 * ────────────────────────────────────────────────────────────────── */

function FocusPanel({
  version,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  onReFork,
}: {
  version: ForkVersion
  index: number
  total: number
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  onReFork?: () => void
}) {
  const { t } = useTranslation()
  const color = vibeColor[version.vibe]

  // Keyboard navigation: Esc/←/→
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowLeft" && onPrev) onPrev()
      else if (e.key === "ArrowRight" && onNext) onNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, onPrev, onNext])

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 overflow-y-auto"
      style={{
        // High enough to cover the fixed nav (z=50) and any other floating UI.
        zIndex: 9999,
        // Near-solid backdrop so page content underneath doesn't bleed through.
        background: "var(--color-bg)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <motion.article
        key={version.id}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-2xl px-6 md:px-8 pt-16 pb-24"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar: roman + vibe + close */}
        <div className="flex items-center justify-between mb-12 gap-3">
          <div className="flex items-baseline gap-4">
            <span
              className="script"
              style={{ fontSize: "2.6rem", color, lineHeight: 1 }}
            >
              {roman[index] ?? `${index + 1}`}.
            </span>
            <span
              className="folio uppercase tracking-[0.24em] text-[10px]"
              style={{ color }}
            >
              {t(`vibe.${version.vibe}`)}
            </span>
            <span className="folio text-[10px] text-fg-faint tracking-[0.18em]">
              {index + 1} / {total}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-fg-dim hover:text-fg transition-colors p-2 -mr-2"
            aria-label={t("spawn.timeline_close", { defaultValue: "close" })}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instead of */}
        <div className="mb-10">
          <p className="small-caps text-[10px] text-fg-faint mb-2 tracking-[0.22em]">
            {t("spawn.card_instead_of")}
          </p>
          <p className="serif-italic text-fg-soft text-[16px] leading-relaxed text-balance">
            &ldquo;{version.divergence.event}&rdquo;
          </p>
        </div>

        {/* Alternative — the cinematic centerpiece */}
        <div className="mb-14">
          <p
            className="small-caps text-[10px] mb-3 tracking-[0.22em]"
            style={{ color }}
          >
            {t("spawn.card_you")}
          </p>
          <p
            className="text-fg leading-[1.18] text-balance"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.55rem, 2.4vw, 2.15rem)",
              fontWeight: 460,
              letterSpacing: "-0.02em",
            }}
          >
            {version.alternative}
          </p>
        </div>

        {/* Trajectory — large, breathing */}
        <div className="relative pl-7 mb-14">
          <span
            aria-hidden
            className="absolute left-[9px] top-2 bottom-2 w-px"
            style={{
              background: `linear-gradient(to bottom, ${color}, ${color}, transparent)`,
              opacity: 0.5,
            }}
          />
          <ol className="space-y-8">
            {version.trajectory.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative"
              >
                <span
                  aria-hidden
                  className="absolute -left-[22px] top-[10px] w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
                <span
                  aria-hidden
                  className="absolute -left-[26px] top-[6px] w-3 h-3 rounded-full"
                  style={{ background: color, opacity: 0.15 }}
                />
                <div className="flex items-baseline gap-3 mb-1.5">
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
                <p className="text-fg-soft text-[15px] leading-[1.8] text-balance">
                  {step.state}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Outcome */}
        <div className="pt-8 border-t" style={{ borderColor: "var(--color-line)" }}>
          <p
            className="small-caps text-[10px] mb-3 tracking-[0.22em]"
            style={{ color }}
          >
            {t("spawn.timeline_legend_now")}
          </p>
          <p
            className="text-fg leading-[1.65] text-balance"
            style={{ fontSize: "16px", fontWeight: 440 }}
          >
            {version.outcome}
          </p>
        </div>

        {/* Footer — nav + re-fork */}
        <div className="mt-12 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={!onPrev}
              className="folio inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line hover:border-line-bright hover:text-fg disabled:opacity-25 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-3 h-3" />
              {t("spawn.timeline_prev", { defaultValue: "prev" })}
            </button>
            <button
              onClick={onNext}
              disabled={!onNext}
              className="folio inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line hover:border-line-bright hover:text-fg disabled:opacity-25 disabled:cursor-not-allowed transition-all"
            >
              {t("spawn.timeline_next", { defaultValue: "next" })}
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </button>
          </div>

          {onReFork && (
            <button
              onClick={onReFork}
              className="folio inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all"
              style={{
                borderColor: color,
                color,
              }}
            >
              <GitFork className="w-3 h-3" />
              {t("spawn.refork")}
            </button>
          )}
        </div>
      </motion.article>
    </motion.div>,
    document.body
  )
}
