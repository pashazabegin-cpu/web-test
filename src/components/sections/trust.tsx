/**
 * Trust is a fixed 1440x919 composition, drawn into a stage that keeps that
 * aspect and is scaled to COVER a one-viewport section. Every number inside is
 * a share of the Figma frame, so the composition itself is always exact.
 *
 * The trade-off is deliberate and was chosen by the client: the block stays
 * exactly one screen tall, and on a window whose aspect is not 1440/919 the
 * overflow is cropped evenly top and bottom (140px each on a 2000x1136
 * screen). The alternatives were letting the block run taller than the
 * viewport, or letterboxing it — both were rejected in favour of the
 * one-screen rhythm.
 *
 * No parallax on this block. It cannot be reconciled with matching the mockup
 * one-to-one here: the section is held on screen by the FAQ curtain, so a
 * scroll-driven offset keeps accumulating while the block looks stationary and
 * what the reader studies is a drifted composition.
 *
 * The cast carries no object-fit at all: each cut-out is drawn at its natural
 * aspect (width only, height auto), so there is no mechanism by which it can
 * stretch. See the note on CAST for why fitting them to their Figma boxes was
 * wrong in the first place.
 */

import { BlurTextEffect } from "@/components/ui/blur-text-effect";

/**
 * Cast placement.
 *
 * The Figma boxes (503x1137 etc.) are NOT the artwork — they carry a lot of
 * transparent padding, and the exported PNGs are trimmed to content. Scaling a
 * trimmed cut-out to fill its declared box, which is what object-cover does,
 * blew every figure up by roughly a third. That was the "too big".
 *
 * So each one is drawn at its natural size and placed by its centre. Sizes are
 * widths only — height follows the image's own aspect, so nothing can stretch.
 *
 * The client later re-exported these with the edges painted in so they no
 * longer read as hard-cut. That re-canvased every file (person-left gained
 * 213px on the left, left-image 108px, person-right 178px on the right,
 * person-center lost 115px of empty padding on the left and gained 102px on
 * the right) WITHOUT moving the artwork. The centres and widths below were
 * recomputed from those offsets — found by phase-correlating each new file
 * against its predecessor, residual <1.5/255 — so every figure still lands on
 * the exact pixel it did before. Do not "round" these: they encode a
 * measurement, not a taste.
 */
const CAST = [
  // centre x/y and width, as shares of the 1440x919 frame
  // nw/nh are the files' own pixel sizes: without them the browser cannot
  // reserve an aspect before the lazy image loads and `h-auto` collapses to 0.
  { src: "/img/person-left.webp", cx: "7.673%", cy: "52.992%", w: "44.931%", rotate: 0, nw: 647, nh: 854 },
  { src: "/img/left-image.webp", cx: "8.622%", cy: "75.640%", w: "32.222%", rotate: -4.38, nw: 464, nh: 446 },
  { src: "/img/person-right.webp", cx: "94.390%", cy: "54.821%", w: "37.222%", rotate: 7.62, nw: 536, nh: 840 },
  { src: "/img/person-center.webp", cx: "90.558%", cy: "77.918%", w: "32.847%", rotate: 21.39, nw: 473, nh: 489 },
] as const;

export function Trust() {
  return (
    <section
      className="relative overflow-hidden bg-ink py-24 md:h-svh md:py-0"
      aria-labelledby="trust-title"
    >
      {/* max() holds the stage at least as wide and at least as tall as the
          section, so it covers without ever distorting.
          @container makes the cqw units below resolve against the stage rather
          than the window, so type scales with the artwork. */}
      <div className="@container relative md:absolute md:top-1/2 md:left-1/2 md:aspect-[1440/919] md:w-[max(100%,calc(100svh*1440/919))] md:-translate-x-1/2 md:-translate-y-1/2">
        {/* Coins. The re-export is the previous 1320x566 fill with a 100px
            margin painted round every side — verified 1:1 against the old
            render — so it is placed at its own natural size (1520x766 frame px
            starting 40px left of and 429px down the frame) with NO object-fit.
            Cropping it is the one thing that must not happen here: the painted
            margin is what stops the field ending in a hard edge. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/coin-background.webp"
          alt=""
          aria-hidden
          width={1520}
          height={766}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute top-[46.681%] left-[-2.778%] z-0 hidden h-auto w-[105.556%] max-w-none md:block"
        />

        {CAST.map((p) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={p.src}
            src={p.src}
            alt=""
            aria-hidden
            width={p.nw}
            height={p.nh}
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute z-10 hidden h-auto md:block"
            style={{
              left: p.cx,
              top: p.cy,
              width: p.w,
              transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`,
            }}
          />
        ))}

        {/* Type is sized as a share of the stage width too (22px / 1440 =
            1.528%, 75px = 5.208%, 25px = 1.736%) so it scales with the
            composition instead of drifting against it. */}
        <div className="relative z-20 flex flex-col items-center gap-6 px-5 text-center md:block md:h-full md:px-0">
          <h2
            id="trust-title"
            className="text-[2.1875rem] leading-[1.198] font-semibold text-gold optical-ui md:absolute md:inset-x-0 md:top-[13.275%] md:text-[3.125cqw]"
          >
            <BlurTextEffect>Why traders choose us</BlurTextEffect>
          </h2>

          <p className="font-display text-5xl leading-[1.198] font-extrabold optical-display md:absolute md:inset-x-0 md:top-[25.353%] md:text-[5.208cqw]">
            500,000+
          </p>

          <p className="text-base md:absolute md:inset-x-0 md:top-[34.603%] md:text-[1.528cqw]">
            traders worldwide
          </p>

          <div className="md:absolute md:top-[44.723%] md:left-[46.11%] md:h-[2.72%] md:w-[7.917%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/stars.svg"
              alt="Rated 4.7 out of 5"
              width={114}
              height={25}
              className="h-6 w-auto md:size-full"
            />
          </div>

          <p className="text-base md:absolute md:inset-x-0 md:top-[48.966%] md:text-[1.528cqw]">
            4.7 on App Store &amp; Google Play
          </p>

          <p className="mx-auto max-w-[18ch] text-base md:absolute md:inset-x-0 md:top-[59.086%] md:text-[1.528cqw]">
            Segregated client accounts
          </p>

          {/* Reproduces the mockup verbatim. 123/45 is placeholder text there —
              flagged with the client, to be swapped for the real licence number
              before launch. */}
          <p className="text-base md:absolute md:inset-x-0 md:top-[71.926%] md:text-[1.528cqw]">
            Regulated by CySEC · License 123/45
          </p>
        </div>
      </div>
    </section>
  );
}
