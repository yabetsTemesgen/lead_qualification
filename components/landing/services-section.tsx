"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ServiceGraphic } from "@/components/landing/service-graphic";
import { services } from "@/lib/landing-content";

const ROW_HEIGHT_DESKTOP = "lg:min-h-[20rem]";

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
        className={`relative service-card-active ${ROW_HEIGHT_DESKTOP} ${
          isActive
            ? "overflow-visible lg:overflow-hidden bg-linear-to-br from-cyan-400/12 via-slate-950 to-cyan-500/8 shadow-[inset_0_1px_0_0_rgba(34,211,238,0.2)]"
            : "overflow-visible lg:overflow-hidden service-card-idle bg-transparent"
        }`}
      >
        <div
          className={`service-card-layer z-3 grid grid-cols-1 items-start gap-4 px-6 pt-8 pb-10 sm:px-8 sm:pb-12 max-lg:relative lg:absolute lg:inset-0 lg:items-center lg:gap-12 lg:py-10 lg:grid-cols-[minmax(220px,36%)_1fr] lg:pl-10 lg:pr-12 ${
            isActive
              ? "max-lg:hidden pointer-events-none opacity-0 lg:grid -translate-y-3 blur-[2px]"
              : "opacity-100 translate-y-0 blur-0"
          }`}
          aria-hidden={isActive}
        >
          <h3 className="text-xl font-semibold tracking-tight text-white lg:text-2xl">
            {service.name}
          </h3>
          <p className="text-base leading-7 text-slate-400">{service.teaser}</p>
        </div>

        <div
          className={`service-card-layer service-card-layer--enter z-4 grid grid-cols-1 max-lg:relative lg:absolute lg:inset-0 lg:grid-cols-2 ${
            isActive
              ? "opacity-100 translate-y-0"
              : "max-lg:hidden pointer-events-none opacity-0 translate-y-4"
          }`}
          aria-hidden={!isActive}
        >
          <div className="flex flex-col justify-center px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
            <h3 className="bg-linear-to-r from-cyan-200 via-cyan-300 to-sky-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent lg:text-3xl">
              {service.name}
            </h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              {service.description}
            </p>
            <a
              href={service.href}
              aria-label={`Learn more about ${service.name}`}
              className="mt-8 inline-flex w-fit items-center justify-center rounded-lg bg-gradient-brand-outline px-6 py-2.5 text-sm font-medium text-white"
              tabIndex={isActive ? 0 : -1}
            >
              Learn more
            </a>
          </div>
          <div
            className={`service-card-graphic min-h-56 shrink-0 lg:h-full lg:min-h-0 ${
              isActive ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-[0.98]"
            }`}
          >
            <ServiceGraphic icon={Icon} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="overflow-x-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="flex flex-col gap-6 border-b border-white/10 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10 lg:py-10">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-gradient-brand uppercase">
              What we do
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Our Services
            </h2>
          </div>
          <a
            href="#contact"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-gradient-brand-outline px-5 py-2.5 text-sm font-medium text-white"
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
