"use client";

import { StatusSelect } from "@/components/admin/status-select";
import { updateInquiryStatus } from "@/lib/admin-actions";

const INQUIRY_STATUSES = ["NEW", "CONTACTED", "QUOTED", "CLOSED"] as const;
type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export type AdminInquiryRow = {
  id: string;
  name: string;
  phone: string;
  productName: string;
  status: InquiryStatus;
  createdAt: string;
};

export function InquiriesTable({ inquiries }: { inquiries: AdminInquiryRow[] }) {
  if (inquiries.length === 0) {
    return <p className="text-sm text-neutral-500">No inquiries yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-neutral-300 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Phone</th>
            <th className="px-3 py-2 font-medium">Product</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr
              key={inquiry.id}
              className="border-b border-neutral-100 last:border-0"
            >
              <td className="px-3 py-2 font-medium text-neutral-900">
                {inquiry.name}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-neutral-600">
                {inquiry.phone}
              </td>
              <td className="px-3 py-2 text-neutral-700">{inquiry.productName}</td>
              <td className="px-3 py-2">
                <StatusSelect
                  value={inquiry.status}
                  options={INQUIRY_STATUSES}
                  onChange={(status) => updateInquiryStatus(inquiry.id, status)}
                />
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-500">
                {new Date(inquiry.createdAt).toLocaleString("en-US")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
