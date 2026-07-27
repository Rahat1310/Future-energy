"use client";

import { useEffect, useRef, useState } from "react";
import type { ImpactStats } from "@/lib/impact-stats";

function useCountUp(target: number, durationMs = 1600) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      requestAnimationFrame(() => setValue(target));
      return;
    }

    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      const easedOutCubic = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * easedOutCubic));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, durationMs]);

  return value;
}

export function ImpactCounter({ co2SavedKg, treesEquivalent, homesPowered }: ImpactStats) {
  const co2 = useCountUp(co2SavedKg);
  const trees = useCountUp(treesEquivalent);
  const homes = useCountUp(homesPowered);

  return (
    <div
      role="status"
      aria-label={`${co2SavedKg.toLocaleString("en-US")} kilograms of CO2 emission reduced, equivalent to ${treesEquivalent.toLocaleString("en-US")} trees, and ${homesPowered.toLocaleString("en-US")} homes powered`}
      className="inline-flex flex-col gap-3 rounded-2xl border border-brand/20 bg-surface/80 px-6 py-4 sm:flex-row sm:items-center sm:gap-8"
    >
      <div className="flex items-baseline gap-2">
        <span className="spec-number text-3xl text-brand sm:text-4xl">
          {co2.toLocaleString("en-US")}
        </span>
        <span className="text-sm text-muted-foreground">kg CO₂ emission reduced</span>
      </div>
      <span className="hidden text-border sm:inline" aria-hidden>
        ·
      </span>
      <div className="flex items-baseline gap-2">
        <span className="spec-number text-3xl text-brand sm:text-4xl">
          {trees.toLocaleString("en-US")}
        </span>
        <span className="text-sm text-muted-foreground">trees-equivalent</span>
      </div>
      <span className="hidden text-border sm:inline" aria-hidden>
        ·
      </span>
      <div className="flex items-baseline gap-2">
        <span className="spec-number text-3xl text-brand sm:text-4xl">
          {homes.toLocaleString("en-US")}
        </span>
        <span className="text-sm text-muted-foreground">homes powered</span>
      </div>
    </div>
  );
}
