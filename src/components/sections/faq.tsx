"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";

const QA = [
  { q: "How much to start?", a: "From $10." },
  {
    q: "Is it safe?",
    // TODO: the regulator's name is still a placeholder in the source copy
    // ("Licensed by [specify]") and the Figma licence number 123/45 is dummy
    // text. Awaiting the real details before this can ship.
    a: "Licensed and regulated, with segregated client accounts.",
  },
  {
    q: "What are AI signals?",
    a: "Real-time market insights, no guaranteed results.",
  },
  { q: "Withdrawal time?", a: "A few minutes to 24 hours." },
] as const;

/**
 * The FAQ is a curtain: it rides up over the Trust section, which stays put
 * underneath. Scoped to this one pair only — the rest of the page is ordinary
 * scroll — which is why the two live inside a shared wrapper. `sticky` only
 * holds within its own parent, so Trust releases by itself the moment the
 * wrapper ends, with nothing to switch off.
 *
 * Both sections are black, so the covering would be invisible on its own.
 * The rounded top edge, the hairline and the dimming of what is underneath
 * are what make the move readable.
 */
export function FaqCurtain({ under }: { under: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const beneath = el.querySelector<HTMLElement>("[data-beneath]");
        const curtain = el.querySelector<HTMLElement>("[data-curtain]");
        if (!beneath || !curtain) return;

        // Push the covered section back as it is covered — the depth cue that
        // black-on-black cannot give on its own.
        gsap.timeline({
          scrollTrigger: {
            trigger: curtain,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        }).fromTo(
          beneath,
          { scale: 1, filter: "brightness(1)" },
          { scale: 0.96, filter: "brightness(0.45)", ease: "none" },
        );
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrap} className="relative">
      <div data-beneath className="sticky top-0 z-0 origin-center">
        {under}
      </div>

      {/* Holds the covered section on screen for one viewport before the
          curtain starts. Without it the FAQ begins riding up the instant Trust
          reaches the top, so Trust never gets a plain scroll-through of its
          own and the curtain reads as starting in the previous section. */}
      <div className="h-svh" aria-hidden />

      <section
        data-curtain
        className="relative z-10 min-h-svh rounded-t-curtain border-t border-gold/20 bg-ink"
        aria-labelledby="faq-title"
      >
        <div className="mx-auto grid max-w-[80rem] gap-10 px-5 py-24 md:grid-cols-[1fr_2.4fr] md:gap-16 md:py-[14vh]">
          <h2
            id="faq-title"
            className="text-[2.1875rem] leading-[1.198] font-extrabold text-gold optical-ui md:text-[2.8125rem]"
          >
            <BlurTextEffect>Faq</BlurTextEffect>
          </h2>

          <Accordion
            type="single"
            collapsible
            className="text-[clamp(1.25rem,calc(2.036vw+12.37px),1.75rem)]"
          >
            {QA.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger>
                  <BlurTextEffect>{item.q}</BlurTextEffect>
                </AccordionTrigger>
                <AccordionContent>
                  <BlurTextEffect>{item.a}</BlurTextEffect>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
