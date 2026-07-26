"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { ChevronDown, Menu, X } from "lucide-react";
import { CartButton } from "@/components/cart/cart-button";
import { SiteSearch } from "@/components/marketing/site-search";
import { Button } from "@/components/ui/button";
import { ALL_PRODUCTS_LINK, MAIN_NAV, type NavItem } from "@/lib/nav";

function NavDropdown({
  item,
  linkClass,
  panelClass,
}: {
  item: NavItem;
  linkClass: string;
  panelClass: string;
}) {
  return (
    <div className="group relative">
      <Link
        href={item.href}
        className={`inline-flex items-center gap-1 transition-colors ${linkClass}`}
      >
        {item.label}
        <ChevronDown className="size-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
      </Link>
      <div
        className={`invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100`}
      >
        <div className={`rounded-xl border py-2 shadow-lg ${panelClass}`}>
          {item.children.map((child) => (
            <Link
              key={child.href + child.label}
              href={child.href}
              className="block px-4 py-2 text-sm text-ink/80 transition-colors hover:bg-muted hover:text-ink"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(!isHome);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isTransparent = isHome && !isScrolled;

  const headerClass = isHome
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "border-b border-border bg-background/95 backdrop-blur-sm" : "bg-black/10 backdrop-blur-md border-b border-white/10"}`
    : "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm";

  const logoTextClass = isTransparent ? "text-white" : "text-ink";
  const linkClass = isTransparent
    ? "text-white/80 hover:text-white"
    : "text-muted-foreground hover:text-ink";
  const panelClass = isTransparent
    ? "border-white/15 bg-ink/95 text-white shadow-black/30 [&_a]:text-white/85 [&_a:hover]:bg-white/10 [&_a:hover]:text-white"
    : "border-border bg-background";

  return (
    <header className={headerClass}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className={`font-display text-lg font-semibold transition-colors ${logoTextClass}`}
        >
          Future Energy <span className="text-brand">BD</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
          <Link
            href={ALL_PRODUCTS_LINK.href}
            className={`transition-colors ${linkClass}`}
          >
            {ALL_PRODUCTS_LINK.label}
          </Link>
          {MAIN_NAV.map((item) => (
            <NavDropdown
              key={item.href}
              item={item}
              linkClass={linkClass}
              panelClass={panelClass}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Suspense fallback={null}>
            <SiteSearch light={isTransparent} />
          </Suspense>
          <Link
            href="/quote"
            className={`hidden text-sm font-medium transition-colors sm:inline ${linkClass}`}
          >
            Request a quote
          </Link>
          <CartButton light={isTransparent} />
          <Show when="signed-out">
            <Button
              variant="outline"
              size="sm"
              className={`transition-all ${isTransparent ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : ""}`}
              nativeButton={false}
              render={<Link href="/sign-in">Sign in</Link>}
            />
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <button
            type="button"
            className={`inline-flex size-9 items-center justify-center rounded-lg border lg:hidden ${
              isTransparent
                ? "border-white/20 text-white"
                : "border-border text-ink"
            }`}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          className={`border-t lg:hidden ${
            isTransparent
              ? "border-white/10 bg-ink/95 text-white"
              : "border-border bg-background"
          }`}
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            <Link
              href={ALL_PRODUCTS_LINK.href}
              className="border-b border-current/10 py-2.5 text-sm font-semibold"
            >
              {ALL_PRODUCTS_LINK.label}
            </Link>
            {MAIN_NAV.map((item) => (
              <div key={item.href} className="border-b border-current/10 py-2 last:border-0">
                <Link
                  href={item.href}
                  className="block py-1.5 text-sm font-semibold"
                >
                  {item.label}
                </Link>
                <div className="mt-1 flex flex-col pl-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.href + child.label}
                      href={child.href}
                      className="py-1.5 text-sm opacity-80 transition-opacity hover:opacity-100"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/quote"
              className="mt-2 py-2 text-sm font-medium sm:hidden"
            >
              Request a quote
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
