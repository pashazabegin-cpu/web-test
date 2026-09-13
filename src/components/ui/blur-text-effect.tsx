"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * The layout effect is the whole point: the characters have to be hidden
 * before the browser paints, or the string flashes in at full opacity and
 * then animates. React warns about useLayoutEffect while server-rendering,
 * where neither hook runs, so fall back to useEffect there only.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type BlurTextEffectProps = {
  children: string;
  className?: string;
  /**
   * Seconds to hold before this run starts. Lets a headline that is split
   * into differently coloured parts read as one continuous sweep instead of
   * restarting the stagger on every part: pass the number of characters
   * already running, times 0.015.
   */
  delay?: number;
};

/**
 * Characters blur in with a short stagger when the text reaches the viewport.
 *
 * Adapted from the reference component in three ways that matter here:
 *
 *  - It splits on words first. The reference makes every character its own
 *    inline-block, and a run of those can wrap between any two of them — which
 *    tears words in half in a 70px headline. The unbreakable unit is the word.
 *  - It fires on intersection, not on mount. Every heading on this page except
 *    the hero's is far below the fold, so mounting is the wrong moment.
 *  - It respects prefers-reduced-motion, like every other effect on the site,
 *    and it keeps the string in the accessibility tree — split text is read
 *    out letter by letter by some screen readers.
 */
export function BlurTextEffect({
  children,
  className,
  delay = 0,
}: BlurTextEffectProps) {
  const root = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Namespaced on purpose: `[data-char]` is already how How-it-works
    // selects its three gesture images, and an unscoped hook here silently
    // fed 10 letter spans into that section's timeline.
    const chars = gsap.utils.toArray<HTMLElement>("[data-blur-char]", el);
    gsap.set(chars, { opacity: 0, y: 10, filter: "blur(8px)" });

    let tween: gsap.core.Tween | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect(); // plays once, not on every pass
        tween = gsap.to(chars, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.015,
          delay,
          // A filter repaints its element for as long as it is set. Drop it —
          // and the transform — the moment they reach their resting values.
          clearProps: "filter,transform",
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      tween?.kill();
      gsap.set(chars, { clearProps: "all" });
    };
  }, [children, delay]);

  return (
    <span ref={root} className={cn("inline", className)}>
      <span aria-hidden>
        {children.split(/(\s+)/).map((chunk, i) =>
          /^\s+$/.test(chunk) ? (
            <span key={i}>{chunk}</span>
          ) : (
            <span key={i} className="inline-block">
              {[...chunk].map((char, j) => (
                <span key={j} data-blur-char className="inline-block">
                  {char}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
      <span className="sr-only">{children}</span>
    </span>
  );
}
