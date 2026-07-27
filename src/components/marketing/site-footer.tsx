import Link from "next/link";
import { MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { ALL_PRODUCTS_LINK, MAIN_NAV } from "@/lib/nav";

function whatsappHref() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export function SiteFooter() {
  const wa = whatsappHref();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ink/10 bg-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(31,111,79,0.45),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(232,169,58,0.12),_transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:28px_28px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="font-display text-2xl font-semibold tracking-tight">
              Future Energy <span className="text-signal">BD</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              Lithium batteries, solar panels, and electric rides for Bangladesh
              — built to cut bills and cut carbon.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>Serving homes, shops &amp; installers across Bangladesh</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>Warranty-backed products with certified components</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Shop
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href={ALL_PRODUCTS_LINK.href}
                  className="text-white/80 transition-colors hover:text-signal"
                >
                  {ALL_PRODUCTS_LINK.label}
                </Link>
              </li>
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/80 transition-colors hover:text-signal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop/accessories"
                  className="text-white/80 transition-colors hover:text-signal"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Support
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/quote"
                  className="text-white/80 transition-colors hover:text-signal"
                >
                  Request a quote
                </Link>
              </li>
              <li>
                <Link
                  href="/quote"
                  className="text-white/80 transition-colors hover:text-signal"
                >
                  Dealer / wholesale pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-white/80 transition-colors hover:text-signal"
                >
                  My orders
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout"
                  className="text-white/80 transition-colors hover:text-signal"
                >
                  Checkout
                </Link>
              </li>
              <li>
                <span className="text-white/55">
                  High-ticket solar &amp; e-bikes — inquire first, buy with
                  confidence
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Contact &amp; pay
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {wa ? (
                <li>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white/90 transition-colors hover:text-signal"
                  >
                    <MessageCircle className="size-4 text-brand" />
                    Chat on WhatsApp
                  </a>
                </li>
              ) : (
                <li className="flex items-center gap-2 text-white/70">
                  <Phone className="size-4 text-brand" />
                  Prefer a call? Request a quote and we&apos;ll reach out.
                </li>
              )}
              <li className="text-white/70 leading-relaxed">
                Pay via <span className="text-white">bKash</span> or{" "}
                <span className="text-white">Nagad</span> after checkout —
                submit your transaction ID and we confirm within 24 hours.
              </li>
              <li>
                <Link
                  href="/quote"
                  className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand/90"
                >
                  Talk to sales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Future Energy BD. All rights reserved.</p>
          <p className="sm:text-right">
            Save money. Save nature. Powered for Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
}
