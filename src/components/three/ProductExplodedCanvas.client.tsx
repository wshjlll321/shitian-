"use client";

import Image from "next/image";
import { useState } from "react";

import { ProductExplodedScene } from "@/components/three/ProductExplodedScene.client";
import { ThreeSceneBoundary } from "@/components/three/ThreeSceneBoundary.client";
import { getMediaById } from "@/lib/content";

type Hotspot = {
  id: string;
  position: [number, number, number];
  label: string;
  detail: string;
};

type ProductExplodedCanvasProps = {
  hotspots: Hotspot[];
  fallbackMediaId?: string;
  fallbackLabel: string;
};

export function ProductExplodedCanvas({
  hotspots,
  fallbackMediaId,
  fallbackLabel
}: ProductExplodedCanvasProps) {
  const [active, setActive] = useState<string>(hotspots[0]?.id ?? "");
  const media = fallbackMediaId ? getMediaById(fallbackMediaId) : undefined;
  const detail = hotspots.find((h) => h.id === active);

  const fallback = media ? (
    <div className="relative h-full w-full">
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain"
        priority
      />
    </div>
  ) : null;

  return (
    <div className="relative h-full w-full">
      <ThreeSceneBoundary
        surface="transparent"
        fallback={fallback}
        fallbackLabel={fallbackLabel}
        cameraPosition={[0.3, 0.6, 6.4]}
        cameraFov={32}
      >
        <ProductExplodedScene hotspots={hotspots} activeId={active} onPick={setActive} />
      </ThreeSceneBoundary>

      {/* Hotspot detail panel — sits below the canvas on small screens, right side on large */}
      {detail ? (
        <aside className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-6 md:inset-y-0 md:left-auto md:right-0 md:flex md:w-72 md:items-end md:p-6">
          <div className="pointer-events-auto border-l border-surface-warm/14 bg-carbon-black/72 px-5 py-4 text-surface-warm backdrop-blur-sm md:bg-carbon-black/50">
            <p className="font-numeric text-[11px] uppercase tracking-[0.2em] text-aviation-orange">
              {detail.id}
            </p>
            <p className="mt-2 font-display text-base font-semibold">{detail.label}</p>
            <p className="mt-2 text-xs leading-6 text-surface-warm/70">{detail.detail}</p>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
