"use client";

import { useEffect, useState, useTransition } from "react";
import { updateVariantStock } from "@/lib/admin-actions";

export function StockInput({
  variantId,
  initialStock,
}: {
  variantId: string;
  initialStock: number;
}) {
  const [value, setValue] = useState(String(initialStock));
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(String(initialStock));
  }, [initialStock]);

  function save(nextRaw: string) {
    const next = Number(nextRaw);
    if (!Number.isInteger(next) || next < 0) {
      setError("Invalid");
      setValue(String(initialStock));
      return;
    }
    if (next === initialStock) return;

    setError(null);
    startTransition(async () => {
      const result = await updateVariantStock(variantId, next);
      if (!result.ok) {
        setError(result.error);
        setValue(String(initialStock));
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        disabled={pending}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => save(value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className="w-20 rounded border border-neutral-300 bg-white px-2 py-1 font-mono text-xs text-neutral-800 disabled:opacity-60"
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
