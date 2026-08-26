import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type Attrs = Record<string, string | number | boolean>;

/** Merge optional originalPrice into attributes JSON */
function attrs(base: Attrs, originalPrice?: number): Attrs {
  if (originalPrice != null) return { ...base, originalPrice };
  return base;
}

async function main() {
  // Clear existing catalog data (order matters for FKs)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // -- Categories --
  const catLithium = await prisma.category.create({ data: { name: "Lithium Batteries", slug: "lithium-batteries" } });
  const catInverter = await prisma.category.create({ data: { name: "Hybrid Inverters", slug: "hybrid-inverters" } });
  const catSolar = await prisma.category.create({ data: { name: "Solar Panels", slug: "solar-panels" } });
  const catEasyBike = await prisma.category.create({ data: { name: "EasyBike Batteries", slug: "easybike-batteries" } });
  const catLeadAcid = await prisma.category.create({ data: { name: "Lead Acid Batteries", slug: "lead-acid-batteries" } });
  const catIPS = await prisma.category.create({ data: { name: "IPS Batteries", slug: "ips-batteries" } });
  const catMounted = await prisma.category.create({ data: { name: "Mounted Lithium Batteries", slug: "mounted-lithium-batteries" } });
  const catMoto = await prisma.category.create({ data: { name: "Motorcycle Batteries", slug: "motorcycle-batteries" } });
  const catAcc = await prisma.category.create({ data: { name: "Accessories & Parts", slug: "accessories" } });

  // -- IPS BATTERIES (DJDC LiFePO4 for IPS backup) --
  type BattProduct = { slug: string; name: string; desc: string; variants: { sku: string; price: number; originalPrice?: number; stock: number; baseAttrs: Attrs }[] };
  const ipsProducts: BattProduct[] = [
    { slug:"bat-12v-7ah-lifepo4",     name:"DJDC 12V 7AH IPS LiFePO4 Battery",          desc:"LiFePO4 lithium battery for IPS/solar home backup. Capacity: 7AH. Voltage: 12V. Warranty: 5 Years & Recycle.",   variants:[{ sku:"BAT-12V-7AH",      price:3000,   stock:20, baseAttrs:{ voltage:12, capacityAh:7,   chemistry:"LiFePO4", brand:"djdc" } }] },
    { slug:"bat-12v-50ah-lifepo4",    name:"DJDC 12V 50AH IPS LiFePO4 Battery",         desc:"LiFePO4 lithium battery for IPS/solar home backup. Capacity: 50AH. Voltage: 12V.",                               variants:[{ sku:"BAT-12V-50AH",     price:17500,  originalPrice:21500, stock:15, baseAttrs:{ voltage:12, capacityAh:50,  chemistry:"LiFePO4", brand:"djdc" } }] },
    { slug:"bat-12v-100ah-wj-lifepo4",name:"DJDC 12V 100AH WJ IPS LiFePO4 Battery",     desc:"LiFePO4 lithium battery for IPS/solar home backup. Capacity: 100AH. Voltage: 12V.",                              variants:[{ sku:"BAT-12V-100AH-WJ", price:20800,  stock:10, baseAttrs:{ voltage:12, capacityAh:100, chemistry:"LiFePO4", variant:"WJ", brand:"djdc" } }] },
    { slug:"bat-12v-100ah-lifepo4",   name:"DJDC 12V 100AH IPS LiFePO4 Battery",        desc:"LiFePO4 lithium battery for IPS/solar home backup. Capacity: 100AH. Voltage: 12V.",                              variants:[{ sku:"BAT-12V-100AH",    price:28000,  originalPrice:32000, stock:12, baseAttrs:{ voltage:12, capacityAh:100, chemistry:"LiFePO4", brand:"djdc" } }] },
    { slug:"bat-12v-150ah-lifepo4",   name:"DJDC 12V 150AH IPS LiFePO4 Battery",        desc:"LiFePO4 lithium battery for IPS/solar home backup. Capacity: 150AH. Voltage: 12V.",                              variants:[{ sku:"BAT-12V-150AH",    price:39500,  originalPrice:45000, stock:8,  baseAttrs:{ voltage:12, capacityAh:150, chemistry:"LiFePO4", brand:"djdc" } }] },
    { slug:"bat-12v-200ah-wj-lifepo4",name:"DJDC 12V 200AH WJ IPS LiFePO4 Battery",     desc:"LiFePO4 lithium battery for IPS/solar home backup. Capacity: 200AH. Voltage: 12V.",                              variants:[{ sku:"BAT-12V-200AH-WJ", price:33800,  stock:8,  baseAttrs:{ voltage:12, capacityAh:200, chemistry:"LiFePO4", variant:"WJ", brand:"djdc" } }] },
    { slug:"bat-12v-200ah-lifepo4",   name:"DJDC 12V 200AH IPS LiFePO4 Battery",        desc:"LiFePO4 lithium battery for IPS/solar home backup. Capacity: 200AH. Voltage: 12V.",                              variants:[{ sku:"BAT-12V-200AH",    price:54000,  originalPrice:60000, stock:6,  baseAttrs:{ voltage:12, capacityAh:200, chemistry:"LiFePO4", brand:"djdc" } }] },
    { slug:"bat-24v-100ah-lifepo4",   name:"DJDC 24V 100AH IPS LiFePO4 Battery",        desc:"LiFePO4 lithium battery for IPS/solar home backup. Capacity: 100AH. Voltage: 24V.",                              variants:[{ sku:"BAT-24V-100AH",    price:52000,  stock:8,  baseAttrs:{ voltage:24, capacityAh:100, chemistry:"LiFePO4", brand:"djdc" } }] },
    { slug:"bat-24v-200ah-lifepo4",   name:"DJDC 24V 200AH IPS LiFePO4 Battery",        desc:"LiFePO4 lithium battery for IPS/solar home backup. Capacity: 200AH. Voltage: 24V.",                              variants:[{ sku:"BAT-24V-200AH",    price:110000, originalPrice:115000, stock:5, baseAttrs:{ voltage:24, capacityAh:200, chemistry:"LiFePO4", brand:"djdc" } }] },
  ];
  for (const p of ipsProducts) {
    await prisma.product.create({ data: { name:p.name, slug:p.slug, description:p.desc, categoryId:catIPS.id, variants:{ create:p.variants.map(v => ({ sku:v.sku, price:v.price, stock:v.stock, attributes:attrs(v.baseAttrs, v.originalPrice) })) } } });
  }

  // -- MOUNTED LITHIUM BATTERIES (Wall-Mounted LiFePO4) --
  const mountedProducts: BattProduct[] = [
    { slug:"bat-wm-24v-100ah",  name:"DJDC Wall-Mounted 24V 100AH LiFePO4 Battery",       desc:"Wall-mounted LiFePO4 lithium battery. Capacity: 100AH. Voltage: 24V.",                                             variants:[{ sku:"BAT-WM-24V-100AH", price:70000,  stock:6, baseAttrs:{ voltage:24, capacityAh:100, chemistry:"LiFePO4", type:"Wall-Mounted", brand:"djdc" } }] },
    { slug:"bat-wm-48v-100ah",  name:"DJDC Wall-Mounted 48V/51V 100AH LiFePO4 Battery",   desc:"Wall-mounted LiFePO4 lithium battery. Capacity: 100AH. Voltage: 48V/51V.",                                        variants:[{ sku:"BAT-WM-48V-100AH", price:130000, originalPrice:140000, stock:5, baseAttrs:{ capacityAh:100, chemistry:"LiFePO4", type:"Wall-Mounted", brand:"djdc" } }] },
    { slug:"bat-wm-48v-150ah",  name:"DJDC Wall-Mounted 51V 150AH PLUS LiFePO4 Battery",  desc:"Wall-mounted LiFePO4 PLUS lithium battery. Capacity: 150AH. Voltage: 51V.",                                       variants:[{ sku:"BAT-WM-51V-150AH", price:130000, originalPrice:135000, stock:5, baseAttrs:{ voltage:51, capacityAh:150, chemistry:"LiFePO4", type:"Wall-Mounted", brand:"djdc" } }] },
    { slug:"bat-wm-48v-200ah",  name:"DJDC Wall-Mounted 48V 200AH LiFePO4 Battery",       desc:"Wall-mounted LiFePO4 lithium battery. Capacity: 200AH. Voltage: 48V.",                                            variants:[{ sku:"BAT-WM-48V-200AH", price:185000, stock:4, baseAttrs:{ voltage:48, capacityAh:200, chemistry:"LiFePO4", type:"Wall-Mounted", brand:"djdc" } }] },
    { slug:"bat-wm-48v-330ah",  name:"DJDC Wall-Mounted 48V/51V 330AH LiFePO4 Battery",   desc:"Premium wall-mounted LiFePO4 lithium battery. Capacity: 330AH. Voltage: 48V/51V. Warranty: 5 Years & Recycle.", variants:[{ sku:"BAT-WM-48V-330AH", price:270000, originalPrice:305000, stock:3, baseAttrs:{ capacityAh:330, chemistry:"LiFePO4", type:"Wall-Mounted", brand:"djdc" } }] },
  ];
  for (const p of mountedProducts) {
    await prisma.product.create({ data: { name:p.name, slug:p.slug, description:p.desc, categoryId:catMounted.id, variants:{ create:p.variants.map(v => ({ sku:v.sku, price:v.price, stock:v.stock, attributes:attrs(v.baseAttrs, v.originalPrice) })) } } });
  }

  // -- LITHIUM BATTERIES (Akij brand) --
  const akijProducts: BattProduct[] = [
    { slug:"bat-akij-48v-90ah",  name:"Akij 48V 90AH Lithium Battery",  desc:"High-performance 48V 90 Ampere lithium battery from Akij.",  variants:[{ sku:"BAT-AKIJ-48V-90AH",  price:120000, stock:10, baseAttrs:{ voltage:48, capacityAh:90,  chemistry:"Lithium", brand:"akij" } }] },
    { slug:"bat-akij-48v-120ah", name:"Akij 48V 120AH Lithium Battery", desc:"High-performance 48V 120 Ampere lithium battery from Akij.", variants:[{ sku:"BAT-AKIJ-48V-120AH", price:145000, stock:10, baseAttrs:{ voltage:48, capacityAh:120, chemistry:"Lithium", brand:"akij" } }] },
  ];
  for (const p of akijProducts) {
    await prisma.product.create({ data: { name:p.name, slug:p.slug, description:p.desc, categoryId:catLithium.id, variants:{ create:p.variants.map(v => ({ sku:v.sku, price:v.price, stock:v.stock, attributes:attrs(v.baseAttrs, v.originalPrice) })) } } });
  }

  // -- HYBRID INVERTERS --
  type InverterProduct = {
    slug: string;
    name: string;
    desc: string;
    variants: { sku: string; price: number; originalPrice?: number; stock: number; baseAttrs: Attrs }[];
  };
  const inverterProducts: InverterProduct[] = [
    { slug:"inv-pv2000-12v-1.2kw", name:"DJDC PV 2000 Hybrid Solar Inverter (12V 1.2kW)", desc:"Hybrid solar inverter with MPPT charging. Output power: 1.2kW. Battery voltage: 12V.", variants:[{ sku:"INV-PV2000", price:23000, originalPrice:26000, stock:10, baseAttrs:{ wattage:1200, voltage:12, type:"Hybrid", brand:"djdc" } }] },
    { slug:"inv-pv2500-12v-1.8kw", name:"DJDC PV 2500 Hybrid Solar Inverter (12V 1.8kW)", desc:"Hybrid solar inverter with MPPT charging. Output power: 1.8kW. Battery voltage: 12V.", variants:[{ sku:"INV-PV2500", price:25000, originalPrice:28000, stock:10, baseAttrs:{ wattage:1800, voltage:12, type:"Hybrid", brand:"djdc" } }] },
    { slug:"inv-pv3000-24v-2.2kw", name:"DJDC PV 3000 Hybrid Solar Inverter (24V 2.2kW)", desc:"Hybrid solar inverter with MPPT charging. Output power: 2.2kW. Battery voltage: 24V.", variants:[{ sku:"INV-PV3000", price:28000, originalPrice:31000, stock:8, baseAttrs:{ wattage:2200, voltage:24, type:"Hybrid", brand:"djdc" } }] },
    { slug:"inv-pv5000-24v-4.2kw", name:"DJDC PV 5000 Hybrid Solar Inverter (24V 4.2kW)", desc:"Hybrid solar inverter with MPPT charging. Output power: 4.2kW. Battery voltage: 24V.", variants:[{ sku:"INV-PV5000", price:42000, originalPrice:45000, stock:6, baseAttrs:{ wattage:4200, voltage:24, type:"Hybrid", brand:"djdc" } }] },
    { slug:"inv-pv7000-48v-6.2kw", name:"DJDC PV 7000 Hybrid Solar Inverter (48V 6.2kW)", desc:"Hybrid solar inverter with MPPT charging. Output power: 6.2kW. Battery voltage: 48V.", variants:[{ sku:"INV-PV7000", price:60000, originalPrice:65000, stock:5, baseAttrs:{ wattage:6200, voltage:48, type:"Hybrid", brand:"djdc" } }] },
    { slug:"inv-pv9000-48v-8.2kw", name:"DJDC PV 9000 Hybrid Solar Inverter (48V 8.2kW)", desc:"Hybrid solar inverter with MPPT charging. Output power: 8.2kW. Battery voltage: 48V.", variants:[{ sku:"INV-PV9000", price:78000, stock:4, baseAttrs:{ wattage:8200, voltage:48, type:"Hybrid", brand:"djdc" } }] },
    { slug:"inv-pv12000-48v-11kw", name:"DJDC PV 12000 Hybrid Solar Inverter (48V 11kW - 12.2kW)", desc:"High-power hybrid solar inverter. Output power: 11kW-12.2kW. Battery voltage: 48V.", variants:[{ sku:"INV-PV12000", price:105000, originalPrice:114000, stock:3, baseAttrs:{ wattage:12200, voltage:48, type:"Hybrid", brand:"djdc" } }] },
  ];
  for (const p of inverterProducts) {
    await prisma.product.create({
      data: {
        name: p.name, slug: p.slug, description: p.desc, categoryId: catInverter.id,
        variants: { create: p.variants.map(v => ({ sku: v.sku, price: v.price, stock: v.stock, attributes: attrs(v.baseAttrs, v.originalPrice) })) },
      },
    });
  }

  // -- SOLAR PANELS --
  await prisma.product.create({ data: { name:"DJDC 590W Mono Solar Panel", slug:"solar-590w-single", description:"High-efficiency monocrystalline solar panel. Power: 590W. Priced at BDT 25 per watt. Estimated panel total: BDT 14,750. Warranty: 20 Years & Recycle.", categoryId: catSolar.id, variants: { create: [{ sku:"SOLAR-590W", price:25, stock:50, attributes:{ wattage:590, cellType:"mono", pricePerWatt:true, warranty:"20 Years & Recycle", brand:"djdc" } }] } } });
  await prisma.product.create({ data: { name:"DJDC 210W Solar Panel", slug:"solar-210w-single", description:"High-efficiency solar panel. Power: 210W. Priced at BDT 27 per watt. Estimated panel total: BDT 5,670. Warranty: 20 Years & Recycle.", categoryId: catSolar.id, variants: { create: [{ sku:"SOLAR-210W", price:27, stock:40, attributes:{ wattage:210, cellType:"mono", pricePerWatt:true, warranty:"20 Years & Recycle", brand:"djdc" } }] } } });
  await prisma.product.create({ data: { name:"DJDC 590W Solar Panel (8 pcs Pack)", slug:"solar-590w-8pcs-pack", description:"8-piece pack of DJDC 590W solar panels. Total power: 4720W. Warranty: 20 Years & Recycle.", categoryId: catSolar.id, variants: { create: [{ sku:"SOLAR-590W-8PCS", price:125000, stock:10, attributes:attrs({ wattage:4720, cellType:"mono", packSize:8, warranty:"20 Years & Recycle", brand:"djdc" }, 130000) }] } } });

  // -- EASYBIKE BATTERIES --
  await prisma.product.create({ data: { name:"DJDC 64V 160AH EasyBike Lithium Battery", slug:"eb-64v-160ah", description:"High-performance lithium battery for EasyBike and electric bikes. Voltage: 64V. Capacity: 160AH.", categoryId: catEasyBike.id, variants: { create: [{ sku:"EB-64V-160AH", price:170000, stock:6, attributes:attrs({ voltage:64, capacityAh:160, chemistry:"Lithium", brand:"djdc" }, 180000) }] } } });
  await prisma.product.create({ data: { name:"DJDC 64V 200AH EasyBike Lithium Battery", slug:"eb-64v-200ah", description:"High-performance lithium battery for EasyBike and electric bikes. Voltage: 64V. Capacity: 200AH.", categoryId: catEasyBike.id, variants: { create: [{ sku:"EB-64V-200AH", price:190000, stock:5, attributes:attrs({ voltage:64, capacityAh:200, chemistry:"Lithium", brand:"djdc" }, 195000) }] } } });

  // -- LEAD ACID BATTERIES --
  type LeadAcidProduct = { slug: string; name: string; price: number; originalPrice?: number; stock: number; baseAttrs: Attrs };
  const leadAcidProducts: LeadAcidProduct[] = [
    { slug:"acid-12v-200", name:"DJDC 12V 200 Model Acid Battery", price:16000, originalPrice:16500, stock:15, baseAttrs:{ voltage:12, capacityAh:200, chemistry:"Acid", brand:"djdc" } },
  ];
  for (const p of leadAcidProducts) {
    await prisma.product.create({ data: { name:p.name, slug:p.slug, description:`Deep-cycle lead acid battery. Voltage: ${(p.baseAttrs.voltage as number)}V. Capacity: ${p.baseAttrs.capacityAh}AH.`, categoryId:catLeadAcid.id, variants:{ create:[{ sku:p.slug.toUpperCase(), price:p.price, stock:p.stock, attributes:attrs(p.baseAttrs, p.originalPrice) }] } } });
  }

  // -- MOTORCYCLE BATTERIES (Removed for now) --
  // const motoProducts: MotoProduct[] = [];

  // -- ACCESSORIES --
  await prisma.product.create({ data: { name:"Solar Inverter Wi-Fi Monitoring Dongle", slug:"acc-wifi-dongle", description:"Wi-Fi plug dongle for remote solar inverter monitoring. Compatible with major hybrid inverter brands.", categoryId:catAcc.id, variants:{ create:[{ sku:"ACC-WIFI-DONGLE", price:2800, stock:30, attributes:attrs({ type:"Wi-Fi Dongle", compatibility:"Universal" }, 4500) }] } } });
  await prisma.product.create({ data: { name:"12V 6AH Smart Battery Charger", slug:"acc-12v-6ah-charger", description:"Smart battery charger for 12V batteries up to 6AH. Auto cut-off, multi-stage charging.", categoryId:catAcc.id, variants:{ create:[{ sku:"ACC-12V-6AH-CHG", price:1400, stock:25, attributes:attrs({ voltage:12, capacityAh:6, type:"Smart Charger" }, 1500) }] } } });

  console.log("Seeded 54 products across 8 categories.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());