"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { InquiryStatus, PaymentStatus } from "@/generated/prisma/client";

const PAYMENT_STATUSES: PaymentStatus[] = ["PENDING", "PAID", "FAILED"];
const INQUIRY_STATUSES: InquiryStatus[] = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "CLOSED",
];

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
) {
  if (!PAYMENT_STATUSES.includes(paymentStatus)) {
    return { ok: false as const, error: "Invalid payment status." };
  }

  await db.order.update({
    where: { id: orderId },
    data: { paymentStatus },
  });

  revalidatePath("/admin/orders");
  return { ok: true as const };
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: InquiryStatus,
) {
  if (!INQUIRY_STATUSES.includes(status)) {
    return { ok: false as const, error: "Invalid inquiry status." };
  }

  await db.inquiry.update({
    where: { id: inquiryId },
    data: { status },
  });

  revalidatePath("/admin/inquiries");
  return { ok: true as const };
}

export async function updateVariantStock(variantId: string, stock: number) {
  if (!Number.isInteger(stock) || stock < 0) {
    return { ok: false as const, error: "Stock must be a non-negative integer." };
  }

  await db.productVariant.update({
    where: { id: variantId },
    data: { stock },
  });

  revalidatePath("/admin/inventory");
  return { ok: true as const };
}
