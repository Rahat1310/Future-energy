"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { HoneypotField } from "@/components/ui/honeypot-field";
import { formatPrice } from "@/lib/catalog";
import { createOrderFromCart } from "@/lib/orders";

export function CheckoutForm() {
  const router = useRouter();
  const { items, total, clear, itemCount } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  /** Prevents empty-cart UI/redirect from racing the payment navigation. */
  const [redirectingTo, setRedirectingTo] = useState<string | null>(null);

  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (itemCount === 0 && !redirectingTo && !pending) {
      router.replace("/shop");
    }
  }, [itemCount, router, redirectingTo, pending]);

  if (redirectingTo) {
    return (
      <p className="text-muted-foreground">
        Order placed — taking you to payment…
      </p>
    );
  }

  if (itemCount === 0) {
    return (
      <p className="text-muted-foreground">
        Your cart is empty.{" "}
        <Link href="/shop" className="font-medium text-brand hover:underline">
          Continue shopping
        </Link>
      </p>
    );
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createOrderFromCart({
        deliveryName,
        deliveryPhone,
        deliveryAddress,
        deliveryCity,
        website,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const paymentPath = `/orders/${result.orderId}/payment`;
      setRedirectingTo(paymentPath);
      clear();
      router.push(paymentPath);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start"
    >
      <HoneypotField value={website} onChange={setWebsite} />
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-display text-lg font-medium text-ink">
          Delivery details
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Payment is manual via bKash/Nagad after you place the order — no card
          details needed here.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            name="deliveryName"
            value={deliveryName}
            onChange={setDeliveryName}
            required
            autoComplete="name"
          />
          <Field
            label="Phone"
            name="deliveryPhone"
            type="tel"
            value={deliveryPhone}
            onChange={setDeliveryPhone}
            required
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
          />
          <div className="sm:col-span-2">
            <Field
              label="Address"
              name="deliveryAddress"
              value={deliveryAddress}
              onChange={setDeliveryAddress}
              required
              autoComplete="street-address"
            />
          </div>
          <Field
            label="City"
            name="deliveryCity"
            value={deliveryCity}
            onChange={setDeliveryCity}
            required
            autoComplete="address-level2"
            placeholder="Dhaka"
          />
        </div>

        {error ? (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="mt-8 h-12 w-full text-base sm:w-auto"
          disabled={pending}
        >
          {pending ? "Placing order…" : "Place order"}
        </Button>
      </div>

      <aside className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-medium text-ink">
          Order summary
        </h2>
        <ul className="mt-4 flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-ink">{item.productName}</p>
                <p className="text-muted-foreground">
                  Qty{" "}
                  <span className="spec-number">{item.quantity}</span>
                  {item.keySpec ? (
                    <>
                      {" "}
                      · <span className="spec-number">{item.keySpec}</span>
                    </>
                  ) : null}
                </p>
              </div>
              <span className="spec-number shrink-0 font-medium text-ink">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="spec-number text-xl font-semibold text-ink">
            {formatPrice(total)}
          </span>
        </div>
      </aside>
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
