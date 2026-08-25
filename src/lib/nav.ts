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
        label: "Jinko Solar",
        href: "/shop/solar-panels?brand=jinko",
        children: [
          { label: "All Jinko panels", href: "/shop/solar-panels?brand=jinko" },
          { label: "Mono PERC", href: "/shop/solar-panels?brand=jinko&cellType=mono-perc" },
          { label: "N-Type TOPCon", href: "/shop/solar-panels?brand=jinko&cellType=topcon" },
          { label: "Bifacial modules", href: "/shop/solar-panels?brand=jinko&cellType=bifacial" },
        ],
      },
      {
        label: "Canadian Solar",
        href: "/shop/solar-panels?brand=canadian",
        children: [
          { label: "All Canadian panels", href: "/shop/solar-panels?brand=canadian" },
          { label: "HiKu series", href: "/shop/solar-panels?brand=canadian&series=hiku" },
          { label: "BiHiKu bifacial", href: "/shop/solar-panels?brand=canadian&series=bihiku" },
          { label: "Polycrystalline", href: "/shop/solar-panels?brand=canadian&cellType=poly" },
        ],
      },
      {
        label: "REC Group",
        href: "/shop/solar-panels?brand=rec",
        children: [
          { label: "All REC panels", href: "/shop/solar-panels?brand=rec" },
          { label: "REC Alpha series", href: "/shop/solar-panels?brand=rec&series=alpha" },
          { label: "REC TwinPeak", href: "/shop/solar-panels?brand=rec&series=twinpeak" },
          { label: "REC N-Peak", href: "/shop/solar-panels?brand=rec&series=npeak" },
        ],
      },
    ],
  },
  {
    label: "Batteries",
    href: "/shop/batteries",
    brands: [
      {
        label: "Akij",
        href: "/shop/batteries?brand=akij",
        badge: "Featured",
        children: [
          { label: "All Akij batteries", href: "/shop/batteries?brand=akij" },
          { label: "Lithium Batteries", href: "/shop/batteries?brand=akij&type=lithium" },
          { label: "Lead Acid Batteries", href: "/shop/batteries?brand=akij&type=lead-acid" },
        ],
      },
    ],
  },
  {
    label: "E bike",
    href: "/shop/electric-motorcycles",
    brands: [
      {
        label: "Yadea",
        href: "/shop/electric-motorcycles?brand=yadea",
        children: [
          { label: "All Yadea models", href: "/shop/electric-motorcycles?brand=yadea" },
          { label: "Urban scooters", href: "/products/urban-commuter-e-scooter" },
          { label: "Long-range bikes", href: "/shop/electric-motorcycles?brand=yadea&range=long" },
          { label: "Delivery series", href: "/shop/electric-motorcycles?brand=yadea&series=delivery" },
        ],
      },
      {
        label: "Hero Electric",
        href: "/shop/electric-motorcycles?brand=hero",
        children: [
          { label: "All Hero models", href: "/shop/electric-motorcycles?brand=hero" },
          { label: "Optima series", href: "/shop/electric-motorcycles?brand=hero&series=optima" },
          { label: "Atria LX", href: "/shop/electric-motorcycles?brand=hero&series=atria" },
          { label: "Nyx HX", href: "/shop/electric-motorcycles?brand=hero&series=nyx" },
        ],
      },
      {
        label: "Atomy",
        href: "/shop/electric-motorcycles?brand=atomy",
        children: [
          { label: "All Atomy models", href: "/shop/electric-motorcycles?brand=atomy" },
          { label: "Long-range motorcycle", href: "/products/long-range-electric-motorcycle" },
          { label: "E-bike battery packs", href: "/products/60v-e-rickshaw-battery" },
          { label: "High-speed series", href: "/shop/electric-motorcycles?brand=atomy&series=highspeed" },
        ],
      },
    ],
  },
  {
    label: "Inverter",
    href: "/shop/inverters",
    brands: [
      {
        label: "Huawei FusionSolar",
        href: "/shop/inverters?brand=huawei",
        children: [
          { label: "All Huawei inverters", href: "/shop/inverters?brand=huawei" },
          { label: "On-Grid SUN2000", href: "/shop/inverters?brand=huawei&type=on-grid" },
          { label: "Hybrid SUN2000-L1", href: "/shop/inverters?brand=huawei&type=hybrid" },
          { label: "Smart Dongle", href: "/shop/inverters?brand=huawei&type=accessories" },
        ],
      },
      {
        label: "SMA Solar",
        href: "/shop/inverters?brand=sma",
        children: [
          { label: "All SMA inverters", href: "/shop/inverters?brand=sma" },
          { label: "Sunny Boy on-grid", href: "/shop/inverters?brand=sma&type=on-grid" },
          { label: "Sunny Island off-grid", href: "/shop/inverters?brand=sma&type=off-grid" },
          { label: "Sunny Home Manager", href: "/shop/inverters?brand=sma&series=home-manager" },
        ],
      },
      {
        label: "Growatt",
        href: "/shop/inverters?brand=growatt",
        children: [
          { label: "All Growatt inverters", href: "/shop/inverters?brand=growatt" },
          { label: "Off-Grid SPF series", href: "/shop/inverters?brand=growatt&type=off-grid" },
          { label: "Hybrid SPH series", href: "/shop/inverters?brand=growatt&type=hybrid" },
          { label: "Microinverters", href: "/shop/inverters?brand=growatt&type=microinverter" },
        ],
      },
      {
        label: "Sungrow",
        href: "/shop/inverters?brand=sungrow",
        children: [
          { label: "All Sungrow inverters", href: "/shop/inverters?brand=sungrow" },
          { label: "On-Grid SG series", href: "/shop/inverters?brand=sungrow&type=on-grid" },
          { label: "Hybrid SH series", href: "/shop/inverters?brand=sungrow&type=hybrid" },
          { label: "3kW off-grid", href: "/shop/inverters?brand=sungrow&type=off-grid" },
        ],
      },
    ],
  },
];
