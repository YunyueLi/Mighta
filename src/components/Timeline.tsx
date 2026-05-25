/**
 * Branching timeline — git-graph style.
 * One root line, six branches that diverge at each fork's divergence point,
 * curve up/down, run through their trajectory nodes, and end at "now".
 */

import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import type { ForkVersion, LifeNode } from "../lib/store"

const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

const vibeStroke: Record<ForkVersion["vibe"], string> = {
  shine: "var(--color-accent)",
  ash: "var(--color-fg-dim)",
  drift: "var(--color-fg-soft)",
  quiet: "var(--color-fg)",
  burn: "var(--color-rust)",
}

const PAD = { top: 60, bottom: 60, left: 90, right: 240 }
const ROW_HEIGHT = 88
const NODE_R = 5
const DIV_R = 8

interface NodePoint {
  x: number
  y: number
  age: number
  moment?: string
  label: string
  type: "seed" | "divergence" | "step" | "outcome"
  forkIndex: number
  stepIndex?: number
}

export default function Timeline({
  versions,
  seedAge,
  seedNodes,
}: {
  versions: ForkVersion[]
  seedAge: number
  seedNodes: Array<LifeNode>
}) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState<NodePoint | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)

  const { width, height, mainY, scaleX, paths, nodes, ticks } = useMemo(() => {
    const allAges = [
      seedAge,
      ...seedNodes.map((n) => n.age),
      ...versions.flatMap((v) => [v.divergence.age, ...v.trajectory.map((s) => s.age)]),
    ]
    let lo = Math.max(0, Math.min(...allAges) - 1)
    let hi = Math.max(...allAges, seedAge) + 1
    if (hi - lo < 8) hi = lo + 8

    const w = 1000
    const h = PAD.top + PAD.bottom + ROW_HEIGHT * versions.length
    const mainY = PAD.top + (ROW_HEIGHT * versions.length) / 2

    const innerW = w - PAD.left - PAD.right
    const scaleX = (age: number) => PAD.left + ((age - lo) / (hi - lo)) * innerW

    // Build path for each fork branch
    const paths = versions.map((v, i) => {
      const divX = scaleX(v.divergence.age)
      const divY = mainY
      // each fork gets its own y, alternating above/below the mainY
      const offset = (i - (versions.length - 1) / 2) * (ROW_HEIGHT * 0.85)
      const forkY = mainY + offset
      const endX = scaleX(seedAge)
      // Curve from main line up/down into its lane
      const bezier = `M ${divX} ${divY} C ${divX + 30} ${divY}, ${divX + 10} ${forkY}, ${divX + 60} ${forkY} L ${endX} ${forkY}`
      return { d: bezier, forkY, divX, endX }
    })

    // Build node list (for rendering circles + hit-test)
    const nodes: NodePoint[] = []
    // Seed nodes on main line
    seedNodes.forEach((sn) => {
      nodes.push({
        x: scaleX(sn.age),
        y: mainY,
        age: sn.age,
        moment: sn.moment,
        label: sn.event,
        type: "seed",
        forkIndex: -1,
      })
    })
    // Fork nodes
    versions.forEach((v, i) => {
      const fy = paths[i].forkY
      nodes.push({
        x: scaleX(v.divergence.age),
        y: mainY,
        age: v.divergence.age,
        moment: v.divergence.moment,
        label: v.divergence.event,
        type: "divergence",
        forkIndex: i,
      })
      v.trajectory.forEach((s, j) => {
        nodes.push({
          x: scaleX(s.age),
          y: fy,
          age: s.age,
          moment: s.moment,
          label: s.state,
          type: "step",
          forkIndex: i,
          stepIndex: j,
        })
      })
      // Outcome cap
      nodes.push({
        x: scaleX(seedAge),
        y: fy,
        age: seedAge,
        label: v.outcome,
        type: "outcome",
        forkIndex: i,
      })
    })

    // Build age ticks
    const span = hi - lo
    const step = Math.max(1, Math.ceil(span / 6 / 5) * 5)
    const ticks: number[] = []
    for (let a = Math.ceil(lo / step) * step; a <= hi; a += step) ticks.push(a)
    if (!ticks.includes(seedAge)) ticks.push(seedAge)

    return { width: w, height: h, mainY, scaleX, paths, nodes, ticks }
  }, [versions, seedAge, seedNodes])

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-6">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          style={{ minWidth: 800, height: `${height}px` }}
          className="block"
        >
          {/* Age ticks */}
          {ticks.map((age) => (
            <g key={`tick-${age}`}>
              <line
                x1={scaleX(age)}
                x2={scaleX(age)}
                y1={PAD.top - 10}
                y2={height - PAD.bottom + 10}
                stroke="var(--color-line)"
                strokeDasharray="2 4"
              />
              <text
                x={scaleX(age)}
                y={PAD.top - 18}
                textAnchor="middle"
                className="folio"
                fill="var(--color-fg-dim)"
                style={{ fontSize: 10, letterSpacing: "0.15em" }}
              >
                {age}
              </text>
            </g>
          ))}

          {/* "now" marker */}
          <g>
            <line
              x1={scaleX(seedAge)}
              x2={scaleX(seedAge)}
              y1={PAD.top - 24}
              y2={height - PAD.bottom + 24}
              stroke="var(--color-accent)"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
            <text
              x={scaleX(seedAge)}
              y={height - PAD.bottom + 38}
              textAnchor="middle"
              className="script"
              fill="var(--color-accent)"
              style={{ fontSize: 16 }}
            >
              {t("spawn.timeline_now")}
            </text>
          </g>

          {/* Main lifeline (root) */}
          <line
            x1={PAD.left}
            x2={scaleX(seedAge)}
            y1={mainY}
            y2={mainY}
            stroke="var(--color-fg)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx={PAD.left} cy={mainY} r={3} fill="var(--color-fg)" />
          {/* "you started here" label */}
          <text
            x={PAD.left - 8}
            y={mainY + 4}
            textAnchor="end"
            className="folio"
            fill="var(--color-fg-dim)"
            style={{ fontSize: 9.5, letterSpacing: "0.12em" }}
          >
            you
          </text>

          {/* Fork branches */}
          {paths.map((p, i) => (
            <g key={`path-${i}`} className="transition-opacity duration-300">
              <path
                d={p.d}
                stroke={vibeStroke[versions[i].vibe]}
                strokeWidth={expanded === i ? 2.5 : 1.5}
                fill="none"
                opacity={expanded === null || expanded === i ? 1 : 0.25}
                strokeLinecap="round"
              />
              {/* Fork label on left side */}
              <text
                x={PAD.left - 8}
                y={p.forkY + 4}
                textAnchor="end"
                className="script"
                fill={vibeStroke[versions[i].vibe]}
                style={{ fontSize: 17 }}
              >
                {roman[i] ?? `${i + 1}`}.
              </text>
              <text
                x={PAD.left - 8}
                y={p.forkY + 18}
                textAnchor="end"
                className="folio"
                fill={vibeStroke[versions[i].vibe]}
                style={{ fontSize: 9, letterSpacing: "0.18em" }}
                opacity="0.7"
              >
                {t(`vibe.${versions[i].vibe}`)}
              </text>
              {/* Outcome teaser at end */}
              <foreignObject
                x={p.endX + 12}
                y={p.forkY - 24}
                width={PAD.right - 16}
                height={48}
              >
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="text-left text-[12px] leading-tight text-fg-soft hover:text-fg transition-colors duration-300 line-clamp-2"
                  style={{ width: "100%" }}
                >
                  {versions[i].outcome}
                </button>
              </foreignObject>
            </g>
          ))}

          {/* Nodes */}
          {nodes.map((n, idx) => {
            const fork = n.forkIndex >= 0 ? versions[n.forkIndex] : null
            const color = fork ? vibeStroke[fork.vibe] : "var(--color-fg)"
            const isHovered = hovered === n
            const dimmed = expanded !== null && n.forkIndex !== expanded && n.forkIndex !== -1
            return (
              <g
                key={idx}
                opacity={dimmed ? 0.2 : 1}
                className="transition-opacity duration-300 cursor-pointer"
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(null)}
              >
                {n.type === "seed" && (
                  <>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={isHovered ? 7 : 5}
                      fill="var(--color-bg)"
                      stroke="var(--color-fg)"
                      strokeWidth={2}
                    />
                    <circle cx={n.x} cy={n.y} r={2} fill="var(--color-fg)" />
                  </>
                )}
                {n.type === "divergence" && (
                  <g transform={`translate(${n.x} ${n.y}) rotate(45)`}>
                    <rect
                      x={-DIV_R}
                      y={-DIV_R}
                      width={DIV_R * 2}
                      height={DIV_R * 2}
                      fill="var(--color-bg)"
                      stroke={color}
                      strokeWidth={isHovered ? 2.5 : 1.8}
                    />
                  </g>
                )}
                {n.type === "step" && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isHovered ? NODE_R + 2 : NODE_R}
                    fill={color}
                    stroke="var(--color-bg)"
                    strokeWidth={2}
                  />
                )}
                {n.type === "outcome" && (
                  <g>
                    <circle cx={n.x} cy={n.y} r={NODE_R + 3} fill={color} opacity="0.15" />
                    <circle cx={n.x} cy={n.y} r={NODE_R} fill={color} />
                    <circle cx={n.x} cy={n.y} r={NODE_R - 2} fill="var(--color-bg)" />
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed z-40 pointer-events-none"
            style={{
              left: 0,
              top: 0,
              transform: `translate(${hovered.x * 0.001 * window.innerWidth + 40}px, ${hovered.y + 200}px)`,
              maxWidth: 320,
            }}
          >
            {/* render inline below — anchored elsewhere */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail panel */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 mx-auto max-w-3xl px-5 py-4 border border-line-bright rounded-md bg-bg-elevated"
          >
            <div className="flex items-baseline gap-3 mb-2">
              <span className="folio text-fg-faint">
                {hovered.type === "seed"
                  ? t("spawn.timeline_legend_seed")
                  : hovered.type === "divergence"
                  ? t("spawn.timeline_legend_fork")
                  : hovered.type === "outcome"
                  ? t("spawn.timeline_legend_now")
                  : t("spawn.timeline_legend_step")}
              </span>
              {hovered.moment ? (
                <span className="script text-fg text-[15px]">{hovered.moment}</span>
              ) : (
                <span className="text-fg text-[13px] font-mono">
                  {t("spawn.card_age", { age: hovered.age })}
                </span>
              )}
              {hovered.forkIndex >= 0 && (
                <span className="folio text-accent">
                  fork {roman[hovered.forkIndex]} · {t(`vibe.${versions[hovered.forkIndex].vibe}`)}
                </span>
              )}
            </div>
            <p className="text-fg-soft text-[14px] leading-relaxed text-balance">
              {hovered.label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded fork panel */}
      <AnimatePresence>
        {expanded !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 mx-auto max-w-3xl border-l-2 pl-6 py-3"
            style={{ borderColor: vibeStroke[versions[expanded].vibe] }}
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span
                className="script"
                style={{
                  fontSize: "1.8rem",
                  color: vibeStroke[versions[expanded].vibe],
                  lineHeight: 1,
                }}
              >
                {roman[expanded]}.
              </span>
              <span className="folio">{t(`vibe.${versions[expanded].vibe}`)}</span>
              <button
                onClick={() => setExpanded(null)}
                className="folio ml-auto hover:text-fg transition-colors"
              >
                close ×
              </button>
            </div>
            <p
              className="text-fg leading-[1.3] mb-3 text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.4rem",
                fontWeight: 460,
                letterSpacing: "-0.015em",
              }}
            >
              {versions[expanded].alternative}
            </p>
            <p className="text-fg-soft text-[14px] leading-[1.7] text-balance">
              {versions[expanded].outcome}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 justify-center folio">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-bg border border-fg" />
          {t("spawn.timeline_legend_seed")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rotate-45 border border-fg-dim" />
          {t("spawn.timeline_legend_fork")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-fg-dim" />
          {t("spawn.timeline_legend_step")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-1 h-3 bg-accent/40" />
          {t("spawn.timeline_legend_now")}
        </span>
      </div>
    </div>
  )
}
