import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import {
  CONFIG_PATH,
  PACKAGE_ROOT,
  resolveBiomeVersion,
  schemaUrl,
} from "./biome-schema.mjs";

const POLICY_PATH = resolve(PACKAGE_ROOT, "policy.json");

function printHelp() {
  console.log(`Usage: node scripts/generate-config.mjs [--check | --write] [--help]

Options:
  --check  Verify config.json matches policy.json without modifying files.
  --write  Regenerate config.json from policy.json. This is the default.

The $schema value uses the installed @biomejs/biome version.
  --help   Show this help text.
`);
}

function parseMode(args) {
  const supported = new Set(["--check", "--write", "--help"]);
  const unknown = args.filter((arg) => !supported.has(arg));

  if (unknown.length > 0) {
    throw new Error(`Unknown option(s): ${unknown.join(", ")}`);
  }

  if (args.includes("--check") && args.includes("--write")) {
    throw new Error("Use either --check or --write, not both.");
  }

  if (args.includes("--help")) {
    return "help";
  }

  return args.includes("--check") ? "check" : "write";
}

function validatePolicy(policy) {
  if (policy?.formatting?.indentStyle !== "space") {
    throw new Error('policy.json must set formatting.indentStyle to "space".');
  }

  if (policy?.formatting?.useEditorconfig !== true) {
    throw new Error("policy.json must enable formatting.useEditorconfig.");
  }

  if (policy?.biome?.linter?.rules?.preset !== "recommended") {
    throw new Error(
      'policy.json must use the Biome "recommended" rules preset.',
    );
  }
}

function createBiomeConfig(policy, schema) {
  return {
    $schema: schema,
    files: policy.biome.files,
    formatter: {
      indentStyle: policy.formatting.indentStyle,
      useEditorconfig: policy.formatting.useEditorconfig,
    },
    assist: policy.biome.assist,
    linter: policy.biome.linter,
    markdown: policy.biome.markdown,
    vcs: policy.biome.vcs,
  };
}

function serialize(value) {
  const serialized = JSON.stringify(value, null, 2);
  const expandedIncludes = JSON.stringify(value.files.includes, null, 2)
    .split("\n")
    .map((line, index) => (index === 0 ? line : `    ${line}`))
    .join("\n");
  const compactIncludes = `[${value.files.includes.map((entry) => JSON.stringify(entry)).join(", ")}]`;

  return `${serialized.replace(expandedIncludes, compactIncludes)}\n`;
}

async function main() {
  const mode = parseMode(process.argv.slice(2));

  if (mode === "help") {
    printHelp();
    return;
  }

  const rawPolicy = await readFile(POLICY_PATH, "utf8");
  const policy = JSON.parse(rawPolicy);
  validatePolicy(policy);

  const biomeVersion = await resolveBiomeVersion();

  if (biomeVersion === undefined) {
    throw new Error("@biomejs/biome is not installed. Run npm install.");
  }

  const expected = serialize(
    createBiomeConfig(policy, schemaUrl(biomeVersion)),
  );

  if (mode === "check") {
    const actual = await readFile(CONFIG_PATH, "utf8");

    if (actual !== expected) {
      throw new Error(
        "config.json is out of sync with policy.json. Run npm run config:generate.",
      );
    }

    console.log("config.json is in sync with policy.json.");
    return;
  }

  await writeFile(CONFIG_PATH, expected, "utf8");
  console.log("Generated config.json from policy.json.");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to generate Biome config: ${message}`);
  process.exitCode = 1;
});
