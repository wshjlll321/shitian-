import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = "https://www.shitianuav.com";
const rawDir = path.join(process.cwd(), "data", "old-site", "raw");
const imageDir = path.join(process.cwd(), "public", "media", "old-site", "images");

const gapUrls = [
  `${ROOT}/news/450.html`,
  `${ROOT}/news/1/`,
  `${ROOT}/news/2/`,
  `${ROOT}/product/1/`,
  `${ROOT}/product/2/`,
  `${ROOT}/product/3/`,
  `${ROOT}/case/1/`
];

function localRawName(url) {
  const parsed = new URL(url);
  if (parsed.pathname === "/") return "home.html";
  return `${parsed.pathname.replace(/^\/|\/$/g, "").replace(/[/.]/g, "_")}.html`;
}

function normalizeUrl(value, base = ROOT) {
  if (!value) return null;
  const trimmed = value.trim().replaceAll("&amp;", "&");
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) return `${ROOT}${trimmed}`;
  try {
    return new URL(trimmed, base).toString();
  } catch {
    return null;
  }
}

function extractAttr(tag, attr) {
  const match = tag.match(new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? match[1].trim() : "";
}

function extractImages(html, baseUrl) {
  return [...html.matchAll(/<img[^>]+>/gi)]
    .map((match) => normalizeUrl(extractAttr(match[0], "src"), baseUrl))
    .filter(Boolean);
}

function localImageName(url) {
  const parsed = new URL(url);
  const extension = path.extname(parsed.pathname).split("?")[0] || ".jpg";
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 12);
  return `${hash}${extension}`;
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 ShitianUAVMigrationBot/1.0" }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 ShitianUAVMigrationBot/1.0" }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  await mkdir(rawDir, { recursive: true });
  await mkdir(imageDir, { recursive: true });

  const report = [];

  for (const url of gapUrls) {
    const rawName = localRawName(url);
    const rawPath = path.join(rawDir, rawName);
    if (await exists(rawPath)) {
      report.push(`skip raw ${url}`);
      continue;
    }

    const html = await fetchText(url);
    await writeFile(rawPath, html, "utf8");
    report.push(`fetched raw ${url}`);

    for (const imageUrl of extractImages(html, url)) {
      const fileName = localImageName(imageUrl);
      const imagePath = path.join(imageDir, fileName);
      if (await exists(imagePath)) continue;

      try {
        const buffer = await fetchBuffer(imageUrl);
        await writeFile(imagePath, buffer);
        report.push(`downloaded ${imageUrl}`);
      } catch (error) {
        report.push(`image failed ${imageUrl}: ${error.message}`);
      }
    }
  }

  await writeFile(
    path.join(process.cwd(), "data", "old-site", "gap-fetch-report.txt"),
    `${report.join("\n")}\n`,
    "utf8"
  );
  console.log(report.join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
