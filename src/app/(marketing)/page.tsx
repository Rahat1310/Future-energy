import { CategoryStrip } from "@/components/marketing/category-strip";
import { DealerBanner } from "@/components/marketing/dealer-banner";
import { FeaturedProducts } from "@/components/marketing/featured-products";
import { Hero } from "@/components/marketing/hero";
import { TrustRow } from "@/components/marketing/trust-row";
import {
  getFeaturedProducts,
  getHeroContent,
  getTopLevelCategories,
} from "@/lib/homepage-data";
import { getImpactStats } from "@/lib/impact";

/** ISR: homepage catalog shell — 10 min. Admin stock/price edits also call revalidateTag. */
export const revalidate = 600;

export default async function HomePage() {
  const [hero, categories, products, impact] = await Promise.all([
    getHeroContent(),
    getTopLevelCategories(),
    getFeaturedProducts(),
    getImpactStats(),
  ]);

  return (
    <>
      <Hero
        headline={hero.heroHeadline}
        subhead={hero.heroSubhead}
        impact={impact}
      />
      <CategoryStrip categories={categories} />
      <FeaturedProducts products={products} />
      <TrustRow />
      <DealerBanner />
    </>
  );
}
