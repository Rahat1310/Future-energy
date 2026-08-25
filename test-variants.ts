import "dotenv/config";
import { db } from "./src/lib/db";
async function main() {
  const products = await db.product.findMany({ include: { variants: true } });
  console.log("Products with variants:", products.filter(p => p.variants.length > 0).length);
}
main();