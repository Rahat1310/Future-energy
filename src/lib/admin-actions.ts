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

export async function createProduct(data: {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  sku: string;
  price: number;
  stock: number;
}) {
  const staff = await requireStaffAction();
  if (!staff.ok) return staff;

  const parsed = (await import("@/lib/validation")).createProductSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false as const, error: firstZodError(parsed.error) };
  }

  // Check if slug or SKU exists
  const existingSlug = await db.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existingSlug) return { ok: false as const, error: "Product slug already exists." };

  const existingSku = await db.productVariant.findUnique({ where: { sku: parsed.data.sku } });
  if (existingSku) return { ok: false as const, error: "SKU already exists." };

  await db.product.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      variants: {
        create: [
          {
            sku: parsed.data.sku,
            price: parsed.data.price,
            stock: parsed.data.stock,
            attributes: {},
          },
        ],
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidateTag("products", "max");
  revalidateTag("categories", "max");
  return { ok: true as const };
}

export async function updateProduct(data: {
  productId: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
}) {
  const staff = await requireStaffAction();
  if (!staff.ok) return staff;

  const parsed = (await import("@/lib/validation")).updateProductSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false as const, error: firstZodError(parsed.error) };
  }

  // Check if slug exists on another product
  const existingSlug = await db.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existingSlug && existingSlug.id !== parsed.data.productId) {
    return { ok: false as const, error: "Product slug already exists." };
  }

  await db.product.update({
    where: { id: parsed.data.productId },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${parsed.data.productId}/edit`);
  revalidateTag("products", "max");
  revalidateTag("categories", "max");
  return { ok: true as const };
}

export async function deleteProduct(productId: string) {
  const staff = await requireStaffAction();
  if (!staff.ok) return staff;

  // We need to delete variants and inquiries first due to foreign keys.
  // Although Prisma can cascade if configured, it's safer to do it explicitly or rely on schema.
  // In `prisma/schema.prisma` we don't have onDelete: Cascade for variants or inquiries.
  // Let's delete inquiries and variants first.

  await db.$transaction([
    db.inquiry.deleteMany({ where: { productId } }),
    // Also delete inquiries referencing the variants of this product just in case
    db.inquiry.deleteMany({ where: { variant: { productId } } }),
    // delete order items referencing this product's variants (might cause error if there are past orders)
    // Actually, deleting products that have orders is bad practice. We should check that.
  ]);

  const ordersCount = await db.orderItem.count({
    where: { variant: { productId } },
  });

  if (ordersCount > 0) {
    return { ok: false as const, error: "Cannot delete product with existing orders." };
  }

  await db.$transaction([
    db.productVariant.deleteMany({ where: { productId } }),
    db.product.delete({ where: { id: productId } }),
  ]);

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidateTag("products", "max");
  revalidateTag("categories", "max");
  return { ok: true as const };
}
