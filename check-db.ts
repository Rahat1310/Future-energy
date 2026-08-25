import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client";
const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
async function main() {
  const count = await prisma.product.count();
  const cats = await prisma.category.findMany({ select: { name: true, slug: true } });
  console.log("Product count:", count);
  console.log("Categories:", JSON.stringify(cats));
  const first3 = await prisma.product.findMany({ take: 3, select: { name: true, slug: true } });
  console.log("First 3:", JSON.stringify(first3));
}
main().finally(() => prisma.$disconnect());