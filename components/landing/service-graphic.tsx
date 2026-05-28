import type { LucideIcon } from "lucide-react";

export function ServiceGraphic({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden border-t border-white/10 lg:border-t-0 lg:border-l">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.08),transparent_50%)]" />
      <svg
        className="relative h-[70%] w-[85%] max-w-md"
        viewBox="0 0 400 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M80 140 L160 100 L240 140 L160 180 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-white/20"
        />
        <path
          d="M160 100 L240 60 L320 100 L240 140 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-cyan-400/30"
        />
        <path
          d="M160 180 L240 140 L320 180 L240 220 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-white/20"
        />
        <path
          d="M240 140 L320 100 L320 180 L240 220 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-white/25"
        />
        <path d="M160 100 L160 180" stroke="currentColor" strokeWidth="1" className="text-white/15" />
        <path d="M240 140 L240 220" stroke="currentColor" strokeWidth="1" className="text-white/15" />
        <path d="M80 140 L80 220 L160 260 L240 220" stroke="#a78bfa" strokeWidth="1.25" opacity="0.75" />
        <path d="M240 140 L320 100" stroke="#a78bfa" strokeWidth="1.25" opacity="0.75" />
        <path d="M160 180 L240 220 L320 180" stroke="#22d3ee" strokeWidth="1.25" opacity="0.85" />
        <circle cx="160" cy="100" r="4" fill="#a78bfa" />
        <circle cx="240" cy="140" r="4" fill="#22d3ee" />
        <circle cx="320" cy="100" r="4" fill="#a78bfa" />
      </svg>
      <div className="absolute bottom-8 left-8 flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/25 backdrop-blur-sm">
        <Icon className="h-7 w-7" strokeWidth={1.25} />
      </div>
    </div>
  );
}
