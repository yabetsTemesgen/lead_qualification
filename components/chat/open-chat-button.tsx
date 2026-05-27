"use client";

import { MessageSquare } from "lucide-react";
import { openLeadChat } from "@/components/chat/lead-chat-widget";

type OpenChatButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline";
};

export function OpenChatButton({
  children,
  className = "",
  variant = "primary",
}: OpenChatButtonProps) {
  const base =
    variant === "primary"
      ? "inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
      : "inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/40 px-6 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-400/10";

  return (
    <button type="button" onClick={openLeadChat} className={`${base} ${className}`}>
      {children}
      {variant === "primary" ? <MessageSquare className="h-4 w-4" /> : null}
    </button>
  );
}
