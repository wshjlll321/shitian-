import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal.client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getNewsArticles } from "@/lib/cms";
import { pick, type Locale } from "@/lib/i18n";
import { isPublished } from "@/types/content";
import type { NewsArticle } from "@/types/content";

type NewsDetailProps = {
  article: NewsArticle;
  locale?: Locale;
};

function formatDate(value: string, en: boolean) {
  return value ? value.slice(0, 10) : en ? "Ongoing" : "持续 · Ongoing";
}

export async function NewsDetail({ article, locale = "zh" }: NewsDetailProps) {
  const en = locale === "en";
  // Cover precedence: explicit `cover` media id first, then first local
  // image in the legacy `images[]` array. Migration debris (sourceUrl,
  // sourceRawFile, pending-download images) never appears in the UI.
  const localImages = article.images.filter((i) => i.status === "local");
  const cover = localImages[0];
  const gallery = localImages.slice(1, 5);

  // Related news — same category, exclude self, take 3 most recent.
  const newsArticles = await getNewsArticles();
  const related = newsArticles
    .filter((n) => n.slug !== article.slug && n.category === article.category && isPublished(n))
    .slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-carbon-black pb-16 pt-28 text-surface-warm md:pb-24 md:pt-32">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(198,106,50,0.08),transparent_55%),linear-gradient(180deg,#171816_0%,#0f100e_100%)]"
        />
        <Container size="page" className="relative z-10">
          <Reveal>
            <p className="font-numeric text-xs uppercase tracking-[0.28em] text-aviation-orange">
              {(en && article.categoryEn) || article.category} · {formatDate(article.publishedAt, en)}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-7 max-w-5xl font-display text-[clamp(2.2rem,5vw,4.8rem)] font-semibold leading-[1.02] tracking-[-0.01em]">
              {pick(article, "title", locale)}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-3xl text-base leading-9 text-surface-warm/70 md:text-lg">
              {pick(article, "summary", locale)}
            </p>
          </Reveal>
          {article.tags.length > 0 ? (
            <Reveal delay={0.16}>
              <ul className="mt-9 flex flex-wrap gap-x-2 gap-y-2">
                {article.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-surface-warm/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-surface-warm/72"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </Container>
      </section>

      {cover ? (
        <section className="bg-surface-warm py-12 md:py-16">
          <Container size="page">
            <div className="relative aspect-[21/9] overflow-hidden bg-carbon-black/4">
              <Image
                src={cover.src}
                alt={cover.alt || article.title}
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-surface-porcelain py-24 md:py-32">
        <Container size="page">
          <div className="grid gap-14 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                {en ? "Article meta" : "Article meta · 元信息"}
              </p>
              <dl className="mt-6 grid gap-4 text-sm leading-7 text-carbon-black/64">
                <div className="border-t border-carbon-black/12 pt-4">
                  <dt className="text-carbon-black">{en ? "Published" : "发布时间"}</dt>
                  <dd>{formatDate(article.publishedAt, en)}</dd>
                </div>
                <div className="border-t border-carbon-black/12 pt-4">
                  <dt className="text-carbon-black">{en ? "Category" : "类别"}</dt>
                  <dd>{(en && article.categoryEn) || article.category}</dd>
                </div>
                {article.tags.length > 0 ? (
                  <div className="border-t border-carbon-black/12 pt-4">
                    <dt className="text-carbon-black">{en ? "Keywords" : "关键词"}</dt>
                    <dd className="text-carbon-black/68">
                      {article.tags.slice(0, 4).join(" · ")}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </aside>

            <article className="max-w-3xl">
              {((en && article.bodyEn) || article.body).map((paragraph, i) => (
                <Reveal key={i} delay={i * 0.02}>
                  <p className="mb-7 text-base leading-9 text-carbon-black/74 md:text-lg md:leading-10">
                    {paragraph}
                  </p>
                </Reveal>
              ))}

              {gallery.length > 0 ? (
                <div className="mt-16 grid gap-5 md:grid-cols-2">
                  {gallery.map((image, i) => (
                    <Reveal key={image.originalSrc} delay={i * 0.05}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-carbon-black/4">
                        <Image
                          src={image.src}
                          alt={image.alt || article.title}
                          fill
                          sizes="(max-width:768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </article>
          </div>
        </Container>
      </section>

      {/* Related — same-category articles, replaces the old "查看旧站原文"
          external link with a path that keeps the visitor on the site. */}
      {related.length > 0 ? (
        <section className="bg-surface-warm py-20 md:py-24">
          <Container size="page">
            <div className="flex flex-col gap-3 border-b border-carbon-black/12 pb-6 md:flex-row md:items-baseline md:justify-between md:gap-10">
              <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-metal-gray">
                {en ? "Related" : "Related · 同类动态"}
              </p>
              <p className="max-w-md text-[13px] leading-7 text-carbon-black/64">
                {en ? "Adjacent records in the same category." : "同一类别下的相邻记录，可继续阅读。"}
              </p>
            </div>
            <ul className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
              {related.map((rn, i) => (
                <Reveal key={rn.slug} delay={i * 0.05} as="li">
                  <Link href={en ? `/en/news/${rn.slug}` : `/news/${rn.slug}`} className="group block">
                    <article className="border-t border-carbon-black/14 pt-5 transition group-hover:border-aviation-orange">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-aviation-orange">
                        {(en && rn.categoryEn) || rn.category} · {formatDate(rn.publishedAt, en)}
                      </p>
                      <h3 className="mt-4 font-display text-lg font-semibold leading-tight md:text-xl">
                        {pick(rn, "title", locale)}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-[13px] leading-7 text-carbon-black/64">
                        {pick(rn, "summary", locale)}
                      </p>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="bg-carbon-black py-24 text-surface-warm md:py-32">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {en ? (
                  <>
                    Inquire about products
                    <br className="hidden md:block" />
                    {" "}and missions referenced here.
                  </>
                ) : (
                  <>
                    围绕这条动态，
                    <br className="hidden md:block" />
                    咨询同类产品与作业方案。
                  </>
                )}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href={en ? "/en/contact" : "/contact"}>
                  {en ? "Submit inquiry" : "提交咨询"}
                </Button>
                <Button href={en ? "/en/news" : "/news"} variant="contact">
                  {en ? "Back to news" : "返回动态列表"}
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
