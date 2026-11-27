# Lit-a-mole

[![CI](https://github.com/danilopezsebastian-sngular/topos/actions/workflows/ci.yml/badge.svg)](https://github.com/danilopezsebastian-sngular/topos/actions/workflows/ci.yml)

Hi! I'm Daniel and this is Lit-a-mole, an exercise project of a Whack-a-mole PWA game developed with Lit. The goal of this project is to practice Lit concepts, build a little game and have some fun!

**Play it**: https://danilopezsebastian-sngular.github.io/topos/

The project is divided into phases, of which you can read a [development log](DEVLOG.md).

**Status**: Work in progress ([Phase 2](DEVLOG.md#phase-2-tooling-and-deploy))

**Tech Stack**: Lit, TypeScript, Vite, Vitest (browser mode + Playwright), oxlint, Prettier, GitHub Actions and GitHub Pages.

**Requires**: Node 26 (see `.nvmrc`), pnpm 12

## Getting started

```sh
git clone https://github.com/danilopezsebastian-sngular/topos.git
cd topos
nvm use        # or install Node 26 any other way
pnpm install
pnpm exec playwright install chromium   # browser for the tests, once
pnpm dev       # dev server at http://localhost:5173/topos/
```

| Script              | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `pnpm dev`          | Starts the Vite dev server with hot reload                    |
| `pnpm build`        | Type-checks with `tsc` and builds for production into `dist/` |
| `pnpm preview`      | Serves the production build locally                           |
| `pnpm test`         | Runs the tests once in headless Chromium                      |
| `pnpm test:watch`   | Runs the tests in watch mode                                  |
| `pnpm lint`         | Lints with oxlint, including type-aware and Lit rules         |
| `pnpm format`       | Formats every file with Prettier                              |
| `pnpm format:check` | Checks formatting without writing (what CI runs)              |

Every push and pull request runs lint, format check, tests and build on GitHub Actions. Merges to `main` are deployed to GitHub Pages automatically.

## License

[MIT](LICENSE)
