import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type PageScaffoldProps = {
  title: string;
  description: string;
  sourceNote?: string;
};

export function PageScaffold({ title, description, sourceNote }: PageScaffoldProps) {
  return (
    <Section tone="warm" className="min-h-[52vh]">
      <Container size="content">
        <p className="text-sm text-metal-gray">页面路由已创建 / 内容待分段设计</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-carbon-black md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-carbon-black/68 md:text-lg">{description}</p>
        {sourceNote ? <p className="mt-8 text-sm text-metal-gray">内容来源：{sourceNote}</p> : null}
      </Container>
    </Section>
  );
}
