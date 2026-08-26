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
    };

    let result;
    if (isEditing) {
      result = await updateProduct({ productId: initialData.id!, ...data });
    } else {
      const createData = {
        ...data,
        sku: formData.get("sku") as string,
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
      };
      result = await createProduct(createData);
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

        {!isEditing && (
          <div className="pt-4 border-t border-neutral-200 space-y-4 mt-4">
            <h3 className="font-medium text-sm text-neutral-900">Initial Variant (Required)</h3>
            <p className="text-xs text-neutral-500">Every product must have at least one variant. You can manage variants later from the inventory page.</p>
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-neutral-700">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                required
                className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                  className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-neutral-700">
                  Initial Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  required
                  defaultValue={0}
                  className="mt-1 block w-full rounded border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>
        )}
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
