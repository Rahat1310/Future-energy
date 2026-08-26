"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/admin-actions";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product? All of its variants will also be deleted. This cannot be undone.")) {
      return;
    }

    setLoading(true);
    const result = await deleteProduct(productId);
    
    if (result.ok) {
      router.push("/admin/products");
    } else {
      setLoading(false);
      alert(result.error || "Failed to delete product.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete Product"}
    </button>
  );
}
