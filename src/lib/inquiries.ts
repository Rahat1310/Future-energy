"use server";

import { db } from "@/lib/db";

export type CreateInquiryInput = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  productId?: string | null;
  variantId?: string | null;
};

export type CreateInquiryResult =
  | { ok: true; inquiryId: string }
  | { ok: false; error: string };

export async function createInquiry(
  input: CreateInquiryInput,
): Promise<CreateInquiryResult> {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = input.email?.trim() || null;
  const message = input.message?.trim() || null;
  const productId = input.productId?.trim() || null;
  const variantId = input.variantId?.trim() || null;

  if (!name || !phone) {
    return { ok: false, error: "Name and phone are required." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  if (productId) {
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) {
      return { ok: false, error: "The selected product was not found." };
    }
  }

  if (variantId) {
    const variant = await db.productVariant.findUnique({
      where: { id: variantId },
      select: { id: true, productId: true },
    });
    if (!variant) {
      return { ok: false, error: "The selected variant was not found." };
    }
    if (productId && variant.productId !== productId) {
      return {
        ok: false,
        error: "That variant does not belong to the selected product.",
      };
    }
  }

  const inquiry = await db.inquiry.create({
    data: {
      name,
      phone,
      email,
      message,
      productId,
      variantId,
      status: "NEW",
    },
    select: { id: true },
  });

  return { ok: true, inquiryId: inquiry.id };
}

/** Resolve quote query params (`product` slug or id, `variant` id) to DB ids. */
export async function resolveQuoteTargets(params: {
  product?: string | null;
  productId?: string | null;
  variant?: string | null;
  variantId?: string | null;
}) {
  const productParam = params.productId?.trim() || params.product?.trim() || null;
  const variantParam = params.variantId?.trim() || params.variant?.trim() || null;

  let product: { id: string; name: string; slug: string } | null = null;
  let variant: { id: string; sku: string; productId: string } | null = null;

  if (productParam) {
    product = await db.product.findFirst({
      where: {
        OR: [{ id: productParam }, { slug: productParam }],
      },
      select: { id: true, name: true, slug: true },
    });
  }

  if (variantParam) {
    variant = await db.productVariant.findUnique({
      where: { id: variantParam },
      select: { id: true, sku: true, productId: true },
    });

    if (variant && !product) {
      product = await db.product.findUnique({
        where: { id: variant.productId },
        select: { id: true, name: true, slug: true },
      });
    }

    if (variant && product && variant.productId !== product.id) {
      variant = null;
    }
  }

  return { product, variant };
}
