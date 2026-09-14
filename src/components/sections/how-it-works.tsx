"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachSnap } from "@/lib/lenis";
import { cn } from "@/lib/utils";
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
    /* tablet (Figma 1:351, 768 frame) then desktop (1:52, 1440 frame).
       On tablet the pile sits UNDER the figure and is much wider; on
       desktop it sits beside him. */
    vars:
      "[--card-l:16.67%] [--card-t:50.5%] [--card-w:61.98%] [--card-h:15svh] lg:[--card-l:51.6%] lg:[--card-t:33.7%] lg:[--card-w:32.43%] lg:[--card-h:17.4svh]",
    rotate: -3.56,
  },
  {
    n: "Step №2",
    copy: "Fund your account",
    bg: "var(--color-step-2)",
    vars:
      "[--card-l:19.45%] [--card-t:56%] [--card-w:61.96%] [--card-h:17svh] lg:[--card-l:52.9%] lg:[--card-t:41.9%] lg:[--card-w:32.43%] lg:[--card-h:20.9svh]",
    rotate: 2.89,
  },
  {
    n: "Step №3",
    copy: "Trade with real-time AI guidance",
    bg: "var(--color-step-3)",
    vars:
      "[--card-l:18.31%] [--card-t:64.3%] [--card-w:62.23%] [--card-h:20svh] lg:[--card-l:52.4%] lg:[--card-t:54%] lg:[--card-w:32.43%] lg:[--card-h:25.6svh]",
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
    // tablet: hung from the title rather than the floor — the cards overlap
    // its lower third — and centred on the FIGURE, at the client's request.
    // The canvases differ, so centring the boxes would make him jump sideways
    // between frames. k = (figure centre as a share of canvas width) x
    // (canvas aspect), with the figure centre taken as the mean of head and
    // torso: that point lands within 3px across all three frames on desktop
    // (543 / 541 / 544), which is what makes it a trustworthy anchor.
    //
    // Vertically it hangs from the TITLE, not from the viewport. The title is
    // at 9.4% with a 53.91px line (45px x 1.198); Figma puts frames 1-2 flush
    // under that line — the hair lands 46px below it — and frame 3 starting
    // 5.2% of its own height above the title's top, which is why the party
    // hat runs behind the lettering in the mockup and should here too. A
    // plain 9.6% of the viewport put the hair 5px into the title line on a
    // 974x847 window once the figure was centred under it.
    // desktop: bottom-anchored, see the note above.
    vars:
      "[--char-l:calc(50%_-_var(--char-h)*0.4319)] [--char-t:calc(9.4%_+_53.91px)] [--char-b:auto] [--char-h:min(62svh,67.63vw)] lg:[--char-l:13.12%] lg:[--char-t:auto] lg:[--char-b:0] lg:[--char-h:min(89.35%,57.02vw)]",
    nw: 675,
    nh: 821,
    alt: "Hand showing one finger",
  },
  {
    src: "/img/step2.webp",
    vars:
      "[--char-l:calc(50%_-_var(--char-h)*0.4086)] [--char-t:calc(9.4%_+_53.91px)] [--char-b:auto] [--char-h:min(62svh,67.63vw)] lg:[--char-l:14.25%] lg:[--char-t:auto] lg:[--char-b:0] lg:[--char-h:min(89.34%,57.02vw)]",
    nw: 632,
    nh: 821,
    alt: "Hand showing two fingers",
  },
  {
    // the party hat needs headroom, so Figma 1:406 draws him larger again
    src: "/img/step3.webp",
    vars:
      "[--char-l:calc(50%_-_var(--char-h)*0.3760)] [--char-t:calc(9.4%_-_var(--char-h)*0.052)] [--char-b:auto] [--char-h:min(70svh,81.63vw)] lg:[--char-l:13.80%] lg:[--char-t:auto] lg:[--char-b:0] lg:[--char-h:min(100%,64.45vw)]",
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
    let detachSnapMobile = () => {};

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

      // ---- mobile: the same state machine, without the figure ----
      //
      // The mockup draws all three cards at rest, but the client asked for
      // the desktop behaviour here too, so the pile assembles itself as you
      // scroll. Nothing else from the desktop branch carries over: there is
      // no character to cut between and no giant word to pan, so this is
      // only the cards rising into their drawn positions.
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cards = gsap.utils.toArray<HTMLElement>("[data-mcard]", el);
          if (cards.length < 2) return;

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

          for (let i = 1; i < cards.length; i++) {
            const at = i - 1;

            // Flipped while the card is still a full screen below the fold,
            // so the flip itself is never seen. It starts hidden in markup to
            // avoid a flash before this effect runs.
            tl.set(cards[i], { visibility: "visible" }, at);
            tl.fromTo(
              cards[i],
              { y: () => window.innerHeight },
              {
                y: 0,
                duration: 1,
                ease: "power2.out",
                onStart: () => replayBlurText(cards[i]),
              },
              at,
            );
          }

          if (tl.scrollTrigger) {
            detachSnapMobile = attachSnap(tl.scrollTrigger, cards.length - 1);
          }
        },
      );

      // Neither branch runs when the reader has asked for less motion, and
      // the cards after the first are hidden in markup — so without this they
      // would simply never appear. Reveal them as the flat pile the mobile
      // mockup draws anyway.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(gsap.utils.toArray<HTMLElement>("[data-card], [data-mcard]", el), {
          visibility: "visible",
          autoAlpha: 1,
        });
        gsap.set(gsap.utils.toArray<HTMLElement>("img[data-char]", el), {
          autoAlpha: 1,
        });
      });
    }, root);

    return () => {
      detachSnap();
      detachSnapMobile();
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
            className="font-display text-[34.2vw] leading-none font-extrabold whitespace-nowrap text-[#121212] lg:text-[27.2vw]"
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
            className={cn(
              // Tablet only: the figure is hung from the title, so it ends
              // mid-screen where the section-wide ramp below is barely dark
              // yet, and read as a hard cut. Figma's tablet "Background
              // shape" (1:349) clears at 67.6% of the figure and is solid by
              // 95.4%; a mask on the figure reproduces that per frame, which a
              // single layer cannot — step3 is taller and ends lower.
              "absolute z-10 w-auto max-w-none [mask-image:linear-gradient(to_bottom,#000_67.6%,transparent_95.4%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_67.6%,transparent_95.4%)] lg:[mask-image:none] lg:[-webkit-mask-image:none]",
              c.vars,
            )}
            style={{
              left: "var(--char-l)",
              top: "var(--char-t)",
              bottom: "var(--char-b)",
              height: "var(--char-h)",
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
            className={cn("absolute z-30", s.vars)}
            style={{
              left: "var(--card-l)",
              top: "var(--card-t)",
              width: "var(--card-w)",
              transform: `rotate(${s.rotate}deg)`,
            }}
          >
            <article
              data-card
              className="grid content-center rounded-[20px] px-[7%]"
              style={{
                minHeight: "var(--card-h)",
                background: s.bg,
                color: "#ffffff",
                ...(i === 0 ? {} : { visibility: "hidden" }),
              }}
            >
              <div className="flex items-baseline gap-[9%]">
                <h3 className="shrink-0 font-display text-[clamp(1.75rem,2.1vw,2.2rem)] leading-none font-extrabold optical-ui">
                  <BlurTextEffect>{s.n}</BlurTextEffect>
                </h3>
                <p className="text-[clamp(1.75rem,1.9vw,2.2rem)] leading-[1.4]">
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
      <div className="flex h-svh flex-col justify-center md:hidden">
        <h2 className="px-5 pb-10 text-center text-[2.1875rem] leading-[1.198] font-extrabold text-gold optical-ui">
          <BlurTextEffect>How it works</BlurTextEffect>
        </h2>

        <div className="@container relative aspect-[375/462] w-full">
          {MOBILE_CARDS.map((c, i) => (
            /* Wrapper owns the tilt, so the card itself keeps a clean box. */
            /* Wrapper owns position and tilt; the card inside is what the
               timeline slides, since GSAP overwrites `transform` outright. */
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
                data-mcard
                className="grid size-full content-center px-[8.9%]"
                style={{
                  background: STEPS[i].bg,
                  color: "#ffffff",
                  borderRadius: "4.607cqw",
                  ...(i === 0 ? {} : { visibility: "hidden" as const }),
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
