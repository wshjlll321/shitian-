import Link from "next/link";

type AdminEditToolbarProps = {
  formId: string;
  saving: boolean;
  title?: string;
  description?: string;
  status?: string;
  onStatusChange?: (next: string) => void;
  viewHref?: string;
};

export function AdminEditToolbar({
  formId,
  saving,
  title = "维护操作",
  description = "保存后会立即刷新前台对应页面。",
  status,
  onStatusChange,
  viewHref
}: AdminEditToolbarProps) {
  return (
    <div className="sticky top-0 z-20 mt-6 flex flex-col gap-4 border border-carbon-black/12 bg-surface-porcelain/95 p-4 shadow-[0_18px_45px_-34px_rgba(17,17,17,0.5)] backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[12px] font-medium text-carbon-black">{title}</p>
        <p className="mt-1 text-[12px] text-carbon-black/50">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {status && onStatusChange ? (
          <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-metal-gray">
            前台状态
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
              className="min-h-9 border border-carbon-black/15 bg-white px-2.5 text-[12px] normal-case tracking-normal text-carbon-black outline-none transition focus:border-aviation-orange"
            >
              <option value="published">显示中</option>
              <option value="draft">不显示</option>
            </select>
          </label>
        ) : null}

        {viewHref ? (
          <Link
            href={viewHref}
            target="_blank"
            className="inline-flex min-h-9 items-center border border-carbon-black/15 px-3 text-[12px] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange"
          >
            前台查看
          </Link>
        ) : null}

        <button
          type="submit"
          form={formId}
          disabled={saving}
          className="inline-flex min-h-9 items-center justify-center bg-aviation-orange px-5 text-[13px] font-medium text-surface-warm transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? "保存中..." : "保存修改"}
        </button>
      </div>
    </div>
  );
}
