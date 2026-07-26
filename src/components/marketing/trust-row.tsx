"use client";

import { BadgeCheck, CreditCard, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";
import { motion } from "framer-motion";

const TRUST_ITEMS: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "Warranty on every unit",
    description:
      "Manufacturer-backed warranty terms are listed on each product page — no fine print surprises.",
  },
  {
    icon: BadgeCheck,
    title: "Certified components",
    description:
      "Batteries and panels ship with certification badges so you know exactly what you're installing.",
  },
  {
    icon: CreditCard,
    title: "EMI on high-ticket items",
    description:
      "Solar systems and motorcycles are eligible for installment plans — ask when you request a quote.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function TrustRow() {
  return (
    <section className="border-b border-border bg-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand/5 pointer-events-none" />
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:grid-cols-3 sm:gap-8 sm:py-24 relative z-10"
      >
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} variants={itemVariants} className="flex flex-col items-center text-center sm:items-start sm:text-left gap-5">
              <div className="relative flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-border/50 dark:bg-black/20">
                <div className="absolute inset-0 bg-brand/20 blur-xl rounded-full" />
                <Icon className="relative z-10 size-7 text-brand" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
