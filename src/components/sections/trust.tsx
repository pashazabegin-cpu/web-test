import { ParallaxScene } from "@/components/ui/parallax-scene";

/** Cut-outs that flank the stats, pinned to the two edges as in the design. */
const CAST = [
  { src: "/img/person-left.webp", alt: "", side: "left", depth: 3, style: { left: "-4.8%", top: "7%", width: "35%" } },
  { src: "/img/left-image.webp", alt: "", side: "left", depth: 4, style: { left: "-11.3%", top: "55%", width: "36%" } },
  { src: "/img/person-right.webp", alt: "", side: "right", depth: 3, style: { right: "-17%", top: "8.6%", width: "32%" } },
  { src: "/img/person-center.webp", alt: "", side: "right", depth: 4, style: { right: "-27%", top: "47%", width: "44%" } },
] as const;

export function Trust() {
  return (
    <section
      className="relative overflow-x-clip bg-ink py-24 md:h-svh md:py-0"
      aria-labelledby="trust-title"
    >
      <ParallaxScene className="h-full">
        {/* coins rising from the bottom edge */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-depth="1"
          src="/img/coin-background.webp"
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 w-full"
        />

        {/* the flanking cast — outer layers spread further under the shared
            depth rule, which is what opens the frame as the section passes */}
        {CAST.map((p) => (
          <div
            key={p.src}
            className="pointer-events-none absolute z-10 hidden md:block"
            style={p.style}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-depth={p.depth}
              src={p.src}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              className="block w-full"
            />
          </div>
        ))}

        <div className="relative z-20 flex h-full flex-col items-center justify-center px-5 text-center">
          <h2
            id="trust-title"
            data-depth="2"
            className="text-[clamp(1rem,1.4vw,1.25rem)] text-gold"
          >
            Why traders choose us
          </h2>

          <p
            data-depth="2"
            className="mt-[7%] font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-extrabold md:mt-[6vh]"
          >
            500,000+
          </p>
          <p className="mt-3 text-[clamp(0.9rem,1.45vw,1.3rem)]">
            traders worldwide
          </p>

          <div
            data-depth="2"
            className="mt-[8%] flex flex-col items-center gap-3 md:mt-[7vh]"
          >
            <Stars />
            <p className="text-[clamp(0.9rem,1.45vw,1.3rem)]">
              4.7 on App Store &amp; Google Play
            </p>
          </div>

          <p className="mt-[8%] max-w-[18ch] text-[clamp(0.9rem,1.45vw,1.3rem)] leading-relaxed md:mt-[7vh]">
            Segregated client accounts
          </p>

          {/* TODO: awaiting the real regulator and licence number from the
              client — the Figma placeholder (123/45) must not ship. */}
          <p className="mt-[7%] text-[clamp(0.9rem,1.45vw,1.3rem)] md:mt-[6vh]">
            Regulated by CySEC
          </p>
        </div>
      </ParallaxScene>
    </section>
  );
}

function Stars() {
  return (
    <div className="flex gap-1" aria-label="Rated 4.7 out of 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="size-[clamp(1rem,1.6vw,1.4rem)] fill-gold"
          aria-hidden
        >
          {i === 4 ? (
            <>
              <defs>
                <linearGradient id="half">
                  <stop offset="70%" stopColor="var(--color-gold)" />
                  <stop offset="70%" stopColor="#3a3a3a" />
                </linearGradient>
              </defs>
              <path
                fill="url(#half)"
                d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"
              />
            </>
          ) : (
            <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
          )}
        </svg>
      ))}
    </div>
  );
}
