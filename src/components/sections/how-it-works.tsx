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
 * Placement of the three gesture frames.
 *
 * Derived by correlating the silhouette width-profile of each source image
 * against step1, searching over scale and vertical offset. Result: all three
 * are drawn at effectively the same scale (step3 differs by 1%); step3 simply
 * sits ~108px lower in its own canvas because the party hat needs headroom.
 *
 * An earlier attempt measured torso width at the bottom row instead, which the
 * confetti in step3 corrupted — that produced a bogus "17% larger" and shrank
 * the third frame visibly. Widths below are within a whisker of the Figma
 * values; only the horizontal centring needed correcting.
 *
 * Vertical alignment needs no offsets: anchoring all three to the bottom edge
 * puts step1/step2 at y=98 and step3 at y=-9 on a 919px frame, which is what
 * the correlation asks for.
 */
const CHARACTERS = [
  { src: "/img/step1.webp", left: "13.12%", width: "46.88%", alt: "Hand showing one finger" },
  { src: "/img/step2.webp", left: "14.25%", width: "43.89%", alt: "Hand showing two fingers" },
  { src: "/img/step3.webp", left: "13.80%", width: "52.81%", alt: "Hand showing three fingers" },
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
