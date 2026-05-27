"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ServiceGraphic } from "@/components/landing/service-graphic";
import { services } from "@/lib/landing-content";

const ROW_HEIGHT = "min-h-[28rem] lg:min-h-[20rem]";

function ServiceRow({
  service,
  isActive,
  onActivate,
  onDeactivate,
}: {
  service: (typeof services)[number];
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const Icon = service.icon;

  return (
    <article
      tabIndex={0}
      className="border-b border-white/10 outline-none last:border-b-0 focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-inset"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      onClick={onActivate}
    >
      <div
        className={`relative ${ROW_HEIGHT} overflow-hidden transition-[background-color,box-shadow] duration-500 ease-out ${
          isActive
            ? "bg-linear-to-br from-cyan-400/12 via-slate-950 to-violet-500/10 shadow-[inset_0_1px_0_0_rgba(34,211,238,0.15)]"
            : "bg-transparent"
        }`}
      >
        <div
          className={`absolute inset-0 grid grid-cols-1 items-center gap-6 px-6 py-10 transition-opacity duration-300 sm:px-8 lg:grid-cols-[minmax(220px,36%)_1fr] lg:gap-12 lg:pl-10 lg:pr-12 ${
            isActive
              ? "pointer-events-none opacity-0"
              : "opacity-100 hover:bg-white/[0.02]"
          }`}
          aria-hidden={isActive}
        >
          <h3 className="text-xl font-semibold tracking-tight text-white lg:text-2xl">
            {service.name}
          </h3>
          <p className="text-base leading-7 text-slate-400">{service.teaser}</p>
        </div>

        <div
          className={`absolute inset-0 grid grid-cols-1 transition-opacity duration-300 lg:grid-cols-2 ${
            isActive ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!isActive}
        >
          <div className="flex flex-col justify-center px-6 py-10 sm:px-8 lg:px-12 lg:py-10">
            <h3 className="bg-linear-to-r from-cyan-200 via-cyan-300 to-violet-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent lg:text-3xl">
              {service.name}
            </h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              {service.description}
            </p>
            <a
              href={service.href}
              aria-label={`Learn more about ${service.name}`}
              className="mt-8 inline-flex w-fit items-center justify-center rounded-full border border-cyan-300/40 px-6 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-400/10"
              tabIndex={isActive ? 0 : -1}
            >
              Learn more
            </a>
          </div>
          <ServiceGraphic icon={Icon} />
        </div>
      </div>
    </article>
  );
}

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
        <div className="flex flex-col gap-6 border-b border-white/10 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10 lg:py-10">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-cyan-300 uppercase">
              What we do
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Our Services
            </h2>
          </div>
          <a
            href="#contact"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-400/20"
          >
            See all Services
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="services-promo-card--list">
          {services.map((service, index) => (
            <ServiceRow
              key={service.name}
              service={service}
              isActive={activeIndex === index}
              onActivate={() => setActiveIndex(index)}
              onDeactivate={() => setActiveIndex(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
