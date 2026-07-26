import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/product-detail";
import { getProductBySlug } from "@/lib/product-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} | Future Energy BD`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.variants.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <ProductDetail product={product} />
    </div>
  );
}
