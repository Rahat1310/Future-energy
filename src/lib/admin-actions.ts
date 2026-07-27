"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireStaffAction } from "@/lib/auth";
import { db } from "@/lib/db";
import type { InquiryStatus, PaymentStatus } from "@/generated/prisma/client";
import { recordImpactForPaidOrder } from "@/lib/impact";
import {
  firstZodError,
  updateInquiryStatusSchema,
  updateOrderPaymentStatusSchema,
  updateVariantStockSchema,
} from "@/lib/validation";

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
) {
  const staff = await requireStaffAction();
  if (!staff.ok) return staff;

  const parsed = updateOrderPaymentStatusSchema.safeParse({
    orderId,
    paymentStatus,
  });
  if (!parsed.success) {
    return { ok: false as const, error: firstZodError(parsed.error) };
  }

  const existing = await db.order.findUnique({
    where: { id: parsed.data.orderId },
    select: {
      paymentStatus: true,
      total: true,
      _count: { select: { items: true } },
    },
  });

  if (!existing) {
    return { ok: false as const, error: "Order not found." };
  }

  await db.order.update({
    where: { id: parsed.data.orderId },
    data: { paymentStatus: parsed.data.paymentStatus },
  });

  // Impact counters only move when an order newly becomes PAID — never on create.
  if (
    parsed.data.paymentStatus === "PAID" &&
    existing.paymentStatus !== "PAID"
  ) {
    await recordImpactForPaidOrder({
      orderId: parsed.data.orderId,
      totalBdt: Number(existing.total),
      itemCount: existing._count.items,
    });
    revalidatePath("/");
    revalidateTag("homepage", "max");
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${parsed.data.orderId}`);
  revalidatePath(`/orders/${parsed.data.orderId}/payment`);
  revalidatePath("/orders");
  return { ok: true as const };
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: InquiryStatus,
) {
  const staff = await requireStaffAction();
  if (!staff.ok) return staff;

  const parsed = updateInquiryStatusSchema.safeParse({ inquiryId, status });
  if (!parsed.success) {
    return { ok: false as const, error: firstZodError(parsed.error) };
  }

  await db.inquiry.update({
    where: { id: parsed.data.inquiryId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin/inquiries");
  return { ok: true as const };
}

export async function updateVariantStock(variantId: string, stock: number) {
  const staff = await requireStaffAction();
  if (!staff.ok) return staff;

  const parsed = updateVariantStockSchema.safeParse({ variantId, stock });
  if (!parsed.success) {
    return { ok: false as const, error: firstZodError(parsed.error) };
  }

  const variant = await db.productVariant.update({
    where: { id: parsed.data.variantId },
    data: { stock: parsed.data.stock },
    select: {
      product: { select: { slug: true, category: { select: { slug: true } } } },
    },
  });

  revalidatePath("/admin/inventory");
  // Catalog caches: homepage featured + any category/product ISR shells.
  // Next.js 16 requires a cacheLife profile as the second arg ('max' = SWR stale-while-revalidate).
  revalidateTag("homepage", "max");
  revalidateTag("products", "max");
  revalidateTag("categories", "max");
  revalidatePath(`/products/${variant.product.slug}`);
  revalidatePath(`/shop/${variant.product.category.slug}`);
  revalidatePath("/shop");
  return { ok: true as const };
}
