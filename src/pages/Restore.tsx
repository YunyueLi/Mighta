import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import Nav from "../components/Nav"

export default function Restore() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <header className="mb-14 text-center">
          <p className="small-caps text-[10.5px] text-fg-dim mb-5">{t("restore.kicker")}</p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-fg leading-[1.05] text-balance"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: "clamp(1.875rem, 4vw, 3.5rem)",
              fontWeight: 460,
              letterSpacing: '-0.022em',
            }}
          >
            {t("restore.title")}
          </motion.h1>
          <p className="mt-5 text-fg-soft text-[15px] max-w-xl mx-auto leading-[1.7] text-balance">
            {t("restore.subtitle")}
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card p-16 text-center"
        >
          <p className="folio mb-5">soon</p>
          <p
            className="script text-fg text-balance max-w-md mx-auto"
            style={{ fontSize: "1.75rem" }}
          >
            {t("restore.placeholder_msg")}
          </p>
        </motion.div>
      </main>
    </div>
  )
}
