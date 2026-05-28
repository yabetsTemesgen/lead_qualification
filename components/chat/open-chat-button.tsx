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
      ? "inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-brand px-6 py-3 text-sm font-semibold"
      : "inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-brand-outline px-6 py-2.5 text-sm font-medium text-gradient-brand";

  return (
    <button type="button" onClick={openLeadChat} className={`${base} ${className}`}>
      {children}
      {variant === "primary" ? <MessageSquare className="h-4 w-4" /> : null}
    </button>
  );
}
