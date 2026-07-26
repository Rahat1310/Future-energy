"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function DealerBanner() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-brand text-white">
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-signal/30 via-brand to-brand"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Glassmorphic overlay for texture */}
      <div className="absolute inset-0 bg-brand/50 backdrop-blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20 z-10"
      >
        <div className="max-w-2xl">
          <h2 className="text-3xl font-display font-semibold mb-4">Partner with us</h2>
          <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-light">
            Buying in bulk? Dealer and wholesale pricing is available for shops
            and installers across Bangladesh.
          </p>
        </div>
        <Button
          size="lg"
          nativeButton={false}
          className="h-14 shrink-0 bg-white px-8 text-base font-semibold text-brand hover:bg-white/90 hover:scale-105 transition-all shadow-xl shadow-black/10"
          render={<Link href="/quote">Request wholesale pricing</Link>}
        />
      </motion.div>
    </section>
  );
}
