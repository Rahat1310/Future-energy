"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createInquiry } from "@/lib/inquiries";

type QuoteTarget = {
  productId: string | null;
  variantId: string | null;
  productName: string | null;
  variantSku: string | null;
  productSlug: string | null;
};

export function QuoteForm({
  target,
  initialMessage = "",
}: {
  target: QuoteTarget;
  initialMessage?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(initialMessage);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createInquiry({
        name,
        phone,
        email: email || undefined,
        message: message || undefined,
        productId: target.productId,
        variantId: target.variantId,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-brand/30 bg-brand/5 px-6 py-10 text-center sm:px-10"
      >
        <h2 className="font-display text-2xl font-medium text-ink">
          Quote request received
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Thanks{name ? `, ${name.split(" ")[0]}` : ""}. We&apos;ll review your
          inquiry and get back to you on{" "}
          <span className="spec-number text-ink">{phone}</span>
          {email ? (
            <>
              {" "}
              or <span className="text-ink">{email}</span>
            </>
          ) : null}
          .
        </p>
        {target.productName ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Regarding{" "}
            <span className="font-medium text-ink">{target.productName}</span>
            {target.variantSku ? (
              <>
                {" "}
                · SKU{" "}
                <span className="spec-number text-ink">{target.variantSku}</span>
              </>
            ) : null}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/shop">Browse products</Link>}
          />
          <Button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setName("");
              setPhone("");
              setEmail("");
              setMessage("");
            }}
          >
            Submit another request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      {target.productName ? (
        <div className="mb-6 rounded-xl border border-border bg-background px-4 py-3 text-sm">
          <p className="text-muted-foreground">Quoting for</p>
          <p className="mt-0.5 font-medium text-ink">
            {target.productSlug ? (
              <Link
                href={`/products/${target.productSlug}`}
                className="hover:text-brand"
              >
                {target.productName}
              </Link>
            ) : (
              target.productName
            )}
          </p>
          {target.variantSku ? (
            <p className="mt-0.5 text-muted-foreground">
              SKU{" "}
              <span className="spec-number text-ink">{target.variantSku}</span>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          value={name}
          onChange={setName}
          required
          autoComplete="name"
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={setPhone}
          required
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
        />
        <div className="sm:col-span-2">
          <Field
            label="Email (optional)"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Message</span>
            <textarea
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              placeholder="Tell us what you need — system size, quantity, delivery area, EMI interest…"
              className="rounded-lg border border-border bg-background px-3 py-2 text-ink outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
        </div>
      </div>

      {/* Hidden fields keep product/variant ids in the form payload for clarity */}
      <input type="hidden" name="productId" value={target.productId ?? ""} />
      <input type="hidden" name="variantId" value={target.variantId ?? ""} />

      {error ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="mt-6 h-12 w-full text-base sm:w-auto"
        disabled={pending}
      >
        {pending ? "Sending…" : "Submit quote request"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border border-border bg-background px-3 text-ink outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </label>
  );
}
