/**
 * Trust is a fixed 1440x919 composition, so the SECTION itself carries that
 * aspect ratio and every number inside is a share of the Figma frame.
 *
 * Nothing is cropped. An earlier version scaled a stage to cover a 100vh
 * section, which quietly cut the composition on any screen whose aspect is not
 * 1440/919 — on a 2000x1136 window that is 140px off the top and bottom, which
 * is what pushed the coin field out of view and clipped the cast at the edges.
 * Letting the section take the design's own height costs a little scroll on
 * wide monitors and buys exactness everywhere.
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

/**
 * Cast placement.
 *
 * The Figma boxes (503x1137 etc.) are NOT the artwork — they carry a lot of
 * transparent padding, and the exported PNGs are trimmed to content. Scaling a
 * trimmed cut-out to fill its declared box, which is what object-cover does,
 * blew every figure up by roughly a third. That was the "too big".
 *
 * So each one is drawn at its natural size and placed by its centre, found by
 * template-matching the cut-out against the mockup render of the frame. Sizes
 * are widths only — height follows the image's own aspect, so nothing can
 * stretch.
 */
const CAST = [
  // centre x/y and width, as shares of the 1440x919 frame
  // nw/nh are the files' own pixel sizes: without them the browser cannot
  // reserve an aspect before the lazy image loads and `h-auto` collapses to 0.
  { src: "/img/person-left.webp", cx: "15.069%", cy: "52.992%", w: "30.139%", rotate: 0, nw: 434, nh: 854 },
  { src: "/img/left-image.webp", cx: "12.361%", cy: "75.191%", w: "24.722%", rotate: -4.38, nw: 356, nh: 446 },
  { src: "/img/person-right.webp", cx: "88.264%", cy: "53.537%", w: "24.861%", rotate: 7.62, nw: 358, nh: 840 },
  { src: "/img/person-center.webp", cx: "83.542%", cy: "73.612%", w: "33.750%", rotate: 21.39, nw: 486, nh: 489 },
] as const;

export function Trust() {
  return (
    /* @container makes the cqw units below resolve against this frame rather
       than the window, so type scales with the artwork. */
    <section
      className="@container relative w-full overflow-hidden bg-ink py-24 md:aspect-[1440/919] md:py-0"
      aria-labelledby="trust-title"
    >
      <div className="contents">
        {/* coins — 1320x566 centred, hanging 176px below the frame */}
        <div className="pointer-events-none absolute bottom-[-19.15%] left-1/2 z-0 hidden h-[61.59%] w-[91.67%] -translate-x-1/2 md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/coin-background.webp"
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </div>

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
            className="text-base font-semibold text-gold md:absolute md:inset-x-0 md:top-[13.275%] md:text-[1.736cqw] md:leading-[1.198]"
          >
            Why traders choose us
          </h2>

          <p className="font-display text-5xl leading-[1.198] font-extrabold md:absolute md:inset-x-0 md:top-[25.353%] md:text-[5.208cqw]">
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
