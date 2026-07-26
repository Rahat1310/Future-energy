import { AdminNav } from "@/components/admin/admin-nav";
import { OrdersTable } from "@/components/admin/orders-table";
import { getAdminOrders } from "@/lib/admin-data";

export const metadata = {
  title: "Orders | Admin",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <>
      <AdminNav current="/admin/orders" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="mt-1 mb-6 text-sm text-neutral-500">
          Update payment status after verifying bKash/Nagad transaction IDs.
        </p>
        <OrdersTable orders={orders} />
      </main>
    </>
  );
}
