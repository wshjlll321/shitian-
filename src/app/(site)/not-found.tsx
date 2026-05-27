import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-carbon-black text-surface-warm">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(198,106,50,0.10),transparent_55%),linear-gradient(180deg,#171816_0%,#0f100e_100%)]"
      />
      <Container size="page" className="relative z-10">
        <p className="font-numeric text-xs uppercase tracking-[0.28em] text-aviation-orange">404</p>
        <h1 className="mt-7 max-w-3xl font-display text-[clamp(2.4rem,6vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.01em]">
          这条航线，<br className="hidden md:block" />还没有航点。
        </h1>
        <p className="mt-7 max-w-xl text-base leading-9 text-surface-warm/68 md:text-lg">
          该页面可能仍在内容迁移或资料确认中。回到首页，或直接告诉我们你要找什么。
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/">返回首页</Button>
          <Button href="/contact" variant="contact">提交咨询</Button>
        </div>
      </Container>
    </section>
  );
}
