"use client";

export type RelationOption = {
  value: string;
  label: string;
  secondary?: string;
};

type RelationPickerProps = {
  value: string[];
  onChange: (next: string[]) => void;
  options: RelationOption[];
  multiple?: boolean;
};

const fieldClass =
  "min-h-10 w-full border border-carbon-black/15 bg-white px-2.5 text-sm text-carbon-black outline-none transition focus:border-aviation-orange";

export function RelationPicker({
  value,
  onChange,
  options,
  multiple = true
}: RelationPickerProps) {
  const lookup = (v: string) => options.find((o) => o.value === v);
  const available = options.filter((o) => !value.includes(o.value));

  // Single-selection case → a normal dropdown. Stored as string[] of length 0 or 1.
  if (!multiple) {
    return (
      <select
        className={fieldClass}
        value={value[0] ?? ""}
        onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
      >
        <option value="">— 未选择 —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
            {o.secondary ? `（${o.secondary}）` : ""}
          </option>
        ))}
      </select>
    );
  }

  function add(v: string) {
    if (!v || value.includes(v)) return;
    onChange([...value, v]);
  }

  return (
    <div className="grid gap-2">
      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {value.map((v) => {
            const opt = lookup(v);
            return (
              <li
                key={v}
                className="flex items-center gap-2 border border-carbon-black/20 bg-surface-warm px-2.5 py-1 text-[12.5px]"
              >
                <span>{opt?.label ?? v}</span>
                {opt?.secondary ? (
                  <span className="text-[11px] text-carbon-black/45">{opt.secondary}</span>
                ) : null}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((x) => x !== v))}
                  aria-label={`移除 ${opt?.label ?? v}`}
                  className="text-carbon-black/40 transition hover:text-signal-red"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-[12px] text-carbon-black/40">尚未关联，从下方下拉添加。</p>
      )}
      <select
        className={`${fieldClass} max-w-md`}
        value=""
        onChange={(e) => {
          add(e.target.value);
          e.target.value = "";
        }}
      >
        <option value="">+ 添加…</option>
        {available.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
            {o.secondary ? `（${o.secondary}）` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
