"use client";

import Link from "next/link";
import { BatteryCharging, Bike, Package, Sun } from "lucide-react";
import type { ComponentType } from "react";
import type { NavCategory } from "@/lib/homepage-data";
import { motion } from "framer-motion";

function getCategoryIcon(slug: string): ComponentType<{ className?: string }> {
  if (slug.includes("batter")) return BatteryCharging;
  if (slug.includes("panel") || slug.includes("solar")) return Sun;
  if (slug.includes("motorcycle") || slug.includes("scooter") || slug.includes("bike"))
    return Bike;
  return Package;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CategoryStrip({ categories }: { categories: NavCategory[] }) {
  return (
    <section className="border-b border-border bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-brand/[0.02]" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Shop by Category</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">Find exactly what you need to transition to sustainable energy.</p>
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Categories are being set up — check back soon.
          </p>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
          >
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.slug);
              return (
                <motion.div key={category.id} variants={itemVariants}>
                  <Link
                    href={`/shop/${category.slug}`}
                    className="group relative flex flex-col items-center gap-4 rounded-3xl border border-border bg-surface p-8 transition-all hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex size-16 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-transform group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
                      <Icon className="size-8" />
                    </span>
                    <h3 className="relative font-display text-lg font-semibold text-ink text-center">
                      {category.name}
                    </h3>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
