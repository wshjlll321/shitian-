"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ContentCreateButtonProps = {
  type: "product" | "case" | "news" | "scenario" | "technology";
  label?: string;
};

export function ContentCreateButton({ type, label = "新建草稿" }: ContentCreateButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function createDraft() {
    setBusy(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/content/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      const data = (await res.json().catch(() => ({}))) as {
        editHref?: string;
        error?: string;
      };
      if (!res.ok || !data.editHref) {
        throw new Error(data.error ?? "创建失败");
      }
      router.push(data.editHref);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "创建失败");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={createDraft}
        disabled={busy}
        className="inline-flex min-h-10 items-center justify-center bg-aviation-orange px-4 text-sm font-medium text-surface-warm transition hover:brightness-110 disabled:opacity-60"
      >
        {busy ? "创建中..." : label}
      </button>
      {message ? <span className="text-xs text-signal-red">{message}</span> : null}
    </div>
  );
}
