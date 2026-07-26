"use client";

import { useState } from "react";
import { useCart, type AddToCartInput } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";

type AddToCartButtonProps = Omit<AddToCartInput, "quantity"> & {
  disabled?: boolean;
  quantity?: number;
  className?: string;
};

export function AddToCartButton({
  disabled = false,
  quantity = 1,
  className,
  ...item
}: AddToCartButtonProps) {
  const { add } = useCart();
  const [error, setError] = useState<string | null>(null);

  const outOfStock = item.stock <= 0 || disabled;

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto">
      <Button
        size="lg"
        className={className ?? "h-12 w-full px-6 text-base sm:w-auto"}
        disabled={outOfStock}
        onClick={() => {
          const result = add({ ...item, quantity });
          if (!result.ok) {
            setError(result.reason);
            return;
          }
          setError(null);
        }}
      >
        {outOfStock ? "Out of stock" : "Add to cart"}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
