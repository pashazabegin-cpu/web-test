"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis";

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

    // Lenis owns the scroll position, so anything that wants to move the page
    // — section snapping included — has to go through this instance rather
    // than window.scrollTo, which Lenis would pull straight back.
    setLenis(lenis);

    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // Every pinned section measures the page when its trigger is created,
    // which is before webfonts swap in and before any lazy image below the
    // fold has reserved its box. On mobile that was enough to leave the
    // How-it-works pin with zero scroll distance — the cards never arrived.
    // One refresh once things have settled costs nothing and fixes all of
    // them at once.
    const settle = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(settle);
    window.addEventListener("load", settle);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("load", settle);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf); // the reference snippet leaked this one
      gsap.ticker.lagSmoothing(500, 33);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
