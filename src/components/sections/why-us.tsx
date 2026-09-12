"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachSnap } from "@/lib/lenis";

const FEATURES = [
  {
    label: "Speed",
    copy: "Order execution under 0.1s",
    img: "/img/speed-1.webp",
    alt: "Golden rocket",
  },
  {
    label: "AI insight",
    copy: "Personalized AI trading signals",
    img: "/img/speed-1-1.webp",
    alt: "Golden robot",
  },
  {
    label: "Transparency",
    copy: "Spreads from 0.0 pips, no hidden fees",
    img: "/img/speed-1-2.webp",
    alt: "Golden padlock",
  },
  {
    label: "Accessibility",
    copy: "Start with $10, withdrawals in minutes",
    img: "/img/speed-1-3.webp",
    alt: "Golden coin",
  },
] as const;

/** Vertical rhythm of the label list, as a share of the pinned viewport. */
const STEP = 0.13;

export function WhyUs() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    let detachSnap = () => {};

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop/tablet only. On mobile the design abandons the state machine
      // and lays the four out as plain stacked blocks, so there is nothing
      // to drive.
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const list = el.querySelector<HTMLElement>("[data-list]");
          const labels = gsap.utils.toArray<HTMLElement>("[data-label]", el);
          const objects = gsap.utils.toArray<HTMLElement>("[data-object]", el);
          const copies = gsap.utils.toArray<HTMLElement>("[data-copy]", el);
          if (!list) return;

          const step = () => window.innerHeight * STEP;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              // one viewport of scroll per transition, three transitions
              end: "+=300%",
              pin: true,
              pinSpacing: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          for (let i = 1; i < FEATURES.length; i++) {
            const at = i - 1;

            // The list slides so the active label always lands on the same
            // line — it is the list that moves, not a highlight.
            tl.to(
              list,
              { y: () => -i * step(), duration: 1, ease: "power2.inOut" },
              at,
            );

            tl.to(labels[i - 1], { color: "#333333", duration: 1 }, at);
            tl.to(labels[i], { color: "#ffffff", duration: 1 }, at);

            tl.to(
              objects[i - 1],
              { autoAlpha: 0, scale: 0.94, duration: 1, ease: "power2.inOut" },
              at,
            );
            tl.fromTo(
              objects[i],
              { autoAlpha: 0, scale: 1.06 },
              { autoAlpha: 1, scale: 1, duration: 1, ease: "power2.inOut" },
              at,
            );

            // Copy swaps a touch quicker than the artwork so the two reads
            // never overlap into mush.
            tl.to(copies[i - 1], { autoAlpha: 0, duration: 0.45 }, at);
            tl.to(copies[i], { autoAlpha: 1, duration: 0.45 }, at + 0.5);
          }

          // Settle on whole states so the scroll never rests mid-crossfade.
          if (tl.scrollTrigger) {
            detachSnap = attachSnap(tl.scrollTrigger, FEATURES.length - 1);
          }
        },
      );
    }, root);

    return () => {
      detachSnap();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-x-clip bg-ink md:h-svh"
      aria-labelledby="why-us-title"
    >
      {/* ---- desktop / tablet: pinned state machine ---- */}
      <div className="relative hidden h-svh md:block">
        <h2
          id="why-us-title"
          className="absolute inset-x-0 top-[9.4%] text-center text-[clamp(1rem,1.4vw,1.25rem)] text-gold"
        >
          Why as?
        </h2>

        {/* artwork — one stacked sprite per feature */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative aspect-[1015/826] w-[70vw] max-w-[63rem]">
            {FEATURES.map((f, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={f.label}
                data-object
                src={f.img}
                alt={f.alt}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 size-full object-contain"
                style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
              />
            ))}
          </div>
        </div>

        {/* Label list. Not masked: the design keeps every item on screen,
            dimmed to #333, and slides the whole column so the active one
            always lands on the same line. Items that pass above it stay
            visible — only the last state pushes "Speed" off the top. */}
        <div className="absolute left-[6.7%] top-[40.9%] z-10 w-[40%]">
          <ul data-list className="will-change-transform">
            {FEATURES.map((f, i) => (
              <li
                key={f.label}
                data-label
                className="flex h-[13vh] items-center font-display text-[clamp(1.75rem,3.7vw,3.3rem)] leading-none font-extrabold"
                style={{ color: i === 0 ? "#ffffff" : "#333333" }}
              >
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        {/* supporting copy */}
        <div className="absolute right-[6%] top-[43.7%] z-10 w-[24%]">
          {FEATURES.map((f, i) => (
            <p
              key={f.label}
              data-copy
              className="col-start-1 row-start-1 text-[clamp(0.9rem,1.45vw,1.3rem)] leading-relaxed [grid-area:1/1]"
              style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
            >
              {f.copy}
            </p>
          ))}
        </div>
      </div>

      {/* ---- mobile: four plain blocks, exactly as drawn ---- */}
      <div className="md:hidden">
        <h2 className="py-10 text-center text-base text-gold">Why as?</h2>
        <ul>
          {FEATURES.map((f) => (
            <li key={f.label} className="pb-14">
              <h3 className="text-center text-2xl">{f.label}</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.img}
                alt={f.alt}
                loading="lazy"
                decoding="async"
                className="mx-auto w-full max-w-[23rem]"
              />
              <p className="mx-auto max-w-[22rem] px-5 text-center leading-relaxed">
                {f.copy}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
