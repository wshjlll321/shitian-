"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ContentCreateButton } from "@/components/admin/ContentCreateButton.client";
import { ContentRowActions } from "@/components/admin/ContentRowActions.client";
import { I18nStatusDot } from "@/components/admin/I18nProgressBar";
import type { I18nProgress } from "@/lib/i18n-progress";

type ContentType = "product" | "case" | "news" | "scenario" | "technology";

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
  contentType?: ContentType;
  createType?: ContentType;
  createLabel?: string;
};

export function AdminList({
  kicker,
  title,
  note,
  items,
  editBase,
  contentType,
  createType,
  createLabel
}: AdminListProps) {
  const actionType = contentType ?? createType;
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const visibleCount = items.filter((item) => item.status !== "draft").length;
  const hiddenCount = items.length - visibleCount;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!normalizedQuery) return true;

      const haystack = [item.slug, item.primary, item.secondary]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [items, normalizedQuery, statusFilter]);

  const filters = [
    { key: "all", label: "全部", count: items.length },
    { key: "published", label: "显示中", count: visibleCount },
    { key: "draft", label: "不显示", count: hiddenCount }
  ] as const;

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

      <div className="mt-7 flex flex-col gap-3 border border-carbon-black/12 bg-surface-warm/60 p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setStatusFilter(filter.key)}
              className={`min-h-9 border px-3 text-[12px] transition ${
                statusFilter === filter.key
                  ? "border-aviation-orange bg-aviation-orange text-surface-warm"
                  : "border-carbon-black/12 bg-white text-carbon-black/65 hover:border-aviation-orange hover:text-aviation-orange"
              }`}
            >
              {filter.label} · {filter.count}
            </button>
          ))}
        </div>
        <label className="min-w-0 md:w-80">
          <span className="sr-only">搜索内容</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、摘要或 slug"
            className="min-h-9 w-full border border-carbon-black/12 bg-white px-3 text-[13px] text-carbon-black outline-none transition placeholder:text-carbon-black/35 focus:border-aviation-orange"
          />
        </label>
      </div>

      <ul className="mt-8 divide-y divide-carbon-black/10 border-y border-carbon-black/12">
        {filteredItems.map((item) => (
          <li
            key={item.slug}
            className="group flex flex-col gap-3 py-5 transition hover:bg-surface-warm md:flex-row md:items-center md:gap-6"
          >
            <Link
              href={`${editBase}/${item.slug}`}
              className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"
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
            {actionType ? (
              <ContentRowActions
                type={actionType}
                slug={item.slug}
                status={item.status}
                label={item.primary}
              />
            ) : null}
          </li>
        ))}
      </ul>
      {filteredItems.length === 0 ? (
        <div className="border-b border-carbon-black/12 py-10 text-center text-sm text-carbon-black/45">
          没有匹配的内容，换个关键词或筛选条件试试。
        </div>
      ) : null}
    </div>
  );
}
