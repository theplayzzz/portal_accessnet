import { list } from "@vercel/blob";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const token = env.match(/BLOB_READ_WRITE_TOKEN="?([^"\n]+)"?/)[1];

const { blobs } = await list({ token });
const folders = new Set();
for (const b of blobs) {
  const top = b.pathname.split("/")[0];
  folders.add(top);
}
console.log("Top-level entries:", [...folders].sort());
console.log("Total blobs:", blobs.length);
