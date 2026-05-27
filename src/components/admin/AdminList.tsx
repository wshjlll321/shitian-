import Link from "next/link";

import { ContentCreateButton } from "@/components/admin/ContentCreateButton.client";
import { I18nStatusDot } from "@/components/admin/I18nProgressBar";
import type { I18nProgress } from "@/lib/i18n-progress";

export type AdminListItem = {
  slug: string;
  status: string;
  primary: string;
  secondary: string;
  /** Optional translation coverage for this row — drives the EN status dot. */
  i18n?: I18nProgress;
  /** When true a small ★ 主页 chip is rendered to mark records that are
   *  surfaced on the public home page. */
  pinned?: boolean;
};

type AdminListProps = {
  kicker: string;
  title: string;
  note?: string;
  items: AdminListItem[];
  editBase: string;
  createType?: "case" | "news" | "scenario" | "technology";
  createLabel?: string;
};

export function AdminList({
  kicker,
  title,
  note,
  items,
  editBase,
  createType,
  createLabel
}: AdminListProps) {
  return (
    <div className="px-10 py-10">
      <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
        {kicker}
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.01em]">{title}</h1>
          {note ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-carbon-black/60">{note}</p>
          ) : null}
        </div>
        {createType ? (
          <ContentCreateButton type={createType} label={createLabel} />
        ) : null}
      </div>

      <ul className="mt-8 divide-y divide-carbon-black/10 border-y border-carbon-black/12">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${editBase}/${item.slug}`}
              className="group flex items-center gap-6 py-5 transition hover:bg-surface-warm"
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-carbon-black">{item.primary}</span>
                  {item.pinned ? (
                    <span
                      className="inline-flex items-center gap-1 border border-aviation-orange/55 bg-aviation-orange/[0.08] px-1.5 py-0.5 font-numeric text-[10px] uppercase tracking-[0.16em] text-aviation-orange"
                      title="此案例已在主页「案例实证」展示"
                    >
                      ★ 主页
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-carbon-black/55">
                  {item.secondary}
                </span>
              </span>
              {item.i18n ? <I18nStatusDot progress={item.i18n} /> : null}
              <span
                className={`shrink-0 border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${
                  item.status === "draft"
                    ? "border-metal-gray/40 text-metal-gray"
                    : "border-aviation-orange/50 text-aviation-orange"
                }`}
              >
                {item.status === "draft" ? "草稿" : "已发布"}
              </span>
              <span
                aria-hidden
                className="shrink-0 font-numeric text-sm text-carbon-black/30 transition group-hover:translate-x-1 group-hover:text-aviation-orange"
              >
                编辑 →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
