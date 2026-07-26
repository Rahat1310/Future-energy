"use client";

import { StatusSelect } from "@/components/admin/status-select";
import { updateOrderPaymentStatus } from "@/lib/admin-actions";

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED"] as const;
type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export type AdminOrderRow = {
  id: string;
  deliveryName: string;
  deliveryPhone: string;
  total: number;
  paymentStatus: PaymentStatus;
  paymentNote: string | null;
  createdAt: string;
};

export function OrdersTable({ orders }: { orders: AdminOrderRow[] }) {
  if (orders.length === 0) {
    return <p className="text-sm text-neutral-500">No orders yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-neutral-300 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-3 py-2 font-medium">Order</th>
            <th className="px-3 py-2 font-medium">Customer</th>
            <th className="px-3 py-2 font-medium">Total</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Txn ID</th>
            <th className="px-3 py-2 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-neutral-100 last:border-0">
              <td className="px-3 py-2 font-mono text-xs text-neutral-700">
                {order.id.slice(0, 10)}…
              </td>
              <td className="px-3 py-2">
                <div className="font-medium text-neutral-900">
                  {order.deliveryName}
                </div>
                <div className="font-mono text-xs text-neutral-500">
                  {order.deliveryPhone}
                </div>
              </td>
              <td className="px-3 py-2 font-mono text-neutral-800">
                ৳{order.total.toLocaleString("en-US")}
              </td>
              <td className="px-3 py-2">
                <StatusSelect
                  value={order.paymentStatus}
                  options={PAYMENT_STATUSES}
                  onChange={(paymentStatus) =>
                    updateOrderPaymentStatus(order.id, paymentStatus)
                  }
                />
              </td>
              <td className="px-3 py-2 font-mono text-xs text-neutral-600">
                {order.paymentNote || "—"}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-500">
                {new Date(order.createdAt).toLocaleString("en-US")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
