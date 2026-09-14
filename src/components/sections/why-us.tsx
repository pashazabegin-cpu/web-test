"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachSnap } from "@/lib/lenis";
import {
  BlurTextEffect,
  replayBlurText,
} from "@/components/ui/blur-text-effect";

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

/**
 * Label opacity by distance from the active item, straight out of Figma
 * (1 / 0.2 / 0.1 / 0.05). It is a falloff, not an on/off state — the list
 * reads as receding into the dark rather than as one lit row.
 */
const DIM = [1, 0.2, 0.1, 0.05] as const;
const dim = (distance: number) => DIM[Math.min(distance, DIM.length - 1)];

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

            labels.forEach((label, j) => {
              tl.to(label, { opacity: dim(Math.abs(j - i)), duration: 1 }, at);
            });

            // Artwork swaps fast, and in the middle of the slide.
            //
            // These sprites are renders on their own dark ground, not
            // cut-outs, so every frame where both are partly visible is a
            // literal double exposure. The old tween ran for a full timeline
            // unit — one whole viewport of scroll — and spent nearly all of
            // it showing two objects at once, which is the dirt. Now the
            // outgoing one is gone before the incoming one is legible: 0.12
            // each, back to back, with 0.02 of overlap to keep it from
            // reading as a hard cut.
            //
            // The scale is gone from the outgoing frame too — a sprite that
            // shrinks while it dissolves smears rather than leaves.
            tl.to(
              objects[i - 1],
              { autoAlpha: 0, duration: 0.12, ease: "power1.in" },
              at + 0.4,
            );
            tl.fromTo(
              objects[i],
              { autoAlpha: 0, scale: 1.02 },
              { autoAlpha: 1, scale: 1, duration: 0.12, ease: "power1.out" },
              at + 0.5,
            );

            // Copy brackets the swap — out just before, in just after — so
            // the two reads never overlap. onStart, not a standalone call, so
            // the letters only re-blur on the way in: all four copy blocks are
            // in the viewport the whole time, so their own observers can never
            // tell which one is the live state.
            tl.to(copies[i - 1], { autoAlpha: 0, duration: 0.15 }, at + 0.3);
            tl.to(
              copies[i],
              {
                autoAlpha: 1,
                duration: 0.15,
                onStart: () => replayBlurText(copies[i]),
              },
              at + 0.55,
            );
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
          className="absolute inset-x-0 top-[9.4%] z-20 text-center text-[2.8125rem] leading-[1.198] font-extrabold text-gold optical-ui"
        >
          <BlurTextEffect>Why as?</BlurTextEffect>
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
                className="flex h-[13vh] items-center font-display text-[clamp(1.75rem,3.82vw,3.44rem)] leading-[1.198] font-extrabold"
                style={{ opacity: dim(i) }}
              >
                <BlurTextEffect>{f.label}</BlurTextEffect>
              </li>
            ))}
          </ul>
        </div>

        {/* supporting copy */}
        <div className="absolute right-[6%] top-[40.9%] z-10 flex h-[13vh] w-[24%] items-center">
          {FEATURES.map((f, i) => (
            <p
              key={f.label}
              data-copy
              className="absolute text-[clamp(0.9rem,1.95vw,1.75rem)] leading-[1.4]"
              style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
            >
              <BlurTextEffect>{f.copy}</BlurTextEffect>
            </p>
          ))}
        </div>
      </div>

      {/* ---- mobile: four plain blocks, exactly as drawn ---- */}
      <div className="md:hidden">
        <h2 className="py-10 text-center text-[2.1875rem] leading-[1.198] font-extrabold text-gold optical-ui">
          <BlurTextEffect>Why as?</BlurTextEffect>
        </h2>
        <ul>
          {FEATURES.map((f) => (
            <li key={f.label} className="pb-14">
              <h3 className="text-center text-[clamp(1.875rem,calc(1.272vw+25.23px),2.1875rem)] leading-[1.198]">
                <BlurTextEffect>{f.label}</BlurTextEffect>
              </h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.img}
                alt={f.alt}
                loading="lazy"
                decoding="async"
                className="mx-auto w-full max-w-[23rem]"
              />
              <p className="mx-auto max-w-[22rem] px-5 text-center text-[clamp(1.25rem,calc(2.036vw+12.37px),1.75rem)] leading-[1.3]">
                <BlurTextEffect>{f.copy}</BlurTextEffect>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
