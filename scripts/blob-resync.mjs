import { put, del } from "@vercel/blob";
import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const token = env.match(/BLOB_READ_WRITE_TOKEN="?([^"\n]+)"?/)[1];

const IMAGES_DIR = new URL("../public/images/", import.meta.url).pathname;
const PREFIX = "accessnet";
const CT = { webp: "image/webp", png: "image/png", jpeg: "image/jpeg", jpg: "image/jpeg", svg: "image/svg+xml" };

// Re-upload (overwrite) the trimmed assets that the site references.
const uploads = [
  ...(await readdir(IMAGES_DIR + "stores")).filter((f) => f.endsWith(".webp")).map((f) => `stores/${f}`),
  ...(await readdir(IMAGES_DIR + "app")).filter((f) => f.endsWith(".webp")).map((f) => `app/${f}`),
];

for (const rel of uploads) {
  const data = readFileSync(IMAGES_DIR + rel);
  const ext = rel.split(".").pop();
  const r = await put(`${PREFIX}/${rel}`, data, {
    access: "private",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: CT[ext],
  });
  console.log(`UP   ${rel} (${(data.length / 1024).toFixed(0)}KB)`);
}

// Remove the old PNG app screenshots now replaced by .webp.
for (const n of [1, 2, 3, 4, 5]) {
  try {
    await del(`${PREFIX}/app/app-${n}.png`, { token });
    console.log(`DEL  app/app-${n}.png`);
  } catch (e) {
    console.log(`DEL? app/app-${n}.png -> ${e.message}`);
  }
}
console.log("done");
