import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// Seed / CLI scripts prefer the direct (non-pooled) Neon URL.
const connectionString =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing catalog data (order matters for FKs)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const batteries = await prisma.category.create({
    data: {
      name: "Lithium Batteries",
      slug: "lithium-batteries",
    },
  });

  const panels = await prisma.category.create({
    data: {
      name: "Solar Panels",
      slug: "solar-panels",
    },
  });

  const motorcycles = await prisma.category.create({
    data: {
      name: "Electric Motorcycles",
      slug: "electric-motorcycles",
    },
  });

  const accessories = await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
    },
  });

  const inverters = await prisma.category.create({
    data: {
      name: "Inverters",
      slug: "inverters",
    },
  });

  await prisma.product.create({
    data: {
      name: "48V Lithium Solar Storage Pack",
      slug: "48v-lithium-solar-storage",
      description:
        "High-cycle LiFePO₄ pack for home solar storage and IPS backup. Deep discharge safe with built-in BMS.",
      categoryId: batteries.id,
      variants: {
        create: [
          {
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
    },
  });

  await prisma.product.create({
    data: {
      name: "60V E-Rickshaw Battery Pack",
      slug: "60v-e-rickshaw-battery",
      description:
        "Rugged lithium pack sized for Bangladesh e-rickshaw duty cycles — longer range, lighter than lead-acid.",
      categoryId: batteries.id,
      variants: {
        create: [
          {
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
    },
  });

  await prisma.product.create({
    data: {
      name: "Mono PERC Solar Panel",
      slug: "mono-perc-solar-panel",
      description:
        "High-efficiency monocrystalline panel for rooftop and commercial arrays. Strong low-light performance.",
      categoryId: panels.id,
      variants: {
        create: [
          {
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
    },
  });

  await prisma.product.create({
    data: {
      name: "Polycrystalline Solar Panel",
      slug: "poly-solar-panel",
      description:
        "Value-oriented polycrystalline modules for budget residential installs and rural electrification projects.",
      categoryId: panels.id,
      variants: {
        create: [
          {
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
    },
  });

  await prisma.product.create({
    data: {
      name: "Urban Commuter E-Scooter",
      slug: "urban-commuter-e-scooter",
      description:
        "Lightweight electric scooter built for city commutes — swappable battery, low running cost per km.",
      categoryId: motorcycles.id,
      variants: {
        create: [
          {
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
    },
  });

  await prisma.product.create({
    data: {
      name: "Long-Range Electric Motorcycle",
      slug: "long-range-electric-motorcycle",
      description:
        "Highway-capable electric motorcycle with the longest range in the lineup — built for delivery riders and daily long commutes.",
      categoryId: motorcycles.id,
      variants: {
        create: [
          {
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
    },
  });

  await prisma.product.create({
    data: {
      name: "MPPT Solar Charge Controller",
      slug: "mppt-solar-charge-controller",
      description:
        "High-efficiency MPPT controller for solar arrays — protects batteries from overcharge and optimizes panel output.",
      categoryId: accessories.id,
      variants: {
        create: [
          {
            sku: "ACC-MPPT-40A",
            price: 6500,
            stock: 30,
            attributes: {
              ratedCurrentA: 40,
              voltage: 12,
            },
          },
          {
            sku: "ACC-MPPT-60A",
            price: 8900,
            stock: 22,
            attributes: {
              ratedCurrentA: 60,
              voltage: 24,
            },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Pure Sine Wave Inverter",
      slug: "pure-sine-wave-inverter",
      description:
        "Clean, stable power for sensitive electronics — pairs with any lithium storage pack in the lineup.",
      categoryId: inverters.id,
      variants: {
        create: [
          {
            sku: "ACC-INV-1000W",
            price: 9800,
            stock: 18,
            attributes: {
              wattage: 1000,
              voltage: 12,
            },
          },
          {
            sku: "ACC-INV-2000W",
            price: 16500,
            stock: 12,
            attributes: {
              wattage: 2000,
              voltage: 24,
            },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "5kW On-Grid Solar Inverter",
      slug: "5kw-on-grid-solar-inverter",
      description:
        "High-efficiency grid-tied inverter for maximizing ROI on residential solar arrays.",
      categoryId: inverters.id,
      variants: {
        create: [
          {
            sku: "INV-ON-5KW",
            price: 55000,
            stock: 15,
            attributes: { wattage: 5000, type: "on-grid", efficiency: 98.2 },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "8kW Hybrid Solar Inverter",
      slug: "8kw-hybrid-solar-inverter",
      description:
        "Intelligent energy management for solar, battery, and grid power. Ensures uninterrupted power supply.",
      categoryId: inverters.id,
      variants: {
        create: [
          {
            sku: "INV-HYB-8KW",
            price: 95000,
            stock: 8,
            attributes: { wattage: 8000, type: "hybrid", efficiency: 97.6 },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "1kW Microinverter",
      slug: "1kw-microinverter",
      description:
        "Panel-level optimization to minimize shading losses and improve system reliability.",
      categoryId: inverters.id,
      variants: {
        create: [
          {
            sku: "INV-MIC-1KW",
            price: 22000,
            stock: 45,
            attributes: { wattage: 1000, type: "microinverter", efficiency: 96.5 },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "3kW Off-Grid Inverter",
      slug: "3kw-off-grid-inverter",
      description:
        "Robust off-grid solution for remote installations or complete energy independence.",
      categoryId: inverters.id,
      variants: {
        create: [
          {
            sku: "INV-OFF-3KW",
            price: 42000,
            stock: 12,
            attributes: { wattage: 3000, type: "off-grid", efficiency: 93.0 },
          },
        ],
      },
    },
  });

  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    variants: await prisma.productVariant.count(),
  };

  console.log("Seed complete:", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
