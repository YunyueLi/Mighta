import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Landing from "./pages/Landing"
import Spawn from "./pages/Spawn"
import Restore from "./pages/Restore"
import Settings from "./pages/Settings"
import { useThemeInit } from "./lib/theme"

export default function App() {
  useThemeInit()
  const { i18n } = useTranslation()

  // Sync html lang so :lang() CSS can target CJK
  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/spawn" element={<Spawn />} />
      <Route path="/restore" element={<Restore />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}
