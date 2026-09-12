import { Hero } from "@/components/sections/hero";
import { WhyUs } from "@/components/sections/why-us";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Trust } from "@/components/sections/trust";
import { FaqCurtain } from "@/components/sections/faq";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <HowItWorks />
      {/* Trust is passed in so it and the FAQ share one wrapper — that is what
          scopes the curtain to this single pair. */}
      <FaqCurtain under={<Trust />} />
      <SiteFooter />
    </>
  );
}
