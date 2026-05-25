# Deploy mighta to Cloudflare Pages

Two paths — pick one. Path A is one-time setup, then every `git push` auto-deploys. Path B is a manual one-shot.

---

## Path A · Dashboard (recommended — continuous deploy)

1. Go to <https://dash.cloudflare.com/?to=/:account/workers-and-pages>
2. Click **Create application** → **Pages** tab → **Connect to Git**
3. Authorize Cloudflare to read your GitHub account (one-time)
4. Pick the repo: **YunyueLi/Mighta**
5. Set build configuration:

| Field | Value |
|---|---|
| Framework preset | `None` (or `Vite` — both work) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | _(leave blank)_ |
| Node version | `22` (set as env var `NODE_VERSION=22` if needed) |

6. Click **Save and Deploy**. First build takes ~90 seconds.
7. You'll get a URL like `mighta.pages.dev`. Tell that URL back to the README + GitHub homepage (see "After deploy" below).

From here on, every `git push` to `main` auto-deploys. Branch pushes get preview URLs.

---

## Path B · CLI (one-shot, no GitHub integration)

You need to be logged in to Cloudflare once:

```bash
npx wrangler login
# (opens a browser, click "Allow")
```

Then anytime:

```bash
npm run deploy
```

That runs `npm run build && wrangler pages deploy dist`. First run creates the `mighta` Pages project automatically; later runs upload to it.

---

## After deploy

Once you have a URL (e.g. `https://mighta.pages.dev`):

```bash
# Set the repo's homepage on GitHub
gh repo edit --homepage "https://mighta.pages.dev"

# Update the README — replace the placeholder Live Demo link
sed -i '' 's|](#)|](https://mighta.pages.dev)|g' README.md README-zh.md

git add README.md README-zh.md
git commit -m "docs: live demo URL"
git push
```

---

## SPA caveat

`public/_redirects` rewrites every path to `/index.html` (status 200) so deep links like `/spawn` and `/settings` work after a hard reload. Cloudflare Pages reads this file at the project root of `dist/` automatically.

## Custom domain (later)

When you're ready: Cloudflare dashboard → your Pages project → **Custom domains** → add `mighta.app` (or whatever) → CNAME, automatic SSL.
