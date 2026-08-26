export interface Product {
  id: string;
  category:
    | 'Lithium Battery'
    | 'Hybrid Inverter'
    | 'Solar Panel'
    | 'Lead Acid Battery'
    | 'EasyBike Lithium Battery'
    | 'IPS Battery'
    | 'Mounted Lithium Battery'
    | 'Motorcycle Battery'
    | 'Accessories & Parts';
  title: string;
  model: string;
  voltage?: string;
  capacity?: string;
  power?: string;
  retailPriceBDT: number;
  originalPriceBDT?: number;
  warranty?: string;
  /** Present on per-watt solar panels, e.g. "/ Watt" */
  unit?: string;
}

export const products: Product[] = [
  // --- LITHIUM BATTERIES (IPS & Wall-Mounted) ---
  { id:"bat-12v-7ah-lifepo4", category:"Lithium Battery", title:"12V 7AH IPS LiFePO4 Battery", model:"12V 7AH", voltage:"12V", capacity:"7AH", retailPriceBDT:3000, warranty:"5 Years & Recycle" },
  { id:"bat-12v-50ah-lifepo4", category:"Lithium Battery", title:"12V 50AH IPS LiFePO4 Battery", model:"12V 50AH", voltage:"12V", capacity:"50AH", retailPriceBDT:17500, originalPriceBDT:21500, warranty:"5 Years & Recycle" },
  { id:"bat-12v-100ah-wj-lifepo4", category:"Lithium Battery", title:"12V 100AH WJ IPS LiFePO4 Battery", model:"12V 100AH WJ", voltage:"12V", capacity:"100AH", retailPriceBDT:20800, warranty:"5 Years & Recycle" },
  { id:"bat-12v-100ah-lifepo4", category:"Lithium Battery", title:"12V 100AH IPS LiFePO4 Battery", model:"12V 100AH", voltage:"12V", capacity:"100AH", retailPriceBDT:28000, originalPriceBDT:32000, warranty:"5 Years & Recycle" },
  { id:"bat-12v-150ah-lifepo4", category:"Lithium Battery", title:"12V 150AH IPS LiFePO4 Battery", model:"12V 150AH", voltage:"12V", capacity:"150AH", retailPriceBDT:39500, originalPriceBDT:45000, warranty:"5 Years & Recycle" },
  { id:"bat-12v-200ah-wj-lifepo4", category:"Lithium Battery", title:"12V 200AH WJ IPS LiFePO4 Battery", model:"12V 200AH WJ", voltage:"12V", capacity:"200AH", retailPriceBDT:33800, warranty:"5 Years & Recycle" },
  { id:"bat-12v-200ah-lifepo4", category:"Lithium Battery", title:"12V 200AH IPS LiFePO4 Battery", model:"12V 200AH", voltage:"12V", capacity:"200AH", retailPriceBDT:54000, originalPriceBDT:60000, warranty:"5 Years & Recycle" },
  { id:"bat-24v-100ah-lifepo4", category:"Lithium Battery", title:"24V 100AH IPS LiFePO4 Battery", model:"24V 100AH", voltage:"24V", capacity:"100AH", retailPriceBDT:52000, warranty:"5 Years & Recycle" },
  { id:"bat-24v-200ah-lifepo4", category:"Lithium Battery", title:"24V 200AH IPS LiFePO4 Battery", model:"24V 200AH", voltage:"24V", capacity:"200AH", retailPriceBDT:110000, originalPriceBDT:115000, warranty:"5 Years & Recycle" },
  { id:"bat-wm-24v-100ah", category:"Lithium Battery", title:"Wall-Mounted 24V 100AH LiFePO4 Battery", model:"WM-24V 100AH", voltage:"24V", capacity:"100AH", retailPriceBDT:70000, warranty:"5 Years & Recycle" },
  { id:"bat-wm-48v-100ah", category:"Lithium Battery", title:"Wall-Mounted 48V/51V 100AH LiFePO4 Battery", model:"WM-48V 100AH / 51V 100AH", voltage:"48V / 51V", capacity:"100AH", retailPriceBDT:130000, originalPriceBDT:140000, warranty:"5 Years & Recycle" },
  { id:"bat-wm-48v-150ah", category:"Lithium Battery", title:"Wall-Mounted 51V 150AH PLUS LiFePO4 Battery", model:"51V 150AH PLUS", voltage:"51V", capacity:"150AH", retailPriceBDT:130000, originalPriceBDT:135000, warranty:"5 Years & Recycle" },
  { id:"bat-wm-48v-200ah", category:"Lithium Battery", title:"Wall-Mounted 48V 200AH LiFePO4 Battery", model:"WM-48V 200AH", voltage:"48V", capacity:"200AH", retailPriceBDT:185000, warranty:"5 Years & Recycle" },
  { id:"bat-wm-48v-330ah", category:"Lithium Battery", title:"Wall-Mounted 48V/51V 330AH LiFePO4 Battery", model:"WM-48V 330AH / 51V 330AH", voltage:"48V / 51V", capacity:"330AH", retailPriceBDT:270000, originalPriceBDT:305000, warranty:"5 Years & Recycle" },

  // --- HYBRID INVERTERS ---
  { id:"inv-pv2000-12v-1.2kw", category:"Hybrid Inverter", title:"PV 2000 Hybrid Solar Inverter (12V 1.2kW)", model:"PV 2000", voltage:"12V", power:"1.2kW", retailPriceBDT:23000, originalPriceBDT:26000, warranty:"2 Years & Recycle" },
  { id:"inv-pv2500-12v-1.8kw", category:"Hybrid Inverter", title:"PV 2500 Hybrid Solar Inverter (12V 1.8kW)", model:"PV 2500", voltage:"12V", power:"1.8kW", retailPriceBDT:25000, originalPriceBDT:28000, warranty:"2 Years & Recycle" },
  { id:"inv-pv3000-24v-2.2kw", category:"Hybrid Inverter", title:"PV 3000 Hybrid Solar Inverter (24V 2.2kW)", model:"PV 3000", voltage:"24V", power:"2.2kW", retailPriceBDT:28000, originalPriceBDT:31000, warranty:"2 Years & Recycle" },
  { id:"inv-pv5000-24v-4.2kw", category:"Hybrid Inverter", title:"PV 5000 Hybrid Solar Inverter (24V 4.2kW)", model:"PV 5000", voltage:"24V", power:"4.2kW", retailPriceBDT:42000, originalPriceBDT:45000, warranty:"2 Years & Recycle" },
  { id:"inv-pv7000-48v-6.2kw", category:"Hybrid Inverter", title:"PV 7000 Hybrid Solar Inverter (48V 6.2kW)", model:"PV 7000", voltage:"48V", power:"6.2kW", retailPriceBDT:60000, originalPriceBDT:65000, warranty:"2 Years & Recycle" },
  { id:"inv-pv9000-48v-8.2kw", category:"Hybrid Inverter", title:"PV 9000 Hybrid Solar Inverter (48V 8.2kW)", model:"PV 9000", voltage:"48V", power:"8.2kW", retailPriceBDT:78000, warranty:"2 Years & Recycle" },
  { id:"inv-pv12000-48v-11kw", category:"Hybrid Inverter", title:"PV 12000 Hybrid Solar Inverter (48V 11kW - 12.2kW)", model:"PV 12000", voltage:"48V", power:"11kW - 12.2kW", retailPriceBDT:105000, originalPriceBDT:114000, warranty:"2 Years & Recycle" },

  // --- SOLAR PANELS ---
  { id:"solar-590w-single", category:"Solar Panel", title:"Dongjin 590W Mono Solar Panel", model:"590W Solar Panel", power:"590W", retailPriceBDT:25, unit:"/ Watt", warranty:"20 Years & Recycle" },
  { id:"solar-210w-single", category:"Solar Panel", title:"Dongjin 210W Solar Panel", model:"210W Solar Panel", power:"210W", retailPriceBDT:27, unit:"/ Watt", warranty:"20 Years & Recycle" },
  { id:"solar-590w-8pcs-pack", category:"Solar Panel", title:"Dongjin 590W Solar Panel (8 pcs Pack)", model:"590W 8 pcs", power:"4720W Total", retailPriceBDT:125000, originalPriceBDT:130000, warranty:"20 Years & Recycle" },

  // --- EASYBIKE LITHIUM BATTERIES ---
  { id:"eb-64v-160ah", category:"EasyBike Lithium Battery", title:"64V 160AH EasyBike Lithium Battery", model:"64V 160AH", voltage:"64V", capacity:"160AH", retailPriceBDT:170000, originalPriceBDT:180000 },
  { id:"eb-64v-200ah", category:"EasyBike Lithium Battery", title:"64V 200AH EasyBike Lithium Battery", model:"64V 200AH", voltage:"64V", capacity:"200AH", retailPriceBDT:190000, originalPriceBDT:195000 },

  // --- LEAD ACID BATTERIES ---
  { id:"acid-12v-200", category:"Lead Acid Battery", title:"12V 200 Model Lead Acid Battery", model:"12V 200", voltage:"12V", capacity:"200AH", retailPriceBDT:16000, originalPriceBDT:16500 },

  // --- MOTORCYCLE BATTERIES ---
  { id:"moto-12v-2.5l", category:"Motorcycle Battery", title:"12V 2.5L Motorcycle Battery", model:"12V 2.5L", voltage:"12V", retailPriceBDT:900, originalPriceBDT:950 },
  { id:"moto-12v-4l", category:"Motorcycle Battery", title:"12V 4L Motorcycle Battery", model:"12V 4L", voltage:"12V", retailPriceBDT:1300, originalPriceBDT:1400 },
  { id:"moto-12v-5a", category:"Motorcycle Battery", title:"12V 5A Motorcycle Battery", model:"12V 5A", voltage:"12V", retailPriceBDT:1300, originalPriceBDT:1400 },
  { id:"moto-12v-5l", category:"Motorcycle Battery", title:"12V 5L Motorcycle Battery", model:"12V 5L", voltage:"12V", retailPriceBDT:1200 },
  { id:"moto-12v-6.5l", category:"Motorcycle Battery", title:"12V 6.5L Motorcycle Battery", model:"12V 6.5L", voltage:"12V", retailPriceBDT:1300, originalPriceBDT:1400 },
  { id:"moto-12v-7b", category:"Motorcycle Battery", title:"12V 7B Motorcycle Battery", model:"12V 7B", voltage:"12V", retailPriceBDT:1500, originalPriceBDT:1600 },
  { id:"moto-12v-9a", category:"Motorcycle Battery", title:"12V 9A Motorcycle Battery", model:"12V 9A", voltage:"12V", retailPriceBDT:1700, originalPriceBDT:1800 },

  // --- ACCESSORIES & PARTS ---
  { id:"acc-wifi-dongle", category:"Accessories & Parts", title:"Solar Inverter Wi-Fi Monitoring Dongle", model:"Wi-Fi Plug Dongle", retailPriceBDT:2800, originalPriceBDT:4500 },
  { id:"acc-12v-6ah-charger", category:"Accessories & Parts", title:"12V 6AH Smart Battery Charger", model:"12V 6AH Charger", retailPriceBDT:1400, originalPriceBDT:1500 },
];

// --- Category helpers ----------------------------------------------------------

export const CATEGORY_SLUG_MAP: Record<Product['category'], string> = {
  'Lithium Battery': 'lithium-batteries',
  'Hybrid Inverter': 'hybrid-inverters',
  'Solar Panel': 'solar-panels',
  'EasyBike Lithium Battery': 'easybike-batteries',
  'Lead Acid Battery': 'lead-acid-batteries',
  'IPS Battery': 'ips-batteries',
  'Mounted Lithium Battery': 'mounted-lithium-batteries',
  'Motorcycle Battery': 'motorcycle-batteries',
  'Accessories & Parts': 'accessories',
};

export const SLUG_TO_CATEGORY_NAME: Record<string, string> = {
  'lithium-batteries': 'Lithium Batteries',
  'hybrid-inverters': 'Hybrid Inverters',
  'solar-panels': 'Solar Panels',
  'easybike-batteries': 'EasyBike Batteries',
  'lead-acid-batteries': 'Lead Acid Batteries',
  'ips-batteries': 'IPS Batteries',
  'mounted-lithium-batteries': 'Mounted Lithium Batteries',
  'motorcycle-batteries': 'Motorcycle Batteries',
  'accessories': 'Accessories & Parts',
};

export function formatBDT(amount: number, unit?: string): string {
  const formatted = `?${amount.toLocaleString('en-US')}`;
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * For per-watt solar panels, derive the estimated panel total.
 * e.g. 590W @ ?25/W = ?14,750
 */
export function getSolarPanelTotal(product: Product): number | null {
  if (product.unit !== '/ Watt' || !product.power) return null;
  const wattMatch = product.power.match(/^(\d+)W$/);
  if (!wattMatch) return null;
  const watts = parseInt(wattMatch[1], 10);
  return watts * product.retailPriceBDT;
}

/** Discount percentage, rounded to nearest integer */
export function discountPercent(product: Product): number | null {
  if (!product.originalPriceBDT) return null;
  return Math.round(
    ((product.originalPriceBDT - product.retailPriceBDT) / product.originalPriceBDT) * 100,
  );
}
