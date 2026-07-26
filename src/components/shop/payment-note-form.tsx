"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { submitPaymentNote } from "@/lib/orders";

type PaymentNoteFormProps = {
  orderId: string;
  initialNote: string | null;
};

export function PaymentNoteForm({
  orderId,
  initialNote,
}: PaymentNoteFormProps) {
  const [transactionId, setTransactionId] = useState(initialNote ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(Boolean(initialNote));
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await submitPaymentNote(orderId, transactionId);
      if (!result.ok) {
        setError(result.error);
        setSubmitted(false);
        return;
      }
      setSubmitted(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">
          bKash / Nagad transaction ID
        </span>
        <input
          name="transactionId"
          value={transactionId}
          onChange={(event) => {
            setTransactionId(event.target.value);
            setSubmitted(false);
          }}
          required
          placeholder="e.g. 8N7A2B3C4D"
          className="h-10 rounded-lg border border-border bg-background px-3 font-mono text-ink outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {submitted && !error ? (
        <p className="text-sm text-brand" role="status">
          Transaction ID saved. We&apos;ll verify it and update your order once
          payment is confirmed.
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full text-base sm:w-auto"
        disabled={pending}
      >
        {pending
          ? "Saving…"
          : submitted
            ? "Update transaction ID"
            : "Submit transaction ID"}
      </Button>
    </form>
  );
}
