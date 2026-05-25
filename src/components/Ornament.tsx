import type { SVGProps } from "react"

const base: SVGProps<SVGSVGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 0.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke" as unknown as SVGProps<SVGSVGElement>["vectorEffect"],
}

/* A printer's fleuron — the classic editorial separator */
export const Fleuron = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 80 24" {...base} {...p}>
    <path d="M0 12 H22" />
    <path d="M58 12 H80" />
    <g transform="translate(40 12)">
      <path d="M-12 0 C -8 -4 -4 -6 0 -6 C 4 -6 8 -4 12 0 C 8 4 4 6 0 6 C -4 6 -8 4 -12 0 Z" />
      <circle cx="0" cy="0" r="1.2" fill="currentColor" stroke="none" />
      <path d="M -7 0 a 2 2 0 0 0 -3 -3" />
      <path d="M 7 0 a 2 2 0 0 1 3 -3" />
      <path d="M -7 0 a 2 2 0 0 1 -3 3" />
      <path d="M 7 0 a 2 2 0 0 0 3 3" />
    </g>
  </svg>
)

/* A simple diamond between rules */
export const Lozenge = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 80 16" {...base} {...p}>
    <path d="M0 8 H30" />
    <path d="M50 8 H80" />
    <g transform="translate(40 8)">
      <path d="M-4 0 L0 -4 L4 0 L0 4 Z" />
      <circle cx="0" cy="0" r="0.6" fill="currentColor" stroke="none" />
    </g>
  </svg>
)

/* Two interlocking circles (Vesica) */
export const Vesica = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 80 20" {...base} {...p}>
    <path d="M0 10 H28" />
    <path d="M52 10 H80" />
    <g transform="translate(40 10)">
      <circle cx="-4" cy="0" r="4" />
      <circle cx="4" cy="0" r="4" />
    </g>
  </svg>
)

/* Vertical mark — for section heads */
export const Mark = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 32" {...base} {...p}>
    <path d="M8 4 L8 28" />
    <path d="M4 8 L8 4 L12 8" />
    <path d="M4 24 L8 28 L12 24" />
    <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)

/* A simple paragraph mark — pilcrow-like */
export const Pilcrow = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M11 3 L11 14" />
    <path d="M8 3 L8 14" />
    <path d="M11 3 H6 a3 3 0 0 0 0 6 H8" />
  </svg>
)
