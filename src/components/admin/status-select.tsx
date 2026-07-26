"use client";

import { useTransition } from "react";

type StatusSelectProps<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => Promise<{ ok: boolean; error?: string }>;
};

export function StatusSelect<T extends string>({
  value,
  options,
  onChange,
}: StatusSelectProps<T>) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={value}
      disabled={pending}
      className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-800 disabled:opacity-60"
      onChange={(event) => {
        const next = event.target.value as T;
        startTransition(async () => {
          await onChange(next);
        });
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
