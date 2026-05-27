import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Code2,
  Cpu,
  Globe,
  Layers,
  Palette,
  Smartphone,
  Sparkles,
} from "lucide-react";

export const site = {
  name: "Wipuu",
  tagline: "Labs",
  email: "hello@wipuulabs.com",
  phone: "+1 (555) 987-6543",
} as const;

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  eyebrow: "Full-stack development meets intelligent automation",
  title: "Intelligent software. Built fast. Built right.",
  description:
    "We partner with startups and growth-stage companies to ship web, mobile, and AI-powered products—from MVP to production—with clarity, velocity, and craft.",
  primaryCta: "Start your project",
  secondaryCta: "Explore services",
  stats: [
    {
      end: 120,
      suffix: "+",
      label: "Products shipped across web, mobile, and cloud",
    },
    {
      end: 4.9,
      decimals: 1,
      suffix: "★",
      label: "Average client satisfaction on delivery quality",
    },
    {
      end: 24,
      suffix: "/7",
      label: "Global team coverage across time zones",
    },
  ],
} as const;

export type ServicePromo = {
  name: string;
  teaser: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const services: ServicePromo[] = [
  {
    name: "AI Product Development",
    teaser:
      "Wipuu Labs helps companies design, build, and optimize AI-powered products, assistants, and workflows. Turn AI into real business impact with a strategy-first approach.",
    description:
      "We help organizations turn AI into real products, workflows, and systems that drive measurable outcomes. From defining high-impact opportunities to designing experiences and building scalable solutions, our approach ensures AI is applied with purpose.",
    href: "#contact",
    icon: Bot,
  },
  {
    name: "Product Strategy Consulting",
    teaser:
      "The strongest products start with the right plan. Our strategy work helps teams clarify their vision, validate ideas early, and prioritize what will actually move the needle, before investing in full-scale development.",
    description:
      "The strongest products start with the right plan. Our strategy work helps teams clarify their vision, validate ideas early, and prioritize what will actually move the needle—before investing in full-scale development.",
    href: "#contact",
    icon: Layers,
  },
  {
    name: "UI/UX Design",
    teaser:
      "We turn functionality into intuitive, compelling user experiences. Through research, design systems, and thoughtful interactions, we help you shape products that are not only easy to use, but built to last.",
    description:
      "We turn functionality into intuitive, compelling user experiences. Through research, design systems, and thoughtful interactions, we help you shape products that are not only easy to use, but built to last.",
    href: "#contact",
    icon: Palette,
  },
  {
    name: "App & Software Development",
    teaser:
      "You've built something that works—now let's make it something people truly want to use. We develop scalable mobile, web, and custom software products with a clear focus on usability, performance, and long-term growth.",
    description:
      "You've built something that works—now let's make it something people truly want to use. We develop scalable mobile, web, and custom software products with a clear focus on usability, performance, and long-term growth.",
    href: "#contact",
    icon: Smartphone,
  },
];

export type WhyChooseItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const whyChooseUs: WhyChooseItem[] = [
  {
    title: "Full-stack + AI expertise",
    description:
      "Traditional product engineering paired with practical AI—chatbots, scoring, summaries, and workflow automation.",
    icon: Sparkles,
  },
  {
    title: "Global remote team",
    description:
      "Vetted specialists across design, frontend, backend, and DevOps working seamlessly across time zones.",
    icon: Globe,
  },
  {
    title: "Strategic packages",
    description:
      "From MVP launchpads to dedicated squads—engagement models that match your stage and budget.",
    icon: Code2,
  },
  {
    title: "Proven track record",
    description:
      "Trusted by startups and scale-ups in North America, Europe, and the Gulf for on-time, high-quality delivery.",
    icon: Cpu,
  },
];

export const testimonials = [
  {
    quote:
      "Wipuu Labs delivered our MVP in four weeks with an AI intake flow that immediately improved lead quality. Professional from kickoff to launch.",
    name: "Amara Cole",
    role: "Founder, BrightPath Health",
  },
  {
    quote:
      "They modernized our stack and automated manual ops work. Our team ships faster and spends less time on repetitive tasks.",
    name: "Jonas Reed",
    role: "COO, Northstar Logistics",
  },
  {
    quote:
      "Clear communication, strong design, and engineering we could trust. They felt like an extension of our product team.",
    name: "Mira Patel",
    role: "VP Growth, Elevate Studio",
  },
] as const;

export const faqs = [
  {
    question: "What types of projects do you take on?",
    answer:
      "We specialize in web and mobile applications, AI-powered features, cloud migrations, UI/UX design, and workflow automation. Engagements range from focused MVPs to long-term product squads.",
  },
  {
    question: "How do you price engagements?",
    answer:
      "Most work is scoped as fixed-price packages (MVP, integration, migration) or monthly squad retainers. After a short discovery call we provide a clear proposal with milestones and deliverables.",
  },
  {
    question: "What is your typical timeline?",
    answer:
      "MVPs often ship in 2–6 weeks depending on scope. Larger platforms are delivered in phased releases so you can validate value early and adjust roadmap with us.",
  },
  {
    question: "Do you work with existing teams?",
    answer:
      "Yes. We frequently collaborate with in-house engineers and designers, joining your tools, ceremonies, and code review process while filling skill gaps where needed.",
  },
  {
    question: "How do we get started?",
    answer:
      "Use the contact section or AI chat to share your goals, budget range, and timeline. We respond within one business day with next steps and availability.",
  },
] as const;

export const contact = {
  title: "Ready to build something exceptional?",
  description:
    "Tell us about your product, timeline, and goals. No commitment required—we will follow up with a tailored plan and honest fit assessment.",
  channels: [
    {
      label: "Email" as const,
      value: site.email,
      note: "We respond within 24 hours",
      href: `mailto:${site.email}`,
    },
    {
      label: "Phone" as const,
      value: site.phone,
      note: "For urgent or scheduled calls",
      href: `tel:${site.phone.replace(/\D/g, "")}`,
    },
  ],
};
