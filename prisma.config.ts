import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Direct (non-pooled) URL for migrate / db push / introspect.
    // Runtime Prisma Client uses pooled DATABASE_URL via @prisma/adapter-neon.
    url: env("DIRECT_URL"),
  },
});
