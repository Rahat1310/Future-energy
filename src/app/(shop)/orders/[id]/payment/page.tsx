import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { OrderSupport } from "@/components/shop/order-support";
import { PaymentNoteForm } from "@/components/shop/payment-note-form";
import { formatPrice, getKeySpec } from "@/lib/catalog";
import { PAYMENT_CONFIRMATION_HOURS } from "@/lib/constants";
import { getOrderForPayment } from "@/lib/orders";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return { title: `Pay for order ${id.slice(0, 8)}… | Future Energy BD` };
}

export default async function OrderPaymentPage({ params }: PageProps) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect(
      `/sign-in?redirect_url=${encodeURIComponent(`/orders/${id}/payment`)}`,
    );
  }

  const order = await getOrderForPayment(id);
  if (!order) {
    notFound();
  }

  const paymentNumber =
    process.env.NEXT_PUBLIC_PAYMENT_NUMBER?.trim() || "01XXXXXXXXX";
  const paymentNumberConfigured = Boolean(
    process.env.NEXT_PUBLIC_PAYMENT_NUMBER?.trim(),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <p className="text-sm font-medium text-brand">Order placed</p>
        <h1 className="mt-1 text-3xl text-ink sm:text-4xl">Complete payment</h1>
        <p className="mt-2 text-muted-foreground">
          Send the total via bKash or Nagad, then submit the transaction ID
          below. Status stays{" "}
          <span className="font-medium text-ink">PENDING</span> until we confirm
          it.
        </p>
      </header>

      <div
        role="status"
        className="mb-8 rounded-2xl border border-signal/40 bg-signal/10 px-5 py-4"
      >
        <p className="font-medium text-ink">
          We&apos;ll confirm your payment within{" "}
          <span className="spec-number">{PAYMENT_CONFIRMATION_HOURS}</span>{" "}
          hours.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;ll get a follow-up once an admin marks the order as paid.
          Delivery is arranged after confirmation.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-display text-lg font-medium text-ink">
          Order summary
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Order{" "}
          <span className="spec-number text-ink">{order.id}</span>
        </p>

        <ul className="mt-6 flex flex-col gap-4 border-b border-border pb-6">
          {order.items.map((item) => {
            const keySpec = getKeySpec(item.attributes);
            return (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <div>
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="font-medium text-ink hover:text-brand"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-muted-foreground">
                    Qty <span className="spec-number">{item.quantity}</span>
                    {keySpec ? (
                      <>
                        {" "}
                        · <span className="spec-number">{keySpec}</span>
                      </>
                    ) : null}
                  </p>
                </div>
                <span className="spec-number font-medium text-ink">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total to send</span>
          <span className="spec-number text-2xl font-semibold text-ink">
            {formatPrice(order.total)}
          </span>
        </div>

        <dl className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide">Deliver to</dt>
            <dd className="mt-0.5 text-ink">{order.deliveryName}</dd>
            <dd>{order.deliveryPhone}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide">Address</dt>
            <dd className="mt-0.5 text-ink">{order.deliveryAddress}</dd>
            <dd>{order.deliveryCity}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-display text-lg font-medium text-ink">
          Pay with bKash / Nagad
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-muted-foreground">
          <li>
            Open bKash or Nagad and send{" "}
            <span className="spec-number font-medium text-ink">
              {formatPrice(order.total)}
            </span>{" "}
            to:
            <p className="spec-number mt-2 inline-block rounded-lg border border-border bg-background px-3 py-2 text-base font-semibold text-ink">
              {paymentNumber}
            </p>
            {!paymentNumberConfigured ? (
              <span className="mt-1 block text-xs text-signal">
                Set NEXT_PUBLIC_PAYMENT_NUMBER in your environment.
              </span>
            ) : null}
          </li>
          <li>Use &quot;Send Money&quot; (not Payment / Merchant) unless told otherwise.</li>
          <li>
            Copy the transaction ID from the confirmation SMS and paste it
            below.
          </li>
        </ol>

        <PaymentNoteForm
          orderId={order.id}
          initialNote={order.paymentNote}
        />
      </section>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/orders/${order.id}`}
          className="text-sm font-medium text-brand hover:underline"
        >
          View order status
        </Link>
        <Link
          href="/orders"
          className="text-sm text-muted-foreground hover:text-ink"
        >
          All my orders
        </Link>
      </div>

      <div className="mt-6">
        <OrderSupport orderId={order.id} />
      </div>
    </div>
  );
}
