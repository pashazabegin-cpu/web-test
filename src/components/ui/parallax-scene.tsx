"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

/**
 * Shared depth scale for the whole site.
 *
 * Every layered section uses these same numbers, so all parallax on the page
 * obeys one physics. Tuning per-section by eye is what makes a page feel
 * assembled from unrelated parts.
 *
 * x is a percentage of the scene's width, y a percentage of the viewport
 * height. Sign of x is derived from where the layer sits relative to the
 * section's centre — outer layers spread outward, centred ones only rise.
 *
 * Note the two axes run opposite ways, and that is deliberate:
 *
 *   y DESCENDS with depth. Distant things lag the scroll, near things travel
 *     with it. Inverting this makes foreground copy hang behind as a section
 *     exits, which reads as the next section drawing a curtain over it —
 *     not as depth.
 *   x ASCENDS with depth. Sideways spread is a dolly-in, not a lag: the
 *     nearest layer sweeps widest past the camera.
 *
 * IMPORTANT: an element carrying [data-depth] must not also carry a CSS
 * transform (Tailwind's translate/scale/rotate utilities included). GSAP writes
 * `transform` on it every frame and silently overwrites them. Put layout
 * transforms on a wrapper and [data-depth] on the child.
 */
const DEPTH = {
  1: { x: 2, y: 30 },
  2: { x: 4, y: 19 },
  3: { x: 7, y: 10 },
  4: { x: 10, y: 4 },
} as const;

type Depth = keyof typeof DEPTH;

type ParallaxSceneProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Seconds the animation takes to catch up with the scroll. This is the
   * softness dial — not the easing. Scrubbed tweens stay linear.
   */
  scrub?: number;
  start?: string;
  end?: string;
  /**
   * Where the design composition is pixel-correct.
   *
   * "centre" — at mid-travel. Right for sections that scroll in from below:
   *   they look exactly like the mockup as they pass the middle of the screen.
   * "start"  — at rest. Right for the hero, which is already on screen when
   *   the page loads and must match the mockup before any scrolling happens.
   * "end"    — once the travel finishes. Right for a section that comes to a
   *   stop and is then *read*: the layers converge into the mockup position
   *   and hold there. Without it a sticky section keeps drifting while it
   *   looks stationary, and what the reader studies is never the design.
   */
  anchor?: "centre" | "start" | "end";
};

export function ParallaxScene({
  children,
  className,
  scrub = 1.2,
  start = "top bottom",
  end = "bottom top",
  anchor = "centre",
}: ParallaxSceneProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    // gsap.context scopes everything created inside it, so revert() tears down
    // only this scene. (The reference snippet called ScrollTrigger.getAll()
    // .kill(), which would nuke every other section on the page.)
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { mobile } = context.conditions as { mobile: boolean };
          // sideways drift reads as "the page is sliding" on a narrow screen,
          // and competes with the swipe-back gesture
          const xScale = mobile ? 0.5 : 1;

          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start, end, scrub },
          });

          const sceneBox = el.getBoundingClientRect();
          const sceneMid = sceneBox.left + sceneBox.width / 2;
          // A layer this close to the middle has no side to spread toward.
          const deadZone = sceneBox.width * 0.02;

          el.querySelectorAll<HTMLElement>("[data-depth]").forEach((layer) => {
            const depth = (Number(layer.dataset.depth) || 1) as Depth;
            const amp = DEPTH[depth] ?? DEPTH[1];

            const box = layer.getBoundingClientRect();
            const offset = box.left + box.width / 2 - sceneMid;
            const dir = Math.abs(offset) < deadZone ? 0 : Math.sign(offset);

            // Absolute pixels, not xPercent/yPercent. Percentages resolve
            // against each element's OWN size, so a short headline would
            // travel less than a tall image at the same depth and the illusion
            // falls apart. x scales with the scene, y with the viewport.
            const spanX = dir * (amp.x / 100) * sceneBox.width * xScale;
            const spanY = (amp.y / 100) * window.innerHeight;

            // Where the zero — the design position — falls in the travel.
            const from =
              anchor === "centre"
                ? { x: -spanX / 2, y: -spanY / 2 }
                : anchor === "end"
                  ? { x: spanX, y: spanY }
                  : { x: 0, y: 0 };
            const to =
              anchor === "centre"
                ? { x: spanX / 2, y: spanY / 2 }
                : anchor === "end"
                  ? { x: 0, y: 0 }
                  : { x: spanX, y: spanY };

            tl.fromTo(layer, from, { ...to, ease: "none" }, 0);
          });
        },
      );
    }, root);

    return () => ctx.revert();
  }, [scrub, start, end, anchor]);

  return (
    <div ref={root} className={cn("relative", className)}>
      {children}
    </div>
  );
}
