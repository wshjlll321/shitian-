import fs from "node:fs";

const NEWS = "src/content/news.ts";
const IMG_DIR = "public/media/old-site/images";

// Logo + WeChat QR repeated at the tail of nearly every legacy article —
// they are CMS chrome, not editorial photos, so they must never surface
// as an article cover or gallery image.
const CHROME = new Set(["49ae34561539.png", "37b95f182eaa.jpg"]);

const have = new Set(fs.readdirSync(IMG_DIR));
let text = fs.readFileSync(NEWS, "utf8");

let local = 0;
let dropped = 0;

text = text.replace(
  /("fileName":\s*")([^"]+)("\s*,\s*"status":\s*")(?:local|pending-download)(")/g,
  (_m, p1, fileName, p3, p5) => {
    const usable = have.has(fileName) && !CHROME.has(fileName);
    if (usable) local++;
    else dropped++;
    return p1 + fileName + p3 + (usable ? "local" : "pending-download") + p5;
  }
);

fs.writeFileSync(NEWS, text);
console.log(`news images — local: ${local}, filtered out: ${dropped}`);
