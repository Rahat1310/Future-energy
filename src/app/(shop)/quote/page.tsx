import { QuoteForm } from "@/components/shop/quote-form";
import { resolveQuoteTargets } from "@/lib/inquiries";

export const metadata = {
  title: "Request a quote | Future Energy BD",
  description:
    "Request a quote for high-ticket solar systems, batteries, motorcycles, or wholesale dealer pricing.",
};

type PageProps = {
  searchParams: Promise<{
    product?: string;
    productId?: string;
    variant?: string;
    variantId?: string;
    message?: string;
  }>;
};

export default async function QuotePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { product, variant } = await resolveQuoteTargets(params);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8 text-center sm:mb-10">
        <h1 className="text-3xl text-ink sm:text-4xl">Request a quote</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          For high-ticket items, commercial solar systems, EMI options, or
          wholesale dealer pricing — we&apos;ll follow up by phone or WhatsApp.
        </p>
      </header>

      <QuoteForm
        target={{
          productId: product?.id ?? null,
          variantId: variant?.id ?? null,
          productName: product?.name ?? null,
          variantSku: variant?.sku ?? null,
          productSlug: product?.slug ?? null,
        }}
        initialMessage={params.message?.trim() ?? ""}
      />
    </div>
  );
}
