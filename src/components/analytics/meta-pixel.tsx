"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID?.trim() || "1071538635465280";

/**
 * Type-safe helper to trigger Meta Pixel events from anywhere in client code.
 */
export function trackPixelEvent(
  event: string,
  params?: Record<string, unknown>
) {
  if (
    typeof window !== "undefined" &&
    (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
  ) {
    if (params) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq(
        "track",
        event,
        params
      );
    } else {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq(
        "track",
        event
      );
    }
  }
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Avoid double-firing PageView on the very first page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Track PageView on client-side route changes
    trackPixelEvent("PageView");
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixel() {
  if (!FB_PIXEL_ID) return null;

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>

      {/* Meta Pixel Base Code */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
