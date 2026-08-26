export type NavLink = {
  label: string;
  href: string;
};

export type NavBrand = {
  label: string;
  /** Href for "all products from this brand" page */
  href: string;
  children: NavLink[];
  /** Optional badge shown in the nav dropdown, e.g. "Featured" or "Sale" */
  badge?: string;
};

export type NavItem = {
  label: string;
  href: string;
  brands: NavBrand[];
};

/** Top-level link to the full catalog. */
export const ALL_PRODUCTS_LINK: NavLink = {
  label: "All products",
  href: "/shop",
};

/** Primary storefront nav — labels are shopper-facing; hrefs match seeded categories. */
export const MAIN_NAV: NavItem[] = [
  {
    label: "Solar panel",
    href: "/shop/solar-panels",
    brands: [
      {
        label: "DJDC",
        href: "/shop/solar-panels?brand=djdc",
        children: [
          { label: "All DJDC panels", href: "/shop/solar-panels?brand=djdc" },
          { label: "Mono PERC", href: "/shop/solar-panels?brand=djdc&cellType=mono-perc" },
          { label: "Polycrystalline", href: "/shop/solar-panels?brand=djdc&cellType=poly" },
        ],
      },
    ],
  },
  {
    label: "Batteries",
    href: "/shop/lithium-batteries",
    brands: [
      {
        label: "Akij",
        href: "/shop?category=lithium-batteries,motorcycle-batteries,easybike-batteries,lead-acid-batteries&brand=akij",
        badge: "Featured",
        children: [
          { label: "All Akij batteries", href: "/shop?category=lithium-batteries,motorcycle-batteries,easybike-batteries,lead-acid-batteries&brand=akij" },
          { label: "Lithium Batteries", href: "/shop/lithium-batteries?brand=akij" },
          { label: "Lead Acid Batteries", href: "/shop/lead-acid-batteries?brand=akij" },
        ],
      },
      {
        label: "DJDC",
        href: "/shop?category=lithium-batteries,motorcycle-batteries,easybike-batteries,ips-batteries,mounted-lithium-batteries&brand=djdc",
        children: [
          { label: "All DJDC batteries", href: "/shop?category=lithium-batteries,motorcycle-batteries,easybike-batteries,ips-batteries,mounted-lithium-batteries&brand=djdc" },
          { label: "IPS", href: "/shop/ips-batteries?brand=djdc" },
          { label: "Mounted Lithium", href: "/shop/mounted-lithium-batteries?brand=djdc" },
        ],
      },
    ],
  },
  {
    label: "E bike",
    href: "/shop/easybike-batteries",
    brands: [],
  },
  {
    label: "Inverter",
    href: "/shop/hybrid-inverters",
    brands: [
      {
        label: "DJDC",
        href: "/shop/hybrid-inverters?brand=djdc",
        children: [
          { label: "All DJDC inverters", href: "/shop/hybrid-inverters?brand=djdc" },
          { label: "Hybrid Inverters", href: "/shop/hybrid-inverters?brand=djdc&type=hybrid" },
        ],
      },
    ],
  },
];
