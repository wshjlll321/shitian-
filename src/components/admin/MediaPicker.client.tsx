"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import type { MediaAsset } from "@/types/content";

export type MediaIndex = Record<
  string,
  { src: string; alt: string; kind?: MediaAsset["kind"] }
>;

type MediaPickerProps = {
  value: string[];
  onChange: (next: string[]) => void;
  mediaIndex: MediaIndex;
  multiple?: boolean;
  /** Limit what the user can upload — defaults to images + video for the
   *  hero/proof slots. Pass "image" to lock to images only. */
  accept?: "image" | "image+video";
};

function isVideoSrc(src: string) {
  return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(src);
}

export function MediaPicker({
  value,
  onChange,
  mediaIndex,
  multiple = true,
  accept = "image+video"
}: MediaPickerProps) {
  // Newly uploaded assets that aren't in the initial mediaIndex yet — kept
  // in component state so previews stay visible without a page refresh.
  const [extra, setExtra] = useState<MediaIndex>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolve = (id: string) => mediaIndex[id] ?? extra[id];
  const acceptAttr = accept === "image" ? "image/*" : "image/*,video/*";

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    const newIds: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          setError(data.error ?? "上传失败");
          continue;
        }
        const data = (await res.json()) as {
          asset: { id: string; src: string; alt: string; kind?: MediaAsset["kind"] };
        };
        const asset = data.asset;
        setExtra((prev) => ({
          ...prev,
          [asset.id]: { src: asset.src, alt: asset.alt, kind: asset.kind }
        }));
        newIds.push(asset.id);
      } catch {
        setError("网络错误");
      }
    }
    setUploading(false);
    if (newIds.length > 0) {
      onChange(multiple ? [...value, ...newIds] : newIds.slice(0, 1));
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((id, idx) => {
          const m = resolve(id);
          const isVideo = m ? m.kind === "video" || isVideoSrc(m.src) : false;
          return (
            <div
              key={`${id}-${idx}`}
              className="group relative aspect-[4/3] overflow-hidden border border-carbon-black/15 bg-carbon-black/[0.03]"
            >
              {m ? (
                isVideo ? (
                  <>
                    <video
                      src={m.src}
                      className="absolute inset-0 h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <span className="absolute left-1 top-1 border border-surface-warm/40 bg-carbon-black/70 px-1.5 py-0.5 font-numeric text-[9px] uppercase tracking-[0.18em] text-surface-warm">
                      VIDEO
                    </span>
                  </>
                ) : (
                  <Image
                    src={m.src}
                    alt={m.alt}
                    fill
                    sizes="200px"
                    className="object-cover"
                    unoptimized
                  />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center px-2 text-center font-numeric text-[10px] text-carbon-black/40">
                  {id}
                </div>
              )}
              <button
                type="button"
                onClick={() => remove(idx)}
                aria-label="移除"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center border border-surface-warm/40 bg-carbon-black/65 text-surface-warm transition hover:bg-signal-red"
              >
                ✕
              </button>
            </div>
          );
        })}
        <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-carbon-black/30 bg-surface-warm text-[12px] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange">
          <span className="font-numeric text-xl leading-none">+</span>
          <span>
            {uploading
              ? "上传中…"
              : accept === "image"
                ? multiple
                  ? "添加图片"
                  : "上传图片"
                : multiple
                  ? "添加图片/视频"
                  : "上传图片/视频"}
          </span>
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept={acceptAttr}
            hidden
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
      {error ? (
        <p className="border border-signal-red/40 bg-signal-red/10 px-3 py-1.5 text-[12px] text-signal-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
