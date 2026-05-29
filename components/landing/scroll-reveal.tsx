"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import { useLocomotiveScroll } from "@/components/landing/locomotive-scroll-provider";

export type ScrollRevealVariant = "up" | "left" | "right" | "scale" | "fade";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
  variant?: ScrollRevealVariant;
  as?: ElementType;
};

export function ScrollReveal({
  children,
  className = "",
  speed,
  variant = "up",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const locomotiveScroll = useLocomotiveScroll();
  const Component = Tag;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.08,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (speed == null || !locomotiveScroll) return;

    locomotiveScroll.resize();
  }, [speed, locomotiveScroll]);

  return (
    <Component
      ref={ref as never}
      className={`scroll-reveal scroll-reveal-${variant} ${inView ? "is-inview" : ""} ${className}`.trim()}
    >
      {speed != null ? (
        <div
          data-scroll
          data-scroll-speed={speed}
          data-scroll-enable-touch-speed
          className="h-full w-full"
        >
          {children}
        </div>
      ) : (
        children
      )}
    </Component>
  );
}
