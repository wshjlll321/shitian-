import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

type GsapBundle = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
};

let bundlePromise: Promise<GsapBundle> | null = null;

export function loadGsap(): Promise<GsapBundle> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadGsap must be called in the browser"));
  }

  if (!bundlePromise) {
    bundlePromise = (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger")
      ]);
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    })();
  }

  return bundlePromise;
}
