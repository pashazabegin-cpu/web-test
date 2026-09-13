import { ParallaxScene } from "@/components/ui/parallax-scene";

/**
 * Flanking cut-outs.
 *
 * Placement deliberately does NOT come from the Figma rectangles. Those carry
 * a lot of transparent padding — the reporter's box starts at y=65 while his
 * hair starts at y=331 — and the exported PNGs are trimmed to their content,
 * so feeding the rect coordinates to a trimmed image drops everyone far too
 * high and too far out.
 *
 * These values put the *visible* artwork where the mockup render has it.
 * Measured off that render: the left group occupies 36%→bottom and reaches in
 * to x=25%, the right group 32%→bottom reaching in to x=75%.
 */
const CAST = [
  {
    src: "/img/person-left.webp",
    depth: 3,
    style: { left: "-3%", top: "36%", width: "30%" },
  },
  {
    src: "/img/left-image.webp",
    depth: 4,
    style: { left: "-6%", top: "62%", width: "28%" },
  },
  {
    src: "/img/person-right.webp",
    depth: 3,
    style: { right: "-4%", top: "32%", width: "26%" },
  },
  {
    src: "/img/person-center.webp",
    depth: 4,
    style: { right: "-8%", top: "60%", width: "34%" },
  },
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
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="block w-full"
            />
          </div>
        ))}

        {/* Text sits on the mockup's own rows instead of being centred as one
            block. Centring pushed the heading from 13% down to 21% and let the
            spacing drift out of step with the artwork. */}
        <div className="relative z-20 flex h-full flex-col items-center gap-6 px-5 py-24 text-center md:block md:py-0">
          <h2
            id="trust-title"
            data-depth="2"
            className="text-[clamp(1rem,1.74vw,1.5625rem)] leading-[1.198] font-semibold text-gold md:absolute md:inset-x-0 md:top-[13.3%]"
          >
            Why traders choose us
          </h2>

          <p
            data-depth="2"
            className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-extrabold md:absolute md:inset-x-0 md:top-[25.4%]"
          >
            500,000+
          </p>

          <p className="text-[clamp(0.9rem,1.6vw,1.44rem)] md:absolute md:inset-x-0 md:top-[34.6%]">
            traders worldwide
          </p>

          <div
            data-depth="2"
            className="md:absolute md:inset-x-0 md:top-[44.7%]"
          >
            <Stars />
          </div>

          <p className="text-[clamp(0.9rem,1.6vw,1.44rem)] md:absolute md:inset-x-0 md:top-[49%]">
            4.7 on App Store &amp; Google Play
          </p>

          <p className="mx-auto max-w-[18ch] text-[clamp(0.9rem,1.6vw,1.44rem)] leading-relaxed md:absolute md:inset-x-0 md:top-[59.1%]">
            Segregated client accounts
          </p>

          {/* TODO: awaiting the real regulator and licence number from the
              client — the Figma placeholder (123/45) must not ship. */}
          <p className="text-[clamp(0.9rem,1.6vw,1.44rem)] md:absolute md:inset-x-0 md:top-[71.9%]">
            Regulated by CySEC
          </p>
        </div>
      </ParallaxScene>
    </section>
  );
}

function Stars() {
  return (
    <div className="flex justify-center gap-1" aria-label="Rated 4.7 out of 5">
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
