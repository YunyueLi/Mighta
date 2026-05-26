import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Eye, EyeOff } from "../components/Icons"
import Nav from "../components/Nav"
import { useSettings } from "../lib/store"
import { PROVIDERS, getProvider, type Provider } from "../lib/llm/providers"
import LanguageSwitch from "../components/LanguageSwitch"
import ThemeSwitch from "../components/ThemeSwitch"

export default function Settings() {
  const { t } = useTranslation()
  const { activeProvider, creds, setActiveProvider, setProviderCreds, clearProvider } = useSettings()
  const provider = getProvider(activeProvider)
  const current = creds[activeProvider]

  const [draftKey, setDraftKey] = useState(current?.apiKey ?? "")
  const [draftModel, setDraftModel] = useState(current?.model || provider.defaultModel)
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  // Sync drafts when active provider changes (render-time prev tracking — React 19 canonical)
  const [prevActive, setPrevActive] = useState(activeProvider)
  if (prevActive !== activeProvider) {
    setPrevActive(activeProvider)
    setDraftKey(current?.apiKey ?? "")
    setDraftModel(current?.model || provider.defaultModel)
    setSaved(false)
  }

  const dirty =
    draftKey.trim() !== (current?.apiKey ?? "") ||
    draftModel !== (current?.model ?? provider.defaultModel)

  function save() {
    setProviderCreds(activeProvider, draftKey.trim(), draftModel)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const providersByRegion = useMemo(
    () => ({
      global: PROVIDERS.filter((p) => p.region === "global"),
      cn: PROVIDERS.filter((p) => p.region === "cn"),
    }),
    []
  )

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-28 pb-32 px-6 max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[13px] text-fg-dim hover:text-fg mb-12 transition-colors duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t("settings.back")}
        </Link>

        <p className="small-caps text-[10.5px] text-fg-dim mb-4">{t("settings.kicker")}</p>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-fg leading-[1.05] mb-5"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: "clamp(1.875rem, 3.6vw, 3rem)",
            fontWeight: 460,
            letterSpacing: '-0.022em',
          }}
        >
          {t("settings.title")}
        </motion.h1>
        <p className="text-fg-soft text-[15px] leading-[1.75] mb-16 max-w-xl">
          {t("settings.intro_pre")}{" "}
          <span className="text-fg">{t("settings.intro_provider")}</span>
          {t("settings.intro_post")}
          <code className="text-accent font-mono text-[13px] mx-1">
            {t("settings.intro_localstorage")}
          </code>
          {t("settings.intro_end")}
        </p>

        <Section label={t("settings.language_label")}>
          <LanguageSwitch />
        </Section>

        <Section label="theme">
          <ThemeSwitch />
        </Section>

        <Section label={t("settings.provider_label")}>
          <div className="space-y-7">
            <ProviderRow
              label="global"
              providers={providersByRegion.global}
              active={activeProvider}
              hasKey={(id) => !!creds[id]?.apiKey}
              onSelect={setActiveProvider}
            />
            <ProviderRow
              label="china"
              providers={providersByRegion.cn}
              active={activeProvider}
              hasKey={(id) => !!creds[id]?.apiKey}
              onSelect={setActiveProvider}
            />
          </div>
        </Section>

        <Section label={t("settings.model_label")}>
          <div className="space-y-1.5">
            {provider.models.map((m) => (
              <button
                key={m.id}
                onClick={() => setDraftModel(m.id)}
                className={`w-full flex items-baseline justify-between gap-4 px-4 py-3 rounded text-left transition-colors duration-300 ${
                  draftModel === m.id
                    ? "bg-bg-elevated border border-line-bright"
                    : "border border-line hover:bg-bg-elevated"
                }`}
              >
                <div>
                  <div className="text-[14px] text-fg">{m.label}</div>
                  <div className="folio mt-0.5">{m.id}</div>
                </div>
                {m.speed && (
                  <span className="small-caps text-[10px] text-fg-dim">
                    {t(`settings.speed_${m.speed}`)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Section>

        <Section label={t("settings.key_label", { provider: provider.name })}>
          <div className="relative mb-3">
            <input
              type={show ? "text" : "password"}
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              placeholder={provider.keyHint}
              className="w-full bg-transparent border-b border-line py-3 pr-10 font-mono text-[13.5px] text-fg placeholder:text-fg-faint focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-fg-dim hover:text-fg transition-colors duration-300"
              aria-label={show ? "Hide" : "Show"}
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <a
            href={provider.keyDocsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] text-fg-dim hover:text-accent transition-colors duration-300 inline-block"
          >
            {t("settings.get_key")}
          </a>

          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={save}
              disabled={!draftKey.trim() || !dirty}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-fg text-bg rounded-full text-[13px] font-medium hover:bg-accent disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" /> {t("settings.saved")}
                </>
              ) : (
                t("settings.save")
              )}
            </button>
            {current?.apiKey && (
              <button
                onClick={() => {
                  clearProvider(activeProvider)
                  setDraftKey("")
                }}
                className="px-4 py-2.5 text-fg-dim hover:text-accent text-[13px] transition-colors duration-300"
              >
                {t("settings.clear")}
              </button>
            )}
          </div>

          {current?.apiKey && (
            <p className="folio mt-5">
              {t("settings.current")}:{" "}
              <span className="text-accent">
                {current.apiKey.slice(0, 8)}…{current.apiKey.slice(-4)}
              </span>
              <span className="text-fg-faint"> · {current.model}</span>
            </p>
          )}
        </Section>
      </main>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="small-caps text-[10.5px] text-fg-dim mb-5">{label}</h2>
      {children}
    </section>
  )
}

function ProviderRow({
  label,
  providers,
  active,
  hasKey,
  onSelect,
}: {
  label: string
  providers: Provider[]
  active: string
  hasKey: (id: string) => boolean
  onSelect: (id: string) => void
}) {
  return (
    <div>
      <p className="folio mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`relative px-3.5 py-1.5 rounded-full border text-[13px] transition-colors duration-300 inline-flex items-center gap-2 ${
              active === p.id
                ? "border-line-bright bg-bg-elevated text-fg"
                : "border-line text-fg-dim hover:text-fg hover:border-line-bright"
            }`}
          >
            {p.name}
            {hasKey(p.id) && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
          </button>
        ))}
      </div>
    </div>
  )
}
