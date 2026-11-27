# Development Log

A chronological record of how this project was built: what was done in each phase, the decisions behind it and what was learned along the way. Each phase links to the pull request (or commit) with the actual changes.

## Phases

- [Phase 0: Project setup](#phase-0-project-setup)
- [Phase 1: Lit basics](#phase-1-lit-basics)
- [Phase 2: Tooling and deploy](#phase-2-tooling-and-deploy)

## Key decisions

| Decision                                                | Why (in one line)                                                                         | Phase |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----- |
| Lit + TypeScript                                        | Standards-based web components with a small runtime; aligned with the target team's stack | 0     |
| Vite                                                    | Native ESM dev server, official `lit-ts` template and it enables Vitest                   | 0     |
| Node 26 LTS, pinned in `.nvmrc`                         | Same runtime locally and in CI on the current LTS line                                    | 0     |
| pnpm 12, pinned via `packageManager`                    | Fast, disk-efficient and strict about undeclared dependencies; no Corepack needed         | 0     |
| Vitest Browser Mode + Playwright                        | Components are tested in a real browser, sharing Vite's config                            | 0     |
| GitHub Pages, History API routing + `404.html` fallback | Free static hosting next to the code, with real URLs                                      | 0     |
| English for code, commits and docs                      | Standard language for code and open source                                                | 0     |
| `.editorconfig` with tabs                               | Accessible indentation width; spaces where the format requires it (YAML)                  | 0     |
| MIT license                                             | Permissive and widely understood                                                          | 0     |
| Product name Lit-a-mole, element prefix `lam-`          | A bit of fun; the prefix keeps custom element names unique                                | 1     |
| Legacy decorators (`experimentalDecorators`)            | What the Lit template and most of its docs use; no `accessor` keyword needed              | 1     |
| `strict` declared explicitly                            | TypeScript 7 enables it by default, but the config should say so                          | 1     |
| `#src/*` subpath imports                                | No `../../` imports; a Node standard defined once in `package.json`                       | 1     |
| App shell + reusable components                         | `lam-app` only hosts things; components know nothing about the app                        | 1     |
| Prettier with zero config                               | Nothing to argue about; indentation comes from `.editorconfig`                            | 2     |
| oxlint instead of ESLint                                | typescript-eslint can't run on TypeScript 7; oxlint can, with type-aware and Lit rules    | 2     |
| `vitest-browser-lit` for rendering in tests             | Testing Library-style queries that see through Shadow DOM                                 | 2     |
| Tests next to their component (`*.test.ts`)             | Easy to find, and they move together with the component                                   | 2     |
| One CI workflow; deploy job only on `main`              | Nothing goes live unless lint, tests and build pass                                       | 2     |
| `404.html` copied in CI, `base: '/topos/'` everywhere   | The fallback is a GitHub Pages concern; dev and prod share the same URLs                  | 2     |

## Phase 0: Project setup

_2026-11-26 · [snapshot](https://github.com/danilopezsebastian-sngular/topos/tree/phase-0)_

No code yet: this phase was about setting up the repo and making the big calls before writing a single component.

I went with **Lit** because it's built on web standards (components are just custom elements with Shadow DOM) and it's the stack of the team this project is for, so learning it coming from React is half the point. **Vite** because it's fast, has an official Lit + TypeScript template and brings Vitest along, so the app and the tests share the same config.

Node 26 LTS is pinned in `.nvmrc` and pnpm 12 in `packageManager`. pnpm manages its own version now, so there's no need for Corepack, which Node stopped bundling anyway.

For tests I picked **Vitest Browser Mode with Playwright**, so components run in a real Chromium instead of jsdom. jsdom lacks `adoptedStyleSheets` (how Lit applies styles), real layout and APIs like vibration or service workers. Web Test Runner is the more classic choice for Lit, but Vitest feels like home after Jest. The price is slower tests and a browser download.

Hosting is **GitHub Pages** with real URLs (History API). Pages can't rewrite unknown paths to `index.html`, so the trick is to ship a copy of it as `404.html`. The catch: a first visit to a deep link answers with an HTTP 404 even though the page works fine. Hash routing would avoid that, but it gives uglier URLs and fits worse with Lit routers.

The rest is housekeeping: everything versioned is in English, `.editorconfig` uses tabs (spaces in YAML, which requires them), and the license is MIT.

**What I learned:** jsdom's problem with web components isn't Shadow DOM, it's that there's no real browser behind it. And static hosting needs a plan for SPA routes: hash routing and a `404.html` fallback solve the same problem at different costs.

## Phase 1: Lit basics

_2026-11-27 · [PR #1](https://github.com/danilopezsebastian-sngular/topos/pull/1) · [snapshot](https://github.com/danilopezsebastian-sngular/topos/tree/phase-1)_

Time to write some actual Lit. I scaffolded the project with Vite's `lit-ts` template, cleaned out the demo and renamed the game to **Lit-a-mole** (with `lam-` as the prefix for every custom element). Imports go through a `#src/*` alias, so there's no `../../` mess, and `main.ts` is the single entry point where global setup like the theme CSS lives.

The first real component is `lam-player-form`: a name input with validation and a start button. `lam-app` is just a shell that renders it and reacts when a player is submitted. This is the same "props down, events up" idea as in React, done the web components way.

Lit concepts used in this phase:

- **Custom elements**: `@customElement` registers a class as an HTML tag. The tag has to be imported somewhere, or the browser just renders an empty unknown element without any error.
- **Reactive properties**: `@property` for public inputs, which can come in as attributes (`min-length="3"` becomes `minLength`), and `@state` for internal state. Changing either one triggers a re-render.
- **Templates**: `` html`...` `` tagged templates with bindings: `@input` for events, `?disabled` for boolean attributes, and a ternary with `nothing` for conditional rendering.
- **Styles**: `static styles` is scoped to the component's Shadow DOM, and CSS custom properties let the theme be changed from outside.
- **Custom events**: the form dispatches `lam-player-form-submit` with `bubbles` and `composed`, so it can cross the shadow boundary, and the event is typed in `HTMLElementEventMap`.

**What surprised me coming from React:** a missing import doesn't fail loudly, because a tag in a template is just a string. In Lit, `false` inside a template renders as the text "false", so ``cond && html`...` `` is a trap. And there's no virtual DOM: Lit only updates the dynamic parts of the template.

## Phase 2: Tooling and deploy

_2026-11-27 · [PR #2](https://github.com/danilopezsebastian-sngular/topos/pull/2) · [snapshot](https://github.com/danilopezsebastian-sngular/topos/tree/phase-2)_

Not the most exciting phase, but from now on every change gets checked and deployed on its own.

**Formatting** is Prettier with zero config, picking up tabs from `.editorconfig`. One detail: Prettier respects `.gitignore` but not `.git/info/exclude`, so the scripts pass both as ignore paths to keep it away from local-only files.

**Linting** was the plot twist. The plan was ESLint + typescript-eslint + `eslint-plugin-lit`, but typescript-eslint needs TypeScript's compiler JS API, and TypeScript 7 (the Go rewrite) doesn't ship it anymore, so it crashes on load. Downgrading TypeScript just for the linter felt wrong, so I switched to **oxlint**. It's written in Rust, its type-aware rules run on tsgolint (built on TypeScript 7 itself), and it can load ESLint plugins, so `eslint-plugin-lit` and `eslint-plugin-wc` still work. I turned off `unbound-method`: it's a false positive in Lit, because `@click=${this.handleX}` is already bound to the component.

**Testing** uses Vitest Browser Mode as planned, in headless Chromium through Playwright, with `vitest-browser-lit` to render templates. It feels a lot like React Testing Library: ``render(html`...`)``, `getByRole`, `userEvent.type`, and the locators go through Shadow DOM, so tests never have to dig into `shadowRoot`. Tests live next to their component. The first ones cover the player form (the button stays disabled until the name is valid, the hint, trimming and the submit event) and check that `lam-app` renders it. Small gotcha: Lit splits text into several nodes around each `${...}`, so matching a whole sentence with interpolated values didn't work.

**CI/CD** is a single GitHub Actions workflow. Every push and PR runs lint, format check, tests and build, and on `main` a second job deploys `dist/` to GitHub Pages, so nothing goes live unless everything passes. The `404.html` copy happens in the workflow because it's a GitHub Pages thing, not part of the build. Vite's `base` is `/topos/` everywhere, so the dev server runs at `localhost:5173/topos/` with the same URLs as production.

**What I learned:** a new major version of a core tool can quietly break the tools around it, and checking peer dependencies before installing would have saved me some time. Also, testing web components in a real browser is less painful than I expected.
