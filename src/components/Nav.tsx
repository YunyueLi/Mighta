import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Settings as SettingsIcon, Github } from "./Icons"
import LanguageSwitch from "./LanguageSwitch"
import ThemeSwitch from "./ThemeSwitch"
import { cn } from "../lib/cn"

export default function Nav() {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-[12px] bg-bg/70 border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="serif text-[20px] text-fg hover:text-accent transition-colors duration-300 tracking-tight"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 460, "SOFT" 30' }}
        >
          mighta<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-1 text-[13px]">
          <NavLink to="/spawn" current={pathname} label={t("nav.spawn")} />
          <NavLink to="/restore" current={pathname} label={t("nav.restore")} />
          <span className="mx-2 text-fg-faint">·</span>
          <LanguageSwitch compact />
          <ThemeSwitch compact />
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-fg-dim hover:text-fg transition-colors duration-300"
            aria-label={t("nav.github")}
          >
            <Github className="w-[15px] h-[15px]" />
          </a>
          <Link
            to="/settings"
            className="p-2 text-fg-dim hover:text-fg transition-colors duration-300"
            aria-label={t("nav.settings")}
          >
            <SettingsIcon className="w-[15px] h-[15px]" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, current, label }: { to: string; current: string; label: string }) {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-1.5 rounded transition-colors duration-300",
        current === to ? "text-fg" : "text-fg-dim hover:text-fg"
      )}
    >
      {label}
    </Link>
  )
}
