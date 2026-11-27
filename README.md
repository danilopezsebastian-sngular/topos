# Lit-a-mole

Hi! I'm Daniel and this is Lit-a-mole, an exercise project of a Whack-a-mole PWA game developed with Lit. The goal of this project is to practice Lit concepts, build a little game and have some fun!

The project is divided into phases, of which you can read a [development log](DEVLOG.md).

**Status**: Work in progress ([Phase 1](DEVLOG.md#phase-1-lit-basics))

**Tech Stack**: Lit, TypeScript, Vite, Vitest (browser mode + Playwright) and GitHub Pages.

**Requires**: Node 26 (see `.nvmrc`), pnpm 12

## Getting started

```sh
git clone https://github.com/danilopezsebastian-sngular/topos.git
cd topos
nvm use        # or install Node 26 any other way
pnpm install
pnpm dev       # dev server at http://localhost:5173
```

| Script | What it does |
|---|---|
| `pnpm dev` | Starts the Vite dev server with hot reload |
| `pnpm build` | Type-checks with `tsc` and builds for production into `dist/` |
| `pnpm preview` | Serves the production build locally |

## License

[MIT](LICENSE)
