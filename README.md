# @dnbhq/biome-config

Shared Biome configuration for @davidsneighbour's projects.

* [Installation](#installation)
* [Upgrading Biome](#upgrading-biome)
* [Usage](#usage)
* [Available config](#available-config)
  * [Strict baseline](#strict-baseline)
* [Design notes](#design-notes)
* [Release](#release)
* [Notes](#notes)

## Installation

```bash
npm install --save-dev @davidsneighbour/biome-config @biomejs/biome
```

## Upgrading Biome

After upgrading `@biomejs/biome` to a new version, run Biome's built-in migration command to update your config automatically:

```bash
npx @biomejs/biome migrate --write
```

This rewrites any deprecated or renamed keys in `biome.json` and reports anything that needs manual attention. Run it once per Biome upgrade — no upper-bound pin on the peer dependency is needed because the migration script is the recovery path.

## Usage

Create or update `biome.json` in the consuming project:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["./node_modules/@dnbhq/biome-config/config.json"]
}
```

## Available config

### Strict baseline

The package exports one shared Biome configuration:

```json
{
  "extends": ["./node_modules/@dnbhq/biome-config/config.json"]
}
```

It enables formatting, import organisation, VCS integration, and a strict rule set for performance, complexity, correctness, and suspicious-code checks.

## Design notes

The configuration data was migrated from `packages/biome-config` in `davidsneighbour/configurations`.

The shared config intentionally keeps project-local decisions in the consuming project. Consumers can override values after the shared config in their local `biome.json`.

Biome applies configs from the `extends` list first, then applies local options from the consuming `biome.json`, so local project settings remain the most specific settings.

## Release

Dry run:

```bash
npm run release:dry
```

Release:

```bash
npm run release
```

Releases are handled by `release-it` and `@release-it/conventional-changelog`.

Commit messages should follow Conventional Commits.

Publishing is handled by the `Publish package` GitHub Actions workflow when a `v*` tag is pushed.

## Notes

* The consuming project should install `@biomejs/biome` directly so editor integrations, CLI usage, and lockfiles remain project-local.
* The package includes only `config.json`, `README.md`, `CHANGELOG.md`, and `LICENSE` in the npm package.
* Use `npm run test` before releasing. The test command currently runs `biome check` against this repository.
