"use server";

import { db } from "@/lib/db";
import { notifySupportOfQuote } from "@/lib/email";
import { enforceMutationRateLimit } from "@/lib/ratelimit";
import {
  createInquirySchema,
  firstZodError,
  isHoneypotTriggered,
} from "@/lib/validation";

export type CreateInquiryInput = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  productId?: string | null;
  variantId?: string | null;
  /** Honeypot — leave empty. */
  website?: string;
};

export type CreateInquiryResult =
  | { ok: true; inquiryId: string }
  | { ok: false; error: string; status?: 429 };

export async function createInquiry(
  input: CreateInquiryInput,
): Promise<CreateInquiryResult> {
  const limited = await enforceMutationRateLimit("inquiry");
  if (!limited.ok) {
    return { ok: false, error: limited.error, status: 429 };
  }

  const parsed = createInquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: firstZodError(parsed.error) };
  }

  const data = parsed.data;

  // Silently accept bots — look successful, create nothing.
  if (isHoneypotTriggered(data.website)) {
    return { ok: true, inquiryId: "received" };
  }

  const name = data.name;
  const phone = data.phone;
  const email = data.email ?? null;
  const message = data.message ?? null;
  const productId = data.productId;
  const variantId = data.variantId;

  let productName: string | null = null;
  let variantSku: string | null = null;

  if (productId) {
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true },
    });
    if (!product) {
      return { ok: false, error: "The selected product was not found." };
    }
    productName = product.name;
  }

  if (variantId) {
    const variant = await db.productVariant.findUnique({
      where: { id: variantId },
      select: { id: true, productId: true, sku: true },
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
    variantSku = variant.sku;

    if (!productName) {
      const product = await db.product.findUnique({
        where: { id: variant.productId },
        select: { name: true },
      });
      productName = product?.name ?? null;
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

  await notifySupportOfQuote({
    inquiryId: inquiry.id,
    name,
    phone,
    email,
    message,
    productName,
    variantSku,
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
