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

export default async function HomePage() {
  const [hero, categories, products] = await Promise.all([
    getHeroContent(),
    getTopLevelCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <Hero headline={hero.heroHeadline} subhead={hero.heroSubhead} />
      <CategoryStrip categories={categories} />
      <FeaturedProducts products={products} />
      <TrustRow />
      <DealerBanner />
    </>
  );
}
