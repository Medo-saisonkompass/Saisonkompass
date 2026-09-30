#!/usr/bin/env node

/**
 * build.mjs
 *
 * Builds the static SaisonKompass website into ./dist
 * for Cloudflare Workers Static Assets.
 */

import { existsSync, rmSync, mkdirSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");

// Files and directories that make up the website.
const REQUIRED = [
  "index.html",
  "halloween",
  "guides",
  "ueber-uns",
  "affiliate-hinweis",
  "impressum",
  "datenschutz",
  "css",
  "js",
];

// Optional production assets.
// They are copied only if they already exist.
const OPTIONAL = [
  "favicon.ico",
  "favicon.svg",
  "robots.txt",
  "sitemap.xml",
  "assets",
  "images",
  "img",
];

function copyIfExists(name, bucket) {
  const src = join(ROOT, name);

  if (existsSync(src)) {
    cpSync(src, join(DIST, name), { recursive: true });
    bucket.copied.push(name);
  } else {
    bucket.missing.push(name);
  }
}

console.log("Cleaning dist/ ...");

rmSync(DIST, {
  recursive: true,
  force: true
});

mkdirSync(DIST, {
  recursive: true
});

const required = {
  copied: [],
  missing: []
};

const optional = {
  copied: [],
  missing: []
};

for (const name of REQUIRED) {
  copyIfExists(name, required);
}

for (const name of OPTIONAL) {
  copyIfExists(name, optional);
}

if (required.missing.length) {
  console.warn(
    "Warning: expected source items were not found and were skipped:",
    required.missing.join(", ")
  );
}

console.log(
  "Copied into dist/:",
  [...required.copied, ...optional.copied].join(", ")
);

if (optional.missing.length) {
  console.log(
    "Optional assets not present (skipped, not faked):",
    optional.missing.join(", ")
  );
}

console.log("Build complete: ./dist is ready for npx wrangler deploy.");
