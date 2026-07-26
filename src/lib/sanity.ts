import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import type { PortableTextBlock } from "@portabletext/types";

export type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
};

/** Editorial homepage — product catalog data stays in Postgres. */
export type HomePage = {
  _id: string;
  _type: "homePage";
  heroHeadline: string;
  heroSubhead: string;
  heroImage?: SanityImage;
  featuredCategorySlugs?: string[];
};

export type BlogPost = {
  _id: string;
  _type: "blogPost";
  title: string;
  slug: { current: string };
  coverImage?: SanityImage;
  body?: PortableTextBlock[];
  publishedAt?: string;
};

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl: "/studio",
  },
});

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;
  /** Seconds until revalidation, or `false` for indefinite (tag-based). */
  revalidate?: number | false;
  tags?: string[];
};

/**
 * Typed fetch helper wrapping the Sanity client with Next.js cache options.
 * Use for editorial content only — products/categories come from Prisma.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: SanityFetchOptions): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
