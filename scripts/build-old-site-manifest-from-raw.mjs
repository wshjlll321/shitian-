import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = "https://www.shitianuav.com";
const rawDir = path.join(process.cwd(), "data", "old-site", "raw");
const imageDir = path.join(process.cwd(), "public", "media", "old-site", "images");
const outputDir = path.join(process.cwd(), "data", "old-site");

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
    .map((match) => ({ level: Number(match[1]), text: stripTags(match[2]) }))
    .filter((item) => item.text);
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

function extractLinks(html, baseUrl) {
  return [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ href: normalizeUrl(match[1], baseUrl), text: stripTags(match[2]) }))
    .filter((item) => item.href?.startsWith(ROOT));
}

function urlFromRawName(fileName) {
  const name = fileName.replace(/\.html$/, "");
  if (name === "home") return `${ROOT}/`;
  if (name === "product") return `${ROOT}/product/`;
  if (name === "case") return `${ROOT}/case/`;
  if (name === "news") return `${ROOT}/news/`;
  if (name === "inquiry") return `${ROOT}/inquiry/`;
  if (name === "p_about_html") return `${ROOT}/p/about.html`;
  if (name === "p_contact_html") return `${ROOT}/p/contact.html`;
  if (/^(product|case|news)_\d$/.test(name)) {
    const [section, id] = name.split("_");
    return `${ROOT}/${section}/${id}/`;
  }
  if (name.startsWith("product_")) return `${ROOT}/product/${name.replace("product_", "").replace("_html", ".html")}`;
  if (name.startsWith("case_")) return `${ROOT}/case/${name.replace("case_", "").replace("_html", ".html")}`;
  if (name.startsWith("news_p")) return `${ROOT}/news/${name.replace("news_", "").replace("_html", ".html")}`;
  if (name.startsWith("news_")) return `${ROOT}/news/${name.replace("news_", "").replace("_html", ".html")}`;
  return `${ROOT}/${name.replaceAll("_", "/")}`;
}

function classifyPage(url) {
  const { pathname } = new URL(url);
  if (pathname === "/") return "home";
  if (pathname.includes("/product/")) return pathname.endsWith("/") ? "product-index" : "product-detail";
  if (pathname.includes("/case/")) return pathname.endsWith("/") ? "case-index" : "case-detail";
  if (pathname.includes("/news/")) return pathname.endsWith("/") || pathname.includes("p") ? "news-index" : "news-detail";
  if (pathname.includes("/about")) return "about";
  if (pathname.includes("/contact")) return "contact";
  if (pathname.includes("/inquiry")) return "inquiry";
  return "other";
}

function imageLocalName(url) {
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

function contentSummary(text) {
  const markers = ["青岛世天", "T280", "S270", "H15", "H60", "HIZONE", "载荷", "航时", "作业", "联系"];
  const pieces = [];
  for (const marker of markers) {
    const index = text.indexOf(marker);
    if (index >= 0) pieces.push(text.slice(Math.max(0, index - 80), index + 260));
  }
  return [...new Set(pieces)].join("\n\n").slice(0, 1800) || text.slice(0, 1200);
}

async function main() {
  const rawFiles = (await readdir(rawDir)).filter((file) => file.endsWith(".html")).sort();
  const pages = [];
  const imageMap = new Map();

  for (const file of rawFiles) {
    const rawPath = path.join(rawDir, file);
    const html = await readFile(rawPath, "utf8");
    const url = urlFromRawName(file);
    const images = extractImages(html, url);
    const links = extractLinks(html, url);
    const text = stripTags(html);

    for (const image of images) {
      if (!imageMap.has(image.src)) {
        const fileName = imageLocalName(image.src);
        imageMap.set(image.src, {
          ...image,
          fileName,
          localPath: `/media/old-site/images/${fileName}`,
          downloaded: await exists(path.join(imageDir, fileName))
        });
      }
    }

    pages.push({
      url,
      type: classifyPage(url),
      rawFile: `data/old-site/raw/${file}`,
      title: extractTitle(html),
      metaDescription: extractMetaDescription(html),
      headings: extractHeadings(html),
      links: links.slice(0, 120),
      images,
      textSummary: contentSummary(text),
      textLength: text.length
    });
  }

  const images = [...imageMap.values()];
  const manifest = {
    generatedAt: new Date().toISOString(),
    source: ROOT,
    pageCount: pages.length,
    imageCount: images.length,
    downloadedImageCount: images.filter((image) => image.downloaded).length,
    pages,
    images
  };

  await writeFile(path.join(outputDir, "old-site-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  await writeFile(
    path.join(outputDir, "old-site-pages.md"),
    pages
      .map(
        (page) => `## ${page.title || page.url}

- URL：${page.url}
- 类型：${page.type}
- 原始文件：${page.rawFile}
- 图片数：${page.images.length}

### 标题
${page.headings.map((heading) => `${"#".repeat(heading.level + 2)} ${heading.text}`).join("\n")}

### 文本摘要
${page.textSummary}
`
      )
      .join("\n---\n"),
    "utf8"
  );

  console.log(`manifest rebuilt from raw: ${pages.length} pages, ${images.length} images, ${manifest.downloadedImageCount} downloaded`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
