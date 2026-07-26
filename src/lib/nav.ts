export type NavLink = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  children: NavLink[];
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
    children: [
      { label: "All solar panels", href: "/shop/solar-panels" },
      { label: "Mono PERC", href: "/shop/solar-panels?cellType=mono-perc" },
      { label: "Polycrystalline", href: "/shop/solar-panels?cellType=poly" },
      {
        label: "Charge controllers",
        href: "/products/mppt-solar-charge-controller",
      },
      {
        label: "Inverters",
        href: "/products/pure-sine-wave-inverter",
      },
    ],
  },
  {
    label: "Batteries",
    href: "/shop/lithium-batteries",
    children: [
      { label: "All batteries", href: "/shop/lithium-batteries" },
      {
        label: "Solar storage",
        href: "/products/48v-lithium-solar-storage",
      },
      {
        label: "E-rickshaw packs",
        href: "/products/60v-e-rickshaw-battery",
      },
      { label: "48V systems", href: "/shop/lithium-batteries?voltage=48-48" },
      { label: "60V systems", href: "/shop/lithium-batteries?voltage=60-60" },
    ],
  },
  {
    label: "E bike",
    href: "/shop/electric-motorcycles",
    children: [
      { label: "All e-bikes", href: "/shop/electric-motorcycles" },
      {
        label: "Urban scooters",
        href: "/products/urban-commuter-e-scooter",
      },
      {
        label: "Long-range motorcycles",
        href: "/products/long-range-electric-motorcycle",
      },
      {
        label: "E-bike battery packs",
        href: "/products/60v-e-rickshaw-battery",
      },
    ],
  },
];
