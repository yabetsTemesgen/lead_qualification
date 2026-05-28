"use client";

import Link from "next/link";
import { Binary, Menu, MessageSquare, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { openLeadChat } from "@/components/chat/lead-chat-widget";
import { OpenChatTrigger } from "@/components/chat/open-chat-trigger";
import { navLinks, site } from "@/lib/landing-content";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const closeOnDesktop = () => {
      if (mediaQuery.matches) {
        setMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", closeOnDesktop);
    return () => mediaQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-slate-950/90 backdrop-blur-xl supports-backdrop-filter:bg-slate-950/75">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-6 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-10 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/25">
              <Binary className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[0.24em] text-gradient-brand uppercase">
                {site.name}
              </p>
              <p className="truncate text-sm text-slate-400">{site.tagline}</p>
            </div>
          </Link>

          <nav
            className="hidden items-center justify-center gap-x-10 text-sm text-slate-300 lg:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <a key={link.href} className="transition hover:text-white" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:justify-self-end">
            <OpenChatTrigger className="hidden items-center justify-center gap-2 rounded-lg bg-gradient-brand-outline px-5 py-2.5 text-sm font-medium text-white sm:inline-flex">
              <MessageSquare className="h-4 w-4" />
              Get in touch
            </OpenChatTrigger>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-slate-200 transition hover:border-white/30 hover:bg-white/5 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        id={menuId}
        className={`fixed inset-x-0 top-18 bottom-0 z-30 overflow-y-auto border-t border-white/10 bg-slate-950/98 backdrop-blur-xl transition-[visibility,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:hidden ${
          menuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav
          className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-3 text-base font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-brand-outline px-5 py-3 text-sm font-medium text-white"
            onClick={() => {
              closeMenu();
              openLeadChat();
            }}
          >
            <MessageSquare className="h-4 w-4" />
            Get in touch
          </button>
        </nav>
      </div>
    </>
  );
}
