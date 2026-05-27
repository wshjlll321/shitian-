import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal.client";
import { pick, type Locale } from "@/lib/i18n";
import type { HomeManifestoContent } from "@/types/content";

type ManifestoProps = {
  content: HomeManifestoContent;
  locale?: Locale;
};

/**
 * §2 — Brand manifesto. All copy (eyebrow, headline, body, capabilities,
 * proof points) is admin-editable through the home-content singleton; the
 * component just lays it out and reads the locale-appropriate variant.
 */
export function Manifesto({ content, locale = "zh" }: ManifestoProps) {
  const en = locale === "en";
  const capabilities =
    (en && content.capabilitiesEn && content.capabilitiesEn.length > 0
      ? content.capabilitiesEn
      : content.capabilities) ?? [];

  return (
    <section
      data-snap
      data-slide-id="brand"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-surface-porcelain text-carbon-black"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_92%_10%,rgba(198,106,50,0.07),transparent_55%)]"
      />

      <Container
        size="page"
        className="relative z-10 flex flex-1 flex-col justify-center py-28 md:py-32"
      >
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-6 bg-aviation-orange" />
            <p className="font-numeric text-[11px] uppercase tracking-[0.3em] text-aviation-orange">
              {pick(content, "eyebrow", locale)}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 max-w-4xl">
          <Reveal delay={0.06}>
            <h2 className="font-display text-[clamp(2.2rem,5.2vw,5.4rem)] font-semibold leading-[1.0] tracking-[-0.015em]">
              {pick(content, "headlineLine1", locale)}
              <br />
              {pick(content, "headlineLine2", locale)}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-8 max-w-2xl text-base leading-8 text-carbon-black/64 md:text-lg md:leading-9">
              {pick(content, "body", locale)}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-9 flex flex-wrap gap-x-9 gap-y-3.5">
              {capabilities.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-2.5 text-[13px] tracking-[0.02em] text-carbon-black/68"
                >
                  <span aria-hidden className="block h-px w-5 bg-aviation-orange/75" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.26} margin="0px">
          <div className="mt-14 border-t border-carbon-black/15 pt-8">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-10">
              {content.proofPoints.map((p, i) => {
                const label = (en && p.labelEn) || p.label;
                const unit = en ? (p.unitEn ?? p.unit) : p.unit;
                return (
                  <div
                    key={p.label || p.value}
                    className={i > 0 ? "sm:border-l sm:border-carbon-black/10 sm:pl-10" : ""}
                  >
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                      {label}
                    </dt>
                    <dd className="mt-3.5 flex items-baseline gap-1.5 font-numeric leading-none">
                      <span className="text-[clamp(2.6rem,4.6vw,4.6rem)] font-semibold tracking-[-0.02em] text-carbon-black">
                        {p.value}
                      </span>
                      {unit ? (
                        <span className="text-sm text-metal-gray md:text-base">{unit}</span>
                      ) : null}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-7 text-[11px] uppercase tracking-[0.3em] text-metal-gray">
              {pick(content, "tail", locale)}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
