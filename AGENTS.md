# AGENTS.md

Canonical, agent-independent instructions for working in the `@dnbhq/biome-config` repository. This is the single source of truth for shared agent behaviour here.

## Purpose

This repository publishes a shared Biome configuration (`config.json`) consumed by other davidsneighbour/DNBHQ projects. Changes here affect every consumer, so keep the config intentional and documented.

## Environment

- Package manager: npm (`npm install`, not yarn/pnpm).
- Module system: ESM (`"type": "module"` in `package.json`).
- Node.js: version pinned in `.nvmrc` (currently 26); `package.json` `engines` requires `>=26`.

## Quality gates

- Run `npm run check` before committing — it runs `biome check` against the repo and is also the `test` script.
- `npm run lint` runs `biome lint` only.
- The pre-commit hook (simple-git-hooks + lint-staged) runs `biome check --write` and `biome lint --write` on staged `*.{js,json,ts}` files automatically.
- Formatting follows `.editorconfig`: 2-space indent, LF line endings, trim trailing whitespace (except Markdown), 120-character max line length.

## Commit and release conventions

- Commit messages MUST follow Conventional Commits — `release-it` and `@release-it/conventional-changelog` generate `CHANGELOG.md` from them.
- Cut releases with `npm run release` (or `npm run release:dry` to preview), using the shared config from `@dnbhq/release-config` (`.release-it.ts`).
- Publishing to npm happens only through the `Publish package` GitHub Actions workflow (`.github/workflows/publish.yml`) when a `v*` tag is pushed — never publish manually.
- That workflow verifies the pushed tag matches `package.json`'s version before publishing; keep them in sync.

## Editing the shared config

- `config.json` is the actual product of this repository (referenced via `main`/`exports` in `package.json`). Treat changes to it as consumer-facing API changes.
- After bumping the `@biomejs/biome` peer/dev dependency, run `npx @biomejs/biome migrate --write` to update `config.json` for renamed or deprecated keys, and review the diff before committing.
- Keep project-local overrides out of `config.json` — consumers are expected to extend it and override locally, per the design notes in `README.md`.
- Update `README.md` whenever the exported config's behaviour changes.

## Package scope

This package intentionally ships only `config.json`, `README.md`, `CHANGELOG.md`, and `LICENSE` (see `files` in `package.json`). Do not add runtime code or unrelated files to the published package.
