import { LeadChatWidget } from "@/components/chat/lead-chat-widget";
import { PageBackground, SiteFooter, SiteHeader } from "@/components/landing/shell";
import { ServicesSection } from "@/components/landing/services-section";
import {
  ContactSection,
  FaqSection,
  HeroSection,
  TestimonialsSection,
  WhyChooseUsSection,
} from "@/components/landing/sections";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <PageBackground />
      <SiteHeader />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <LeadChatWidget />
    </div>
  );
}
