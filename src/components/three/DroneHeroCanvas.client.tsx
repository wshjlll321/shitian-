"use client";

import Image from "next/image";

import { DroneHeroScene } from "@/components/three/DroneHeroScene.client";
import { ThreeSceneBoundary } from "@/components/three/ThreeSceneBoundary.client";
import { getMediaById } from "@/lib/content";

type DroneHeroCanvasProps = {
  fallbackMediaId?: string;
  fallbackLabel: string;
};

export function DroneHeroCanvas({
  fallbackMediaId = "product-t280-hero",
  fallbackLabel
}: DroneHeroCanvasProps) {
  const media = getMediaById(fallbackMediaId);

  const fallback = media ? (
    <div className="relative h-full w-full">
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain"
      />
    </div>
  ) : null;

  return (
    <ThreeSceneBoundary
      surface="transparent"
      fallback={fallback}
      fallbackLabel={fallbackLabel}
      cameraPosition={[0.4, 0.6, 5.2]}
      cameraFov={38}
    >
      <DroneHeroScene />
    </ThreeSceneBoundary>
  );
}
