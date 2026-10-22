# @dnbhq/biome-config

Shared Biome configuration for @davidsneighbour's projects.

* [Installation](#installation)
* [Upgrading Biome](#upgrading-biome)
* [Usage](#usage)
* [Configuration policy](#configuration-policy)
* [Generated config](#generated-config)
* [Available config](#available-config)
  * [Soft baseline](#soft-baseline)
  * [Markdown](#markdown)
  * [YAML](#yaml)
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

Then regenerate and verify the shared config:

```bash
npm run config:generate
npm test
```

The shared configuration intentionally relies on Biome defaults wherever possible. A Biome upgrade can therefore change default behaviour. Review Biome release notes as part of an upgrade and add an explicit policy value only when the project deliberately wants to diverge from the new default.

## Usage

Create or update `biome.json` in the consuming project:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["./node_modules/@dnbhq/biome-config/config.json"]
}
```

## Configuration policy

`policy.json` is the canonical source for deliberate shared policy. `config.json` is generated from it and must not be edited directly.

The policy follows these rules:

* Prefer Biome defaults instead of restating them.
* Keep only deliberate deviations or architectural choices.
* Use spaces for indentation.
* Honour `.editorconfig` for formatting settings Biome can consume.
* Use Biome's `recommended` lint preset at its native severities.
* Do not promote warnings to errors or demote errors to warnings unless a future policy explicitly requires it.
* Enable `performance/noBarrelFile`, `performance/noReExportAll`, and `correctness/noUndeclaredVariables` as additional errors.
* Let Biome choose JavaScript and TypeScript quote style from its defaults.
* Parse Markdown frontmatter, lint Markdown, and do not format Markdown with Biome (see [Markdown](#markdown)).
* Format and lint YAML with Biome defaults (see [YAML](#yaml)).
* Enable the nursery rules `nursery/noDuplicateMapKeys` and `nursery/useSingleTopLevelHeading` as additional errors.

The package exports the policy as `@dnbhq/biome-config/policy` and `@dnbhq/biome-config/policy.json`. Other shared configuration packages can consume this machine-readable policy instead of duplicating cross-tool decisions.

## Generated config

Regenerate `config.json` after changing `policy.json`:

```bash
npm run config:generate
```

Verify that the generated file is current without modifying it:

```bash
npm run config:check
```

`npm test` runs the drift check before Biome itself. CI therefore fails when `config.json` and `policy.json` disagree.

## Available config

### Soft baseline

The package exports one shared Biome configuration:

```json
{
  "extends": ["./node_modules/@dnbhq/biome-config/config.json"]
}
```

The baseline enables import organisation and VCS integration, follows Biome's recommended lint rules at their default severities, and adds only the explicitly documented project rules.

The config requires Biome 2.6 or later, because it uses the `markdown` options that Biome 2.6 introduced.

### Markdown

Biome 2.6 parses, formats, and lints Markdown. The shared config uses it as follows:

* `markdown.parser.frontmatter` is `true`. Without it, Biome reads a frontmatter block as a thematic break and a setext heading, and lint results for content files are wrong.
* `markdown.formatter.enabled` is `false`. [`@dnbhq/markdownlint-config`](https://github.com/davidsneighbour/markdownlint-config) stays the authority for Markdown style. The Biome 2.6 formatter has no options for these markdownlint rules and rewrites the content against them:
  * `MD004` requires `*` list markers. Biome writes `-`.
  * `MD049` requires `*` for emphasis. Biome writes `_`.
  * `MD060` requires compact tables. Biome pads table cells to align the columns.
* The Markdown linter stays on (Biome default). `nursery/useSingleTopLevelHeading` matches markdownlint `MD025`.
* `nursery/useTopLevelHeading` is not enabled. It reports documents that take their title from frontmatter, for example Hugo content files. markdownlint `MD041` accepts a frontmatter `title`.
* `markdown.analyzeEmbeds` stays `false` (Biome default). Code examples in documentation are often incomplete and would trigger rules such as `noUndeclaredVariables`.

A project that does not use markdownlint can turn the formatter on in its local `biome.json`:

```json
{
  "markdown": {
    "formatter": {
      "enabled": true
    }
  }
}
```

### YAML

Biome 2.6 formats and lints YAML by default. The shared config keeps the Biome defaults: 2-space indentation, double quotes, and the line width from `.editorconfig` (`useEditorconfig`). It adds `nursery/noDuplicateMapKeys` as an error, because a duplicate key silently overwrites the earlier value.

## Design notes

The configuration data was migrated from `packages/biome-config` in `davidsneighbour/configurations`.

The package is intentionally a soft shared baseline. Biome owns formatting and lint behaviour for file types it supports, while cross-language whitespace primitives should remain compatible with `.editorconfig`. File-type-specific tools should remain authoritative for concerns Biome does not own.

Consumers can override values after the shared config in their local `biome.json`. Biome applies configs from the `extends` list first, then applies local options from the consuming `biome.json`, so project-local settings remain the most specific settings.

When another shared lint or formatter package needs a cross-tool policy value, it should consume the exported `policy.json` and generate or validate its own native configuration. This keeps one canonical value while allowing each tool to remain authoritative for its own file types.

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
* The package includes `config.json`, `policy.json`, `README.md`, `CHANGELOG.md`, and `LICENSE` in the npm package.
* Do not edit generated `config.json` manually; edit `policy.json` and run `npm run config:generate`.
* Use `npm test` before releasing.
