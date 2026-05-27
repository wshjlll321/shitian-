"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: number;
};

/**
 * Per-row "remove" control on the inquiries list. Asks once before sending
 * the DELETE; on success it triggers a router refresh so the row vanishes
 * from the list without a full reload.
 */
export function InquiryDeleteButton({ id }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function remove() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        setBusy(false);
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        alert(data.error ?? "删除失败");
      }
    } catch {
      setBusy(false);
      alert("网络错误,请重试");
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-[11px] uppercase tracking-[0.16em] text-carbon-black/40 transition hover:text-signal-red"
      >
        删除
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-[11px]">
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="font-medium text-signal-red transition hover:underline disabled:opacity-50"
      >
        {busy ? "删除中…" : "确认删除"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-carbon-black/40 transition hover:text-carbon-black"
      >
        取消
      </button>
    </span>
  );
}
