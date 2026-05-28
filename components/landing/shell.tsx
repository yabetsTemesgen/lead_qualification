import Link from "next/link";
import { MessageSquare, Sparkles } from "lucide-react";
import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { navLinks, site } from "@/lib/landing-content";

export function PageBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-0 h-136 w-136 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="absolute right-0 top-80 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-gradient-brand uppercase">
              {site.name}
            </p>
            <p className="text-sm text-slate-400">{site.tagline}</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300 max-lg:order-3 max-lg:w-full">
          {navLinks.map((link) => (
            <a key={link.href} className="transition hover:text-white" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <OpenChatTrigger className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-brand-outline px-5 py-2.5 text-sm font-medium text-white">
          <MessageSquare className="h-4 w-4" />
          Get in touch
        </OpenChatTrigger>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-6 py-12 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/25">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold text-white">
              {site.name} {site.tagline}
            </span>
          </Link>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Product development, AI integration, and automation for modern software teams.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
          {navLinks.map((link) => (
            <a key={link.href} className="transition hover:text-white" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name} {site.tagline}. All rights reserved.
        </p>
        <a className="transition hover:text-slate-300" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>
    </footer>
  );
}

