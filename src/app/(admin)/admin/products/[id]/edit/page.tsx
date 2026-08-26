import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories, getAdminProductById } from "@/lib/admin-data";
import { DeleteProductButton } from "./delete-button";

export const metadata = {
  title: "Edit Product | Admin",
};

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [product, categories] = await Promise.all([
    getAdminProductById(params.id),
    getAdminCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <AdminNav current="/admin/products" />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Edit Product</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Update details for {product.name}.
            </p>
          </div>
          <DeleteProductButton productId={product.id} />
        </div>

        <ProductForm categories={categories} initialData={product} />
      </main>
    </>
  );
}
