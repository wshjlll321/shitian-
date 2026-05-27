import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = "https://www.shitianuav.com";
const rawDir = path.join(process.cwd(), "data", "old-site", "raw");
const imageDir = path.join(process.cwd(), "public", "media", "old-site", "images");
const outputDir = path.join(process.cwd(), "data", "old-site");

const seedPaths = [
  "/",
  "/p/about.html",
  "/p/contact.html",
  "/inquiry/",
  "/product/",
  "/product/745.html",
  "/product/746.html",
  "/product/747.html",
  "/product/748.html",
  "/product/749.html",
  "/case/",
  "/case/110.html",
  "/case/109.html",
  "/case/108.html",
  "/case/107.html",
  "/case/106.html",
  "/case/105.html",
  "/case/104.html",
  "/case/102.html",
  "/news/",
  "/news/p2.html",
  "/news/445.html",
  "/news/2/"
];

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

function decodeEntities(value) {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function extractAttr(tag, attr) {
  const match = tag.match(new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? decodeEntities(match[1].trim()) : "";
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripTags(match[1]) : "";
}

function extractMetaDescription(html) {
  const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  return match ? decodeEntities(match[1]) : "";
}

function extractHeadings(html) {
  return [...html.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => ({
      level: Number(match[1]),
      text: stripTags(match[2])
    }))
    .filter((item) => item.text);
}

function extractLinks(html, baseUrl) {
  return [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({
      href: normalizeUrl(match[1], baseUrl),
      text: stripTags(match[2])
    }))
    .filter((item) => item.href?.startsWith(ROOT));
}

function extractImages(html, baseUrl) {
  return [...html.matchAll(/<img[^>]+>/gi)]
    .map((match) => {
      const tag = match[0];
      return {
        src: normalizeUrl(extractAttr(tag, "src"), baseUrl),
        alt: extractAttr(tag, "alt"),
        title: extractAttr(tag, "title")
      };
    })
    .filter((item) => item.src);
}

function localRawName(url) {
  const parsed = new URL(url);
  const cleanPath = parsed.pathname === "/" ? "home" : parsed.pathname.replace(/^\/|\/$/g, "").replace(/[\/.]/g, "_");
  return `${cleanPath || "home"}.html`;
}

function localImageName(url) {
  const parsed = new URL(url);
  const extension = path.extname(parsed.pathname).split("?")[0] || ".jpg";
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 12);
  return `${hash}${extension}`;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 ShitianUAVMigrationBot/1.0"
    }
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 ShitianUAVMigrationBot/1.0"
    }
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

function classifyPage(url) {
  const { pathname } = new URL(url);
  if (pathname === "/") return "home";
  if (pathname.includes("/product/")) return pathname.endsWith("/") ? "product-index" : "product-detail";
  if (pathname.includes("/case/")) return pathname.endsWith("/") ? "case-index" : "case-detail";
  if (pathname.includes("/news/")) return pathname.endsWith("/") || pathname.includes("p2") ? "news-index" : "news-detail";
  if (pathname.includes("/about")) return "about";
  if (pathname.includes("/contact")) return "contact";
  if (pathname.includes("/inquiry")) return "inquiry";
  return "other";
}

function summarizeText(text) {
  return text.slice(0, 1200);
}

async function main() {
  await mkdir(rawDir, { recursive: true });
  await mkdir(imageDir, { recursive: true });
  await mkdir(outputDir, { recursive: true });

  const queue = new Set(seedPaths.map((item) => normalizeUrl(item)));
  const visited = new Set();
  const pages = [];
  const imageMap = new Map();

  for (const url of queue) {
    if (!url || visited.has(url)) continue;
    visited.add(url);
    try {
      const html = await fetchText(url);
      const rawName = localRawName(url);
      await writeFile(path.join(rawDir, rawName), html, "utf8");

      const links = extractLinks(html, url);
      for (const link of links) {
        const pathname = new URL(link.href).pathname;
        if (/^\/(product|case|news)\/(\d+\.html|p\d+\.html)?$/.test(pathname) || ["/product/", "/case/", "/news/"].includes(pathname)) {
          queue.add(link.href);
        }
      }

      const images = extractImages(html, url);
      for (const image of images) {
        if (!imageMap.has(image.src)) {
          const localName = localImageName(image.src);
          imageMap.set(image.src, {
            ...image,
            localPath: `/media/old-site/images/${localName}`,
            fileName: localName,
            downloaded: false
          });
        }
      }

      const bodyText = stripTags(html);
      pages.push({
        url,
        rawFile: `data/old-site/raw/${rawName}`,
        type: classifyPage(url),
        title: extractTitle(html),
        metaDescription: extractMetaDescription(html),
        headings: extractHeadings(html),
        links: links.slice(0, 80),
        images,
        textSummary: summarizeText(bodyText),
        textLength: bodyText.length
      });
      console.log(`fetched ${url}`);
    } catch (error) {
      pages.push({
        url,
        type: classifyPage(url),
        error: error.message
      });
      console.warn(`failed ${url}: ${error.message}`);
    }
  }

  const images = [...imageMap.values()];
  for (const image of images) {
    try {
      const buffer = await fetchBuffer(image.src);
      await writeFile(path.join(imageDir, image.fileName), buffer);
      image.downloaded = true;
      console.log(`downloaded ${image.src}`);
    } catch (error) {
      image.error = error.message;
      console.warn(`image failed ${image.src}: ${error.message}`);
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: ROOT,
    pageCount: pages.length,
    imageCount: images.length,
    pages,
    images
  };

  await writeFile(path.join(outputDir, "old-site-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  await writeFile(
    path.join(outputDir, "old-site-pages.md"),
    pages
      .map((page) => {
        if (page.error) {
          return `## ${page.url}\n\n- 类型：${page.type}\n- 抓取失败：${page.error}\n`;
        }
        return `## ${page.title || page.url}\n\n- URL：${page.url}\n- 类型：${page.type}\n- 原始文件：${page.rawFile}\n- 图片数：${page.images.length}\n\n### 标题\n${page.headings.map((heading) => `${"#".repeat(heading.level + 2)} ${heading.text}`).join("\n")}\n\n### 文本摘要\n${page.textSummary}\n`;
      })
      .join("\n---\n"),
    "utf8"
  );

  console.log(`done: ${pages.length} pages, ${images.length} images`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
