import Image from "next/image";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ParallaxScene } from "@/components/ui/parallax-scene";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink">
      <ParallaxScene className="min-h-svh md:h-[63.8vw]">
        {/* glow, furthest back */}
        <div
          data-depth="1"
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
        >
          <Image
            src="/img/bg-1.webp"
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover object-right opacity-70 md:object-[70%_center]"
          />
        </div>

        {/* the chihuahua — right half in the design, bottom-anchored */}
        <div className="pointer-events-none absolute right-0 bottom-0 z-10 w-[75%] md:right-[5%] md:w-[46%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-depth="2"
            src="/img/dog-1.webp"
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="block w-full"
          />
        </div>

        {/* keeps the copy legible where it overlaps the artwork */}
        <div
          className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-ink via-ink/70 to-transparent md:via-ink/40"
          aria-hidden
        />

        <div className="relative z-30 flex min-h-svh flex-col justify-center gap-[6vh] px-5 md:h-full md:px-[9.4%]">
          <h2
            data-depth="3"
            className="max-w-[12ch] text-[clamp(2rem,4.9vw,4.2rem)] leading-[1.05]"
          >
            The market never stops.{" "}
            <span className="text-gold">Neither should you.</span>
          </h2>

          <div data-depth="4" className="self-start">
            <ShinyButton href="#signup">Open a free account</ShinyButton>
          </div>
        </div>

        {/* Regulatory small print sits outside the parallax: it must stay put
            and stay readable. */}
        <div className="relative z-30 flex flex-col-reverse items-start gap-8 px-5 pb-12 md:absolute md:inset-x-0 md:bottom-[8%] md:flex-row md:items-end md:justify-between md:px-[9.4%] md:pb-0">
          <p className="max-w-[46ch] text-[clamp(0.72rem,0.95vw,0.85rem)] leading-relaxed text-white/45">
            Trading with leverage carries a high level of risk and may not be
            suitable for all investors. Asset values can go down as well as up.
          </p>

          <Image
            src="/img/logo.webp"
            alt="Tridal"
            width={399}
            height={132}
            className="h-9 w-auto opacity-90"
          />
        </div>
      </ParallaxScene>
    </footer>
  );
}
