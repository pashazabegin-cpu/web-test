import Image from "next/image";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ParallaxScene } from "@/components/ui/parallax-scene";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";

export function Hero() {
  return (
    /* Figma hero is 1440x1073 — taller than a typical viewport on purpose, so
       the CTA rides just into the fold rather than sitting fully above it, and
       the parallax has somewhere to travel. Height is locked to the design
       ratio (1073/1440) instead of being squeezed into 100vh. */
    <section className="relative min-h-svh overflow-hidden md:h-[74.5vw]">
      {/* Header lives only in the hero in the design, so it is not sticky. */}
      <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-[1.4%] md:py-[3.2%]">
        <Image
          src="/img/logo.webp"
          alt="Tridal"
          width={399}
          height={132}
          priority
          className="h-7 w-auto md:h-9"
        />
        <ShinyButton size="sm" href="#signup">
          Start free
        </ShinyButton>
      </header>

      <ParallaxScene
        className="h-full min-h-svh"
        start="top top"
        end="bottom top"
        anchor="start"
      >
        {/* 1 — glow, furthest back */}
        <div
          data-depth="1"
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
        >
          <Image
            src="/img/bg-1.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-125 object-cover object-center opacity-60"
          />
        </div>

        {/* 2 — the cast, anchored to the bottom edge like the Figma frame.
            Still the flat composite: two of the seven figures have no cut-out
            yet. When they arrive, replace this single node with seven
            [data-depth] figures — nothing else in this file changes.
            srcset is hand-built from the 3288px original found in Figma; the
            files are already webp, so next/image is bypassed on purpose. */}
        {/* Outer div owns the layout transform (centring); the inner img owns
            the GSAP one. They cannot share an element — GSAP writes `transform`
            directly and would wipe out the Tailwind translate. */}
        <div className="pointer-events-none absolute left-1/2 top-[8%] z-10 w-full min-w-[45rem] max-w-none -translate-x-1/2 select-none md:top-[-3.1%] md:w-[102.8%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-depth="2"
            src="/img/key-1-1460.webp"
            srcSet="/img/key-1-768.webp 768w, /img/key-1-1100.webp 1100w, /img/key-1-1460.webp 1460w, /img/key-1-2200.webp 2200w, /img/key-1-2920.webp 2920w"
            sizes="100vw"
            width={1460}
            height={1068}
            alt="Tridal traders"
            fetchPriority="high"
            decoding="async"
            className="block w-full"
          />
        </div>

        {/* Scrim — the "Background shape" layer in Figma. Without it the mono
            copy sits straight on the photo and is unreadable. Not a parallax
            layer: it must stay welded to the bottom edge. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[55%] bg-gradient-to-t from-ink via-ink/85 to-transparent"
          aria-hidden
        />

        {/* Text column sits above the photo, as in the design. */}
        <div className="relative z-30 flex h-full min-h-svh flex-col justify-between px-5 pb-[7%] pt-24 md:pb-[11.4%] md:pt-[3.2%]">
          {/* 3 */}
          <h1
            data-depth="3"
            className="text-center text-[clamp(2.75rem,calc(6.489vw+19.67px),4.344rem)]"
          >
            <BlurTextEffect>Rade smarter</BlurTextEffect>
            <br />
            <BlurTextEffect delay={0.18}>With</BlurTextEffect>{" "}
            <span className="relative inline-block text-gold">
              <BlurTextEffect delay={0.24}>AI</BlurTextEffect>
              {/* Figma: 23px star against a 69.5px cap — 0.33em. Sized in em so
                  it tracks the clamped headline instead of needing breakpoints.
                  eslint-disable-next-line @next/next/no-img-element */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/star.webp"
                alt=""
                aria-hidden
                className="absolute -right-[0.22em] top-0 w-[0.34em] md:w-[0.28em]"
              />
            </span>{" "}
            <BlurTextEffect delay={0.27}>
              that&apos;s on your side.
            </BlurTextEffect>
          </h1>

          {/* 4 — nearest the viewer */}
          <div
            data-depth="4"
            className="flex flex-col items-center gap-7 md:gap-9"
          >
            <p className="max-w-[42ch] text-center text-[clamp(1.25rem,calc(2.036vw+12.37px),1.75rem)] leading-[1.3]">
              <BlurTextEffect>
                Open positions on stocks, crypto and forex in seconds — with
                insights that explain the market in plain language.
              </BlurTextEffect>
            </p>
            <ShinyButton href="#signup">Start trading free</ShinyButton>
          </div>
        </div>
      </ParallaxScene>
    </section>
  );
}
