import { AdminNav } from "@/components/admin/admin-nav";
import { InquiriesTable } from "@/components/admin/inquiries-table";
import { getAdminInquiries } from "@/lib/admin-data";

export const metadata = {
  title: "Inquiries | Admin",
};

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();

  return (
    <>
      <AdminNav current="/admin/inquiries" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-xl font-semibold">Inquiries</h1>
        <p className="mt-1 mb-6 text-sm text-neutral-500">
          Quote requests from the storefront form.
        </p>
        <InquiriesTable inquiries={inquiries} />
      </main>
    </>
  );
}
