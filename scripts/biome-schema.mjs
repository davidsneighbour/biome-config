import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";

export const PACKAGE_ROOT = resolve(import.meta.dirname, "..");
export const CONFIG_PATH = resolve(PACKAGE_ROOT, "config.json");

const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

/**
 * Resolves the version of the `@biomejs/biome` package that Node.js module resolution finds from this package.
 * In a consumer project this is the consumer's own Biome installation.
 * Returns `undefined` when Biome is not installed.
 */
export async function resolveBiomeVersion() {
  const require = createRequire(resolve(PACKAGE_ROOT, "package.json"));
  let manifestPath;

  try {
    manifestPath = require.resolve("@biomejs/biome/package.json");
  } catch {
    return undefined;
  }

  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  if (
    typeof manifest.version !== "string" ||
    !VERSION_PATTERN.test(manifest.version)
  ) {
    throw new Error(
      `Unexpected @biomejs/biome version in ${manifestPath}: ${String(manifest.version)}`,
    );
  }

  return manifest.version;
}

export function schemaUrl(version) {
  return `https://biomejs.dev/schemas/${version}/schema.json`;
}
