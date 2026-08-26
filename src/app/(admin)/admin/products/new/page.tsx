import { AdminNav } from "@/components/admin/admin-nav";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories } from "@/lib/admin-data";

export const metadata = {
  title: "New Product | Admin",
};

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <>
      <AdminNav current="/admin/products" />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">New Product</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Create a new product in the catalog.
          </p>
        </div>

        <ProductForm categories={categories} />
      </main>
    </>
  );
}
