"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import { mediaQuery } from "@/lib/viewport";

type MotionPrefs = {
  reducedMotion: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isCoarsePointer: boolean;
  canRenderThree: boolean;
  smoothScrollEnabled: boolean;
};

const defaultPrefs: MotionPrefs = {
  reducedMotion: false,
  isMobile: false,
  isTablet: false,
  isCoarsePointer: false,
  canRenderThree: true,
  smoothScrollEnabled: true
};

const MotionPrefsContext = createContext<MotionPrefs>(defaultPrefs);

function getInitialPrefs(): MotionPrefs {
  if (typeof window === "undefined") {
    return defaultPrefs;
  }

  const reducedMotion = window.matchMedia(mediaQuery.reducedMotion).matches;
  const isMobile = window.matchMedia(mediaQuery.mobile).matches;
  const isTablet = window.matchMedia(mediaQuery.tablet).matches;
  const isCoarsePointer = window.matchMedia(mediaQuery.coarsePointer).matches;

  return {
    reducedMotion,
    isMobile,
    isTablet,
    isCoarsePointer,
    canRenderThree: !reducedMotion && !isMobile,
    smoothScrollEnabled: !reducedMotion && !isMobile
  };
}

export function MotionPrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<MotionPrefs>(defaultPrefs);

  useEffect(() => {
    const queries = {
      reducedMotion: window.matchMedia(mediaQuery.reducedMotion),
      mobile: window.matchMedia(mediaQuery.mobile),
      tablet: window.matchMedia(mediaQuery.tablet),
      coarsePointer: window.matchMedia(mediaQuery.coarsePointer)
    };

    const recompute = () => setPrefs(getInitialPrefs());
    recompute();

    Object.values(queries).forEach((mq) => mq.addEventListener("change", recompute));
    return () => {
      Object.values(queries).forEach((mq) => mq.removeEventListener("change", recompute));
    };
  }, []);

  const value = useMemo(() => prefs, [prefs]);

  return <MotionPrefsContext.Provider value={value}>{children}</MotionPrefsContext.Provider>;
}

export function useMotionPrefs() {
  return useContext(MotionPrefsContext);
}
