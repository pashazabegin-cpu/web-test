"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachSnap } from "@/lib/lenis";
import {
  BlurTextEffect,
  replayBlurText,
} from "@/components/ui/blur-text-effect";

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
    box: { left: "51.6%", top: "33.7%", width: "32.43%", height: "17.4svh" },
    rotate: -3.56,
  },
  {
    n: "Step №2",
    copy: "Fund your account",
    bg: "var(--color-step-2)",
    box: { left: "52.9%", top: "41.9%", width: "32.43%", height: "20.9svh" },
    rotate: 2.89,
  },
  {
    n: "Step №3",
    copy: "Trade with real-time AI guidance",
    bg: "var(--color-step-3)",
    box: { left: "52.4%", top: "54%", width: "32.43%", height: "25.6svh" },
    rotate: -2.64,
  },
] as const;

/**
 * The same three cards as they are drawn on mobile (Figma frame 3:3).
 *
 * Not derived from the desktop numbers: the mockup gives them their own
 * tilts (-0.89 / +2.79 / -2.83 against desktop's -3.56 / +2.89 / -2.64), one
 * shared width of 403.4 on a 375 frame — so they bleed off both edges — and
 * heights that grow with the length of the copy. Positions are the centre of
 * each card inside a 375x462 block whose origin is the first card's top.
 */
const MOBILE_CARDS = [
  { cx: "47.893%", cy: "15.634%", h: "36.856cqw", rotate: -0.89 },
  { cx: "50.173%", cy: "46.082%", h: "44.458cqw", rotate: 2.79 },
  { cx: "50.555%", cy: "76.078%", h: "53.671cqw", rotate: -2.83 },
] as const;

/**
 * Placement of the three gesture frames.
 *
 * Horizontal position comes from correlating the silhouette width-profile of
 * each source against step1, searching over scale and vertical offset: all
 * three are drawn at effectively the same scale (step3 differs by 1%), and
 * step3 simply sits ~108px lower in its own canvas because the party hat
 * needs headroom. An earlier attempt measured torso width at the bottom row,
 * which the confetti in step3 corrupted — that produced a bogus "17% larger".
 *
 * SIZE is a height, not a width, and that is the whole point. These were
 * sized as a share of the viewport WIDTH while the heading is placed at 9.4%
 * of its HEIGHT, so the two drifted apart with the window's aspect: correct at
 * the design's 1440x919 (1.567), but on any real laptop — 1512x860 is 1.758 —
 * the figure grew tall enough to put his head straight through the title, and
 * past 1.97 the head left the top of the frame entirely.
 *
 * min() keeps the design exact at the design aspect and only ever shrinks:
 * the first term is the figure's height as a share of the frame, the second
 * is the height its Figma width would give. On a 1440x919 frame they are the
 * same number, so nothing moves; on a shorter frame the first term wins and
 * the head stays at 18% of the height, clear of the title's 15.3% baseline.
 * On a narrow, tall window the second wins and he cannot overflow sideways.
 */
const CHARACTERS = [
  {
    src: "/img/step1.webp",
    left: "13.12%",
    height: "min(89.35%, 57.02vw)",
    nw: 675,
    nh: 821,
    alt: "Hand showing one finger",
  },
  {
    src: "/img/step2.webp",
    left: "14.25%",
    height: "min(89.34%, 57.02vw)",
    nw: 632,
    nh: 821,
    alt: "Hand showing two fingers",
  },
  {
    // 100%, not 100.99%: Figma puts step3's box at y=0, and the export is
    // clipped to the frame, so a full-height figure is exactly the design.
    src: "/img/step3.webp",
    left: "13.80%",
    height: "min(100%, 64.45vw)",
    nw: 753,
    nh: 919,
    alt: "Hand showing three fingers",
  },
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
          const chars = gsap.utils.toArray<HTMLElement>("img[data-char]", el);
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
              {
                y: 0,
                duration: 1,
                ease: "power2.out",
                // The card is in the viewport from the moment the section is,
                // just parked below the fold, so its own observer cannot tell
                // when it arrives. Re-blur the text as it rises.
                onStart: () => replayBlurText(cards[i]),
              },
              at,
            );

            // Gesture change is a cut, not a dissolve — a cross-fade here
            // shows two hands at once and reads as a glitch.
            tl.set(chars[i - 1], { autoAlpha: 0 }, at + 0.5);
            tl.set(chars[i], { autoAlpha: 1 }, at + 0.5);
          }

          if (confetti) {
            // Confetti is its own plane, not something pinned to the man: it
            // drifts across the whole pinned timeline at its own rate, so by
            // the time it is revealed it is already in motion rather than
            // popping in dead still. Runs behind the visibility cut on
            // purpose — the drift is continuous, only the reveal is a cut.
            tl.fromTo(
              confetti,
              { yPercent: -6, xPercent: 7, scale: 1.1 },
              {
                yPercent: 5,
                xPercent: -7,
                scale: 1,
                ease: "none",
                duration: 2,
              },
              0,
            );
            tl.set(confetti, { autoAlpha: 1 }, 1.5);
          }

          // Pointer response lives on the wrapper, the scroll drift on the
          // image inside it — GSAP owns `transform` outright on whatever it
          // animates, so the two cannot share an element.
          let stopPointer: (() => void) | undefined;
          const wrap = el.querySelector<HTMLElement>("[data-confetti-wrap]");

          // Skip on touch: there is no hover there, and the listener would
          // only fire on taps.
          if (wrap && window.matchMedia("(pointer: fine)").matches) {
            const toX = gsap.quickTo(wrap, "x", { duration: 1.1, ease: "power3" });
            const toY = gsap.quickTo(wrap, "y", { duration: 1.1, ease: "power3" });

            const onMove = (e: PointerEvent) => {
              toX((e.clientX / window.innerWidth - 0.5) * 56);
              toY((e.clientY / window.innerHeight - 0.5) * 30);
            };

            window.addEventListener("pointermove", onMove, { passive: true });
            stopPointer = () =>
              window.removeEventListener("pointermove", onMove);
          }

          if (tl.scrollTrigger) {
            detachSnap = attachSnap(tl.scrollTrigger, STEPS.length - 1);
          }

          return () => stopPointer?.();
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
          className="absolute inset-x-0 top-[9.4%] z-30 text-center text-[2.8125rem] leading-[1.198] font-extrabold text-gold optical-ui"
        >
          <BlurTextEffect>How it works</BlurTextEffect>
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
            width={c.nw}
            height={c.nh}
            className="absolute bottom-0 z-10 w-auto max-w-none"
            style={{
              left: c.left,
              height: c.height,
              ...(i === 0 ? {} : { opacity: 0, visibility: "hidden" }),
            }}
          />
        ))}

        {/* Figma's "Background shape": a plain linear ramp, clear until 67.5%
            of the frame and only fully black as it passes the bottom edge.
            Deliberately no solid band and no extra midpoint stop — those are
            what made the earlier version far too heavy. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[67.5%] z-[15] h-[33.3%] bg-gradient-to-b from-transparent to-ink"
          aria-hidden
        />

        {/* Sits BELOW the scrim (z-15), not above it. Above it, the confetti
            was the one layer the bottom gradient never reached, so it ended in
            a hard horizontal cut at the section edge while the character faded
            out properly. Underneath, it dissolves on the same ramp he does. */}
        <div
          data-confetti-wrap
          className="pointer-events-none absolute inset-0 z-[12]"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-confetti
            src="/img/confeti-1.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full scale-110 object-cover"
            style={{ opacity: 0, visibility: "hidden" }}
          />
        </div>

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
              className="grid content-center rounded-[20px] px-[7%]"
              style={{
                minHeight: s.box.height,
                background: s.bg,
                color: "#ffffff",
                ...(i === 0 ? {} : { visibility: "hidden" }),
              }}
            >
              <div className="flex items-baseline gap-[9%]">
                <h3 className="shrink-0 font-display text-[clamp(1.05rem,2.1vw,1.9rem)] leading-none font-extrabold optical-ui">
                  <BlurTextEffect>{s.n}</BlurTextEffect>
                </h3>
                <p className="text-[clamp(0.85rem,1.9vw,1.7rem)] leading-snug">
                  <BlurTextEffect>{s.copy}</BlurTextEffect>
                </p>
              </div>
            </article>
          </div>
        ))}
      </div>

      {/* ---- mobile: Figma frame 3:3, y 2633..3197 of a 375-wide frame ----

           Two structural differences from desktop, both from the mockup and
           neither guessable from it: there is NO character here — the three
           cards carry the block on their own — and the cards are full-bleed,
           each wider than the screen and overlapping the one above, so the
           stack reads as a pile rather than a list.

           Every card is the same 403.4x? at the same 17.276 radius; only the
           height, tilt and colour change. Sized in cqw against the block so
           the pile scales with the screen instead of breaking up. */}
      <div className="md:hidden">
        <h2 className="px-5 pt-14 pb-10 text-center text-[2.1875rem] leading-[1.198] font-extrabold text-gold optical-ui">
          <BlurTextEffect>How it works</BlurTextEffect>
        </h2>

        <div className="@container relative aspect-[375/462] w-full">
          {MOBILE_CARDS.map((c, i) => (
            /* Wrapper owns the tilt, so the card itself keeps a clean box. */
            <div
              key={STEPS[i].n}
              className="absolute"
              style={{
                left: c.cx,
                top: c.cy,
                width: "107.573cqw",
                height: c.h,
                transform: `translate(-50%, -50%) rotate(${c.rotate}deg)`,
              }}
            >
              <article
                className="grid size-full content-center px-[8.9%]"
                style={{
                  background: STEPS[i].bg,
                  color: "#ffffff",
                  borderRadius: "4.607cqw",
                }}
              >
                <div className="flex items-center gap-[9%] text-[6.45cqw]">
                  <h3 className="shrink-0 font-display leading-none font-extrabold optical-ui">
                    <BlurTextEffect>{STEPS[i].n}</BlurTextEffect>
                  </h3>
                  <p className="w-[44.11%] shrink-0 leading-[1.4]">
                    <BlurTextEffect>{STEPS[i].copy}</BlurTextEffect>
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
