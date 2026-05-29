"use client";

import { useEffect, useRef, useState } from "react";
import { hero } from "@/lib/landing-content";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

type HeroStat = (typeof hero.stats)[number];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function formatCount(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}

function CountUpValue({
  stat,
  isVisible,
}: {
  stat: HeroStat;
  isVisible: boolean;
}) {
  const decimals = "decimals" in stat ? (stat.decimals ?? 0) : 0;
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1800;
    let frameId = 0;
    let startTime: number | null = null;

    const tick = (time: number) => {
      if (startTime === null) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const current = easeOutCubic(progress) * stat.end;
      setDisplay(formatCount(current, decimals));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setDisplay(formatCount(stat.end, decimals));
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, stat.end, decimals]);

  return (
    <span className="tabular-nums">
      {display}
      {stat.suffix}
    </span>
  );
}

export function HeroStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
      <div ref={ref} className="grid gap-6 sm:grid-cols-3">
        {hero.stats.map((stat, index) => (
          <ScrollReveal
            key={stat.label}
            variant="up"
            className={
              index === 1
                ? "scroll-reveal-delay-1"
                : index === 2
                  ? "scroll-reveal-delay-2"
                  : ""
            }
          >
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center sm:text-left">
              <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                <CountUpValue stat={stat} isVisible={isVisible} />
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{stat.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
