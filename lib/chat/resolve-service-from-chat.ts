import { normalizeService } from "@/lib/chat/normalize";
import type { ServiceOption } from "@/lib/chat/types";
import type { ChatMessage } from "@/lib/chat/types";

/** Prefer the latest explicit service the user mentioned in chat. */
export function resolveServiceFromChat(
  messages: ChatMessage[],
): ServiceOption | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "user") continue;
    const match = normalizeService(msg.text);
    if (match) return match;
  }
  return null;
}
