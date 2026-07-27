import { SUPPORT_EMAIL } from "@/lib/constants";

/**
 * Transactional mail via Brevo (Sendinblue) SMTP API.
 * Fail-open: missing API key or send errors never block quote/order success.
 *
 * Docs: https://developers.brevo.com/reference/sendtransacemail
 */

function fromEmail(): string {
  return (
    process.env.BREVO_FROM_EMAIL?.trim() ||
    SUPPORT_EMAIL
  );
}

function fromName(): string {
  return process.env.BREVO_FROM_NAME?.trim() || "Future Energy BD";
}

export type QuoteNotificationInput = {
  inquiryId: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  productName: string | null;
  variantSku: string | null;
};

export type OrderNotificationInput = {
  orderId: string;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  total: number;
  itemCount: number;
  lines: Array<{ variantId: string; quantity: number; price: number }>;
};

async function sendSupportEmail(subject: string, text: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    console.warn(
      "[email] BREVO_API_KEY not set — skipping support notification:",
      subject,
    );
    return;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: fromName(),
          email: fromEmail(),
        },
        to: [{ email: SUPPORT_EMAIL, name: "Future Energy BD Support" }],
        subject,
        textContent: text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[email] Brevo send failed (${response.status}):`,
        detail || response.statusText,
      );
    }
  } catch (error) {
    console.warn("[email] Brevo throw:", error);
  }
}

export async function notifySupportOfQuote(
  input: QuoteNotificationInput,
): Promise<void> {
  const lines = [
    "New quote request on Future Energy BD",
    "",
    `Inquiry ID: ${input.inquiryId}`,
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email ?? "—"}`,
    `Product: ${input.productName ?? "—"}`,
    `Variant SKU: ${input.variantSku ?? "—"}`,
    "",
    "Message:",
    input.message?.trim() || "(no message)",
  ];

  await sendSupportEmail(
    `Quote request — ${input.name}${input.productName ? ` · ${input.productName}` : ""}`,
    lines.join("\n"),
  );
}

export async function notifySupportOfOrder(
  input: OrderNotificationInput,
): Promise<void> {
  const itemLines = input.lines
    .map(
      (line) =>
        `- ${line.quantity}× variant ${line.variantId} @ ৳${line.price.toLocaleString("en-US")} = ৳${(line.price * line.quantity).toLocaleString("en-US")}`,
    )
    .join("\n");

  const body = [
    "New order placed on Future Energy BD",
    "",
    `Order ID: ${input.orderId}`,
    `Total: ৳${input.total.toLocaleString("en-US")}`,
    `Items: ${input.itemCount}`,
    "",
    "Delivery:",
    `  ${input.deliveryName}`,
    `  ${input.deliveryPhone}`,
    `  ${input.deliveryAddress}`,
    `  ${input.deliveryCity}`,
    "",
    "Lines:",
    itemLines || "(none)",
    "",
    "Payment status: PENDING (awaiting bKash/Nagad confirmation)",
  ].join("\n");

  await sendSupportEmail(
    `New order — ৳${input.total.toLocaleString("en-US")} · ${input.deliveryName}`,
    body,
  );
}
