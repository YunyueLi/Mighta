# Deploy mighta

mighta is a pure static SPA. Two confirmed paths:

---

## GitHub Pages (current production)

**URL:** [https://yunyueli.github.io/Mighta/](https://yunyueli.github.io/Mighta/)

Set up via `.github/workflows/pages.yml`. Every push to `main` rebuilds and redeploys (~60s).

**One-time setup** (only needed if forking):

1. Push `.github/workflows/pages.yml` to your fork.
2. Go to **Settings → Pages**.
3. Under **Source**, pick **GitHub Actions**.
4. Push to `main` — the workflow takes over.

**SPA caveat**: the workflow copies `dist/index.html` to `dist/404.html` so that GitHub Pages serves the React app on every path (including deep links like `/spawn`, `/settings`). React Router takes over from there.

**Path-based base URL**: Vite is configured with `base: '/Mighta/'` in production (matching the repo name). React Router uses `basename={import.meta.env.BASE_URL}` so client routing works seamlessly.

---

## Cloudflare Workers + Static Assets (alternative)

Kept for reference. To deploy via Cloudflare instead:

```bash
npx wrangler login        # one-time, browser OAuth
npm run deploy            # wraps wrangler pages deploy
```

`wrangler.toml` is set up for [assets] static site mode with `not_found_handling = "single-page-application"`.

You'll want to set `base: '/'` in `vite.config.ts` if you switch — Cloudflare serves at the root of the worker domain, not a path prefix.

---

## Custom domain (later)

When you're ready:

- **GitHub Pages**: Settings → Pages → Custom domain → add `mighta.app`. Set CNAME `mighta.app → yunyueli.github.io` at your DNS provider.
- **Cloudflare**: dashboard → your project → Custom domains → add → CNAME, automatic SSL.

Custom domain bypasses the `*.github.io` / `*.workers.dev` DNS issues some networks have.
