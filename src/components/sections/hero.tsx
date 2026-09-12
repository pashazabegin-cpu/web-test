import Image from "next/image";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ParallaxScene } from "@/components/ui/parallax-scene";

export function Hero() {
  return (
    /* The Figma hero is 1440x1241 — deliberately taller than a viewport, which
       is also what gives the parallax somewhere to travel. Height is therefore
       locked to the design ratio on desktop rather than squeezed into 100vh. */
    <section className="relative min-h-svh overflow-hidden md:h-[86.2vw]">
      {/* Header lives only in the hero in the design, so it is not sticky. */}
      <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4">
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
        <div className="pointer-events-none absolute left-1/2 top-[8%] z-10 w-full min-w-[45rem] max-w-none -translate-x-1/2 select-none md:top-[6.2%]">
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
        <div className="relative z-30 flex h-full min-h-svh flex-col justify-between px-5 pb-[7%] pt-24 md:pt-[10.8%]">
          {/* 3 */}
          <h1
            data-depth="3"
            className="text-center text-[clamp(2rem,5.6vw,4.35rem)]"
          >
            Rade smarter
            <br />
            With{" "}
            <span className="relative inline-block text-gold">
              AI
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
            that&apos;s on your side.
          </h1>

          {/* 4 — nearest the viewer */}
          <div
            data-depth="4"
            className="flex flex-col items-center gap-7 md:gap-9"
          >
            <p className="max-w-[42ch] text-center text-[clamp(0.9rem,1.45vw,1.3rem)] leading-relaxed">
              Open positions on stocks, crypto and forex in seconds — with
              insights that explain the market in plain language.
            </p>
            <ShinyButton href="#signup">Start trading free</ShinyButton>
          </div>
        </div>
      </ParallaxScene>
    </section>
  );
}
