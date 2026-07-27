import { z } from "zod";

/** Shared length caps to limit abuse payloads. */
export const FIELD_LIMITS = {
  name: 120,
  phone: 30,
  email: 254,
  message: 2000,
  deliveryAddress: 500,
  deliveryCity: 100,
  transactionId: 80,
  searchQuery: 100,
  id: 64,
  honeypot: 200,
} as const;

const optionalTrimmed = (max: number) =>
  z
    .string()
    .max(max)
    .transform((v) => v.trim())
    .transform((v) => (v.length === 0 ? undefined : v))
    .optional();

const requiredTrimmed = (max: number, label: string) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`);

/** Empty honeypot = human; any non-empty value = bot (handled by callers). */
export const honeypotSchema = z
  .string()
  .max(FIELD_LIMITS.honeypot)
  .optional()
  .default("");

export const createInquirySchema = z.object({
  name: requiredTrimmed(FIELD_LIMITS.name, "Name"),
  phone: requiredTrimmed(FIELD_LIMITS.phone, "Phone"),
  email: z.preprocess(
    (value) => {
      if (typeof value !== "string") return undefined;
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    },
    z
      .string()
      .email("Enter a valid email address.")
      .max(FIELD_LIMITS.email)
      .optional(),
  ),
  message: optionalTrimmed(FIELD_LIMITS.message),
  productId: z
    .string()
    .max(FIELD_LIMITS.id)
    .trim()
    .nullish()
    .transform((v) => (v && v.length > 0 ? v : null)),
  variantId: z
    .string()
    .max(FIELD_LIMITS.id)
    .trim()
    .nullish()
    .transform((v) => (v && v.length > 0 ? v : null)),
  /** Bots fill this; real users leave it empty. */
  website: honeypotSchema,
});

export const checkoutCartLineSchema = z.object({
  variantId: requiredTrimmed(FIELD_LIMITS.id, "Variant"),
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(999, "Quantity is too large."),
  price: z
    .number()
    .finite()
    .min(0, "Price cannot be negative.")
    .max(100_000_000, "Price is too large."),
});

export const createOrderSchema = z.object({
  deliveryName: requiredTrimmed(FIELD_LIMITS.name, "Full name"),
  deliveryPhone: requiredTrimmed(FIELD_LIMITS.phone, "Phone"),
  deliveryAddress: requiredTrimmed(
    FIELD_LIMITS.deliveryAddress,
    "Address",
  ),
  deliveryCity: requiredTrimmed(FIELD_LIMITS.deliveryCity, "City"),
  items: z
    .array(checkoutCartLineSchema)
    .min(1, "Your cart is empty.")
    .max(50, "Too many line items."),
  website: honeypotSchema,
});

export const submitPaymentNoteSchema = z.object({
  orderId: requiredTrimmed(FIELD_LIMITS.id, "Order"),
  transactionId: requiredTrimmed(
    FIELD_LIMITS.transactionId,
    "Transaction ID",
  ),
});

export const searchQuerySchema = z
  .string()
  .max(FIELD_LIMITS.searchQuery, "Search query is too long.")
  .transform((v) => v.trim());

export const updateOrderPaymentStatusSchema = z.object({
  orderId: requiredTrimmed(FIELD_LIMITS.id, "Order"),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]),
});

export const updateInquiryStatusSchema = z.object({
  inquiryId: requiredTrimmed(FIELD_LIMITS.id, "Inquiry"),
  status: z.enum(["NEW", "CONTACTED", "QUOTED", "CLOSED"]),
});

export const updateVariantStockSchema = z.object({
  variantId: requiredTrimmed(FIELD_LIMITS.id, "Variant"),
  stock: z
    .number()
    .int("Stock must be a whole number.")
    .min(0, "Stock cannot be negative.")
    .max(1_000_000, "Stock value is too large."),
});

export function firstZodError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid input.";
}

export function isHoneypotTriggered(website: string | undefined): boolean {
  return Boolean(website && website.trim().length > 0);
}
