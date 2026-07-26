"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ImpactCounter } from "@/components/marketing/impact-counter";
import { MOCK_IMPACT_STATS } from "@/lib/impact-stats";

type HeroProps = {
  headline: string;
  subhead: string;
};

export function Hero({ headline, subhead }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border bg-black">
      {/* Cloudinary Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="https://res.cloudinary.com/twz99twz/video/upload/so_0,f_auto,q_auto,w_1920,e_improve/v1785098509/202607270231_ibbuxa.jpg"
        className="absolute inset-0 z-0 object-cover w-full h-full"
      >
        <source src="https://res.cloudinary.com/twz99twz/video/upload/ac_none/w_1920/q_auto/f_auto/v1785098509/202607270231_ibbuxa.mp4" />
      </video>

      {/* Dark Overlay for Text Contrast */}
      <div className="absolute inset-0 z-[1] bg-black/60 pointer-events-none" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-4 py-20 sm:py-28 lg:py-32 items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-block rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand mb-6 border border-brand/20"
        >
          Powering the Future of Bangladesh
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="max-w-4xl text-5xl leading-tight text-white sm:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text"
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl leading-relaxed"
        >
          {subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col gap-4 sm:flex-row justify-center"
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
            className="h-14 px-8 text-base bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-105"
            render={<Link href="/quote">Request a quote</Link>}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mt-20 w-full"
        >
          <div className="rounded-3xl border border-border/50 bg-white/40 dark:bg-black/20 backdrop-blur-xl p-8 shadow-xl shadow-brand/5">
            <ImpactCounter {...MOCK_IMPACT_STATS} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
