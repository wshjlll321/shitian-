"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ContentDeleteButtonProps = {
  type: "product" | "case" | "news" | "scenario" | "technology";
  slug: string;
  backHref: string;
};

export function ContentDeleteButton({ type, slug, backHref }: ContentDeleteButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function deleteRecord() {
    const confirmed = window.confirm(`确认删除 ${slug}？删除后前台将不再显示该内容。`);
    if (!confirmed) return;

    setBusy(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/content/${type}/${slug}`, {
        method: "DELETE"
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "删除失败");
      }
      router.push(backHref);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "删除失败");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={deleteRecord}
        disabled={busy}
        className="border border-signal-red/45 px-4 py-2 text-[12px] text-signal-red transition hover:bg-signal-red/10 disabled:opacity-60"
      >
        {busy ? "删除中..." : "删除此内容"}
      </button>
      {message ? <span className="text-xs text-signal-red">{message}</span> : null}
    </div>
  );
}
