import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

type OrderSupportProps = {
  orderId: string;
};

function whatsappHref(orderId: string) {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  const text = encodeURIComponent(
    `Hi Future Energy BD — I need help with order ${orderId}.`,
  );
  return `https://wa.me/${digits}?text=${text}`;
}

export function OrderSupport({ orderId }: OrderSupportProps) {
  const wa = whatsappHref(orderId);

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <h2 className="font-display text-lg font-medium text-ink">
        Need help with this order?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Payment issues, wrong address, or delivery questions — reach us and
        include your order ID.
      </p>
      <p className="spec-number mt-3 text-xs text-muted-foreground">
        Order ID: {orderId}
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            <MessageCircle className="size-4" />
            WhatsApp support
          </a>
        ) : (
          <span className="inline-flex h-11 items-center gap-2 text-sm text-muted-foreground">
            <Phone className="size-4 text-brand" />
            WhatsApp number not configured yet
          </span>
        )}
        <Link
          href={`/quote?message=${encodeURIComponent(`Issue with order ${orderId}`)}`}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-ink transition-colors hover:bg-muted"
        >
          Submit a support request
        </Link>
      </div>
    </section>
  );
}
