import fs from "node:fs";
import path from "node:path";

const missing = JSON.parse(fs.readFileSync("scripts/_missing-images.json", "utf8"));
const outDir = "public/media/old-site/images";

let ok = 0;
let fail = 0;
const failed = [];

async function dl({ originalSrc, fileName }) {
  const dest = path.join(outDir, fileName);
  if (fs.existsSync(dest)) {
    ok++;
    return;
  }
  try {
    const res = await fetch(originalSrc, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Referer: "https://www.shitianuav.com/"
      }
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) throw new Error("too small " + buf.length);
    fs.writeFileSync(dest, buf);
    ok++;
  } catch (e) {
    fail++;
    failed.push({ fileName, originalSrc, error: String(e.message || e) });
  }
}

const CONCURRENCY = 8;
const queue = [...missing];
async function worker() {
  while (queue.length) {
    const item = queue.shift();
    await dl(item);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`done — ok: ${ok}, failed: ${fail}`);
if (failed.length) {
  fs.writeFileSync("scripts/_download-failed.json", JSON.stringify(failed, null, 1));
  console.log("failures written to scripts/_download-failed.json");
  console.log(failed.slice(0, 5));
}
