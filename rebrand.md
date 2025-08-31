# Rebrand Plan: Unsend → UseSend

This document outlines a comprehensive plan to rebrand the monorepo from “Unsend/unsend” to “UseSend/usesend”. It covers naming decisions, code changes, assets, infra, docs/marketing, migration strategy, and verification steps.

## 1) Naming Decisions (confirm before changes)
- Product name: UseSend (product), usesend (lowercase identifier)
- Package scope: `@usesend/*`
- SDK package name: `usesend` (replaces unscoped `unsend`)
- Domains: `usesend.com`, `app.usesend.com`, `docs.usesend.com`, `smtp.usesend.com`
- Emails: `hello@usesend.com` (and other contact addresses)
- HTTP headers: `X-Usesend-*` (case-conservative; accept legacy `X-Unsend-*`)
- Env var prefix: `USESEND_*` (keep `UNSEND_*` for a deprecation window)
- Docker images: `usesend/usesend`, `usesend/smtp-proxy`, `ghcr.io/usesend-dev/*`
- GitHub: org/repo rename to `usesend-dev/usesend` (or final org name)

Decide capitalization conventions in code: class names UseSend (PascalCase), variables `usesend` (camel), CSS class prefix `usesend-`.

## 2) Repo-wide Code Changes

### 2.1 Workspace and config
- Root `package.json`:
  - name: `unsend` → `usesend`
  - scripts referencing `@unsend/*` filters → `@usesend/*`
- Root `tsconfig.json`: `extends` → `@usesend/typescript-config/*`
- Root ESLint config `.eslintrc.js`: `@unsend/eslint-config/*` → `@usesend/eslint-config/*`
- `pnpm-lock.yaml`: will update after installs; do not edit manually.

### 2.2 Internal packages (packages/*)
- `packages/eslint-config/package.json`: rename to `@usesend/eslint-config`.
- `packages/typescript-config/package.json`: rename to `@usesend/typescript-config`.
- `packages/tailwind-config/package.json`: rename to `@usesend/tailwind-config`.
- `packages/ui/package.json`: rename to `@usesend/ui`.
- Update all imports to new scope:
  - `@unsend/ui` → `@usesend/ui`
  - `@unsend/tailwind-config` → `@usesend/tailwind-config`
  - `@unsend/eslint-config` → `@usesend/eslint-config`
  - `@unsend/typescript-config` → `@usesend/typescript-config`

### 2.3 SDK (`packages/sdk`)
- Package rename: `unsend` → `usesend`.
- Class rename: `Unsend` → `UseSend`.
- Default base URL: `https://app.unsend.dev` → `https://app.usesend.com`.
- Env var name: read `USESEND_BASE_URL` and `USESEND_API_KEY`; continue supporting `UNSEND_BASE_URL`/`UNSEND_API_KEY` with deprecation warnings.
- Headers: set `X-Usesend-Email-ID` (and accept/read legacy on server side).
- Create backward-compat entry points:
  - Temporary alias export `export { UseSend as Unsend }` with deprecation notice in docs/README.
  - Optionally publish a final `unsend` package version that re-exports from `usesend` and marks deprecated.

### 2.4 Email Editor (`packages/email-editor`)
- Update any copy (“Unsend is the best…”) to “UseSend”.
- Update URLs `unsend.dev` → `usesend.com`.
- CSS class prefixes: `.unsend-editor`, `.unsend-prose` → `.usesend-editor`, `.usesend-prose`.
  - Maintain a short transitional alias by duplicating rules or using combined selectors for one release.
- Imports from `@unsend/ui` → `@usesend/ui` and `@unsend/*` → `@usesend/*`.

### 2.5 Web app (`apps/web`)
- Imports: replace `@unsend/*` → `@usesend/*`.
- Metadata/title/alt text: “Unsend” → “UseSend”. Files to update include:
  - `src/app/layout.tsx` (Metadata title/description)
  - Components with `alt="Unsend"` (e.g., `FullScreenLoading.tsx`, email templates)
  - Sidebar branding (`AppSideBar.tsx`)
- Default external URLs (docs, site, API examples): use `usesend.com` and `app.usesend.com`.
- Env validation (`src/env.js`):
  - Add `USESEND_API_KEY` server var. Keep `UNSEND_API_KEY` for now; prefer `USESEND_API_KEY`.
  - Update defaults: `SMTP_HOST` default `smtp.unsend.dev` → `smtp.usesend.com`; `SMTP_USER` default `unsend` → `usesend`.
- API/Public API (`src/server/public-api/hono.ts`):
  - “Unsend API” → “UseSend API”.
  - Error class `UnsendApiError` → `UsesendApiError` (provide re-export alias to avoid cascading rename or refactor usages in same PR).
- Headers in sending logic:
  - `X-Unsend-Email-ID` → `X-Usesend-Email-ID` when sending (keep both in interim).
  - Hook parser (`ses-hook-parser.ts`): accept both headers.
- Email templates/copies: “Unsend” → “UseSend” (OTP, TeamInvite, test templates, etc.).
- Code examples in `src/lib/constants/example-codes.ts`: domains and SDK import/class rename.

### 2.6 SMTP proxy (`apps/smtp-server`)
- Env names: prefer `USESEND_BASE_URL`; continue reading `UNSEND_BASE_URL`.
- Default base URL: `https://app.usesend.com`.
- Example docker-compose: image `usesend/smtp-proxy`; service name `usesend-smtp-server`.
- Update demo strings and links (`usage.js`).

### 2.7 Marketing site (`apps/marketing`)
- Imports: `@unsend/*` → `@usesend/*`.
- Site metadata: Title/name/siteName/OG images from “Unsend”/`unsend.dev` → “UseSend”/`usesend.com`.
- Text copy: “Welcome to unsend!” etc. → “Welcome to UseSend!”.
- Examples + email addresses: `hello@usesend.com` and URLs to `usesend.com`.

### 2.8 Docs (`apps/docs` with Mintlify)
- `mint.json`:
  - `name`: “UseSend”.
  - Support email `mailto:hello@usesend.com`.
  - Dashboard URL `https://app.usesend.com`.
  - Anchors/GitHub links: `usesend-dev/usesend`.
  - Footer socials: update X/Twitter and GitHub org if changed.
- MDX content:
  - All Unsend → UseSend, domains/links to `usesend.com` family.
  - Self-hosting and local guides: update env var names, docker image names, compose service names.
  - SMTP guide: `UNSEND_BASE_URL` → `USESEND_BASE_URL`; hostnames.

## 3) Infrastructure & CI/CD

- Docker
  - Image names/tags:
    - Build script `docker/build.sh`: `unsend/unsend` → `usesend/usesend`; `ghcr.io/unsend-dev` → `ghcr.io/usesend-dev`.
    - Compose files (`docker/dev/compose.yml`, `docker/prod/compose.yml`): service names, image names, container names from `unsend*` → `usesend*`.
    - SMTP defaults and env users.
  - Volumes/paths using `/data/unsend` → `/data/usesend`.
- GitHub Actions (`.github/workflows/publish.yml`)
  - Update image publish targets to `usesend/*` and `ghcr.io/usesend-dev/*`.
  - Rename matrix APP list if needed (`unsend` → `usesend`).
- Issue templates (`.github/ISSUE_TEMPLATE/*`): mentions of app.unsend.dev → app.usesend.dev.

## 4) Environment & Defaults

- `.env.example` and `.env.selfhost.example`:
  - Database defaults `unsend` → `usesend`.
  - `FROM_EMAIL=hello@usesend.dev`.
  - SMTP default user `usesend`.
- `turbo.json` env set:
  - Add `USESEND_API_KEY`; keep `UNSEND_API_KEY` for compatibility.

## 5) Public Assets & Branding

- Replace logos and wordmarks in:
  - `apps/web/public/*` (logo-*.svg/png, favicon, wordmark)
  - `apps/marketing/public/*` (logo.svg, og_banner.png, favicon)
  - `apps/docs/public/logo/*`
- Update alt attributes and filenames in code and metadata.
- CSS class prefixes in stylesheets: `unsend-…` → `usesend-…` (temporary dual support).

## 6) External Links & Content

- README.md
  - Badges (Docker, Stars) pointing to new repos/org.
  - Links to website/docs (`usesend.com`, `docs.usesend.com`).
  - Images hosted under new GitHub org assets.
- CONTRIBUTION.md / CLAUDE.md
  - Repo URLs, product name.
- Docker README
  - Image names, compose links, product name.

## 7) API & Header Compatibility

- Sending:
  - Prefer `X-Usesend-Email-ID`; keep setting `X-Unsend-Email-ID` for one release behind an option/flag or set both during a transition.
- Receiving/parsing:
  - Accept both headers server-side for an interim period.
- OpenAPI
  - Titles/descriptions to UseSend; server URL examples to `app.usesend.com`.

## 8) Migration Strategy (compat and deprecations)

- Env vars
  - Read both `USESEND_*` and `UNSEND_*`, preferring `USESEND_*`. Log a one-time deprecation warning if only legacy is present.
- SDK
  - Publish `usesend@>=2.0.0` (or next) as the primary package.
  - Publish a final `unsend@x.y.z` that re-exports from `usesend` with a console warning and README deprecation notice.
  - Alias class export `Unsend` → `UseSend` for one major version.
- HTTP headers
  - Accept both inbound for ≥1 minor release; outbound prefer new header.
- Docker
  - For N releases, push multi-tags to both `unsend/*` and `usesend/*` registries to avoid breaking downstream.
- Domains
  - If possible, configure redirects: `unsend.dev` → corresponding `usesend.com` paths; `app.unsend.dev` → `app.usesend.com`; `docs.unsend.dev` → `docs.usesend.com`.
- Communication
  - Add a “Rebrand and migration guide” to docs + changelog entry.

## 9) Verification & QA Checklist

- Build & lint
  - `pnpm i`, `pnpm lint`, `pnpm build` across monorepo.
- Local run
  - `pnpm dx` to boot dev infra, `pnpm start:web:local` and verify:
    - Auth flows, dashboard loads, email send, events ingestion.
    - Headers present on outbound, parser accepts both.
- SMTP proxy
  - Run the SMTP proxy and send a test email; verify it reaches the public API.
- SDK smoke tests
  - Node snippet using `usesend` package; ensure old `unsend` alias still works during transition.
- Marketing & Docs
  - Build marketing and docs; visually verify titles, OG images, links and contact email.

## 10) Concrete File Targets (initial list)

Code/config where “unsend” appears and likely needs updates:
- Root
  - `package.json` (name, scripts) and `tsconfig.json` extend.
- Packages
  - `packages/*/package.json` names and internal deps (`@unsend/*`).
  - `packages/sdk/src/unsend.ts`, `email.ts`, `contact.ts` (class name, base URL, env names, headers).
  - `packages/email-editor/*` (copy, URLs, CSS class names, imports).
  - `packages/ui/*` imports and package naming.
- Web app (`apps/web`)
  - `src/app/layout.tsx` metadata; `AppSideBar.tsx`; `FullScreenLoading.tsx`.
  - Email templates under `src/server/email-templates/*` (hostName/alt texts, copy).
  - `src/lib/constants/example-codes.ts` (domains, SDK import/class name) and `src/lib/constants/ses-errors.ts` copy text.
  - `src/server/aws/ses.ts` headers; `src/server/service/ses-hook-parser.ts` header parsing.
  - `src/env.js` env names and defaults.
  - Public assets under `apps/web/public/*` and their references.
- SMTP server (`apps/smtp-server`)
  - `src/server.ts` (base URLs, env names, logs); `src/usage.js` copy; `docker-compose.yml` image and env names.
- Marketing (`apps/marketing`)
  - `src/app/layout.tsx` metadata, links; `page.tsx` copy; `IntegrationCode.tsx` examples; `privacy`/`terms` contact emails; imports from `@unsend/*`.
  - Public assets in `apps/marketing/public/*` and their references.
- Docs (`apps/docs`)
  - `mint.json` name/links; MDX pages under `get-started/*` and `community-sdk/*` (env names, domains, repo links).
- Docker & infra
  - `docker/dev/compose.yml`, `docker/prod/compose.yml` (image names, service names, env defaults, paths under `/data/unsend`).
  - `docker/build.sh` tags; `docker/README.md` product name and links.
- GitHub
  - `.github/workflows/publish.yml` image targets; `ISSUE_TEMPLATE` references to `app.unsend.dev`.
- Misc
  - README.md badges/links; CONTRIBUTION.md repo paths; CLAUDE.md mentions; LICENSE headers that include “Unsend”.

## 11) Release & Rollout

- Versioning
  - Bump versions where appropriate; SDK likely a major version.
- Changelog
  - Add a “Rebrand to UseSend” section with migration notes (env var changes, header changes, package names, domains).
- Monitoring
  - Watch error logs for missing env vars or header parsing issues; add explicit warnings for legacy usage.

## 12) Post-Rollout Cleanup (after deprecation window)

- Remove support for `UNSEND_*` env vars.
- Remove legacy header acceptance if desired.
- Stop pushing `unsend/*` docker tags.
- Remove alias exports for `Unsend` in SDK and old `unsend` npm package.
- Cleanup CSS dual selectors (`.unsend-*`).

---

Implementation notes:
- Make changes in small PRs grouped by area (packages → web → smtp → marketing → docs → infra).
- Validate each area with `pnpm lint` + `pnpm build` before moving on.
- Where behavior is user-facing (headers, env), keep transition shims + clear deprecation logs.
