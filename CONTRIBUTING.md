# Contributing to mighta

Thanks for being here. mighta is small and personal — contributions should match that tone.

## Quick orientation

```
src/
├── pages/           # 4 pages: Landing / Spawn / Restore / Settings
├── components/      # Reusable: Timeline, ForkCard, Importer, Crowd, switches
├── lib/             # llm provider abstraction, prompts, presets, i18n, store
└── locales/         # 8 JSON files (en/zh/zh-TW/ja/ko/es/fr/de)
```

## Easy contributions

### Add a preset (~5 min)

The most welcome contribution. Open `src/lib/presets.ts` and add a new entry. Each preset is a famous life or a "what if you..." scenario.

```ts
{
  id: "your_slug",
  category: "famous" | "scenario",
  name: t("preset.your_slug.name"),
  age: 42,
  bio: "One or two concrete sentences. No fluff.",
  nodes: [
    { age: 18, event: "Specific event with names/places" },
    // 3–6 forks
  ],
}
```

Then add the `name` translation to all 8 locale files in `src/locales/`. The bio + nodes stay in English (Claude adapts output to the user's language).

### Fix a translation

If a phrase reads stiff in your language, just edit the locale file. Brevity > literal. The product tone is restrained, literary — not "AI assistant" chirpy.

### Add a language

1. Copy `src/locales/en.json` to `src/locales/<lang>.json`
2. Translate (lean restrained / literary — like contemporary novelists)
3. Register in `src/lib/i18n.ts` (`LANGUAGES` array + `resources`)
4. Add a CJK fallback override in `src/index.css` if needed (see `:lang(zh) .script`)
5. Add a language directive in `src/lib/spawnPrompt.ts` so Claude outputs in your language

### Add a model provider

Open `src/lib/llm/providers.ts`. Most providers are OpenAI-compatible — just need a `baseURL` and a `models` list.

```ts
{
  id: "your-provider",
  name: "Your Provider",
  type: "openai-compat",
  baseURL: "https://api.yours.com/v1",
  defaultModel: "model-id",
  models: [{ id: "model-id", label: "Model Name", speed: "fast" }],
  keyDocsUrl: "...",
  keyHint: "sk-...",
  region: "global" | "cn",
}
```

## Bigger contributions

For new features (Restore module, sharing, library, etc.), open an issue first to discuss scope.

## Style

- **Restraint over flair.** No emoji in product copy. No "AI assistant" tone.
- **Concrete over abstract.** "Joined Google in 2014" not "started a career".
- **Specific over universal.** A real fork is a Tuesday in October, not "age 22".

## Development

```bash
npm install
npm run dev
```

You need an API key from one of the providers in Settings to actually generate forks.

## Code quality

- TypeScript strict
- Tailwind 4 (no `tailwind.config.js`; theme lives in `src/index.css`)
- Format: don't bother with a formatter on small PRs; we'll reconcile

## License

By contributing, you agree your contribution is MIT-licensed.
