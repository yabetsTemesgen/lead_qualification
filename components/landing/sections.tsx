import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Layers,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import { OpenChatButton } from "@/components/chat/open-chat-button";
import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { HeroStats } from "@/components/landing/hero-stats";
import {
  contact,
  faqs,
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
      <p className="text-sm font-semibold tracking-[0.24em] text-cyan-300 uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-lg leading-8 text-slate-300">{description}</p>
      ) : null}
    </div>
  );
}

const deliverySteps = [
  {
    step: "01",
    title: "Discovery & scope",
    detail: "Goals, users, constraints, and a clear delivery roadmap.",
    icon: Layers,
  },
  {
    step: "02",
    title: "Design & engineering",
    detail: "Iterative builds with demos, QA, and transparent milestones.",
    icon: Code2,
  },
  {
    step: "03",
    title: "Launch & automation",
    detail: "Production rollout plus workflows that keep your team efficient.",
    icon: Sparkles,
  },
] as const;

const capabilityHighlights = [
  "Web, mobile, and cloud-native platforms",
  "AI assistants and intelligent automation",
  "Design systems and conversion-focused UX",
] as const;

export function HeroSection() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-[0.35]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(34,211,238,0.08),transparent_55%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              {hero.eyebrow}
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {hero.description}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <OpenChatTrigger className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
                {hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </OpenChatTrigger>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5"
              >
                {hero.secondaryCta}
              </a>
            </div>
          </div>

        <div className="relative">
          <div className="absolute inset-0 -translate-x-4 translate-y-4 rounded-4xl bg-cyan-400/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/8 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-300">How we deliver</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Strategy → Build → Scale
                </h2>
              </div>
              <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                Senior-led
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {deliverySteps.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-200">
                      {item.step}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-sm text-slate-400">{item.detail}</p>
                    </div>
                    <Icon className="h-5 w-5 shrink-0 text-cyan-300/80" />
                  </div>
                );
              })}
            </div>
            <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5">
              <p className="text-sm font-medium text-cyan-100">What you can expect</p>
              <ul className="mt-3 space-y-3 text-sm text-slate-200">
                {capabilityHighlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    {item}
                  </li>
                ))}
              </ul>
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
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/12 text-cyan-200 ring-1 ring-cyan-300/20">
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
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6"
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
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 rounded-[1.75rem] border border-white/10 bg-white/5">
        {faqs.map((faq) => (
          <details key={faq.question} className="group px-6 py-5">
            <summary className="cursor-pointer list-none text-base font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span className="text-cyan-300 transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-4 text-sm leading-7 text-slate-300">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-8 rounded-4xl border border-cyan-300/15 bg-linear-to-br from-cyan-400/12 to-slate-900 p-8 lg:grid-cols-[1fr_0.95fr] lg:p-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-300 uppercase">
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
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5"
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
                className="block rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6 transition hover:border-cyan-300/30"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/12 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cyan-100">{channel.label}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{channel.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{channel.note}</p>
                  </div>
                </div>
              </a>
            );
          })}
          <div className="rounded-[1.75rem] border border-dashed border-white/15 bg-white/5 p-6 text-center">
            <MessageSquare className="mx-auto h-6 w-6 text-cyan-300" />
            <p className="mt-3 text-sm font-medium text-white">AI project assistant</p>
            <p className="mt-2 text-sm text-slate-400">
              Use the chat button to share your service needs, budget, timeline, and contact
              details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
