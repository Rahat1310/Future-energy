"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/admin-actions";

type Category = { id: string; name: string };
type ProductData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  image?: string | null;
  variantId?: string;
  sku?: string;
  price?: number;
  originalPrice?: number;
  stock?: number;
};

export function ProductForm({
  categories,
  initialData,
}: {
  categories: Category[];
  initialData?: ProductData;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      categoryId: formData.get("categoryId") as string,
      image: (formData.get("image") as string) || undefined,
      sku: formData.get("sku") as string,
      price: Number(formData.get("price")),
      originalPrice: formData.get("originalPrice") ? Number(formData.get("originalPrice")) : undefined,
      stock: Number(formData.get("stock")),
    };

    let result;
    if (isEditing) {
      result = await updateProduct({ 
        productId: initialData.id!,
        variantId: initialData.variantId,
        ...data 
      });
    } else {
      result = await createProduct(data);
    }

    setLoading(false);

    if (result.ok) {
      router.push("/admin/products");
    } else {
      setError(result.error || "An error occurred.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded border border-neutral-300 bg-white p-6">
      {error && <div className="text-sm font-medium text-red-600">{error}</div>}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
            className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-neutral-700">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            defaultValue={initialData?.slug}
            className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            defaultValue={initialData?.description}
            className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-neutral-700">
            Image URL (Cloudinary)
          </label>
          <input
            type="url"
            id="image"
            name="image"
            defaultValue={initialData?.image || ""}
            placeholder="https://res.cloudinary.com/..."
            className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-neutral-700">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={initialData?.categoryId}
            className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border bg-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-neutral-200 space-y-4 mt-4">
          <h3 className="font-medium text-sm text-neutral-900">Pricing & Inventory</h3>
          <p className="text-xs text-neutral-500">
            Set the base pricing and stock for this product. You can manage multiple variations later from the inventory page.
          </p>
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-neutral-700">
              SKU
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              required
              defaultValue={initialData?.sku}
              className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-neutral-700">
                Price (BDT)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                required
                defaultValue={initialData?.price}
                className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-neutral-700">
                Discounted Price (BDT)
              </label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                min="0"
                step="0.01"
                placeholder="Leave blank if none"
                defaultValue={initialData?.originalPrice}
                className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-neutral-700">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                required
                defaultValue={initialData?.stock ?? 0}
                className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded border border-transparent bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
