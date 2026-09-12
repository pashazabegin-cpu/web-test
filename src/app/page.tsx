import { Hero } from "@/components/sections/hero";
import { WhyUs } from "@/components/sections/why-us";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Trust } from "@/components/sections/trust";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <HowItWorks />
      <Trust />
    </>
  );
}
