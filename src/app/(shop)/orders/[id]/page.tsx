import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { OrderSupport } from "@/components/shop/order-support";
import { formatPrice, getKeySpec } from "@/lib/catalog";
import { getOrderForUser } from "@/lib/orders";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

const STATUS_LABEL = {
  PENDING: "Awaiting payment confirmation",
  PAID: "Paid — preparing delivery",
  FAILED: "Payment failed",
} as const;

const STATUS_CLASS = {
  PENDING: "bg-signal/15 text-ink",
  PAID: "bg-brand/15 text-brand",
  FAILED: "bg-destructive/10 text-destructive",
} as const;

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return { title: `Order ${id.slice(0, 8)}… | Future Energy BD` };
}

export default async function OrderStatusPage({ params }: PageProps) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(`/orders/${id}`)}`);
  }

  const order = await getOrderForUser(id);
  if (!order) {
    notFound();
  }

  const needsPayment =
    order.paymentStatus === "PENDING" || order.paymentStatus === "FAILED";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <Link
          href="/orders"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← My orders
        </Link>
        <h1 className="mt-3 text-3xl text-ink sm:text-4xl">Order status</h1>
        <p className="mt-2 text-muted-foreground">
          Order{" "}
          <span className="spec-number text-ink">{order.id}</span>
          {" · "}
          {new Date(order.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </header>

      <div
        className={cn(
          "mb-6 rounded-2xl px-5 py-4 text-sm font-medium",
          STATUS_CLASS[order.paymentStatus],
        )}
      >
        {STATUS_LABEL[order.paymentStatus]}
        {order.paymentStatus === "PENDING" && order.paymentNote ? (
          <p className="mt-1 font-normal text-muted-foreground">
            Transaction ID on file:{" "}
            <span className="spec-number text-ink">{order.paymentNote}</span>
          </p>
        ) : null}
      </div>

      {needsPayment ? (
        <div className="mb-6 rounded-2xl border border-brand/30 bg-brand/5 px-5 py-4">
          <p className="text-sm text-ink">
            {order.paymentNote
              ? "We’re verifying your transfer. You can update the transaction ID if needed."
              : "This order still needs payment via bKash or Nagad."}
          </p>
          <Link
            href={`/orders/${order.id}/payment`}
            className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline"
          >
            {order.paymentNote ? "Update payment details →" : "Go to payment →"}
          </Link>
        </div>
      ) : null}

      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-display text-lg font-medium text-ink">Items</h2>
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
          <span className="text-sm text-muted-foreground">Total</span>
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

      <div className="mt-6">
        <OrderSupport orderId={order.id} />
      </div>
    </div>
  );
}
