import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OrdersList } from "@/components/shop/orders-list";
import { getOrdersForUser } from "@/lib/orders";

export const metadata = {
  title: "My orders | Future Energy BD",
};

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent("/orders")}`);
  }

  const orders = await getOrdersForUser();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-3xl text-ink sm:text-4xl">My orders</h1>
        <p className="mt-2 text-muted-foreground">
          Track payment status and open an order if you need help.
        </p>
      </header>
      <OrdersList orders={orders} />
    </div>
  );
}
