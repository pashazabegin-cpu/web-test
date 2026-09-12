import type Lenis from "lenis";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

type ScrollTriggerInstance = InstanceType<typeof ScrollTrigger>;

/**
 * Settle a pinned section onto whole states.
 *
 * Without this the scroll can stop halfway through a transition, leaving two
 * artworks cross-faded and neither label readable — which reads as the page
 * skipping past content.
 *
 * Deliberately implemented on Lenis rather than ScrollTrigger's own `snap`:
 * Lenis owns the scroll position, so anything that calls window.scrollTo gets
 * dragged straight back and the two fight visibly.
 */
export function attachSnap(st: ScrollTriggerInstance, steps: number) {
  if (steps < 1) return () => {};

  let idle: ReturnType<typeof setTimeout>;
  let snapping = false;

  const settle = () => {
    if (snapping) return;
    clearTimeout(idle);
    idle = setTimeout(() => {
      // Looked up lazily, never captured: React runs child effects before the
      // parent's, so the provider has not created Lenis yet when a section
      // first calls this.
      const lenis = getLenis();
      if (!lenis || !st.isActive) return;

      const progress = st.progress;
      const snapped = Math.round(progress * steps) / steps;
      // already close enough — don't nudge and cause a visible twitch
      if (Math.abs(snapped - progress) < 0.005) return;

      snapping = true;
      lenis.scrollTo(st.start + (st.end - st.start) * snapped, {
        duration: 0.65,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          snapping = false;
        },
      });
    }, 130);
  };

  window.addEventListener("scroll", settle, { passive: true });

  return () => {
    clearTimeout(idle);
    window.removeEventListener("scroll", settle);
  };
}
