"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type LocomotiveScrollInstance = InstanceType<
  typeof import("locomotive-scroll").default
>;

const LocomotiveScrollContext = createContext<LocomotiveScrollInstance | null>(
  null,
);

export function useLocomotiveScroll() {
  return useContext(LocomotiveScrollContext);
}

export function LocomotiveScrollProvider({ children }: { children: ReactNode }) {
  const scrollRef = useRef<LocomotiveScrollInstance | null>(null);
  const [scrollInstance, setScrollInstance] =
    useState<LocomotiveScrollInstance | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    let cancelled = false;

    const init = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      if (cancelled) return;

      const scroll = new LocomotiveScroll({
        lenisOptions: {
          lerp: 0.075,
          smoothWheel: true,
        },
      });

      scrollRef.current = scroll;
      setScrollInstance(scroll);

      const handleResize = () => {
        scroll.resize();
      };

      const scheduleResize = () => {
        handleResize();
        window.requestAnimationFrame(handleResize);
      };

      window.addEventListener("load", scheduleResize);
      window.addEventListener("resize", handleResize);

      const resizeTimers = [200, 600, 1200].map((delay) =>
        window.setTimeout(scheduleResize, delay),
      );

      scheduleResize();

      return () => {
        window.removeEventListener("load", scheduleResize);
        window.removeEventListener("resize", handleResize);
        for (const timer of resizeTimers) {
          window.clearTimeout(timer);
        }
      };
    };

    let cleanup: (() => void) | undefined;

    void init().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cancelled = true;
      cleanup?.();
      scrollRef.current?.destroy();
      scrollRef.current = null;
      setScrollInstance(null);
    };
  }, []);

  return (
    <LocomotiveScrollContext.Provider value={scrollInstance}>
      {children}
    </LocomotiveScrollContext.Provider>
  );
}
