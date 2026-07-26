import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  getAdminInquiries,
  getAdminInventory,
  getAdminOrders,
} from "@/lib/admin-data";

export const metadata = {
  title: "Admin | Future Energy BD",
};

export default async function AdminPage() {
  const [orders, inquiries, inventory] = await Promise.all([
    getAdminOrders(),
    getAdminInquiries(),
    getAdminInventory(),
  ]);

  const pendingPayments = orders.filter((o) => o.paymentStatus === "PENDING")
    .length;
  const newInquiries = inquiries.filter((i) => i.status === "NEW").length;
  const lowStock = inventory.filter((v) => v.stock < 5).length;

  const cards = [
    {
      href: "/admin/orders",
      label: "Orders",
      value: orders.length,
      note: `${pendingPayments} pending payment`,
    },
    {
      href: "/admin/inquiries",
      label: "Inquiries",
      value: inquiries.length,
      note: `${newInquiries} new`,
    },
    {
      href: "/admin/inventory",
      label: "Variants",
      value: inventory.length,
      note: `${lowStock} low stock`,
    },
  ];

  return (
    <>
      <AdminNav current="/admin" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Internal ops — orders, quote inquiries, and stock.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded border border-neutral-300 bg-white px-4 py-4 hover:border-neutral-400"
            >
              <div className="text-sm text-neutral-500">{card.label}</div>
              <div className="mt-1 font-mono text-2xl font-semibold">
                {card.value}
              </div>
              <div className="mt-1 text-xs text-neutral-500">{card.note}</div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
