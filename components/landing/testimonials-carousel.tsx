"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/landing-content";

const GAP_PX = 24;

function getItemsPerView(width: number) {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export function TestimonialsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [slideWidth, setSlideWidth] = useState(0);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const perView = getItemsPerView(container.clientWidth);
    setItemsPerView(perView);
    setSlideWidth((container.clientWidth - GAP_PX * (perView - 1)) / perView);
  }, []);

  useEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  const goPrev = () => setIndex((current) => Math.max(0, current - 1));
  const goNext = () => setIndex((current) => Math.min(maxIndex, current + 1));

  return (
    <div className="mt-10">
      <div ref={containerRef} className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{
            gap: GAP_PX,
            transform:
              slideWidth > 0
                ? `translateX(-${index * (slideWidth + GAP_PX)}px)`
                : undefined,
          }}
        >
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-6"
              style={slideWidth > 0 ? { width: slideWidth } : { width: "100%" }}
            >
              <blockquote className="text-base leading-8 text-neutral-200">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-neutral-400">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              aria-label={`Go to testimonial slide ${dotIndex + 1}`}
              aria-current={dotIndex === index ? "true" : undefined}
              onClick={() => setIndex(dotIndex)}
              className={`h-2 rounded-full transition-all duration-300 ${
                dotIndex === index
                  ? "w-6 bg-neutral-200"
                  : "w-2 bg-white/20 hover:bg-white/35"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous testimonials"
            onClick={goPrev}
            disabled={index === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 text-neutral-200 transition hover:border-white/22 hover:bg-white/5 disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next testimonials"
            onClick={goNext}
            disabled={index >= maxIndex}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 text-neutral-200 transition hover:border-white/22 hover:bg-white/5 disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
