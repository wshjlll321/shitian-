import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = "https://www.shitianuav.com";
const rawDir = path.join(process.cwd(), "data", "old-site", "raw");
const dataDir = path.join(process.cwd(), "data", "old-site");
const srcContentDir = path.join(process.cwd(), "src", "content");

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
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, " ")
      .replace(/<img[^>]*>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|h1|h2|h3|h4|li|tr|section|div)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

function extractAttr(tag, attr) {
  const match = tag.match(new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? decodeEntities(match[1].trim()) : "";
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
  if (pathname.includes("/product/")) return pathname.endsWith("/") || /\/product\/\d\/$/.test(pathname) ? "product-index" : "product-detail";
  if (pathname.includes("/case/")) return pathname.endsWith("/") || /\/case\/\d\/$/.test(pathname) ? "case-index" : "case-detail";
  if (pathname.includes("/news/")) return pathname.endsWith("/") || pathname.includes("/p") || /\/news\/\d\/$/.test(pathname) ? "news-index" : "news-detail";
  if (pathname.includes("/about")) return "about";
  if (pathname.includes("/contact")) return "contact";
  if (pathname.includes("/inquiry")) return "inquiry";
  return "other";
}

function extractTitle(html) {
  const detailTitle = html.match(/<h1[^>]*class=["'][^"']*(?:xypg-detail-title|page-title)[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i);
  if (detailTitle) return stripTags(detailTitle[1]);

  const productTitle = html.match(/<div class=["']page-product-detail-right["'][\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (productTitle) return stripTags(productTitle[1]);

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return title ? stripTags(title[1]).replace(/[-_]?青岛世天创新航空科技有限公司$/, "") : "";
}

function extractMeta(html, name) {
  const match = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function extractDate(html) {
  const detailTime = html.match(/detail-info-time[\s\S]*?<\/i>\s*([^<]+)<\/div>/i);
  if (detailTime) return stripTags(detailTime[1]);

  const publishTime = html.match(/发布时间：\s*<span>([^<]+)<\/span>/i);
  if (publishTime) return stripTags(publishTime[1]);

  return "";
}

function extractCategory(html) {
  const productCategory = html.match(/所属分类：\s*<span>([^<]+)<\/span>/i);
  if (productCategory) return stripTags(productCategory[1]);

  const breadcrumb = html.match(/<a[^>]+href=["'][^"']*\/(news|product|case)\/\d\/["'][^>]*>([^<]+)<\/a>/i);
  if (breadcrumb) return stripTags(breadcrumb[2]);

  const position = html.match(/当前位置：([\s\S]*?)<\/div>/i);
  if (position) {
    const pieces = stripTags(position[1]).split(">").map((item) => item.trim()).filter(Boolean);
    return pieces.at(-1) ?? "";
  }

  return "";
}

function extractContentBlock(html, pageType) {
  if (pageType === "news-detail") {
    const block = html.match(/<div class=["']xypg-detail-con["'][^>]*>([\s\S]*?)<\/div>\s*(?:<!--分享插件-->|<div id=["']xy-share["'])/i);
    if (block) return block[1];
  }

  if (pageType === "product-detail" || pageType === "case-detail") {
    const block = html.match(/<div class=["']product-detail-tabcon["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i);
    if (block) return block[1];
  }

  if (pageType === "about") {
    const about = html.match(/<div class=["']wz-p["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<div class=["']ny-about1-r["']/i);
    const culture = html.match(/<div class=["']wz-p["'][^>]*>\s*([\s\S]*?)<\/div>\s*<div class=["']ny-about3-ico/i);
    return [about?.[1], culture?.[1]].filter(Boolean).join("\n");
  }

  if (pageType === "contact") {
    const contact = html.match(/<div class=["']n2-contact-wz["'][^>]*>([\s\S]*?)<\/div>/i);
    const message = html.match(/<div class=["']n2-tt2["'][^>]*>([\s\S]*?)<\/div>/i);
    return [contact?.[1], message?.[1]].filter(Boolean).join("\n");
  }

  return html.match(/<div class=["']xypg-right-content["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "";
}

function imageLocalName(url) {
  const parsed = new URL(url);
  const extension = path.extname(parsed.pathname).split("?")[0] || ".jpg";
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 12);
  return `${hash}${extension}`;
}

function extractImages(html, baseUrl) {
  return [...html.matchAll(/<img[^>]+>/gi)]
    .map((match) => {
      const tag = match[0];
      const originalSrc = normalizeUrl(extractAttr(tag, "src"), baseUrl);
      if (!originalSrc) return null;
      const fileName = imageLocalName(originalSrc);
      const src = `/media/old-site/images/${fileName}`;
      return {
        originalSrc,
        src,
        alt: extractAttr(tag, "alt") || extractAttr(tag, "title") || "",
        title: extractAttr(tag, "title") || "",
        fileName,
        status: existsSync(path.join(process.cwd(), "public", src.replace(/^\//, ""))) ? "local" : "pending-download"
      };
    })
    .filter(Boolean);
}

function extractVideos(html, baseUrl) {
  return [...html.matchAll(/<iframe[^>]+>/gi)]
    .map((match) => normalizeUrl(extractAttr(match[0], "src"), baseUrl))
    .filter(Boolean);
}

function extractHeadings(html) {
  return [...html.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => ({ level: Number(match[1]), text: stripTags(match[2]) }))
    .filter((item) => item.text && !item.text.includes("在线客服"));
}

function extractTables(html) {
  return [...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map((tableMatch) => {
    const rows = [...tableMatch[0].matchAll(/<tr[\s\S]*?<\/tr>/gi)].map((rowMatch) =>
      [...rowMatch[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cellMatch) => stripTags(cellMatch[1]))
    );
    return rows.filter((row) => row.length > 0);
  });
}

function cleanParagraphs(blockHtml) {
  const text = stripTags(blockHtml);
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^[-—_]{5,}$/.test(line))
    .filter((line) => !/^本文网址/.test(line))
    .filter((line) => !/^上一篇/.test(line))
    .filter((line) => !/^下一篇/.test(line))
    .filter((line) => !/^www\.shitianuav\.com$/i.test(line))
    .filter((line) => !/^0532-88727118$/.test(line));

  return [...new Set(lines)];
}

function summarize(paragraphs, metaDescription) {
  const cleanMeta = metaDescription.replace(/\.{3,}$/, "").trim();
  if (cleanMeta && cleanMeta.length <= 220) return cleanMeta;
  return paragraphs.slice(0, 2).join(" ").slice(0, 220);
}

function newsSlug(url) {
  const match = url.match(/\/news\/(\d+)\.html$/);
  return match ? `news-${match[1]}` : `news-${createHash("sha1").update(url).digest("hex").slice(0, 8)}`;
}

function articleCategory(page) {
  if (page.category.includes("行业")) return "低空政策观察";
  if (/(条例|规划|解读|怎么飞)/.test(page.title)) return "低空政策观察";
  if (/(领导|商会|峰会|领奖|研讨会)/.test(page.title)) return "企业动态";
  return "作业案例";
}

function articlePriority(page) {
  if (/(T280|S270|HIZONE|海上|棉花|苹果|高尔夫|红十字|森林)/.test(page.title)) return "P0";
  if (articleCategory(page) === "低空政策观察") return "P2";
  return "P1";
}

function articleBody(page) {
  return page.paragraphs
    .filter((line) => !/^青岛市城阳区/.test(line))
    .filter((line) => !/^扫码/.test(line))
    .filter((line) => !/^电话[:：]/.test(line))
    .filter((line) => !/^邮箱[:：]/.test(line))
    .filter((line) => !/^地址[:：]/.test(line));
}

function toTsString(value) {
  return JSON.stringify(value, null, 2);
}

async function main() {
  const rawFiles = (await readdir(rawDir)).filter((file) => file.endsWith(".html")).sort();
  const pages = [];

  for (const file of rawFiles) {
    const html = await readFile(path.join(rawDir, file), "utf8");
    const url = urlFromRawName(file);
    const type = classifyPage(url);
    const blockHtml = extractContentBlock(html, type);
    const paragraphs = cleanParagraphs(blockHtml);

    pages.push({
      url,
      type,
      rawFile: `data/old-site/raw/${file}`,
      title: extractTitle(html),
      category: extractCategory(html),
      publishedAt: extractDate(html),
      metaDescription: extractMeta(html, "description"),
      metaKeywords: extractMeta(html, "keywords"),
      summary: summarize(paragraphs, extractMeta(html, "description")),
      headings: extractHeadings(blockHtml),
      paragraphs,
      tables: extractTables(blockHtml),
      images: extractImages(blockHtml || html, url),
      videos: extractVideos(blockHtml || html, url)
    });
  }

  const archive = {
    generatedAt: new Date().toISOString(),
    source: ROOT,
    status: "content-assets-only-no-design-migration",
    pageCount: pages.length,
    pages
  };

  const newsArticles = pages
    .filter((page) => page.type === "news-detail")
    .map((page) => ({
      slug: newsSlug(page.url),
      title: page.title,
      category: articleCategory(page),
      publishedAt: page.publishedAt,
      summary: page.summary,
      sourceUrl: page.url,
      sourceRawFile: page.rawFile,
      tags: page.metaKeywords ? page.metaKeywords.split(/[,，]/).map((item) => item.trim()).filter(Boolean) : [],
      body: articleBody(page),
      images: page.images,
      videos: page.videos,
      priority: articlePriority(page)
    }))
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));

  await writeFile(path.join(dataDir, "old-site-content.json"), JSON.stringify(archive, null, 2), "utf8");
  await writeFile(
    path.join(dataDir, "old-site-content-index.md"),
    [
      "# 旧官网内容结构化迁移档案",
      "",
      `- 生成时间：${archive.generatedAt}`,
      `- 内容来源：${ROOT}`,
      `- 页面数量：${pages.length}`,
      `- 迁移原则：仅迁移内容资产，不迁移旧官网视觉、布局、配色、组件和交互。`,
      "",
      "## 页面清单",
      "",
      ...pages.map(
        (page) =>
          `- ${page.type} | ${page.title || page.url} | ${page.url} | 段落 ${page.paragraphs.length} | 图片 ${page.images.length} | 视频 ${page.videos.length}`
      ),
      "",
      "## 缺口",
      "",
      "- /news/450.html 从旧站链接中发现，但当前外网授权受限，尚未补抓。"
    ].join("\n"),
    "utf8"
  );

  await writeFile(
    path.join(srcContentDir, "news.ts"),
    `import type { NewsArticle } from "@/types/content";\n\nexport const newsArticles: NewsArticle[] = ${toTsString(newsArticles)};\n`,
    "utf8"
  );

  console.log(`extracted ${pages.length} pages and generated ${newsArticles.length} news articles`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
