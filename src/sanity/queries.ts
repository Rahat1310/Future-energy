import { groq } from "next-sanity";

/** Singleton editorial document — headline/subhead/hero image for the homepage. */
export const HOME_PAGE_QUERY = groq`*[_type == "homePage"][0]{
  _id,
  _type,
  heroHeadline,
  heroSubhead,
  heroImage,
  featuredCategorySlugs
}`;

export const LATEST_BLOG_POSTS_QUERY = groq`*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc)[0...3]{
  _id,
  _type,
  title,
  slug,
  coverImage,
  publishedAt
}`;
