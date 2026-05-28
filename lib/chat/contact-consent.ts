export type ContactConsentStatus = "none" | "pending" | "granted" | "declined";

export const CONTACT_CONSENT_PROMPT =
  "We've captured what we need about your project. The next step is sharing your contact details so our team can follow up. Would you like to do that now? Reply yes or no.";

export const CONTACT_CONSENT_DECLINED_MESSAGE =
  "No problem — we can keep chatting about your project. When you're ready to share contact details, just say yes.";

export const CONTACT_CONSENT_CLARIFY_MESSAGE =
  "Just reply yes if you're ready for the contact form, or no to stay in chat.";

/** Assistant message is asking yes/no before the contact form. */
export function messageAsksContactConsent(text: string): boolean {
  const lower = text.toLowerCase();
  const asksYesNo = /\b(yes or no|reply yes|say yes)\b/i.test(lower);
  const aboutContact =
    /\b(contact form|contact details|share your details|move to the contact)\b/i.test(
      lower,
    );
  return asksYesNo && aboutContact;
}

/** Assistant message tells the user the form is ready (after they agreed). */
export function messageDirectsToContactForm(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    /\bcontact form\b/i.test(lower) &&
    /\b(fill out|ready for you|share your details|fill in)\b/i.test(lower)
  );
}

/** Detect explicit yes/no when we're waiting for contact consent. */
export function detectContactConsent(text: string): "yes" | "no" | null {
  const t = text.trim().toLowerCase().replace(/[.!]+$/g, "");

  if (
    /^(no|nope|nah|not yet|not now|later|maybe later|don't|do not|not really)\b/.test(
      t,
    ) ||
    /\b(not yet|not now|maybe later|no thanks|no thank you)\b/.test(t)
  ) {
    return "no";
  }

  if (
    /^(yes|yeah|yep|yup|sure|ok|okay|please|absolutely|definitely|sounds good|go ahead|let's|lets)\b/.test(
      t,
    ) ||
    /\b(i'm ready|im ready|ready to share|share my contact)\b/.test(t)
  ) {
    return "yes";
  }

  return null;
}
