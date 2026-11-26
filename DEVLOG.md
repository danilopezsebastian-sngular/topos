# Development Log

A chronological record of how this project was built: what was done in each phase, the decisions behind it and what was learned along the way. Each phase links to the pull request (or commit) with the actual changes.

## Phases

- [Phase 0: Project setup](#phase-0-project-setup)

## Key decisions

| Decision | Why (in one line) | Phase |
|---|---|---|
| Lit + TypeScript | Standards-based web components with a small runtime; aligned with the target team's stack | 0 |
| Vite | Native ESM dev server, official `lit-ts` template and it enables Vitest | 0 |
| Node 26 LTS, pinned in `.nvmrc` | Same runtime locally and in CI on the current LTS line | 0 |
| pnpm 12, pinned via `packageManager` | Fast, disk-efficient and strict about undeclared dependencies; no Corepack needed | 0 |
| Vitest Browser Mode + Playwright | Components are tested in a real browser, sharing Vite's config | 0 |
| GitHub Pages, History API routing + `404.html` fallback | Free static hosting next to the code, with real URLs | 0 |
| English for code, commits and docs | Standard language for code and open source | 0 |
| `.editorconfig` with tabs | Accessible indentation width; spaces where the format requires it (YAML) | 0 |
| MIT license | Permissive and widely understood | 0 |

## Phase 0: Project setup

_2026-11-26 · [commit](#) <!-- TODO: link to the commit after pushing -->_

This phase set up the repository and made the decisions needed before writing any application code: stack, runtime, testing approach and hosting. No application code was written yet; scaffolding the Vite project is part of the next phase.

Lit was chosen because it builds on web standards: components are native custom elements with Shadow DOM, and Lit adds reactive properties and efficient templating on top with a small runtime. It is also the stack used by the team this project is aimed at, and learning it coming from React is one of the goals of the exercise. Vite was chosen over Webpack because of its fast native-ESM dev server, its official Lit + TypeScript template and, above all, because it enables Vitest, so the app and its tests share the same configuration and transforms.

The runtime is pinned to Node 26 (the current LTS line) in `.nvmrc`, so the same version is used locally and in CI. pnpm 12 is the package manager, for its speed, disk efficiency and strictness: code cannot import packages that are not declared in `package.json`. Its exact version will be pinned with the `packageManager` field in `package.json`. Corepack is not used because Node no longer bundles it since v25, and pnpm can manage its own version from that field.

Unit tests will run with Vitest Browser Mode using Playwright as the provider. jsdom supports custom elements and basic Shadow DOM, but it lacks constructable stylesheets (`adoptedStyleSheets`, which Lit uses to apply styles), real layout and CSS, and faithful focus and pointer behaviour, as well as browser APIs this app will rely on, such as vibration and service workers. Web Test Runner with `@open-wc/testing` also runs tests in real browsers and is the more common choice in the Lit ecosystem; Vitest was preferred for its integration with Vite and its Jest-like API. The trade-offs are slower test runs than a simulated DOM, an extra provider dependency that downloads browsers (locally and in CI) and straying slightly from the most common Lit setup. Playwright can be reused for end-to-end tests later.

The app will be hosted on GitHub Pages, next to the code and deployed from CI. Routing will use the History API, so the app has real URLs such as `/topos/game`, and the choice of router stays open. Since GitHub Pages cannot rewrite unknown paths to `index.html`, the deploy will copy `index.html` to `404.html`: a direct visit to any route loads the app, and the router then decides what to show or redirects to home. The trade-off is that a first direct visit to a deep link gets an HTTP 404 status even though the page renders correctly; once installed, the service worker serves navigations itself. Vite's `base` will be set to `/topos/` so assets resolve under the repository path. Hash routing was considered because it needs no fallback, but it was discarded because it fits worse with Lit routers and gives less clean URLs.

Everything versioned (code, commits and documentation) is written in English. An `.editorconfig` sets UTF-8, LF line endings, final newlines and trimming of trailing whitespace. Indentation uses tabs for accessibility, since each reader can choose the width, with two exceptions: YAML uses spaces because the format forbids tabs, and Markdown keeps trailing whitespace because two trailing spaces mean a line break. The project is licensed under MIT.

Decisions deferred to later phases: the router (phase 3), state management (phase 6), the PWA tooling (phase 7) and end-to-end testing (phase 8).

**What I learned:** Corepack, the tool that used to enforce the `packageManager` version, is no longer bundled with Node, and pnpm now handles it on its own. jsdom is not enough for testing web components, but not because it lacks Shadow DOM: what it lacks is a real rendering engine and the browser APIs around it. Static hosts need an explicit strategy for single-page app routes, and hash routing and a `404.html` fallback solve the same problem at different costs.
