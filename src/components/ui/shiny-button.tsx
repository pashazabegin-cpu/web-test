"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/use-in-view";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";
import "./shiny-cta.css";

const cta = cva("cta", {
  variants: {
    size: {
      /** header pill — 132x40 in Figma, no halo rings */
      sm: "cta--sm",
      /** hero + footer — 441x125 outer, 399x87 pill */
      lg: "",
    },
  },
  defaultVariants: { size: "lg" },
});

type ShinyButtonProps = VariantProps<typeof cta> & {
  children: React.ReactNode;
  className?: string;
  /** render as a link — use whenever the CTA navigates */
  href?: string;
  onClick?: () => void;
};

export function ShinyButton({
  children,
  className,
  size = "lg",
  href,
  onClick,
}: ShinyButtonProps) {
  const { ref, inView } = useInView<HTMLAnchorElement & HTMLButtonElement>();

  const content = (
    <>
      <span className="cta__ring cta__ring--outer" aria-hidden />
      {size === "lg" && (
        <span className="cta__ring cta__ring--inner" aria-hidden />
      )}
      <span className="cta__pill">
        {/* Only a plain string can be split into characters; anything richer
            is passed through untouched rather than silently losing the
            effect on part of it. The split half is aria-hidden and the
            component carries an sr-only copy, so the button keeps its
            accessible name. */}
        <span className="cta__label">
          {typeof children === "string" ? (
            <BlurTextEffect>{children}</BlurTextEffect>
          ) : (
            children
          )}
        </span>
      </span>
    </>
  );

  const shared = {
    ref,
    className: cn(cta({ size }), className),
    "data-animate": inView,
    onClick,
  };

  // A CTA that navigates must be an anchor: a <button> breaks middle-click,
  // open-in-new-tab and gives search engines nothing to follow.
  return href ? (
    <a href={href} {...shared}>
      {content}
    </a>
  ) : (
    <button type="button" {...shared}>
      {content}
    </button>
  );
}
