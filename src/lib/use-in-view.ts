"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True while the element is on screen.
 *
 * Used to gate always-on CSS animations. A `@property` conic-gradient
 * animation repaints its element every frame for as long as it runs — with
 * four CTAs on the page that is a constant tax on the same frame budget the
 * scroll scrubs need to stay smooth.
 */
export function useInView<T extends HTMLElement>(rootMargin = "0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
