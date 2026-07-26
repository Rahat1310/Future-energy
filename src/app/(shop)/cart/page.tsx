import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ink mb-8">
        Your Cart
      </h1>
      
      <div className="rounded-3xl border border-border bg-white/50 dark:bg-black/20 p-8 text-center backdrop-blur-sm">
        <div className="py-12">
          <p className="text-lg text-muted-foreground mb-6">
            Your cart is currently empty.
          </p>
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/shop">Continue Shopping</Link>}
          />
        </div>
      </div>
    </div>
  );
}
