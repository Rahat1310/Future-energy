"use client";

import Link from "next/link";
import { ArrowUpRight, Zap } from "lucide-react";

const AKIJ_BATTERIES_HREF =
  "/shop?category=lithium-batteries,motorcycle-batteries,easybike-batteries,lead-acid-batteries&brand=akij";

const NOTICE_ITEMS = [
  { id: 1, highlight: "অফিসিয়াল পার্টনার" },
  { id: 2, highlight: "অনুমোদিত ডিলার" },
  { id: 3, highlight: "১০০% অথেনটিক" },
  { id: 4, highlight: "অফিসিয়াল পার্টনার" },
  { id: 5, highlight: "অনুমোদিত ডিলার" },
  { id: 6, highlight: "১০০% অথেনটিক" },
];

export function MarqueeNotice() {
  return (
    <aside
      aria-label="ঘোষণা"
      className="group relative z-20 flex h-9 items-center overflow-hidden border-b border-emerald-500/20 bg-gradient-to-r from-[#0d2a1c] via-[#144731] to-[#0d2a1c] text-white shadow-xs select-none"
    >
      {/* Left and right gradient fade masks for smooth transition */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-[#0d2a1c] to-transparent sm:w-16" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-[#0d2a1c] to-transparent sm:w-16" />

      {/* Marquee track 1 */}
      <div className="flex shrink-0 items-center gap-10 pr-10 animate-marquee">
        {NOTICE_ITEMS.map((item, idx) => (
          <Link
            key={`m1-${idx}`}
            href={AKIJ_BATTERIES_HREF}
            className="group/item inline-flex shrink-0 items-center gap-3 text-xs text-white/90 transition-colors hover:text-white sm:text-sm"
          >
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300 shadow-xs sm:text-[11px]">
              <Zap className="size-2.5 fill-amber-300 text-amber-300" aria-hidden="true" />
              <span>{item.highlight}</span>
            </span>

            <span className="font-medium tracking-normal text-white drop-shadow-xs">
              Future Energy BD এখন আকিজ ব্যাটারির অনুমোদিত ডিলার
            </span>

            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-300 transition-transform group-hover/item:translate-x-0.5 group-hover/item:text-white">
              ব্যাটারি কালেকশন
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </span>

            <span className="text-emerald-400/40 text-xs" aria-hidden="true">
              ✦
            </span>
          </Link>
        ))}
      </div>

      {/* Marquee track 2 (seamless clone for infinite loop) */}
      <div
        className="flex shrink-0 items-center gap-10 pr-10 animate-marquee"
        aria-hidden="true"
      >
        {NOTICE_ITEMS.map((item, idx) => (
          <Link
            key={`m2-${idx}`}
            href={AKIJ_BATTERIES_HREF}
            tabIndex={-1}
            className="group/item inline-flex shrink-0 items-center gap-3 text-xs text-white/90 transition-colors hover:text-white sm:text-sm"
          >
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300 shadow-xs sm:text-[11px]">
              <Zap className="size-2.5 fill-amber-300 text-amber-300" aria-hidden="true" />
              <span>{item.highlight}</span>
            </span>

            <span className="font-medium tracking-normal text-white drop-shadow-xs">
              Future Energy BD এখন আকিজ ব্যাটারির অনুমোদিত ডিলার
            </span>

            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-300 transition-transform group-hover/item:translate-x-0.5 group-hover/item:text-white">
              ব্যাটারি কালেকশন
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </span>

            <span className="text-emerald-400/40 text-xs" aria-hidden="true">
              ✦
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
