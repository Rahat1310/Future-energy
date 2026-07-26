import { AdminNav } from "@/components/admin/admin-nav";
import { InventoryTable } from "@/components/admin/inventory-table";
import { getAdminInventory } from "@/lib/admin-data";

export const metadata = {
  title: "Inventory | Admin",
};

export default async function AdminInventoryPage() {
  const rows = await getAdminInventory();

  return (
    <>
      <AdminNav current="/admin/inventory" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-xl font-semibold">Inventory</h1>
        <p className="mt-1 mb-6 text-sm text-neutral-500">
          Edit stock inline — blur or press Enter to save.
        </p>
        <InventoryTable rows={rows} />
      </main>
    </>
  );
}
