"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Leaf, Sun } from "lucide-react";

// Generate random positions for the particles
function useRandomParticles(count: number) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(newParticles);
  }, [count]);

  return particles;
}

export function EnergyBackground() {
  const leaves = useRandomParticles(12);
  const orbs = useRandomParticles(8);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Subtle Grid - keeps some texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Floating Leaves (Falling down) */}
      {leaves.map((leaf) => (
        <motion.div
          key={`leaf-${leaf.id}`}
          className="absolute text-brand/20 dark:text-brand/40"
          initial={{ top: "-10%", left: `${leaf.x}%`, rotate: 0, opacity: 0 }}
          animate={{
            top: "110%",
            left: `${leaf.x + (Math.random() * 20 - 10)}%`,
            rotate: 360,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ scale: leaf.scale }}
        >
          <Leaf className="size-8" />
        </motion.div>
      ))}

      {/* Glowing Energy Orbs (Rising up) */}
      {orbs.map((orb) => (
        <motion.div
          key={`orb-${orb.id}`}
          className="absolute text-signal/20 dark:text-signal/30 blur-[2px]"
          initial={{ bottom: "-10%", left: `${orb.x}%`, opacity: 0 }}
          animate={{
            bottom: "110%",
            left: `${orb.x + (Math.random() * 15 - 7.5)}%`,
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: orb.duration * 1.5,
            delay: orb.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ scale: orb.scale }}
        >
          <Sun className="size-10" />
        </motion.div>
      ))}
    </div>
  );
}
