import {
  contact,
  faqs,
  hero,
  services,
  site,
  whyChooseUs,
} from "@/lib/landing-content";
import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/lib/chat/types";

/** Full agency context for the chat assistant (from landing page content). */
export function buildAgencyKnowledge(): string {
  const serviceBlocks = services
    .map(
      (s) =>
        `### ${s.name}\n${s.description}\n(Summary: ${s.teaser})`,
    )
    .join("\n\n");

  const whyUs = whyChooseUs
    .map((w) => `- ${w.title}: ${w.description}`)
    .join("\n");

  const faqBlocks = faqs
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n");

  return `
# ${site.name} ${site.tagline}

${hero.description}

Tagline: ${hero.eyebrow}

Contact: ${site.email} | ${site.phone}

## Services (use these when visitors ask what we offer)

${serviceBlocks}

## Why clients choose us

${whyUs}

## Pricing & timelines (general guidance only — no fixed quotes in chat)

- Budget bands we discuss: ${BUDGET_OPTIONS.join(", ")}
- Timeline bands: ${TIMELINE_OPTIONS.join(", ")}
- Service categories for qualification: ${SERVICE_OPTIONS.join(", ")}
- ${contact.description}

## FAQs

${faqBlocks}
`.trim();
}
