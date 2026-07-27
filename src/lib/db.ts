import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  db: PrismaClient | undefined;
};

/**
 * Neon serverless adapter over the *pooled* DATABASE_URL (PgBouncer / `-pooler`
 * host). Prisma CLI migrations use DIRECT_URL via prisma.config.ts instead —
 * migrate/push need a direct TCP connection, not the pooler.
 */
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.db ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}
