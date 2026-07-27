"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, Sun } from "lucide-react";
import { ImpactCounter } from "@/components/marketing/impact-counter";
import type { ImpactStats } from "@/lib/impact";

type HeroProps = {
  headline: string;
  subhead: string;
  impact: ImpactStats;
};

const HERO_POSTER =
  "https://res.cloudinary.com/twz99twz/video/upload/so_0,f_auto,q_auto,w_1920,e_improve/v1785098509/202607270231_ibbuxa.jpg";
const HERO_VIDEO =
  "https://res.cloudinary.com/twz99twz/video/upload/ac_none/w_1920/q_auto/f_auto/v1785098509/202607270231_ibbuxa.mp4";

export function Hero({ headline, subhead, impact }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  return (
    <section className="relative min-h-[28rem] overflow-hidden border-b border-border bg-black sm:min-h-[32rem] lg:min-h-[36rem]">
      {/* Priority poster = LCP candidate; video loads after (preload metadata). */}
      <Image
        src={HERO_POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover"
      />

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={HERO_POSTER}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/60" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:py-28 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-6 inline-block rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand"
        >
          Powering the Future of Bangladesh
        </motion.div>

        <h1 className="flex max-w-4xl flex-wrap justify-center gap-x-3 gap-y-2 text-5xl leading-tight font-bold tracking-tight sm:text-6xl lg:gap-x-4 lg:text-7xl">
          {headline.split(" ").map((word, i) => {
            const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
            const isHighlight = ["power", "world", "earth"].includes(cleanWord);
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.12,
                  ease: "easeOut",
                }}
                className={
                  isHighlight
                    ? "bg-gradient-to-br from-emerald-300 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm"
                    : "text-white drop-shadow-sm"
                }
              >
                {word}
              </motion.span>
            );
          })}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl"
        >
          {subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            nativeButton={false}
            className="h-14 px-8 text-base shadow-lg shadow-brand/20 transition-all hover:scale-105"
            render={<Link href="/shop">Shop products</Link>}
          />
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            className="h-14 border-white/20 bg-white/10 px-8 text-base text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
            render={<Link href="/quote">Request a quote</Link>}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mt-20 w-full"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-white/40 p-8 shadow-xl shadow-brand/5 backdrop-blur-xl dark:bg-black/20">
            <Leaf className="pointer-events-none absolute -bottom-8 -left-6 h-40 w-40 -rotate-12 text-brand/10 dark:text-brand/20" />
            <Sun className="pointer-events-none absolute -top-8 -right-6 h-40 w-40 rotate-12 text-signal/10 dark:text-signal/20" />

            <div className="relative z-10">
              <ImpactCounter {...impact} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
