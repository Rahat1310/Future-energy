import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/shop/checkout-form";

export const metadata = {
  title: "Checkout | Future Energy BD",
};

export default async function CheckoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent("/checkout")}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-3xl text-ink sm:text-4xl">Checkout</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Enter your delivery details. You&apos;ll pay via bKash or Nagad on the
          next step — we confirm the transfer manually.
        </p>
      </header>

      <CheckoutForm />
    </div>
  );
}
