"use client";

import { useEffect } from "react";

/**
 * Adds the `snap-home` class to <html> while the homepage is mounted, and
 * toggles `snap-off` once the user has reached the closing Contact block,
 * so the user can freely scroll past Contact into the Footer without snap
 * trapping them.
 *
 * Also forces `scrollRestoration` to manual on the home route — otherwise
 * the browser tries to restore the previous y-offset on reload, and the
 * mandatory snap engine that we attach a tick later promptly snaps that
 * restored position to the nearest slide (so a reload at e.g. y=900 lands
 * on Brand rather than Hero).
 */
export function HomeSnapEffect() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("snap-home");

    // Take over scroll restoration so reload always starts at Hero.
    const previousRestoration =
      "scrollRestoration" in window.history ? window.history.scrollRestoration : undefined;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const update = () => {
      // Once Contact's top is within the upper half of the viewport, the user
      // has clearly entered the closing block — disable snap so they can
      // scroll past it into the Footer freely.
      const contact = document.querySelector<HTMLElement>('[data-slide-id="contact"]');
      if (!contact) return;
      const rect = contact.getBoundingClientRect();
      const passed = rect.top < window.innerHeight * 0.5;
      root.classList.toggle("snap-off", passed);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.classList.remove("snap-home");
      root.classList.remove("snap-off");
      if (previousRestoration && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = previousRestoration;
      }
    };
  }, []);

  return null;
}
