/** BDT — variants at or above this price use the quote flow instead of add-to-cart. */
export const QUOTE_PRICE_THRESHOLD = 50_000;

/** Stock below this (and above 0) shows as "low stock". */
export const LOW_STOCK_THRESHOLD = 5;

/** Shown on the post-checkout payment page for manual bKash/Nagad confirmation. */
export const PAYMENT_CONFIRMATION_HOURS = 24;

/**
 * Public support inbox — shown site-wide and receives quote/order notifications.
 * Override with NEXT_PUBLIC_SUPPORT_EMAIL if needed.
 */
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ||
  "support@futureenergybd.com";
