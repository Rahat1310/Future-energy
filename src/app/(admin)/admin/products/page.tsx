import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { getAdminProducts } from "@/lib/admin-data";

export const metadata = {
  title: "Products | Admin",
};

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <>
      <AdminNav current="/admin/products" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Products</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Manage product details and categories.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Add Product
          </Link>
        </div>

        <div className="overflow-hidden rounded border border-neutral-300 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-300 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Variants</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {product.name}
                      <div className="font-normal text-neutral-500 text-xs">{product.slug}</div>
                    </td>
                    <td className="px-4 py-3">{product.categoryName}</td>
                    <td className="px-4 py-3">{product.variantCount}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
