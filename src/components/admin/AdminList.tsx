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
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
            {kicker}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em]">{title}</h1>
          {note ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-carbon-black/60">{note}</p>
          ) : null}
        </div>
        {createType ? (
          <ContentCreateButton type={createType} label={createLabel} />
        ) : null}
      </div>

      <div className="mt-7 grid gap-3 border border-carbon-black/12 bg-surface-warm/70 p-3 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
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
        <label className="min-w-0">
          <span className="sr-only">搜索内容</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、摘要或 slug"
            className="min-h-9 w-full border border-carbon-black/12 bg-white px-3 text-[13px] text-carbon-black outline-none transition placeholder:text-carbon-black/35 focus:border-aviation-orange"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {filteredItems.map((item) => (
          <article
            key={item.slug}
            className="group flex min-h-48 flex-col border border-carbon-black/12 bg-surface-warm/80 p-4 transition hover:border-aviation-orange/55 hover:bg-surface-warm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`border px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${
                    item.status === "draft"
                      ? "border-metal-gray/40 bg-white text-metal-gray"
                      : "border-aviation-orange/45 bg-aviation-orange/[0.08] text-aviation-orange"
                  }`}
                >
                  {item.status === "draft" ? "不显示" : "显示中"}
                </span>
                {item.pinned ? (
                  <span
                    className="inline-flex items-center border border-aviation-orange/45 bg-white px-2 py-1 font-numeric text-[10px] uppercase tracking-[0.16em] text-aviation-orange"
                    title="此案例已在主页「案例实证」展示"
                  >
                    ★ 主页
                  </span>
                ) : null}
                <span className="font-numeric text-[10px] uppercase tracking-[0.16em] text-carbon-black/35">
                  {item.slug}
                </span>
              </div>
              {item.i18n ? <I18nStatusDot progress={item.i18n} /> : null}
            </div>

            <div className="mt-4 min-w-0 flex-1">
              <h2 className="text-[15px] font-medium leading-6 text-carbon-black">
                {item.primary}
              </h2>
              <p className="mt-2 max-h-12 overflow-hidden text-[13px] leading-6 text-carbon-black/58">
                {item.secondary}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-carbon-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={`${editBase}/${item.slug}`}
                className="inline-flex min-h-8 items-center justify-center border border-carbon-black/15 bg-white px-3 text-[12px] text-carbon-black/70 transition hover:border-aviation-orange hover:text-aviation-orange sm:w-auto"
              >
                编辑内容
              </Link>
              {actionType ? (
                <ContentRowActions
                  type={actionType}
                  slug={item.slug}
                  status={item.status}
                  label={item.primary}
                />
              ) : null}
            </div>
          </article>
        ))}
      </div>
      {filteredItems.length === 0 ? (
        <div className="mt-6 border border-carbon-black/12 bg-surface-warm/50 py-10 text-center text-sm text-carbon-black/45">
          没有匹配的内容，换个关键词或筛选条件试试。
        </div>
      ) : null}
    </div>
  );
}
