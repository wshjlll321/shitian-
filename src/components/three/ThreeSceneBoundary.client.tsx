"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState, type ReactNode } from "react";

import { ThreeFallback } from "@/components/three/ThreeFallback";
import { useMotionPrefs } from "@/components/providers/MotionPrefsProvider.client";

type Surface = "dark" | "transparent";

type ThreeSceneBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackLabel: string;
  disableOnMobile?: boolean;
  surface?: Surface;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

const surfaceClassName: Record<Surface, string> = {
  dark: "bg-carbon-black",
  transparent: "bg-transparent"
};

export function ThreeSceneBoundary({
  children,
  disableOnMobile = true,
  fallback,
  fallbackLabel,
  surface = "dark",
  cameraPosition = [0, 1.3, 7],
  cameraFov = 35
}: ThreeSceneBoundaryProps) {
  const { reducedMotion, isMobile } = useMotionPrefs();
  const [mounted, setMounted] = useState(false);
  const [webglOk, setWebglOk] = useState(false);

  useEffect(() => {
    setWebglOk(supportsWebGL());
    setMounted(true);
  }, []);

  // Before mount we can't yet know whether WebGL is available, so neither
  // path is safe to render — emitting the fallback prematurely causes the
  // raster placeholder image to flash for a frame on every reload before
  // the canvas replaces it. Render an empty placeholder until the effect
  // has run, then switch to the correct branch.
  if (!mounted) {
    return <div aria-hidden className={`h-full w-full ${surfaceClassName[surface]}`} />;
  }

  const shouldFallback = reducedMotion || !webglOk || (disableOnMobile && isMobile);

  if (shouldFallback) {
    return fallback ? <>{fallback}</> : <ThreeFallback label={fallbackLabel} />;
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${surfaceClassName[surface]}`}>
      <Canvas
        camera={{ position: cameraPosition, fov: cameraFov }}
        dpr={[1, 1.6]}
        gl={{
          antialias: true,
          alpha: surface === "transparent",
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
