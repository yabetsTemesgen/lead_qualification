import { LeadChatWidget } from "@/components/chat/lead-chat-widget";
import { LocomotiveScrollProvider } from "@/components/landing/locomotive-scroll-provider";
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
    <LocomotiveScrollProvider>
      <div className="relative min-h-screen bg-slate-950 text-slate-100">
        <PageBackground />
        <SiteHeader />
        <main className="relative pt-18">
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
    </LocomotiveScrollProvider>
  );
}
