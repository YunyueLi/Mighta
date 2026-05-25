import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowRight } from "../components/Icons"
import Nav from "../components/Nav"
import Crowd from "../components/Crowd"

export default function Landing() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Nav />
      <div className="hero-orb" aria-hidden="true" />

      {/* ─────────── HERO ─────────── */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="rise rise-1 small-caps text-[10.5px] text-fg-dim mb-10">
            {t("landing.kicker")}
          </p>

          <h1
            className="rise rise-2 text-fg text-balance leading-[1.06]"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              letterSpacing: '-0.025em',
            }}
          >
            {t("landing.hero_pre")}{" "}
            <span className="relative inline-block">
              <span
                className="script text-accent"
                style={{
                  fontSize: "1.32em",
                  lineHeight: 0.9,
                  display: "inline-block",
                  transform: "translateY(0.06em) rotate(-2deg)",
                }}
              >
                {t("landing.hero_accent")}
              </span>
              {/* Hand-drawn underline */}
              <svg
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                className="absolute left-0 right-0 -bottom-1 w-full h-[0.32em] pointer-events-none"
                aria-hidden="true"
              >
                <path
                  d="M2 8 Q 30 3, 60 7 T 120 6 T 198 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="draw-underline text-accent"
                />
              </svg>
            </span>{" "}
            {t("landing.hero_post")}
          </h1>

          <p className="rise rise-3 mt-10 max-w-xl mx-auto text-fg-soft text-[15px] md:text-base leading-[1.7] text-pretty">
            {t("landing.subtitle")}
          </p>

          <div className="rise rise-4 mt-12 flex items-center justify-center gap-6 text-[13px]">
            <Link
              to="/spawn"
              className="group inline-flex items-center gap-2 text-fg hover:text-accent transition-colors duration-300"
            >
              <span className="small-caps">{t("landing.scroll_hint")}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────── THE CROWD (above doors) ─────────── */}
      <section className="relative px-0 pt-4 pb-2">
        <div className="max-w-5xl mx-auto px-6 mb-8">
          <p
            className="script text-fg text-center"
            style={{ fontSize: "1.65rem" }}
          >
            {t("landing.crowd_caption")}
          </p>
        </div>
        <Crowd />
      </section>

      {/* ─────────── TWO DOORS ─────────── */}
      <section className="relative px-6 pt-16 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-16">
            <hr className="rule w-12" />
            <span className="folio mx-5">two doors</span>
            <hr className="rule w-12" />
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            <DoorCard
              to="/spawn"
              numeral="I"
              kicker={t("landing.door_one_kicker")}
              title={t("landing.door_one_title")}
              subtitle={t("landing.door_one_subtitle")}
              hint={t("landing.door_one_hint")}
            />
            <DoorCard
              to="/restore"
              numeral="II"
              kicker={t("landing.door_two_kicker")}
              title={t("landing.door_two_title")}
              subtitle={t("landing.door_two_subtitle")}
              hint={t("landing.door_two_hint")}
            />
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="px-6 pt-16 pb-12">
        <div className="max-w-5xl mx-auto">
          <hr className="rule mb-6" />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="serif-italic text-fg-dim text-[13px]">
              {t("landing.footer_tagline")}
            </span>
            <span className="folio">{t("landing.version")}</span>
          </div>
          <p className="folio mt-4 text-fg-faint">{t("landing.footer_kicker")}</p>
        </div>
      </footer>
    </div>
  )
}

function DoorCard({
  to,
  numeral,
  kicker,
  title,
  subtitle,
  hint,
}: {
  to: string
  numeral: string
  kicker: string
  title: string
  subtitle: string
  hint: string
}) {
  return (
    <Link to={to} className="card group block p-10 md:p-12 relative">
      <div className="flex items-baseline justify-between mb-12">
        <span
          className="script text-fg-dim group-hover:text-accent transition-colors duration-500"
          style={{ fontSize: "2.4rem", lineHeight: 1 }}
        >
          {numeral}.
        </span>
        <span className="folio">{kicker}</span>
      </div>

      <h2
        className="text-fg leading-[1.1] mb-5 text-balance"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
          fontWeight: 500,
          letterSpacing: '-0.015em',
        }}
      >
        {title}
      </h2>

      <p className="text-fg-soft text-[14.5px] leading-[1.7] mb-10 text-balance max-w-md">
        {subtitle}
      </p>

      <hr className="rule mb-4" />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] text-fg-dim leading-relaxed">{hint}</span>
        <ArrowRight className="w-4 h-4 text-fg-dim group-hover:text-fg group-hover:translate-x-0.5 transition-all duration-500" />
      </div>
    </Link>
  )
}
