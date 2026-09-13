import Image from "next/image";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ParallaxScene } from "@/components/ui/parallax-scene";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";

/**
 * Figma frame 1:105 — 1440x919, the same frame size as every other block.
 * Desktop is laid out in those coordinates: the scene keeps the frame's
 * aspect, so every percentage below is a Figma number over 1440 or 919 and
 * nothing here is eyeballed. Type is sized in cqw against that same box.
 *
 * Two corrections, both from reading the frame instead of the export:
 *
 *  - `source/bg 1.png` (1075x919) and `source/dog 1.png` (804x919) are the
 *    frame-CLIPPED renders, not the fills the design references. The real
 *    fills are 3840x3851 and 1700x2640, and their aspects match the Figma
 *    boxes to within 0.05% — the design crops neither. Fitting the clipped
 *    exports with object-cover is what pushed the glow off the dog.
 *  - The scrim is a VERTICAL ramp that is still completely clear at 70% of
 *    the frame and only reaches 76% black at the bottom edge. What was here
 *    before was a full-height left-to-right wash, which is what read as far
 *    too much darkening.
 *
 * Glow and dog deliberately share depth 2 rather than sitting on 1 and 2.
 * The brief is that the glow stays centred on the dog, and adjacent depths
 * would slide them apart by ~50px vertically over the section's travel. They
 * move as one plane; the headline and the button still parallax against it.
 */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink">
      <ParallaxScene className="@container md:aspect-[1440/919]">
        {/* ---- desktop / tablet: the Figma frame, to the pixel ---- */}

        {/* glow — Figma "bg 1", 1177x1180 at (365,-15) */}
        <div
          data-depth="2"
          className="pointer-events-none absolute top-[-1.632%] left-[25.347%] z-0 hidden h-[128.400%] w-[81.736%] md:block"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/bg-1-full.webp"
            alt=""
            width={1024}
            height={1027}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </div>

        {/* the chihuahua — Figma "dog 1", 664x1030 at (616,50) */}
        <div
          data-depth="2"
          className="pointer-events-none absolute top-[5.441%] left-[42.778%] z-10 hidden h-[112.078%] w-[46.111%] md:block"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/dog-1-full.webp"
            alt=""
            width={1500}
            height={2329}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </div>

        {/* Scrim — Figma "Background shape", 1769x1026 at (-154,362). Figma
            sets mix-blend-multiply on it; with a pure-black source over a
            black page that is arithmetically identical to normal compositing,
            so it is left off rather than paying for an extra stacking context.
            Never a parallax layer: it is welded to the frame. */}
        <div
          className="pointer-events-none absolute top-[39.391%] left-[-10.694%] z-20 hidden h-[111.643%] w-[122.847%] md:block"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 27.651%, rgba(0,0,0,0.7) 48.014%, rgba(0,0,0,0.98) 76.566%)",
          }}
          aria-hidden
        />

        {/* Headline — 628 wide at (135,147), 69.508px on a 1.0 line. The four
            delays chain the runs into a single sweep down the block. */}
        <h2
          data-depth="3"
          className="absolute top-[15.996%] left-[9.375%] z-30 hidden w-[43.611%] text-[4.827cqw] leading-none md:block"
        >
          <BlurTextEffect>The market</BlurTextEffect>
          <br />
          <BlurTextEffect delay={0.15}>never stops.</BlurTextEffect>
          <br />
          <span className="text-gold">
            <BlurTextEffect delay={0.33}>Neither</BlurTextEffect>
            <br />
            <BlurTextEffect delay={0.44}>should you.</BlurTextEffect>
          </span>
        </h2>

        {/* CTA — the 441x125 halo's top-left corner is (114,565) */}
        <div
          data-depth="4"
          className="absolute top-[61.480%] left-[7.917%] z-30 hidden md:block"
        >
          <ShinyButton href="#signup">Open a free account</ShinyButton>
        </div>

        {/* Small print and logo stay out of the parallax — they have to sit
            still and stay readable. Disclaimer: 423 wide at (132,803), 14px
            at 40%. Logo box: 126x64 at (1182,798); the artwork is centred in
            that box rather than filling it, which is how Figma crops it. */}
        <p className="absolute top-[87.378%] left-[9.167%] z-30 hidden w-[29.375%] text-[max(0.75rem,0.972cqw)] leading-normal text-white/40 md:block">
          <BlurTextEffect>
            Trading with leverage carries a high level of risk and may not be
            suitable for all investors.
          </BlurTextEffect>{" "}
          <br />
          <BlurTextEffect delay={0.45}>
            Asset values can go down as well as up.
          </BlurTextEffect>
        </p>

        <Image
          src="/img/logo.webp"
          alt="Tridal"
          width={399}
          height={132}
          className="absolute top-[90.316%] left-[82.083%] z-30 hidden w-[8.75%] -translate-y-1/2 md:block"
        />

        {/* ---- mobile: Figma frame 3:3, the footer region y 4650..5490 of a
             375-wide frame, so the same treatment as desktop. Note the design
             puts the glow LOW — it starts just under the button and runs off
             the bottom edge — and sits the logo on top of it, above the small
             print. ---- */}
        <div className="@container relative aspect-[375/840] md:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/bg-1-full.webp"
            alt=""
            aria-hidden
            width={1024}
            height={1027}
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute top-[52.738%] left-[-93.6%] h-[131.786%] w-[294.4%] max-w-none object-cover"
          />

          <h2 className="absolute top-[7.024%] left-[16.533%] z-10 w-[66.933%] text-[11.733cqw] leading-none">
            <BlurTextEffect>The market never stops.</BlurTextEffect>{" "}
            <span className="text-gold">
              <BlurTextEffect delay={0.35}>Neither should you.</BlurTextEffect>
            </span>
          </h2>

          <div className="absolute top-[34.643%] left-[5.333%] z-10">
            <ShinyButton href="#signup">Open a free account</ShinyButton>
          </div>

          <Image
            src="/img/logo.webp"
            alt="Tridal"
            width={399}
            height={132}
            className="absolute top-[59.762%] left-[33.067%] z-10 h-auto w-[33.6%] -translate-y-1/2"
          />

          <p className="absolute top-[74.643%] left-[10.933%] z-10 w-[78.133%] text-[max(0.8125rem,3.733cqw)] leading-normal text-white/40">
            <BlurTextEffect>
              Trading with leverage carries a high level of risk and may not be
              suitable for all investors. Asset values can go down as well as
              up.
            </BlurTextEffect>
          </p>
        </div>

      </ParallaxScene>
    </footer>
  );
}
