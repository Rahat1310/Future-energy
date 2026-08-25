/** Shared mock catalog when the DB is empty or unreachable. Matches prisma/seed.ts. */

export type MockCategory = {
  id: string;
  name: string;
  slug: string;
};

export type MockVariant = {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string | number>;
};

export type MockProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: MockCategory;
  variants: MockVariant[];
  /** Optional badge label shown on cards, e.g. "Featured" or "Sale" */
  badge?: string;
};

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: "mock-cat-panels", name: "Solar Panels", slug: "solar-panels" },
  {
    id: "mock-cat-batteries",
    name: "Batteries",
    slug: "batteries",
  },
  {
    id: "mock-cat-ebike",
    name: "Electric Motorcycles",
    slug: "electric-motorcycles",
  },
  { id: "mock-cat-accessories", name: "Accessories", slug: "accessories" },
  { id: "mock-cat-inverters", name: "Inverters", slug: "inverters" },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "mock-prod-storage",
    name: "Akij 48V Lithium Solar Storage Pack",
    slug: "akij-48v-lithium-solar-storage",
    description:
      "High-cycle LiFePO₄ pack for home solar storage and IPS backup. Deep discharge safe with built-in BMS.",
    badge: "Featured",
    category: {
      id: "mock-cat-batteries",
      name: "Batteries",
      slug: "batteries",
    },
    variants: [
      {
        id: "mock-var-bat-100",
        sku: "BAT-48V-100AH",
        price: 85000,
        stock: 12,
        attributes: {
          capacityAh: 100,
          voltage: 48,
          chemistry: "LiFePO4",
          cycleLife: 4000,
        },
      },
      {
        id: "mock-var-bat-200",
        sku: "BAT-48V-200AH",
        price: 155000,
        stock: 6,
        attributes: {
          capacityAh: 200,
          voltage: 48,
          chemistry: "LiFePO4",
          cycleLife: 4000,
        },
      },
    ],
  },
  {
    id: "mock-prod-rickshaw",
    name: "Akij 60V E-Rickshaw Battery Pack",
    slug: "akij-60v-e-rickshaw-battery",
    description:
      "Rugged lithium pack sized for Bangladesh e-rickshaw duty cycles — longer range, lighter than lead-acid.",
    category: {
      id: "mock-cat-batteries",
      name: "Batteries",
      slug: "batteries",
    },
    variants: [
      {
        id: "mock-var-rick-30",
        sku: "BAT-60V-30AH",
        price: 42000,
        stock: 20,
        attributes: {
          capacityAh: 30,
          voltage: 60,
          rangeKm: 70,
          chemistry: "LiFePO4",
        },
      },
      {
        id: "mock-var-rick-45",
        sku: "BAT-60V-45AH",
        price: 58000,
        stock: 10,
        attributes: {
          capacityAh: 45,
          voltage: 60,
          rangeKm: 100,
          chemistry: "LiFePO4",
        },
      },
    ],
  },
  {
    id: "mock-prod-lead-acid",
    name: "Akij 12V Tubular Lead Acid Battery",
    slug: "akij-12v-tubular-lead-acid",
    description:
      "Reliable deep cycle tubular lead acid battery. Ideal for home IPS and solar applications.",
    category: {
      id: "mock-cat-batteries",
      name: "Batteries",
      slug: "batteries",
    },
    variants: [
      {
        id: "mock-var-la-150",
        sku: "BAT-LA-12V-150AH",
        price: 18000,
        stock: 30,
        attributes: {
          capacityAh: 150,
          voltage: 12,
          chemistry: "Lead-Acid",
          type: "Tubular",
        },
      },
      {
        id: "mock-var-la-200",
        sku: "BAT-LA-12V-200AH",
        price: 24000,
        stock: 25,
        attributes: {
          capacityAh: 200,
          voltage: 12,
          chemistry: "Lead-Acid",
          type: "Tubular",
        },
      },
    ],
  },
  {
    id: "mock-prod-mono",
    name: "Mono PERC Solar Panel",
    slug: "mono-perc-solar-panel",
    description:
      "High-efficiency monocrystalline panel for rooftop and commercial arrays. Strong low-light performance.",
    category: {
      id: "mock-cat-panels",
      name: "Solar Panels",
      slug: "solar-panels",
    },
    variants: [
      {
        id: "mock-var-mono-450",
        sku: "PNL-MONO-450W",
        price: 12500,
        stock: 40,
        attributes: {
          wattage: 450,
          cellType: "mono-perc",
          efficiency: 21.2,
        },
      },
      {
        id: "mock-var-mono-550",
        sku: "PNL-MONO-550W",
        price: 14800,
        stock: 28,
        attributes: {
          wattage: 550,
          cellType: "mono-perc",
          efficiency: 21.8,
        },
      },
    ],
  },
  {
    id: "mock-prod-poly",
    name: "Polycrystalline Solar Panel",
    slug: "poly-solar-panel",
    description:
      "Value-oriented polycrystalline modules for budget residential installs and rural electrification projects.",
    category: {
      id: "mock-cat-panels",
      name: "Solar Panels",
      slug: "solar-panels",
    },
    variants: [
      {
        id: "mock-var-poly-330",
        sku: "PNL-POLY-330W",
        price: 8900,
        stock: 50,
        attributes: {
          wattage: 330,
          cellType: "poly",
          efficiency: 17.5,
        },
      },
      {
        id: "mock-var-poly-400",
        sku: "PNL-POLY-400W",
        price: 10500,
        stock: 35,
        attributes: {
          wattage: 400,
          cellType: "poly",
          efficiency: 18.1,
        },
      },
    ],
  },
  {
    id: "mock-prod-scooter",
    name: "Urban Commuter E-Scooter",
    slug: "urban-commuter-e-scooter",
    description:
      "Lightweight electric scooter built for city commutes — swappable battery, low running cost per km.",
    category: {
      id: "mock-cat-ebike",
      name: "Electric Motorcycles",
      slug: "electric-motorcycles",
    },
    variants: [
      {
        id: "mock-var-urban-60",
        sku: "EMC-URBAN-60KM",
        price: 145000,
        stock: 8,
        attributes: {
          rangeKm: 60,
          motorPowerW: 1200,
          topSpeedKmph: 45,
        },
      },
      {
        id: "mock-var-urban-80",
        sku: "EMC-URBAN-80KM",
        price: 168000,
        stock: 5,
        attributes: {
          rangeKm: 80,
          motorPowerW: 1500,
          topSpeedKmph: 50,
        },
      },
    ],
  },
  {
    id: "mock-prod-motorcycle",
    name: "Long-Range Electric Motorcycle",
    slug: "long-range-electric-motorcycle",
    description:
      "Highway-capable electric motorcycle with the longest range in the lineup — built for delivery riders and daily long commutes.",
    category: {
      id: "mock-cat-ebike",
      name: "Electric Motorcycles",
      slug: "electric-motorcycles",
    },
    variants: [
      {
        id: "mock-var-lr-120",
        sku: "EMC-LR-120KM",
        price: 285000,
        stock: 4,
        attributes: {
          rangeKm: 120,
          motorPowerW: 3000,
          topSpeedKmph: 75,
        },
      },
      {
        id: "mock-var-lr-150",
        sku: "EMC-LR-150KM",
        price: 320000,
        stock: 3,
        attributes: {
          rangeKm: 150,
          motorPowerW: 3500,
          topSpeedKmph: 80,
        },
      },
    ],
  },
  {
    id: "mock-prod-mppt",
    name: "MPPT Solar Charge Controller",
    slug: "mppt-solar-charge-controller",
    description:
      "High-efficiency MPPT controller for solar arrays — protects batteries from overcharge and optimizes panel output.",
    category: {
      id: "mock-cat-accessories",
      name: "Accessories",
      slug: "accessories",
    },
    variants: [
      {
        id: "mock-var-mppt-40",
        sku: "ACC-MPPT-40A",
        price: 6500,
        stock: 30,
        attributes: { ratedCurrentA: 40, voltage: 12 },
      },
      {
        id: "mock-var-mppt-60",
        sku: "ACC-MPPT-60A",
        price: 8900,
        stock: 22,
        attributes: { ratedCurrentA: 60, voltage: 24 },
      },
    ],
  },
  {
    id: "mock-prod-inverter",
    name: "Pure Sine Wave Inverter",
    slug: "pure-sine-wave-inverter",
    description:
      "Clean, stable power for sensitive electronics — pairs with any lithium storage pack in the lineup.",
    category: {
      id: "mock-cat-inverters",
      name: "Inverters",
      slug: "inverters",
    },
    variants: [
      {
        id: "mock-var-inv-1000",
        sku: "ACC-INV-1000W",
        price: 9800,
        stock: 18,
        attributes: { wattage: 1000, voltage: 12 },
      },
      {
        id: "mock-var-inv-2000",
        sku: "ACC-INV-2000W",
        price: 16500,
        stock: 12,
        attributes: { wattage: 2000, voltage: 24 },
      },
    ],
  },
  {
    id: "mock-prod-ongrid-inverter",
    name: "5kW On-Grid Solar Inverter",
    slug: "5kw-on-grid-solar-inverter",
    description:
      "High-efficiency grid-tied inverter for maximizing ROI on residential solar arrays.",
    category: {
      id: "mock-cat-inverters",
      name: "Inverters",
      slug: "inverters",
    },
    variants: [
      {
        id: "mock-var-ongrid-5kw",
        sku: "INV-ON-5KW",
        price: 55000,
        stock: 15,
        attributes: { wattage: 5000, type: "on-grid", efficiency: 98.2 },
      },
    ],
  },
  {
    id: "mock-prod-hybrid-inverter",
    name: "8kW Hybrid Solar Inverter",
    slug: "8kw-hybrid-solar-inverter",
    description:
      "Intelligent energy management for solar, battery, and grid power. Ensures uninterrupted power supply.",
    category: {
      id: "mock-cat-inverters",
      name: "Inverters",
      slug: "inverters",
    },
    variants: [
      {
        id: "mock-var-hybrid-8kw",
        sku: "INV-HYB-8KW",
        price: 95000,
        stock: 8,
        attributes: { wattage: 8000, type: "hybrid", efficiency: 97.6 },
      },
    ],
  },
  {
    id: "mock-prod-microinverter",
    name: "1kW Microinverter",
    slug: "1kw-microinverter",
    description:
      "Panel-level optimization to minimize shading losses and improve system reliability.",
    category: {
      id: "mock-cat-inverters",
      name: "Inverters",
      slug: "inverters",
    },
    variants: [
      {
        id: "mock-var-micro-1kw",
        sku: "INV-MIC-1KW",
        price: 22000,
        stock: 45,
        attributes: { wattage: 1000, type: "microinverter", efficiency: 96.5 },
      },
    ],
  },
  {
    id: "mock-prod-offgrid-inverter",
    name: "3kW Off-Grid Inverter",
    slug: "3kw-off-grid-inverter",
    description:
      "Robust off-grid solution for remote installations or complete energy independence.",
    category: {
      id: "mock-cat-inverters",
      name: "Inverters",
      slug: "inverters",
    },
    variants: [
      {
        id: "mock-var-offgrid-3kw",
        sku: "INV-OFF-3KW",
        price: 42000,
        stock: 12,
        attributes: { wattage: 3000, type: "off-grid", efficiency: 93.0 },
      },
    ],
  },
];

export function getMockProductBySlug(slug: string): MockProduct | null {
  return MOCK_PRODUCTS.find((product) => product.slug === slug) ?? null;
}

export function getMockFeaturedProducts() {
  return MOCK_PRODUCTS.map((product) => {
    const lowest = [...product.variants].sort((a, b) => a.price - b.price)[0];
    const attrs = lowest.attributes;
    let keySpec: string | null = null;
    if (typeof attrs.capacityAh === "number") keySpec = `${attrs.capacityAh}Ah`;
    else if (typeof attrs.rangeKm === "number")
      keySpec = `${attrs.rangeKm}km range`;
    else if (typeof attrs.wattage === "number") keySpec = `${attrs.wattage}W`;
    else if (typeof attrs.ratedCurrentA === "number")
      keySpec = `${attrs.ratedCurrentA}A`;

    // Mark the flagship Akij battery as "Featured"
    const badge =
      product.id === "mock-prod-storage" ? "Featured" : undefined;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      categorySlug: product.category.slug,
      price: lowest.price,
      keySpec,
      badge,
    };
  });
}
