# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Changed

* Simplified the shared Biome configuration to rely on Biome defaults and the recommended preset.
* Kept only deliberate shared rules: `noBarrelFile`, `noReExportAll`, and `noUndeclaredVariables`.
* Removed JavaScript quote-style overrides, duplicated formatter defaults, redundant browser globals, and no-op overrides.
* Added `policy.json` as the canonical machine-readable shared policy and generate/check scripts to prevent `config.json` drift.

## [0.2.7](https://github.com/davidsneighbour/biome-config/compare/v0.2.6...v0.2.7) (2026-09-09)

### Bug Fixes

* **deps:** update dependency @dnbhq/release-config to v1.1.3 ([8c8e4d5](https://github.com/davidsneighbour/biome-config/commit/8c8e4d50f12a39d6599f2bca0835147bd5ebea4e))

### Dependencies

* **deps:** update dependency @biomejs/biome to v2.5.11 ([44ac5b9](https://github.com/davidsneighbour/biome-config/commit/44ac5b94ce7ef520e62a0e898973259493745d43))

## [0.2.6](https://github.com/davidsneighbour/biome-config/compare/v0.2.5...v0.2.6) (2026-09-08)

### Bug Fixes

* **deps:** update dependency @dnbhq/release-config to v1.1.2 ([6ffea65](https://github.com/davidsneighbour/biome-config/commit/6ffea65912a32ac36d512a79a47cbf49ccac52f0))

## [0.2.5](https://github.com/davidsneighbour/biome-config/compare/v0.2.4...v0.2.5) (2026-09-08)

### Dependencies

* **deps:** update dependency @biomejs/biome to v2.5.10 ([4b4103e](https://github.com/davidsneighbour/biome-config/commit/4b4103e5f145ff263a1507b009914898978a2783))

## [0.2.4](https://github.com/davidsneighbour/biome-config/compare/v0.2.3...v0.2.4) (2026-09-08)

### Bug Fixes

* **deps:** update dependency @dnbhq/release-config to v1.1.1 ([157d5fc](https://github.com/davidsneighbour/biome-config/commit/157d5fc343c2ac35a747807430f481d20ea41ffd))

## [0.2.3](https://github.com/davidsneighbour/biome-config/compare/v0.2.2...v0.2.3) (2026-09-08)

### Bug Fixes

* **deps:** update dependency @dnbhq/release-config to v1.1.0 ([0311a56](https://github.com/davidsneighbour/biome-config/commit/0311a568bcb8d53857d955c6c013c07d90fa64df))

## [0.2.2](https://github.com/davidsneighbour/biome-config/compare/v0.2.1...v0.2.2) (2026-09-08)

### Bug Fixes

* **deps:** update dependency @dnbhq/release-config to v1.0.4 ([a6760f0](https://github.com/davidsneighbour/biome-config/commit/a6760f023d1a048184a4f9cfda7e32a2d1272133))

## [0.2.1](https://github.com/davidsneighbour/biome-config/compare/v0.2.0...v0.2.1) (2026-09-08)

### Bug Fixes

* **deps:** update dependency @dnbhq/release-config to v1.0.3 ([d98baff](https://github.com/davidsneighbour/biome-config/commit/d98baff74a4eb7a31e78b7fb1207f23aaf99355a))

## [0.2.0](https://github.com/davidsneighbour/biome-config/compare/v0.1.2...v0.2.0) (2026-09-07)

### Features

* **config:** enable noUndeclaredVariables rule ([e15bba2](https://github.com/davidsneighbour/biome-config/commit/e15bba2c2ddb99da6bc9ca0ddbefed0bdcf6c1fb))

## [0.1.2](https://github.com/davidsneighbour/biome-config/compare/v0.1.1...v0.1.2) (2026-09-06)

### Bug Fixes

* **deps:** update dependency @dnbhq/release-config to v1.0.2 ([16e6c72](https://github.com/davidsneighbour/biome-config/commit/16e6c72cb39289fc7b7a8aa06ef541ef11cebb22))

## [0.1.1](https://github.com/davidsneighbour/biome-config/compare/v0.1.0...v0.1.1) (2026-09-06)

### Bug Fixes

* **deps:** update dependency @dnbhq/release-config to v1.0.1 ([b95da35](https://github.com/davidsneighbour/biome-config/commit/b95da35ccbbf0877c8e667d46910a85562407e93))

## 0.1.0 (2026-09-06)

### Features

* **config:** extract shared biome config ([64ef966](https://github.com/davidsneighbour/biome-config/commit/64ef966b731d8e35bf9d5659246ae35696c0c8f7))
