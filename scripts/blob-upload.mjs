import { put, list } from "@vercel/blob";
import { readFileSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const token = env.match(/BLOB_READ_WRITE_TOKEN="?([^"\n]+)"?/)[1];

const IMAGES_DIR = new URL("../public/images/", import.meta.url).pathname;
const PROJECT_PREFIX = "accessnet";

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const { blobs: existing } = await list({ token, prefix: `${PROJECT_PREFIX}/` });
const existingMap = new Map(existing.map((b) => [b.pathname, b.url]));

const files = await walk(IMAGES_DIR);
const mapping = {};

for (const file of files) {
  const rel = relative(IMAGES_DIR, file).replace(/\\/g, "/");
  const pathname = `${PROJECT_PREFIX}/${rel}`;
  const localKey = `/images/${rel}`;

  if (existingMap.has(pathname)) {
    mapping[localKey] = existingMap.get(pathname);
    console.log(`SKIP  ${localKey} -> ${existingMap.get(pathname)}`);
    continue;
  }

  const data = readFileSync(file);
  const result = await put(pathname, data, {
    access: "private",
    token,
    addRandomSuffix: false,
    allowOverwrite: false,
  });
  mapping[localKey] = result.url;
  console.log(`UP    ${localKey} -> ${result.url}`);
}

console.log("\n=== MAPPING ===");
console.log(JSON.stringify(mapping, null, 2));
