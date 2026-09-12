"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachSnap } from "@/lib/lenis";

/**
 * Boxes are % of the 1440x919 Figma frame. Rotations were measured off the
 * exported cards rather than guessed — the tilt alternates, and it is the
 * whole character of the block.
 */
const STEPS = [
  {
    n: "Step №1",
    copy: "Sign up in 2 minutes",
    bg: "var(--color-step-1)",
    box: { left: "51.3%", top: "33.7%", width: "33%", height: "20.6svh" },
    rotate: -3.61,
  },
  {
    n: "Step №2",
    copy: "Fund your account",
    bg: "var(--color-step-2)",
    box: { left: "52.6%", top: "41.9%", width: "33%", height: "23.4svh" },
    rotate: 2.89,
  },
  {
    n: "Step №3",
    copy: "Trade with real-time AI guidance",
    bg: "var(--color-step-3)",
    box: { left: "52%", top: "54%", width: "33.2%", height: "27.9svh" },
    rotate: -2.64,
  },
] as const;

/**
 * The three frames are cropped differently in Figma and the man is ~17%
 * larger in step3, so placing them at their mockup coordinates makes him jump.
 * These widths and offsets were derived by measuring his torso in each source
 * image and solving for a common centre and scale — he now stays put and only
 * the gesture changes.
 */
const CHARACTERS = [
  { src: "/img/step1.webp", left: "13.1%", width: "46.9%", alt: "Hand showing one finger" },
  { src: "/img/step2.webp", left: "14.7%", width: "44.5%", alt: "Hand showing two fingers" },
  { src: "/img/step3.webp", left: "17.9%", width: "44.8%", alt: "Hand showing three fingers" },
] as const;

export function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    let detachSnap = () => {};

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
          const chars = gsap.utils.toArray<HTMLElement>("[data-char]", el);
          const giant = el.querySelector<HTMLElement>("[data-giant]");
          const confetti = el.querySelector<HTMLElement>("[data-confetti]");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=200%",
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          // Figma moves the giant word x -29 -> -543 -> -1086 across the three
          // frames; as a share of its own width that is -1.1% -> -43%.
          if (giant) {
            tl.fromTo(
              giant,
              { xPercent: -1.1 },
              { xPercent: -43, ease: "none", duration: 2 },
              0,
            );
          }

          for (let i = 1; i < STEPS.length; i++) {
            const at = i - 1;

            // Cards rise into place from just below the fold. No fade: they
            // enter from outside the frame, so there is nothing to fade in.
            // Visibility flips instantly at the start of the slide — the card
            // is off-screen at that instant, so the flip is never seen. (It
            // starts hidden in markup only to avoid a flash before GSAP runs.)
            tl.set(cards[i], { visibility: "visible" }, at);
            tl.fromTo(
              cards[i],
              { y: () => window.innerHeight - cards[i].offsetTop },
              { y: 0, duration: 1, ease: "power2.out" },
              at,
            );

            // Gesture change is a cut, not a dissolve — a cross-fade here
            // shows two hands at once and reads as a glitch.
            tl.set(chars[i - 1], { autoAlpha: 0 }, at + 0.5);
            tl.set(chars[i], { autoAlpha: 1 }, at + 0.5);
          }

          if (confetti) {
            tl.set(confetti, { autoAlpha: 1 }, 1.5);
          }

          if (tl.scrollTrigger) {
            detachSnap = attachSnap(tl.scrollTrigger, STEPS.length - 1);
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
      aria-labelledby="how-title"
    >
      {/* ---- desktop / tablet ---- */}
      <div className="relative hidden h-svh md:block">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-0 flex items-center">
          <span
            data-giant
            aria-hidden
            className="font-display text-[27.2vw] leading-none font-extrabold whitespace-nowrap text-[#121212]"
          >
            How it works
          </span>
        </div>

        <h2
          id="how-title"
          className="absolute inset-x-0 top-[9.4%] z-30 text-center text-[clamp(1rem,1.4vw,1.25rem)] text-gold"
        >
          How it works
        </h2>

        {CHARACTERS.map((c, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={c.src}
            data-char
            src={c.src}
            alt={c.alt}
            loading="lazy"
            decoding="async"
            className="absolute bottom-0 z-10 h-auto object-contain"
            style={{
              left: c.left,
              width: c.width,
              ...(i === 0 ? {} : { opacity: 0, visibility: "hidden" }),
            }}
          />
        ))}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-confetti
          src="/img/confeti-1.webp"
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 z-20 size-full object-cover"
          style={{ opacity: 0, visibility: "hidden" }}
        />

        {/* Wrapper carries position + tilt; the inner card is what GSAP moves.
            They cannot share an element — GSAP overwrites `transform`. */}
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className="absolute z-30"
            style={{
              left: s.box.left,
              top: s.box.top,
              width: s.box.width,
              transform: `rotate(${s.rotate}deg)`,
            }}
          >
            <article
              data-card
              className="grid content-center rounded-[1.4rem] px-[7%]"
              style={{
                minHeight: s.box.height,
                background: s.bg,
                color: "#ffffff",
                ...(i === 0 ? {} : { visibility: "hidden" }),
              }}
            >
              <div className="flex items-baseline gap-[9%]">
                <h3 className="shrink-0 font-display text-[clamp(1.05rem,2.1vw,1.9rem)] leading-none font-extrabold">
                  {s.n}
                </h3>
                <p className="text-[clamp(0.85rem,1.9vw,1.7rem)] leading-snug">
                  {s.copy}
                </p>
              </div>
            </article>
          </div>
        ))}
      </div>

      {/* ---- mobile: the three cards simply stack, as drawn ---- */}
      <div className="md:hidden">
        <h2 className="py-10 text-center text-base text-gold">How it works</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/step3.webp"
          alt="Hand showing three fingers"
          loading="lazy"
          decoding="async"
          className="mx-auto w-full max-w-[22rem]"
        />
        <div className="-mt-8 flex flex-col gap-3 px-4 pb-14">
          {STEPS.map((s) => (
            <article
              key={s.n}
              className="rounded-2xl px-5 py-5"
              style={{ background: s.bg, color: "#ffffff", transform: `rotate(${s.rotate}deg)` }}
            >
              <div className="flex items-baseline gap-4">
                <h3 className="shrink-0 font-display text-base leading-none font-extrabold">
                  {s.n}
                </h3>
                <p className="text-sm leading-relaxed">{s.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
