"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ServiceGraphic } from "@/components/landing/service-graphic";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { services } from "@/lib/landing-content";
import { inPageScrollLinkProps } from "@/lib/scroll-link";

const ROW_HEIGHT_DESKTOP = "lg:min-h-[20rem]";

function ServiceRowMobile({
  service,
}: {
  service: (typeof services)[number];
}) {
  return (
    <div className="border-b border-white/10 px-6 py-8 last:border-b-0 sm:px-8">
      <h3 className="text-xl font-semibold tracking-tight text-white">
        {service.name}
      </h3>
      <p className="mt-3 text-base leading-7 text-neutral-400">{service.teaser}</p>
      <a
        href={service.href}
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-200 transition hover:text-white"
      >
        Learn more
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function ServiceRowDesktop({
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
    <div
      tabIndex={0}
      className="service-card-interactive border-b border-white/10 outline-none last:border-b-0 focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-inset"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      <div
        className={`relative service-card-active ${ROW_HEIGHT_DESKTOP} ${
          isActive
            ? "overflow-hidden bg-linear-to-br from-white/[0.06] via-neutral-950 to-white/[0.03] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
            : "overflow-hidden service-card-idle bg-transparent"
        }`}
      >
        <div
          className={`service-card-layer z-3 absolute inset-0 grid items-center gap-12 py-10 pl-10 pr-12 grid-cols-[minmax(220px,36%)_1fr] ${
            isActive
              ? "pointer-events-none opacity-0 -translate-y-3 blur-[2px]"
              : "opacity-100 translate-y-0 blur-0"
          }`}
          aria-hidden={isActive}
        >
          <h3 className="service-card-title text-2xl font-semibold tracking-tight text-white transition-colors duration-300">
            {service.name}
          </h3>
          <div className="relative">
            <span
              className="service-card-hover-hint absolute top-0 right-0 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-neutral-500 uppercase"
              aria-hidden
            >
              Hover to explore
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <p className="pr-36 text-base leading-7 text-neutral-400">{service.teaser}</p>
          </div>
        </div>

        <div
          className={`service-card-layer service-card-layer--enter z-4 absolute inset-0 grid grid-cols-2 ${
            isActive
              ? "opacity-100 translate-y-0"
              : "pointer-events-none opacity-0 translate-y-4"
          }`}
          aria-hidden={!isActive}
        >
          <div className="flex flex-col justify-center px-12 py-10">
            <h3 className="bg-linear-to-r from-neutral-100 via-neutral-200 to-neutral-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
              {service.name}
            </h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-neutral-300">
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
            className={`service-card-graphic h-full min-h-0 ${
              isActive ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-[0.98]"
            }`}
          >
            <ServiceGraphic icon={Icon} />
          </div>
        </div>
      </div>
    </div>
  );
}

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
  return (
    <article>
      <div className="lg:hidden">
        <ServiceRowMobile service={service} />
      </div>
      <div className="hidden lg:block">
        <ServiceRowDesktop
          service={service}
          isActive={isActive}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
      </div>
    </article>
  );
}

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <ScrollReveal variant="scale">
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
            {...inPageScrollLinkProps("#contact")}
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
      </ScrollReveal>
    </section>
  );
}
