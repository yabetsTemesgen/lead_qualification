import Link from "next/link";
import { Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/landing/site-header";
import { navLinks, site } from "@/lib/landing-content";

export { SiteHeader };

export function PageBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-0 h-136 w-136 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="absolute right-0 top-80 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900/35 px-6 py-12 backdrop-blur-xl supports-backdrop-filter:bg-slate-900/25 lg:px-8">
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
      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
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

