import { useEffect } from "react"
import { useSettings, type ThemeMode } from "./store"

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "auto") {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
  }
  return mode
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = resolveTheme(mode)
}

export function useThemeInit() {
  const theme = useSettings((s) => s.theme)
  useEffect(() => {
    applyTheme(theme)
    if (theme !== "auto") return
    const mq = window.matchMedia("(prefers-color-scheme: light)")
    const handler = () => applyTheme("auto")
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])
}
