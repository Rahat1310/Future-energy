"use client";

import { StockInput } from "@/components/admin/stock-input";

export type AdminInventoryRow = {
  id: string;
  productName: string;
  sku: string;
  stock: number;
  price: number;
};

export function InventoryTable({ rows }: { rows: AdminInventoryRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-neutral-500">No variants in inventory.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-neutral-300 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-3 py-2 font-medium">Product</th>
            <th className="px-3 py-2 font-medium">SKU</th>
            <th className="px-3 py-2 font-medium">Stock</th>
            <th className="px-3 py-2 font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-neutral-100 last:border-0">
              <td className="px-3 py-2 font-medium text-neutral-900">
                {row.productName}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-neutral-600">
                {row.sku}
              </td>
              <td className="px-3 py-2">
                <StockInput variantId={row.id} initialStock={row.stock} />
              </td>
              <td className="px-3 py-2 font-mono text-neutral-800">
                ৳{row.price.toLocaleString("en-US")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
