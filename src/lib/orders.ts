"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export type CheckoutCartLine = {
  variantId: string;
  quantity: number;
  /** Unit price snapshot from the cart (BDT). */
  price: number;
};

export type CreateOrderInput = {
  items: CheckoutCartLine[];
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
};

export type CreateOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

export async function createOrderFromCart(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "You must be signed in to checkout." };
  }

  const deliveryName = input.deliveryName.trim();
  const deliveryPhone = input.deliveryPhone.trim();
  const deliveryAddress = input.deliveryAddress.trim();
  const deliveryCity = input.deliveryCity.trim();

  if (!deliveryName || !deliveryPhone || !deliveryAddress || !deliveryCity) {
    return { ok: false, error: "Please fill in all delivery fields." };
  }

  if (!input.items.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  for (const line of input.items) {
    if (!line.variantId || line.quantity < 1 || line.price < 0) {
      return { ok: false, error: "Cart contains an invalid line item." };
    }
  }

  const variantIds = input.items.map((line) => line.variantId);
  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
    select: { id: true, stock: true },
  });

  if (variants.length !== new Set(variantIds).size) {
    return {
      ok: false,
      error: "One or more products are no longer available.",
    };
  }

  const stockById = new Map(variants.map((v) => [v.id, v.stock]));
  for (const line of input.items) {
    const stock = stockById.get(line.variantId) ?? 0;
    if (stock < line.quantity) {
      return {
        ok: false,
        error: "Not enough stock for one of the items in your cart.",
      };
    }
  }

  const total = input.items.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );

  const order = await db.order.create({
    data: {
      userId,
      total,
      paymentStatus: "PENDING",
      deliveryName,
      deliveryPhone,
      deliveryAddress,
      deliveryCity,
      items: {
        create: input.items.map((line) => ({
          variantId: line.variantId,
          quantity: line.quantity,
          price: line.price,
        })),
      },
    },
    select: { id: true },
  });

  revalidatePath(`/orders/${order.id}/payment`);
  revalidatePath(`/orders/${order.id}`);
  revalidatePath("/orders");
  return { ok: true, orderId: order.id };
}

export type SubmitPaymentNoteResult =
  | { ok: true }
  | { ok: false; error: string };

/** Saves the bKash/Nagad transaction ID. Does not change paymentStatus — admin confirms later. */
export async function submitPaymentNote(
  orderId: string,
  transactionId: string,
): Promise<SubmitPaymentNoteResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "You must be signed in." };
  }

  const note = transactionId.trim();
  if (!note) {
    return { ok: false, error: "Enter the transaction ID from bKash or Nagad." };
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { userId: true, paymentStatus: true },
  });

  if (!order || order.userId !== userId) {
    return { ok: false, error: "Order not found." };
  }

  if (order.paymentStatus === "PAID") {
    return { ok: false, error: "This order is already marked as paid." };
  }

  await db.order.update({
    where: { id: orderId },
    data: {
      paymentNote: note,
      // Intentionally leave paymentStatus as PENDING — admin confirms manually.
    },
  });

  revalidatePath(`/orders/${orderId}/payment`);
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
  return { ok: true };
}

export type CustomerOrderSummary = {
  id: string;
  total: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  paymentNote: string | null;
  createdAt: string;
  itemCount: number;
  firstProductName: string;
};

export async function getOrdersForUser(): Promise<CustomerOrderSummary[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const orders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      total: true,
      paymentStatus: true,
      paymentNote: true,
      createdAt: true,
      items: {
        take: 1,
        orderBy: { id: "asc" },
        select: {
          variant: {
            select: { product: { select: { name: true } } },
          },
        },
      },
      _count: { select: { items: true } },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    total: Number(order.total),
    paymentStatus: order.paymentStatus,
    paymentNote: order.paymentNote,
    createdAt: order.createdAt.toISOString(),
    itemCount: order._count.items,
    firstProductName: order.items[0]?.variant.product.name ?? "Order items",
  }));
}

/** Alias used by the customer order status page. */
export async function getOrderForUser(orderId: string) {
  return getOrderForPayment(orderId);
}

export async function getOrderForPayment(orderId: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const order = await db.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      userId: true,
      total: true,
      paymentStatus: true,
      paymentNote: true,
      deliveryName: true,
      deliveryPhone: true,
      deliveryAddress: true,
      deliveryCity: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          variant: {
            select: {
              sku: true,
              attributes: true,
              product: {
                select: { name: true, slug: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order || order.userId !== userId) return null;

  return {
    id: order.id,
    total: Number(order.total),
    paymentStatus: order.paymentStatus,
    paymentNote: order.paymentNote,
    deliveryName: order.deliveryName,
    deliveryPhone: order.deliveryPhone,
    deliveryAddress: order.deliveryAddress,
    deliveryCity: order.deliveryCity,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: Number(item.price),
      productName: item.variant.product.name,
      productSlug: item.variant.product.slug,
      sku: item.variant.sku,
      attributes: item.variant.attributes,
    })),
  };
}
