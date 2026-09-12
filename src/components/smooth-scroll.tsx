"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One Lenis instance for the whole page.
 *
 * Deliberately NOT per-component: several sections drive scrubbed timelines,
 * and multiple Lenis instances would each try to own the scroll position and
 * fight each other.
 *
 * `lerp: 0.075` is the softness dial — lower is heavier/smoother. The GSAP
 * default (0.1) reads noticeably drier.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.075 });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf); // the reference snippet leaked this one
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
