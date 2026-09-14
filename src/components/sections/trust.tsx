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
 * Tablet (md..lg) is NOT this composition shrunk. Figma frame 1:280 draws
 * Trust with no cast at all — text and coins only — so the rotated cut-outs,
 * whose hard canvas edges sit safely off-frame at 1440, stay desktop-only.
 * Showing them at 768-1023px put those edges in the middle of the screen.
 * The tablet stage is the 768x1000 region y 2473..3473 of that frame, and it
 * is FITTED by height rather than covering: the region is taller than it is
 * wide, so covering a landscape-ish window would crop the heading off the top.
 * Nothing is lost at the sides — the page is black and the coins run past the
 * stage on purpose.
 *
 * Mobile (<md) follows the same rule on Figma frame 3:3: the 375x884 region
 * y 3247..4131, ending where the mockup's coin box hard-cuts, fitted by
 * height so the whole block — coins included — is on screen at once. That
 * matters here more than anywhere: Trust sits sticky under the FAQ curtain,
 * so anything below the first viewport of this section is never seen. The
 * rating and regulation lines break after 18 characters in the mockup, hence
 * the 18.5ch measure (18ch exactly would let sub-pixel rounding push "CySEC"
 * down a line).
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
      className="relative h-svh overflow-hidden bg-ink"
      aria-labelledby="trust-title"
    >
      {/* max() holds the stage at least as wide and at least as tall as the
          section, so it covers without ever distorting.
          @container makes the cqw units below resolve against the stage rather
          than the window, so type scales with the artwork. */}
      <div className="@container absolute top-1/2 left-1/2 aspect-[375/884] w-[min(100%,calc(100svh*375/884))] -translate-x-1/2 -translate-y-1/2 md:aspect-[768/1000] md:w-[min(100%,calc(100svh*768/1000))] lg:aspect-[1440/919] lg:w-[max(100%,calc(100svh*1440/919))]">
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
          className="pointer-events-none absolute top-[60.83%] left-[-107.01%] z-0 h-auto w-[313.2%] max-w-none md:top-[49.4%] md:left-[-47.188%] md:w-[197.917%] lg:top-[46.681%] lg:left-[-2.778%] lg:w-[105.556%]"
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
            className="pointer-events-none absolute z-10 hidden h-auto lg:block"
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
        <div className="relative z-20 h-full text-center">
          <h2
            id="trust-title"
            className="absolute inset-x-0 top-[4.525%] mx-auto max-w-[72.267%] text-[9.333cqw] leading-[1.198] font-extrabold text-gold optical-ui md:top-[10%] md:max-w-none md:text-[5.859cqw] lg:top-[13.275%] lg:text-[3.125cqw]"
          >
            <BlurTextEffect>Why traders choose us</BlurTextEffect>
          </h2>

          <p className="absolute inset-x-0 top-[20.814%] font-display text-[20cqw] leading-[1.198] font-extrabold optical-display md:top-[21.1%] md:text-[9.766cqw] lg:top-[25.353%] lg:text-[5.208cqw]">
            <BlurTextEffect>500,000+</BlurTextEffect>
          </p>

          <p className="absolute inset-x-0 top-[30.43%] text-[5.333cqw] leading-[1.3] md:top-[29.6%] md:text-[2.865cqw] md:leading-[1.5] lg:top-[34.603%] lg:text-[1.528cqw]">
            <BlurTextEffect delay={0.12}>traders worldwide</BlurTextEffect>
          </p>

          <div className="absolute top-[41.29%] left-[34.667%] h-[2.828%] w-[30.4%] md:top-[38.9%] md:left-[42.708%] md:h-[2.5%] md:w-[14.844%] lg:top-[44.723%] lg:left-[46.11%] lg:h-[2.72%] lg:w-[7.917%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/stars.svg"
              alt="Rated 4.7 out of 5"
              width={114}
              height={25}
              className="size-full"
            />
          </div>

          <p className="absolute inset-x-0 top-[45.701%] mx-auto max-w-[18.5ch] text-[5.333cqw] leading-[1.3] md:top-[42.8%] md:max-w-none md:text-[2.865cqw] md:leading-[1.5] lg:top-[48.966%] lg:text-[1.528cqw]">
            <BlurTextEffect>4.7 on App Store &amp; Google Play</BlurTextEffect>
          </p>

          <p className="absolute inset-x-0 top-[59.502%] mx-auto max-w-[18ch] text-[5.333cqw] leading-[1.3] md:top-[52.1%] md:text-[2.865cqw] md:leading-[1.5] lg:top-[59.086%] lg:text-[1.528cqw]">
            <BlurTextEffect>Segregated client accounts</BlurTextEffect>
          </p>

          {/* Reproduces the mockup verbatim. 123/45 is placeholder text there —
              flagged with the client, to be swapped for the real licence number
              before launch. */}
          <p className="absolute inset-x-0 top-[73.303%] mx-auto max-w-[18.5ch] text-[5.333cqw] leading-[1.3] md:top-[63.9%] md:max-w-none md:text-[2.865cqw] md:leading-[1.5] lg:top-[71.926%] lg:text-[1.528cqw]">
            <BlurTextEffect>Regulated by CySEC · License 123/45</BlurTextEffect>
          </p>
        </div>
      </div>
    </section>
  );
}
