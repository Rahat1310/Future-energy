import { MessageCircle } from "lucide-react";

const DEFAULT_MESSAGE =
  "Hi Future Energy BD — I'd like to ask about your products.";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function WhatsAppButton() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "";
  const number = digitsOnly(raw);

  if (!number) {
    return null;
  }

  const href = `https://wa.me/${number}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform hover:scale-105 hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="size-7" strokeWidth={2} />
    </a>
  );
}
