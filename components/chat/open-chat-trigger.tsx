"use client";

import { openLeadChat } from "@/components/chat/lead-chat-widget";

type OpenChatTriggerProps = {
  children: React.ReactNode;
  className?: string;
};

export function OpenChatTrigger({ children, className }: OpenChatTriggerProps) {
  return (
    <button type="button" onClick={openLeadChat} className={className}>
      {children}
    </button>
  );
}
