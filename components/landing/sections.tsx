import {
  ArrowRight,
  Mail,
  MessageSquare,
  Phone,
  Star,
} from "lucide-react";
import Image from "next/image";
import { OpenChatButton } from "@/components/chat/open-chat-button";
import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { HeroStats } from "@/components/landing/hero-stats";
import {
  contact,
  hero,
  site,
  testimonials,
  whyChooseUs,
} from "@/lib/landing-content";

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-semibold tracking-[0.24em] text-gradient-brand uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-lg leading-8 text-slate-300">{description}</p>
      ) : null}
    </div>
  );
}

export function HeroSection() {
  return (
    <>
      <section className="relative flex flex-col overflow-hidden lg:min-h-[calc(100svh-4.5rem)]">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-[0.35]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(34,211,238,0.08),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-6 py-16 lg:px-8 lg:py-12">
          <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {hero.description}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <OpenChatTrigger className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-brand px-6 py-3 text-sm font-semibold">
                {hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </OpenChatTrigger>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5"
              >
                {hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div
              className="pointer-events-none absolute inset-0 translate-x-4 translate-y-4 rounded-xl bg-cyan-400/15 blur-3xl"
              aria-hidden
            />
            <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-cyan-950/40 ring-1 ring-white/10">
              <Image
                src="/hero.png"
                alt="Wipuu Labs team collaborating on software development"
                width={1024}
                height={1024}
                className="h-auto w-full object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 512px"
              />
            </div>
          </div>
        </div>
        </div>
      </section>
      <HeroStats />
    </>
  );
}

export function WhyChooseUsSection() {
  return (
    <section
      id="why-us"
      className="mx-auto max-w-7xl border-t border-white/5 px-6 py-16 lg:px-8"
    >
      <SectionHeading
        eyebrow="Why choose us"
        title="Partnerships built for lasting success"
        description="We align with your goals, communicate clearly, and leave your team stronger after every engagement."
        centered
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {whyChooseUs.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/25">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="mx-auto max-w-7xl border-t border-white/5 px-6 py-16 lg:px-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by teams that care about speed and polish"
        />
        <div className="flex items-center gap-1 text-amber-300" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="rounded-xl border border-white/10 bg-white/5 p-6"
          >
            <blockquote className="text-base leading-8 text-slate-200">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6">
              <p className="font-semibold text-white">{t.name}</p>
              <p className="text-sm text-slate-400">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-7xl border-t border-white/5 px-6 py-16 lg:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="Common questions"
        description="Everything you need to know before we start."
        centered
      />
      <FaqAccordion />
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-8 rounded-xl border border-cyan-300/15 bg-linear-to-br from-cyan-400/12 to-slate-900 p-8 lg:grid-cols-[1fr_0.95fr] lg:p-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.24em] text-gradient-brand uppercase">
            Get started
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            {contact.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {contact.description}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <OpenChatButton>Start a conversation</OpenChatButton>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5"
            >
              {site.email}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="space-y-4">
          {contact.channels.map((channel) => {
            const Icon = channel.label === "Email" ? Mail : Phone;
            return (
              <a
                key={channel.label}
                href={channel.href}
                className="block rounded-xl border border-white/10 bg-slate-950/60 p-6 transition hover:border-cyan-300/30"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/25">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gradient-brand">
                      {channel.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">{channel.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{channel.note}</p>
                  </div>
                </div>
              </a>
            );
          })}
          {/* <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-center">
            <MessageSquare className="mx-auto h-6 w-6 text-cyan-400" />
            <p className="mt-3 text-sm font-medium text-white">AI project assistant</p>
            <p className="mt-2 text-sm text-slate-400">
              Use the chat button to share your service needs, budget, timeline, and contact
              details.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
}
