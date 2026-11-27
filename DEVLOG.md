# Development Log

A chronological record of how this project was built: what was done in each phase, the decisions behind it and what was learned along the way. Each phase links to the pull request (or commit) with the actual changes.

## Phases

- [Phase 0: Project setup](#phase-0-project-setup)
- [Phase 1: Lit basics](#phase-1-lit-basics)

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
| Product name Lit-a-mole, element prefix `lam-` | A bit of fun; the prefix keeps custom element names unique | 1 |
| Legacy decorators (`experimentalDecorators`) | What the Lit template and most of its docs use; no `accessor` keyword needed | 1 |
| `strict` declared explicitly | TypeScript 7 enables it by default, but the config should say so | 1 |
| `#src/*` subpath imports | No `../../` imports; a Node standard defined once in `package.json` | 1 |
| App shell + reusable components | `lam-app` only hosts things; components know nothing about the app | 1 |

## Phase 0: Project setup

_2026-11-26 · [snapshot](https://github.com/danilopezsebastian-sngular/topos/tree/phase-0)_

This phase set up the repository and made the decisions needed before writing any application code: stack, runtime, testing approach and hosting. No application code was written yet; scaffolding the Vite project is part of the next phase.

Lit was chosen because it builds on web standards: components are native custom elements with Shadow DOM, and Lit adds reactive properties and efficient templating on top with a small runtime. It is also the stack used by the team this project is aimed at, and learning it coming from React is one of the goals of the exercise. Vite was chosen over Webpack because of its fast native-ESM dev server, its official Lit + TypeScript template and, above all, because it enables Vitest, so the app and its tests share the same configuration and transforms.

The runtime is pinned to Node 26 (the current LTS line) in `.nvmrc`, so the same version is used locally and in CI. pnpm 12 is the package manager, for its speed, disk efficiency and strictness: code cannot import packages that are not declared in `package.json`. Its exact version will be pinned with the `packageManager` field in `package.json`. Corepack is not used because Node no longer bundles it since v25, and pnpm can manage its own version from that field.

Unit tests will run with Vitest Browser Mode using Playwright as the provider. jsdom supports custom elements and basic Shadow DOM, but it lacks constructable stylesheets (`adoptedStyleSheets`, which Lit uses to apply styles), real layout and CSS, and faithful focus and pointer behaviour, as well as browser APIs this app will rely on, such as vibration and service workers. Web Test Runner with `@open-wc/testing` also runs tests in real browsers and is the more common choice in the Lit ecosystem; Vitest was preferred for its integration with Vite and its Jest-like API. The trade-offs are slower test runs than a simulated DOM, an extra provider dependency that downloads browsers (locally and in CI) and straying slightly from the most common Lit setup. Playwright can be reused for end-to-end tests later.

The app will be hosted on GitHub Pages, next to the code and deployed from CI. Routing will use the History API, so the app has real URLs such as `/topos/game`, and the choice of router stays open. Since GitHub Pages cannot rewrite unknown paths to `index.html`, the deploy will copy `index.html` to `404.html`: a direct visit to any route loads the app, and the router then decides what to show or redirects to home. The trade-off is that a first direct visit to a deep link gets an HTTP 404 status even though the page renders correctly; once installed, the service worker serves navigations itself. Vite's `base` will be set to `/topos/` so assets resolve under the repository path. Hash routing was considered because it needs no fallback, but it was discarded because it fits worse with Lit routers and gives less clean URLs.

Everything versioned (code, commits and documentation) is written in English. An `.editorconfig` sets UTF-8, LF line endings, final newlines and trimming of trailing whitespace. Indentation uses tabs for accessibility, since each reader can choose the width, with two exceptions: YAML uses spaces because the format forbids tabs, and Markdown keeps trailing whitespace because two trailing spaces mean a line break. The project is licensed under MIT.

Decisions deferred to later phases: the router (phase 3), state management (phase 6), the PWA tooling (phase 7) and end-to-end testing (phase 8).

**What I learned:** Corepack, the tool that used to enforce the `packageManager` version, is no longer bundled with Node, and pnpm now handles it on its own. jsdom is not enough for testing web components, but not because it lacks Shadow DOM: what it lacks is a real rendering engine and the browser APIs around it. Static hosts need an explicit strategy for single-page app routes, and hash routing and a `404.html` fallback solve the same problem at different costs.

## Phase 1: Lit basics

_2026-11-27 · [snapshot](https://github.com/danilopezsebastian-sngular/topos/tree/phase-1)_

Time to write some actual Lit. I scaffolded the project with Vite's `lit-ts` template, cleaned out the demo and renamed the game to **Lit-a-mole** (with `lam-` as the prefix for every custom element). Imports go through a `#src/*` alias, so there's no `../../` mess, and `main.ts` is the single entry point where global setup like the theme CSS lives.

The first real component is `lam-player-form`: a name input with validation and a start button. `lam-app` is just a shell that renders it and reacts when a player is submitted. This is the same "props down, events up" idea as in React, done the web components way.

Lit concepts used in this phase:

- **Custom elements**: `@customElement` registers a class as an HTML tag. The tag has to be imported somewhere, or the browser just renders an empty unknown element without any error.
- **Reactive properties**: `@property` for public inputs, which can come in as attributes (`min-length="3"` becomes `minLength`), and `@state` for internal state. Changing either one triggers a re-render.
- **Templates**: `` html`...` `` tagged templates with bindings: `@input` for events, `?disabled` for boolean attributes, and a ternary with `nothing` for conditional rendering.
- **Styles**: `static styles` is scoped to the component's Shadow DOM, and CSS custom properties let the theme be changed from outside.
- **Custom events**: the form dispatches `lam-player-form-submit` with `bubbles` and `composed`, so it can cross the shadow boundary, and the event is typed in `HTMLElementEventMap`.

**What surprised me coming from React:** a missing import doesn't fail loudly, because a tag in a template is just a string. In Lit, `false` inside a template renders as the text "false", so ``cond && html`...` `` is a trap. And there's no virtual DOM: Lit only updates the dynamic parts of the template.
