import "dotenv/config";
import { db } from "./src/lib/db";
async function main() {
  try {
    const products = await db.product.findMany();
    console.log("DB count:", products.length);
  } catch(e) {
    console.error("DB error:", e);
  }
}
main();