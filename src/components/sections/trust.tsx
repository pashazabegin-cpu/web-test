/**
 * Trust is a fixed 1440x919 composition, so it is built as a fixed-aspect
 * stage rather than as percentages of the viewport.
 *
 * That distinction is why this block kept missing the mockup. Mapping x onto
 * viewport width and y onto viewport height distorts the composition on any
 * screen whose aspect is not 1440/919 — figures stretch, and anything anchored
 * to the bottom edge drifts off it. Inside the stage below, every number is a
 * share of the Figma frame itself and lands where the design puts it, on any
 * screen.
 *
 * No parallax on this block. It cannot be reconciled with matching the mockup
 * one-to-one here: the section is held on screen by the FAQ curtain, so a
 * scroll-driven offset keeps accumulating while the block looks stationary and
 * what the reader studies is a drifted composition.
 *
 * Images use object-cover — that is what Figma's FILL scale mode means. Plain
 * `fill` (the CSS default) stretches artwork to the box, which is what made
 * the cast look elongated.
 */

/** Boxes straight from node 1:56, as shares of its 1440x919 frame. */
const CAST = [
  {
    src: "/img/person-left.webp",
    outer: { left: "-4.792%", top: "7.073%", width: "34.931%", height: "123.721%" },
    inner: null,
  },
  {
    src: "/img/left-image.webp",
    outer: { left: "-11.25%", top: "51.501%", width: "35.958%", height: "80.251%" },
    inner: { width: "89.87%", height: "95.45%", rotate: -4.38 },
  },
  {
    src: "/img/person-right.webp",
    outer: { left: "75.178%", top: "8.595%", width: "32.142%", height: "120.711%" },
    inner: { width: "69.77%", height: "96.99%", rotate: 7.62 },
  },
  {
    src: "/img/person-center.webp",
    outer: { left: "66.289%", top: "46.856%", width: "44.281%", height: "82.976%" },
    inner: { width: "67.43%", height: "85.31%", rotate: 21.39 },
  },
] as const;

export function Trust() {
  return (
    <section
      className="relative overflow-hidden bg-ink py-24 md:h-svh md:py-0"
      aria-labelledby="trust-title"
    >
      {/* The stage always keeps the frame's aspect and is scaled to cover the
          section: max() holds it at least as wide as the section and at least
          as tall, so it neither letterboxes nor distorts. */}
      {/* @container makes the cqw units below resolve against the stage, not
          the viewport — that is what keeps type in proportion with the art. */}
      <div className="@container relative md:absolute md:top-1/2 md:left-1/2 md:aspect-[1440/919] md:w-[max(100%,calc(100svh*1440/919))] md:-translate-x-1/2 md:-translate-y-1/2">
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
          <div
            key={p.src}
            className="pointer-events-none absolute z-10 hidden md:grid md:place-items-center"
            style={p.outer}
          >
            {p.inner ? (
              <div
                style={{
                  width: p.inner.width,
                  height: p.inner.height,
                  transform: `rotate(${p.inner.rotate}deg)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover object-bottom"
                />
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={p.src}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className="size-full object-cover object-bottom"
              />
            )}
          </div>
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

          {/* TODO: 123/45 is placeholder text in the mockup — awaiting the real
              regulator and licence number before this can ship. */}
          <p className="text-base md:absolute md:inset-x-0 md:top-[71.926%] md:text-[1.528cqw]">
            Regulated by CySEC
          </p>
        </div>
      </div>
    </section>
  );
}
