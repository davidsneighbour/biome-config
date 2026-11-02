import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import {
  CONFIG_PATH,
  resolveBiomeVersion,
  schemaUrl,
} from "./biome-schema.mjs";

// Lowest Biome version that supports the options in config.json. Keep in sync with peerDependencies.
const MINIMUM_VERSION = [2, 6];
const PREFIX = "@dnbhq/biome-config";

function isSupported(version) {
  const [major, minor] = version.split(".").map(Number);
  return (
    major > MINIMUM_VERSION[0] ||
    (major === MINIMUM_VERSION[0] && minor >= MINIMUM_VERSION[1])
  );
}

function withoutSchema(config) {
  const { $schema: _schema, ...rest } = config;
  return rest;
}

// Writes to a sibling file and renames it, so a store that hard-links package files keeps its original copy.
async function writeAtomically(path, content) {
  const temporaryPath = `${path}.${process.pid}.tmp`;

  try {
    await writeFile(temporaryPath, content, "utf8");
    await rename(temporaryPath, path);
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
}

async function main() {
  const version = await resolveBiomeVersion();

  if (version === undefined) {
    console.warn(
      `${PREFIX}: @biomejs/biome is not installed. Kept the shipped config.json schema reference.`,
    );
    return;
  }

  if (!isSupported(version)) {
    console.warn(
      `${PREFIX}: @biomejs/biome ${version} is older than ${MINIMUM_VERSION.join(".")}.0. Kept the shipped config.json schema reference.`,
    );
    return;
  }

  const raw = await readFile(CONFIG_PATH, "utf8");
  const config = JSON.parse(raw);
  const current = config.$schema;
  const expected = schemaUrl(version);

  if (current === expected) {
    return;
  }

  if (typeof current !== "string") {
    throw new Error("config.json has no $schema string to update.");
  }

  // Replace only the $schema value so formatting and every policy value stay as published.
  const updated = raw.replace(
    `"$schema": ${JSON.stringify(current)}`,
    `"$schema": ${JSON.stringify(expected)}`,
  );
  const parsed = JSON.parse(updated);

  if (
    parsed.$schema !== expected ||
    !isDeepStrictEqual(withoutSchema(parsed), withoutSchema(config))
  ) {
    throw new Error(
      "Could not update the $schema value without changing other configuration.",
    );
  }

  await writeAtomically(CONFIG_PATH, updated);
  console.log(
    `${PREFIX}: updated the config.json schema reference to Biome ${version}.`,
  );
}

// An install must not fail because of this hook. Report the problem and leave config.json unchanged.
main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(
    `${PREFIX}: could not update the config.json schema reference: ${message}`,
  );
});
