/**
 * A row of hand-drawn cartoon people that drifts slowly across the canvas.
 * Each figure has its own silhouette — solid hair, posture, accessories, props.
 * Inspired by MiroFish landing. Single-color (currentColor) so it adapts to theme.
 */

import type { SVGProps } from "react"

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 80 140",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
}

// Each figure ~80×140. Hair / hats / bags / shoes use fill="currentColor" for visual weight.

const Figures = [
  // 1. Cap, headphones around neck, casual tee
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Cap brim + crown */}
      <path d="M22 28 Q22 18 40 18 Q58 18 58 28 Z" fill="currentColor" stroke="none" />
      <path d="M18 28 H62" />
      {/* Head */}
      <circle cx="40" cy="36" r="9" />
      <path d="M36 36 a0.8 0.8 0 0 0 0 0.2" stroke="currentColor" strokeWidth="2" />
      <path d="M44 36 a0.8 0.8 0 0 0 0 0.2" stroke="currentColor" strokeWidth="2" />
      <path d="M37 41 q3 1.5 6 0" />
      {/* Headphones around neck */}
      <path d="M31 46 q9 -4 18 0" />
      <ellipse cx="30" cy="47" rx="2.5" ry="3" fill="currentColor" stroke="none" />
      <ellipse cx="50" cy="47" rx="2.5" ry="3" fill="currentColor" stroke="none" />
      {/* T-shirt */}
      <path d="M30 50 L24 60 L24 92 L56 92 L56 60 L50 50 Z" />
      <path d="M34 50 q6 4 12 0" />
      {/* Arms */}
      <path d="M24 60 L20 86" />
      <path d="M56 60 L60 86" />
      {/* Shorts */}
      <path d="M30 92 L28 116 M50 92 L52 116" />
      <path d="M40 92 V108" />
      {/* Shoes */}
      <ellipse cx="28" cy="119" rx="6" ry="2.5" fill="currentColor" stroke="none" />
      <ellipse cx="52" cy="119" rx="6" ry="2.5" fill="currentColor" stroke="none" />
    </svg>
  ),

  // 2. Long wavy hair, dress, side bag
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Long hair flowing back */}
      <path
        d="M30 30 Q26 22 32 16 Q40 12 48 16 Q54 22 50 30 Q56 45 54 62 Q44 56 32 62 Q24 45 30 30 Z"
        fill="currentColor"
        stroke="none"
      />
      {/* Head */}
      <circle cx="40" cy="32" r="8.5" />
      <path d="M37 33 v0.3" strokeWidth="2" />
      <path d="M43 33 v0.3" strokeWidth="2" />
      <path d="M38 38 q2 1 4 0" />
      {/* Neck */}
      <path d="M40 41 V46" />
      {/* Dress (A-line) */}
      <path d="M30 50 L25 102 L55 102 L50 50 Z" />
      <path d="M30 50 q10 4 20 0" />
      {/* Bag strap + bag */}
      <path d="M30 50 Q42 56 50 76" />
      <rect x="48" y="74" width="9" height="11" rx="1.5" fill="currentColor" stroke="none" />
      {/* Legs */}
      <path d="M33 102 L31 124" />
      <path d="M47 102 L49 124" />
      {/* Shoes */}
      <path d="M27 126 H35" strokeWidth="2.5" />
      <path d="M45 126 H53" strokeWidth="2.5" />
    </svg>
  ),

  // 3. Short hair, blazer, holding briefcase
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Hair (top, short) */}
      <path
        d="M31 28 Q28 18 40 17 Q52 18 49 28 Q46 26 40 26 Q34 26 31 28 Z"
        fill="currentColor"
        stroke="none"
      />
      <circle cx="40" cy="32" r="8.5" />
      <path d="M37 32 v0.3" strokeWidth="2" />
      <path d="M43 32 v0.3" strokeWidth="2" />
      <path d="M38 38 q2 0.8 4 0" />
      {/* Neck + collar */}
      <path d="M40 41 V46" />
      {/* Blazer */}
      <path d="M28 50 L24 92 L56 92 L52 50 Z" />
      {/* Lapels */}
      <path d="M30 50 L40 70 L50 50" />
      <path d="M40 52 V70" />
      {/* Buttons */}
      <circle cx="40" cy="74" r="0.7" fill="currentColor" />
      <circle cx="40" cy="82" r="0.7" fill="currentColor" />
      {/* Arms — one down with briefcase */}
      <path d="M28 50 L22 80 L22 92" />
      <path d="M52 50 L58 78" />
      {/* Briefcase */}
      <rect x="14" y="92" width="16" height="11" rx="1" fill="currentColor" stroke="none" />
      <path d="M19 92 V88 H25 V92" strokeWidth="1.2" />
      {/* Pants */}
      <path d="M32 92 L30 124" />
      <path d="M48 92 L50 124" />
      {/* Shoes */}
      <path d="M26 126 H36" strokeWidth="2.5" />
      <path d="M44 126 H54" strokeWidth="2.5" />
    </svg>
  ),

  // 4. Hoodie, backpack, looking down at phone
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Hood up */}
      <path d="M22 38 Q22 16 40 16 Q58 16 58 38 Q50 32 40 32 Q30 32 22 38 Z" fill="currentColor" stroke="none" />
      {/* Head (slightly tilted down) */}
      <circle cx="40" cy="38" r="8.5" />
      <path d="M37 38 v0.3" strokeWidth="2" />
      <path d="M43 38 v0.3" strokeWidth="2" />
      <path d="M38 43 q2 0.8 4 0" />
      {/* Hoodie body */}
      <path d="M28 50 L24 96 L56 96 L52 50 Z" />
      <path d="M30 50 q10 4 20 0" />
      {/* Zipper */}
      <path d="M40 50 V92" strokeDasharray="2 2" />
      {/* Pocket */}
      <path d="M30 72 H50" />
      {/* Backpack straps */}
      <path d="M30 50 V90" strokeWidth="2.5" />
      <path d="M50 50 V90" strokeWidth="2.5" />
      {/* Arms holding phone */}
      <path d="M28 60 L34 78 L42 80" />
      <path d="M52 60 L46 78 L42 80" />
      <rect x="36" y="78" width="10" height="14" rx="1.5" fill="currentColor" stroke="none" />
      <rect x="38" y="80" width="6" height="9" rx="0.5" stroke="white" fill="none" strokeWidth="0.8" />
      {/* Pants */}
      <path d="M32 96 L30 124" />
      <path d="M48 96 L50 124" />
      {/* Sneakers */}
      <path d="M24 124 L36 124 L36 128 L24 128 Z" fill="currentColor" stroke="none" />
      <path d="M44 124 L56 124 L56 128 L44 128 Z" fill="currentColor" stroke="none" />
    </svg>
  ),

  // 5. Round glasses, long-sleeve, holding coffee
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Hair side parting */}
      <path
        d="M30 28 Q28 19 40 16 Q52 19 51 26 Q43 24 38 28 Q33 30 30 28 Z"
        fill="currentColor"
        stroke="none"
      />
      <circle cx="40" cy="32" r="8.5" />
      {/* Glasses */}
      <circle cx="36.8" cy="33" r="2.6" />
      <circle cx="43.2" cy="33" r="2.6" />
      <path d="M39.4 33 H40.6" strokeWidth="0.9" />
      <path d="M34 32 L31 31" />
      <path d="M46 32 L49 31" />
      {/* Mouth */}
      <path d="M38 38 q2 0.6 4 0" />
      {/* Neck */}
      <path d="M40 41 V46" />
      {/* Sweater */}
      <path d="M28 50 L24 96 L56 96 L52 50 Z" />
      <path d="M28 50 q12 5 24 0" />
      {/* Arms - one out holding cup */}
      <path d="M52 50 L62 70 L60 76" />
      {/* Cup */}
      <path d="M55 76 H67 V88 Q67 91 64 91 H58 Q55 91 55 88 Z" fill="currentColor" stroke="none" />
      <path d="M55 80 Q51 81 51 84 Q51 87 55 86" stroke="currentColor" fill="none" />
      <path d="M56 76 V73 H66 V76" />
      <path d="M28 50 L22 80" />
      {/* Pants */}
      <path d="M32 96 L30 124" />
      <path d="M48 96 L50 124" />
      <path d="M26 126 H36" strokeWidth="2.5" />
      <path d="M44 126 H54" strokeWidth="2.5" />
    </svg>
  ),

  // 6. Beret + striped shirt + scarf, walking
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Beret */}
      <path d="M26 26 Q26 14 40 14 Q56 14 54 24 Q50 22 40 22 Q30 22 26 26 Z" fill="currentColor" stroke="none" />
      <circle cx="54" cy="20" r="2" fill="currentColor" />
      {/* Head */}
      <circle cx="40" cy="30" r="8.5" />
      <path d="M37 30 v0.3" strokeWidth="2" />
      <path d="M43 30 v0.3" strokeWidth="2" />
      <path d="M38 35 q2 0.8 4 0" />
      {/* Scarf */}
      <path d="M32 42 Q40 48 48 42 L52 52 Q40 56 28 52 Z" fill="currentColor" stroke="none" />
      <path d="M28 52 L24 64" stroke="currentColor" />
      {/* Striped shirt */}
      <path d="M30 50 L26 92 L54 92 L50 50 Z" />
      <path d="M28 60 H52" />
      <path d="M27 68 H53" />
      <path d="M26 76 H54" />
      <path d="M26 84 H54" />
      {/* Arms in walking pose */}
      <path d="M26 56 L18 80" />
      <path d="M54 56 L62 76" />
      {/* Pants in stride */}
      <path d="M32 92 L26 122" />
      <path d="M48 92 L52 124" />
      <path d="M22 124 H32" strokeWidth="2.5" />
      <path d="M48 126 H58" strokeWidth="2.5" />
    </svg>
  ),

  // 7. Bun hair, oversized cardigan, tote bag
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Bun on top */}
      <circle cx="40" cy="17" r="6" fill="currentColor" stroke="none" />
      {/* Hair on head */}
      <path
        d="M31 30 Q28 22 40 22 Q52 22 49 30 Q44 28 40 28 Q35 28 31 30 Z"
        fill="currentColor"
        stroke="none"
      />
      <circle cx="40" cy="32" r="8.5" />
      <path d="M37 32 v0.3" strokeWidth="2" />
      <path d="M43 32 v0.3" strokeWidth="2" />
      <path d="M38 38 q2 0.8 4 0" />
      <path d="M40 41 V46" />
      {/* Cardigan */}
      <path d="M24 50 L22 98 L58 98 L56 50 Z" />
      <path d="M40 50 V96" />
      <path d="M22 60 V90" />
      <path d="M58 60 V90" />
      {/* Tote bag */}
      <path d="M58 56 Q66 60 64 92" stroke="currentColor" />
      <rect x="58" y="86" width="14" height="14" rx="1" />
      <path d="M62 86 V81 Q62 78 65 78 Q68 78 68 81 V86" />
      {/* Arms */}
      <path d="M24 56 L18 82" />
      <path d="M56 56 L58 80" />
      {/* Pants */}
      <path d="M34 98 L32 124" />
      <path d="M46 98 L48 124" />
      <path d="M28 126 H38" strokeWidth="2.5" />
      <path d="M42 126 H52" strokeWidth="2.5" />
    </svg>
  ),

  // 8. Curly hair, denim jacket, hands in pocket
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Curly hair (multiple curls) */}
      <circle cx="30" cy="22" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="36" cy="18" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="42" cy="17" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="48" cy="19" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="52" cy="23" r="3.5" fill="currentColor" stroke="none" />
      <path d="M29 28 Q40 26 51 28 Q49 32 40 32 Q31 32 29 28 Z" fill="currentColor" stroke="none" />
      <circle cx="40" cy="34" r="8" />
      <path d="M37 33 v0.3" strokeWidth="2" />
      <path d="M43 33 v0.3" strokeWidth="2" />
      <path d="M38 39 q2 0.8 4 0" />
      <path d="M40 42 V46" />
      {/* Denim jacket */}
      <path d="M28 50 L26 94 L54 94 L52 50 Z" />
      <path d="M30 50 q10 5 20 0" />
      <path d="M40 52 V90" />
      <path d="M32 66 L36 70" />
      <path d="M48 66 L44 70" />
      {/* Hands in pocket — arms bent in */}
      <path d="M28 56 L30 76 L38 82" />
      <path d="M52 56 L50 76 L42 82" />
      <path d="M28 78 H38" />
      <path d="M52 78 H42" />
      {/* Jeans */}
      <path d="M32 94 L30 124" />
      <path d="M48 94 L50 124" />
      <path d="M27 126 H37" strokeWidth="2.5" />
      <path d="M43 126 H53" strokeWidth="2.5" />
    </svg>
  ),

  // 9. Wide hat (sun hat), summer dress, looking up
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Wide-brim hat */}
      <ellipse cx="40" cy="26" rx="22" ry="3" fill="currentColor" stroke="none" />
      <path d="M28 26 Q28 14 40 14 Q52 14 52 26 Z" fill="currentColor" stroke="none" />
      <path d="M28 22 Q40 18 52 22" strokeWidth="0.8" stroke="white" />
      {/* Head */}
      <circle cx="40" cy="32" r="8.5" />
      <path d="M37 31 v0.3" strokeWidth="2" />
      <path d="M43 31 v0.3" strokeWidth="2" />
      <path d="M38 37 q2 1.2 4 0" />
      {/* Light hair below hat */}
      <path d="M32 32 Q30 40 32 46" stroke="currentColor" />
      <path d="M48 32 Q50 40 48 46" stroke="currentColor" />
      <path d="M40 41 V46" />
      {/* Summer dress */}
      <path d="M28 50 Q25 80 24 110 L56 110 Q55 80 52 50 Z" />
      <path d="M30 50 q10 4 20 0" />
      {/* Flower print */}
      <circle cx="34" cy="68" r="1.2" fill="currentColor" />
      <circle cx="44" cy="76" r="1.2" fill="currentColor" />
      <circle cx="38" cy="86" r="1.2" fill="currentColor" />
      <circle cx="46" cy="92" r="1.2" fill="currentColor" />
      {/* Arms */}
      <path d="M28 52 L22 78" />
      <path d="M52 52 L58 78" />
      {/* Legs */}
      <path d="M36 110 L34 124" />
      <path d="M44 110 L46 124" />
      {/* Sandals */}
      <path d="M30 126 H38" strokeWidth="2.5" />
      <path d="M42 126 H50" strokeWidth="2.5" />
    </svg>
  ),

  // 10. Big hoodie + earbuds, gaming controller
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Hair (medium) */}
      <path
        d="M29 28 Q26 16 40 14 Q54 16 51 28 Q44 24 40 24 Q36 24 29 28 Z"
        fill="currentColor"
        stroke="none"
      />
      <circle cx="40" cy="32" r="8.5" />
      <path d="M37 32 v0.3" strokeWidth="2" />
      <path d="M43 32 v0.3" strokeWidth="2" />
      <path d="M38 38 q2 0.8 4 0" />
      {/* Earbuds */}
      <circle cx="31.5" cy="34" r="1.4" fill="currentColor" />
      <circle cx="48.5" cy="34" r="1.4" fill="currentColor" />
      <path d="M40 41 V46" />
      {/* Big hoodie */}
      <path d="M24 50 L20 100 L60 100 L56 50 Z" />
      <path d="M28 48 Q40 56 52 48 L52 54 Q40 60 28 54 Z" stroke="currentColor" fill="none" />
      <path d="M40 60 V96" strokeDasharray="2 2" />
      {/* Arms holding controller */}
      <path d="M26 60 L30 78 L36 82" />
      <path d="M54 60 L50 78 L44 82" />
      {/* Controller */}
      <rect x="32" y="80" width="16" height="9" rx="3" />
      <circle cx="35" cy="84.5" r="1" fill="currentColor" />
      <circle cx="45" cy="84.5" r="1" fill="currentColor" />
      <path d="M40 82 V87" />
      {/* Pants */}
      <path d="M34 100 L32 124" />
      <path d="M46 100 L48 124" />
      <path d="M27 124 L37 124 L37 128 L27 128 Z" fill="currentColor" stroke="none" />
      <path d="M43 124 L53 124 L53 128 L43 128 Z" fill="currentColor" stroke="none" />
    </svg>
  ),

  // 11. Pony tail, running outfit, mid-stride
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Head + small hair top */}
      <path
        d="M30 28 Q28 20 40 18 Q52 20 50 28 Q44 26 40 26 Q36 26 30 28 Z"
        fill="currentColor"
        stroke="none"
      />
      {/* Pony tail flying back */}
      <path d="M48 26 Q60 28 64 36 Q66 42 60 44 Q56 38 50 32 Z" fill="currentColor" stroke="none" />
      <circle cx="40" cy="32" r="8" />
      <path d="M37 31 v0.3" strokeWidth="2" />
      <path d="M43 31 v0.3" strokeWidth="2" />
      <path d="M38 37 q2 0.8 4 0" />
      <path d="M40 40 V44" />
      {/* Tank top */}
      <path d="M30 48 L26 76 L52 76 L50 48 Z" />
      <path d="M30 48 q10 4 20 0" />
      <path d="M40 48 V72" />
      {/* Arms in running motion — one back, one forward */}
      <path d="M28 52 L18 60 L20 70" />
      <path d="M52 52 L62 64 L60 72" />
      {/* Shorts */}
      <path d="M28 76 L30 90 L50 90 L52 76 Z" />
      {/* Legs in stride */}
      <path d="M32 90 L24 112" />
      <path d="M48 90 L58 112" />
      <path d="M20 114 H30" strokeWidth="3" />
      <path d="M52 114 H62" strokeWidth="3" />
    </svg>
  ),

  // 12. Beanie, beard, holding a book, sitting on a stool
  (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
      {/* Beanie */}
      <path d="M28 28 Q28 14 40 14 Q52 14 52 28 Z" fill="currentColor" stroke="none" />
      <path d="M28 26 Q40 22 52 26" strokeWidth="0.8" stroke="white" />
      <circle cx="40" cy="14" r="1.6" fill="currentColor" />
      {/* Head */}
      <circle cx="40" cy="32" r="8.5" />
      <path d="M37 32 v0.3" strokeWidth="2" />
      <path d="M43 32 v0.3" strokeWidth="2" />
      {/* Beard */}
      <path d="M33 36 Q33 42 40 44 Q47 42 47 36" fill="currentColor" stroke="none" />
      <path d="M40 42 V46" />
      {/* Shirt */}
      <path d="M30 50 L28 86 L52 86 L50 50 Z" />
      <path d="M30 50 q10 5 20 0" />
      {/* Arms holding open book */}
      <path d="M28 54 L24 72 L30 78" />
      <path d="M52 54 L56 72 L50 78" />
      {/* Book */}
      <path d="M28 76 L40 80 L52 76 L52 86 L40 90 L28 86 Z" />
      <path d="M40 80 V90" />
      {/* Legs (sitting, bent) */}
      <path d="M32 86 Q26 92 26 100" />
      <path d="M48 86 Q54 92 54 100" />
      <path d="M22 100 H30" strokeWidth="2.5" />
      <path d="M50 100 H58" strokeWidth="2.5" />
      {/* Stool */}
      <rect x="28" y="100" width="24" height="3" fill="currentColor" stroke="none" />
      <path d="M30 103 L26 124" />
      <path d="M50 103 L54 124" />
    </svg>
  ),
]

export default function Crowd() {
  // Duplicate twice so the loop is seamless
  const set = Array.from({ length: 3 }, () => Figures).flat()

  return (
    <div className="relative w-full overflow-hidden select-none" aria-hidden="true">
      <div className="crowd-track items-end gap-6 px-6">
        {set.map((Fig, i) => (
          <Fig key={i} className="crowd-figure" />
        ))}
      </div>
    </div>
  )
}
