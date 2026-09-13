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

/** Event that makes a mounted BlurTextEffect run again. */
const PLAY = "blurtext:play";

/**
 * Replay every BlurTextEffect inside `scope`.
 *
 * The two pinned state machines need this. All four of Why-as's copy blocks
 * are in the DOM and inside the viewport from the moment the section is, so
 * an observer fires for all of them at once and three would burn their
 * entrance while still invisible. Those sections call this when a state
 * actually becomes the active one instead.
 */
export function replayBlurText(scope: Element | null | undefined) {
  scope
    ?.querySelectorAll<HTMLElement>("[data-blur-text]")
    .forEach((el) => el.dispatchEvent(new CustomEvent(PLAY)));
}

type BlurTextEffectProps = {
  children: string;
  className?: string;
  /**
   * Seconds to hold before this run starts. Lets a block split into several
   * runs — a two-colour headline, a paragraph with a hard break — read as one
   * continuous sweep instead of restarting the stagger on every part.
   */
  delay?: number;
};

/**
 * Characters blur in with a short stagger when the text reaches the viewport.
 *
 * Adapted from the reference component in four ways that matter here:
 *
 *  - It splits on words first. The reference makes every character its own
 *    inline-block, and a run of those can wrap between any two of them —
 *    which tears words in half in a 70px headline. The unbreakable unit is
 *    the word.
 *  - It fires on intersection, not on mount, and only once the text is
 *    genuinely on screen — see the visibility gate below.
 *  - The stagger is capped in total rather than fixed per character, so a
 *    paragraph does not take two seconds to finish arriving.
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

    // 0.015 a character reads well across a heading, but a 130-character
    // paragraph would then take two seconds to land. Cap the whole stagger
    // rather than the per-character step: short strings are untouched and
    // long ones simply tighten up.
    const stagger = Math.min(0.015, 0.6 / Math.max(chars.length, 1));

    const hide = () =>
      gsap.set(chars, { opacity: 0, y: 10, filter: "blur(8px)" });
    hide();

    let played = false;
    let tween: gsap.core.Tween | undefined;

    const play = () => {
      played = true;
      tween?.kill();
      hide();
      tween = gsap.to(chars, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.3,
        ease: "power2.out",
        stagger,
        delay,
        // A filter repaints its element for as long as it is set. Drop it —
        // and the transform — the moment they reach their resting values.
        clearProps: "filter,transform",
      });
    };

    el.addEventListener(PLAY, play);

    // Inside the viewport is not the same as on screen: a state machine's
    // inactive copy sits right there at opacity 0. Playing then would spend
    // the entrance on something nobody can see, so leave those to
    // replayBlurText — and keep observing, as a fallback for the case where
    // one becomes visible without its section saying so.
    const onScreen = () =>
      typeof el.checkVisibility === "function"
        ? el.checkVisibility({
            opacityProperty: true,
            visibilityProperty: true,
          })
        : true;

    // No negative rootMargin. Shrinking the root's bottom edge to hold the
    // effect back until the text is "properly" in view also carves out a dead
    // band across the bottom of the screen — and on the last screen of the
    // page there is no more scrolling to push anything out of it, so the
    // footer's second line of small print simply never arrived.
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || played || !onScreen()) return;
      io.disconnect();
      play();
    });
    io.observe(el);

    return () => {
      io.disconnect();
      el.removeEventListener(PLAY, play);
      tween?.kill();
      gsap.set(chars, { clearProps: "all" });
    };
  }, [children, delay]);

  return (
    <span ref={root} data-blur-text className={cn("inline", className)}>
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
