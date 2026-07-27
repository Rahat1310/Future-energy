"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * WhatsApp FAB is not needed for first paint — mount after idle so it
 * doesn't compete with LCP / hydration of the above-the-fold UI.
 */
const WhatsAppButton = dynamic(
  () =>
    import("@/components/marketing/whatsapp-button").then(
      (mod) => mod.WhatsAppButton,
    ),
  { ssr: false },
);

export function DeferredWhatsAppButton() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const show = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(show, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(show, 1500);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;
  return <WhatsAppButton />;
}
