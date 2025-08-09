## Playground React + TypeScript + Vite + Tailwind + GitHub Pages

Deployed automatically to GitHub Pages with end-to-end (Playwright) tests run after each deployment (including preview deployments for pull requests).

### Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173 – hot reload is enabled.

### Technology Stack

- React 18 + TypeScript
- Vite (fast dev server & build)
- Tailwind CSS
- Playwright (cross-browser e2e)
- GitHub Actions (CI/CD)
- GitHub Pages (hosting)

### Project Scripts

- dev: start local dev server with hot reload
- build: type-check and create production bundle
- preview: preview the production build locally
- test:e2e: run Playwright tests (starts dev server automatically if BASE_URL not set)
- test:e2e:ci: CI-friendly reporter
- test:e2e:report: open last HTML report

### Running Locally With Hot Reload

```bash
pnpm install
pnpm dev
```

### Local Production Preview

```bash
pnpm build
pnpm preview
```

### Deploy Flow (GitHub Actions)

1. Push to main (or open a pull request) triggers workflow.
2. Build job creates static bundle (dist) and uploads artifact.
3. Deploy job publishes to GitHub Pages (production for main, preview for PRs) and exposes the site URL as an output.
4. E2E job runs Playwright tests against the deployed URL (production or preview). Failing tests will fail the workflow but the deployment artifact remains available.

### Manual Deployment

Trigger the workflow manually via the Actions tab (workflow_dispatch). It will build, deploy, and test just like a push.

### Running Playwright Tests Locally

Default (will start dev server automatically):
```bash
pnpm test:e2e
```

Against an already running or deployed site:
```bash
BASE_URL=http://localhost:5173 pnpm test:e2e
```

Open HTML report:
```bash
pnpm test:e2e:report
```

### Running E2E in GitHub Actions

The workflow installs browsers, deploys the site, and sets BASE_URL to the deployed (or preview) URL before running tests.

### Updating Tailwind Styles

Edit `src/index.css` or add utility classes directly in components. Purge is automatic via content globs in `tailwind.config.js`.

### Common Tasks

| Task | Command |
|------|---------|
| Install deps | pnpm install |
| Start dev | pnpm dev |
| Build prod | pnpm build |
| Preview build | pnpm preview |
| Run e2e | pnpm test:e2e |
| E2E CI style | pnpm test:e2e:ci |
| Show last report | pnpm test:e2e:report |

### Notes

- The `BASE_URL` env var disables the auto-start webServer in Playwright so tests target the provided deployment.
- For PRs, a preview URL is used (supports review before merge). The workflow selects `page_url` or `preview_url` automatically.
- Lockfile is ignored in `.gitignore` for simplicity; remove that line to pin dependencies.

### Next Ideas

- Add unit tests with Vitest.
- Add ESLint + Prettier config files.
- Introduce a basic router for multiple pages.

---
Happy hacking!
