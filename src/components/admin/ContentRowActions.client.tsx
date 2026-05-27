"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ContentType = "product" | "case" | "news" | "scenario" | "technology";
type ContentStatus = "draft" | "published";

type ContentRowActionsProps = {
  type: ContentType;
  slug: string;
  status: string;
  label: string;
};

export function ContentRowActions({
  type,
  slug,
  status: initialStatus,
  label
}: ContentRowActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ContentStatus>(
    initialStatus === "draft" ? "draft" : "published"
  );
  const [busy, setBusy] = useState<"status" | "delete" | null>(null);
  const [error, setError] = useState("");

  const hidden = status === "draft";

  async function toggleStatus() {
    const nextStatus: ContentStatus = hidden ? "published" : "draft";
    setBusy("status");
    setError("");

    try {
      const res = await fetch(`/api/admin/content/${type}/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "状态更新失败");
      setStatus(nextStatus);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "状态更新失败");
    } finally {
      setBusy(null);
    }
  }

  async function deleteRecord() {
    const confirmed = window.confirm(
      `确认删除「${label}」？删除后前台和后台列表都不会再显示。`
    );
    if (!confirmed) return;

    setBusy("delete");
    setError("");

    try {
      const res = await fetch(`/api/admin/content/${type}/${slug}`, {
        method: "DELETE"
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "删除失败");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
      setBusy(null);
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:items-end">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggleStatus}
          disabled={busy !== null}
          className="min-h-8 border border-carbon-black/15 bg-white px-3 text-[12px] text-carbon-black/65 transition hover:border-aviation-orange hover:text-aviation-orange disabled:opacity-50"
        >
          {busy === "status" ? "处理中..." : hidden ? "设为显示" : "设为不显示"}
        </button>
        <button
          type="button"
          onClick={deleteRecord}
          disabled={busy !== null}
          className="min-h-8 border border-signal-red/35 bg-white px-3 text-[12px] text-signal-red transition hover:bg-signal-red/10 disabled:opacity-50"
        >
          {busy === "delete" ? "删除中..." : "删除"}
        </button>
      </div>
      {error ? (
        <span className="max-w-56 text-left text-[11px] text-signal-red sm:text-right">
          {error}
        </span>
      ) : null}
    </div>
  );
}
