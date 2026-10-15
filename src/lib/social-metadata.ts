import type { Metadata } from "next";

export const SITE_URL = "https://futureenergybd.com";
export const SITE_NAME = "Future Energy BD";
export const SITE_DESCRIPTION =
  "Shop lithium batteries, solar panels, inverters, and electric rides in Bangladesh. Future Energy BD — authorized Akij battery dealer.";

/** Share cards use public, absolute URLs so messaging crawlers can fetch them. */
export function socialMetadata({
  title = SITE_NAME,
  description = SITE_DESCRIPTION,
  path,
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: { url: string; alt: string };
} = {}): Metadata {
  const shareImage = image
    ? { ...image, url: new URL(image.url, SITE_URL).toString() }
    : {
        url: SITE_URL + "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Future Energy BD — authorized Akij battery dealer",
      };
  const url = path ? new URL(path, SITE_URL).toString() : undefined;

  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      ...(url ? { url } : {}),
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}
