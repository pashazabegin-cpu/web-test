import { ParallaxScene } from "@/components/ui/parallax-scene";

/**
 * Every number here is read straight off the Figma node (1:56), expressed as a
 * share of its 1440x919 frame.
 *
 * The thing that makes this block look right and is easy to miss: three of the
 * four cut-outs are ROTATED, each inside its own nested box. Figma gives an
 * outer box that centres a smaller inner box, and the rotation lives on the
 * inner one — so the outer box is just the rotated bounding area and cannot be
 * used as the image frame. Placing the images by the outer boxes (or by eye)
 * loses the fan arrangement completely.
 *
 * Rotation goes on the wrapper, never on the [data-depth] element: GSAP writes
 * `transform` on whatever it animates and would wipe it out.
 */
const CAST = [
  {
    src: "/img/person-left.webp",
    depth: 3,
    // the only one with no rotation
    outer: { left: "-4.792%", top: "7.073%", width: "34.931%", height: "123.721%" },
    inner: null,
  },
  {
    src: "/img/left-image.webp",
    depth: 4,
    outer: { left: "-11.25%", top: "51.501%", width: "35.958%", height: "80.251%" },
    inner: { width: "89.87%", height: "95.45%", rotate: -4.38 },
  },
  {
    src: "/img/person-right.webp",
    depth: 3,
    outer: { left: "75.178%", top: "8.595%", width: "32.142%", height: "120.711%" },
    inner: { width: "69.77%", height: "96.99%", rotate: 7.62 },
  },
  {
    src: "/img/person-center.webp",
    depth: 4,
    outer: { left: "66.289%", top: "46.856%", width: "44.281%", height: "82.976%" },
    inner: { width: "67.43%", height: "85.31%", rotate: 21.39 },
  },
] as const;

export function Trust() {
  return (
    <section
      className="relative overflow-x-clip bg-ink py-24 md:h-svh md:py-0"
      aria-labelledby="trust-title"
    >
      {/* Trust is held on screen by the FAQ curtain, so its trigger keeps
          advancing while the block looks stationary. Ending the travel the
          moment it sticks — and landing on zero — means what the reader
          actually studies is the mockup composition, not a drifted one. */}
      <ParallaxScene className="h-full" anchor="end" start="top bottom" end="top top">
        {/* 1320x566, centred, hanging 176px below the frame */}
        <div className="pointer-events-none absolute bottom-[-19.15%] left-1/2 z-0 h-[61.59%] w-[91.67%] -translate-x-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-depth="1"
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
                className="relative"
                style={{
                  width: p.inner.width,
                  height: p.inner.height,
                  transform: `rotate(${p.inner.rotate}deg)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-depth={p.depth}
                  src={p.src}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="size-full object-fill"
                />
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                data-depth={p.depth}
                src={p.src}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className="size-full object-fill"
              />
            )}
          </div>
        ))}

        {/* Rows sit on their Figma proportions; body copy is 22px mono. */}
        {/* One plane, one depth. Depths on individual rows pulled them apart
            vertically — the caption climbed into the big number and the stars
            dropped below the rating line. In the mockup this is a single
            layer and its internal spacing is fixed. */}
        <div
          data-depth="2"
          className="relative z-20 flex h-full flex-col items-center gap-6 px-5 py-24 text-center md:block md:py-0"
        >
          <h2
            id="trust-title"
            className="text-[clamp(1rem,1.74vw,1.5625rem)] leading-[1.198] font-semibold text-gold md:absolute md:inset-x-0 md:top-[13.275%]"
          >
            Why traders choose us
          </h2>

          <p
            className="font-display text-[clamp(2.5rem,5.21vw,4.6875rem)] leading-[1.198] font-extrabold md:absolute md:inset-x-0 md:top-[25.353%]"
          >
            500,000+
          </p>

          <p className="text-[clamp(0.9rem,1.528vw,1.375rem)] md:absolute md:inset-x-0 md:top-[34.603%]">
            traders worldwide
          </p>

          <div
            className="md:absolute md:top-[44.723%] md:left-[46.11%] md:h-[2.72%] md:w-[7.917%]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/stars.svg"
              alt="Rated 4.7 out of 5"
              width={114}
              height={25}
              className="h-[1.5625rem] w-auto md:size-full"
            />
          </div>

          <p className="text-[clamp(0.9rem,1.528vw,1.375rem)] md:absolute md:inset-x-0 md:top-[48.966%]">
            4.7 on App Store &amp; Google Play
          </p>

          <p className="mx-auto max-w-[18ch] text-[clamp(0.9rem,1.528vw,1.375rem)] leading-normal md:absolute md:inset-x-0 md:top-[59.086%]">
            Segregated client accounts
          </p>

          {/* TODO: 123/45 is placeholder text in the mockup — awaiting the real
              regulator and licence number before this can ship. */}
          <p className="text-[clamp(0.9rem,1.528vw,1.375rem)] md:absolute md:inset-x-0 md:top-[71.926%]">
            Regulated by CySEC
          </p>
        </div>
      </ParallaxScene>
    </section>
  );
}
