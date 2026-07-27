"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { AccountLinks } from "@/components/marketing/account-links";
import { CartButton } from "@/components/cart/cart-button";
import { SiteSearch } from "@/components/marketing/site-search";
import { Button } from "@/components/ui/button";
import { ALL_PRODUCTS_LINK, MAIN_NAV, type NavBrand, type NavItem } from "@/lib/nav";

/** Two-column mega-menu: left = brands, right = sub-items for hovered brand */
function MegaMenu({
  item,
  linkClass,
  panelClass,
}: {
  item: NavItem;
  linkClass: string;
  panelClass: string;
}) {
  const [activeBrand, setActiveBrand] = useState<NavBrand | null>(null);

  const isTransparentPanel = panelClass.includes("bg-ink");

  return (
    <div className="group relative" onMouseLeave={() => setActiveBrand(null)}>
      {/* Top-level nav link — always clickable */}
      <Link
        href={item.href}
        className={`inline-flex items-center gap-1 transition-colors ${linkClass}`}
      >
        {item.label}
        <ChevronDown className="size-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
      </Link>

      {/* Mega-menu panel */}
      <div
        className={`invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${
          activeBrand ? "w-[480px]" : "w-48"
        }`}
      >
        <div
          className={`flex overflow-hidden rounded-xl border shadow-xl ${
            isTransparentPanel
              ? "border-white/15 bg-ink/98 shadow-black/40"
              : "border-border bg-background shadow-black/10"
          }`}
        >
          {/* Left column — brand list */}
          <div
            className={`flex w-44 flex-shrink-0 flex-col border-r py-2 ${
              isTransparentPanel ? "border-white/10" : "border-border/60"
            }`}
          >
            <Link
              href={item.href}
              className={`mx-2 mb-1 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isTransparentPanel
                  ? "text-emerald-400 hover:bg-white/10"
                  : "text-brand hover:bg-muted"
              }`}
            >
              All {item.label}s →
            </Link>
            {item.brands.map((brand) => (
              <button
                key={brand.href}
                type="button"
                onMouseEnter={() => setActiveBrand(brand)}
                className={`mx-2 flex w-[calc(100%-1rem)] items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  activeBrand?.label === brand.label
                    ? isTransparentPanel
                      ? "bg-white/10 text-white"
                      : "bg-muted text-ink"
                    : isTransparentPanel
                      ? "text-white/75 hover:bg-white/8 hover:text-white"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-ink"
                }`}
              >
                {brand.label}
                <ChevronRight
                  className={`size-3.5 transition-opacity ${
                    activeBrand?.label === brand.label ? "opacity-60" : "opacity-20"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Right column — only shown when a brand is hovered */}
          {activeBrand && (
            <div className="flex flex-1 flex-col py-2">
              <Link
                href={activeBrand.href}
                className={`mx-2 mb-1 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isTransparentPanel
                    ? "text-emerald-400 hover:bg-white/10"
                    : "text-brand hover:bg-muted"
                }`}
              >
                All {activeBrand.label} →
              </Link>
              {activeBrand.children.map((child) => (
                <Link
                  key={child.href + child.label}
                  href={child.href}
                  className={`mx-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isTransparentPanel
                      ? "text-white/80 hover:bg-white/10 hover:text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-ink"
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(!isHome);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openBrand, setOpenBrand] = useState<string | null>(null);
  const isStaff =
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.role === "dealer";

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
    setOpenCategory(null);
    setOpenBrand(null);
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
    ? "border-white/15 bg-ink/95 text-white shadow-black/30"
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
            <MegaMenu
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
          {isSignedIn ? (
            <>
              <AccountLinks light={isTransparent} />
              <div className="sm:hidden">
                <Link
                  href="/orders"
                  className={`mr-2 text-sm font-medium ${isTransparent ? "text-white/80" : "text-muted-foreground"}`}
                >
                  Orders
                </Link>
                <UserButton />
              </div>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className={`transition-all ${isTransparent ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : ""}`}
              nativeButton={false}
              render={<Link href="/sign-in">Sign in</Link>}
            />
          )}
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

      {/* ── Mobile menu ── */}
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
              <div key={item.href} className="border-b border-current/10 last:border-0">
                {/* Category row */}
                <div className="flex items-center justify-between">
                  <Link href={item.href} className="py-2.5 text-sm font-semibold">
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    aria-label={`Toggle ${item.label} brands`}
                    onClick={() =>
                      setOpenCategory(openCategory === item.href ? null : item.href)
                    }
                    className="p-2 opacity-70"
                  >
                    <ChevronDown
                      className={`size-4 transition-transform ${
                        openCategory === item.href ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Brands */}
                {openCategory === item.href && (
                  <div className="mb-2 ml-2 flex flex-col gap-0.5">
                    {item.brands.map((brand) => (
                      <div key={brand.href}>
                        {/* Brand row */}
                        <div className="flex items-center justify-between">
                          <Link
                            href={brand.href}
                            className={`py-2 text-sm font-medium ${
                              isTransparent ? "text-white/80" : "text-muted-foreground"
                            }`}
                          >
                            {brand.label}
                          </Link>
                          <button
                            type="button"
                            aria-label={`Toggle ${brand.label} products`}
                            onClick={() =>
                              setOpenBrand(
                                openBrand === brand.href ? null : brand.href,
                              )
                            }
                            className="p-2 opacity-50"
                          >
                            <ChevronDown
                              className={`size-3.5 transition-transform ${
                                openBrand === brand.href ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Sub-items */}
                        {openBrand === brand.href && (
                          <div className="mb-1 ml-3 flex flex-col gap-0.5">
                            {brand.children.map((child) => (
                              <Link
                                key={child.href + child.label}
                                href={child.href}
                                className={`py-1.5 text-sm opacity-70 transition-opacity hover:opacity-100 ${
                                  isTransparent ? "text-white" : "text-ink"
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/quote"
              className="mt-2 py-2 text-sm font-medium sm:hidden"
            >
              Request a quote
            </Link>
            {isSignedIn ? (
              <>
                <Link href="/orders" className="py-2 text-sm font-medium">
                  My orders
                </Link>
                {isStaff ? (
                  <Link href="/admin" className="py-2 text-sm font-medium">
                    Admin panel
                  </Link>
                ) : null}
              </>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
