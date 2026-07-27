import Link from "next/link";
import { formatPrice } from "@/lib/catalog";
import type { CustomerOrderSummary } from "@/lib/orders";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<CustomerOrderSummary["paymentStatus"], string> = {
  PENDING: "Awaiting payment confirmation",
  PAID: "Paid",
  FAILED: "Payment failed",
};

const STATUS_CLASS: Record<CustomerOrderSummary["paymentStatus"], string> = {
  PENDING: "bg-signal/15 text-ink",
  PAID: "bg-brand/15 text-brand",
  FAILED: "bg-destructive/10 text-destructive",
};

export function OrdersList({ orders }: { orders: CustomerOrderSummary[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <h2 className="font-display text-lg font-medium text-ink">
          No orders yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          When you place an order, its payment and delivery status will show up
          here.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block text-sm font-medium text-brand hover:underline"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/orders/${order.id}`}
            className="block rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand/40 sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-ink">
                  {order.firstProductName}
                  {order.itemCount > 1
                    ? ` +${order.itemCount - 1} more`
                    : ""}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ordered{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {" · "}
                  <span className="spec-number">{order.id.slice(0, 8)}…</span>
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="spec-number text-lg font-semibold text-ink">
                  {formatPrice(order.total)}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    STATUS_CLASS[order.paymentStatus],
                  )}
                >
                  {STATUS_LABEL[order.paymentStatus]}
                </span>
              </div>
            </div>
            {order.paymentStatus === "PENDING" && !order.paymentNote ? (
              <p className="mt-3 text-sm text-brand">Complete payment →</p>
            ) : order.paymentStatus === "PENDING" && order.paymentNote ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Transaction ID submitted — waiting for confirmation
              </p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
