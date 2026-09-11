import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/products", label: "Products" },
] as const;

export function AdminNav({ current }: { current: string }) {
  return (
    <header className="border-b border-neutral-300 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/images/logo-transparent.png"
            alt="Future Energy BD"
            width={120}
            height={60}
            className="h-6 w-auto object-contain"
          />
          <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-semibold text-neutral-600">
            Admin
          </span>
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {LINKS.map((link) => {
            const active = current === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded bg-neutral-900 px-2.5 py-1 text-white"
                    : "rounded px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="ml-auto text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Storefront
        </Link>
      </div>
    </header>
  );
}
